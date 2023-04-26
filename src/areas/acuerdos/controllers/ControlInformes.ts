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
    cuenta      : IApexSerie[]
    total       : IApexSerie[]
    categorias  : string[]
  }

  type TipoGrafico        = "area" | "bar" | "line"

  async function getSeriesTotales( query : IQuery, tipoGrafico : TipoGrafico ) : Promise< ISeries >
  {
    const seriesCrudas    = await getInforme("totales", query)            
    if(!seriesCrudas.length)
      return { cuenta: [], total: [], categorias: [] }
    const comerciales     = [ ...new Set(seriesCrudas.map((s) => s.comercial.nombre)) ]
    const cuenta          = getSerie("cuenta",  seriesCrudas, comerciales, "nombre", query.periodo, tipoGrafico )
    const total           = getSerie("total",   seriesCrudas, comerciales, "nombre", query.periodo, tipoGrafico )
    const categorias      = getCategorias( cuenta, query.periodo )
    
    return { cuenta, total, categorias }
  }


  type KeysSeries         = "cuenta" | "total"  
  function getSerie
  (
    key           : KeysSeries,
    seriesCrudas  : ISerieAcu[],
    usuarios      : string[],
    keyLabel      : "nombre" | "estado",
    periodo       : Periodo,
    tipoGrafico   : TipoGrafico,
  )               : IApexSerie[]
  {
    const seriesMapeada           = getSerieMapeada()
    const seriesSincronizadas     = sincronizarSeries( seriesMapeada )
    seriesSincronizadas.push( sumarSeries( seriesSincronizadas ) )

    return seriesSincronizadas.reverse()


    function sumarSeries( listaSeries : IApexSerie[] ) : IApexSerie
    {
      const serieTotal : IApexSerie = {
        name:     "Total",
        type:     "line",
        stacked:  false,
        data:     [],
        maximo:   -1,
        color:    "#000"
      }

      
      for (const index in listaSeries[0].data)
      {
        let suma    = 0
        let fecha   = ""
        for (const serie of listaSeries)
        {
          suma      += serie.data[index].y ?? 0            
          if(serieTotal.maximo !== undefined && serieTotal.maximo < suma)
            serieTotal.maximo   = suma
          
          if(!!serie.data[index].fecha)
            fecha               = serie.data[index].fecha
        }

        serieTotal.data.push( { x:      listaSeries[0].data[index].x,
                                y:      suma,
                                fecha:  fecha
                              })
      }

      return serieTotal
    }



    function sincronizarSeries( listaSeries : IApexSerie[] ) : IApexSerie[]
    {
      const fechasString          = [ ...new Set( seriesCrudas.map((s) => s.xSerie) ) ].sort()
      for (const fecha of fechasString)
      {
        for (const serieApex of listaSeries )
        {
          const existe            = serieApex.data.some( data => data.x === fecha)
          if(!existe)
          {
            serieApex.data.push( { x: fecha, y: null, fecha: "" })
            serieApex.data        = sortArray(serieApex.data, "x", "<")
          }
        }
      }

      return listaSeries
    }
    

    
    
    function getSerieMapeada() : IApexSerie[] { return usuarios.map( mapApexSerie ) }
    function mapApexSerie( user : string ) : IApexSerie
    {
      let color  = ""
      const data =
      [
        ...seriesCrudas
          .filter ( ( s ) => s[ keyLabel ] === user)
          .map    ( ( s ) =>
          {
            color = s.color
            return {
              x:      s.xSerie,
              y:      s[key],
              fecha:  s.fechaCorta
            }
          })
      ]
      const serie : IApexSerie = {
        name:     user,
        color,
        data,
      }

      return serie
    } 
  }  


  
  function getCategorias( series : IApexSerie[], periodo : Periodo ) : string[]
  {
    const cats : string[] = []

    if( series[0].data.length == 0) return []

    for (const serie of series[0].data )
    {
      let cat               = ""
      let fechaStr          = ""
      if( typeof serie.x == "string" )
        fechaStr            = serie.fecha
        
      const fecha           = getDateToStr( fechaStr, "UTC" )      
      const año             = new Intl.DateTimeFormat('es', { year: 'numeric' }).format(fecha);
      const añoCorto        = new Intl.DateTimeFormat('es', { year: '2-digit' }).format(fecha);
      const mesCorto        = mayusculasPrimeraLetra( new Intl.DateTimeFormat('es', { month: 'short' }).formatToParts( fecha )[0].value )

      if(periodo            === PERIODO.AÑO || periodo == PERIODO.TRIMESTRE )
        cat                 = serie.x.toString()
      else  if(periodo      === PERIODO.MES )
        cat                 = `${año} ${mesCorto}`
      else  if(periodo      === PERIODO.SEMANA )
        cat                 = `${añoCorto} ${mesCorto} S${serie.x.toString().slice( 5, 7)}`
      cats.push( cat )
    }

    return cats
  }

  return {
    getSeriesTotales,    
  }
}