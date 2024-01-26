//* ////////////////////////////////////////////////////////////////// Core
import {  useRouter             } from 'vue-router'

//* ////////////////////////////////////////////////////////////////// Store
import {  storeToRefs           } from 'pinia'  
import {  useStoreProducto      } from 'src/stores/producto'

//* ////////////////////////////////////////////////////////////////// Modelos
import {  IProductoDoli         } from "src/areas/productos/models/ProductoDolibarr"    
import {  TCodigosSiigo,
          CodigosSiigo          } from 'src/areas/productos/models/Siigo'

//* ////////////////////////////////////////////////////////////////// Componibles
import {  useTools,
          ToolNum               } from "src/composables/useTools"
import {  useApiDolibarr        } from "src/composables/useApiDolibarr"  
import {  useFetch              } from "src/composables/useFetch"
import {  getURL, getFormData   } from "src/composables/APIMaco"


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

  //* ////////////////////////////////////////////////////////////////////// Editar producto
  async function editarProducto( pro : IProductoDoli, tipo : "full" | "precio" = "full" ) : Promise <boolean>
  {      
    loading.value.editar        = true
    const objeto                =   tipo == "precio" ?  pro.productoForApiPrecios
                                  :                     pro.productoForApi

    const { ok }                = await apiDolibarr("editar", "producto", objeto, pro.id )

    if(ok && tipo == "full"){
      aviso("positive", `Producto actualizado 👌🏼`)
    }
    else if(!ok)
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
      pro.id                    = ToolNum.ID_URL_Ok( data )
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
    const { ok }          = await miFetch( getURL("listas", "productos"), { method: "POST", body: getFormData( "codigoSiigoOk", { codigo } ) }, { mensaje: "buscar código producto existe" } )    
    return ok
  }

  async function buscarCodigosSiigo( sigla : string, codigo : number, enSiigo : boolean ) : Promise <TCodigosSiigo>
  {
    const { data }        = await miFetch( getURL("listas", "productos"), { method: "POST", body: getFormData( "codigosPorSiglas", { sigla } ) }, { mensaje: "buscar codigos siigo" } )    

    const codigos         = new CodigosSiigo()
          codigos.codigo  = codigo 
          codigos.linea   = +data?.codigo_linea ?? 0
          codigos.grupo   = +data?.codigo_grupo ?? 0 
          codigos.enSiigo = enSiigo
  
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