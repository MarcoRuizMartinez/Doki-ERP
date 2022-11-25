//* ///////////////////////////////////////// Core
import {  date                              } from "quasar"
import {  getCondicionesPagoDB,
          getFormasPagoDB,
          getMetodosEntregaDB,
          getOrigenContactoDB,
          getTiempoEntregaDB,
          getUsuarioDB,
                                            } from "src/services/useDexie"
import {  TTipoAcuerdo,
          TIPO_ACUERDO,
          ESTADO_CTZ,
          EstadosAcuerdos,          
          ESTADO_PED                        } from "./ConstantesAcuerdos"
//* ///////////////////////////////////////// Modelos
import {  IAnticipo,        Anticipo        } from "./Anticipo"
import {  IRetenciones,     Retenciones     } from "./Retenciones"
import {  IProyecto,        Proyecto        } from "src/areas/proyectos/models/Proyecto"
import {  ILineaAcuerdo,    LineaAcuerdo    } from "src/areas/acuerdos/models/LineaAcuerdo"
import {  ITercero,         Tercero         } from "src/areas/terceros/models/Tercero"
import {  IUsuario,         Usuario         } from "src/areas/usuarios/models/Usuario"
import {  IContacto,        Contacto        } from "src/areas/terceros/models/Contacto"
import {  IGrupoLineas,     GrupoLineas     } from "src/areas/acuerdos/models/GrupoLineasAcuerdo"
import {  IArchivo,         Archivo         } from "src/models/Archivo"
import {  ICondicionPago,   CondicionPago   } from "src/models/Diccionarios/CondicionPago"
import {  IFormaPago,       FormaPago       } from "src/models/Diccionarios/FormaPago"
import {  IMetodoEntrega,   MetodoEntrega   } from "src/models/Diccionarios/MetodoEntrega"
import {  IOrigenContacto,  OrigenContacto  } from "src/models/Diccionarios/OrigenContacto"
import {  ITiempoEntrega,   TiempoEntrega   } from "src/models/Diccionarios/TiempoEntrega"
import {  X100,
          fechaCorta,
          getDateToStr,
          getNumberValido,
          existeYEsValido,
          getMilisecShortForApiDolibarr,    } from "src/useSimpleOk/useTools"
import {  TModulosDolibarr                  } from "src/useSimpleOk/UtilFiles"

export interface IAcuerdo
{
  tipo:                       TIPO_ACUERDO
  label:                      string
  labelPlural:                string
  ruta:                       string
  emoji:                      string
  icono:                      string
  imagen:                     string
  modulo:                     TModulosDolibarr
  anticipos:                  IAnticipo[]
  archivos:                   IArchivo[]
  esCotizacion:               boolean
  esPedido:                   boolean
  esOCProveedor:              boolean
  esNuevo:                    boolean  
  id:                         number
  
  ref:                        string
  refCorta:                   string
  refCliente:                 string
  proyectoId:                 number
  proyecto:                   IProyecto

  urlDolibarr:                string
  urlDolibarrOC:              string
  title:                      string // Titulo HTML
  terceroId:                  number
  tercero:                    ITercero
  //terceroNombre:              string
  area:                       string
  enlaces:                    string
  municipioTercero:           string
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
  //comercialNombre:            string
  creadorId:                  number
  creador:                    IUsuario

  estado:                     number
  estadoIcono:                string
  estadoColor:                string
  estadoLabel:                string

  esEstadoBoceto:             boolean
  esEstadoNoValidado:         boolean
  esEstadoValidado:           boolean
  esEstadoAbierto:            boolean
  esEstadoCotizado:           boolean
  esEstadoFacturado:          boolean

  notaPrivada:                string
  notaPublica:                string

  condicionPagoId:            number
  condicionPago:              ICondicionPago
  condicionPagoLabel:         string  

  formaPagoId:                number
  formaPago:                  IFormaPago
  formaPagoLabel:             string

  metodoEntregaId:            number
  metodoEntrega:              IMetodoEntrega
  metodoEntregaLabel:         string
  
  tiempoEntregaId:            number
  tiempoEntrega:              ITiempoEntrega
  tiempoEntregaLabel:         string

  origenContactoId:           number
  origenContacto:             IOrigenContacto
  origenContactoLabel:        string

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
  puedeCrearSubtotal:         boolean
  puedeCrearNuevoGrupo:       boolean

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
  getAcuerdoForApi:           ( usuarioId : number ) => any
  //reorganizarProductosGrupos: () => void


  /* Solo para pedidos */
  facturado:                  boolean
  totalAnticipos:             number
  diferenciaPagado:           number
  subTotalLimpio:             number
  retenciones:                IRetenciones
}

export class Acuerdo implements IAcuerdo
{
  tipo:                       TTipoAcuerdo
  esNuevo:                    boolean
  id:                         number
  ref:                        string
  refCliente:                 string
  proyectoId:                 number
  proyecto:                   IProyecto
  terceroId:                  number
  tercero:                    ITercero
  anticipos:                  IAnticipo[]
  archivos:                   IArchivo[]
  enlaces:                    string
  fechaCreacion:              Date
  fechaValidacion:            Date
  fechaCierre:                Date
  fechaEntrega:               Date
  creadorId:                  number
  creador:                    IUsuario
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

  /* Solo para cotizaciones */
  titulo:                     string
  fechaFinValidez:            Date
  conTotal:                   boolean

  /* Solo para pedidos */
  facturado:                  boolean

  constructor( tipo : TTipoAcuerdo = TIPO_ACUERDO.NULO )
  {
    this.tipo                 = tipo
    this.esNuevo              = true
    this.id                   = 0
    this.ref                  = ""
    this.refCliente           = ""
    this.terceroId            = 0
    this.tercero              = new Tercero()
    this.anticipos            = []
    this.archivos             = []
    this.proyectoId           = 0
    this.proyecto             = new Proyecto()
    this.enlaces              = ""
    this.fechaCreacion        = new Date()
    this.fechaValidacion      = new Date()
    this.fechaCierre          = new Date(0)
    this.fechaEntrega         = new Date(0)
    this.comercialId          = 0
    this.comercial            = new Usuario()
    this.creadorId            = 0
    this.creador              = new Usuario()
    this.estado               = ESTADO_CTZ.NO_GUARDADO
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

    /* Solo para cotizaciones */
    this.titulo               = ""
    this.fechaFinValidez      = new Date(0)
    this.conTotal             = true

    /* Solo para pedidos */
    this.facturado            = false    
  }
  


/*   reorganizarProductosGrupos()
  {
    let orden                 = 0
    for (const grupo of this.proGrupos)
    {
      if(grupo.tituloCreado)  orden++
      for (let linea of grupo.productos){
        orden++
        linea.orden           = orden
      }

      if(grupo.totalCreado)   orden++
    }
  } */
 
/*   get label() : string {
    const label   = this.tipo === TIPO_ACUERDO.COTIZACION   ? "cotización"
                  : this.tipo === TIPO_ACUERDO.PEDIDO       ? "pedido"
                  : this.tipo === TIPO_ACUERDO.ENTREGA      ? "entrega"
                  : this.tipo === TIPO_ACUERDO.OC_PROVEEDOR ? "pedido proveedor"
                  : this.tipo === TIPO_ACUERDO.FACTURA      ? "factura"
                  : ""
    return label
  } */

  get label()       : string { return Acuerdo.getTipoAcuerdoSingular  ( this.tipo ) }
  get labelPlural() : string { return Acuerdo.getTipoAcuerdoPlural    ( this.tipo ) }
  get icono()       : string { return Acuerdo.getIconoAcuerdo         ( this.tipo ) }
  get emoji()       : string { return Acuerdo.getEmojiAcuerdo         ( this.tipo ) }

  //get labelPlural() : string { return getTipoAcuerdoPlural( this.tipo ) }
  //get icono()       : string { return getIconoAcuerdo     ( this.tipo ) }  
  //get tipoPlural()  : string { return "" } 
  

  get ruta() : string{
    const ruta    = this.tipo === TIPO_ACUERDO.COTIZACION   ? "cotizaciones"
                  : this.tipo === TIPO_ACUERDO.PEDIDO       ? "pedidos"
                  : this.tipo === TIPO_ACUERDO.ENTREGA      ? "entregas"
                  : this.tipo === TIPO_ACUERDO.OC_PROVEEDOR ? "pedidos-proveedor"
                  : this.tipo === TIPO_ACUERDO.FACTURA      ? "facturas"
                  : ""
    return ruta
  }
  
  get urlDolibarr() : string {
    const ruta    = this.tipo === TIPO_ACUERDO.COTIZACION   ? "/comm/propal/card.php?id="
                  : this.tipo === TIPO_ACUERDO.PEDIDO       ? "/commande/card.php?id="
                  : this.tipo === TIPO_ACUERDO.ENTREGA      ? ""
                  : this.tipo === TIPO_ACUERDO.OC_PROVEEDOR ? "/fourn/commande/card.php?id="
                  : this.tipo === TIPO_ACUERDO.FACTURA      ? ""
                  : ""

    return process.env.URL_DOLIBARR + ruta + this.id
  }
  
  get urlDolibarrOC() : string {
    return    this.esPedido
            ? process.env.URL_DOLIBARR + "/supplierorderfromorder/ordercustomer.php?id=" + this.id
            : ""
  }  


  get imagen() :  string {
    const imagen  = this.tipo === TIPO_ACUERDO.COTIZACION   ? "iconoCotizacion.webp"
                  : this.tipo === TIPO_ACUERDO.PEDIDO       ? "iconoPedido.webp"
                  : this.tipo === TIPO_ACUERDO.ENTREGA      ? ""
                  : this.tipo === TIPO_ACUERDO.OC_PROVEEDOR ? "iconoOCProveedor.webp"
                  : this.tipo === TIPO_ACUERDO.FACTURA      ? ""
                  : ""
    return imagen
  } 

  get modulo() : TModulosDolibarr
  {
    let modulo  : TModulosDolibarr
        modulo  =   this.tipo === TIPO_ACUERDO.COTIZACION ? "proposal"
                  : this.tipo === TIPO_ACUERDO.PEDIDO     ? "order"
                  : this.tipo === TIPO_ACUERDO.ENTREGA    ? "shipment"
                  : this.tipo === TIPO_ACUERDO.FACTURA    ? "invoice"
                  : "proposal"
    return modulo
  }


  

  get subTotalLimpio() : number {
    let suma                = 0
    const productosLimpios  = this.productos.filter( p => !p.ref.includes("TRAN-") && !p.ref.includes("EMBA-") )
    if(!!productosLimpios.length)
      suma                  = productosLimpios.map( p => p.totalConDescu ).reduce((acu, now) => acu + now)
    return suma
  }

  get esCotizacion()      : boolean { return this.tipo === TIPO_ACUERDO.COTIZACION  }
  get esPedido()          : boolean { return this.tipo === TIPO_ACUERDO.PEDIDO      }
  get esOCProveedor()     : boolean { return this.tipo === TIPO_ACUERDO.OC_PROVEEDOR}
  get esFactura()         : boolean { return this.tipo === TIPO_ACUERDO.FACTURA     }
  get municipioTercero()  : string  { return this.tercero.municipio.label           }
  get area()              : string  { return this.tercero.areaNombre                }
  get vinculado()         : boolean { return !!this.enlaces.length                  }

  //get comercialNombre() : string { return this.comercial.nombreCompleto }
  //get terceroNombre() : string { return this.tercero.nombre }

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

    if( ( this.conIVA       && !this.aiuOn ) || this.esOCProveedor)
      ivaTotal              = X100( this.totalConDescu, ivaX100 )
    else
    if(this.conIVA          && this.aiuOn)
      ivaTotal              = X100( this.aiuUtiliValor, ivaX100 )

    return ivaTotal
  }

  // * /////////////////////////////////////////////////////////////////////////////// TOTAL
  get totalConIva() :number {    
    let total               = (this.totalConDescu ?? 0 ) + (this.ivaValor ?? 0)

    if(this.aiuOn)
      total                 += this.aiuAdminValor + this.aiuImpreValor + this.aiuUtiliValor

    return total
  }

  get esEstadoBoceto      ():boolean { return this.estado === ESTADO_CTZ.NO_GUARDADO  }
  get esEstadoNoValidado  ():boolean { return this.estado === ESTADO_CTZ.NO_GUARDADO || this.estado === ESTADO_CTZ.BORRADOR}
  get esEstadoValidado    ():boolean { return this.estado   > ESTADO_CTZ.BORRADOR     }
  get esEstadoCotizado    ():boolean { return this.estado === ESTADO_CTZ.COTIZADO     }
  get esEstadoFacturado   ():boolean { return this.estado === ESTADO_CTZ.FACTURADO    }
  get esEstadoAbierto     ():boolean { 
    let abierto           = false
    if
    (
      ( this.esCotizacion && this.estado == ESTADO_CTZ.COTIZADO )
      ||
      (
        this.esPedido     &&
        ( this.estado == ESTADO_PED.VALIDADO || this.estado == ESTADO_PED.PROCESO )
      )
    )
      abierto             = true
    return abierto
  }
  get estadoLabel(): string { return EstadosAcuerdos.estadoToName( this.tipo, this.estado)  }
  get estadoColor(): string { return EstadosAcuerdos.estadoToColor( this.tipo, this.estado) }
  get estadoIcono(): string { return EstadosAcuerdos.estadoIcono( this.tipo, this.estado)   }

  get puedeCrearSubtotal():boolean{
    return this.proGrupos.length > 1 && !!this.proGrupos[1].productos.length
  }

  get puedeCrearNuevoGrupo():boolean{
    const i     = this.proGrupos.length - 1
    return i < 0 ? true : this.proGrupos[i].productos.length > 0
  }

  get condicionPagoLabel()  : string{
    return this.condicionPago.label
  }
  get formaPagoLabel()      : string{
    return   this.formaPago.label    
  }
  get metodoEntregaLabel()  : string{
    return   this.metodoEntrega.label
  }
  get origenContactoLabel() : string{
    return   this.origenContacto.label
  }
  get tiempoEntregaLabel()  : string{
    return   this.tiempoEntrega.label
  }

  // * /////////////////////////////////////////////////////////////////////////////// Dias de validez
  get diasValidez(): number {
    const fechaCalculo    = !!this.fechaValidacion.valueOf() ? this.fechaValidacion : this.fechaCreacion
    const   dias          = date.getDateDiff(this.fechaFinValidez, fechaCalculo, "days")
    return  dias
  }

  get refCorta(): string {
    let inicio            = 0
    let final             = 0
    if(this.esCotizacion){
      inicio              = 6
      final               = 19
    }
    else
    if(this.esPedido){
      inicio              = 7
      final               = 20
    }
    else
    if(this.esOCProveedor){
      inicio              = 9
      final               = 29
    }
    
    return this.ref.length > 10 ? this.ref.slice( inicio, final ) : this.ref
  }

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

  get fechaFinValidezCorta()  : string { return fechaCorta( this.fechaFinValidez  ) }
  get fechaCreacionCorta()    : string { return fechaCorta( this.fechaCreacion    ) }
  get fechaValidacionCorta()  : string { return fechaCorta( this.fechaValidacion  ) }
  get fechaCierreCorta()      : string { return fechaCorta( this.fechaCierre      ) }
  get fechaEntregaCorta()     : string { return fechaCorta( this.fechaEntrega     ) }

  get totalAnticipos()        : number {
    if(!this.anticipos.length) return 0
    const sumaPagos           = this.anticipos.map    ( ( a : IAnticipo )       : number => a.valorSumar )
                                              .reduce ( ( v1:number, v2:number) : number => v1 + v2 )
    return sumaPagos
  }

  get diferenciaPagado()  : number { return this.totalConIva - this.totalAnticipos }
  get retenciones()       : IRetenciones { return new  Retenciones( this.totalConDescu, this.totalAnticipos, this.ivaValor ) }

  getAcuerdoForApi( usuarioId : number ) : any {
    const acuForApi : any = {
      socid:                  this.tercero.id,
      ref_client:             this.refCliente,
      date:                   getMilisecShortForApiDolibarr( new Date() ),
      user_author_id:         usuarioId,
      note_private:           this.notaPrivada,
      note_public:            this.notaPublica,
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
      acuForApi.availability_id     = this.tiempoEntrega.id

    if(!!this.origenContacto.id)
      acuForApi.demand_reason_id    = this.origenContacto.id

    if(!!this.formaPago.id)
      acuForApi.mode_reglement_id   = this.formaPago.id

    if(!!this.condicionPago.id)
      acuForApi.cond_reglement_id   = this.condicionPago.id

    if(!!this.metodoEntrega.id)
      acuForApi.shipping_method_id  = this.metodoEntrega.id

    if(!!this.fechaEntrega.valueOf())
      acuForApi.date_livraison      = getMilisecShortForApiDolibarr( this.fechaEntrega )

    if(!!this.fechaFinValidez.valueOf())
      acuForApi.fin_validite        = getMilisecShortForApiDolibarr( this.fechaFinValidez )

    return acuForApi
  }


  static getTipoAcuerdoSingular( tipo : TTipoAcuerdo ) : string {
    const label                   = tipo === TIPO_ACUERDO.COTIZACION        ? "cotización"
                                  : tipo === TIPO_ACUERDO.PEDIDO            ? "pedido"
                                  : tipo === TIPO_ACUERDO.ENTREGA           ? "entrega"
                                  : tipo === TIPO_ACUERDO.OC_PROVEEDOR      ? "pedido proveedor"
                                  : tipo === TIPO_ACUERDO.FACTURA           ? "factura"
                                  : ""
    return label
  }  

  static  getTipoAcuerdoPlural( tipo : TTipoAcuerdo ) : string {
    const singular                = tipo === TIPO_ACUERDO.COTIZACION        ? "cotizaciones"
                                  : tipo === TIPO_ACUERDO.PEDIDO            ? "pedidos"
                                  : tipo === TIPO_ACUERDO.ENTREGA           ? "entregas"
                                  : tipo === TIPO_ACUERDO.OC_PROVEEDOR      ? "pedidos proveedor"
                                  : tipo === TIPO_ACUERDO.FACTURA           ? "facturas"
                                  : ""
    return singular
  }
  
  static getIconoAcuerdo( tipo : TTipoAcuerdo ) : string {
    const singular                = tipo === TIPO_ACUERDO.COTIZACION        ? "mdi-format-list-checks"
                                  : tipo === TIPO_ACUERDO.PEDIDO            ? "mdi-cart"
                                  : tipo === TIPO_ACUERDO.ENTREGA           ? ""
                                  : tipo === TIPO_ACUERDO.OC_PROVEEDOR      ? "mdi-domain" // mdi-water-well
                                  : tipo === TIPO_ACUERDO.FACTURA           ? ""
                                  : ""
    return singular
  }

  static getEmojiAcuerdo( tipo : TTipoAcuerdo ) :  string {
    const emoji                 = tipo === TIPO_ACUERDO.COTIZACION          ? "📜"
                                : tipo === TIPO_ACUERDO.PEDIDO              ? "🛒"
                                : tipo === TIPO_ACUERDO.ENTREGA             ? "🚛"
                                : tipo === TIPO_ACUERDO.OC_PROVEEDOR        ? "🚛"
                                : tipo === TIPO_ACUERDO.FACTURA             ? "📄"
                                : "✅"
    return emoji
  } 


  // * ///////////////////////////////////////////////////// static convertir data de API en new Cotizacion
  static async convertirDataApiToAcuerdo( acuApi : any, tipo : TTipoAcuerdo ) : Promise < IAcuerdo >
  {
    acuApi.id                 = +acuApi.id
    acuApi.terceroId          = +acuApi.terceroId
    acuApi.proyectoId         = +acuApi.proyectoId
    
    acuApi.creadorId          = +acuApi.usuariId
    acuApi.estado             = +acuApi.estado
    
    acuApi.enlaces            = acuApi.enlaces ?? ""
    acuApi.facturado          = Boolean( +acuApi.facturado )
    acuApi.conTotal           = Boolean( +acuApi.conTotal )

    acuApi.conIVA             = Boolean( +acuApi.conIVA )
    acuApi.aiuOn              = Boolean( +acuApi.aiu )

    acuApi.aiuAdmin           = getNumberValido( acuApi, "aiuAdmin" )
    acuApi.aiuImpre           = getNumberValido( acuApi, "aiuImpre" )
    acuApi.aiuUtili           = getNumberValido( acuApi, "aiuUtili" )
    acuApi.descuento          = getNumberValido( acuApi, "descuento" )
    acuApi.comercialId        = getNumberValido( acuApi, "comercialId" )
    
    acuApi.condicionPagoId    = +acuApi.condicionPagoId
    acuApi.formaPagoId        = +acuApi.formaPagoId
    acuApi.metodoEntregaId    = +acuApi.metodoEntregaId
    acuApi.origenContactoId   = +acuApi.origenContactoId
    acuApi.tiempoEntregaId    = +acuApi.tiempoEntregaId 

    acuApi.fechaCreacion      = getDateToStr( acuApi.fechaCreacion    )
    acuApi.fechaValidacion    = getDateToStr( acuApi.fechaValidacion  )
    acuApi.fechaCierre        = getDateToStr( acuApi.fechaCierre      )
    acuApi.fechaFinValidez    = getDateToStr( acuApi.fechaFinValidez  )
    acuApi.fechaEntrega       = getDateToStr( acuApi.fechaEntrega, "UTC")

    const acu                 = Object.assign( new Acuerdo( tipo ), acuApi ) as IAcuerdo
        acu.esNuevo           = false
        acu.tipo              = tipo
        acu.creador           = await getUsuarioDB          ( acu.creadorId )
        if(!!acu.comercialId)
          acu.comercial       = await getUsuarioDB          ( acu.comercialId )
        acu.tercero           = await Tercero.convertirDataApiATercero( acuApi.tercero )
        acu.contacto          = await Contacto.getContactoFromAPIMaco( acuApi.contacto )
        acu.contacto.terceroId= acuApi.terceroId
        acu.condicionPago     = await getCondicionesPagoDB  ( acu.condicionPagoId   )
        acu.formaPago         = await getFormasPagoDB       ( acu.formaPagoId       )
        acu.metodoEntrega     = await getMetodosEntregaDB   ( acu.metodoEntregaId   )
        acu.origenContacto    = await getOrigenContactoDB   ( acu.origenContactoId  )
        acu.tiempoEntrega     = await getTiempoEntregaDB    ( acu.tiempoEntregaId   )
        acu.productos         = await LineaAcuerdo.getLineaFromAPIMaco( acu.productos, acuApi.id )
        acu.productos         = acu.productos.sort ( ( a : ILineaAcuerdo, b : ILineaAcuerdo ) =>
                                {
                                  if(a.orden < b.orden) return -1
                                  if(a.orden > b.orden) return 1
                                  return 0;
                                })
        if(acu.productos.length > 0)
          acu.proGrupos       = GrupoLineas.getGruposDesdeProductos( acu.productos )
    return acu
  }
}

