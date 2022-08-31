export interface IBusquedaProducto {
  completa?:    number
  recientes?:   number
  busqueda?:    string
  sigla?:       string
  proveedor?:   number
  creador?:     number
  minimo?:      number
  maximo?:      number
  soloConImg?:  number
//limite?:      number
//idUsuarios?:  string | number
//favorito?:    number
//esCliente?:   number
//esProveedor?: number
//municipio?:   string
//area?:        string
//orden?:       "ASC" | "DESC"  
}

import {  getURL,
          getFormData     } from "src/services/APIMaco"
import {  useFetch        } from "src/useSimpleOk/useFetch"
import {  useUsuario      } from "src/useSimpleOk/useUsuario"
import {  IProductoDoli,
          ProductoDoli    } from "src/areas/productos/models/ProductoDolibarr"


export function servicesProductos() 
{
  const { miFetch           } = useFetch()
  const { usuario           } = useUsuario()


  
  async function buscarProductos( query : IBusquedaProducto ) : Promise< IProductoDoli[] >
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