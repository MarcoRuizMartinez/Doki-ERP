export interface IMercadoPago {
  data                  : any
  id                    : number
  ref                   : string
  fechaAprobado         : Date
  fechaCreado           : Date
  tipoPago              : string
  estado                : string
  estadoDetalles        : string
  moneda                : string
  metodo                : string
  descripcion           : string
  total                 : number
  totalRecibido         : number
  direccion             : string
  telefono              : string
  nombre                : string
  apellido              : string
  nombreCompleto        : string
  usuarioCorreo         : string
  usuarioRegistrado     : string
  correo                : string
  documentoNumero       : string
  documentoTipo         : string
  documento             : string
  aprobado              : boolean
  estadoColor           : string
}

export class MercadoPago implements IMercadoPago
{
  data                  : any

  constructor( data : any = {} )
  {
    this.data           = data
  }


  get id                (): number  { return parseInt( this.data?.id ?? "0" ) }
  get total             (): number  { return parseInt( this.data?.transaction_details?.total_paid_amount ?? "0" ) }
  get totalRecibido     (): number  { return parseInt( this.data?.transaction_details?.net_received_amount ?? "0" ) }  
  get fechaAprobado     (): Date    { return new Date( this.data?.date_approved ?? 0 ) }
  get fechaCreado       (): Date    { return new Date( this.data?.date_created ?? 0 ) }
  get ref               (): string  { return this.data?.external_reference ?? "" }
  get tipoPago          (): string  { return this.data?.payment_type_id ?? "" }
  get estado            (): string  { return this.data?.status ?? "" }
  get estadoDetalles    (): string  { return this.data?.status_detail ?? "" }
  get moneda            (): string  { return this.data?.currency_id ?? "" }
  get metodo            (): string  { return this.data?.payment_method_id ?? "" }
  get descripcion       (): string  { return this.data?.description ?? "" }
  get direccion         (): string  { return this.data?.additional_info?.payer?.address?.street_name ?? "" }
  get telefono          (): string  { return this.data?.additional_info?.payer?.phone?.number ?? "" }
  get nombre            (): string  { return this.data?.additional_info?.payer?.first_name ?? "" }
  get apellido          (): string  { return this.data?.additional_info?.payer?.last_name ?? "" }
  get nombreCompleto    (): string  { return this.nombre +" "+ this.apellido }
  get usuarioCorreo     (): string  { return this.checkDato( this.data?.metadata?.user?.user_email ?? "" ) }
  get usuarioRegistrado (): string  { return this.data?.metadata?.user?.registered_user ?? "" }
  get correo            (): string  { return this.data?.payer?.email ?? "" }
  get documentoNumero   (): string  { return this.data?.payer?.identification?.number ?? "" }
  get documentoTipo     (): string  { return this.data?.payer?.identification?.type ?? "" }
  get documento         (): string  { return this.documentoTipo + " " + this.documentoNumero }
  get aprobado          (): boolean { return this.estado === "approved" }
  get estadoColor       (): string  { return this.aprobado ? "green-10" : "red-14" }

  checkDato( dato : any ) : string
  {
    let v = ""
    if(typeof dato === "number" || typeof dato == "string")
      v = dato.toString()

    return v
  }
}