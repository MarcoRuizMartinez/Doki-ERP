import {  ISerie,
          Serie,
          Tiempo,
          IApexSerie          } from "src/models/TiposInformes"
import {  estadoCtzToName,
          estadoCtzToColor    } from "src/areas/acuerdos/models/ConstantesAcuerdos"

export interface ISerieCtz extends ISerie
{
  comercial:          string
  comercialId:        number

  cuentaCtz:          number
  cuentaCtzConTotal:  number
  cuentaCtzSinTotal:  number
  
  subtotalConTotal:   number
  subtotalSinTotal:   number

  estadoId:           number
  total:              number
  estado:             string
  estadoColor:        string
}

export class SerieCtz extends Serie implements ISerieCtz
{
  comercial:          string
  comercialId:        number

  cuentaCtzConTotal:  number
  cuentaCtzSinTotal:  number
  
  subtotalConTotal:   number
  subtotalSinTotal:   number

  estadoId:           number
  total:              number  

  constructor()
  {
    super()

    this.comercial          = ""
    this.comercialId        = 0

    this.cuentaCtzConTotal  = 0
    this.cuentaCtzSinTotal  = 0

    this.subtotalConTotal   = 0
    this.subtotalSinTotal   = 0

    this.estadoId           = 0
    this.total              = 0    
  }

  get cuentaCtz() : number {
    return this.cuentaCtzConTotal + this.cuentaCtzSinTotal
  }

  get estado()      : string { return estadoCtzToName (this.estadoId) }
  get estadoColor() : string { return estadoCtzToColor(this.estadoId) }
}      