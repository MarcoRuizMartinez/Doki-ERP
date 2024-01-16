export interface IOrigenContacto
{
  id:                 number  
  label:              string
  value:              number
}

export class OrigenContacto implements IOrigenContacto
{
  id                  : number = 0
  label               : string = ""
  
  get value() : number  { return this.id }
}