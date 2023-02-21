export interface ICondicionPago
{
  id                  : number  
  label               : string  
  descripcion         : string
  dias                : number
  value               : number
  facturable          : number
  esFacturable        : boolean
}

export class CondicionPago implements ICondicionPago
{
  id                  : number
  label               : string
  descripcion         : string
  dias                : number
  facturable          : number
  
  constructor()
  {
    this.id           = 0  
    this.label        = ""  
    this.descripcion  = ""
    this.dias         = 0
    this.facturable   = 0 // Es boolean
  }

  get value()       : number  { return this.id }
  get esFacturable(): boolean { return !!this.facturable ? Boolean( +this.facturable ) : false }
}