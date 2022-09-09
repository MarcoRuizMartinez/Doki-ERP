import {  useQuasar     } from 'quasar'
import {  computed      } from 'vue'
import {  useStoreUser  } from 'src/stores/user'
import {  useStoreApp   } from 'src/stores/app'
import {  axios,
          apiDolibarrAxios
                        } from "src/boot/axios"
import {  IResultado,
          CODES_FETCH    } from "src/models/TiposVarios"

type AccionDolibarr           = "crear" | "editar" | "ver" | "buscar" | "borrar" | "descargar" | "subir" | "generar" |
                                "contacto-vincular" | "contacto-desvincular" |
                                "close" | "setinvoiced" | "settodraft" | "validate"

type ModuloDolibarr           = "tercero" | "contacto" | "documento" | "cotizacion" | "lineaCotizacion"
type Metodo                   = "post" | "put" | "get" | "delete"

export function useApiDolibarr()
{
  const { notify, loadingBar} = useQuasar()
  const cancelTokenSource     = axios.CancelToken.source();
  const storeUser             = useStoreUser()
  const storeApp              = useStoreApp()
  const token                 = computed( () => storeUser.token )
  const online                = computed( () => storeApp.online )
  let   cargando              = false
  let   mensajeGlobal         = ""
  let   idTimeout           : NodeJS.Timeout

  function getHeadersFetch() : Headers
  {
    var miHeaders     = new Headers();
        miHeaders.append("DOLAPIKEY", token.value)

    return miHeaders
  }

  function getHeadersAxios() : any
  {
    const header = {
                      "DOLAPIKEY": token.value,
                      //"Accept": "application/json",
                      //"Access-Control-Allow-Origin": "*"
                    }
    return header
  }

  function getEndPoint( modulo : ModuloDolibarr )
  {
    let endPoint = ""
    switch (modulo) {
      case "tercero":           endPoint = "thirdparties";  break;
      case "contacto":          endPoint = "contacts";      break;
      case "documento":         endPoint = "documents";     break;
      case "cotizacion":        endPoint = "proposals";     break;
      case "lineaCotizacion":   endPoint = "proposals";     break;
      default: break;
    }

    return endPoint
  }

  async function apiDolibarr
  (
    accion  : AccionDolibarr,
    tipo    : ModuloDolibarr,
    objeto  : any,
    id      : number          = 0
  ) : Promise <IResultado>
  {
    mensajeGlobal             = "crear " + tipo
    let endPoint  : string    = getEndPoint( tipo )
    let esLinea               = tipo.includes("linea")
    let metodo    : Metodo    = "post"
    loadingBar.start()


    if(accion                 === "crear")
    {
      metodo                  = "post"
      if(esLinea) endPoint    += "/" + id + "/lines"
    }
    else if(accion            === "editar")
    {
      metodo                  = "put"

      if(esLinea)
        endPoint              += "/" + id + "/lines/" + objeto.id
      else
        endPoint              += "/" + id
    }
    else if(accion            === "ver")
    {
      metodo                  = "get"
      endPoint                += "/" + id
    }
    else if(accion            === "buscar" && typeof objeto === "string")
    {
      metodo                  = "get"
      endPoint                += "/?" + objeto
    }
    else if(accion            === "borrar" && ( typeof objeto === "string" || typeof objeto === "number") )
    {
      metodo                  = "delete"
      if(typeof objeto        === "string" && objeto.length > 10)
        endPoint              += "?" + objeto // si es mas de 10, es una consulta ejem modulepart=thirdparty&id=1
      else {                  // asume que cuando se manda un id es de largo maximo 10 ejem 2313
        if(esLinea)
          endPoint            += "/" + id + "/lines/" + objeto
        else
          endPoint            += "/" + objeto
      }
    }
    else if(accion            === "descargar" && typeof objeto === "string")
    {
      metodo                  = "get"
      endPoint                += "/download?" + objeto
    }
    else if(accion            === "subir")
    {
      // Solo estan activamos los modulos
      // 'facture', 'supplier_invoice', 'project_task', 'product', 'service', 'expensereport', 'adherent', 'propale'

      metodo                  = "post"
      endPoint                += "/upload"
    }
    else if(accion            === "contacto-desvincular")
    {
      metodo                  = "delete"
      endPoint                += `/${id}/contact/${objeto}`
    }
    else if(accion            === "contacto-vincular")
    {
      metodo                  = "post"
      endPoint                += `/${id}/contact/${objeto.id}/${objeto.tipo}`
    }
    else if(accion === "close" || accion === "setinvoiced" || accion === "settodraft" || accion === "validate")
    {
      metodo                  = "post"
      endPoint                += `/${id}/${accion}`
    }


    return new Promise( async (resolver, rechazar) => {
      try {
        if(!online.value)
        {
          avisoSinConexion()
          resolver( { codigo: CODES_FETCH.sinConexion, ok: false } )
        }

        //console.log("metodo", metodo, "endPoint", endPoint, "objeto", objeto )
        idTimeout             = setTimeout( abortarSiDemora, 20000)
        cargando              = true
        let resultado
        if(metodo             === "get" || metodo === "delete" )
          resultado           = await apiDolibarrAxios[metodo](endPoint,         { headers: getHeadersAxios(), cancelToken: cancelTokenSource.token })
        else
          resultado           = await apiDolibarrAxios[metodo](endPoint, objeto, { headers: getHeadersAxios(), cancelToken: cancelTokenSource.token })

        if(!!resultado.data)
        {
          if( resultado.data.hasOwnProperty("error") && resultado.data.error !== null)
            resolver( { codigo: resultado.status, ok: false,  data : resultado.data.error.message })
          else
            resolver( { codigo: resultado.status, ok: true,   data : resultado.data               })
        }
        else
          resolver(   { codigo: resultado.status, ok: false,  data : resultado.data } )

      } catch (error : any) {
        const errorTxt = error.toString()
        if(metodo === "get" && error.toString().includes("Request failed with status code 404"))
        {
          console.log("Consulta sin resultados")
        }
        else
          console.warn('error: ', endPoint, error);

        resolver( { codigo: CODES_FETCH.errorConsulta, ok: false }  )
      }
      finally {
        cargando              = false
        loadingBar.stop()
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
    cancelTokenSource.cancel()

    notify({
      color:      "negative",
      textColor:  "white",
      icon:       "mdi-clock-alert",
      message:    "Tiempo de espera agotado para " + mensajeGlobal,
      position:   "top",
      timeout:    2800,
    })
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
    apiDolibarr
  }
}
