import { formatoNumeroCorto, X100_Calcular } from "src/useSimpleOk/useTools"

export enum PERIODO
{
  DIA                 = "day",
  SEMANA              = "week",
  MES                 = "month",
  TRIMESTRE           = "quarter",
  AÑO                 = "year",
}

export type Periodo = PERIODO.AÑO | PERIODO.MES | PERIODO.TRIMESTRE | PERIODO.SEMANA | PERIODO.DIA 

export interface ISerie {
  dia                 : number
  diaCorregido        : number
  mes                 : number
  semana              : number
  año                 : number
  fecha               : Date
  fechaCorta          : string
  color               : string
  periodo            ?: Periodo
}

export interface IApexCoordenada{
  x:                  number | string | Date
  y:                  number | null
  //strokeColor?:       string 
  //fillColor?:         string
}


export interface IApexSerie {
  name               : string
  data               : IApexCoordenada[]
  type              ?: string
  stacked           ?: boolean
  maximo            ?: number
  color             ?: string
  cosa              ?: string
}

export class Serie implements ISerie
{
  dia                : number
  mes                : number
  semana             : number
  año                : number
  color              : string
  periodo           ?: Periodo

  constructor()
  {
    this.dia                = 0
    this.semana             = 0
    this.mes                = 0
    this.año                = 0
    this.color              = "#FFFFFF"
  }

  get diaCorregido() : number {
    const dia               =   this.periodo === "year"    ||
                                this.periodo === "month"   ? 1
                              : this.periodo === "day"     ? this.dia
                              : this.periodo === "week"    ? this.dia //this.corregirDiaSemana()
                              : 0
    return dia
  }

  get fecha() : Date {
    const dia               = this.diaCorregido
    const mes               = (this.mes  ?? 1) -1
    const año               = this.año ?? 1970
    const fecha             = new Date(año, mes, dia)//.setHours(22);
    
    return fecha
  }

  get fechaCorta() : string {
    return this.fecha.toLocaleDateString('sv-SE') 
  }

/*   corregirDiaSemana() : number 
  {
    const fecha             = new Date(this.año, this.mes, this.dia)
    const dia               = fecha.getDay()

    return 1
  } */
}  





export function estiloApexChart( tiempo : Periodo, nombre : string, maximo : number, formato : "normal" | "precio" | "porcentaje" = "normal" ) : any
{
  console.log("estiloApexChart: ", maximo);  
  return {
    chart:
    {
      id: nombre.trim().replaceAll(" ", ""),
      redrawOnWindowResize: true,
      stacked:      true,
      zoom: {
        //type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      animations:
      {
        enabled: false,
        easing: 'easeinout',
        speed: 1000,
        animateGradually:
        {
            enabled: true,
            delay: 1000
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350
        }
      },
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          customIcons: []
        },
        export: {
          csv: {
            filename: nombre,
            columnDelimiter: ';',
            headerCategory: 'Fecha',
            headerValue: 'value',
            dateFormatter(timestamp:number) {
              return  new Date(timestamp).toLocaleDateString('sv-SE') 
            }
          },
          svg: { filename: nombre, },
          png: { filename: nombre, },
        },
      }, 
    },   

    title: {
      text: nombre,
      align: 'center',
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize:  '14px',
        fontWeight:  'bold',
        fontFamily:  undefined,
        color:  '#263238'
      },
    },

    stroke:
    {
      show:         true,
      width:        2,
      curve:        'smooth',
      //colors:     ['black']
    },

    dataLabels:
    {
      enabled:      tiempo !== "day",
      enabledOnSeries: [0],
      style: {
        fontSize:   '12px',
        //fontFamily: 'Helvetica, Arial, sans-serif',
        //fontWeight: 'bold',
        colors: ['#646464']
      },
      formatter: function (val : string, opts : any) {
        return formatoNumeroCorto(val, formato)
      },
    },

    markers:        { size: 0 },
    fill:           { opacity: 1 },

    xaxis: // https://apexcharts.com/docs/options/xaxis/
    {
      //title:        { text: nombre }, // Texto en la parte de abajo
      type:         "category", // category, numeric, datetime
      tickPlacement: 'between', // on,  between //Ya sea para dibujar las marcas entre los puntos de datos o en los puntos de datos. solo funciona para xaxis.type: gráficos de categoría y no para gráficos de fecha y hora.
      //axisBorder:   { show: true },
      //axisTicks:    { show: true },
      //trim: true,
      categories: ['Enero', 'Febrero', 'Marzo', 'Abril' ],
      tickAmount: 7,
      labels:{
        //show:       tiempo !== "day",
        /* formatter: function (value :string , timestamp : number ) {
          return new Date(timestamp).toLocaleDateString('sv-SE').slice(5,10) 
        },  */
        style: {
          colors: [],
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400,
          cssClass: 'apexcharts-xaxis-label',
      },        
        //formatter:  ( value : string )=> !!value ? value.slice(2,10) : "" 
      },  
      tooltip: {
        enabled: true,
/*         formatter: function (value : number , timestamp : number ) {

          const fecha = new Date(value).setHours(24)
          return new Intl.DateTimeFormat('es-CO', { weekday: 'long', month: 'long', day: 'numeric' }).format(fecha) //new Date(value).toUTCString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        }, */

        formatter: function (value : string , opts : any ) {
          //console.log("opts: ", opts);

          
          return value + "dfdf"
        },        
      },
    },

    yaxis: {
      //title:        { text: '# Cotizaciones'},
      max:            maximo,
      labels:{
        formatter: function (value :string , timestamp : number ) {
          return formatoNumeroCorto(value, formato)
        },         
      },
    },

    plotOptions:
    {
      bar:
      {
        horizontal:   false,
        borderRadius: 3,
        columnWidth:  '70%',
        endingShape:  'rounded',
      },
    },

    legend:
    {
      show:           true,
      position:       'top',
      horizontalAlign:'left', 
      floating:       false,
    },

    tooltip: {
      enabled: true,
      //enabledOnSeries: undefined,
      shared: true,
      //followCursor: false,
      intersect: false,
      inverseOrder: false,
      //custom: undefined,
      fillSeriesColor: false,
      //theme: false,
      /* style: {
        fontSize: '12px',
        fontFamily: undefined
      }, */
      onDatasetHover: {
          highlightDataSeries: false,
      },
      x: {
          show: true,
          //format: 'dd MMM',
/*           formatter: function (value :number , timestamp : number ) {
            const fecha = new Date(value).setHours(24)
            return new Intl.DateTimeFormat('es-CO', {  dateStyle: 'full' }).format(fecha) //new Date(value).toUTCString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
          }, */
      },
      y: {
        formatter:  ( value : number, objectoApex :any ) :string => {
          let labelX100         = "" 
          if(typeof objectoApex === "object" && !!objectoApex && formato === "porcentaje")
          {
            const indexColumna  = objectoApex?.dataPointIndex as number ?? 0
            if(indexColumna     === -1) return ""
            const indexSerie    = objectoApex?.seriesIndex    as number ?? 0            
            const initialSeries = objectoApex.w.globals.initialSeries as any[]
            const maximoColumna = initialSeries[0].data[indexColumna].y
            const valor         = initialSeries[indexSerie].data[indexColumna].y
            const porcentaje    = X100_Calcular(maximoColumna, value).toFixed(0)
            if(indexSerie       > 0)
              labelX100         =  " - " + porcentaje + "%"
          }          
          const valor : string  = !!value && typeof value === 'number' ? value.toFixed(0) : "0"
          return formatoNumeroCorto(valor, formato) + labelX100
        }
        //title: { formatter: (seriesName : string) => seriesName  },
      },
      //marker: { show: true, },
      //items: { display: "flex", },
      /* fixed: {
          enabled: false,
          position: 'topRight',
          offsetX: 0,
          offsetY: 0,
      },*/
  }
  
    //colors:[ '#B4B4B4', '#E4839B', '#3D79EB' ]
/* 
  crosshairs:
  {
    fill: {
      type: 'gradient',
      gradient: {
        colorFrom: '#D8E3F0',
        colorTo: '#BED1E6',
        stops: [0, 100],
        opacityFrom: 0.4,
        opacityTo: 0.5,
      }
    }
  },
  labels:
  {
    style:
    {
      fontSize: '16px'
    }
  },    
   */
/*  
  responsive:
  [
    {
      breakpoint: 480,
      options:
      {
        legend:
        {
          position: 'bottom',
          offsetX:  -10,
          offsetY:  0
        }
      }
    }
  ],
*/
  }
}