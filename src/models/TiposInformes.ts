import { formatoNumeroCorto, FormatosNumero } from "src/useSimpleOk/useTools"

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
  trimestre           : number
  año                 : number
  fecha               : Date
  fechaCorta          : string
  color               : string
  periodo            ?: Periodo
}

export interface IApexCoordenada{
  x:                  number | string | Date
  y:                  number | null
  fecha:              string
  //strokeColor?:       string 
  //fillColor?:         string
}


export interface IApexSerie {
  name               : string
  //datos               : number[]
  data              : IApexCoordenada[]
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
  trimestre          : number
  año                : number
  color              : string
  periodo           ?: Periodo

  constructor()
  {
    this.dia                = 0
    this.semana             = 0
    this.mes                = 0
    this.trimestre          = 0
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

export function estiloApexChartLine( nombre : string, categorias : string[], formato : FormatosNumero ) : any
{
  return {
    title:        getTitle( nombre ),
    xaxis:        getXaxis( categorias ),
    yaxis:        getYaxis( formato ),
    fill:         fill,
    grid:         grid,               
    markers:      { size: 3 },        // Coloca un punto en cada linea     
    dataLabels:   { enabled: false }, // Agrega el valor en queda eje X en cada linea
    legend:       legend,
    chart: {
      type:       'line',
      toolbar:    getToolbar( nombre ),
      animations: animations,
    },
    stroke: {
      width:      3,
      curve:      'smooth', // smooth straight stepline
    },
  }
}

export function estiloApexChartBar(
  nombre      : string,
  categorias  : string[],
  formato     : FormatosNumero,
  stackType   : "normal" | "100%",
  maximo      : number | undefined    = undefined
)             : any
{
  return {
    title:        getTitle( nombre ),
    xaxis:        getXaxis( categorias ),
    yaxis:        getYaxis( formato, maximo ),
    grid:         grid,
    legend:       legend,
    fill:         fill,
    chart: {
      type:       'bar',
      stacked:    true,
      stackType:  stackType,
      toolbar:    getToolbar( nombre ),
      animations: animations,      
    },
    dataLabels: {
      style: {
        fontSize:   '14px',
        fontWeight: 'bold',
        colors:     ['#FFF']
      },
      formatter:    (val : string, opts : any) => formatoNumeroCorto(val, formato)
    },
  }
}


function getTitle( nombre : string ) {
  return {
    text:         nombre,
    align:        'center',
    margin:       10,
    offsetX:      0,
    offsetY:      0,
    floating:     false,
    style: {
      fontSize:   '14px',
      fontWeight: 'bold',      
      color:      '#263238'
    }
  }
}


function getToolbar( nombre : string ) {
  return {
    export:
    {
      csv: {
        filename:         nombre,
        columnDelimiter:  ';',
        headerCategory:   'Periodo',
        headerValue:      'value',
      },
      svg: { filename: nombre, },
      png: { filename: nombre, },
    }
  }
}


function getXaxis( cats : string[] ) {
  return {
    categories:     cats,      
    tickPlacement:  "between",  // Activa que se muestren las categorias
    tickAmount:     10,         // Para que el label en el eje X no este tan saturado
  }
}
function getYaxis( formato : FormatosNumero, maximo : number | undefined = undefined ) {
  return {
    max     : maximo,
    labels  : { formatter: ( value :string , timestamp : number ) => formatoNumeroCorto(value, formato) }
  }
}

const animations = {
  enabled:  false,
  //easing:   'easeinout',
  //speed:    600,
}

const grid = { // Diseño de cada franja eje Y
  row: {
    colors: ['#F4F4F4', '#FFF'], 
    opacity: 1
  }
}

const legend = {
  show:           true,
  position:       'top',
  horizontalAlign:'center', 
  floating:       false,
}

const fill = {
  opacity: 1,
  type: 'solid',
}