import {  getURL,
          getFormData         } from "src/composables/APIMaco"
import {  useFetch            } from "src/composables/useFetch"
import {  IProductoDoli,
          ProductoDoli        } from "../models/ProductoDolibarr";          
import {  IQuery              } from "src/models/Busqueda"
import {  TDatosEvento        } from "components/utilidades/AgGrid/AGTools"
import {  useTools            } from "src/composables/useTools"

export function servicesProductosPro() 
{
  const { miFetch           } = useFetch()
  const { aviso             } = useTools()

  async function BuscarProductos( query : IQuery, editable : boolean = false ) : Promise< IProductoDoli[] >
  {
    return new Promise( async (resolver, rechazar ) =>
    {
      const { data, ok      } = await miFetch( getURL("listas", "productos-busqueda"),
                                                    {
                                                      body: getFormData( "", query ),
                                                      method: "POST" 
                                                    },
                                                    {
                                                      mensaje:      "buscar productos",
                                                      tiempoEspera: 15_000,
                                                      dataEsArray:  true
                                                    }
                                                  )
      let productos : IProductoDoli[]   = []
      if(ok && Array.isArray( data ))
      {        
        productos = await ProductoDoli.getProductosFromAPI( data, editable )         
        resolver( productos )
      }
      else
      {
        resolver( [] )
      }
    })
  }

  async function EditarCampoEnLote( campo : string, datos : TDatosEvento[], usuarioId : number ) : Promise< boolean >
  {
    console.log("campo: ", campo, datos);

    const datosEnviar         = datos.map( d => { return { id: d.data?.id, value: d.value }})
    return new Promise( async (resolver, rechazar ) =>
    {
      const objeto            = { field: campo, usuario: usuarioId, datos: JSON.stringify( datosEnviar ) }  
      const { data, ok      } = await miFetch( getURL("servicios", "productos-dolibarr-new"),
                                                    {
                                                      body: getFormData( "editarCampoLote", objeto ),
                                                      method: "POST" 
                                                    },
                                                    { mensaje:      "editar productos" }
                                                  )
                                                  
      console.log("data: ", data);
      if(!ok) aviso("negative", "Error al editar productos")      
      resolver( ok )
    })
  }

  return {
    BuscarProductos,
    EditarCampoEnLote,
  }
}