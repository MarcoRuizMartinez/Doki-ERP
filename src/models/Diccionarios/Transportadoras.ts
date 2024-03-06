export interface ITransportadora
{
  id:                 number  
  nombre:             string
  color:              string
  label:              string
  value:              number
}

export class Transportadora implements ITransportadora
{
  id                  : number  = 0  
  nombre              : string  = ""
  alias               : string  = ""
  color               : string  = "" 
  
  get label() : string { return this.nombre }
  get value() : number { return this.id     }
}