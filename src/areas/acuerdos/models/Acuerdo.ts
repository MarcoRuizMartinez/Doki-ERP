/*
https://dolibarr.mublex.com/expedition/card.php?action=create&shipping_method_id=9&origin=commande&origin_id=9461&projectid=&entrepot_id=1
https://dolibarr.mublex.com/expedition/card.php?
    action              =create&
    shipping_method_id  =9&
    origin              =commande&
    origin_id           =9461&
    projectid           =&
    entrepot_id         =1
*/
/*
https://dolibarr.mublex.com/fichinter/card.php?action=create&origin=commande&originid=9461&socid=6179
https://dolibarr.mublex.com/fichinter/card.php?
    action              =create&
    origin              =commande&
    originid            =9461&
    socid               =6179

    mdi-hammer

    mdi-truck-delivery
    mdi-truck-fast

    mdi-dolly
    mdi-routes-clock
    mdi-run-fast
    mdi-margin
*/
//* ///////////////////////////////////////// Core
import {  date                              } from "quasar"
import {  getCondicionDePagoDB,
          getFormaDePagoDB,
          getMetodoDeEntregaDB,
          getOrigenContactoDB,
          getTiempoEntregaDB,
          getUsuarioDB,
          getReglaComisionDB
                                            } from "src/composables/useDexie"
import {  TTipoAcuerdo,
          TIPO_ACUERDO,
          EstadosAcuerdos,
          ESTADO_CTZ,
          ESTADO_ACU,
          ESTADO_PED,
          ESTADO_ENT,
                                            } from "./ConstantesAcuerdos"

//* ///////////////////////////////////////// Modelos
import {  IAnticipo                         } from "./Anticipo"
import {  IRetenciones,     Retenciones     } from "./Retenciones"
import {  IProyecto,        Proyecto        } from "src/areas/proyectos/models/Proyecto"
import {  ITercero,         Tercero         } from "src/areas/terceros/models/Tercero"
import {  IUsuario,         Usuario         } from "src/areas/usuarios/models/Usuario"
import {  IContacto,        Contacto        } from "src/areas/terceros/models/Contacto"
import {  ILineaAcuerdo,    LineaAcuerdo    } from "./LineaAcuerdo"
import {  IGrupoLineas,     GrupoLineas     } from "./GrupoLineasAcuerdo"
import {  IComision,        Comision        } from "./Comisiones/Comision"
import {  IEnlaceAcuerdo,   EnlaceAcuerdo   } from "./EnlaceAcuerdo"
import {  ICalificacion,    Calificacion    } from "./Calificacion"
import {  IIncentivo,       Incentivo       } from "src/areas/nomina/models/Incentivo"
import {  ICondicionPago,   CondicionPago   } from "src/models/Diccionarios/CondicionPago"
import {  IFormaPago,       FormaPago       } from "src/models/Diccionarios/FormaPago"
import {  IMetodoEntrega,   MetodoEntrega   } from "src/models/Diccionarios/MetodoEntrega"
import {  IOrigenContacto,  OrigenContacto  } from "src/models/Diccionarios/OrigenContacto"
import {  ITiempoEntrega,   TiempoEntrega   } from "src/models/Diccionarios/TiempoEntrega"
import {  IAccion,          Accion          } from "src/areas/comunicacion/models/Accion"
import {  IArchivo                          } from "src/models/Archivo"
import {  X100,
          fechaCorta,
          getDateToStr,
          getNumberValido,
          getDateToApiDolibarr,
          getMilisecShortForApiDolibarr,    } from "src/composables/useTools"
import {  TModulosDolibarr                  } from "src/composables/UtilFiles"
import {  storeToRefs                       } from 'pinia'
import {  useStoreUser                      } from 'src/stores/user'

export interface IAcuerdo
{
  tipo:                       TIPO_ACUERDO
  label:                      string
  labelEspecial:              string
  labelPlural:                string
  ruta:                       string
  emoji:                      string
  icono:                      string
  imagen:                     string
  modulo:                     TModulosDolibarr
  anticipos:                  IAnticipo[]
  archivos:                   IArchivo[]
  archivosVisor:              IArchivo[]
  esCotizacion:               boolean
  esPedido:                   boolean
  esOCProveedor:              boolean
  esFactura:                  boolean
  esEntrega:                  boolean
  esNuevo:                    boolean
  id:                         number

  ref:                        string
  refCorta:                   string
  refCliente:                 string
  proyectoId:                 number
  proyecto:                   IProyecto

  urlDolibarr:                string
  urlDolibarrOC:              string
  urlDolibarrNuevoEnvio:      string
  urlDolibarrNuevaInsta:      string
  title:                      string // Titulo HTML
  terceroId:                  number
  tercero:                    ITercero
  //terceroNombre:              string
  area:                       string
  enlaces:                    IEnlaceAcuerdo[]
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
  comercial2Id:               number
  comercial2:                 IUsuario
  usuarioEsDueño:             boolean
  creadorId:                  number
  comision:                   IComision
  calificacion:               ICalificacion

  creador:                    IUsuario

  estado:                     number
  estadoIcono:                string
  estadoColor:                string
  estadoLabel:                string 

  esEstadoBoceto:             boolean
  esEstadoNoValidado:         boolean
  esEstadoValido:             boolean // Es cualquier estado que no sea borrador o boceto
  esEstadoEdicion:            boolean
  esEstadoValidado:           boolean // Es especificamente estado Validado
  esEstadoAbierto:            boolean
  esEstadoCotizado:           boolean
  esEstadoFacturado:          boolean
  esEstadoEntregando:         boolean
  esEstadoEntregado:          boolean
  esEstadoAnulado:            boolean
  hayServicios:               boolean
  hayProductos:               boolean

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
  contactos:                  IContacto[]
  contactoComercial:          IContacto
  contactoEntrega:            IContacto
  contactoContable:           IContacto
  contactoSmart:              IContacto
  contactoSmartMun:           string
  contactoSmartDir:           string
  contactoSmartTel:           string

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

  comentarios:                IAccion[]

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
  saldo:                      number
  subTotalLimpio:             number
  retenciones:                IRetenciones
  comisiona:                  boolean
  incentivo:                  IIncentivo
  fechaListo:                 Date      // Productos listos para entregar
  fechaListoCorta:            string
  listoEntregar:              boolean

  /* Solo para entregas */
  acuerdosEnlazados           : IAcuerdo[]
  entregas                    : IAcuerdo[]
  transportadoraId            : number
  numeroGuia                  : string
  pedidoId                    : number
  calcularEntregado           : () => void
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
  enlaces:                    IEnlaceAcuerdo[]
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
  comercial2Id:               number
  comercial2:                 IUsuario
  comision:                   IComision
  calificacion:               ICalificacion
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
  contactos:                  IContacto[]
  contactoComercial:          IContacto
  contactoEntrega:            IContacto
  contactoContable:           IContacto
  productos:                  ILineaAcuerdo[]
  proGrupos:                  IGrupoLineas[]
  condicionPago:              ICondicionPago
  formaPago:                  IFormaPago
  metodoEntrega:              IMetodoEntrega
  origenContacto:             IOrigenContacto
  tiempoEntrega:              ITiempoEntrega
  conIVA:                     boolean
  acuerdosEnlazados:          IAcuerdo[]
  comentarios:                IAccion[]   = []

  /* Solo para cotizaciones */
  titulo:                     string
  fechaFinValidez:            Date
  conTotal:                   boolean

  /* Solo para pedidos */
  facturado:                  boolean
  incentivo:                  IIncentivo
  fechaListo:                 Date
  /* Solo para entregas */
  transportadoraId            : number
  numeroGuia                  : string

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
    this.enlaces              = []
    this.acuerdosEnlazados    = []
    this.fechaCreacion        = new Date()
    this.fechaValidacion      = new Date()
    this.fechaCierre          = new Date(0)
    this.fechaEntrega         = new Date(0)
    this.comercialId          = 0
    this.comercial            = new Usuario()
    this.comercial2Id         = 0
    this.comercial2           = new Usuario()
    this.comision             = new Comision()
    this.calificacion         = new Calificacion( tipo == TIPO_ACUERDO.PEDIDO_CLI ? 2 : 1 )
    this.creadorId            = 0
    this.creador              = new Usuario()
    this.estado               = ESTADO_ACU.NO_GUARDADO
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
    this.contactos            = []
    this.contactoComercial    = new Contacto()
    this.contactoEntrega      = new Contacto()
    this.contactoContable     = new Contacto()
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
    this.incentivo            = new Incentivo()
    this.fechaListo           = new Date(0)

    /* Solo para entregas */
    this.transportadoraId     = 0
    this.numeroGuia           = ""
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
    const label   = this.tipo === TIPO_ACUERDO.COTIZACION_CLI   ? "cotización"
                  : this.tipo === TIPO_ACUERDO.PEDIDO_CLI       ? "pedido"
                  : this.tipo === TIPO_ACUERDO.ENTREGA      ? "entrega"
                  : this.tipo === TIPO_ACUERDO.PEDIDO_PRO ? "pedido proveedor"
                  : this.tipo === TIPO_ACUERDO.FACTURA_CLI  ? "factura"
                  : ""
    return label
  } */

  calcularEntregado()
  {
    if(!this.entregas.length) return
    
    for (const lineaP of this.productos)
    {
      lineaP.qtyProgramado    = 0
      lineaP.qtyEntregado     = 0

      for (const entrega of this.entregas)
      {
        for (const lineaE of entrega.productos)
        {
          if( lineaP.lineaId === lineaE.lineaIdPedido )
          {
            lineaP.qtyProgramado += entrega.esEstadoEntregando  ? lineaE.qty : 0
            lineaP.qtyEntregado  += entrega.esEstadoEntregado   ? lineaE.qty : 0
          }
        }
      }
    }
  }

  get label()       : string { 
    return  Acuerdo.getTipoAcuerdoSingular( this.tipo )
  }
  get labelEspecial()       : string { 
    return    this.esPedido   ? this.condicionPago.label
            : this.esEntrega  ? this.metodoEntrega.label
            : this.label
  }  

  

  get labelPlural() : string { return Acuerdo.getTipoAcuerdoPlural    ( this.tipo ) }
  get icono()       : string { return Acuerdo.getIconoAcuerdo         ( this.tipo ) }
  get emoji()       : string { return Acuerdo.getEmojiAcuerdo         ( this.tipo ) }
  get ruta()        : string { return Acuerdo.getRuta                 ( this.tipo ) }

  //get labelPlural() : string { return getTipoAcuerdoPlural( this.tipo ) }
  //get icono()       : string { return getIconoAcuerdo     ( this.tipo ) }
  //get tipoPlural()  : string { return "" }



  get urlDolibarr() : string {
    const ruta    = this.tipo === TIPO_ACUERDO.COTIZACION_CLI   ? "/comm/propal/card.php?id="
                  : this.tipo === TIPO_ACUERDO.PEDIDO_CLI       ? "/commande/card.php?id="
                  : this.tipo === TIPO_ACUERDO.ENTREGA_CLI      ? "/expedition/card.php?id="
                  : this.tipo === TIPO_ACUERDO.PEDIDO_PRO       ? "/fourn/commande/card.php?id="
                  : this.tipo === TIPO_ACUERDO.FACTURA_CLI      ? ""
                  : ""

    return process.env.URL_DOLIBARR + ruta + this.id
  }

  get urlDolibarrOC() : string {
    return    this.esPedido
            ? process.env.URL_DOLIBARR + "/supplierorderfromorder/ordercustomer.php?show_stock_no_need=yes&id=" + this.id
            : ""
  }

  get urlDolibarrNuevoEnvio() : string
  {
    const doliURL = process.env.URL_DOLIBARR ?? ""
    const url     = doliURL.concat(
                    "/expedition/card.php?action=create&origin=commande&",
                    `shipping_method_id=${this.metodoEntrega.id}&`,
                    `origin_id=${this.id}&`,
                    (!!this.proyecto.id ? `projectid=${this.proyecto.id}&` : ''),
                    `ref_client=${this.refCliente}&`,
                    `note_public=${this.notaPublica}&`,
                    `options_comercial_id=${this.comercial.id}&`,
                    `options_contacto_id=${this.contactoEntrega.id}&`,
                    `note_private=${this.notaPrivada}`
                  )
    return  this .esPedido ? url : ""
  }

  get urlDolibarrNuevaInsta() : string {
    const doliURL = process.env.URL_DOLIBARR ?? ""
    const url   = doliURL.concat(
                  "/fichinter/card.php?action=create&origin=commande&",
                  `originid=${this.id}&`,
                  `socid=${this.terceroId}&`,
                  (!!this.proyecto.id ? `projectid=${this.proyecto.id}&` : ''),
                  `ref_client=${this.refCliente}&`,
                  `note_public=${this.notaPublica}&`,
                  `note_private=${this.notaPrivada}`
                )
    return  this.esPedido ? url : ""
  }

/*
https://dolibarr.mublex.com/expedition/card.php?action=create&shipping_method_id=9&origin=commande&origin_id=9461&projectid=&entrepot_id=1
https://dolibarr.mublex.com/expedition/card.php?

    shipping_method_id  =9&
    origin_id           =9461&
    projectid           =&
    entrepot_id         =1
*/
/*
https://dolibarr.mublex.com/fichinter/card.php?action=create&origin=commande&originid=9461&socid=6179
https://dolibarr.mublex.com/fichinter/card.php?
    ?action=create&origin=commande&
    originid            =9461&
    socid               =6179
*/

  get imagen() :  string {
    const imagen  = this.tipo === TIPO_ACUERDO.COTIZACION_CLI   ? "iconoCotizacion.webp"
                  : this.tipo === TIPO_ACUERDO.PEDIDO_CLI       ? "iconoPedido.webp"
                  : this.tipo === TIPO_ACUERDO.ENTREGA_CLI      ? "iconoEntrega.webp"
                  : this.tipo === TIPO_ACUERDO.PEDIDO_PRO       ? "iconoOCProveedor.webp"
                  : this.tipo === TIPO_ACUERDO.FACTURA_CLI      ? ""
                  : ""
    return imagen
  }

  get modulo() : TModulosDolibarr
  {
    let modulo  : TModulosDolibarr
        modulo  =   this.tipo === TIPO_ACUERDO.COTIZACION_CLI ? "proposal"
                  : this.tipo === TIPO_ACUERDO.PEDIDO_CLI     ? "order"
                  : this.tipo === TIPO_ACUERDO.ENTREGA_CLI    ? "shipment"
                  : this.tipo === TIPO_ACUERDO.FACTURA_CLI    ? "invoice"
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

  get esCotizacion()      : boolean { return this.tipo === TIPO_ACUERDO.COTIZACION_CLI  }
  get esPedido()          : boolean { return this.tipo === TIPO_ACUERDO.PEDIDO_CLI      }
  get esOCProveedor()     : boolean { return this.tipo === TIPO_ACUERDO.PEDIDO_PRO      }
  get esFactura()         : boolean { return this.tipo === TIPO_ACUERDO.FACTURA_CLI     }
  get esEntrega()         : boolean { return this.tipo === TIPO_ACUERDO.ENTREGA_CLI     }
  get municipioTercero()  : string  { return this.tercero.municipio.label               }
  get area()              : string  { return this.tercero.areaNombre                    }
  get vinculado()         : boolean { return !!this.enlaces.length                      }
  get hayServicios()      : boolean { return this.productos.some( p => p.esServicio )   }
  get hayProductos()      : boolean { return this.productos.some( p => p.esProducto )   }
  get listoEntregar()     : boolean { return !!this.fechaListo.valueOf()   }

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
    if(this.aiuOn && !!this.aiuAdmin)
      admin                 = X100( this.totalConDescu, this.aiuAdmin )

    return admin
  }

  // * /////////////////////////////////////////////////////////////////////////////// AIU Imprevistos
  get aiuImpreValor(): number {
    let impre               = 0
    if(this.aiuOn && !!this.aiuImpre)
      impre                 = X100( this.totalConDescu, this.aiuImpre )

    return impre
  }

  // * /////////////////////////////////////////////////////////////////////////////// AIU Utilidad
  get aiuUtiliValor(): number {
    let utili               = 0
    if(this.aiuOn && !!this.aiuUtili)
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
    if(this.aiuOn)
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

  get esEstadoBoceto      ():boolean { return this.estado === ESTADO_ACU.NO_GUARDADO  }
  get esEstadoNoValidado  ():boolean { return this.estado === ESTADO_ACU.BORRADOR || this.estado === ESTADO_ACU.NO_GUARDADO}
  get esEstadoValido      ():boolean { return this.estado   > ESTADO_ACU.BORRADOR     }
  get esEstadoEdicion     ():boolean { return this.estado === ESTADO_ACU.BORRADOR     }
  get esEstadoValidado    ():boolean { return this.estado === ESTADO_ACU.VALIDADO     }
  get esEstadoCotizado    ():boolean { return this.estado === ESTADO_CTZ.COTIZADO     }
  get esEstadoFacturado   ():boolean { return this.estado === ESTADO_CTZ.FACTURADO    }

  get esEstadoEntregando  ():boolean { return   ( this.estado === ESTADO_PED.ENTREGANDO && this.esPedido  )
                                              ||( this.estado === ESTADO_ENT.VALIDADO   && this.esEntrega )  }
  get esEstadoEntregado   ():boolean { return   ( this.estado === ESTADO_PED.ENTREGADO  && this.esPedido  )
                                              ||( this.estado === ESTADO_ENT.ENTREGADO  && this.esEntrega )  }
  get esEstadoAbierto     ():boolean
  {
    let abierto           = false
    if
    (
      ( this.esCotizacion && this.estado == ESTADO_CTZ.COTIZADO )
      ||
      (
        this.esPedido     &&
        ( this.estado == ESTADO_PED.VALIDADO || this.estado == ESTADO_PED.ENTREGANDO )
      )
    )
      abierto             = true
    return abierto
  }
  
  get esEstadoAnulado     ():boolean {
    let anulado           = false
    if
    (
      ( this.esCotizacion && this.estado == ESTADO_CTZ.RECHAZADO )
      ||
      ( this.esPedido     && this.estado == ESTADO_PED.CANCELADO  )
    )
      anulado             = true
    return anulado
  }

  get estadoLabel(): string { return EstadosAcuerdos.estadoToName ( this.tipo, this.estado )}
  get estadoColor(): string { return EstadosAcuerdos.estadoToColor( this.tipo, this.estado )}
  get estadoIcono(): string { return EstadosAcuerdos.estadoIcono  ( this.tipo, this.estado )}
  get comisiona()  : boolean{ return this.esPedido && this.esEstadoEntregado && this.facturado }

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
      final               = 20
    }
    else
    if(this.esPedido){
      inicio              = 7
      final               = 21
    }
    else
    if(this.esOCProveedor){
      inicio              = 9
      final               = 29
    }
    if(this.esEntrega){
      inicio              = 8
      final               = 18
    }

    return this.ref.length > 10 ? this.ref.slice( inicio, final ) : this.ref
  }

  // * ///////////////////////////////////////////////////////////////////////////////
  get pdfNombre() :  string {
    let nombre              = ""
    if(this.esTerceroCtz)
      nombre                = !!this.contactoComercial.empresa ? this.contactoComercial.empresa : this.contactoComercial.nombreCompleto
    else
    if(this.tercero.esEmpresa)
      nombre                = this.tercero.nombre
    else
      nombre                = this.tercero.nombre

    return nombre
  }

  get pdfContacto() :string {
    let contacto            = ""
    const nombreYtel        = this.contactoComercial.nombreCompleto + " - Tel: " + this.contactoComercial.telefono
    if(this.esTerceroCtz)
      contacto              = !!this.contactoComercial.empresa ? nombreYtel : this.contactoComercial.telefono
    else
    if(this.tercero.esEmpresa)
      contacto              = nombreYtel
    else
      contacto              = this.tercero.telefono

    return contacto
  }

  get pdfCorreo() :string {
    let correo              =   this.esTerceroCtz   || this.tercero.esEmpresa
                              ? this.contactoComercial.correo
                              : this.tercero.correo
    return correo
  }


  get archivosVisor() : IArchivo[] { return this.archivos.filter( f => f.esVisualizable ) }

  get pdfCiudad() :string {
    let correo              =   this.esTerceroCtz   || this.tercero.esEmpresa
                              ? this.contactoComercial.municipio.label
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
      titulo                +=  !!this.contactoComercial.empresa
                                ? this.contactoComercial.empresa + " " + this.contactoComercial.nombreCompleto
                                : this.contactoComercial.nombreCompleto
    else
    if(this.tercero.esEmpresa)
      titulo                += this.tercero.nombre + " " + this.contactoComercial.nombreCompleto
    else
      titulo                += this.tercero.nombre

    return titulo
  }

  get fechaFinValidezCorta()  : string { return fechaCorta( this.fechaFinValidez  ) }
  get fechaCreacionCorta()    : string { return fechaCorta( this.fechaCreacion    ) }
  get fechaValidacionCorta()  : string { return fechaCorta( this.fechaValidacion  ) }
  get fechaCierreCorta()      : string { return fechaCorta( this.fechaCierre      ) }
  get fechaEntregaCorta()     : string { return fechaCorta( this.fechaEntrega     ) }
  get fechaListoCorta()       : string { return fechaCorta( this.fechaListo       ) }

  get totalAnticipos()        : number {
    if(!this.anticipos.length) return 0
    const anticipos           = this.anticipos.filter ( a => a.estado === 1 || a.estado === 2 )
    if(!anticipos.length)     return 0
    const sumaPagos           = anticipos     .map    ( ( a : IAnticipo )       : number  => a.valorSumar )
                                              .reduce ( ( v1:number, v2:number) : number  => v1 + v2 )
    return sumaPagos
  }

  get saldo()             : number { return this.totalConIva - this.totalAnticipos }
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

  get contactoSmart() : IContacto {
    if
    (
      ( this.esPedido && !!this.contactoEntrega.id )
      ||
      this.esEntrega
    )
      return this.contactoEntrega
    else 

    return this.contactoComercial
  }

  get contactoSmartMun() : string{ return this.contactoSmart.municipio.label  }
  get contactoSmartDir() : string{ return this.contactoSmart.direccion        }
  get contactoSmartTel() : string{ return this.contactoSmart.telefono         }

  get usuarioEsDueño() : boolean {
    const { usuario }   = storeToRefs( useStoreUser() )
    return this.comercial.id === usuario.value.id 
  }


  get pedidoId()  : number{
    return this.enlaces.find( e => e.origen.tipo === TIPO_ACUERDO.PEDIDO_CLI  )?.origen.id ?? 0
  }

  static getTipoAcuerdoSingular( tipo : TTipoAcuerdo ) : string {
    const label                   = tipo === TIPO_ACUERDO.COTIZACION_CLI  ? "cotización"
                                  : tipo === TIPO_ACUERDO.PEDIDO_CLI      ? "pedido"
                                  : tipo === TIPO_ACUERDO.ENTREGA_CLI     ? "entrega"
                                  : tipo === TIPO_ACUERDO.PEDIDO_PRO      ? "pedido proveedor"
                                  : tipo === TIPO_ACUERDO.FACTURA_CLI     ? "factura"
                                  : ""
    return label
  }

  get entregas() : IAcuerdo[] {
    return this.acuerdosEnlazados.filter( a => a.tipo === TIPO_ACUERDO.ENTREGA_CLI )

/*     if( acuerdo.value.esPedido && item.tipo === TIPO_ACUERDO.ENTREGA_CLI )
    {
      
      acuerdo.value.entregas.push( ...acuerdosI )
    }
 */
  }

  static  getTipoAcuerdoPlural( tipo : TTipoAcuerdo ) : string {
    const singular                = tipo === TIPO_ACUERDO.COTIZACION_CLI  ? "cotizaciones"
                                  : tipo === TIPO_ACUERDO.PEDIDO_CLI      ? "pedidos"
                                  : tipo === TIPO_ACUERDO.ENTREGA_CLI     ? "entregas"
                                  : tipo === TIPO_ACUERDO.PEDIDO_PRO      ? "pedidos proveedor"
                                  : tipo === TIPO_ACUERDO.FACTURA_CLI     ? "facturas"
                                  : ""
    return singular
  }

  static getIconoAcuerdo( tipo : TTipoAcuerdo ) : string {
    const singular                = tipo === TIPO_ACUERDO.COTIZACION_CLI  ? "mdi-format-list-checks"
                                  : tipo === TIPO_ACUERDO.PEDIDO_CLI      ? "mdi-cart"
                                  : tipo === TIPO_ACUERDO.ENTREGA_CLI     ? "mdi-truck-delivery"
                                  : tipo === TIPO_ACUERDO.PEDIDO_PRO      ? "mdi-domain" // mdi-water-well
                                  : tipo === TIPO_ACUERDO.FACTURA_CLI     ? "mdi-inbox-full"
                                  : ""
    return singular
  }
/*
  mdi-file-document-multiple mdi-book-open-variant mdi-newspaper-variant-outline  mdi-inbox-full
  mdi-notebook-check mdi-text-box mdi-ballot mdi-text-box-multiple mdi-text-box-check
  mdi-book-open mdi-book-open-page-variant  mdi-book-open-blank-variant mdi-bookmark-check
  mdi-marker-check
  mdi-book-open mdi-inbox-full
*/
  static getEmojiAcuerdo( tipo : TTipoAcuerdo ) :  string {
    const emoji                 = tipo === TIPO_ACUERDO.COTIZACION_CLI    ? "📜"
                                : tipo === TIPO_ACUERDO.PEDIDO_CLI        ? "🛒"
                                : tipo === TIPO_ACUERDO.ENTREGA_CLI       ? "🚛"
                                : tipo === TIPO_ACUERDO.PEDIDO_PRO        ? "🚛"
                                : tipo === TIPO_ACUERDO.FACTURA_CLI       ? "📄"
                                : "✅"
    return emoji
  }

  static getRuta( tipo : TTipoAcuerdo ) : string{
    const ruta                  = tipo === TIPO_ACUERDO.COTIZACION_CLI    ? "cotizaciones/cliente"
                                : tipo === TIPO_ACUERDO.PEDIDO_CLI        ? "pedidos/cliente"
                                : tipo === TIPO_ACUERDO.ENTREGA_CLI       ? "entregas/cliente"
                                : tipo === TIPO_ACUERDO.PEDIDO_PRO        ? "pedidos/proveedor"
                                : tipo === TIPO_ACUERDO.FACTURA_CLI       ? "facturas"
                                : ""
    return ruta
  }

  // * ///////////////////////////////////////////////////// static convertir data de API en new acuerdo
  static async convertirDataApiToAcuerdo( acuApi : any, tipo : TTipoAcuerdo ) : Promise < IAcuerdo >
  {
    acuApi.id                 = +acuApi.id
    acuApi.terceroId          = +acuApi.terceroId
    acuApi.proyectoId         = +acuApi.proyectoId

    acuApi.creadorId          = +acuApi.usuariId
    acuApi.estado             = +acuApi.estado
    
    acuApi.facturado          = Boolean( +acuApi.facturado )
    acuApi.conTotal           = Boolean( +acuApi.conTotal )
    acuApi.conIVA             = Boolean( +acuApi.conIVA )
    acuApi.aiuOn              = Boolean( +acuApi.aiu )

    acuApi.aiuAdmin           = getNumberValido( acuApi, "aiuAdmin" )
    acuApi.aiuImpre           = getNumberValido( acuApi, "aiuImpre" )
    acuApi.aiuUtili           = getNumberValido( acuApi, "aiuUtili" )
    acuApi.descuento          = getNumberValido( acuApi, "descuento" )
    acuApi.comercialId        = getNumberValido( acuApi, "comercialId" )
    acuApi.comercial2Id       = getNumberValido( acuApi, "comercial2Id" )

    acuApi.condicionPagoId    = +acuApi.condicionPagoId
    acuApi.formaPagoId        = +acuApi.formaPagoId
    acuApi.metodoEntregaId    = +acuApi.metodoEntregaId
    acuApi.origenContactoId   = +acuApi.origenContactoId
    acuApi.tiempoEntregaId    = +acuApi.tiempoEntregaId

    acuApi.fechaCreacion      = getDateToStr( acuApi.fechaCreacion    )
    acuApi.fechaValidacion    = getDateToStr( acuApi.fechaValidacion  )
    acuApi.fechaCierre        = getDateToStr( acuApi.fechaCierre      )
    acuApi.fechaFinValidez    = getDateToStr( acuApi.fechaFinValidez  )
    acuApi.fechaEntrega       = getDateToStr( acuApi.fechaEntrega,  "UTC")
    acuApi.fechaListo         = getDateToStr( acuApi.fechaListo,    "UTC")

    const acu                 = Object.assign( new Acuerdo( tipo ), acuApi ) as IAcuerdo
    acu.esNuevo               = false
    acu.tipo                  = tipo
    acu.conTotal              = acu.esCotizacion ? acu.conTotal : true
    acu.creador               = await getUsuarioDB        ( acu.creadorId )
    acu.enlaces               = EnlaceAcuerdo.enlacesApiToEnlaces( acuApi?.enlaces ?? "", tipo )

    if(!!acu.comercialId){
      acu.comercial           = await getUsuarioDB        ( acu.comercialId )
      acu.comercial.comision  = await getReglaComisionDB  ( acu.comercial.reglaComisionId )
    }
    if(!!acu.comercial2Id){
      acu.comercial2          = await getUsuarioDB       ( acu.comercial2Id )
      acu.comercial2.comision = await getReglaComisionDB ( acu.comercial2.reglaComisionId )
    }

    acu.tercero               = await Tercero.convertirDataApiATercero( acuApi.tercero )

    if( "contactosJSON" in acuApi && !!acuApi.contactosJSON && typeof acuApi.contactosJSON === "string" )
    {
      const contacJSON    = JSON.parse( acuApi.contactosJSON )
      if( Array.isArray(contacJSON) )
      {
        for await (const item of contacJSON)
        {
          const c         = await Contacto.getContactoFromAPIMaco( item )
          c.terceroId     = acuApi.terceroId
          acu.contactos.push( c )

          if( c.esTipoComercial   && !acu.contactoComercial.id )
            acu.contactoComercial = c
          else
          if( c.esTipoContable    && !acu.contactoContable.id )
            acu.contactoContable  = c
          else
          if( c.esTipoEntrega     && !acu.contactoEntrega.id )
            acu.contactoEntrega   = c
        }
      }
    }

    if(!!acu.condicionPagoId)
      acu.condicionPago   = await getCondicionDePagoDB  ( acu.condicionPagoId   )
    
    acu.formaPago         = await getFormaDePagoDB       ( acu.formaPagoId       )
    acu.metodoEntrega     = await getMetodoDeEntregaDB   ( acu.metodoEntregaId   )
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

  static async convertirDataApiToEntrega( ee : any ) : Promise < IAcuerdo >
  {
    const e : any         = {}
    e.id                  = +ee?.id ?? 0
    e.transportadoraId    = +ee?.array_options?.options_transportadora_id ?? 0
    e.facturado           = Boolean( +ee?.billed ?? 0 )
    e.fechaCreacion       = getDateToApiDolibarr( ee?.date_creation ?? "" )
    e.fechaEntrega        = getDateToApiDolibarr( ee?.date_delivery ?? "" )
    e.fechaValidacion     = getDateToApiDolibarr( ee?.date_valid    ?? "" )
    e.ref                 = ee?.ref                 ?? ""
    e.notaPublica         = ee?.note_public         ?? ""
    e.refCliente          = ee?.ref_customer        ?? ""
    e.terceroId           = +ee?.socid              ?? 0
    e.estado              = +ee?.statut             ?? 0
    e.numeroGuia          = ee?.tracking_number     ?? ""
    e.metodoEntregaId     = +ee?.shipping_method_id ?? 0
      

    const entre           = Object.assign( new Acuerdo( TIPO_ACUERDO.ENTREGA_CLI ), e ) as IAcuerdo

    entre.metodoEntrega   = await getMetodoDeEntregaDB( entre.metodoEntregaId )
    return entre
  }

  static async convertirDataApiToEntregas( entregasApi : any[] ) : Promise < IAcuerdo[] >
  {
    const entregas : IAcuerdo[] = []

    for(const entrega of entregasApi)
    {
      const e = await Acuerdo.convertirDataApiToEntrega( entrega )       
      entregas.push( e )
    }

    return entregas
  }


}
/*
id: "2620"
billed
/////
date_creation: 1675442604
date_delivery:  1675918800
date_valid: 1675442609

lines
  id

  label
  description
  entrepot_id
  fk_origin_line
  origin_line_id
  fk_product
  tracking_number
  fk_product_type
  product_label  :   "Silla Shanghai con cabecero"
  product_ref  :   "SIG-3-723"  
  fk_unit
  pa_ht: "282104.00000000"
  price: "421832"
  note_public: "Esta es una nota publica"
  ref: "Entrega-23-02-1535"
  ref_customer: "XX33"
  shipping_method  :   "Recoge en oficina"
  shipping_method_id  :   "9"  
  statut : "1"
  details_entrepot
    entrepot_id
    line_id
    qty_shipped

  qty  :   "1"
  qty_asked  :   "3"
  qty_shipped  :    "1"
  rang  :   "1"
  ref  :   "SIG-3-723"

array_options
  options_transportadora_id


  statutshorts: 
    0 :    StatusSendingDraftShort
    1 :  StatusSendingValidatedShort
    2 :  StatusSendingProcessedShort
    -1 : StatusSendingCanceledShort


*/