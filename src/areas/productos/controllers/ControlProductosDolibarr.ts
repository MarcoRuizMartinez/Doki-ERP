//* ////////////////////////////////////////////////////////////////// Core
import {  useRouter             } from 'vue-router'
//* ////////////////////////////////////////////////////////////////// Store
import {  storeToRefs           } from 'pinia'  
import {  useStoreProducto      } from 'src/stores/producto'
//* ////////////////////////////////////////////////////////////////// Componibles
import {  useApiDolibarr        } from "src/services/useApiDolibarr"  
import {  servicesProductos,
          IBusquedaProducto     } from "src/areas/productos/services/servicesProductos"
import {  useTools,
          ID_URL_Ok,
          confeti               } from "src/useSimpleOk/useTools"
//* ////////////////////////////////////////////////////////////////// Modelos


export function useControlProductos() 
{
  const router                  = useRouter()
  const { aviso               } = useTools()  
  const { apiDolibarr         } = useApiDolibarr()
  const { buscarProductos     } = servicesProductos()
  const { producto,
          productos,
          loading             } = storeToRefs( useStoreProducto() )  

  
  //* ////////////////////////////////////////////////////////////////////// Buscar Acuerdo 
  async function buscarProducto(  id_ : string )
  {
    const idOk                  = ID_URL_Ok( id_ )
    if(!idOk) router.push("/error") 

    loading.value.carga         = true
    const busqueda              = { tipo: "producto", completa: 1, id: idOk }
    const productos             = await buscarProductos( busqueda )

    if(!!productos.length)
    {
      producto.value            = productos[0]
    }
    else
    {
      aviso("negative", "Error con la URL. Por favor verifique que este bien.", "account", 3000)
      router.push("/error")
    }

    loading.value.carga         = false
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

  //* /////////////////////////////////////////////////////////////// Return
  return {
    buscarProducto,
    editarURL,
  }
}