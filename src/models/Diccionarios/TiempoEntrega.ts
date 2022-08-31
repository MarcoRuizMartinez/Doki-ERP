export interface ITiempoEntrega
{
  id:                 number  
  label:              string
  codigo:             string
  value:              number
}

export class TiempoEntrega implements ITiempoEntrega
{
  id:                 number  
  label:              string
  codigo:             string

  constructor()
  {
    this.id           = 0  
    this.label        = ""
    this.codigo       = ""
  } 

  get value() : number  { return this.id }
}