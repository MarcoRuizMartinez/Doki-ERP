export type Tiempo = "year" | "month" | "week" | "day"

export interface ISerie {
  dia:                number
  diaCorregido:       number
  mes:                number
  semana:             number
  año:                number
  fecha:              Date
  fechaCorta:         string
  tiempo?:            Tiempo
  color:              string
}

export interface IApexCoordenada{
  x:                  number | string | Date
  y:                  number | null
  //strokeColor?:       string 
  //fillColor?:         string
}


export interface IApexSerie {
  name:               string
  type?:              string
  stacked?:           boolean
  data:               IApexCoordenada[]
  maximo?:            number
  color?:             string
  cosa?:              string
}

export class Serie implements ISerie
{
  dia:                number
  mes:                number
  semana:             number
  año:                number
  tiempo?:            Tiempo
  color:              string

  constructor()
  {
    this.dia                = 0
    this.semana             = 0
    this.mes                = 0
    this.año                = 0
    this.color              = "#FFFFFF"
  }

  get diaCorregido() : number {
    const dia               =   this.tiempo === "year"    ||
                                this.tiempo === "month"   ? 1
                              : this.tiempo === "day"     ? this.dia
                              : this.tiempo === "week"    ? this.dia //this.corregirDiaSemana()
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