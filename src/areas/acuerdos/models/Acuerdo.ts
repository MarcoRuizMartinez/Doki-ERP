import {  X100                              } from "../../../useSimpleOk/useTools"
import {  ILineaAcuerdo,    LineaAcuerdo    } from "../../../areas/acuerdos/models/LineaAcuerdo"
import {  ITercero,         Tercero         } from "../../../areas/terceros/models/Tercero"
import {  IUsuario,         Usuario         } from "../../../areas/usuarios/models/Usuario"
import {  IContacto,        Contacto        } from "../../../areas/terceros/models/Contacto"
import {  ICondicionPago,   CondicionPago   } from "../../../models/Diccionarios/CondicionPago"
import {  IFormaPago,       FormaPago       } from "../../../models/Diccionarios/FormaPago"
import {  IMetodoEntrega,   MetodoEntrega   } from "../../../models/Diccionarios/MetodoEntrega"
import {  IOrigenContacto,  OrigenContacto  } from "../../../models/Diccionarios/OrigenContacto"
import {  IGrupoLineas,     GrupoLineas     } from "../../../areas/acuerdos/models/GrupoLineasAcuerdo"
import {  ITiempoEntrega,   TiempoEntrega   } from "../../../models/Diccionarios/TiempoEntrega"
import {  getCondicionesPagoDB,
          getFormasPagoDB,
          getMetodosEntregaDB,
          getOrigenContactoDB,
          getTiempoEntregaDB,
          getUsuarioDB,
                                            } from "src/services/useDexie"
import {  date                              } from "quasar"
import {  getDateToStr,
          getMilisecShortForApiDolibarr     } from "src/useSimpleOk/useTools"


export enum ESTADO_CTZ
{
  NO_GUARDADO                 = -1,
  BORRADOR                    = 0,
  COTIZADO                    = 1,
  APROBADO                    = 2,
  RECHAZADO                   = 3,
  FACTURADO                   = 4,
}

export enum TIPO_ACUERDO
{
  COTIZACION                  = "cotizaciones", // Igual que el END POINT del servicio
  PEDIDO                      = "pedido",
  ENTREGA                     = "entraga",
  FACTURA                     = "factura",
}


export function estadoCtzToName( estado : number ): string {
  let valor :string         =   estado == ESTADO_CTZ.NO_GUARDADO ? "Boceto"
                              : estado == ESTADO_CTZ.BORRADOR    ? "Edición"
                              : estado == ESTADO_CTZ.COTIZADO    ? "Cotizado"
                              : estado == ESTADO_CTZ.APROBADO    ? "Aprobado"
                              : estado == ESTADO_CTZ.RECHAZADO   ? "Rechazado"
                              : estado == ESTADO_CTZ.FACTURADO   ? "Facturado"
                              : ""
  return valor
}

export function estadoCtzToColor( estado : number ): string
{
  let color :string           = estado == ESTADO_CTZ.NO_GUARDADO ? "#1A1A1A"
                              : estado == ESTADO_CTZ.BORRADOR    ? "#BCBABA"
                              : estado == ESTADO_CTZ.COTIZADO    ? "#0f61dd"
                              : estado == ESTADO_CTZ.APROBADO    ? "#06c700"
                              : estado == ESTADO_CTZ.RECHAZADO   ? "#832362"
                              : estado == ESTADO_CTZ.FACTURADO   ? "#FF6805"
                              : "transparent"
  return color
}

export const estadosCtz       = [
  { value: ESTADO_CTZ.NO_GUARDADO, label: estadoCtzToName( ESTADO_CTZ.NO_GUARDADO ) },
  { value: ESTADO_CTZ.BORRADOR,    label: estadoCtzToName( ESTADO_CTZ.BORRADOR    ) },
  { value: ESTADO_CTZ.COTIZADO,    label: estadoCtzToName( ESTADO_CTZ.COTIZADO    ) },
  { value: ESTADO_CTZ.APROBADO,    label: estadoCtzToName( ESTADO_CTZ.APROBADO    ) },
  { value: ESTADO_CTZ.RECHAZADO,   label: estadoCtzToName( ESTADO_CTZ.RECHAZADO   ) },
  { value: ESTADO_CTZ.FACTURADO,   label: estadoCtzToName( ESTADO_CTZ.FACTURADO   ) },
]

export function estadoStrCtzToColor( estado : string ): string
{
  let color :string           = estado == "Boceto"    ? "#1A1A1A"
                              : estado == "Edición"   ? "#BCBABA"
                              : estado == "Cotizado"  ? "#0f61dd"
                              : estado == "Aprobado"  ? "#06c700"
                              : estado == "Rechazado" ? "#832362"
                              : estado == "Facturado" ? "#FF6805"
                              : "transparent"
  return color
}


export interface IAcuerdo
{
  tipo:                       TIPO_ACUERDO
  esNuevo:                    boolean
  id:                         number
  ref:                        string
  refCorta:                   string
  refCliente:                 string
  title:                      string // Titulo HTML
  terceroId:                  number
  tercero:                    ITercero
  fechaCreacion:              Date
  fechaCreacionCorta:         string
  fechaValidacion:            Date
  fechaValidacionCorta:       string
  fechaCierre:                Date
  fechaCierreCorta:           string
  fechaEntrega:               Date
  fechaEntregaCorta:          string

  comercialId:                number
  comercial:                  IUsuario
  usuariId:                   number      // Creador

  estado:                     number
  estadoIcono:                string
  estadoColor:                string
  estadoLabel:                string
  esEstadoBoceto:             boolean
  esEstadoNoValidado:         boolean
  esEstadoValidado:           boolean

  notaPrivada:                string
  notaPublica:                string

  condicionPagoId:            number
  condicionPago:              ICondicionPago

  formaPagoId:                number
  formaPago:                  IFormaPago

  metodoEntregaId:            number
  metodoEntrega:              IMetodoEntrega

  tiempoEntregaId:            number
  tiempoEntrega:              ITiempoEntrega

  origenContactoId:           number
  origenContacto:             IOrigenContacto

  aiuOn:                      boolean
  aiuAdmin:                   number
  aiuImpre:                   number
  aiuUtili:                   number
  aiuAdminValor:              number
  aiuImpreValor:              number
  aiuUtiliValor:              number
  aiuTotal:                   number

  descuento:                  number
  contacto:                   IContacto
  productos:                  ILineaAcuerdo[]
  proGrupos:                  IGrupoLineas[]

  conIVA:                     boolean

  hayDescuento:               boolean
  descuentoValor:             number      // Descuento valor
  totalSinDescu:              number      // Subtotal sin descuento
  totalConDescu:              number      // Subtotal con descuento
  ivaValor:                   number
  totalConIva:                number

  vinculado:                  boolean     // Tiene un vinculo con otro elemento en dolibarr como facturas o pedidos

  /* Solo para cotizaciones */
  titulo:                     string
  fechaFinValidez:            Date
  fechaFinValidezCorta:       string
  diasValidez:                number
  conTotal:                   boolean
  pdfNombre:                  string
  pdfContacto:                string
  pdfCorreo:                  string
  pdfCiudad:                  string
  esTerceroCtz:               boolean
  getCotizacionForApi:        ( usuarioId : number ) => any
}

export class Acuerdo implements IAcuerdo
{
  tipo:                       TIPO_ACUERDO
  esNuevo:                    boolean
  id:                         number
  ref:                        string
  refCliente:                 string
  terceroId:                  number
  tercero:                    ITercero
  fechaCreacion:              Date
  fechaValidacion:            Date
  fechaCierre:                Date
  fechaEntrega:               Date
  usuariId:                   number
  estado:                     number
  notaPrivada:                string
  notaPublica:                string
  comercialId:                number
  comercial:                  IUsuario
  condicionPagoId:            number
  formaPagoId:                number
  metodoEntregaId:            number
  tiempoEntregaId:            number
  origenContactoId:           number
  aiuOn:                      boolean
  aiuAdmin:                   number
  aiuImpre:                   number
  aiuUtili:                   number
  descuento:                  number
  contacto:                   IContacto
  productos:                  ILineaAcuerdo[]
  proGrupos:                  IGrupoLineas[]
  condicionPago:              ICondicionPago
  formaPago:                  IFormaPago
  metodoEntrega:              IMetodoEntrega
  origenContacto:             IOrigenContacto
  tiempoEntrega:              ITiempoEntrega
  conIVA:                     boolean
  vinculado:                  boolean

  /* Solo para cotizaciones */
  titulo:                     string
  fechaFinValidez:            Date
  conTotal:                   boolean

  constructor()
  {
    this.tipo                 = TIPO_ACUERDO.COTIZACION
    this.esNuevo              = true
    this.id                   = 0
    this.ref                  = ""
    this.refCliente           = ""
    this.terceroId            = 0
    this.tercero              = new Tercero()
    this.fechaCreacion        = new Date()
    this.fechaValidacion      = new Date()
    this.fechaCierre          = new Date(0)
    this.fechaEntrega         = new Date(0)
    this.comercialId          = 0
    this.comercial            = new Usuario()
    this.usuariId             = 0
    this.estado               = 0
    this.notaPrivada          = ''
    this.notaPublica          = ''
    this.condicionPagoId      = 0
    this.formaPagoId          = 0
    this.metodoEntregaId      = 0
    this.tiempoEntregaId      = 0
    this.origenContactoId     = 0
    this.aiuOn                = false
    this.aiuAdmin             = 0
    this.aiuImpre             = 0
    this.aiuUtili             = 0
    this.descuento            = 0
    this.contacto             = new Contacto()
    this.productos            = []
    this.proGrupos            = []
    this.condicionPago        = new CondicionPago()
    this.formaPago            = new FormaPago()
    this.metodoEntrega        = new MetodoEntrega()
    this.origenContacto       = new OrigenContacto()
    this.tiempoEntrega        = new TiempoEntrega()
    this.conIVA               = true
    this.vinculado            = false

    /* Solo para cotizaciones */
    this.titulo               = ""
    this.fechaFinValidez      = new Date(0)
    this.conTotal             = true
  }


  // * /////////////////////////////////////////////////////////////////////////////// Total sin descuento
  get totalSinDescu() :number {
    let sumaProductos       = 0

    if(this.productos.length==0) return 0

    sumaProductos           = this.productos.map    ( ( p:ILineaAcuerdo )     : number => p.totalSinDescu )
                                            .reduce ( ( v1:number, v2:number) : number => v1 + v2 )
    return sumaProductos
  }

  // * /////////////////////////////////////////////////////////////////////////////// Total con descuento
  get totalConDescu() :number {
    let sumaProductos       = 0

    if(this.productos.length==0) return 0

    sumaProductos           = this.productos.map    ( ( p:ILineaAcuerdo )     : number => p.totalConDescu )
                                            .reduce ( ( v1:number, v2:number) : number => v1 + v2 )
    return sumaProductos
  }

  // * /////////////////////////////////////////////////////////////////////////////// Descuento valor
  get descuentoValor() :number {
    return this.totalSinDescu - this.totalConDescu
  }

  // * /////////////////////////////////////////////////////////////////////////////// Descuento valor
  get hayDescuento() :boolean {
    return this.descuentoValor > 0
  }



  // * /////////////////////////////////////////////////////////////////////////////// AIU Administracion
  get aiuAdminValor(): number {
    let admin               = 0
    if(this.aiuOn           && !!this.aiuAdmin)
      admin                 = X100( this.totalConDescu, this.aiuAdmin )

    return admin
  }

  // * /////////////////////////////////////////////////////////////////////////////// AIU Imprevistos
  get aiuImpreValor(): number {
    let impre               = 0
    if(this.aiuOn           && !!this.aiuImpre)
      impre                 = X100( this.totalConDescu, this.aiuImpre )

    return impre
  }

  // * /////////////////////////////////////////////////////////////////////////////// AIU Utilidad
  get aiuUtiliValor(): number {
    let utili               = 0
    if(this.aiuOn           && !!this.aiuUtili)
      utili                 = X100( this.totalConDescu, this.aiuUtili )

    return utili
  }


  // * /////////////////////////////////////////////////////////////////////////////// AIU Total
  get aiuTotal(): number {
    return this.aiuAdminValor + this.aiuImpreValor + this.aiuUtiliValor
  }


  // * /////////////////////////////////////////////////////////////////////////////// IVA valor

  get ivaValor() :number {
    let ivaTotal            = 0
    let ivaX100             = parseInt( process.env.IVA ?? "0" )

    if(this.conIVA          && !this.aiuOn)
      ivaTotal              = X100( this.totalConDescu, ivaX100 )
    else
    if(this.conIVA          && this.aiuOn)
      ivaTotal              = X100( this.aiuUtiliValor, ivaX100 )

    return ivaTotal
  }

  // * /////////////////////////////////////////////////////////////////////////////// TOTAL
  get totalConIva() :number {
    let total               = this.totalConDescu + this.ivaValor

    if(this.aiuOn)
      total                 += this.aiuAdminValor + this.aiuImpreValor + this.aiuUtiliValor

    return total
  }

  get esEstadoBoceto      ():boolean { return this.estado === ESTADO_CTZ.NO_GUARDADO }            
  get esEstadoNoValidado  ():boolean { return this.estado === ESTADO_CTZ.NO_GUARDADO || this.estado === ESTADO_CTZ.BORRADOR}
  get esEstadoValidado    ():boolean { return this.estado > ESTADO_CTZ.BORRADOR }
  // * ///////////////////////////////////////////////////////////////////////////////  Icono
  get estadoIcono(): string {
    let valor :string         =   this.estado == ESTADO_CTZ.NO_GUARDADO ? "mdi-eraser-variant"
                                : this.estado == ESTADO_CTZ.BORRADOR    ? "mdi-circle-edit-outline"
                                : this.estado == ESTADO_CTZ.COTIZADO    ? "mdi-notebook-check"
                                : this.estado == ESTADO_CTZ.APROBADO    ? "mdi-check-decagram"
                                : this.estado == ESTADO_CTZ.RECHAZADO   ? "mdi-close-circle"
                                : this.estado == ESTADO_CTZ.FACTURADO   ? "mdi-lock-check"
                                : ""
    return valor
  }

  // * /////////////////////////////////////////////////////////////////////////////// Color
  get estadoColor(): string { return estadoCtzToColor(this.estado) }

  // * /////////////////////////////////////////////////////////////////////////////// Status o Estado
  get estadoLabel(): string { return estadoCtzToName(this.estado) }

  // * /////////////////////////////////////////////////////////////////////////////// Dias de validez
  get diasValidez(): number {
    const fechaCalculo    = !!this.fechaValidacion.valueOf() ? this.fechaValidacion : this.fechaCreacion
    const   dias          = date.getDateDiff(this.fechaFinValidez, fechaCalculo, "days")
    return  dias
  }

  get refCorta()              : string {
    return this.ref.length > 10 ? this.ref.slice( 5 , 20 ) : this.ref
  }

  get fechaFinValidezCorta()  : string { return this.fechaFinValidez  .toLocaleDateString('sv-SE') }

  // * ///////////////////////////////////////////////////////////////////////////////
  get pdfNombre() :  string {
    let nombre              = ""
    if(this.esTerceroCtz)
      nombre                = !!this.contacto.empresa ? this.contacto.empresa : this.contacto.nombreCompleto
    else
    if(this.tercero.esEmpresa)
      nombre                = this.tercero.nombre
    else
      nombre                = this.tercero.nombre

    return nombre
  }

  get pdfContacto() :string {
    let contacto            = ""
    const nombreYtel        = this.contacto.nombreCompleto + " - Tel: " + this.contacto.telefono
    if(this.esTerceroCtz)
      contacto              = !!this.contacto.empresa ? nombreYtel : this.contacto.telefono
    else
    if(this.tercero.esEmpresa)
      contacto              = nombreYtel
    else
      contacto              = this.tercero.telefono

    return contacto
  }

  get pdfCorreo() :string {
    let correo              =   this.esTerceroCtz   || this.tercero.esEmpresa
                              ? this.contacto.correo
                              : this.tercero.correo
    return correo
  }

  get pdfCiudad() :string {
    let correo              =   this.esTerceroCtz   || this.tercero.esEmpresa
                              ? this.contacto.municipio.label
                              : this.tercero.municipio.label
    return correo
  }

  get esTerceroCtz() : boolean {
    return this.tercero.id === this.comercial.terceroIdCtz
  }

  get title() : string {
    let titulo              = ""

    if(!!this.titulo)
      titulo                = this.titulo + " "

    if(this.esTerceroCtz)
      titulo                +=  !!this.contacto.empresa
                                ? this.contacto.empresa + " " + this.contacto.nombreCompleto
                                : this.contacto.nombreCompleto
    else
    if(this.tercero.esEmpresa)
      titulo                += this.tercero.nombre + " " + this.contacto.nombreCompleto
    else
      titulo                += this.tercero.nombre

    return titulo
  }

  get fechaCreacionCorta()    : string { return this.fechaCreacion    .toLocaleDateString('sv-SE') }
  get fechaValidacionCorta()  : string { return this.fechaValidacion  .toLocaleDateString('sv-SE') }
  get fechaCierreCorta()      : string { return this.fechaCierre      .toLocaleDateString('sv-SE') }
  get fechaEntregaCorta()     : string { return this.fechaEntrega     .toLocaleDateString('sv-SE') }

  getCotizacionForApi( usuarioId : number ) : any {
    let ctzForApi : any = {
      socid:                  this.tercero.id,
      ref_client:             this.refCliente,
      date:                   getMilisecShortForApiDolibarr( new Date() ),
      user_author_id:         usuarioId,
      array_options:
      {
        options_descuento:    0,
        options_vendedor:     this.comercial.nombre,
        options_comercial_id: this.comercial.id,
        options_titulo:       this.titulo,
        options_con_total:    +this.conTotal,
        options_con_iva:      +this.conIVA,
        options_aiuok:        +this.aiuOn,
        options_aiuadmin:     this.aiuAdmin,
        options_aiuimpre:     this.aiuImpre,
        options_aiuutili:     this.aiuUtili
      },
    }

    if(!!this.tiempoEntrega.id)
      ctzForApi.availability_id     = this.tiempoEntrega.id

    if(!!this.origenContacto.id)
      ctzForApi.demand_reason_id    = this.origenContacto.id

    if(!!this.formaPago.id)
      ctzForApi.mode_reglement_id   = this.formaPago.id

    if(!!this.condicionPago.id)
      ctzForApi.cond_reglement_id   = this.condicionPago.id

    if(!!this.metodoEntrega.id)
      ctzForApi.shipping_method_id  = this.metodoEntrega.id

    if(!!this.fechaEntrega.valueOf())
      ctzForApi.date_livraison      = getMilisecShortForApiDolibarr( this.fechaEntrega )

    if(!!this.fechaFinValidez.valueOf())
      ctzForApi.fin_validite        = getMilisecShortForApiDolibarr( this.fechaFinValidez )

    return ctzForApi
  }


  // * ///////////////////////////////////////////////////// static convertir data de API en new Cotizacion
  static async convertirDataApiToAcuerdo( ctzApi : any ) : Promise < IAcuerdo >
  {
    ctzApi.id                 = +ctzApi.id
    ctzApi.terceroId          = +ctzApi.terceroId
    ctzApi.comercialId        = +ctzApi.comercialId
    ctzApi.usuariId           = +ctzApi.usuariId
    ctzApi.estado             = +ctzApi.estado
    ctzApi.descuento          = +ctzApi.descuento
    ctzApi.conTotal           = Boolean( +ctzApi.conTotal )
    ctzApi.conIVA             = Boolean( +ctzApi.conIVA )
    ctzApi.vinculado          = Boolean( +ctzApi.vinculado )
    ctzApi.aiuOn              = Boolean( +ctzApi.aiu )
    ctzApi.aiuAdmin           = +ctzApi.aiuAdmin
    ctzApi.aiuImpre           = +ctzApi.aiuImpre
    ctzApi.aiuUtili           = +ctzApi.aiuUtili

    ctzApi.condicionPagoId    = +ctzApi.condicionPagoId
    ctzApi.formaPagoId        = +ctzApi.formaPagoId
    ctzApi.metodoEntregaId    = +ctzApi.metodoEntregaId
    ctzApi.origenContactoId   = +ctzApi.origenContactoId
    ctzApi.tiempoEntregaId    = +ctzApi.tiempoEntregaId

    ctzApi.fechaCreacion      = getDateToStr( ctzApi.fechaCreacion    )
    ctzApi.fechaValidacion    = getDateToStr( ctzApi.fechaValidacion  )
    ctzApi.fechaCierre        = getDateToStr( ctzApi.fechaCierre      )
    ctzApi.fechaFinValidez    = getDateToStr( ctzApi.fechaFinValidez  )
    ctzApi.fechaEntrega       = getDateToStr( ctzApi.fechaEntrega, "UTC")

    let ctz                   = Object.assign( new Acuerdo(), ctzApi ) as IAcuerdo
        ctz.esNuevo           = false
        ctz.tipo              = TIPO_ACUERDO.COTIZACION
        ctz.comercial         = await getUsuarioDB          ( ctz.comercialId )
        ctz.tercero           = await Tercero.convertirDataApiATercero( ctzApi.tercero )
        ctz.contacto          = await Contacto.getContactoFromAPIMaco( ctzApi.contacto )
        ctz.contacto.terceroId= ctzApi.terceroId
        ctz.condicionPago     = await getCondicionesPagoDB  ( ctz.condicionPagoId   )
        ctz.formaPago         = await getFormasPagoDB       ( ctz.formaPagoId       )
        ctz.metodoEntrega     = await getMetodosEntregaDB   ( ctz.metodoEntregaId   )
        ctz.origenContacto    = await getOrigenContactoDB   ( ctz.origenContactoId  )
        ctz.tiempoEntrega     = await getTiempoEntregaDB    ( ctz.tiempoEntregaId   )
        ctz.productos         = await LineaAcuerdo.getLineaFromAPIMaco( ctz.productos, ctzApi.id )
        ctz.productos         = ctz.productos.sort ( ( a : ILineaAcuerdo, b : ILineaAcuerdo ) =>
                                {
                                  if(a.orden < b.orden) return -1
                                  if(a.orden > b.orden) return 1
                                  return 0;
                                })
        if(ctz.productos.length > 0)
          ctz.proGrupos       = GrupoLineas.productosAgrupoDeProductos( ctz.productos )     
    return ctz
  }
}

