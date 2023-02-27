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
import {  useFetch              } from "src/useSimpleOk/useFetch"
import {  getURL, getFormData   } from "src/services/APIMaco"
import {  useTools,
          ID_URL_Ok,
          confeti               } from "src/useSimpleOk/useTools"
import {  dexieReglaComision    } from "src/services/useDexie"
//* ////////////////////////////////////////////////////////////////// Modelos
import {  ESTADO_CTZ,
          ESTADO_PED,
          ESTADO_ACU,
          TTipoAcuerdo,
          TIPO_ACUERDO
                                } from "../models/ConstantesAcuerdos"
import {  IOrigenContacto       } from "src/models/Diccionarios/OrigenContacto"
import {  IUsuario              } from "src/areas/usuarios/models/Usuario"
import {  ITercero              } from "src/areas/terceros/models/Tercero"
import {  ICondicionPago        } from "src/models/Diccionarios/CondicionPago"
import {  IFormaPago            } from "src/models/Diccionarios/FormaPago"
import {  IMetodoEntrega        } from "src/models/Diccionarios/MetodoEntrega"
import {  ITiempoEntrega        } from "src/models/Diccionarios/TiempoEntrega"
import {  IProyecto, Proyecto   } from "src/areas/proyectos/models/Proyecto"
import {  IAcuerdo, Acuerdo     } from "src/areas/acuerdos/models/Acuerdo"  
import {  IContacto,
          Contacto,
          TTipoContacto,
          TIPOS_CONTACTO
                                } from "src/areas/terceros/models/Contacto"


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
          getAcuerdos,
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
  const { miFetch             } = useFetch()
  const { acuerdo,
          loading             } = storeToRefs( useStoreAcuerdo() )
  const reglasComision          = dexieReglaComision()

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
    if(!!acuerdo.value.contactoComercial.id)
    {
      const { ok : vinculado  } = await apiDolibarr("contacto-vincular", acuerdo.value.tipo,
                                          {
                                            id:   acuerdo.value.contactoComercial.id,
                                            tipo: TIPOS_CONTACTO.COMERCIAL
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
    router.push( `/${acuerdo.value.ruta}/${id}` )
    return true
  }

  //* ////////////////////////////////////////////////////////////////////// Buscar Acuerdo
  async function buscarAcuerdo( tipo : TTipoAcuerdo, id_ : string )
  {
    const idOk                  = ID_URL_Ok( id_ )
    if(!idOk) router.push("/error")

    loading.value.carga         = true
    acuerdo.value.productos     = []
    acuerdo.value               = await getAcuerdo( tipo, idOk )

    if(!acuerdo.value.proGrupos.length) crearNuevoGrupo()

    if(!!acuerdo.value.id)
    {
      //verificarPermisosLectura()
      await buscarTerceroDolibarr ( acuerdo.value.terceroId   )
      await buscarProyecto        ( acuerdo.value.proyectoId  )
      //await buscarEntregasPedido  ( acuerdo.value.id          )
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

  //* ////////////////////////////////////////////////////////////////////// Buscar proyecto
  async function buscarProyecto( id_ : number )
  {
    if(!id_) return
    const { data, ok }         = await apiDolibarr("ver", "proyecto", {}, id_ )

    if(ok && typeof data === "object" && !Array.isArray( data )){
      acuerdo.value.proyecto    = Proyecto.convertirDataApiToProyecto( data )
    }
  }
 
  //* ////////////////////////////////////////////////////////////////////// Buscar entregas de pedido
  async function buscarEntregasPedido( id_ : number )
  {
    if(!id_) return
    const { data, ok }        = await apiDolibarr("ver", "entregasPedido", {}, id_ )
    
    if(ok && typeof data === "object" && Array.isArray( data ))
    {
      //console.log("Data Api", data[0]);
      acuerdo.value.entregas  = await Acuerdo.convertirDataApiToEntregas( data )
    }
  }



  //* ////////////////////////////////////////////////////////////////////// Cambiar contacto
  async function cambiarContactoAcuerdo( contacto : IContacto, idOld : number, tipo : TTipoContacto )
  {
    if(!acuerdo.value.id) return

    if(!acuerdo.value.esEntrega)
    {
      await desvincularContactoAcuerdo( idOld, tipo )
      await vincularContactoAcuerdo   ( contacto, tipo )
    }
    else
    {
      await cambiarContactoEntrega( contacto.id )
    }
  }


  //* ////////////////////////////////////////////////////////////////////// Cambiar contacto entrega
  async function cambiarContactoEntrega( contacto_id : number)
  {
    const endPoint              = getURL("servicios", "acuerdos")
    const objeto                = { contacto_id, entrega_id: acuerdo.value.id, acuerdo: acuerdo.value.tipo }
    const objetoForData         = { body: getFormData("editarContactoEntrega", objeto), method: "POST"}
    const { ok  }               = await miFetch( endPoint, objetoForData, { mensaje: "contacto de entrega" } )        
    
    if(ok){
      aviso("positive", `Contacto de entrega cambiado 👌🏼`)
    }
    else
      aviso("negative", `Error cambiar contacto de ${acuerdo.value.tipo}`)
  }


  //* ////////////////////////////////////////////////////////////////////// Asignar nuevo contacto
  async function vincularContactoAcuerdo( contacto : IContacto, tipo : TTipoContacto )
  {
    if(!acuerdo.value.id) return

    if(acuerdo.value.esEntrega)
    {
      await cambiarContactoEntrega( contacto.id )
      return
    }

    //* ///////////////////////////////// Vincular contacto a acuerdo
    const { ok : vinculado      } = await apiDolibarr("contacto-vincular", acuerdo.value.tipo,
                                                        { id:   contacto.id,
                                                          tipo
                                                        },
                                                        acuerdo.value.id
                                                      )
    if(vinculado){
      //const id                    = await getIdEnlaceContacto( acuerdo.value.id, contacto.id )
      //acuerdo.value.contacto.idRelacion  = id
      aviso("positive", "Contacto asignado", "account")

      if(tipo === TIPOS_CONTACTO.ENTREGA  ){
        acuerdo.value.contactoEntrega   = contacto
        await editarDatosEntregaSistemaViejo()
      }
      else
      if(tipo === TIPOS_CONTACTO.CONTABLE ) acuerdo.value.contactoContable  = contacto
    }
  }


  //* ////////////////////////////////////////////////////////////////////// Asignar nuevo contacto
  async function desvincularContactoAcuerdo( id : number, tipo : TTipoContacto, mostrarAviso : boolean = false  ) : Promise<boolean>
  {
    const { ok : desvinculado } = await apiDolibarr("contacto-desvincular",  acuerdo.value.tipo,
                                                      { id, tipo },
                                                      acuerdo.value.id
                                                    )

    if(desvinculado){
      if(mostrarAviso)
        aviso("positive", "Contacto desvinculado", "account")

      if(tipo === TIPOS_CONTACTO.ENTREGA  ){
        acuerdo.value.contactoEntrega   = new Contacto()
        await editarDatosEntregaSistemaViejo()
      }
      else
      if(tipo === TIPOS_CONTACTO.CONTABLE ) acuerdo.value.contactoContable  = new Contacto()
    }
    else{
      aviso("negative", "error al desvincular contacto", "account")
    }
    await editarDatosEntregaSistemaViejo()
    return desvinculado
  }

  async function editarDatosEntregaSistemaViejo() : Promise<boolean>
  {
    const endPoint              = getURL("servicios", "acuerdos")
    const objeto                = {
                                    pedido_id:    acuerdo.value.id,
                                    acuerdo:      acuerdo.value.tipo,
                                    ciudad:       acuerdo.value.contactoEntrega.municipio.label,
                                    dir_entre:    acuerdo.value.contactoEntrega.direccion,
                                    indicaciones: acuerdo.value.contactoEntrega.nota,
                                  }
    const objetoForData         = { body: getFormData("editarEntregaOld", objeto), method: "POST"}
    const { ok  }               = await miFetch( endPoint, objetoForData, { mensaje: "datos entrega" } )
    return ok
  }


  //* /////////////////////////////////////////////////////////////// Actualizar tercero
  async function actualizarTercero( terceroNew : ITercero )
  {
    if(acuerdo.value.esNuevo) return

    // Parece que no es necesario, solo para que sea mas corto el codigo
    const contactoNow             = acuerdo.value.contactoComercial

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
        if( desvincularContactoAcuerdo( contactoNow.id, contactoNow.tipo ) )  // Se deja listo para si mas adelante se crea un contacto
          acuerdo.value.contactoComercial  = new Contacto( terceroNew.id )
      }
    }
  }

  //* /////////////////////////////////////////////////////////////// Editar comercial
  async function editarComercial( usuario : IUsuario | null, numeroComercial : string )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.comercial       = true
    const idUsuario               = !!usuario ? usuario.id : 0

    const ok                      = await setComercial( acuerdo.value.id, idUsuario, acuerdo.value.tipo, numeroComercial )

    if(ok) {
      aviso("positive", "Comercial editado", "account" )
      if(!!usuario)
        asignarReglaComision( usuario )
    }
    loading.value.comercial       = false
  }

  async function asignarReglaComision( comercial : IUsuario )
  {
    if(!reglasComision.value.length){
      console.warn("Error asignando regla de comisión. No hay reglas.")
      return
    }

    const i       = reglasComision.value.findIndex( r => r.id == comercial.reglaComisionId )
    if(i          === -1){
      console.warn("Error asignando regla de comisión. Regla no encontrada.")
      return 
    }
    comercial.comision = reglasComision.value[i]
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
  async function pasarABorradorAcuerdo()
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

  //* ////////////////////////////////////////////////////////////////////// Editar acuerdo
  async function reabrirPedido()
  {
    loading.value.editar      = true
    const { ok, data }        = await apiDolibarr("reopen", acuerdo.value.tipo, {}, acuerdo.value.id)

    if(ok){
      aviso("positive", `Reapertura de ${acuerdo.value.tipo} 👌🏼`)
      acuerdo.value.estado    = ESTADO_PED.VALIDADO
    }
    else
      aviso("negative", `Error al reabrir ${acuerdo.value.tipo}`)

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

  //* ////////////////////////////////////////////////////////////////////// Cerrar pedido
  async function cerrarPedido()
  {
    loading.value.cerrar      = true
    const ok                  = await cerrarAcuerdo( acuerdo.value.tipo,  acuerdo.value.id)

    if(ok){
      aviso("positive", `Entrega de ${acuerdo.value.label} 👌🏼`)
      acuerdo.value.estado    = ESTADO_PED.ENTREGADO
    }
    else
      aviso("negative", `"Error al cerrar ${acuerdo.value.tipo}`)

    loading.value.cerrar      = false
  }

  //* ////////////////////////////////////////////////////////////////////// Cerrar pedido
  async function cerrarAcuerdo( tipo : TIPO_ACUERDO , id : number)
  {
    const { ok }        = await apiDolibarr("close", tipo, { notrigger: 0 }, id)
    return ok
  }

  //* ////////////////////////////////////////////////////////////////////// Anular acuerdo
  async function anularAcuerdo()
  {
    loading.value.anular      = true
    let estado                = {}
    let accion : "close" | "editar" = "editar"

    if(acuerdo.value.esCotizacion){
      estado                  = { status: ESTADO_CTZ.RECHAZADO, note_private: "", notrigger: 0 }
      accion                  = "close"
    }
    else if(acuerdo.value.esPedido)
    {
      estado                  = { statut: ESTADO_PED.CANCELADO, notrigger: 0 }
      accion                  = "editar"
    }
    const { ok, data }        = await apiDolibarr(accion, acuerdo.value.tipo, estado, acuerdo.value.id)

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

  //* ////////////////////////////////////////////////////////////////////// Editar Nota Privada
  async function cambiarProyecto( proyecto : IProyecto )
  {
    if(acuerdo.value.esNuevo || !proyecto) return
    const id                    = proyecto.id === 0 ? null : proyecto.id

    loading.value.proyecto      = true
    const {ok}                  = await apiDolibarr("editar", acuerdo.value.tipo, { fk_project: id }, acuerdo.value.id )
    if(ok){
      aviso("positive", !!id ? `Proyecto asignado 👌🏼` : "Proyecto desvinculado")
    }
    else
      aviso("negative", `Error al asignar proyecto en ${acuerdo.value.tipo}`)
    loading.value.proyecto      = false
  }

  //* ////////////////////////////////////////////////////////////////////// Editar Nota Privada
  async function editarNotaPrivada( nota : string )
  {
    if(acuerdo.value.esNuevo) return
    loading.value.notaPrivada   = true
    const {ok}                  = await apiDolibarr("editar", acuerdo.value.tipo, { note_private: nota }, acuerdo.value.id )
    if(ok){
      aviso("positive", `Nota privada editada 👌🏼`)
    }
    else
      aviso("negative", `Error editar nota privada de ${acuerdo.value.tipo}`)
    loading.value.notaPrivada   = false
  }

  //* ////////////////////////////////////////////////////////////////////// Editar Nota Privada
  async function editarNotaPublica( nota : string )
  {
    if(acuerdo.value.esNuevo) return
    loading.value.notaPublica   = true
    const {ok}                  = await apiDolibarr("editar", acuerdo.value.tipo, { note_public: nota }, acuerdo.value.id )
    if(ok){
      aviso("positive", `Nota publica editada 👌🏼`)
    }
    else
      aviso("negative", `Error editar nota publica de ${acuerdo.value.tipo}`)
    loading.value.notaPublica   = false
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
    const ok                      = await setFechaFinValidez( acuerdo.value.id, acuerdo.value.fechaFinValidez, acuerdo.value.tipo )
    if (ok) aviso("positive", "Fecha cambiada", "clock" )
    loading.value.fechaFinValidez = false
  }

  //* /////////////////////////////////////////////////////////////// Editar fecha entrega
  async function editarFechaEntrega( fecha : Date )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.fechaEntrega  = true
    const ok                    = await setFechaEntrega( acuerdo.value.id, acuerdo.value.fechaEntrega, acuerdo.value.tipo )
    if (ok) aviso("positive", "Fecha de entrega cambiada", "clock" )
    loading.value.fechaEntrega  = false
  }

  //* /////////////////////////////////////////////////////////////// Editar condiciones de pago
  async function editarCondicionPago( condicion : ICondicionPago )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.condicionPago = true
    const ok                    = await setCondicionPago( acuerdo.value.id, condicion.id, acuerdo.value.tipo )
    if (ok) aviso("positive", "Condición de pago cambiada" )
    loading.value.condicionPago = false
  }

  //* /////////////////////////////////////////////////////////////// Editar forma de pago
  async function editarFormaPago( forma : IFormaPago )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.formaPago     = true
    const ok                    = await setFormaPago( acuerdo.value.id, forma.id, acuerdo.value.tipo)
    if (ok) aviso("positive", "Forma de pago cambiada" )
    loading.value.formaPago     = false
  }

  //* /////////////////////////////////////////////////////////////// Editar metodo de entrega
  async function editarMetodoEntrega( metodo : IMetodoEntrega )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.metodoEntrega     = true
    const ok                        = await setMetodoEntrega( acuerdo.value.id, metodo.id, acuerdo.value.tipo)
    if (ok) aviso("positive", "Método de entrega cambiado" )
    loading.value.metodoEntrega     = false
  }

  //* /////////////////////////////////////////////////////////////// Editar tiempo de entrega
  async function editarTiempoEntrega( tiempo : ITiempoEntrega )
  {
    if(acuerdo.value.esNuevo) return

    loading.value.tiempoEntrega     = true
    const ok                        = await setTiempoEntrega( acuerdo.value.id, tiempo.id, acuerdo.value.tipo)
    if (ok) aviso("positive", "Tiempo de entrega cambiado" )
    loading.value.tiempoEntrega     = false
  }

  //* /////////////////////////////////////////////////////////////// Editar con AIU
  async function editarConAIU( on : boolean )
  {
    loading.value.conAIU        = true
    const ok                    = await setAiu( acuerdo.value.id, +on, "aiu", acuerdo.value.tipo)
    if(ok) aviso("positive", "AIU " + ( on ? "activado" : "desactivado" ))
    loading.value.conAIU        = false
  }

  //* /////////////////////////////////////////////////////////////// Editar valores AIU
  async function editarValorAIU( valor : number, tipo : "aiuAdmin" | "aiuImpre" | "aiuUtili" )  {
    loading.value.valoresAIU    = true
    const ok                    = await setAiu( acuerdo.value.id, valor, tipo, acuerdo.value.tipo)
    loading.value.valoresAIU    = false
    //if(!ok) aviso("positive", "AIU modificado")
  }

  //* /////////////////////////////////////////////////////////////// Editar con Total
  async function editarConTotal( on : boolean )
  {
    loading.value.conTotal      = true
    const ok                    = await setTotal( acuerdo.value.id, on, acuerdo.value.tipo)
    if(ok) aviso("positive", "Total " + ( on ? "activado" : "desactivado" ))
    loading.value.conTotal      = false
  }

  //* /////////////////////////////////////////////////////////////// Editar con IVA
  async function editarConIVA( on : boolean )
  {
    loading.value.conIVA        = true
    const conIVAEditado         = await setConIVA( acuerdo.value.id, on, acuerdo.value.tipo)

    for (const linea of acuerdo.value.productos)
    {
      const iva                 = parseInt( process.env.IVA ?? "0" )
      linea.iva                 =  on ? iva : 0
      const lineaEdit           = { id: linea.lineaId, tva_tx: linea.iva }
      const {ok}                = await apiDolibarr("editar-linea", acuerdo.value.tipo, lineaEdit, acuerdo.value.id )
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

  async function buscarAcuerdoEnlazados() : Promise< IAcuerdo[] >
  {
    loading.value.enlaces = true
    const pedi            = getIds(   TIPO_ACUERDO.PEDIDO_CLI       )
    const coti            = getIds(   TIPO_ACUERDO.COTIZACION_CLI   )
    const oc_p            = getIds(   TIPO_ACUERDO.PEDIDO_PRO       )
    const en_c            = getIds(   TIPO_ACUERDO.ENTREGA_CLI      )

    const paquete         = [ { ids:  pedi, tipo: TIPO_ACUERDO.PEDIDO_CLI       },
                              { ids:  coti, tipo: TIPO_ACUERDO.COTIZACION_CLI   },
                              { ids:  oc_p, tipo: TIPO_ACUERDO.PEDIDO_PRO       },
                              { ids:  en_c, tipo: TIPO_ACUERDO.ENTREGA_CLI      },
                            ]
    const acuerdos : IAcuerdo[] = []
    acuerdo.value.entregas= []

    for (const item of paquete )
    {
      if( !item.ids ) continue
      const query               = {
                                    acuerdo:    item.tipo,
                                    tipo:       "busqueda",
                                    ids:        item.ids,
                                    limite:     50,
                                    offset:     0
                                  }
      const acuerdosI           = await getAcuerdos( query )
      acuerdos.push( ...acuerdosI )

      if( acuerdo.value.esPedido && item.tipo === TIPO_ACUERDO.ENTREGA_CLI )
      {
        acuerdo.value.entregas.push( ...acuerdosI )
      }
    }
    
    if( acuerdo.value.esPedido  )    
      acuerdo.value.calcularEntregado()

    loading.value.enlaces = false
    return acuerdos

    function getIds( tipo : TTipoAcuerdo ) :string
    {
      const enla                = acuerdo.value.enlaces.filter( e => e.destinoSmart.tipo === tipo )
      return  !!enla.length
              ? enla.flatMap( ( enla )=> enla.destinoSmart.id ).join(",") 
              : ""
    }
  }



  //* /////////////////////////////////////////////////////////////// Return
  return {
    crearAcuerdo,
    cambiarProyecto,
    actualizarTercero,
    aprobarCotizacion,
    anularAcuerdo,
    buscarAcuerdo,
    buscarTerceroDolibarr,
    editarComercial,
    pasarABorradorAcuerdo,
    reabrirPedido,
    editarOrigen,
    cerrarPedido,
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
    editarNotaPrivada,
    editarNotaPublica,
    cambiarContactoAcuerdo,
    vincularContactoAcuerdo,
    desvincularContactoAcuerdo,
    editarDatosEntregaSistemaViejo,
    buscarAcuerdoEnlazados,
  }
}
