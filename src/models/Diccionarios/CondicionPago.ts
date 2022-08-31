export interface ICondicionPago
{
  id:                 number  
  label:              string  
  descripcion:        string
  dias:               number
  value:              number
}

export class CondicionPago implements ICondicionPago
{
  id:                 number  
  label:              string  
  descripcion:        string
  dias:               number
  
  constructor()
  {
    this.id           = 0  
    this.label        = ""  
    this.descripcion  = ""
    this.dias         = 0
  }

  get value() : number  { return this.id }
}