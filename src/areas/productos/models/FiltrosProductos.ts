import {  ILabelValue,
          labelValueNulo  } from "src/models/TiposVarios"
import {  valorValido     } from "src/useSimpleOk/useTools"


export interface IFiltroProductos {
  filtroTexto           : string
  precioMinimo          : number | undefined
  precioMaximo          : number | undefined
  preciosMaxOrMinValidos: boolean
}
export class FiltroProductos implements IFiltroProductos
{
  filtroTexto           : string  
  precioMinimo          : number | undefined
  precioMaximo          : number | undefined 

  constructor()
  {
    this.filtroTexto      = ""    
    this.precioMinimo     = undefined
    this.precioMaximo     = undefined
  }
  preciosMaxMinSonNull: boolean

  get preciosMaxOrMinValidos(){
    return valorValido( this.precioMinimo ) || valorValido( this.precioMaximo )
  }
} 