//  ok_rrhh_incentivos_monetarios
import {  IAcuerdo  } from "src/areas/acuerdos/models/Acuerdo"  

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

export interface IIncentivo {
  id                  : number
  creadorId           : number  // owner
  modificoId          : number  // modified_by
  creadoEl            : Date    // created_on
  modificadoEl        : Date    // modified_on  
  origenId            : number
  origenRef           : string
  valor               : number
  pagado              : number
  usuarioId           : number
  estado              : INCENTIVO_ESTADO
  razon               : INCENTIVO_RAZON
  origenTipo          : INCENTIVO_ORIGEN
  nota                : string
  esNuevo             : boolean
  esEstadoAprobado    : boolean
  esEstadoAnulado     : boolean
  estadoLabel         : string
  razonLabel          : string
  getIncentivoToApi   : ( usuarioId : number, acuerdo : IAcuerdo  )=> any
}

export class Incentivo implements IIncentivo
{
  id                  : number
  creadorId           : number  
  modificoId          : number  
  creadoEl            : Date    
  modificadoEl        : Date    
  origenId            : number
  origenRef           : string
  valor               : number
  pagado              : number
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

 
    /*     
    this.origenRef    = ""                        // 1 Input
    this.usuarioId    = 0                         // 1 Select usuario

    this.creadoEl     = new Date()                // 2 Rango fechas

    this.valor        = 0                         // 2 Maximo y minimo
    
    this.pagado       = 0                         // 1 Pagado, pagado parcial, no pagado    
    this.estado       = 0                         // 1 Select estado  
    */
  }

  get esNuevo() { return !this.estado }

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

  get esEstadoAprobado()  { return this.estado === INCENTIVO_ESTADO.APROBADO  }
  get esEstadoAnulado()   { return this.estado === INCENTIVO_ESTADO.ANULADO   }
  get estadoLabel()       { return Incentivo.estados.find( e => e.value === this.estado ).label }
  get razonLabel()        { return Incentivo.razones.find( e => e.value === this.razon  ).label }

  static getIncentivoToApi( iApi : any) : IIncentivo
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

    const inc         = Object.assign( new Incentivo(), iApi )
    console.log("inc: ", inc);
    return inc 
  }

  static estados = [
    { value: INCENTIVO_ESTADO.ANULADO,      label: "❌Anulado"      },
    { value: INCENTIVO_ESTADO.APROBADO,     label: "✅Aprobado"     },
  ]

  static razones = [
    { value: INCENTIVO_RAZON.NULO,          label: "Nulo"         },
    { value: INCENTIVO_RAZON.COMISION,      label: "Comisión"     },
    { value: INCENTIVO_RAZON.BONO,          label: "Bono"         },
    { value: INCENTIVO_RAZON.DESCARGO,      label: "Descargo"     },
  ]

/*   
  static origenes = [
    { value: INCENTIVO_ORIGEN.NULO,         label: "Nulo"             },
    { value: INCENTIVO_ORIGEN.PEDIDO_CLI,   label: "Pedido cliente"   },
    { value: INCENTIVO_ORIGEN.PEDIDO_PRO,   label: "Pedido proveedor" },
    { value: INCENTIVO_ORIGEN.PROYECTO,     label: "Proyecto"         },
    { value: INCENTIVO_ORIGEN.FACTURA,      label: "Factura"          },
    { value: INCENTIVO_ORIGEN.INFORME,      label: "Informe"          },
  ]
*/
}