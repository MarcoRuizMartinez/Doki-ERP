export interface ICategoriaProducto {
  id                  : number
  nombre              : string
  sigla               : string
  grupo               : string
  label               : string
  value               : number
  modificadorComision : number
  codigoVenta         : number
  codigoCompra        : number
  grupoId             : number
}

export class CategoriaProducto implements ICategoriaProducto
{
  id                  : number = 0
  nombre              : string = ""
  sigla               : string = ""
  grupo               : string = ""
  modificadorComision : number = 0.3
  codigoVenta         : number = 0
  codigoCompra        : number = 0
  grupoId             : number = 0

  /* constructor()
  {
  } */

  get label() : string  { return this.nombre  }
  get value() : number  { return this.id      }
}
