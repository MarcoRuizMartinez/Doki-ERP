<template>
  <q-page                     padding
    class                     ="row items-stretch content-start justify-left q-col-gutter-md"
    >    
    <titulo-ctz
      class                   ="col-12"
      :loading                ="loading"
      :cotizacion             ="cotizacion"
      @click                  ="generarPDFCotizacion"
      @recargar               ="evaluarID_y_buscar"
    />
    <botonera
      class                   ="col-12"
      :estado                 ="cotizacion.estado"
      :loading                ="loading"
      :cotizacion             ="cotizacion"
      @clickPDF               ="generarPDFCotizacion"
      @clickAprobar           ="aprobarCotizacion"
      @clickAnular            ="anularCotizacion"
      @clickValidar           ="validarCotizacion"
      @clickEditar            ="editarCotizacion"
      @clickBorrar            ="eliminarCotizacion"
    />
    <tercero-y-contacto
      v-model:cotizacion      ="cotizacion"
      class                   ="col-md-4 col-12 full-height"
      height-card             ="220px"
    />
    <condiciones
      v-model:cotizacion      ="cotizacion"
      class                   ="col-md-4 col-12 full-height"
      height-card             ="220px"
    />
    <totales
      v-model:cotizacion      ="cotizacion"
      class                   ="col-md-4 col-12 full-height"
      height-card             ="220px"
    />
    <productos
      v-model:cotizacion      ="cotizacion"
      class                   ="col-12"
    />
    <!-- //* /////////////////  Visor PDF  -->
    <visor-pdf                descargar
      v-model:src             ="srcPDF"
      v-model:visible         ="ventanaPDF"
      nombre-pdf              ="cotizacion"
      @click-descargar        ="guardarPDF"
    />
  </q-page> 
</template>

<script setup lang="ts">
  import {  ref,
            watch,
            toRefs,
            provide,
            computed,
            onMounted,
                                  } from "vue"
  import {  useRouter             } from 'vue-router'
  import {  storeToRefs           } from 'pinia'  
  import {  servicesCotizaciones  } from "src/areas/acuerdos/cotizaciones/services/servicesCotizaciones"
  import {  servicesTerceros      } from "src/areas/terceros/services/servicesTerceros"  
  import {  useStoreUser          } from 'src/stores/user'
  import {  useApiDolibarr        } from "src/services/useApiDolibarr"
  import {  useTitle              } from "@vueuse/core"
  import {  useTools,
            ID_URL_Ok,
            confeti               } from "src/useSimpleOk/useTools"
  import {  ICotizacion,
            Cotizacion,
            ESTADO_CTZ            } from "src/areas/acuerdos/cotizaciones/models/Cotizacion"
  import {  ITercero,
            Tercero               } from "src/areas/terceros/models/Tercero"
  import {  ILoading,
            LoadingDefault        } from "src/models/TiposVarios"
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import {  useCotizacionPDF      } from "src/areas/acuerdos/cotizaciones/composables/useCotizacionPDF"
  import    botonera                from "src/areas/acuerdos/cotizaciones/components/BotoneraCotizacion.vue"
  import    tituloCtz               from "src/areas/acuerdos/cotizaciones/components/TituloCotizacion.vue"
  import    terceroYContacto        from "src/areas/acuerdos/cotizaciones/components/TerceroYcontacto.vue"
  import    condiciones             from "src/areas/acuerdos/cotizaciones/components/CondicionesCotizacion.vue"
  import    totales                 from "src/areas/acuerdos/cotizaciones/components/TotalesCotizacion.vue"
  import    productos               from "src/areas/acuerdos/components/ProductosAcuerdo.vue"
  import    visorPdf                from "components/utilidades/VisorPDF.vue"

  const { getCotizacion     } = servicesCotizaciones()
  const { generarPDF,
          guardarPDF        } = useCotizacionPDF()
  const { buscarTercero     } = servicesTerceros()
  const { aviso             } = useTools()  
  const { usuario, permisos } = storeToRefs( useStoreUser() )  
  const router                = useRouter()
  const cotizacion            = ref< ICotizacion  >( new Cotizacion() )
  //const { tercero  }          = toRefs( cotizacion.value )
  //const tercero               = ref< ITercero     >( new Tercero()    )
  //provide("tercero",  tercero )


  const minimizadoTodo        = ref< boolean  >(false)
  const loading               = ref< ILoading >( LoadingDefault )
  const srcPDF                = ref< string   >("")
  const ventanaPDF            = ref< boolean  >(false)
  const title                 = useTitle()
  const { apiDolibarr    }    = useApiDolibarr()
  provide('superminimizado', minimizadoTodo)

  const props                 = defineProps({
    id: { required: true, type: String }
  })
  
  const { id }                = toRefs( props )  
  const usuarioEsDueño        = computed( () =>{ return cotizacion.value.tercero.responsables.some( r => r.id == usuario.value.id ) })
  const puedeModificar        = computed( () =>{
                                  if
                                  (
                                    permisos.value.cotizar_crear
                                    &&
                                    ( usuarioEsDueño.value || permisos.value.acceso_total )
                                  )
                                    return true
                                  else
                                    return false 
                                })
  const disableBtnValidar     = computed( () =>{
                                  const largo = cotizacion.value.productos.filter( p => p.tipo < 3 ).length

                                  return loading.value.carga || !largo
                                })

  watch(cotizacion, ()=>  title.value =  `📜 ${cotizacion.value.title}`,{ deep: true } )

  onMounted( evaluarID_y_buscar )
  //* ////////////////////////////////////////////////////////////////////// Inicio Motor de carga de tercero  
  function evaluarID_y_buscar()
  {
    let idOk                  = ID_URL_Ok( id.value )
    if(!!idOk)
      buscarCotizacion( idOk )
    else
      router.push("/error")
  }

  async function generarPDFCotizacion()
  {
    loading.value.pdf         = true
    ventanaPDF.value          = true
    //srcPDF.value              = await generarPDF( cotizacion.value )
    loading.value.pdf         = false
  }

  //* ////////////////////////////////////////////////////////////////////// Buscar cotizacion 
  async function buscarCotizacion( id_ : number )
  {
    loading.value.carga       = true
    cotizacion.value.productos= []
    //cotizacion.value          = await getCotizacion( id_ )

    if(!!cotizacion.value.id)
    {
      //verificarPermisosLectura()
      buscarTerceroDolibarr( cotizacion.value.terceroId )
    }
    else
    {
      aviso("negative", "Error con la URL. Por favor verifique que este bien.", "account", 3000)
      router.push("/error")
    }

    loading.value.carga       = false
  }

  //* ////////////////////////////////////////////////////////////////////// Buscar tercero 
  async function buscarTerceroDolibarr( id_ : number )
  {
    //cotizacion.value.comercial.terceroIdCtz
    cotizacion.value.tercero  = await buscarTercero( id_ )
    if(!!cotizacion.value.tercero.id)
    {
      //console.log('%c⧭', 'color: #917399', "Tercero", cotizacion.value.tercero)
    }
    else
    {
      aviso("negative", "Error con la URL. Por favor verifique que este bien.", "account", 3000)
      router.push("/error")
    }
  }

  
  //* ////////////////////////////////////////////////////////////////////// Editar cotizacion
  async function editarCotizacion()
  {
    loading.value.editar      = true
    const { ok, data }        = await apiDolibarr("settodraft", "cotizacion", { idwarehouse: 0 }, cotizacion.value.id)

    if(ok){
      aviso("positive", "Cotización desbloqueada")
      cotizacion.value.estado = ESTADO_CTZ.BORRADOR
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
    const { ok, data }        = await apiDolibarr("close", "cotizacion", estado, cotizacion.value.id)

    if(ok){
      aviso("positive", "Cotización aprobada")
      confeti(6)
      cotizacion.value.estado = ESTADO_CTZ.APROBADO
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
    const { ok, data }        = await apiDolibarr("close", "cotizacion", estado, cotizacion.value.id)

    if(ok){
      aviso("positive", "Cotización anulada")
      cotizacion.value.estado = ESTADO_CTZ.RECHAZADO
    }
    else
      aviso("negative", "Error al anular cotización")

    loading.value.anular      = false
  }
  //* ////////////////////////////////////////////////////////////////////// Validar cotizacion
  async function validarCotizacion()
  {
    loading.value.validar     = true
    const { ok, data }        = await apiDolibarr("validate", "cotizacion", { notrigger: 0 }, cotizacion.value.id)
    const newCtz : any        = data
    if(ok){
      aviso("positive", "Cotización validada")
      cotizacion.value.estado = ESTADO_CTZ.COTIZADO
      if(!!newCtz && newCtz.hasOwnProperty("ref") && typeof newCtz.ref === "string")
        cotizacion.value.ref  = newCtz.ref
    }
    else
      aviso("negative", "Error al validar cotización")

    loading.value.validar     = false
  }


  //* ////////////////////////////////////////////////////////////////////// Eliminar cotizacion
  async function eliminarCotizacion()
  {
    loading.value.borrar  = true
    const { ok }          = await apiDolibarr("borrar", "cotizacion", cotizacion.value.id)
    if(ok){
      aviso("positive", "Cotización eliminada")
      router.push("/tercero/" + cotizacion.value.terceroId)
    }
    else
      aviso("negative", "Error al eliminar cotización")
    loading.value.borrar  = false
  }

  
  

  //* ////////////////////////////////////////////////////////////////////// Verificar permisos de lectura
  function verificarPermisosLectura()
  {
    if
    (
      ( cotizacion.value.tercero.esProveedor   && !permisos.value.terceros_ver_proveedor )
      ||
      ( !usuarioEsDueño.value       && !permisos.value.acceso_total && cotizacion.value.tercero.esCliente && !cotizacion.value.tercero.esProveedor )
    )
    {
      router.push("/error")
    }
  }
</script>