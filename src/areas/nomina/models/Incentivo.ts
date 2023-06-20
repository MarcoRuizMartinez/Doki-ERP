//  ok_rrhh_incentivos_monetarios
import {  IAcuerdo      } from "src/areas/acuerdos/models/Acuerdo"  
import {  getUsuarioDB  } from "src/services/useDexie"
import {  IUsuario,
          Usuario       } from "src/areas/usuarios/models/Usuario"

export const enum INCENTIVO_ESTADO { 
  NULO                = 0,
  ANULADO             = 1,
  APROBADO            = 2,
}

export const enum INCENTIVO_RAZON { 
  NULO                = 0,
  COMISION            = 1,
  BONO                = 2,
  DESCARGO            = 3,
}

export const enum INCENTIVO_ORIGEN { 
  NULO                = 0,
  PEDIDO_CLI          = 1,
  PEDIDO_PRO          = 2,
  PROYECTO            = 3,
  FACTURA             = 4,
  INFORME             = 5,
}

export const enum INCENTIVO_ESTADO_PAGO { 
  NULO                = 0,
  PENDIENTE           = 1,
  PAGO_PARCIAL        = 2,
  PAGO_TOTAL          = 3,
}

export interface IIncentivo {
  id                  : number
  creador             : IUsuario
  creadorLabel        : string
  creadorId           : number  // owner
  modificoId          : number  // modified_by
  creadoEl            : Date    // created_on
  modificadoEl        : Date    // modified_on  
  origenId            : number
  origenRef           : string
  origenURL           : string
  valor               : number
  pagado              : number
  estadoPago          : INCENTIVO_ESTADO_PAGO
  estadoPagoLabel     : string
  usuario             : IUsuario
  usuarioLabel        : string
  usuarioId           : number
  estado              : INCENTIVO_ESTADO  
  razon               : INCENTIVO_RAZON
  origenTipo          : INCENTIVO_ORIGEN
  nota                : string
  esNuevo             : boolean
  esNulo              : boolean
  esEstadoAprobado    : boolean
  esEstadoAnulado     : boolean
  estadoLabel         : string
  razonLabel          : string
  getIncentivoToApi   : ( usuarioId : number, acuerdo : IAcuerdo  )=> any
  esPedidoCli         : boolean
  esPedidoPro         : boolean
}

export class Incentivo implements IIncentivo
{
  id                  : number  
  creador             : IUsuario
  creadorId           : number  
  modificoId          : number  
  creadoEl            : Date    
  modificadoEl        : Date    
  origenId            : number
  origenRef           : string
  valor               : number
  pagado              : number
  usuario             : IUsuario
  usuarioId           : number
  estado              : INCENTIVO_ESTADO
  razon               : INCENTIVO_RAZON
  origenTipo          : INCENTIVO_ORIGEN
  nota                : string

  constructor()
  {
    this.id           = 0
    this.creadorId    = 0
    this.modificoId   = 0
    this.creadoEl     = new Date()
    this.modificadoEl = new Date()
    this.origenId     = 0 
    this.origenRef    = ""
    this.valor        = 0
    this.pagado       = 0
    this.usuarioId    = 0
    this.estado       = 0
    this.razon        = INCENTIVO_RAZON.COMISION
    this.origenTipo   = 0
    this.nota         = ""
    this.creador      = new Usuario()
    this.usuario      = new Usuario()
  }

  get esNuevo() :boolean { return !this.estado }
  get esNulo()  :boolean { return !this.id }

  getIncentivoToApi( usuarioId : number, acuerdo : IAcuerdo ) : any
  {
    return {
      owner           : usuarioId,
      modified_by     : usuarioId,
      origen_id       : acuerdo.id,
      origen_ref      : acuerdo.ref,
      valor           : this.valor,
      pagado          : 0,
      usuario_id      : acuerdo.comercial.id,
      estado          : this.estado,
      razon           : INCENTIVO_RAZON.COMISION,
      origen_tipo     : INCENTIVO_ORIGEN.PEDIDO_CLI,
      nota            : this.nota,
    }
  }

  get esEstadoAprobado  (){ return this.estado === INCENTIVO_ESTADO.APROBADO  }
  get esEstadoAnulado   (){ return this.estado === INCENTIVO_ESTADO.ANULADO   }
  get estadoLabel       (){ return Incentivo.estados    .find( e => e.value === this.estado )?.label ?? "" }
  get razonLabel        (){ return Incentivo.razones    .find( e => e.value === this.razon  )?.label ?? "" }
  get estadoPago        (){ return    this.pagado === this.valor                  ? INCENTIVO_ESTADO_PAGO.PAGO_TOTAL
                                    : this.pagado === 0                           ? INCENTIVO_ESTADO_PAGO.PENDIENTE
                                    : this.pagado > 0 && this.pagado < this.valor ? INCENTIVO_ESTADO_PAGO.PAGO_PARCIAL
                                    :                                               INCENTIVO_ESTADO_PAGO.NULO
                          }
  get estadoPagoLabel   (){ return Incentivo.estadosPago.find( e => e.value === this.estadoPago  )?.label ?? "" }  
  get usuarioLabel      (){ return this.usuario.nombre }
  get creadorLabel      (){ return this.creador.nombre }
  get esPedidoCli       (){ return this.origenTipo === INCENTIVO_ORIGEN.PEDIDO_CLI }
  get esPedidoPro       (){ return this.origenTipo === INCENTIVO_ORIGEN.PEDIDO_PRO }
  get origenURL         (){ return ( this.esPedidoCli ? "/pedidos/cliente/" : "" ) + this.origenId }

  static async getIncentivoToApi( iApi : any ) : Promise< IIncentivo >
  {
    iApi.id           = +(iApi?.id           ?? 0)
    iApi.creadorId    = +(iApi?.creadorId    ?? 0)
    iApi.modificoId   = +(iApi?.modificoId   ?? 0)
    iApi.origenId     = +(iApi?.origenId     ?? 0)
    iApi.valor        = +(iApi?.valor        ?? 0)
    iApi.pagado       = +(iApi?.pagado       ?? 0)
    iApi.usuarioId    = +(iApi?.usuarioId    ?? 0)
    iApi.estado       = +(iApi?.estado       ?? 0)
    iApi.razon        = +(iApi?.razon        ?? 0)
    iApi.origenTipo   = +(iApi?.origenTipo   ?? 0)
    //iApi.creadoEl     = +(iApi?.creadoEl     ?? 0)
    //iApi.modificadoEl = +(iApi?.modificadoEl ?? 0)

    const inc         = Object.assign( new Incentivo(), iApi ) as IIncentivo
    inc.creador       = await getUsuarioDB ( inc.creadorId )
    inc.usuario       = await getUsuarioDB ( inc.usuarioId )
    return inc 
  }

  static async getIncentivosToApi( dataApi : any ) : Promise < IIncentivo[] >
  {
    if( !Array.isArray( dataApi) ) return []

    const incentivos : IIncentivo[] = []

    for(const entrega of dataApi)
    {
      const i = await Incentivo.getIncentivoToApi( entrega )       
      incentivos.push( i )
    }

    return incentivos
  }

  static estados = [
    { value: INCENTIVO_ESTADO.ANULADO,      label: "🧊Congelado"      },
    { value: INCENTIVO_ESTADO.APROBADO,     label: "✅Aplica"     },
  ]

  static razones = [
    { value: INCENTIVO_RAZON.COMISION,      label: "Comisión"     },
    { value: INCENTIVO_RAZON.BONO,          label: "Bono"         },
    { value: INCENTIVO_RAZON.DESCARGO,      label: "Descargo"     },
  ]

  static estadosPago = [
    { value: INCENTIVO_ESTADO_PAGO.NULO,          label:"❌ Sin asignar",   visible: false  },
    { value: INCENTIVO_ESTADO_PAGO.PENDIENTE,     label:"✋ Pendiente",     visible: true   },
    { value: INCENTIVO_ESTADO_PAGO.PAGO_PARCIAL,  label:"🌓 Pago parcial",  visible: true   },
    { value: INCENTIVO_ESTADO_PAGO.PAGO_TOTAL,    label:"💵 Pagado",        visible: true   },
  ]
  
  static origenes = [
    { value: INCENTIVO_ORIGEN.NULO,         label: "Nulo"             },
    { value: INCENTIVO_ORIGEN.PEDIDO_CLI,   label: "Pedido cliente"   },
    { value: INCENTIVO_ORIGEN.PEDIDO_PRO,   label: "Pedido proveedor" },
    { value: INCENTIVO_ORIGEN.PROYECTO,     label: "Proyecto"         },
    { value: INCENTIVO_ORIGEN.FACTURA,      label: "Factura"          },
    { value: INCENTIVO_ORIGEN.INFORME,      label: "Informe"          },
  ]

}