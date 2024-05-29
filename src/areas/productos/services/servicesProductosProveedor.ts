import {  getURL,
          getFormData         } from "src/composables/APIMaco"
import {  useFetch            } from "src/composables/useFetch"
import {  IProductoProveedor,
          ProductoProveedor   } from "../models/ProductoProveedor";
import {  IQuery              } from "src/models/Busqueda"
import {  TDatosEvento        } from "components/utilidades/AgGrid/AGTools"

export function servicesProductosPro() 
{
  const { miFetch           } = useFetch()

  async function buscarProductos( query : IQuery, editable : boolean = false ) : Promise< IProductoProveedor[] >
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
        productos = await ProductoProveedor.getProductosFromAPI( data, editable )         
        //console.log("//* //////////// Productos: ", productos);
        resolver( productos )
      }
      else
      {
        resolver( [] )
      }
    })
  }


  async function editarCampoEnLote( campo : string, datos : TDatosEvento[], usuarioId : number ) : Promise< boolean >
  {
    const datosEnviar         = datos.map( d => { return { id: d.data?.id, value: d.value }})
    return new Promise( async (resolver, rechazar ) =>
    {
      const objeto            = { field: campo, usuario: usuarioId, datos: JSON.stringify( datosEnviar ) }  
      const { data, ok      } = await miFetch( getURL("servicios", "productos-proveedores-new"),
                                                    {
                                                      body: getFormData( "editarCampoLote", objeto ),
                                                      method: "POST" 
                                                    },
                                                    {
                                                      mensaje:      "editar productos proveedores",
                                                      tiempoEspera: 15_000,
                                                      dataEsArray:  true
                                                    }
                                                  )
      if(ok)
      {        
        
        
        resolver( ok )
      }
      else
      {
        resolver( false )
      }
    })
  }


  return {
    buscarProductos,
    editarCampoEnLote
  }
}