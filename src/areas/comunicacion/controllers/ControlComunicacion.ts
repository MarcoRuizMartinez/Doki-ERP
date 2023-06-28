//* ////////////////////////////////////////////////////////////////// Core
import {  useRouter             } from 'vue-router'
//* ////////////////////////////////////////////////////////////////// Store
import {  storeToRefs           } from 'pinia'
import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
import {  useStoreUser          } from 'src/stores/user'
//* ////////////////////////////////////////////////////////////////// Componibles

import {  useApiDolibarr        } from "src/services/useApiDolibarr"
import {  useFetch              } from "src/useSimpleOk/useFetch"
import {  getURL, getFormData   } from "src/services/APIMaco"
import {  useTools              } from "src/useSimpleOk/useTools"

//* ////////////////////////////////////////////////////////////////// Modelos
import {  IAccion, Accion       } from "src/areas/comunicacion/models/Accion"

export function useControlComunicacion()
{
  const router                  = useRouter()
  const { aviso               } = useTools()

  const { apiDolibarr         } = useApiDolibarr()
  const { miFetch             } = useFetch()
  const { usuario             } = storeToRefs( useStoreUser() )
  
  type QueryAccion = {
    codigo        : string 
    tipoElemento  : string
    terceroId    ?: number
    elementoId   ?: number
  }

  async function buscarAcciones( q : QueryAccion, tipo : string ) : Promise< IAccion[] >
  {
    const { ok, data }        = await miFetch(  getURL("listas", "varios"),
                                                { method: "POST", body: getFormData( "accion", q ) },
                                                { dataEsArray: true, mensaje: "buscar " + tipo }
                                              )
    const acciones :IAccion[] = []

    if(ok && Array.isArray( data ) && !!data.length)
    {      
      for (const item of data)
      {
        const accion          = await Accion.accionApiToAccion( item, usuario.value.id )
        acciones.push( accion )
      }
    }
    
    return acciones
  }

  async function crearAccion( a :IAccion ) : Promise<number>
  {
    const obj               = a.accionToApiDolibarr    
    const { ok, data }      = await apiDolibarr("crear", "accion", obj)
    let id                  =  0
    if(ok && !!data && typeof data == "number"){
      id                    = data      
    }
    else
    {
      aviso("negative", "Error al publicar comentario")
    }
    return id
  }

  async function editarAccion( id : number, obj : any ) : Promise<boolean>
  {
    const { ok, data }      = await apiDolibarr("editar", "accion", obj, id )
    if(!ok){
      aviso("negative", "Error al editar")
    }
    return ok
  }  

  //* /////////////////////////////////////////////////////////////// Return
  return {
    crearAccion,
    editarAccion,
    buscarAcciones
  }
}
