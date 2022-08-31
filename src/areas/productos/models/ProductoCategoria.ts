export interface IProductoCategoria {
  id:                 number
  nombre:             string
  sigla:              string  
  grupo:              string
  label:              string
  value:              number
}

export class ProductoCategoria implements IProductoCategoria
{
  id:                 number
  nombre:             string
  sigla:              string  
  grupo:              string

  constructor()
  {
    this.id                 = 0
    this.nombre             = ""   
    this.sigla              = ""   
    this.grupo              = ""   
  }

  get label() : string  { return this.nombre  }
  get value() : number  { return this.id      }
}