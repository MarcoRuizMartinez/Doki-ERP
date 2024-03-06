//* ////////////////////////////////////////////////////////////////// Core
import {  useRouter             } from 'vue-router'
//* ////////////////////////////////////////////////////////////////// Store
import {  storeToRefs           } from 'pinia'
import {  useStoreAcuerdo       } from 'stores/acuerdo'
import {  useStoreNomina      } from "stores/nomina"
//* ////////////////////////////////////////////////////////////////// Componibles
import {  useApiDolibarr        } from "src/composables/useApiDolibarr"
import {  useFetch              } from "src/composables/useFetch"
import {  getURL, getFormData   } from "src/composables/APIMaco"
import {  useTools, ToolType    } from "src/composables/useTools"
//* ////////////////////////////////////////////////////////////////// Modelos
import {  IIncentivo,
          Incentivo             } from "src/areas/nomina/models/Incentivo"
import {  IQuery                } from "src/models/Busqueda"

export function useControlIncentivos()
{
  const router                  = useRouter()
  const { aviso               } = useTools()
  const { apiDolibarr         } = useApiDolibarr()
  const { miFetch             } = useFetch()
  const { loading : loadAcu   } = storeToRefs( useStoreAcuerdo() )
  const { loading             } = storeToRefs( useStoreNomina() )
  

  async function nuevoIncentivo( objeto : any ) : Promise< boolean | number >
  {
    const objetoApi           = { body: getFormData( "nuevoIncentivo", objeto ), method: "POST" }    
    const { data, ok  }       = await miFetch( getURL("servicios", "nomina"), objetoApi, { mensaje: "guardar comisión" } )
    if(ok)
    {
      aviso( "positive", "Comisión guardada" )
      const id  = ToolType.anyToNum( data )
      if(!!id)  return id
      else      return false
    }
    else
      aviso( "negative", "Error al guardar comisión. Por favor vuelve a intentarlo" )

    return false
  }

  async function buscarIncentivos( query : IQuery, tipo : "unico" | "varios" = "unico" ) : Promise< IIncentivo | IIncentivo[] >
  {
    loadAcu.value.incentivo     = true
    loading.value.carga         = true
    const comoArray             = tipo === "varios"
    const { ok, data }          = await miFetch(  getURL("listas", "incentivos"),
                                                  { method: "POST", body: getFormData( "busqueda", query ) },
                                                  { mensaje: "buscar incentivo", dataEsArray: comoArray }
                                                )
    loadAcu.value.incentivo     = false
    loading.value.carga         = false

    if(ok){
      const esIncoherente       = tipo =="unico" && Array.isArray(data)
      if(esIncoherente){
        aviso( "negative", "Se estan recibiendo varios registros de incentivos cuando no debería" )
        return Incentivo.getIncentivoToApi( data[0] )
      }
      else
        return comoArray ? Incentivo.getIncentivosToApi( data ) : Incentivo.getIncentivoToApi( data )
    }

    return []
  }  

  //* /////////////////////////////////////////////////////////////// Return
  return {
    nuevoIncentivo,
    buscarIncentivos
  }
}
