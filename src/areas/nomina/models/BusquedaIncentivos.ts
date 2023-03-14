import {  ILabelValue,
          labelValueNulo  } from "src/models/TiposVarios"
import {  IUsuario        } from "src/areas/usuarios/models/Usuario"

import {  INCENTIVO_ESTADO,
          INCENTIVO_RAZON,
          INCENTIVO_ORIGEN,
          INCENTIVO_ESTADO_PAGO
                          } from "src/areas/nomina/models/Incentivo"  

export interface IQueryIncentivo {
  id                   ?: number
  tipo                 ?: string
  ref                  ?: string
  usuarioId            ?: number
  creadorId            ?: number 
  fechaDesde           ?: string
  fechaHasta           ?: string
  origenId             ?: number
  valorMin             ?: number
  valorMax             ?: number 
  estado               ?: INCENTIVO_ESTADO
  razon                ?: INCENTIVO_RAZON
  origenTipo           ?: INCENTIVO_ORIGEN
  pagado               ?: INCENTIVO_ESTADO_PAGO
  limite               ?: number
  offset               ?: number
  orden                ?: "ASC" | "DESC"
}

export interface IBusquedaIncentivo {
  query                 : IQueryIncentivo
  ref                   : string
  usuario               ?: IUsuario
  creador               ?: IUsuario
  desde                 : Date | string
  hasta                 : Date | string
  valorMin              : number | undefined
  valorMax              : number | undefined  
  pagado                : ILabelValue
  estado                : ILabelValue
  resultadosXPage       : number
  pagina                : number
  busquedaVacia         : boolean
}
export class BusquedaIncentivo implements IBusquedaIncentivo
{
  ref                   : string
  usuario               ?: IUsuario
  creador               ?: IUsuario
  desde                 : Date | string
  hasta                 : Date | string  
  valorMin              : number | undefined
  valorMax              : number | undefined  
  pagado                : ILabelValue
  estado                : ILabelValue
  resultadosXPage       : number
  pagina                : number
  busquedaVacia         : boolean  

  constructor()
  {
    this.ref              = ""
    this.desde            = ""
    this.hasta            = ""    
    this.valorMin         = undefined
    this.valorMax         = undefined
    this.pagado           = labelValueNulo
    this.estado           = labelValueNulo
    this.resultadosXPage  = 25
    this.pagina           = 1
    this.busquedaVacia    = true
  }


  get query() : IQueryIncentivo
  {
    const q : IQueryIncentivo         = {}
    if(this.ref.length  > 3)          q.ref             = this.ref
    if(!!this.usuario)                q.usuarioId       = this.usuario.id
    if(!!this.valorMin)               q.valorMin        = this.valorMin
    if(!!this.valorMax)               q.valorMax        = this.valorMax
    if(!!this.estado.label)           q.estado          = this.estado.value
    if(!!this.pagado.label)           q.pagado          = this.pagado.value

/*
    if(this.desde instanceof Date && !isNaN(this.desde.valueOf()))  q.fechaDesde  = this.desde.toLocaleDateString('sv-SE')
    if(this.hasta instanceof Date && !isNaN(this.hasta.valueOf()))  q.fechaHasta  = this.hasta.toLocaleDateString('sv-SE')
*/

    this.busquedaVacia            = !Object.keys(q).length
    if(!this.busquedaVacia){
      q.limite                    = this.resultadosXPage
      q.offset                    = q.limite * (this.pagina - 1)
    }
    
    return q
  }
} 