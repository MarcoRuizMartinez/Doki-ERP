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
}

export class Bodega implements IBodega
{
  id                  : number
  ref                 : string
  nombre              : string
  activo              : boolean
  padre_id            : number
  proyecto_id         : number
  descripcion         : string
  direccion           : string  

  constructor()
  {
    this.id           = 0
    this.ref          = ""
    this.nombre       = ""
    this.activo       = true
    this.padre_id     = 0
    this.proyecto_id  = 0
    this.descripcion  = ""
    this.direccion    = ""
  }

  get value() : number  { return this.id  }
  get label() : string  { return this.ref }
}