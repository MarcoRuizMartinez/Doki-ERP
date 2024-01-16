export interface IFormaPago
{
  id:                 number  
  label:              string
  value:              number
}

export class FormaPago implements IFormaPago
{
  id                  : number  = 0  
  label               : string  = ""  

  get value() : number  { return this.id }
}