// * /////////////////////////////////////////////////////////////////////// Core
import {  ref                 } from "vue"
// * /////////////////////////////////////////////////////////////////////// Store
import {  storeToRefs         } from 'pinia'                                            
import {  useStoreUser        } from 'src/stores/user'
import {  useStoreAcuerdo     } from 'src/stores/acuerdo'
// * /////////////////////////////////////////////////////////////////////// Componibles
import {  sortArray           } from "src/useSimpleOk/useTools"
import {  getURL,
          getFormData         } from "src/services/APIMaco"        
import {  useFetch            } from "src/useSimpleOk/useFetch"
import {  getDateToStr,
          mayusculasPrimeraLetra  
                              } from "src/useSimpleOk/useTools"

// * /////////////////////////////////////////////////////////////////////// Modelos
import {  IQuery              } from "src/models/Busqueda"  
import {  Periodo,
          PERIODO,
          IApexSerie          } from "src/models/TiposInformes"  
import {  SerieAcu, ISerieAcu } from "src/areas/acuerdos/models/SerieAcuerdo"
import {  EstadosAcuerdos     } from "src/areas/acuerdos/models/ConstantesAcuerdos"

export function useControlInformes()
{
  const { miFetch               } = useFetch()  

  async function getInforme(
    tipo  : "totales" | "estados",
    query : IQuery,
  ) : Promise< ISerieAcu[] >
  {
    query.periodo           = query?.periodo ?? PERIODO.MES
    const url               = getURL("listas", "informes")
    const objetoForData     = { body: getFormData( tipo, query ), method: "POST" }
    const { data  }         = await miFetch(url, objetoForData, { mensaje: "Cargar informe" })
    console.log("data: ", data);
    return await SerieAcu.getSerieFromApi( data, query.periodo )
  }


  async function generarSeriesEstados( query : IQuery, comercial : string ) : Promise< void >
  {
    const seriesCrudas            = await getInforme( "estados", query )

/*
    const seriesComercial         = seriesCrudas.filter( s => s.comercial === comercial )
    const listaEstados            = [ ...new Set(seriesComercial.map((s) => s.estado)) ]
    estadosCtzSerie.value         = getSerie("total", seriesComercial, listaEstados, "estado")
    estadosCtzSerie.value.forEach( s => { if( s.name !== "Total" ) s.color = EstadosAcuerdos.estadoStrCtzToColor(s.name) })
*/

    //comerciales.value             = [ ...new Set(seriesCrudas.map((s) => s.comercial)) ]
    //estadosCtz.value              = getSerie("cuentaCtz", seriesCrudas)
  }

  interface ISeries {
    cuenta: IApexSerie[]
    total:  IApexSerie[]
  }

  type TipoGrafico        = "area" | "bar" | "line"

  async function getSeriesTotales( query : IQuery, tipoGrafico : TipoGrafico ) : Promise< ISeries >
  {
    const seriesCrudas    = await getInforme("totales", query)            
    console.log("seriesCrudas: ", seriesCrudas);
    const comerciales     = [ ...new Set(seriesCrudas.map((s) => s.comercial.nombre)) ]
    const cuenta          = getSerie("cuenta",  seriesCrudas, comerciales, "nombre", tipoGrafico )
    const total           = getSerie("total",   seriesCrudas, comerciales, "nombre", tipoGrafico )

    const cosa = getCategorias( cuenta, query.periodo )
    
    return { cuenta, total }
  }


  function getCategorias( series : IApexSerie[], periodo : Periodo ) : string[]
  {
    const cats : string[] = []

    if( series[0].data.length == 0) return []

    for (const serie of series[0].data )
    {
      let fechaStr          = ""
      let cat               = ""
      if( typeof serie.x == "string" )
        fechaStr            = serie.x
      const fecha           = getDateToStr( fechaStr, "UTC" )      
      const añoCorto        = new Intl.DateTimeFormat('es', { year: '2-digit' }).format(fecha);      

      if(periodo            === PERIODO.AÑO ){
        cat                 = fecha.getFullYear().toString()
      }
      else  if(periodo      === PERIODO.TRIMESTRE )
      {
        const trimestre     = Math.floor((fecha.getMonth() / 3)) + 1;
        cat                 = `${añoCorto}-T${trimestre}`
      }
      else  if(periodo      === PERIODO.MES || periodo === PERIODO.SEMANA )
      {
        let mesCorto        = new Intl.DateTimeFormat('es', { month: 'short' }).formatToParts( fecha )[0].value        
        mesCorto            = mayusculasPrimeraLetra( mesCorto )
        cat                 = `${añoCorto}-${mesCorto}`
        if(periodo          === PERIODO.SEMANA)
        {
          const nWeek       = new Intl.DateTimeFormat('es', { weekday: 'long' }).format(fecha);

          const firstDiaMes = new Date( fecha.getFullYear(), fecha.getMonth(), 1);
          console.log("firstDiaMes: ", firstDiaMes);
          const diff        = (fecha.getDay() - firstDiaMes.getDay() + 7) % 7;
          const numSemana   = Math.ceil((fecha.getDate() + diff) / 7)
          cat               += "-" + numSemana.toString()
          console.log("cat: ", serie.x, cat);
        }
      }
      cats.push( cat )
    }

    //console.log("cats: ", cats);
    return cats
  }

  type KeysSeries         = "cuenta" | "total"  
  function getSerie
  (
    key           : KeysSeries,
    seriesCrudas  : ISerieAcu[],
    keyAgrupar    : string[],
    keyLabel      : "nombre" | "estado",
    tipoGrafico   : TipoGrafico
  )               : IApexSerie[]
  {
    const seriesMapeada           = getSerieMapeada()//.filter((i)=>i.name !== "Total")
    const seriesSincronizadas     = sincronizarSeries( seriesMapeada )
    seriesSincronizadas.push( sumarSeries( seriesSincronizadas ) )

    return seriesSincronizadas.reverse()

    function getSerieMapeada() : IApexSerie[]
    {
      return keyAgrupar.map( mapApexSerie )
    }

    function sumarSeries( listaSeries : IApexSerie[] ) : IApexSerie
    {
      const serieTotal : IApexSerie = {
        name:     "Total",
        type:     "line",
        stacked:  false,
        data:     [],
        maximo:   -1,
        color:    "#B4B4B4"
      }

      
      for (const index in listaSeries[0].data)
      {
        let suma = 0
        for (const serie of listaSeries)
        {
          suma += serie.data[index].y ?? 0            
          if(serieTotal.maximo !== undefined && serieTotal.maximo < suma)
            serieTotal.maximo  = suma
        }

        serieTotal.data.push({ x: listaSeries[0].data[index].x, y: suma })
      }

      return serieTotal
    }



    function sincronizarSeries( listaSeries : IApexSerie[] ) : IApexSerie[]
    {
      const fechasString          = [ ...new Set(seriesCrudas.map((s) => s.fechaCorta)) ].sort()
      //const fechas                = fechasString.map( f => new Date( f ) )
      for (const fecha of fechasString)
      {
        for (const serieApex of listaSeries )
        {
          const existe            = serieApex.data.some( data => data.x === fecha)
          if(!existe)
          {
            serieApex.data.push( { x: fecha, y: null })
            serieApex.data        = sortArray(serieApex.data, "x", "<")
          }
        }
      }

      return listaSeries
    }
    
    function mapApexSerie( label : string ) : IApexSerie 
    {
      let color  = ""
      const data =
      [
        ...seriesCrudas
          .filter ( ( s ) => s[keyLabel] === label)
          .map    ( ( s ) =>
          {
            color = s.color
            return {
              x:  s.fechaCorta,
              y:  s[key],
            }
          })
      ]
      const serie : IApexSerie = {
        name:     label,
        cosa:     "asdf",
        type:     tipoGrafico,  //nombre === "Total" ? "area" : "bar", line
        stacked:  true,   //nombre !== "Total",
        color,
        data,
      }

      return serie
    }
    //function ordenarPorLength( a : IApexSerie, b : IApexSerie ) : number{
    //  return b.data.length - a.data.length }      
  }  

  return {
    getSeriesTotales,    
  }
}