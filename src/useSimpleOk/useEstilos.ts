import { formatoNumeroCorto, X100_Calcular } from "src/useSimpleOk/useTools"
import { QMenuProps } from "quasar"


export const style  = {
  btnBaseSm         : {
    push            : true,
    noCaps          : true,
    glossy          : true,
    dense           : true,
    size            : "0.8em",
    padding         : "2px 8px"
  },  
  btnBaseMd         : {
    push            : true,
    noCaps          : true,
    glossy          : true,
    dense           : false,
    size            : "md",
    padding         : "2px 8px"
  },  
  btnFlatSm         : {
    noCaps          : true,
    flat            : true,
    dense           : true,
    size            : "0.8em",
    padding         : "2px 8px"
  },  
  btnFlatMd         : {
    noCaps          : true,
    flat            : true,
    dense           : true,  
    padding         : "2px 8px"
  },  
  btnRedondo        : {
    dense           : true,
    push            : true,
    round           : true,
    glossy          : true,  
    unelevated      : true,
    size            : "0.8em",
    padding         : "2px"
  },  
  btnRedondoFlat    : {
    dense           : true,
    flat            : true,
    round           : true,
    size            : "md",
    padding         : "none",
    class           : "op40 op100-hover q-ml-sm"
  },
  btnSimple         : {
    flat            : true,
    dense           : true,
    noCaps          : true,
    padding         : "4px 14px"
  },  
  toggleGris        : {
    dense           : true,
    push            : true,
    glossy          : true, 
    unelevated      : true, 
    padding         : "4px",  
    toggleColor     : "grey-4",
    textColor       : "grey-6",
    toggleTextColor : "grey-10",
  },  
  dialogDefault     : {
    transitionShow  : "slide-up",
    transitionHide  : "slide-down",
  }
}

export const menuDefault : QMenuProps = { 
  fit             : true,
  transitionShow  : "jump-down",
  transitionHide  : "jump-up" ,
  anchor          : "bottom middle",
  self            : "top middle",
}

export const WYSIWYG_Limpio  = {
  dense:      true,
  minHeight: "5rem",
  toolbar:    [
                ['bold', 'underline', 'unordered',
                  {
                    label: "Fuente",
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'size-1',
                      'size-2',
                      'size-3',
                      'size-4',
                      'size-5',
                    ]
                  },
                  'removeFormat', 'viewsource', 'save'
                ],                
              ]
}

export const WYSIWYG_Imagen  = {
  dense:      true,
  minHeight: "5rem",
  toolbar:    [
                [
                  'save'
                ],                
              ]
}



export function btnNumeroPaso(  tipo    : "arriba"  | "abajo",
                                colores : "gris"    | "verde-rojo" | "gris-flat"  = "verde-rojo",
                                iconos  : "flecha"  | "suma"                      = "suma",
                                modo    : "right"   | "left" | "center"           = "right",
                                curva   : number                                  = 6,

                              ) : Object
{
  let color         = ""
  let icon          = ""
  let style         = ""
  let clase         =   colores == "verde-rojo" ? "text-white"
                      : colores == "gris"       ? "text-black"
                      : colores == "gris-flat"  ? "bg-grey-5 text-white"
                      : ""

  if(tipo           == "arriba"){
    color           =   colores == "verde-rojo" ? "positive"
                      : colores == "gris"       ? "grey-4"
                      : ""
    style           =   modo == "right"         ? "border-radius: 0 " + curva + "px 0 0;"
                      : modo == "left"          ? "border-radius: " + curva + "px 0 0 0;"
                      : modo == "center"        ? "border-radius: 0 " + curva + "px " + curva + "px 0;"
                      : ""
    icon            = iconos == "flecha"        ? "mdi-menu-up"   : "mdi-plus"                      
  } 
  else {
    color           =   colores == "verde-rojo" ? "negative"
                      : colores == "gris"       ? "grey-4"
                      : ""
    style           =   modo == "right"         ? "border-radius: 0 0 " + curva + "px 0;"
                      : modo == "left"          ? "border-radius: 0 0 0 " + curva + "px;"
                      : modo == "center"        ? "border-radius: " + curva + "px 0 0 " + curva + "px;"
                      : ""
    icon            = iconos == "flecha"        ? "mdi-menu-down" : "mdi-minus"
  } 

  let vBind         = {
    push:           colores != "gris-flat",
    glossy:         colores != "gris-flat",
    flat:           colores == "gris-flat",
    dense:          true,
    unelevated:     true,
    size:           "0.8em",
    padding:        modo == "center" ? "0.8em 0.6em" : "0 0.6em",
    color:          color,
    icon:           icon,
    style:          style,
    class:          clase
  }
  return vBind
} 



import {  Tiempo } from "src/models/TiposInformes"

export function estiloApexChart( tiempo : Tiempo, nombre : string, maximo : number, formato : "normal" | "precio" | "porcentaje" = "normal" ) : any
{
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
        enabled: true,
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
    xaxis:
    {
      //title:        { text: nombre },
      type:         "datetime",
      tickPlacement: 'between',
      //axisBorder:   { show: true },
      //axisTicks:    { show: true },
      //trim: true,
      tickAmount: 7,
      labels:{
        show:       tiempo !== "day",
        formatter: function (value :string , timestamp : number ) {
          return new Date(timestamp).toLocaleDateString('sv-SE').slice(5,10) 
        }, 
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
        formatter: function (value :number , timestamp : number ) {
          const fecha = new Date(value).setHours(24)
          return new Intl.DateTimeFormat('es-CO', { weekday: 'long', month: 'long', day: 'numeric' }).format(fecha) //new Date(value).toUTCString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
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
          formatter: function (value :number , timestamp : number ) {
            const fecha = new Date(value).setHours(24)
            return new Intl.DateTimeFormat('es-CO', {  dateStyle: 'full' }).format(fecha) //new Date(value).toUTCString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
          },
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