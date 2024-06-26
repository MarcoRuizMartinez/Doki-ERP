import {  useQuasar     } from 'quasar'
import {  computed      } from 'vue'
import {  useStoreUser  } from 'stores/user'
import {  useStoreApp   } from 'stores/app'
import {  axios,
          apiDolibarrAxios
                        } from "src/boot/axios"
import {  IResultado,
          CODES_FETCH    } from "src/models/TiposVarios"

type AccionDolibarr           = "crear"         | "editar"        | "ver"           | "contacto-desvincular"  | "contacto-vincular" |
                                "buscar"        | "borrar"        | "borrar-linea"  | 
                                "crear-linea"   | "crear-lineas"  | "borrar-lineas" | "editar-linea"  |
                                "descargar"     | "subir"         | "generar"       | 
                                "close"         | "setinvoiced"   | "settodraft"    | "validate"      | "reopen"
//  | "crear-lineas"  |  |

type ModuloDolibarr           = "" | "tercero"  | "contacto"      | "documento" | "saber" | "producto" | "producto-hijo" |
                                "cotización"    | "cotizaciónPro" |
                                "pedido"        | "pedidoPro"     |
                                "entrega"       | "entregaPro"    | "entregasPedido" | 
                                "factura"       | "facturaPro"    |
                                "accion"        | "proyecto"
                                
type Metodo                   = "post" | "put" | "get" | "delete"

//#region useApiDolibarr
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

  function getHeadersAxios() : any {    
    return { "DOLAPIKEY": token.value}
  }

  function getEndPoint( modulo : ModuloDolibarr )
  {
    let endPoint = ""
    switch (modulo) {
      case "tercero"        : endPoint = "thirdparties";        break;
      case "contacto"       : endPoint = "contacts";            break;
      case "documento"      : endPoint = "documents";           break;
      case "cotización"     : endPoint = "proposals";           break;
      case "pedido"         : endPoint = "orders";              break;
      case "saber"          : endPoint = "knowledgemanagement"; break;
      case "producto"       : endPoint = "products";            break;
      case "producto-hijo"  : endPoint = "products";            break;
      case "proyecto"       : endPoint = "projects";            break;
      case "pedidoPro"      : endPoint = "supplierorders";      break;
      case "entregasPedido" : endPoint = "orders";              break;
      case "entrega"        : endPoint = "shipments";           break;
      case "accion"         : endPoint = "agendaevents";        break;
      default: break;
    }

    return endPoint
  }

  async function apiDolibarr
  (
    accion  : AccionDolibarr,
    tipo    : ModuloDolibarr,
    objeto  : any             = "",
    id      : number          = 0,
    conBarra: boolean         = true,
    timeout : number          = 30_000,
  ) : Promise <IResultado>
  {
    if(!tipo) return { ok: false, codigo: 20 }

    mensajeGlobal             = "crear " + tipo
    let endPoint  : string    = getEndPoint( tipo )
    let esLinea               = accion.includes("linea")
    let metodo    : Metodo    = "post"
    if(conBarra)
      loadingBar.start()

    
    if(accion.includes("crear"))
    {
      metodo                  = "post"
      if(accion               === "crear-lineas")
        endPoint              += `/${id}/lines`
      else 
      if(accion               === "crear-linea")
      {
        if(tipo               === "cotización")
          endPoint            += `/${id}/line`
        if(tipo               === "pedido")
          endPoint            += `/${id}/lines`
      }
      else 
      if(accion === "crear" && tipo === "producto-hijo")
      {
        endPoint              += `/${id}/subproducts/add`
      }
    }
    else if(accion.includes("editar"))
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
      
      if( tipo                === "entregasPedido" )
        endPoint              += `/shipment`
    }
    else if(accion            === "buscar" && typeof objeto === "string")
    {
      metodo                  = "get"

      // Horrible
      if(tipo                 !== "saber")
        endPoint              += "/?" + objeto
      else
      if(tipo                 === "saber")
        endPoint              += "/knowledgerecords"
    }
    else if(accion.includes("borrar") && ( typeof objeto === "string" || typeof objeto === "number") )
    {
      metodo                  = "delete"

      if(typeof objeto        === "string" && objeto.length > 10)
        endPoint              += "?" + objeto // si es mas de 10, es una consulta ejem modulepart=thirdparty&id=1
      else                    // asume que cuando se manda un id es de largo maximo 10 ejem 2313
      {
        if(accion             === "borrar-lineas")
          endPoint            += `/${id}/lines/${objeto}`
        //else 
        //if(accion               === "borrar-linea")
        //  endPoint            += "/" + id + "/line/" + objeto
        else
        {
          endPoint            += "/" + objeto

          if(tipo             === "producto-hijo" && accion === "borrar")
          {
            endPoint          = `/products/${id}/subproducts/remove/${objeto}`
          }
        }
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
      endPoint                += `/${id}/contact/${objeto.id}/${objeto.tipo}`
    }
    else if(accion            === "contacto-vincular")
    {
      metodo                  = "post"
      endPoint                += `/${id}/contact/${objeto.id}/${objeto.tipo}`
    }
    else if(accion === "close" || accion === "setinvoiced" || accion === "settodraft" || accion === "validate"  || accion === "reopen")
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
        
        //console.log({metodo}, {endPoint}, {objeto} )

        idTimeout             = setTimeout( abortarSiDemora, timeout)
        cargando              = true
        let resultado
        if(metodo             === "get" || metodo === "delete" )
          resultado           = await apiDolibarrAxios[metodo](endPoint,         { headers: getHeadersAxios(), cancelToken: cancelTokenSource.token })
        else
          resultado           = await apiDolibarrAxios[metodo](endPoint, objeto, { headers: getHeadersAxios(), cancelToken: cancelTokenSource.token })

        //console.log("useApiDoliabrr Resultado: ", resultado);

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
