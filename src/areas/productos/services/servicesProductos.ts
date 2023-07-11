import {  IQueryProducto    } from "src/areas/productos/models/BusquedaProductos"
import {  getURL,
          getFormData     } from "src/composables/APIMaco"
import {  useFetch        } from "src/composables/useFetch"
import {  IProductoDoli,
          ProductoDoli    } from "src/areas/productos/models/ProductoDolibarr"
import {  ID_URL_Ok       } from "src/composables/useTools"

export function servicesProductos() 
{
  const { miFetch           } = useFetch()
  //const { permisos          } = storeToRefs( useStoreUser() )  
 
  //* ////////////////////////////////////////////////////////////////////// Buscar Acuerdo 
  async function buscarProducto(  id : string ) : Promise< IProductoDoli | false >
  {
    const idOk                  = ID_URL_Ok( id )
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


  return {
    buscarProducto,
    buscarProductos,
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