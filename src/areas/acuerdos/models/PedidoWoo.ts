import {  ToolDate      } from "src/composables/useTools"
import {  date          } from "quasar"
import {  IMercadoPago  } from "./PagoMercadoPago"

interface IDatos {
	address_1             : string
	address_2             : string
	city                  : string
	company               : string
	email                 : string
	first_name            : string
	last_name             : string
	phone                 : string
}

const datosVoid : IDatos = {
	address_1             : "",
	address_2             : "",
	city                  : "",
	company               : "",
	email                 : "",
	first_name            : "",
	last_name             : "",
	phone                 : "",
}

interface IItems {
	name                  : string
	sku                   : string
	quantity              : number
	total                 : number
	price                 : number
}

interface IMeta {
	id                    : number
	key                   : string
	value                 : string
}

type TEstados           = "🖐🏻" | "🔎" | "✅" | "✖️"
export interface IPedidoWoo
{
  id                    : number
  idPedido              : number
  idTercero             : number
  total                 : number
  total_tax             : number    
  currency              : string  // "COP"  
  payment_method        : string  // "woo-mercado-pago-basic"
  payment_method_title  : string  // "🔒 Pago seguro"  
  status                : string  // "processing"
  date_created          : string  // "2023-05-04T11:25:50"  
  date_modified         : string  // "2023-05-04T11:29:49"  
  date_paid             : string  // "2023-05-04T11:29:49"
  customer_note         : string
  billing               : IDatos
  shipping              : IDatos
  line_items            : IItems[]
  meta_data             : IMeta[]
  estadoCliente         : TEstados
  estadoPago            : TEstados

  nombre                : string
  nombreEnvio           : string
  asesor                : string
  documento             : string
  calificacion          : string
  enOtraDireccion       : boolean
  hace                  : string
  fecha                 : string
  municipioEnvio        : string
  direccionFactura      : string
  direccionEnvio        : string
  telefonos             : string
  estado                : string
  estadoColor           : string
  pagos                 : IMercadoPago[]
  productos             : string
  url                   : string
}

export class PedidoWoo implements IPedidoWoo
{
  id                    : number
  idPedido              : number
  idTercero             : number
  currency              : string 
  payment_method        : string
  payment_method_title  : string 
  status                : string
  total                 : number
  total_tax             : number 
  date_created          : string 
  date_modified         : string 
  date_paid             : string
  customer_note         : string
  billing               : IDatos
  shipping              : IDatos
  line_items            : IItems[]
  meta_data             : IMeta[]
  estadoCliente         : TEstados
  estadoPago            : TEstados
  pagos                 : IMercadoPago[]

  constructor()
  {
    this.id                   = 0
    this.idPedido             = 0
    this.idTercero            = 0
    this.currency             = ""
    this.payment_method       = ""
    this.payment_method_title = ""
    this.status               = ""
    this.total                = 0
    this.total_tax            = 0
    this.date_created         = ""
    this.date_modified        = ""
    this.date_paid            = ""
    this.customer_note        = ""
    this.billing              = datosVoid
    this.shipping             = datosVoid
    this.line_items           = []    
    this.meta_data            = []
    this.estadoCliente        = "🖐🏻"
    this.estadoPago           = "🖐🏻"
    this.pagos                = []
  }

  get nombre          (): string  { return  this.billing.company.length > 4
                                          ? this.billing.company
                                          : `${this.billing.first_name} ${this.billing.last_name}`
                                  }
  get nombreEnvio     (): string  { return  this.shipping.company.length > 4
                                          ? this.shipping.company
                                          : `${this.shipping.first_name} ${this.shipping.last_name}`
                                  }                                  
  get asesor          (): string  { return this.getValueByKey("asesor_") }
  get documento       (): string  { return this.getValueByKey("documento_") }
  get calificacion    (): string  { return this.getValueByKey("noHay") }
  get enOtraDireccion (): boolean { return this.getValueByKey("_ship_to_different_address") !== "no" }
  get hace            (): string  { return ToolDate.diferenciaFechas( Date.parse( this.date_created ), Date.now() ) }
  get fecha           (): string  { return date.formatDate( Date.parse( this.date_created ), 'DD MMM h:mm a' ) }
  get municipioEnvio  (): string  { return this.shipping.city }
  get direccionFactura(): string  { return `${this.billing.city} ${this.billing.address_1} ${this.billing.address_2}` }
  get direccionEnvio  (): string  { return `${this.shipping.address_1} ${this.shipping.address_2}` }
  get telefonos       (): string  { return `${this.billing.phone} ${this.shipping.phone}` }
  get productos       (): string  { return this.line_items.map( p => p.name ).join(",") }
  get estado          (): string  { return  this.status == "processing" ? "Procesando"
                                          : this.status == "cancelled"  ? "Cancelado"
                                          : this.status == "refunded"   ? "Reintegrado"
                                          : this.status == "failed"     ? "Fallido"
                                          : this.status == "completed"  ? "Completado"
                                          : this.status == "on-hold"    ? "En espera"
                                          : this.status == "pending"    ? "Pendiente"
                                          : "WTF"
                                  }
  get estadoColor     (): string  { return  this.status == "processing" ? "#314293"
                                          : this.status == "cancelled"  ? "#9F1A1D"
                                          : this.status == "refunded"   ? "#FF6805"
                                          : this.status == "failed"     ? "#FF0000"
                                          : this.status == "completed"  ? "#008000"
                                          : this.status == "on-hold"    ? "#009797"
                                          : this.status == "pending"    ? "#FF6805"
                                          : "#000"
                                  }                                  
  get url() : string { return `${process.env.URL_MUBLEX}/wp-admin/post.php?post=${this.id}&action=edit` }
  getValueByKey( key : string ) : string {
    return this.meta_data.find( p => p.key.includes( key ) )?.value ?? ""
  }
}