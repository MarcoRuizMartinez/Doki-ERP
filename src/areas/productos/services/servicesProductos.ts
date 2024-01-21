import {  IQueryProducto    } from "src/areas/productos/models/BusquedaProductos"
import {  getURL,
          getFormData       } from "src/composables/APIMaco"
import {  useFetch          } from "src/composables/useFetch"
import {  ImagenProducto    } from '../models/ImagenProducto';
import {  IProductoDoli,
          ProductoDoli      } from "src/areas/productos/models/ProductoDolibarr"
import {  ToolType, 
          ToolNum           } from "src/composables/useTools"
import {  IProductoHijo,
          ProductoHijo      } from "../models/ProductoHijo"
import {  getUnidadDB,
          getNaturalezaDB   } from "src/composables/useDexie"
import {  ProductoProveedor } from "../models/ProductoProveedor";

export function servicesProductos() 
{
  const { miFetch           } = useFetch()
  //const { permisos          } = storeToRefs( useStoreUser() )  
 
  //* ////////////////////////////////////////////////////////////////////// Buscar Acuerdo 
  async function buscarProducto(  id : string ) : Promise< IProductoDoli | false >
  {
    const idOk                  = ToolNum.ID_URL_Ok( id )
    if(  !idOk)                 return false    
    const busqueda              = { tipo: "producto", completa: 1, id: idOk }
    const productos             = await buscarProductos( busqueda )

    if(!!productos.length)      return( productos[0] ) 
    else                        return false
  }
  
  async function buscarProductos( query : IQueryProducto ) : Promise< IProductoDoli[] >
  {
    return new Promise( async (resolver, rechazar ) =>
    {
      let { data, ok            } = await miFetch( getURL("listas", "productos-dolibarr"),
                                                    {
                                                      body: getFormData( "", query ),
                                                      method: "POST" 
                                                    },
                                                    {
                                                      mensaje:      "buscar productos",
                                                      tiempoEspera: 10000,
                                                      dataEsArray:  true
                                                    }
                                                  )
      let productos : IProductoDoli[]   = []

      if(ok && Array.isArray( data ))
      {        
        for (const item of data)
        {
          let producto : IProductoDoli = await ProductoDoli.productoAPItoProducto( item ) 
          productos.push( producto )
        }
        resolver( productos )
      }
      else
      {
        resolver( [] )
      }
    })
  }


  async function buscarProductosHijos( padre_id : number ) : Promise< IProductoHijo[] >
  {
    const { ok, data }        = await miFetch(  getURL("listas", "varios"),
                                                { method: "POST", body: getFormData( "productosHijos", { padre_id } ) },
                                                { dataEsArray: true, mensaje: "buscar productos hijos" }
                                              )
    const hijos : IProductoHijo [] = []
    if( Array.isArray( data ) )
    {
      for (const item of data)
      {
        const hijo                  = new ProductoHijo()
              hijo.ref              = item?.ref     ?? ""
              hijo.nombre           = item?.nombre  ?? ""

              hijo.id               = ToolType.getNumberValido( item, "id"          )
              hijo.padre_id         = ToolType.getNumberValido( item, "padre_id"    )
              hijo.hijo_id          = ToolType.getNumberValido( item, "hijo_id"     )
              hijo.qty              = ToolType.getNumberValido( item, "qty"         )
              hijo.orden            = ToolType.getNumberValido( item, "orden"       )
              hijo.relacion_id      = ToolType.getNumberValido( item, "relacion_id" )
              hijo.precio           = ToolType.getNumberValido( item, "precio"      )
              hijo.costo            = ToolType.getNumberValido( item, "costo"       )

              hijo.img              = new ImagenProducto( item?.img  ?? "" )
              hijo.productosPro     = ProductoProveedor.getProductosFromAPI( item?.proveedores ?? "" )
              hijo.naturaleza       = await getNaturalezaDB( item?.naturaleza_id ?? "0" )
              hijo.unidad           = await getUnidadDB( ToolType.getNumberValido( item, "unidad_id" ) )
        hijos.push( hijo )
      }
    }

    return hijos
  }

  async function buscarProductosHijosSiigo( padre_id : number ) : Promise< IProductoHijo[] >
  {
    const { ok, data }        = await miFetch(  getURL("listas", "varios"),
                                                { method: "POST", body: getFormData( "productosHijosSiigo", { padre_id } ) },
                                                { dataEsArray: true, mensaje: "buscar productos hijos" }
                                              )
    const hijos : IProductoHijo [] = []
    if( Array.isArray( data ) )
    {
      for (const item of data)
      {
        const hijo                  = new ProductoHijo()
              hijo.ref              = item?.ref     ?? ""
              hijo.nombre           = item?.nombre  ?? ""
              hijo.id               = ToolType.getNumberValido( item, "id"        )
              hijo.padre_id         = ToolType.getNumberValido( item, "padre_id"  )
              hijo.hijo_id          = ToolType.getNumberValido( item, "hijo_id"   )
              hijo.qty              = ToolType.getNumberValido( item, "qty"       )
              hijo.orden            = ToolType.getNumberValido( item, "orden"     )              
              hijo.siigo.linea      = ToolType.getNumberValido( item, "linea"     )
              hijo.siigo.grupo      = ToolType.getNumberValido( item, "grupo"     )
              hijo.siigo.codigo     = ToolType.getNumberValido( item, "codigo"    )
              hijo.siigo.enSiigo    = !!ToolType.getNumberValido( item, "enSiigo" )
              hijo.siigo.unidadDian = (await getUnidadDB( ToolType.getNumberValido( item, "unidad_id" ) )).codigo
        hijos.push( hijo )
      }
    }

    return hijos
  }

  async function marcarEnSiigo( ids : string, on : boolean ) : Promise< boolean >
  {
    const { ok }              = await miFetch(  getURL("servicios", "productos"),
                                                { method: "POST", body: getFormData( "marcarEnSiigo", { ids, on } ) },
                                                { mensaje: "marcar en Siigo" }
                                              )
    return ok
  }



  return {
    buscarProducto,
    buscarProductos,
    buscarProductosHijos,
    buscarProductosHijosSiigo,
    marcarEnSiigo,
  }
}


/*
export async function buscarProductoDolibarr({}, {busqueda = '', sigla = '', proveedor = '', creador = '', completa = false, masRecientes = false} )
{
    const   varPost                     = new FormData()
            varPost.append('busqueda',  busqueda)
            varPost.append('sigla',     sigla)
            varPost.append('proveedor', proveedor)
            varPost.append('creador',   creador)
            varPost.append('completa',  +completa)
            varPost.append('recientes', +masRecientes)
            
    try{
        let respuesta = await miAxios.post('/_maco/webservices/listas/productos-dolibarr.php', varPost)
        return respuesta.data
    }
    catch(error)
    {
        console.error(error);
        Notify.create({ type: "negative", message: "Error en buscarProductoDolibarr " + error })
        return -1   
    }
}
*/