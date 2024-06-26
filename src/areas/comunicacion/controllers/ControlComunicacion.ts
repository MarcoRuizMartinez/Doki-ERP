//* ////////////////////////////////////////////////////////////////// Core
import {  useRouter             } from 'vue-router'
//* ////////////////////////////////////////////////////////////////// Store
import {  storeToRefs           } from 'pinia'
import {  useStoreAcuerdo       } from 'stores/acuerdo'
import {  useStoreUser          } from 'stores/user'
//* ////////////////////////////////////////////////////////////////// Componibles
import {  useApiDolibarr        } from "src/composables/useApiDolibarr"
import {  useFetch              } from "src/composables/useFetch"
import {  getURL, getFormData   } from "src/composables/APIMaco"
import {  useTools, confeti     } from "src/composables/useTools"

//* ////////////////////////////////////////////////////////////////// Modelos
import {  IAccion, Accion       } from "src/areas/comunicacion/models/Accion"
import {  IQuery                } from "src/models/Busqueda"

export function useControlComunicacion()
{
  const router                  = useRouter()
  const { aviso               } = useTools()

  const { apiDolibarr         } = useApiDolibarr()
  const { miFetch             } = useFetch()
  const { usuario             } = storeToRefs( useStoreUser() )
  

  async function buscarAcciones( q : IQuery, tipo : string, solicitarPermisos : boolean = true ) : Promise< IAccion[] >
  {
    if(solicitarPermisos)
      q.permisos              = 1
    q.user                    = usuario.value.id
    const consulta : any      = q
    consulta.grupos           = usuario.value.gruposString

    const { ok, data }        = await miFetch(  getURL("listas", "acciones"),
                                                { method: "POST", body: getFormData( "", consulta ) },
                                                { dataEsArray: true, mensaje: "buscar " + tipo, conLoadingBar: false, tiempoEspera: 25_000 }
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

  async function cambiarProgreso( idTarea : number, progreso : number ) : Promise<boolean>
  {
    const ok              = await editarAccion( idTarea, { percentage: progreso } )
    let msj               = "Progreso editado"
    if(ok){
      if( progreso === 100 ){
        confeti(3)
        msj               = "Tarea completada"
      }

      aviso("positive", msj)
    }

    return ok
  }

  async function cambiarCuando( idTarea : number, idCuando : number ) : Promise<boolean>
  {
    const ok              = await editarAccion( idTarea, { status: idCuando } )
    if(ok){
      aviso("positive", "Cuando editado")
    }

    return ok
  }
  
  async function cambiarAceptar( task : IAccion ) : Promise<boolean>
  {
    if(!task.usuarioEsAsignado || task.aceptado) return true
    task.aceptado         = !task.aceptado

    const ok              = await editarAccion( task.id, { event_paid: +task.aceptado } )
    if(ok){
      const msj           = task.aceptado ? "Tarea aceptada" : "Tarea rechazada"
      aviso("positive", msj)
    }

    return ok
  }

  async function cambiarPrivacidad( tarea : IAccion ) : Promise<boolean>
  {
    tarea.editando        = true
    const ok              = await editarAccion( tarea.id, { transparency: +!tarea.publico } )
    tarea.publico         = !tarea.publico
    tarea.editando        = false
    if(!ok){
      aviso("negative", "Error editando privacidad")
    }

    return ok
  }
    

  //* /////////////////////////////////////////////////////////////// Return
  return {
    crearAccion,
    editarAccion,
    buscarAcciones,
    cambiarProgreso,
    cambiarCuando,
    cambiarAceptar,
    cambiarPrivacidad
  }
}
