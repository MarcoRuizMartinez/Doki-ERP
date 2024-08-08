import {  getURL,
          getFormData         } from "src/composables/APIMaco"
import {  useFetch            } from "src/composables/useFetch"
import {  IProductoProveedor,
          ProductoProveedor,
          THijoPadre          } from "../models/ProductoProveedor";
import {  IQuery              } from "src/models/Busqueda"
import {  TDatosEvento        } from "components/utilidades/AgGrid/AGTools"
import {  useTools            } from "src/composables/useTools"

export function servicesProductosPro() 
{
  const { miFetch           } = useFetch()
  const { aviso             } = useTools()

  async function BuscarProductos( query : IQuery, editable : boolean = false ) : Promise< IProductoProveedor[] >
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
      //console.log("data: ", data);
      if(ok && Array.isArray( data ))
      {        
        productos = await ProductoProveedor.getProductosProveedorFromAPI( data, editable )         
        //console.log("//* //////////// Productos: ", productos);
        resolver( productos )
      }
      else
      {
        resolver( [] )
      }
    })
  }

  async function BuscarProductoByRef( ref : string, editable : boolean = false ) : Promise< IProductoProveedor >
  {
    return new Promise( async (resolver, rechazar ) =>
    {
      const { data, ok      } = await miFetch( getURL("listas", "productos-proveedores-new"),
                                                    {
                                                      body: getFormData( "", { ref } ),
                                                      method: "POST" 
                                                    },
                                                    {
                                                      mensaje:      "buscar productos por ref",
                                                      tiempoEspera: 15_000
                                                    }
                                                  )
      if(ok)
      {        
        const producto        = await ProductoProveedor.getProductoProveedorFromAPI( data, editable )         
        //console.log("//* //////////// Productos: ", productos);
        resolver( producto )
      }
      else
      {
        resolver( new ProductoProveedor() )
      }
    })
  }

  async function EditarCampoEnLote( campo : string, datos : TDatosEvento<IProductoProveedor>[], usuarioId : number ) : Promise< boolean >
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
                                                    { mensaje:      "editar productos proveedores" }
                                                  )
                                                  
      if(!ok) aviso("negative", "Error al editar productos")
      resolver( ok )
    })
  }




  async function CrearProductos( productos : any[], usuarioId : number ) : Promise< boolean >
  {
    return new Promise( async (resolver ) =>
    {
      const objeto            = { productos: JSON.stringify( productos ), usuario: usuarioId, }  
      const { ok            } = await miFetch( getURL("servicios", "productos-proveedores-new"),
                                                    {
                                                      body: getFormData( "crearProductos", objeto ),
                                                      method: "POST" 
                                                    },
                                                    { mensaje: "crear productos proveedores" }
                                                  )
      if(!ok) aviso("negative", "Error al crear productos")      
      resolver( ok )      
    })
  }

  async function RelacionarHijosYPadres( relaciones : THijoPadre[] ) : Promise< boolean >
  {
    return new Promise( async (resolver ) =>
    {
      const objeto            = { relaciones: JSON.stringify( relaciones ) }  
      const { ok, data      } = await miFetch( getURL("servicios", "productos-proveedores-new"),
                                                    {
                                                      body: getFormData( "setProductosHijosProveedor", objeto ),
                                                      method: "POST" 
                                                    },
                                                    { mensaje: "relacionando productos y hijos" }
                                                  )
      if(!ok) aviso("negative", "Error al relacionar productos")      
      resolver( ok )
    })
  }  

  return {
    BuscarProductos,
    BuscarProductoByRef,
    EditarCampoEnLote,
    CrearProductos,
    RelacionarHijosYPadres
  }
}