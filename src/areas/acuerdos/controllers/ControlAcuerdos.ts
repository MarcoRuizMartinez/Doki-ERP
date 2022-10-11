//* ////////////////////////////////////////////////////////////////// Core
import {  useRouter             } from 'vue-router'
//* ////////////////////////////////////////////////////////////////// Store
import {  storeToRefs           } from 'pinia'  
import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
//* ////////////////////////////////////////////////////////////////// Componibles
import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"
import {  servicesAcuerdos      } from "src/areas/acuerdos/services/servicesAcuerdos"
import {  servicesTerceros      } from "src/areas/terceros/services/servicesTerceros"
import {  useApiDolibarr        } from "src/services/useApiDolibarr"  
import {  useTools,
          ID_URL_Ok,
          confeti               } from "src/useSimpleOk/useTools"
//* ////////////////////////////////////////////////////////////////// Modelos
import {  ESTADO_CTZ,
          ESTADO_PED,
          TTipoAcuerdo,
          ESTADO_ACU,
          TIPO_ACUERDO          } from "../../../areas/acuerdos/models/ConstantesAcuerdos"
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


export function useControlAcuerdo() 
{
  const router                  = useRouter()
  const { aviso               } = useTools()  
  const {
          setFechaFinValidez,
          setFechaEntrega,
          setCondicionPago,
          setFormaPago,
          setMetodoEntrega,
          setTiempoEntrega,    
          getAcuerdo,
          setOrigenContacto,
          setRefCliente,
          setComercial,
          setTerceroId,
          setAiu,
          setTotal,
          setConIVA,
                              } = servicesAcuerdos()

  const { crearNuevoGrupo     } = useControlProductos()
  const { buscarTercero,
          moverContactoAOtroTercero
                              } = servicesTerceros()
  const { apiDolibarr         } = useApiDolibarr()
  const { acuerdo,
          loading             } = storeToRefs( useStoreAcuerdo() )  

  //* /////////////////////////////////////////////////////////////// Crear Acuerdo
  async function crearAcuerdo( idUsuario : number ) : Promise<boolean>
  {
    loading.value.crear       = true
    const acuForApi           = acuerdo.value.getAcuerdoForApi( idUsuario )    
    const { ok, data }        = await apiDolibarr("crear", acuerdo.value.tipo, acuForApi )
    if(!ok || !data) {
      aviso("negative", `Error al crear al ${acuerdo.value.tipo}`)
      loading.value.crear     = false
      return false
    }
    const id                  = typeof data === "number" ? data : 0
    acuerdo.value.id          = id

    //* ////////////////////  Creando Contacto si corresponde
    if(!!acuerdo.value.contacto.id)
    {
      const { ok : vinculado  } = await apiDolibarr("contacto-vincular", acuerdo.value.tipo,
                                          {
                                            id:   acuerdo.value.contacto.id,
                                            tipo: TIPOS_CONTACTO.CTZ_CUSTOMER
                                          },
                                          id
                                          )
      if(!vinculado){
        aviso("negative", "Error al asignar contacto")
      }
    }
    
    //* ////////////////////  Notificando y redireccionando
    aviso("positive", `Creación de ${acuerdo.value.tipo} 👌🏼`)
    loading.value.crear       = false
    router.push( `/${acuerdo.value.tipoPlural}/${id}` )
    return true
  }          

  //* ////////////////////////////////////////////////////////////////////// Buscar Acuerdo 
  async function buscarAcuerdo( tipo : TTipoAcuerdo, id_ : string )
  {
    let idOk                    = ID_URL_Ok( id_ )
    if(!idOk) router.push("/error") 

    loading.value.carga         = true
    acuerdo.value.productos     = []
    acuerdo.value               = await getAcuerdo( tipo, idOk )

    if(!acuerdo.value.proGrupos.length) crearNuevoGrupo()

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
    if(!!acuerdo.value.tercero.id){
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
    if(!acuerdo.value.id) return
    await desvincularContactoAcuerdo( idOld )
    await vincularContactoAcuerdo   ( contacto )
  }


  //* ////////////////////////////////////////////////////////////////////// Asignar nuevo contacto
  async function vincularContactoAcuerdo( contacto : IContacto )
  {
    if(!acuerdo.value.id) return
    //* ///////////////////////////////// Vincular contacto a acuerdo
    const { ok : vinculado      } = await apiDolibarr("contacto-vincular", acuerdo.value.tipo,
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
    const { ok : desvinculado } = await apiDolibarr("contacto-desvincular",  acuerdo.value.tipo,
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
    const idEditado               = await setTerceroId( acuerdo.value.id, terceroNew.id, acuerdo.value.tipo)
    if(idEditado){
      acuerdo.value.tercero       = terceroNew
      aviso("positive", `Tercero de ${acuerdo.value.tipo} cambiado` )
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
    const ok                      = await setComercial( acuerdo.value.id, idUsuario, acuerdo.value.tipo)
    if   (ok) aviso("positive", "Comercial asignado", "account" )
    loading.value.comercial       = false
  }

  //* /////////////////////////////////////////////////////////////// Editar origen
  async function editarOrigen( origen : IOrigenContacto )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.origen          = true
    const ok                      = await setOrigenContacto( acuerdo.value.id, origen.id, acuerdo.value.tipo)
    if   (ok) aviso("positive", "Origen de contacto cambiado" )
    loading.value.origen          = false
  }


  //* /////////////////////////////////////////////////////////////// Editar Ref Cliente
  async function editarRefCliente( ref : string )
  {
    if(acuerdo.value.esNuevo) return 

    loading.value.ref           = true
    const ok                    = await setRefCliente( acuerdo.value.id, ref, acuerdo.value.tipo)
    if   (ok) aviso("positive", "Referencia cliente cambiada" )
    loading.value.ref           = false
  }  

  //* ////////////////////////////////////////////////////////////////////// Editar acuerdo
  async function editarAcuerdo()
  {
    loading.value.editar      = true
    const { ok, data }        = await apiDolibarr("settodraft", acuerdo.value.tipo, { idwarehouse: 0 }, acuerdo.value.id)

    if(ok){
      aviso("positive", `Desbloqueo de ${acuerdo.value.tipo} 👌🏼`)
      acuerdo.value.estado    = ESTADO_ACU.BORRADOR
    }
    else
      aviso("negative", `Error al desbloquear ${acuerdo.value.tipo}`)

    loading.value.editar      = false
  }

  //* ////////////////////////////////////////////////////////////////////// Aprobar Cotizacion
  async function aprobarCotizacion()
  {
    loading.value.aprobar     = true
    const estado              = { status: 2, note_private: "", notrigger: 0 }
    const { ok, data }        = await apiDolibarr("close", acuerdo.value.tipo, estado, acuerdo.value.id)

    if(ok){
      aviso("positive", `Aprobación de ${acuerdo.value.tipo} 👌🏼`)
      confeti(6)
      acuerdo.value.estado    = ESTADO_CTZ.APROBADO
    }
    else
      aviso("negative", `"Error al aprobar ${acuerdo.value.tipo}`)

    loading.value.aprobar     = false
  }



  //* ////////////////////////////////////////////////////////////////////// Anular acuerdo
  async function anularAcuerdo()
  {
    loading.value.anular      = true
    const estado              = { status: 3, note_private: "", notrigger: 0 }
    const { ok, data }        = await apiDolibarr("close", acuerdo.value.tipo, estado, acuerdo.value.id)

    if(ok){
      aviso("positive", `Anulación de ${acuerdo.value.tipo} 👌🏼`)
      acuerdo.value.estado    = acuerdo.value.esCotizacion ? ESTADO_CTZ.RECHAZADO : ESTADO_PED.CANCELADO
    }
    else
      aviso("negative", `"Error al anular ${acuerdo.value.tipo}`)

    loading.value.anular      = false
  }

  //* ////////////////////////////////////////////////////////////////////// Validar acuerdo
  async function validarAcuerdo()
  {
    loading.value.validar     = true
    const { ok, data }        = await apiDolibarr("validate", acuerdo.value.tipo, { notrigger: 0 }, acuerdo.value.id)
    const newCtz : any        = data
    if(ok){
      aviso("positive", `Validación de ${acuerdo.value.tipo} 👌🏼`)
      acuerdo.value.estado    = ESTADO_ACU.VALIDADO
      if(!!newCtz && newCtz.hasOwnProperty("ref") && typeof newCtz.ref === "string")
      acuerdo.value.ref  = newCtz.ref
    }
    else
      aviso("negative", `Error al validar ${acuerdo.value.tipo}`)

    loading.value.validar     = false
  }


  //* ////////////////////////////////////////////////////////////////////// Eliminar acuerdo
  async function eliminarAcuerdo()
  {
    loading.value.borrar  = true
    const { ok }          = await apiDolibarr("borrar", acuerdo.value.tipo, acuerdo.value.id)
    if(ok){
      aviso("positive", `Eliminación de ${acuerdo.value.tipo} 👌🏼`)
      router.push("/tercero/" + acuerdo.value.terceroId)
    }
    else
      aviso("negative", `Error al eliminar ${acuerdo.value.tipo}`)
    loading.value.borrar  = false
  }


  //* /////////////////////////////////////////////////////////////// Editar fecha validez
  async function editarFechaFinValidez( fecha : Date )
  {
    if(acuerdo.value.esNuevo) return
    
    loading.value.fechaFinValidez = true
    let ok                      = await setFechaFinValidez( acuerdo.value.id, acuerdo.value.fechaFinValidez, acuerdo.value.tipo )
    if (ok) aviso("positive", "Fecha cambiada", "clock" )
    loading.value.fechaFinValidez = false
  }

  //* /////////////////////////////////////////////////////////////// Editar fecha entrega
  async function editarFechaEntrega( fecha : Date )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.fechaEntrega  = true
    let ok                      = await setFechaEntrega( acuerdo.value.id, acuerdo.value.fechaEntrega, acuerdo.value.tipo )
    if (ok) aviso("positive", "Fecha de entrega cambiada", "clock" )
    loading.value.fechaEntrega  = false
  }
  
  //* /////////////////////////////////////////////////////////////// Editar condiciones de pago
  async function editarCondicionPago( condicion : ICondicionPago )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.condicionPago = true
    let ok                      = await setCondicionPago( acuerdo.value.id, condicion.id, acuerdo.value.tipo )
    if (ok) aviso("positive", "Condición de pago cambiada" )
    loading.value.condicionPago = false
  }

  //* /////////////////////////////////////////////////////////////// Editar forma de pago
  async function editarFormaPago( forma : IFormaPago )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.formaPago     = true
    let ok                      = await setFormaPago( acuerdo.value.id, forma.id, acuerdo.value.tipo)
    if (ok) aviso("positive", "Forma de pago cambiada" )
    loading.value.formaPago     = false
  }    

  //* /////////////////////////////////////////////////////////////// Editar metodo de entrega
  async function editarMetodoEntrega( metodo : IMetodoEntrega )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.metodoEntrega     = true
    let ok                          = await setMetodoEntrega( acuerdo.value.id, metodo.id, acuerdo.value.tipo)
    if (ok) aviso("positive", "Método de entrega cambiado" )
    loading.value.metodoEntrega     = false
  }    

  //* /////////////////////////////////////////////////////////////// Editar tiempo de entrega
  async function editarTiempoEntrega( tiempo : ITiempoEntrega )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.tiempoEntrega     = true
    let ok                          = await setTiempoEntrega( acuerdo.value.id, tiempo.id, acuerdo.value.tipo)
    if (ok) aviso("positive", "Tiempo de entrega cambiado" )
    loading.value.tiempoEntrega     = false
  }

  //* /////////////////////////////////////////////////////////////// Editar con AIU
  async function editarConAIU( on : boolean )
  {
    loading.value.conAIU        = true
    let ok                      = await setAiu( acuerdo.value.id, +on, "aiu", acuerdo.value.tipo)
    if(ok) aviso("positive", "AIU " + ( on ? "activado" : "desactivado" ))
    loading.value.conAIU        = false
  }

  //* /////////////////////////////////////////////////////////////// Editar valores AIU
  async function editarValorAIU( valor : number, tipo : "aiuAdmin" | "aiuImpre" | "aiuUtili" )  {
    loading.value.valoresAIU    = true
    let ok                      = await setAiu( acuerdo.value.id, valor, tipo, acuerdo.value.tipo)
    loading.value.valoresAIU    = false
    //if(!ok) aviso("positive", "AIU modificado")
  }
  
  //* /////////////////////////////////////////////////////////////// Editar con Total
  async function editarConTotal( on : boolean )
  {
    loading.value.conTotal      = true
    let ok                      = await setTotal( acuerdo.value.id, on, acuerdo.value.tipo)
    if(ok) aviso("positive", "Total " + ( on ? "activado" : "desactivado" ))
    loading.value.conTotal      = false
  }

  //* /////////////////////////////////////////////////////////////// Editar con IVA
  async function editarConIVA( on : boolean )
  {
    loading.value.conIVA        = true
    let conIVAEditado           = await setConIVA( acuerdo.value.id, on, acuerdo.value.tipo)
    
    for (const linea of acuerdo.value.productos)
    {
      const iva                 = parseInt( process.env.IVA ?? "0" )
      linea.iva                 =  on ? iva : 0
      let lineaEdit             = { id: linea.lineaId, tva_tx: linea.iva }
      let {ok}                  = await apiDolibarr("editar-linea", acuerdo.value.tipo, lineaEdit, acuerdo.value.id )
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
    crearAcuerdo,
    actualizarTercero,
    aprobarCotizacion,
    anularAcuerdo,
    buscarAcuerdo,
    buscarTerceroDolibarr,
    editarComercial,
    editarAcuerdo,
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
    eliminarAcuerdo,
    validarAcuerdo,
    cambiarContactoAcuerdo,
    vincularContactoAcuerdo,
    desvincularContactoAcuerdo,
  }
}