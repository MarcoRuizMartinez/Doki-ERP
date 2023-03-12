import {  TIPO_ACUERDO,
          TTipoAcuerdo    } from "src/areas/acuerdos/models/ConstantesAcuerdos"
import {  ILabelValue,
          labelValueNulo  } from "src/models/TiposVarios"
import {  IUsuario        } from "src/areas/usuarios/models/Usuario"

import {  INCENTIVO_ESTADO  } from "src/areas/nomina/models/Incentivo"  

export interface IQueryIncentivo {
  tipo                 ?: string
  ref                  ?: string
  usuario              ?: number
  fechaDesde           ?: string
  fechaHasta           ?: string
  valorMin             ?: number 
  valorMax             ?: number 
  estado               ?: INCENTIVO_ESTADO
  pagado               ?: 0 | 1 | 2         // 0 no pagado, 1 pago parcial, 2 pago total
  limite               ?: number
  offset               ?: number
  orden                ?: "ASC" | "DESC"
}

/*
    this.pagado       = 0                         // 1 Pagado, pagado parcial, no pagado    
    this.estado       = 0                         // 1 Select estado  
*/    

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
    const q : IQueryIncentivo       = {}
/*
    if(this.tercero.length  > 3)      q.tercero         = this.tercero
    if(this.contacto.length > 3)      q.contacto        = this.contacto

    if(!!this.precioMinimo)           q.subtotalMin     = this.precioMinimo
    if(!!this.precioMaximo)           q.subtotalMax     = this.precioMaximo

    if(!!this.estados.length)         q.estados         = this.estados        .map( e => e.value ).join("_")
    if(!!this.origenes.length)        q.origenes        = this.origenes       .map( e => e.value ).join("_")
    if(!!this.condiciones.length)     q.condiciones     = this.condiciones    .map( e => e.value ).join("_")
    if(!!this.formaPago.length)       q.formaPago       = this.formaPago      .map( e => e.value ).join("_")
    if(!!this.entrega.length)         q.entrega         = this.entrega        .map( e => e.value ).join("_")
    if(!!this.estadoAnticipo.length)  q.estadoAnticipo  = this.estadoAnticipo .map( e => e.value ).join("_")
    if(!!this.tipoAnticipo.length)    q.tipoAnticipo    = this.tipoAnticipo   .map( e => e.value ).join("_")

    if(!!this.area.label)           q.area                = this.area.value
    if(!!this.facturado.label)      q.facturado           = this.facturado.value
    if(!!this.conIva.label)         q.conIva              = this.conIva.value
    if(!!this.totalizado.label)     q.conTotal            = this.totalizado.value
    if(!!this.tipoTercero.label)    q.interno             = this.tipoTercero.value
    if(!!this.conOrdenes.label)     q.conOrdenes          = this.conOrdenes.value
    if(!!this.creador)              q.creador             = this.creador.id
    if(this.esOCProveedor && !!this.proveedores.label)
                                    q.proveedorId         = this.proveedores.value
    if(!this.esOCProveedor && !!this.comercial)
                                    q.comercial           = this.comercial.id

    if(this.desde instanceof Date && !isNaN(this.desde.valueOf()))  q.fechaDesde  = this.desde.toLocaleDateString('sv-SE')
    if(this.hasta instanceof Date && !isNaN(this.hasta.valueOf()))  q.fechaHasta  = this.hasta.toLocaleDateString('sv-SE')

    this.busquedaVacia            = !Object.keys(q).length

    if(!this.busquedaVacia){
      q.limite                    = this.resultadosXPage
      q.offset                    = q.limite * (this.pagina - 1)
    }
    */
    return q
  }
} 