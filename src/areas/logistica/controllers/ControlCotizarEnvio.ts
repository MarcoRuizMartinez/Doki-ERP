//* ////////////////////////////////////////////////////////////////// Componibles
import {  useFetch                } from "src/useSimpleOk/useFetch"
import {  getURL, getFormData     } from "src/services/APIMaco"
import {  IQuery                  } from "src/models/Busqueda"
import {  ICostoEnvio, CostoEnvio } from "src/areas/logistica/models/CostoEnvio"

//* ////////////////////////////////////////////////////////////////// Modelos

export function useCotizarEnvio()
{
  const { miFetch             } = useFetch()
  const endPoint                = getURL("listas", "enviame")

  //* /////////////////////////////////////////////////////////////// Crear Acuerdo
  async function cotizarEnviame( q : IQuery ) : Promise<ICostoEnvio[]>
  {
    return new Promise( async (resolver) =>
    {
      const { data, ok  }           = await miFetch( endPoint, { body: getFormData( "cotizar",  q ), method: "POST" }, { mensaje:  "cotizar envío", tiempoEspera: 10_000 } )
      if(ok && typeof data == "object" && "status" in data && data.status === "success" && "data" in data && Array.isArray( data.data ))
      {
        const costos = CostoEnvio.getCostosFromApi( data.data )
        resolver( costos )
      }
      else
      {
        resolver( [] )
      }
    })
  }


  //* /////////////////////////////////////////////////////////////// Return
  return {
    cotizarEnviame,
  }
}
