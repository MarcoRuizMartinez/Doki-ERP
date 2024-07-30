
import {  ToolDate,
          ToolNum,
          ToolType,                 } from "src/composables/useTools"  
import {  IUsuario,
          Usuario                   } from "src/areas/usuarios/models/Usuario"
import {  IProveedor,
          Proveedor                 } from "src/models/Diccionarios/Proveedor"
import {  ICategoriaProducto,
          CategoriaProducto         } from "src/areas/productos/models/CategoriaProducto"
import {  ITipoProductoProveedor,
          TipoProductoProveedor,
          TIPO_PRO_PROVEEDOR       } from "src/areas/productos/models/TipoProductoProveedor"    
import {  IDiasDespacho,
          DiasDespacho              } from "src/models/Diccionarios/DiasDespacho"
import {  MesesGarantia             } from "src/models/Diccionarios/MesesGarantia"
import {  OriginesMadeIn            } from "src/models/Diccionarios/MadeIn"
import {  ILabelValue,  
          labelValueNulo,
          BuscarLabelValue          } from "src/models/TiposVarios"
import {  IImagenProducto,
          IMAGEN_DEFAULT,
          ImagenProducto            } from "src/areas/productos/models/ImagenProducto"
import {  getDiaDespachoDB,
          getCategoriaDB,
          getProveedorDB,
          getUsuarioDB              } from "src/composables/useDexie"


export type THijoPadre = {
  id_componente       : number
  id_compuesto        : number
  cantidad            : number
}

export interface IProductoProveedor {
  id                  : number
  idNuestro           : number
  ref                 : string
  ref_n               : string                //* ///////////////////////////////// _n
  refComparacion_n    : string                //* Ref que se utiliza para comprar si el precio esta bien
  refNuestra          : string
  refPadre            : string
  idPadre             : number
  nombre              : string
  nombre_n            : string                //* ///////////////////////////////// _n
  nombreNuestro       : string
  estado              : string                //  published, draft, deleted
  tipo                : ITipoProductoProveedor
  orden               : number | null
  proveedor           : IProveedor
  categoria           : ICategoriaProducto
  img                 : IImagenProducto
  urlImagen           : string

  activo              : boolean
  activoNuestro       : boolean
  disponible          : boolean
  gestionStock        : boolean
  stock               : number    

  descripcion         : string  
  url                 : string  
  familiaNuestra      : string
  familiaProveedor    : string
  documento           : string
  hechoEn             : ILabelValue
  garantia            : string
  garantiaMeses       : ILabelValue
  diasDespacho        : IDiasDespacho

  precio              : number
  precioConIVA        : number
  precio_n            : number                //* ///////////////////////////////// _n
  diferencia          : number
  diferenciaX100      : number
  precioCredito       : number
  precioCredito_n     : number                //* ///////////////////////////////// _n
  precioDolar         : number
  precioPromocion     : number  
  costoExtra          : number
  descuento           : number
  calcularDescuento   : boolean
  precioActualizado   : boolean

  creador             : IUsuario
  edito               : IUsuario
  fechaCreacion       : Date
  fechaCreacionCorta  : string
  fechaEdicion        : Date
  fechaEdicionCorta   : string
  fechaLlegada        : Date
  fechaLlegadaCorta   : string

  esNuevo             : boolean
  editable            : boolean

  okRef               : boolean     // Para validar que la referencia no exista
  okNombre            : boolean
  okTipo              : boolean
  okProveedor         : boolean
  okCategoria         : boolean
  okHechoEn           : boolean
  //okGarantiaMeses     : boolean
  okPrecio            : boolean
  sePuedeCrear        : boolean
  okRefPadre          : boolean

  cantidad            : number    // Para cuando es modo hijo
  datosCrearApi       : any 
  productoPadreApi    : THijoPadre

  copiarDatos         : ()=> void
  copiarPrecios       : ( key : "precio" | "precioCredito" )=> void
}

export class ProductoProveedor implements IProductoProveedor
{
  id                  : number                  = 0
  idNuestro           : number                  = 0
  ref                 : string                  = ""
  ref_n               : string                  = ""
  refComparacion_n    : string                  = ""
  refNuestra          : string                  = ""
  refPadre            : string                  = ""
  idPadre             : number                  = 0
  nombre              : string                  = ""
  nombre_n            : string                  = ""
  nombreNuestro       : string                  = ""
  estado              : string                  = ""
  tipo                : ITipoProductoProveedor  = new TipoProductoProveedor( TIPO_PRO_PROVEEDOR.SIMPLE )
  orden               : number                  = 0
  proveedor           : IProveedor              = new Proveedor()  
  categoria           : ICategoriaProducto      = new CategoriaProducto()
  img                 : IImagenProducto         = new ImagenProducto()
  urlImagen           : string                  = ""
  activo              : boolean                 = true
  activoNuestro       : boolean                 = false
  disponible          : boolean                 = true
  gestionStock        : boolean                 = false
  stock               : number                  = 0
  descripcion         : string                  = ""
  url                 : string                  = ""
  familiaNuestra      : string                  = ""
  familiaProveedor    : string                  = ""
  documento           : string                  = ""
  hechoEn             : ILabelValue             = labelValueNulo
  garantia            : string                  = ""
  garantiaMeses       : ILabelValue             = labelValueNulo
  diasDespacho        : IDiasDespacho           = new DiasDespacho()

  precio              : number                  = 0
  precio_n            : number                  = 0
  precioCredito       : number                  = 0
  precioCredito_n     : number                  = 0
  precioDolar         : number                  = 0
  precioPromocion     : number                  = 0  
  costoExtra          : number                  = 0
  descuento           : number                  = 0  
  calcularDescuento   : boolean                 = false
  precioActualizado   : boolean                 = true  

  creador             : IUsuario                = new Usuario()
  edito               : IUsuario                = new Usuario()
  fechaCreacion       : Date                    = new Date(0)
  fechaEdicion        : Date                    = new Date(0)
  fechaLlegada        : Date                    = new Date(0)  
  editable            : boolean                 = false
  esNuevo             : boolean                 = false

  okRef               : boolean                 = false
  okNombre            : boolean                 = false
  okTipo              : boolean                 = true
  okProveedor         : boolean                 = false
  okCategoria         : boolean                 = false
  okHechoEn           : boolean                 = false
  //okGarantiaMeses     : boolean                 = false
  okPrecio            : boolean                 = false
  okRefPadre          : boolean                 = true

  cantidad            : number                  = 1

  constructor( modo : "nuevo" | "" = "" )
  {
    this.esNuevo      = modo === "nuevo" 
  }

  get sePuedeCrear()          : boolean{ return this.esNuevo  && this.okRef && this.okNombre && this.okTipo && this.okProveedor && this.okCategoria && this.okHechoEn && this.okPrecio && this.okRefPadre }
  get fechaCreacionCorta()    : string { return ToolDate.fechaCorta( this.fechaCreacion    ) }
  get fechaEdicionCorta()     : string { return ToolDate.fechaCorta( this.fechaEdicion     ) }
  get fechaLlegadaCorta()     : string { return ToolDate.fechaCorta( this.fechaLlegada     ) } 
  get diferencia()            : number { return this.precio_n - this.precio } 
  get precioConIVA()          : number { return ToolNum.X100_Aumento( this.precio, ToolType.anyToNum( process.env.IVA ) ) }
  get diferenciaX100()        : number {
    const x100      = ToolNum.X100_Calcular( this.precio, this.diferencia )
    const redondeo  = Math.round(x100 * 2) / 2
    return redondeo
  }

  get datosCrearApi() : any 
  {
    const objeto = {
      ref                 : this.ref,
      nombre              : this.nombre,
      tipo                : this.tipo.value,
      orden               : this.orden,
      proveedor           : this.proveedor.id,
      categoria           : this.categoria.id,
      activo              : +this.activo,
      disponible          : +this.disponible,
      fechaLlegada        : this.fechaLlegadaCorta,
      gestionStock        : +this.gestionStock,
      stock               : this.stock,    
      descripcion         : this.descripcion, 
      url                 : this.url, 
      urlImagen           : this.urlImagen,
      familiaNuestra      : this.familiaNuestra,
      familiaProveedor    : this.familiaProveedor,
      documento           : this.documento,
      hechoEn             : this.hechoEn.value,
      garantiaMeses       : this.garantiaMeses.value,
      diasDespacho        : this.diasDespacho.id,
      precio              : this.precio,
      precioCredito       : this.precioCredito,   
      precioDolar         : this.precioDolar,
      precioPromocion     : this.precioPromocion,  
      costoExtra          : this.costoExtra,
      descuento           : this.descuento,
      calcularDescuento   : +this.calcularDescuento,
      precioActualizado   : +this.precioActualizado,
    }

    return objeto 
  }

  
  get productoPadreApi() : THijoPadre
  {
    const o : THijoPadre = {
      id_compuesto        : this.id,
      id_componente       : this.idPadre,
      cantidad            : this.cantidad,
    }

    return o
  }

  copiarDatos()
  {
    this.precio_n         = this.precio
    this.precioCredito_n  = this.precioCredito
  }

  copiarPrecios( key : "precio" | "precioCredito" )
  {
    if(key === "precio"         && !!this.precio_n)         this.precio         = this.precio_n
    if(key === "precioCredito"  && !!this.precioCredito_n)  this.precioCredito  = this.precioCredito_n
  }

 // * ////////////////////////////////////////////////////////////////////////// Get new LineaAcuerdo data de API
 static async getProductosProveedorFromAPI( dataAPI : any, editable : boolean = false ) : Promise< IProductoProveedor[] >
 {
   
    const productos : IProductoProveedor[]  = []

    if(typeof dataAPI === "string")
      dataAPI                 = JSON.parse( dataAPI )
    
    if( !Array.isArray( dataAPI ) ) return []
    
    for (const pp of dataAPI)
    {
      const pro               = await ProductoProveedor.getProductoProveedorFromAPI( pp, editable )
      productos.push( pro )
    }
    return productos
 }

 // * ////////////////////////////////////////////////////////////////////////// Get new LineaAcuerdo data de API
 static async getProductoProveedorFromAPI( productoApi : any, editable : boolean = false ) : Promise< IProductoProveedor >
 {
    if(!productoApi)          return new ProductoProveedor()

    const pApi                = productoApi

    pApi.activo               = ToolType.keyBoolean       ( pApi, "activo" )
    pApi.activoNuestro        = ToolType.keyBoolean       ( pApi, "activoNuestro" )
    pApi.disponible           = ToolType.keyBoolean       ( pApi, "disponible" )
    pApi.gestionStock         = ToolType.keyBoolean       ( pApi, "gestionStock" )
    pApi.calcularDescuento    = ToolType.keyBoolean       ( pApi, "calcularDescuento" )
    pApi.precioActualizado    = ToolType.keyBoolean       ( pApi, "precioActualizado" )
    pApi.id                   = ToolType.keyNumberValido  ( pApi, "id" )
    pApi.idNuestro            = ToolType.keyNumberValido  ( pApi, "idNuestro" )
    pApi.orden                = ToolType.keyNumberValido  ( pApi, "orden" ) || undefined
    pApi.stock                = ToolType.keyNumberValido  ( pApi, "stock" )
    pApi.precio               = ToolType.keyNumberValido  ( pApi, "precio" )
    pApi.precioCredito        = ToolType.keyNumberValido  ( pApi, "precioCredito" )
    pApi.precioDolar          = ToolType.keyNumberValido  ( pApi, "precioDolar" )
    pApi.precioPromocion      = ToolType.keyNumberValido  ( pApi, "precioPromocion" )
    pApi.costoExtra           = ToolType.keyNumberValido  ( pApi, "costoExtra" )
    pApi.descuento            = ToolType.keyNumberValido  ( pApi, "descuento" )
    pApi.fechaCreacion        = ToolDate.getDateToStr( ToolType.keyStringValido( pApi, "fechaCreacion"  ) )  
    pApi.fechaEdicion         = ToolDate.getDateToStr( ToolType.keyStringValido( pApi, "fechaEdicion"   ) ) 
    pApi.fechaLlegada         = ToolDate.getDateToStr( ToolType.keyStringValido( pApi, "fechaLlegada"   ) )

    const pro                 = Object.assign( new ProductoProveedor(), pApi ) as IProductoProveedor

    pro.img.url               = pApi?.urlImagenNuestra ?? IMAGEN_DEFAULT
    pro.tipo                  = new TipoProductoProveedor( ToolType.keyNumberValido( pApi, "tipo_id" ) )
    pro.garantiaMeses         = BuscarLabelValue( MesesGarantia,  ToolType.keyNumberValido( pApi, "garantiaMeses" ) )
    pro.hechoEn               = BuscarLabelValue( OriginesMadeIn, ToolType.keyStringValido( pApi, "hechoEn" ) )
    pro.proveedor             = await getProveedorDB    ( ToolType.keyNumberValido( pApi, "proveedor_id" ) )
    pro.categoria             = await getCategoriaDB    ( ToolType.keyNumberValido( pApi, "categoria_id" ) )
    pro.diasDespacho          = await getDiaDespachoDB  ( ToolType.keyNumberValido( pApi, "diasDespacho_id" ) )
    pro.creador               = await getUsuarioDB      ( ToolType.keyNumberValido( pApi, "creador_id" ) )
    pro.edito                 = await getUsuarioDB      ( ToolType.keyNumberValido( pApi, "edito_id" ) )
    pro.editable              = editable
    
    return pro
 }
 
 static getCopiaProducto( origen : IProductoProveedor, destino : IProductoProveedor ) : IProductoProveedor
 {
    destino.ref                = !!destino.ref    ? destino.ref    : origen.ref
    destino.nombre             = !!destino.nombre ? destino.nombre : origen.nombre
    destino.estado             = origen.estado
    //destino.orden              = +(origen.orden ?? 0)
    destino.proveedor          = origen.proveedor
    destino.categoria          = origen.categoria
    destino.activo             = origen.activo
    destino.activoNuestro      = origen.activoNuestro
    destino.disponible         = origen.disponible
    destino.gestionStock       = origen.gestionStock
    destino.descripcion        = origen.descripcion
    destino.url                = origen.url
    destino.familiaNuestra     = origen.familiaNuestra
    destino.familiaProveedor   = origen.familiaProveedor
    destino.documento          = origen.documento
    destino.hechoEn            = origen.hechoEn
    destino.garantia           = origen.garantia
    destino.garantiaMeses      = origen.garantiaMeses
    destino.diasDespacho       = origen.diasDespacho
    destino.precio             = origen.precio
    destino.precioCredito      = origen.precioCredito
    destino.precioDolar        = origen.precioDolar
    destino.precioPromocion    = origen.precioPromocion
    destino.costoExtra         = origen.costoExtra
    destino.descuento          = origen.descuento
    destino.calcularDescuento  = origen.calcularDescuento
    destino.precioActualizado  = origen.precioActualizado
    destino.fechaLlegada       = origen.fechaLlegada

    return destino
 }
}



interface      camposQuePuedeServirDeQuery {
  
  diasDesde            ?: number
  diasHasta            ?: number
  diasDDesde           ?: number
  diasDHasta           ?: number
  aproDesdeDia         ?: number
  aproHastaDia         ?: number
  enviaDesdeDia        ?: number
  enviaHastaDia        ?: number

  
  origenId             ?: number  
  elementoTipo         ?: string
  
}
interface CamposPendientesDeBuscar {  
  idNuestro           : number  // Asignado o no asignadoen la base de datos
  tipo                : ITipoProductoProveedor
  categoria           : ICategoriaProducto  
  
  gestionStock        : boolean  
  hechoEn             : string
  garantia            : string
  diasEntrega         : number
  precioPromocion     : number  
  costoExtra          : number
  descuento           : number
  calcularDescuento   : boolean
  precioActualizado   : boolean
  imagen              : IImagenProducto 
}











/*

ref                 : string                  = ""
nombre              : string                  = ""
tipo                : ITipoProductoProveedor  = new TipoProductoProveedor()
proveedor           : IProveedor              = new Proveedor()  
categoria           : ICategoriaProducto      = new CategoriaProducto()
hechoEn             : ILabelValue             = labelValueNulo
garantiaMeses       : ILabelValue             = labelValueNulo
precio              : number                  = 0

*/