import {  AREA              } from "src/models/TiposVarios"

export interface IBodega
{
  id                  : number
  ref                 : string
  nombre              : string
  activo              : boolean
  padre_id            : number
  proyecto_id         : number
  descripcion         : string
  direccion           : string  

  label               : string
  value               : number
  area                : AREA
}

export class Bodega implements IBodega
{
  id                  : number  = 0
  ref                 : string  = ""
  nombre              : string  = ""
  activo              : boolean = true
  padre_id            : number  = 0
  proyecto_id         : number  = 0
  descripcion         : string  = ""
  direccion           : string  = ""
  area                : AREA    = AREA.NULO

  get value() : number  { return this.id  }
  get label() : string  { return this.ref }
}