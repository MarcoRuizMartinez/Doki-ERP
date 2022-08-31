export interface IMetodoEntrega
{
  id:                 number  
  label:              string
  value:              number
}

export class MetodoEntrega implements IMetodoEntrega
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