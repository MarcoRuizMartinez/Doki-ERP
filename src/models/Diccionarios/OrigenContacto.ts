export interface IOrigenContacto
{
  id:                 number  
  label:              string
  value:              number
}

export class OrigenContacto implements IOrigenContacto
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