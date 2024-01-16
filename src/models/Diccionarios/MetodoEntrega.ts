export interface IMetodoEntrega
{
  id:                 number  
  label:              string
  value:              number
}

export class MetodoEntrega implements IMetodoEntrega
{
  id                  : number = 0 
  label               : string = ""  

  get value() : number  { return this.id }
}