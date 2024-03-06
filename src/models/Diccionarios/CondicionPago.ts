export interface ICondicionPago
{
  id                  : number  
  label               : string  
  descripcion         : string
  dias                : number
  value               : number
  facturable          : number
  esFacturable        : boolean
  esGarantia          : boolean
  orden               : number
}

export class CondicionPago implements ICondicionPago
{
  id                  : number  = 0
  label               : string  = "⚠️Error - Sin condiciones"
  descripcion         : string  = ""
  dias                : number  = 0
  facturable          : number  = 0 // Es boolean
  orden               : number  = 0

  get value()         : number  { return this.id }
  get esFacturable()  : boolean { return !!this.facturable ? Boolean( +this.facturable ) : false }
  get esGarantia()    : boolean { return this.label.includes("arant") }
}