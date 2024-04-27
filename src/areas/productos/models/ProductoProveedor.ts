import {  ToolType, ToolNum           } from "src/composables/useTools"

export interface IProductoProveedor {
  id                  : number
  ref                 : string
  nombre              : string
  proveedor           : string
  proveedor_id        : number
  precio              : number
  activo              : boolean
  disponible          : boolean
}

export class ProductoProveedor implements IProductoProveedor
{
  id                  : number   = 0
  ref                 : string   = ""
  nombre              : string   = ""
  proveedor           : string   = ""
  proveedor_id        : number   = 0
  precio              : number   = 0
  activo              : boolean  = true
  disponible          : boolean  = true
  hechoEn             : string   = ""
  garantia            : string   = ""  

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
          pro.proveedor       = ToolType.keyStringValido( item, "proveedor" )
          pro.hechoEn         = ToolType.keyStringValido( item, "hecho_en"  )
          pro.garantia        = ToolType.keyStringValido( item, "garantia"  )

          pro.activo          = ToolType.keyBoolean( item, "activo"     ) 
          pro.disponible      = ToolType.keyBoolean( item, "disponible" ) 

          pro.id              = ToolType.keyNumberValido( item, "id"            ) 
          pro.precio          = ToolType.keyNumberValido( item, "precio"        ) 
          pro.proveedor_id    = ToolType.keyNumberValido( item, "proveedor_id"  )
    return pro
 }

 
}