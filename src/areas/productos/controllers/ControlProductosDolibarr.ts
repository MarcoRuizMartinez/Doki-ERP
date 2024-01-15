//* ////////////////////////////////////////////////////////////////// Core
import {  useRouter             } from 'vue-router'
//* ////////////////////////////////////////////////////////////////// Store
import {  storeToRefs           } from 'pinia'  
import {  useStoreProducto      } from 'src/stores/producto'
//* ////////////////////////////////////////////////////////////////// Modelos
import {  IProductoDoli,
          ProductoDoli          } from "src/areas/productos/models/ProductoDolibarr"     
//* ////////////////////////////////////////////////////////////////// Componibles
import {  useTools,
          ID_URL_Ok,            } from "src/composables/useTools"
import {  useApiDolibarr        } from "src/composables/useApiDolibarr"  
import {  servicesProductos     } from "src/areas/productos/services/servicesProductos"
import {  useFetch              } from "src/composables/useFetch"
import {  getURL, getFormData   } from "src/composables/APIMaco"
import {  TCodigosSiigo         } from "src/models/TiposVarios"

//* ////////////////////////////////////////////////////////////////// Modelos

export function useControlProductos() 
{
  const router                  = useRouter()
  const { aviso               } = useTools()  
  const { apiDolibarr         } = useApiDolibarr()
  const { miFetch             } = useFetch()
  const { producto,
          productos,
          loading             } = storeToRefs( useStoreProducto() )

  //* ////////////////////////////////////////////////////////////////////// Editar URL de imagen
  async function editarProducto( pro : IProductoDoli ) : Promise <boolean>
  {      
    loading.value.editar        = true

    const {ok}                  = await apiDolibarr("editar", "producto", pro.productoForApi, pro.id )       
    if(ok){
      aviso("positive", `Producto actualizado 👌🏼`)
    }
    else
      aviso("negative", `Error actualizando producto`)
    loading.value.editar        = false

    return ok
  }

  //* ////////////////////////////////////////////////////////////////////// Editar URL de imagen
  async function crearProducto( pro : IProductoDoli ) : Promise <number>
  {      
    loading.value.crear         = true

    const { ok, data }          = await apiDolibarr("crear", "producto", pro.productoForApi )       
    if(ok && !!data && typeof data === "string"){
      pro.id                    = ID_URL_Ok( data )
      aviso("positive", `Producto creado 👌🏼`)
    }
    else
      aviso("negative", `Error crear producto`)
    loading.value.crear         = false

    return pro.id
  }  

  //* ////////////////////////////////////////////////////////////////////// Editar URL de imagen
  async function editarURL( url : string ) : Promise <boolean>
  {      
    loading.value.url           = true
    const {ok}                  = await apiDolibarr("editar", "producto", { url }, producto.value.id )       
    if(ok){
      aviso("positive", `Imagen actualizada 👌🏼`)
    }
    else
      aviso("negative", `Error actualizando imagen`)
    loading.value.url           = false

    return ok
  }


  async function codigoYaExiste( codigo : number ) : Promise <boolean>
  {
    const { ok }    = await miFetch( getURL("listas", "productos"), { method: "POST", body: getFormData( "codigoSiigoOk", { codigo } ) }, { mensaje: "buscar código producto existe" } )    
    return ok
  }

  async function buscarCodigosSiigo( sigla : string, codigo : number ) : Promise <TCodigosSiigo>
  {
    const { ok, data }    = await miFetch( getURL("listas", "productos"), { method: "POST", body: getFormData( "codigosPorSiglas", { sigla } ) }, { mensaje: "buscar codigos siigo" } )    

    const codigos : TCodigosSiigo = {
      codigo  : codigo,
      linea   : +data?.codigo_linea ?? 0,
      grupo   : +data?.codigo_grupo ?? 0,
    }
    
    return codigos
  }



  //* /////////////////////////////////////////////////////////////// Return
  return {
    crearProducto,
    editarURL,
    editarProducto,
    codigoYaExiste,
    buscarCodigosSiigo,
  }
}