//* ////////////////////////////////////////////////////////////////// Core
import {  useRouter             } from 'vue-router'
//* ////////////////////////////////////////////////////////////////// Store
import {  storeToRefs           } from 'pinia'  
import {  useStoreProducto      } from 'src/stores/producto'
//* ////////////////////////////////////////////////////////////////// Modelos
import {  IProductoDoli,
          ProductoDoli          } from "src/areas/productos/models/ProductoDolibarr"     
//* ////////////////////////////////////////////////////////////////// Componibles
import {  useTools, ID_URL_Ok   } from "src/useSimpleOk/useTools"
import {  useApiDolibarr        } from "src/services/useApiDolibarr"  
import {  servicesProductos     } from "src/areas/productos/services/servicesProductos"
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
    if(ok){
      pro.id                    = ID_URL_Ok( data.toString() )
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
  


  //* /////////////////////////////////////////////////////////////// Return
  return {
    crearProducto,
    editarURL,
    editarProducto,
  }
}