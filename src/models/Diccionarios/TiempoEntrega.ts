export interface ITiempoEntrega
{
  id:                 number  
  label:              string
  codigo:             string
  value:              number
}

export class TiempoEntrega implements ITiempoEntrega
{
  id                  : number  = 0 
  label               : string  = ""
  codigo              : string  = ""

  get value() : number  { return this.id }
}