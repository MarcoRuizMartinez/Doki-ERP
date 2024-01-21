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
  activo              : boolean  = false
  disponible          : boolean  = false

 // * ////////////////////////////////////////////////////////////////////////// Get new LineaAcuerdo data de API
 static getProductosFromAPI( dataAPI : any ) : IProductoProveedor[]
 {
    const item                          = JSON.parse( dataAPI )
    const items : IProductoProveedor[]  = []

    if( !Array.isArray( item ) ) return []
    
    for (const pp of item)
    {
      const pro               = new ProductoProveedor()
            pro.ref           = ToolType.getString( pp, "ref"       )
            pro.nombre        = ToolType.getString( pp, "nombre"    )
            pro.proveedor     = ToolType.getString( pp, "proveedor" )

            pro.activo        = ToolType.getBoolean( pp, "activo"     ) 
            pro.disponible    = ToolType.getBoolean( pp, "disponible" ) 

            pro.id            = ToolType.getNumberValido( pp, "id"            ) 
            pro.precio        = ToolType.getNumberValido( pp, "precio"        ) 
            pro.proveedor_id  = ToolType.getNumberValido( pp, "proveedor_id"  )

      items.push( pro )
    }
    return items
 }
}