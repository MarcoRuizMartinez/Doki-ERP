import {  INivelesComision,
          NivelesComision   } from "./NivelesComision"
import {  storeToRefs       } from 'pinia'
import {  useStoreAcuerdo   } from 'src/stores/acuerdo'

export interface IComision
{
  niveles       : INivelesComision
  comercial_1   : number          // Valor de comision comercial 1
  comercial_2   : number          // Valor de comision comercial 2
  calcular      : ()=> void
}

export class Comision implements IComision
{
  niveles       : INivelesComision
  comercial_1   : number
  comercial_2   : number

  constructor()
  {
    this.niveles        = new NivelesComision()
    this.comercial_1    = 0
    this.comercial_2    = 0
  }

  calcular() : void
  {
    const { acuerdo, nivelesComision : niveles } = storeToRefs( useStoreAcuerdo() )
    const lineasAcuerdo = acuerdo.value.productos.filter( l => !l.esTituloOsubTotal )
    this.comercial_1    = 0
    this.comercial_2    = 0
    
    for (const linea of lineasAcuerdo)
    {
      const nivel       = linea.nivelPrecios
      const subTotal    = linea.totalConDescu
      const regla       = acuerdo.value.comercial.comision
      const modificador = linea.categoria.modificadorComision
      const divisor     = linea.comsionX100Division

      linea.comision_c1.calcular( nivel, subTotal, regla, modificador, divisor )
      this.comercial_1 += linea.comision_c1.valor
    }
  }
}
