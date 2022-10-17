//* ////////////////////////////////////////////////////////////////// Core
import {  useRouter             } from 'vue-router'
//* ////////////////////////////////////////////////////////////////// Store
import {  storeToRefs           } from 'pinia'  
import {  useStoreProducto      } from 'src/stores/producto'
//* ////////////////////////////////////////////////////////////////// Componibles
import {  useApiDolibarr        } from "src/services/useApiDolibarr"  
import {  servicesProductos     } from "src/areas/productos/services/servicesProductos"
import {  useTools              } from "src/useSimpleOk/useTools"
//* ////////////////////////////////////////////////////////////////// Modelos

export function useControlProductos() 
{
  const router                  = useRouter()
  const { aviso               } = useTools()  
  const { apiDolibarr         } = useApiDolibarr()
  const { producto,
          productos,
          loading             } = storeToRefs( useStoreProducto() )  


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

  //* /////////////////////////////////////////////////////////////// Return
  return {
    editarURL,
  }
}