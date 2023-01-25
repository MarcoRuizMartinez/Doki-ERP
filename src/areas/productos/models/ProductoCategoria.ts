export interface IProductoCategoria {
  id                  : number
  nombre              : string
  sigla               : string
  grupo               : string
  label               : string
  value               : number
  modificadorComision : number
  codigoVenta         : number
  codigoCompra        : number
}

export class ProductoCategoria implements IProductoCategoria
{
  id                  : number
  nombre              : string
  sigla               : string
  grupo               : string
  modificadorComision : number
  codigoVenta         : number
  codigoCompra        : number

  constructor()
  {
    this.id                   = 0
    this.nombre               = ""
    this.sigla                = ""
    this.grupo                = ""
    this.modificadorComision  = 0.3
    this.codigoVenta          = 0
    this.codigoCompra         = 0
  }

  get label() : string  { return this.nombre  }
  get value() : number  { return this.id      }
}
