export interface ITipoContacto
{
  id:                 number  
  codigo:             string
  tipo:               string
  origen:             string
  value:              number
}

export class TipoContacto implements ITipoContacto
{
  id:                 number  
  codigo:             string
  tipo:               string
  origen:             string

  constructor()
  {
    this.id           = 0  
    this.codigo       = ""
    this.tipo         = ""
    this.origen       = ""
  }

  get value() : number  { return this.id }
}