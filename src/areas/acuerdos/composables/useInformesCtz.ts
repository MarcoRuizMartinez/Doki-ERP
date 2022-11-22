
import {  Tiempo,
          IApexSerie          } from "src/models/TiposInformes"
import {  ISerieCtz           } from "src/areas/acuerdos/models/SeriesCotizacion"          
import {  servicesAcuerdos     } from "src/areas/acuerdos/services/servicesAcuerdos"
import {  ref
                              } from "vue"
import {  sortArray           } from "src/useSimpleOk/useTools"

import {  EstadosAcuerdos     } from "src/areas/acuerdos/models/ConstantesAcuerdos"

export function useInformesCtz()
{
  const { getInforme            } = servicesAcuerdos()
  const   seriesTotales           = ref< IApexSerie[] >([])
  const cuentaCtzSerie            = ref< IApexSerie[] >([])
  const totalesCtzConTotalSerie   = ref< IApexSerie[] >([])
  const totalesCtzSinTotalSerie   = ref< IApexSerie[] >([])
  const estadosCtzSerie           = ref< IApexSerie[] >([])
  const comerciales               = ref< string[]     >([])


  async function generarSeriesEstados( tiempo : Tiempo, comercial : string ) : Promise< void >
  {
    const seriesCrudas            = await getInforme("estados", tiempo)
    const seriesComercial         = seriesCrudas.filter( s => s.comercial === comercial )
    const listaEstados            = [ ...new Set(seriesComercial.map((s) => s.estado)) ]
    estadosCtzSerie.value         = getSerie("total", seriesComercial, listaEstados, "estado")
    estadosCtzSerie.value.forEach( s => { if( s.name !== "Total" ) s.color = EstadosAcuerdos.estadoStrCtzToColor(s.name) })

    //console.table(seriesComercial);

    //console.log(seriesCrudas)
    //comerciales.value             = [ ...new Set(seriesCrudas.map((s) => s.comercial)) ]
    //estadosCtz.value              = getSerie("cuentaCtz", seriesCrudas)
    //console.log('estadosCtz.value: ', estadosCtz.value)
  }



  async function generarSeriesTotales( tiempo : Tiempo ) : Promise< void >
  {
    const seriesCrudas            = await getInforme("totales", tiempo)
    comerciales.value             = [ ...new Set(seriesCrudas.map((s) => s.comercial)) ]
    //console.table(seriesCrudas);    
    cuentaCtzSerie.value          = getSerie("cuentaCtz",         seriesCrudas, comerciales.value, "comercial")
    totalesCtzConTotalSerie.value = getSerie("subtotalConTotal",  seriesCrudas, comerciales.value, "comercial")
    totalesCtzSinTotalSerie.value = getSerie("subtotalSinTotal",  seriesCrudas, comerciales.value, "comercial")
  }




  type KeysSeries =  "cuentaCtz" | "total" | "cuentaCtzSinTotal" | "subtotalConTotal" | "subtotalSinTotal"
  
  function getSerie( key : KeysSeries, seriesCrudas : ISerieCtz[], keyAgrupar : string[], keyLabel : "comercial" | "estado" )
  {
    const seriesMapeada           = getSerieMapeada()//.filter((i)=>i.name !== "Total")
    const seriesSincronizadas     = sincronizarSeries( seriesMapeada )
    seriesSincronizadas.push( sumarSeries(seriesSincronizadas) )

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
      const serie :IApexSerie = {
        name:     label,
        cosa:     "asdf",
        type:     "bar",  //nombre === "Total" ? "area" : "bar",
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
    generarSeriesTotales,
    generarSeriesEstados,
    comerciales,
    cuentaCtzSerie,
    totalesCtzConTotalSerie,
    totalesCtzSinTotalSerie,
    estadosCtzSerie,
  }
}