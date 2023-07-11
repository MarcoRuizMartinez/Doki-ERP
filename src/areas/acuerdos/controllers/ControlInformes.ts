// * /////////////////////////////////////////////////////////////////////// Componibles
import {  sortArray           } from "src/composables/useTools"
import {  getURL,
          getFormData         } from "src/composables/APIMaco"        
import {  useFetch            } from "src/composables/useFetch"
import {  getDateToStr,
          colorRandom,
          mayusculasPrimeraLetra  
                              } from "src/composables/useTools"

// * /////////////////////////////////////////////////////////////////////// Modelos
import {  IQuery              } from "src/models/Busqueda"  
import {  Periodo,
          PERIODO,
          IApexSerie          } from "src/models/TiposInformes"  
import {  SerieAcu,
          ISerieAcu,
                              } from "src/areas/acuerdos/models/SerieAcuerdo"

type KeysSeries         = "cuenta" | "total"

interface ISeries {
  cuenta      : IApexSerie[]
  total       : IApexSerie[]
  ejeX        : string[]
}


export function useControlInformes()
{
  const { miFetch       } = useFetch()  

  async function getSeries( query : IQuery ) : Promise< ISeries >
  {
    const seriesCrudas    = await getInforme( query )
    
    if(!seriesCrudas.length)
      return { cuenta: [], total: [], ejeX: [] }

    const nombresLineas   = [ ...new Set( seriesCrudas.map((s) => s.nombre ) ) ]    
    const cuenta          = getSerie("cuenta",  seriesCrudas, nombresLineas ) // , query.periodo, tipoGrafico )    
    const total           = getSerie("total",   seriesCrudas, nombresLineas ) // , query.periodo, tipoGrafico )
    const ejeX            = getPeridosEjeX( cuenta, query.periodo )
    

    revisarColor()
    return { cuenta, total, ejeX }

    function revisarColor()
    {
      let nombre            = ""
      for (let i = 0; i < cuenta.length; i++)
      {
        if(!!cuenta[i].color) continue

        nombre              = cuenta[i].name
        cuenta[i].color     =   hay("hats")     ? "#54C862"   // WhathsApp
                              : hay("rreo")     ? "#315CF0"   // Correo
                              : hay("fono")     ? "#2E2893"   // Teléfono
                              : hay("nline")    ? "#A41C8F"   // Tienda Online
                              : hay("rrente")   ? "#E03034"   // Cliente recurrente
                              : hay("exhi")     ? "#F47A00"   // Sala exhibición
                              : hay("feren")    ? "#F4D600"   // Referenciado
                              : hay("Mublex")   ? "#EC0000"
                              : hay("Escom")    ? "#F86708"
                              : hay("Nivel X")  ? "#323232"
                              : hay("Nivel E")  ? "#921F70"
                              : hay("Nivel D")  ? "#F47A00"
                              : hay("Nivel C")  ? "#FF2FCB"
                              : hay("Nivel B")  ? "#2733A0"
                              : hay("Nivel A")  ? "#007DC8"
                              : hay("Alfa")     ? "#A5EC20"
                              :                   colorRandom( "lista" )
        total[i].color      = cuenta[i].color
      }

      function hay( txt : string ) { return nombre.includes(txt) }
    }
  }

  async function getInforme(  query : IQuery ) : Promise< ISerieAcu[] >
  {
    query.periodo           = query?.periodo ?? PERIODO.MES
    const url               = getURL("listas", "informes")
    const objetoForData     = { body: getFormData( "", query ), method: "POST" }
    const { data  }         = await miFetch(url, objetoForData, { mensaje: "Cargar informe", dataEsArray: true })
    const informe           = await SerieAcu.getSerieFromApi( data, query )
    return informe
  }

  function getSerie
  (
    key           : KeysSeries,
    seriesCrudas  : ISerieAcu[],
    categorias    : string[]
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
          suma      += serie.data[index]?.y ?? 0
          if(serieTotal.maximo !== undefined && serieTotal.maximo < suma)
            serieTotal.maximo   = suma
          
          if(!!serie.data[index]?.fecha ?? false)
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
    
    function getSerieMapeada() : IApexSerie[] { return categorias.map( mapApexSerie ) }
    function mapApexSerie( categoria : string ) : IApexSerie
    {
      let color  = ""
      const data =
      [
        ...seriesCrudas
          .filter ( ( s ) => s.nombre === categoria)
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
        name:     categoria,
        color,
        data,
      }

      return serie
    } 
  }


  
  function getPeridosEjeX( series : IApexSerie[], periodo : Periodo ) : string[]
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
    getSeries,    
  }
}