import {  getURL,
          getFormData         } from "src/composables/APIMaco"
import {  useFetch            } from "src/composables/useFetch"
import {  IProductoProveedor,
          ProductoProveedor   } from "../models/ProductoProveedor";
import {  IQuery              } from "src/models/Busqueda"

export function servicesProductosPro() 
{
  const { miFetch           } = useFetch()

  async function buscarProductos( query : IQuery ) : Promise< IProductoProveedor[] >
  {
    return new Promise( async (resolver, rechazar ) =>
    {
      const { data, ok      } = await miFetch( getURL("listas", "productos-proveedores-new"),
                                                    {
                                                      body: getFormData( "", query ),
                                                      method: "POST" 
                                                    },
                                                    {
                                                      mensaje:      "buscar productos proveedores",
                                                      tiempoEspera: 15_000,
                                                      dataEsArray:  true
                                                    }
                                                  )
      let productos : IProductoProveedor[]   = []      
      if(ok && Array.isArray( data ))
      {        
        productos = await ProductoProveedor.getProductosFromAPI( data )         
        //console.log("//* //////////// Productos: ", productos);
        resolver( productos )
      }
      else
      {
        resolver( [] )
      }
    })
  }


  return {
    buscarProductos
  }
}