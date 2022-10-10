import {  useQuasar           } from 'quasar'
import {  IResultado,
          CODES_FETCH         } from "src/models/TiposVarios"
import {  computed            } from 'vue'
import {  useStoreApp         } from 'src/stores/app'

export function useFetch()
{
  const storeApp              = useStoreApp()
  const online                = computed(() => storeApp.online)
  const { notify, loadingBar }= useQuasar()
  let   controller            = new AbortController()
  let   cargando              = false
  let   mensajeGlobal         = ""
  let   idTimeout             : NodeJS.Timeout

  type ParamExtraFetch = {
    mensaje       : string
    tiempoEspera? : number
    dataEsArray?  : boolean
  }
  async function miFetch(
                          url             : string,
                          solicitud       : RequestInit,
                          {
                            mensaje       = "",
                            tiempoEspera  = 15000,
                            dataEsArray   = false
                          }               : ParamExtraFetch
                        )                 : Promise <IResultado>
  {
    mensajeGlobal             = mensaje
    return new Promise( async (resolver, rechazar) =>
    {
      try {
        if(!online.value)
        {
          avisoSinConexion()
          resolver( { codigo: CODES_FETCH.sinConexion, ok: false} )
        }

        idTimeout             = setTimeout( abortarSiDemora, tiempoEspera)
        cargando              = true
        solicitud.signal      = controller.signal
        loadingBar.start()
        const resultado       = await fetch( url, solicitud )
        const esJson          = resultado.headers.get('content-type')?.includes('application/json')
        const data            = esJson
                                  ? await resultado.json()
                                  : await resultado.text()
        loadingBar.stop()

        cargando              = false        
        if(!!data)
        {
          if(Array.isArray(data) && data.length == 1 && !dataEsArray)
          {
            if(typeof data    == "object" && Object.keys(data as object).length == 1)
            {
              let item        = Object.values(data)[0]
              if(typeof item  == "object" && Object.keys( item ).length == 1)
              {
                let dato      = Object.values( item )[0]
                if(typeof dato  == "string" || typeof dato  == "number" )
                  resolver( { data : dato, codigo: CODES_FETCH.OK, ok: true} )
              }
            }

            resolver( { data : data[0], codigo: CODES_FETCH.OK, ok: true} )
          }
          else
          {
            let hayDatos      = true
            if
            (
              (typeof data    == "object" && Object.keys(data as object).length == 0)
              ||
              (typeof data    == "string" && data.length == 0)
              ||
              (typeof data    == "number" && data.toString().length == 0)
            )
              hayDatos        = false

            resolver( { data : data, codigo: CODES_FETCH.OK, ok: hayDatos } )
          }
        }
        else
        {
          resolver( { data : {}, codigo: CODES_FETCH.errorConsulta, ok: false }  )
        }
      }
      catch (e : any)
      {
        loadingBar.stop()
        console.warn("Error en miFetch: ", e, mensajeGlobal)
        if( e instanceof DOMException)
        {
          if(e.name == "AbortError")
            resolver( { codigo: CODES_FETCH.AbortError, ok: false } )
        }

        resolver( { codigo: CODES_FETCH.errorDesconocido, ok: false } )
        return e;
      }
      finally {
        limpiarTiempo()
      }
    })
  }

  function abortarSiDemora()
  {
    limpiarTiempo()
    if(cargando) abortar()
  }

  function limpiarTiempo()
  {
    clearTimeout( idTimeout )
  }

  function abortar()
  {
    controller.abort();
    controller    = new AbortController()

    notify({
      color:      "negative",
      textColor:  "white",
      icon:       "mdi-clock-alert",
      message:    "Tiempo de espera agotado para " + mensajeGlobal,
      position:   "top",
      timeout:    2800,
    })
    loadingBar.stop()
  }

  function avisoSinConexion()
  {
    notify({
      color:      "warning",
      textColor:  "white",
      icon:       "mdi-wifi-off",
      message:    "Problemas con la conexión de internet para " + mensajeGlobal,
      position:   "top",
      timeout:    2800,
    })
  }

  return {
    miFetch
  }
}
