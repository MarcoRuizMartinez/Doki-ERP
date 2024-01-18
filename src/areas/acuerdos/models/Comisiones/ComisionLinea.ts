import {  TNivelesComision  } from "./NivelesComision"
import {  IReglaComision    } from "src/models/Diccionarios/ReglasComision"
import {  ToolNum           } from "src/composables/useTools"   

export interface IComisionLinea
{
  X100                      : number  // % final de la comision 
  X100_Bruto                : number  // % antes del modificador
  valor                     : number  // valor final de comision 
  esComercial_1             : boolean
  esComercial_2             : boolean
  calcular                  : ( nivel       : TNivelesComision,
                                subTotal    : number,
                                regla       : IReglaComision,
                                modificador : number,
                                divisor     : number
                              )=> void
}

export class ComisionLinea implements IComisionLinea
{
  X100                      : number
  X100_Bruto                : number 
  valor                     : number
  esComercial_1             : boolean

  constructor( numeroComercial : "comercial 1" | "comercial 2" )
  {
    this.X100               = 0
    this.X100_Bruto         = 0
    this.valor              = 0
    this.esComercial_1      = numeroComercial === "comercial 1"
  }

  

  calcular
  (
    nivel       : TNivelesComision,
    subTotal    : number,
    regla       : IReglaComision,
    modificador : number,
    divisor     : number,
  )             : void
  {
    if(this.esComercial_2)
      divisor = 100 - divisor   // Si es 20 / 80, la comsion del segundo comercial es 80 y toca invertir el divisor
    
    this.X100_Bruto = regla.getX100Comision( nivel )    
    this.X100       =   this.X100_Bruto > 0
                      ? this.X100_Bruto + modificador
                      : this.X100_Bruto
    this.X100       = this.X100 < 0 ? 0 : this.X100 // Por si el modificador lo puso en valores negativos        
    subTotal        = ToolNum.X100(subTotal, divisor)
    this.valor      = ToolNum.X100(subTotal, this.X100)
  }

  get esComercial_2() { return !this.esComercial_1 }
}