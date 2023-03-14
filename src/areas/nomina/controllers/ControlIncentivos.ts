//* ////////////////////////////////////////////////////////////////// Core
import {  useRouter             } from 'vue-router'
//* ////////////////////////////////////////////////////////////////// Store
import {  storeToRefs           } from 'pinia'
import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
//* ////////////////////////////////////////////////////////////////// Componibles
import {  useApiDolibarr        } from "src/services/useApiDolibarr"
import {  useFetch              } from "src/useSimpleOk/useFetch"
import {  getURL, getFormData   } from "src/services/APIMaco"
import {  useTools              } from "src/useSimpleOk/useTools"
//* ////////////////////////////////////////////////////////////////// Modelos
import {  IUsuario              } from "src/areas/usuarios/models/Usuario"
import {  IIncentivo,
          Incentivo,
          INCENTIVO_ESTADO,
          INCENTIVO_ORIGEN,
          INCENTIVO_RAZON,
                                } from "src/areas/nomina/models/Incentivo"
import {  IQueryIncentivo       } from "src/areas/nomina//models/BusquedaIncentivos"
export function useControlIncentivos()
{
  const router                  = useRouter()
  const { aviso               } = useTools()
  const { apiDolibarr         } = useApiDolibarr()
  const { miFetch             } = useFetch()
  const { acuerdo,
          loading             } = storeToRefs( useStoreAcuerdo() )

  async function nuevoIncentivo( objeto : any ) : Promise< boolean >
  {
    const objetoApi           = { body: getFormData( "nuevoIncentivo", objeto ), method: "POST" }    
    const { data, ok  }       = await miFetch( getURL("servicios", "nomina"), objetoApi, { mensaje: "guardar comisión" } )
    if(ok)
    {
      aviso( "positive", "Comisión guardada" )
    }
    else
      aviso( "negative", "Error al guardar comisión. Por favor vuelve a intentarlo" )

    return ok
  }

  async function buscarIncentivos( query : IQueryIncentivo, tipo : "unico" | "varios" = "unico" ) : Promise< IIncentivo | IIncentivo[] >
  {
    loading.value.incentivo     = true
    const comoArray             = tipo === "varios"
    const { ok, data }          = await miFetch(  getURL("listas", "incentivos"),
                                                  { method: "POST", body: getFormData( "busqueda", query ) },
                                                  { mensaje: "buscar incentivo", dataEsArray: comoArray }
                                                )
    loading.value.incentivo     = false
    if(ok){
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
