
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

/*


buscar
nombre
valorMin         
valorMax       
estados
creadores
activo
dimension
periodo
creador
proveedorId
fechaDesde
fechaHasta
limite
offset

disponible
tipoProducto

modified_by
owner

 */


export interface IProductoProveedor {
  id                  : number
  estado              : string  //  published, draft, deleted
  producto_id         : number  //  id_producto 
  ref                 : string
  nombre              : string
  tipo                : ITipoProductoProveedor
  categoria           : ICategoriaProducto
  familiaNuestra      : string
  familiaProveedor    : string
  descripcion         : string  
  proveedor           : IProveedor
  url                 : string
  hechoEn             : string
  garantia            : string
  garantiaMesas       : number
  precio              : number  
  precioCredito       : number
  precioDolar         : number
  descuento           : number
  costoExtra          : number
  diasEntrega         : number
  precioPromocion     : number  
  calcularDescuento   : boolean
  precioActualizado   : boolean
  stock               : number
  activo              : boolean
  disponible          : boolean  
  creador             : IUsuario
  modifico            : IUsuario
  fechaCreacion       : Date
  fechaCreacionCorta  : string
  fechaEdicion        : Date
  fechaEdicionCorta   : string
  fechaLlegada        : Date
  fechaLlegadaCorta   : string
  orden               : number

  /*
  id                  : number
  estado              : string  //  published, draft, deleted
  producto_id         : number  //  id_producto 
  ref                 : string
  nombre              : string
  tipo                : ITipoProductoProveedor
  categoria           : ICategoriaProducto
  familiaNuestra      : string
  familiaProveedor    : string
  descripcion         : string  
  proveedor           : IProveedor
  url                 : string
  hechoEn             : string
  garantia            : string
  garantiaMesas       : number
  precio              : number  
  precioCredito       : number
  precioDolar         : number
  descuento           : number
  costoExtra          : number
  diasEntrega         : number
  precioPromocion     : number  
  calcularDescuento   : boolean
  precioActualizado   : boolean
  stock               : number
  activo              : boolean
  disponible          : boolean  
  creador             : IUsuario
  modifico            : IUsuario
  fechaCreacion       : Date
  fechaCreacionCorta  : string
  fechaEdicion        : Date
  fechaEdicionCorta   : string
  fechaLlegada        : Date
  fechaLlegadaCorta   : string
  orden               : number  
  */
}

export class ProductoProveedor implements IProductoProveedor
{
  id                  : number                  = 0
  estado              : string                  = ""
  producto_id         : number                  = 0
  ref                 : string                  = ""
  nombre              : string                  = ""
  tipo                : ITipoProductoProveedor  = new TipoProductoProveedor()
  categoria           : ICategoriaProducto      = new CategoriaProducto()
  familiaNuestra      : string                  = ""
  familiaProveedor    : string                  = ""
  descripcion         : string                  = ""
  proveedor           : IProveedor              = new Proveedor()  
  url                 : string                  = ""
  hechoEn             : string                  = ""
  garantia            : string                  = ""
  garantiaMesas       : number                  = 0
  precio              : number                  = 0
  precioCredito       : number                  = 0
  precioDolar         : number                  = 0
  descuento           : number                  = 0  
  costoExtra          : number                  = 0
  diasEntrega         : number                  = 0
  precioPromocion     : number                  = 0  
  calcularDescuento   : boolean                 = false
  precioActualizado   : boolean                 = true
  stock               : number                  = 0
  activo              : boolean                 = true
  disponible          : boolean                 = true  
  creador             : IUsuario                = new Usuario()
  modifico            : IUsuario                = new Usuario()
  fechaCreacion       : Date                    = new Date()
  fechaEdicion        : Date                    = new Date()
  fechaLlegada        : Date                    = new Date()  
  orden               : number                  = 0


  get fechaCreacionCorta()    : string { return ToolDate.fechaCorta( this.fechaCreacion    ) }
  get fechaEdicionCorta()     : string { return ToolDate.fechaCorta( this.fechaEdicion     ) }
  get fechaLlegadaCorta()     : string { return ToolDate.fechaCorta( this.fechaLlegada     ) } 

 // * ////////////////////////////////////////////////////////////////////////// Get new LineaAcuerdo data de API
 static getProductosFromAPI( dataAPI : any ) : IProductoProveedor[]
 {
    const itemsApi                      = JSON.parse( dataAPI )
    const items : IProductoProveedor[]  = []

    if( !Array.isArray( itemsApi ) ) return []
    
    for (const pp of itemsApi)
    {
      const pro               = ProductoProveedor.getProductoFromAPI( pp )
      items.push( pro )
    }
    return items
 }

 // * ////////////////////////////////////////////////////////////////////////// Get new LineaAcuerdo data de API
 static getProductoFromAPI( item : any ) : IProductoProveedor
 {
    const pro                 = new ProductoProveedor()
          pro.ref             = ToolType.keyStringValido( item, "ref"       )
          pro.nombre          = ToolType.keyStringValido( item, "nombre"    )
          //pro.proveedor       = ToolType.keyStringValido( item, "proveedor" )
          pro.hechoEn         = ToolType.keyStringValido( item, "hecho_en"  )
          pro.garantia        = ToolType.keyStringValido( item, "garantia"  )

          pro.activo          = ToolType.keyBoolean( item, "activo"     ) 
          pro.disponible      = ToolType.keyBoolean( item, "disponible" ) 

          pro.id              = ToolType.keyNumberValido( item, "id"            ) 
          pro.precio          = ToolType.keyNumberValido( item, "precio"        ) 
          //pro.proveedor_id    = ToolType.keyNumberValido( item, "proveedor_id"  )
          pro.producto_id     = ToolType.keyNumberValido( item, "producto_id"   )
    return pro
 }

 
}