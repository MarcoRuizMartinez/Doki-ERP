//  ok_rrhh_incentivos_monetarios

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
    this.razon        = 0
    this.origenTipo   = 0
    this.nota         = ""
  }

  get esNuevo() { return !this.estado }

  static estados = [
    { value: INCENTIVO_ESTADO.ANULADO,      label: "❌Anulado"      },
    { value: INCENTIVO_ESTADO.APROBADO,     label: "✅Aprobado"     },
  ]

/*   static razones = [
    { value: INCENTIVO_RAZON.NULO,          label: "Nulo"         },
    { value: INCENTIVO_RAZON.COMISION,      label: "Comisión"     },
    { value: INCENTIVO_RAZON.BONO,          label: "Bono"         },
    { value: INCENTIVO_RAZON.DESCARGO,      label: "Descargo"     },
  ]     */

/*   static origenes = [
    { value: INCENTIVO_ORIGEN.NULO,         label: "Nulo"             },
    { value: INCENTIVO_ORIGEN.PEDIDO_CLI,   label: "Pedido cliente"   },
    { value: INCENTIVO_ORIGEN.PEDIDO_PRO,   label: "Pedido proveedor" },
    { value: INCENTIVO_ORIGEN.PROYECTO,     label: "Proyecto"         },
    { value: INCENTIVO_ORIGEN.FACTURA,      label: "Factura"          },
    { value: INCENTIVO_ORIGEN.INFORME,      label: "Informe"          },
  ]     */
}