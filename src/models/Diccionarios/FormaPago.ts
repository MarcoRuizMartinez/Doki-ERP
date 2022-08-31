export interface IFormaPago
{
  id:                 number  
  label:              string
  value:              number
}

export class FormaPago implements IFormaPago
{
  id:                 number  
  label:              string
  
  constructor()
  {
    this.id           = 0  
    this.label        = ""
  }

  get value() : number  { return this.id }
}