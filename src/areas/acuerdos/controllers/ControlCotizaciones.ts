import {  useRouter             } from 'vue-router'
import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
import {  storeToRefs           } from 'pinia'  
import {  servicesCotizaciones  } from "src/areas/acuerdos/cotizaciones/services/servicesCotizaciones"
import {  servicesTerceros      } from "src/areas/terceros/services/servicesTerceros"
import {  useApiDolibarr        } from "src/services/useApiDolibarr"  
import {  ESTADO_CTZ            } from "../../../areas/acuerdos/models/Acuerdo"
import {  IOrigenContacto       } from "../../../models/Diccionarios/OrigenContacto"
import {  IUsuario              } from "../../../areas/usuarios/models/Usuario"
import {  ITercero              } from "../../../areas/terceros/models/Tercero"
import {  ICondicionPago        } from "src/models/Diccionarios/CondicionPago"
import {  IFormaPago            } from "src/models/Diccionarios/FormaPago"
import {  IMetodoEntrega        } from "src/models/Diccionarios/MetodoEntrega"
import {  ITiempoEntrega        } from "src/models/Diccionarios/TiempoEntrega"
import {  IContacto,
          Contacto,
          TIPOS_CONTACTO
                                } from "../../../areas/terceros/models/Contacto"
import {  useTools,
          ID_URL_Ok,
          confeti               } from "src/useSimpleOk/useTools"

export function useControlCotizacion() 
{
  const router                  = useRouter()
  const { aviso               } = useTools()  
  const storeAcuerdo            = useStoreAcuerdo()
  const {
          setFechaFinValidez,
          setFechaEntrega,
          setCondicionPago,
          setFormaPago,
          setMetodoEntrega,
          setTiempoEntrega,    
          getCotizacion,
          setOrigenContacto,
          setRefCliente,
          getIdEnlaceContacto,
          setComercial,
          setTerceroId,
          setAiu,
          setTotal,
          setConIVA,
                              } = servicesCotizaciones()
  const { buscarTercero,
          moverContactoAOtroTercero
                              } = servicesTerceros()
  const { apiDolibarr         } = useApiDolibarr()
  const { acuerdo,
          loading             } = storeToRefs(storeAcuerdo)  

  //* ////////////////////////////////////////////////////////////////////// Buscar cotizacion 
  async function buscarCotizacion( id_ : string )
  {
    let idOk                    = ID_URL_Ok( id_ )
    if(!idOk) router.push("/error") 

    loading.value.carga         = true
    acuerdo.value.productos     = []
    acuerdo.value               = await getCotizacion( idOk )    

    if(!!acuerdo.value.id)
    {
      //verificarPermisosLectura()
      buscarTerceroDolibarr( acuerdo.value.terceroId )
    }
    else
    {
      aviso("negative", "Error con la URL. Por favor verifique que este bien.", "account", 3000)
      router.push("/error")
    }

    loading.value.carga         = false
  }
  
  
  //* ////////////////////////////////////////////////////////////////////// Buscar tercero 
  async function buscarTerceroDolibarr( id_ : number )
  {
    acuerdo.value.tercero       = await buscarTercero( id_ )
    if(!!acuerdo.value.tercero.id)
    {
      //console.log('%c⧭', 'color: #917399', "Tercero", cotizacion.value.tercero)
    }
    else
    {
      aviso("negative", "Error con la URL. Por favor verifique que este bien.", "account", 3000)
      router.push("/error")
    }
  }


  //* ////////////////////////////////////////////////////////////////////// Cambiar contacto
  async function cambiarContactoAcuerdo( contacto : IContacto, idOld : number )
  {
    await desvincularContactoAcuerdo( idOld )
    await vincularContactoAcuerdo   ( contacto )
  }


  //* ////////////////////////////////////////////////////////////////////// Asignar nuevo contacto
  async function vincularContactoAcuerdo( contacto : IContacto )
  {
    //* ///////////////////////////////// Vincular contacto a cotizacion
    const { ok : vinculado      } = await apiDolibarr("contacto-vincular", "cotizacion",
                                                        { id:   contacto.id,
                                                          tipo: TIPOS_CONTACTO.CTZ_CUSTOMER
                                                        },
                                                        acuerdo.value.id
                                                      )
    if(vinculado){
      //const id                    = await getIdEnlaceContacto( acuerdo.value.id, contacto.id )
      //acuerdo.value.contacto.idRelacion  = id
      aviso("positive", "Contacto asignado", "account")
    }    
  }
    

  //* ////////////////////////////////////////////////////////////////////// Asignar nuevo contacto
  async function desvincularContactoAcuerdo( id : number ) : Promise<boolean>
  {
    const { ok : desvinculado } = await apiDolibarr("contacto-desvincular",  "cotizacion",
                                                      { id,
                                                        tipo: TIPOS_CONTACTO.CTZ_CUSTOMER
                                                      },
                                                      acuerdo.value.id
                                                    )
    
    if(!desvinculado){
      aviso("negative", "error al desvincular contacto", "account")     
    }

    return desvinculado
  }
    

  //* /////////////////////////////////////////////////////////////// Actualizar tercero
  async function actualizarTercero( terceroNew : ITercero )
  {
    if(acuerdo.value.esNuevo) return

    // Parece que no es necesario, solo para que sea mas corto el codigo 
    const contactoNow             = acuerdo.value.contacto

    // Servicio que cambia el ID del tercero del acuerdo 
    const idEditado               = await setTerceroId( acuerdo.value.id, terceroNew.id )
    if(idEditado){
      acuerdo.value.tercero       = terceroNew
      aviso("positive", "Tercero de cotizacion cambiado" )
    }
      
    // Si se ha cambiado el tercero, y tiene un contacto, entonces...
    if(idEditado && !!contactoNow.id)
    {
      // Si es una empresa
      if(terceroNew.esEmpresa){
        const contactoMovido      = await moverContactoAOtroTercero( contactoNow.id, terceroNew.id )      
        aviso("positive", "Contacto movido a nuevo tercero" )
      }
      // Si se mueve el acuerdo a una persona natural, se desvincula el contacto
      else
      {
        if( desvincularContactoAcuerdo(contactoNow.id) )                    // Se deja listo para si mas adelante se crea un contacto
          acuerdo.value.contacto  = new Contacto( terceroNew.id )
      }
    }
  }

  //* /////////////////////////////////////////////////////////////// Editar comercial
  async function editarComercial( usuario : IUsuario )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.comercial       = true
    const idUsuario               = !!usuario ? usuario.id : 0
    const ok                      = await setComercial( acuerdo.value.id, idUsuario )
    if   (ok) aviso("positive", "Comercial asignado", "account" )
    loading.value.comercial       = false
  }

  //* /////////////////////////////////////////////////////////////// Editar origen
  async function editarOrigen( origen : IOrigenContacto )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.origen          = true
    const ok                      = await setOrigenContacto( acuerdo.value.id, origen.id )
    if   (ok) aviso("positive", "Origen de contacto cambiado" )
    loading.value.origen          = false
  }


  //* /////////////////////////////////////////////////////////////// Editar Ref Cliente
  async function editarRefCliente( ref : string )
  {
    if(acuerdo.value.esNuevo) return 

    loading.value.ref           = true
    const ok                    = await setRefCliente( acuerdo.value.id, ref )
    if   (ok) aviso("positive", "Referencia cliente cambiada" )
    loading.value.ref           = false
  }  

  //* ////////////////////////////////////////////////////////////////////// Editar cotizacion
  async function editarCotizacion()
  {
    loading.value.editar      = true
    const { ok, data }        = await apiDolibarr("settodraft", "cotizacion", { idwarehouse: 0 }, acuerdo.value.id)

    if(ok){
      aviso("positive", "Cotización desbloqueada")
      acuerdo.value.estado    = ESTADO_CTZ.BORRADOR
    }
    else
      aviso("negative", "Error al desbloquear cotización")

    loading.value.editar      = false
  }

  //* ////////////////////////////////////////////////////////////////////// Aprobar cotizacion
  async function aprobarCotizacion()
  {
    loading.value.aprobar     = true
    const estado              = { status: 2, note_private: "", notrigger: 0 }
    const { ok, data }        = await apiDolibarr("close", "cotizacion", estado, acuerdo.value.id)

    if(ok){
      aviso("positive", "Cotización aprobada")
      confeti(6)
      acuerdo.value.estado = ESTADO_CTZ.APROBADO
    }
    else
      aviso("negative", "Error al aprobar cotización")

    loading.value.aprobar     = false
  }



  //* ////////////////////////////////////////////////////////////////////// Anular cotizacion
  async function anularCotizacion()
  {
    loading.value.anular      = true
    const estado              = { status: 3, note_private: "", notrigger: 0 }
    const { ok, data }        = await apiDolibarr("close", "cotizacion", estado, acuerdo.value.id)

    if(ok){
      aviso("positive", "Cotización anulada")
      acuerdo.value.estado = ESTADO_CTZ.RECHAZADO
    }
    else
      aviso("negative", "Error al anular cotización")

    loading.value.anular      = false
  }

  //* ////////////////////////////////////////////////////////////////////// Validar cotizacion
  async function validarCotizacion()
  {
    loading.value.validar     = true
    const { ok, data }        = await apiDolibarr("validate", "cotizacion", { notrigger: 0 }, acuerdo.value.id)
    const newCtz : any        = data
    if(ok){
      aviso("positive", "Cotización validada")
      acuerdo.value.estado = ESTADO_CTZ.COTIZADO
      if(!!newCtz && newCtz.hasOwnProperty("ref") && typeof newCtz.ref === "string")
      acuerdo.value.ref  = newCtz.ref
    }
    else
      aviso("negative", "Error al validar cotización")

    loading.value.validar     = false
  }


  //* ////////////////////////////////////////////////////////////////////// Eliminar cotizacion
  async function eliminarCotizacion()
  {
    loading.value.borrar  = true
    const { ok }          = await apiDolibarr("borrar", "cotizacion", acuerdo.value.id)
    if(ok){
      aviso("positive", "Cotización eliminada")
      router.push("/tercero/" + acuerdo.value.terceroId)
    }
    else
      aviso("negative", "Error al eliminar cotización")
    loading.value.borrar  = false
  }


  //* /////////////////////////////////////////////////////////////// Editar fecha validez
  async function editarFechaFinValidez( fecha : Date )
  {
    if(acuerdo.value.esNuevo) return
    
    loading.value.fechaFinValidez = true
    let ok                      = await setFechaFinValidez( acuerdo.value.id, acuerdo.value.fechaFinValidez )
    if (ok) aviso("positive", "Fecha cambiada", "clock" )
    loading.value.fechaFinValidez = false
  }

  //* /////////////////////////////////////////////////////////////// Editar fecha entrega
  async function editarFechaEntrega( fecha : Date )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.fechaEntrega  = true
    let ok                      = await setFechaEntrega( acuerdo.value.id, acuerdo.value.fechaEntrega )
    if (ok) aviso("positive", "Fecha cambiada editarFechaEntrega", "clock" )
    loading.value.fechaEntrega  = false
  }
  
  //* /////////////////////////////////////////////////////////////// Editar condiciones de pago
  async function editarCondicionPago( condicion : ICondicionPago )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.condicionPago = true
    let ok                      = await setCondicionPago( acuerdo.value.id, condicion.id )
    if (ok) aviso("positive", "Condición de pago cambiada" )
    loading.value.condicionPago = false
  }

  //* /////////////////////////////////////////////////////////////// Editar forma de pago
  async function editarFormaPago( forma : IFormaPago )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.formaPago     = true
    let ok                      = await setFormaPago( acuerdo.value.id, forma.id )
    if (ok) aviso("positive", "Forma de pago cambiada" )
    loading.value.formaPago     = false
  }    

  //* /////////////////////////////////////////////////////////////// Editar metodo de entrega
  async function editarMetodoEntrega( metodo : IMetodoEntrega )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.metodoEntrega     = true
    let ok                          = await setMetodoEntrega( acuerdo.value.id, metodo.id )
    if (ok) aviso("positive", "Método de entrega cambiado" )
    loading.value.metodoEntrega     = false
  }    

  //* /////////////////////////////////////////////////////////////// Editar tiempo de entrega
  async function editarTiempoEntrega( tiempo : ITiempoEntrega )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.tiempoEntrega     = true
    let ok                          = await setTiempoEntrega( acuerdo.value.id, tiempo.id )
    if (ok) aviso("positive", "Tiempo de entrega cambiado" )
    loading.value.tiempoEntrega     = false
  }

  //* /////////////////////////////////////////////////////////////// Editar con AIU
  async function editarConAIU( on : boolean )
  {
    loading.value.conAIU        = true
    let ok                      = await setAiu( acuerdo.value.id, +on, "aiu" )
    if(ok) aviso("positive", "AIU " + ( on ? "activado" : "desactivado" ))
    loading.value.conAIU        = false
  }

  //* /////////////////////////////////////////////////////////////// Editar valores AIU
  async function editarValorAIU( valor : number, tipo : "aiuAdmin" | "aiuImpre" | "aiuUtili" )  {
    loading.value.valoresAIU    = true
    let ok                      = await setAiu( acuerdo.value.id, valor, tipo )
    loading.value.valoresAIU    = false
    //if(!ok) aviso("positive", "AIU modificado")
  }
  
  //* /////////////////////////////////////////////////////////////// Editar con Total
  async function editarConTotal( on : boolean )
  {
    loading.value.conTotal      = true
    let ok                      = await setTotal( acuerdo.value.id, on )
    if(ok) aviso("positive", "Total " + ( on ? "activado" : "desactivado" ))
    loading.value.conTotal      = false
  }

  //* /////////////////////////////////////////////////////////////// Editar con IVA
  async function editarConIVA( on : boolean )
  {
    loading.value.conIVA        = true
    let conIVAEditado           = await setConIVA( acuerdo.value.id, on )
    
    for (const linea of acuerdo.value.productos)
    {
      const iva                 = parseInt( process.env.IVA ?? "0" )
      linea.iva                 =  on ? iva : 0
      let lineaEdit             = { id: linea.lineaId, tva_tx: linea.iva }
      let {ok}                  = await apiDolibarr("editar-linea", "cotizacion", lineaEdit, acuerdo.value.id )
      if (!ok){ 
        const error             = "Error al cambiar el IVA del producto"
        console.trace()
        console.error(error)
        aviso("negative", error)
      }
    }
    
    if(conIVAEditado) aviso("positive", "IVA " + ( on ? "activado" : "desactivado" ))
    loading.value.conIVA        = false
  }

  

  //* /////////////////////////////////////////////////////////////// Return
  return {
    actualizarTercero,
    aprobarCotizacion,
    anularCotizacion,
    buscarCotizacion,
    editarComercial,
    editarCotizacion,
    editarOrigen,
    editarRefCliente,
    editarTiempoEntrega,
    editarMetodoEntrega,
    editarFormaPago,
    editarCondicionPago,
    editarFechaEntrega,
    editarFechaFinValidez,    
    editarConAIU,
    editarValorAIU,
    editarConTotal,
    editarConIVA,
    eliminarCotizacion,
    validarCotizacion,
    cambiarContactoAcuerdo,
    vincularContactoAcuerdo,
    desvincularContactoAcuerdo,
  }
}