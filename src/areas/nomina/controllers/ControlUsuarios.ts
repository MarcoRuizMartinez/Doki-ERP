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

export function useControlUsuarios()
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
    const { data, ok  }       = await miFetch( getURL("servicios", "rrhh"), objetoApi, { mensaje: "guardar comisión" } )
    console.log("nuevoIncentivo: ", data);
    if(ok)
    {
      aviso( "positive", "Comisión guardada" )
    }
    else
      aviso( "negative", "Error al guardar comisión. Por favor vuelve a intentarlo" )

    return ok
  }

  async function buscarIncentivo( origen_tipo : INCENTIVO_ORIGEN, origen_id : number  ) : Promise< IIncentivo >
  {
    loading.value.incentivo     = true
    const { ok, data }          = await miFetch(  getURL("listas", "varios"),
                                                  { method: "POST", body: getFormData( "buscarIncentivo", { origen_tipo, origen_id } ) },
                                                  { mensaje: "buscar incentivo" }
                                                )
    loading.value.incentivo     = false

    if(ok){
      return Incentivo.getIncentivoToApi( data )
    }

    return new Incentivo()
  }  

  //* /////////////////////////////////////////////////////////////// Return
  return {
    nuevoIncentivo,
    buscarIncentivo
  }
}
