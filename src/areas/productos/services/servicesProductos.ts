import {  IQueryProducto    } from "src/areas/productos/models/BusquedaProductos"
import {  getURL,
          getFormData     } from "src/composables/APIMaco"
import {  useFetch        } from "src/composables/useFetch"
import {  IProductoDoli,
          ProductoDoli    } from "src/areas/productos/models/ProductoDolibarr"
import {  ToolType, 
          ToolNum         } from "src/composables/useTools"
import {  IProductoHijo,
          ProductoHijo    } from "../models/ProductoHijo"


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
        const hijo            = new ProductoHijo()
              hijo.id         = ToolType.anyToNum( item?.id        ?? 0 )
              hijo.padre_id   = ToolType.anyToNum( item?.padre_id  ?? 0 )
              hijo.hijo_id    = ToolType.anyToNum( item?.hijo_id   ?? 0 )
              hijo.qty        = ToolType.anyToNum( item?.qty       ?? 0 )
              hijo.orden      = ToolType.anyToNum( item?.orden     ?? 0 )
              hijo.linea      = ToolType.anyToNum( item?.linea     ?? 0 )
              hijo.grupo      = ToolType.anyToNum( item?.grupo     ?? 0 )
              hijo.codigo     = ToolType.anyToNum( item?.codigo    ?? 0 )
              hijo.enSiigo    = !!ToolType.anyToNum( item?.enSiigo ?? 0 )
              hijo.ref        = item?.ref     ?? ""
              hijo.nombre     = item?.nombre  ?? ""
        hijos.push( hijo )
      }
    }

    return hijos
  }

  async function marcarEnSiigo( ids : string, on : boolean ) : Promise< boolean >
  {
    const { ok, data }        = await miFetch(  getURL("servicios", "productos"),
                                                { method: "POST", body: getFormData( "marcarEnSiigo", { ids, on } ) },
                                                { mensaje: "marcar en Siigo" }
                                              )
    return ok
  }



  return {
    buscarProducto,
    buscarProductos,
    buscarProductosHijos,
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