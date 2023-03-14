import {  TIPO_ACUERDO,
          TTipoAcuerdo    } from "src/areas/acuerdos/models/ConstantesAcuerdos"
import {  ILabelValue,
          labelValueNulo  } from "src/models/TiposVarios"
import {  IUsuario        } from "src/areas/usuarios/models/Usuario"
import {  IMunicipio,
          Municipio
                          } from "src/models/Municipio"
import {  INCENTIVO_ESTADO_PAGO
                          } from "src/areas/nomina/models/Incentivo"  

export interface IQueryAcuerdo {
  tipo                 ?: string
  acuerdo              ?: TTipoAcuerdo
  comercial            ?: string | number
  creador              ?: string | number
  tercero              ?: string
  idTercero            ?: number
  contacto             ?: string
  estados              ?: string
  origenes             ?: string
  condiciones          ?: string
  formaPago            ?: string
  entrega              ?: string
  estadoAnticipo       ?: string
  tipoAnticipo         ?: string
  fechaDesde           ?: string
  fechaHasta           ?: string
  proveedorId          ?: number
  subtotalMin          ?: number
  subtotalMax          ?: number
  facturado            ?: number
  conIva               ?: number
  conTotal             ?: number
  interno              ?: number
  conOrdenes           ?: number
  limite               ?: number
  offset               ?: number
  area                 ?: string
  orden                ?: "ASC" | "DESC"
  municipio            ?: number
  municipioContacto    ?: number
  comision             ?: INCENTIVO_ESTADO_PAGO
  //idEspecial?:       number
}

export interface IBusquedaAcuerdo {
  query                 : IQueryAcuerdo
  acuerdo               : TTipoAcuerdo
  tercero               : string
  contacto              : string  
  desde                 : Date | string
  hasta                 : Date | string  
  precioMinimo          : number | undefined
  precioMaximo          : number | undefined  
  estados               : ILabelValue[]
  origenes              : ILabelValue[]
  condiciones           : ILabelValue[]
  formaPago             : ILabelValue[]
  entrega               : ILabelValue[]
  estadoAnticipo        : ILabelValue[]
  tipoAnticipo          : ILabelValue[]
  area                  : ILabelValue
  facturado             : ILabelValue
  conIva                : ILabelValue
  totalizado            : ILabelValue
  tipoTercero           : ILabelValue
  conOrdenes            : ILabelValue
  proveedores           : ILabelValue  
  comision              : ILabelValue
  municipio             : IMunicipio
  municipioContacto     : IMunicipio
  comercial            ?: IUsuario
  creador              ?: IUsuario
  resultadosXPage       : number
  pagina                : number
  esCotizacion          : boolean
  esPedido              : boolean
  esOCProveedor         : boolean
  esEntrega             : boolean
  busquedaVacia         : boolean
}
export class BusquedaAcuerdo implements IBusquedaAcuerdo
{
  acuerdo               : TTipoAcuerdo
  tercero               : string
  contacto              : string  
  desde                 : Date | string
  hasta                 : Date | string  
  precioMinimo          : number | undefined
  precioMaximo          : number | undefined  
  estados               : ILabelValue[]
  origenes              : ILabelValue[]
  condiciones           : ILabelValue[]
  formaPago             : ILabelValue[]
  entrega               : ILabelValue[]
  estadoAnticipo        : ILabelValue[]
  tipoAnticipo          : ILabelValue[]
  area                  : ILabelValue
  facturado             : ILabelValue
  conIva                : ILabelValue
  totalizado            : ILabelValue
  tipoTercero           : ILabelValue
  conOrdenes            : ILabelValue
  proveedores           : ILabelValue
  comision              : ILabelValue
  municipio             : IMunicipio
  municipioContacto     : IMunicipio
  comercial            ?: IUsuario
  creador              ?: IUsuario
  resultadosXPage       : number
  pagina                : number
  busquedaVacia         : boolean

  constructor( acuerdoTipo : TTipoAcuerdo )
  {
    this.acuerdo          = acuerdoTipo
    this.tercero          = ""
    this.contacto         = ""
    this.desde            = ""
    this.hasta            = ""    
    this.precioMinimo     = undefined
    this.precioMaximo     = undefined
    this.estados          = []
    this.origenes         = []
    this.condiciones      = []
    this.formaPago        = []
    this.entrega          = []
    this.estadoAnticipo   = []
    this.tipoAnticipo     = []
    this.area             = labelValueNulo
    this.facturado        = labelValueNulo
    this.conIva           = labelValueNulo
    this.tipoTercero      = labelValueNulo
    this.totalizado       = labelValueNulo
    this.conOrdenes       = labelValueNulo
    this.proveedores      = labelValueNulo
    this.comision         = labelValueNulo
    this.municipio        = new Municipio()
    this.municipioContacto= new Municipio()
    this.resultadosXPage  = 10
    this.pagina           = 1
    this.busquedaVacia    = true
  }

  get esCotizacion()  : boolean { return this.acuerdo === TIPO_ACUERDO.COTIZACION_CLI   }
  get esPedido()      : boolean { return this.acuerdo === TIPO_ACUERDO.PEDIDO_CLI       }
  get esOCProveedor() : boolean { return this.acuerdo === TIPO_ACUERDO.PEDIDO_PRO       }
  get esEntrega()     : boolean { return this.acuerdo === TIPO_ACUERDO.ENTREGA_CLI      }

  get query() : IQueryAcuerdo
  {
    const q : IQueryAcuerdo       = {}

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
    if(!!this.comision.label)       q.comision            = this.comision.value
    if(!!this.conIva.label)         q.conIva              = this.conIva.value
    if(!!this.totalizado.label)     q.conTotal            = this.totalizado.value
    if(!!this.tipoTercero.label)    q.interno             = this.tipoTercero.value
    if(!!this.municipio.id)         q.municipio           = this.municipio.id
    if(!!this.municipioContacto.id) q.municipioContacto   = this.municipioContacto.id
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
    return q
  }
} 