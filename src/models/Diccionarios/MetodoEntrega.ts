export interface IMetodoEntrega
{
  id              : number  
  label           : string
  value           : number
  seguimiento     : string
}

export class MetodoEntrega implements IMetodoEntrega
{
  id              : number = 0 
  label           : string = ""  
  seguimiento     : string = ""  

  get value() : number  { return this.id }
}