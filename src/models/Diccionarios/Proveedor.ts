export interface IProveedor
{
  id      : number  
  nombre  : string
  alias   : string
  codigo  : string
  label   : string
  color   : string
  value   : number
}

export class Proveedor implements IProveedor
{
  id                  : number  = 0  
  nombre              : string  = ""
  alias               : string  = ""
  codigo              : string  = "" 
  color               : string  = ""
  
  get label() : string { return this.alias  }
  get value() : number { return this.id     }
}