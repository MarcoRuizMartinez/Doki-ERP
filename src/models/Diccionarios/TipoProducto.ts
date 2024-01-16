export interface ITipoProducto
{
  id:                 number
  codigo:             number
  nombre:             string
  label:              string
  value:              number
}

export class TipoProducto implements ITipoProducto
{
  id                  : number  = 0
  nombre              : string  = ""
  codigo              : number  = 0

  get value() : number  { return this.codigo }
  get label() : string  { return this.nombre }
}