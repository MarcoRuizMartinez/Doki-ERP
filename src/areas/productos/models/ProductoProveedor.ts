
import {  ToolDate,
          ToolType,                 } from "src/composables/useTools"  
import {  IUsuario,
          Usuario                   } from "src/areas/usuarios/models/Usuario"
import {  IProveedor,
          Proveedor                 } from "src/models/Diccionarios/Proveedor"
import {  ICategoriaProducto,
          CategoriaProducto         } from "src/areas/productos/models/CategoriaProducto"
import {  ITipoProductoProveedor,
          TipoProductoProveedor,    } from "src/areas/productos/models/TipoProductoProveedor"    
import {  IDiasDespacho,
          DiasDespacho              } from "src/models/Diccionarios/DiasDespacho"
import {  IImagenProducto,
          IMAGEN_DEFAULT,
          ImagenProducto            } from "src/areas/productos/models/ImagenProducto"
import {  getDiasDespachoDB,
          getCategoriaDB,
          getProveedorDB,
          getUsuarioDB              } from "src/composables/useDexie"
          
export interface IProductoProveedor {
  id                  : number  
  idNuestro           : number
  ref                 : string
  refNuestra          : string
  nombre              : string
  nombreNuestro       : string
  estado              : string  //  published, draft, deleted
  tipo                : ITipoProductoProveedor
  orden               : number
  proveedor           : IProveedor
  categoria           : ICategoriaProducto
  img                 : IImagenProducto

  activo              : boolean
  disponible          : boolean    
  gestionStock        : boolean
  stock               : number    

  descripcion         : string  
  url                 : string  
  familiaNuestra      : string
  familiaProveedor    : string  
  hechoEn             : string
  garantia            : string
  garantiaMeses       : number
  diasDespacho        : IDiasDespacho

  precio              : number  
  precioCredito       : number
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
}

export class ProductoProveedor implements IProductoProveedor
{
  id                  : number                  = 0
  idNuestro           : number                  = 0
  ref                 : string                  = ""
  refNuestra          : string                  = ""
  nombre              : string                  = ""
  nombreNuestro       : string                  = ""
  estado              : string                  = ""
  tipo                : ITipoProductoProveedor  = new TipoProductoProveedor()
  orden               : number                  = 0
  proveedor           : IProveedor              = new Proveedor()  
  categoria           : ICategoriaProducto      = new CategoriaProducto()
  img                 : IImagenProducto         = new ImagenProducto()
  activo              : boolean                 = true
  disponible          : boolean                 = true  
  gestionStock        : boolean                 = false
  stock               : number                  = 0
  descripcion         : string                  = ""
  url                 : string                  = ""
  familiaNuestra      : string                  = ""
  familiaProveedor    : string                  = ""
  hechoEn             : string                  = ""
  garantia            : string                  = ""
  garantiaMeses       : number                  = 0
  diasDespacho        : IDiasDespacho           = new DiasDespacho()

  precio              : number                  = 0
  precioCredito       : number                  = 0
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

  get fechaCreacionCorta()    : string { return ToolDate.fechaCorta( this.fechaCreacion    ) }
  get fechaEdicionCorta()     : string { return ToolDate.fechaCorta( this.fechaEdicion     ) }
  get fechaLlegadaCorta()     : string { return ToolDate.fechaCorta( this.fechaLlegada     ) } 

 // * ////////////////////////////////////////////////////////////////////////// Get new LineaAcuerdo data de API
 static async getProductosFromAPI( dataAPI : any ) : Promise< IProductoProveedor[] >
 {
    const productos : IProductoProveedor[]  = []

    if( !Array.isArray( dataAPI ) ) return []
    
    for (const pp of dataAPI)
    {
      const pro               = await ProductoProveedor.getProductoFromAPI( pp )
      productos.push( pro )
    }
    return productos
 }

 // * ////////////////////////////////////////////////////////////////////////// Get new LineaAcuerdo data de API
 static async getProductoFromAPI( productoApi : any ) : Promise< IProductoProveedor >
 {
    if(!productoApi)          return new ProductoProveedor()

    const pApi                = productoApi

    pApi.activo               = ToolType.keyBoolean       ( pApi, "activo" )
    pApi.disponible           = ToolType.keyBoolean       ( pApi, "disponible" )
    pApi.gestionStock         = ToolType.keyBoolean       ( pApi, "gestionStock" )
    pApi.calcularDescuento    = ToolType.keyBoolean       ( pApi, "calcularDescuento" )
    pApi.precioActualizado    = ToolType.keyBoolean       ( pApi, "precioActualizado" )
    pApi.id                   = ToolType.keyNumberValido  ( pApi, "id" )
    pApi.idNuestro            = ToolType.keyNumberValido  ( pApi, "idNuestro" )
    pApi.orden                = ToolType.keyNumberValido  ( pApi, "orden" )
    pApi.stock                = ToolType.keyNumberValido  ( pApi, "stock" )
    pApi.garantiaMeses        = ToolType.keyNumberValido  ( pApi, "garantiaMeses" )
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

    pro.img.url               = pApi?.urlImagen ?? IMAGEN_DEFAULT
    pro.tipo                  = new TipoProductoProveedor( ToolType.keyNumberValido( pApi, "tipo_id" ) )

    pro.proveedor             = await getProveedorDB    ( ToolType.keyNumberValido( pApi, "proveedor_id" ) )
    pro.categoria             = await getCategoriaDB    ( ToolType.keyNumberValido( pApi, "categoria_id" ) )
    pro.diasDespacho          = await getDiasDespachoDB ( ToolType.keyNumberValido( pApi, "diasDespacho_id" ) )
    pro.creador               = await getUsuarioDB      ( ToolType.keyNumberValido( pApi, "creador_id" ) )
    pro.edito                 = await getUsuarioDB      ( ToolType.keyNumberValido( pApi, "edito_id" ) )
    
    return pro
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