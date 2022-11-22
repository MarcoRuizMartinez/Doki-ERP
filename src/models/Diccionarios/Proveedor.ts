export interface IProveedor
{
  id:                 number  
  nombre:             string
  alias:              string
  codigo:             string
  label:              string
  value:              number
}

export class Proveedor implements IProveedor
{
  id:                 number
  nombre:             string
  alias:              string
  codigo:             string  
  
  constructor()
  {
    this.id           = 0  
    this.nombre       = ""
    this.alias        = ""
    this.codigo       = ""  
  }

  get label() : string { return this.alias  }
  get value() : number { return this.id     }
}