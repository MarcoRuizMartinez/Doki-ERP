<template>
  <q-page                     padding
    class                     ="row items-stretch content-start justify-left q-col-gutter-md"
    >
    <titulo-ctz
      class                   ="col-12"
      @click                  ="generarPDFCotizacion"
      @recargar               ="iniciar"
    />
    <botonera
      class                   ="col-12"
      @clickPDF               ="generarPDFCotizacion"
      @clickAprobar           ="aprobarCotizacion"
      @clickAnular            ="anularCotizacion"
      @clickValidar           ="validarCotizacion"
      @clickEditar            ="editarCotizacion"
      @clickBorrar            ="eliminarCotizacion"
    />
    <tercero-y-contacto
      class                   ="col-md-4 col-12 full-height"
      height-card             ="220px"
    />
    <condiciones
      class                   ="col-md-4 col-12 full-height"
      height-card             ="220px"
    />
    <totales
      class                   ="col-md-4 col-12 full-height"
      height-card             ="220px"
    />
    <productos
      class                   ="col-12"
    />
    <documentos
      class                   ="col-md-4 col-12 full-height"
      :modulo                 ="acuerdo.modulo"
      :modulo-id              ="acuerdo.id ?? 0"
      :modulo-ref             ="acuerdo.ref"
      :puede-editar           ="true"
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
  //* ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,
            toRefs,
            provide,
            computed,
            onMounted,
            onUnmounted,
                                  } from "vue"
  import {  useRouter             } from 'vue-router'
  import {  useTitle              } from "@vueuse/core"
  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreUser          } from 'src/stores/user'
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
  //* ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  Acuerdo               } from "../../models/Acuerdo"  
  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlCotizacion  } from "src/areas/acuerdos/controllers/ControlCotizaciones"
  import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  import {  useCotizacionPDF      } from "src/areas/acuerdos/cotizaciones/composables/useCotizacionPDF"
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    visorPdf                from "components/utilidades/VisorPDF.vue"
  import    tituloCtz               from "src/areas/acuerdos/components/TituloCotizacion.vue"
  import    totales                 from "src/areas/acuerdos/components/TotalesCotizacion.vue"
  import    botonera                from "src/areas/acuerdos/components/BotoneraCotizacion.vue"
  import    terceroYContacto        from "src/areas/acuerdos/components/TerceroYcontacto.vue"
  import    condiciones             from "src/areas/acuerdos/components/CondicionesCotizacion.vue"
  import    productos               from "src/areas/acuerdos/components/ProductosAcuerdo.vue"
  import    documentos              from "components/archivos/ModuloArchivos.vue"

  const { acuerdo,
          loading           } = storeToRefs( useStoreAcuerdo() )
  const { usuario, permisos } = storeToRefs( useStoreUser() )

  const { generarPDF,
          guardarPDF        } = useCotizacionPDF()

  const router                = useRouter()

  const { buscarCotizacion,
          aprobarCotizacion,
          anularCotizacion,
          editarCotizacion,
          eliminarCotizacion,
          validarCotizacion,
                            } = useControlCotizacion()
  const { copiarProductos,
          deGruposAProductos } = useControlProductos()
  const minimizadoTodo        = ref< boolean  >(false)
  const srcPDF                = ref< string   >("")
  const ventanaPDF            = ref< boolean  >(false)
  const title                 = useTitle()
  provide('superminimizado', minimizadoTodo)

  const props                 = defineProps({
    id: { required: true, type: String }
  })

  const { id }                = toRefs( props )
  const usuarioEsDueño        = computed( () =>{ return acuerdo.value.tercero.responsables.some( r => r.id == usuario.value.id ) })
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
                                  const largo = acuerdo.value.productos.filter( p => p.tipo < 3 ).length
                                  return loading.value.carga || !largo
                                })

  watch(acuerdo, ()=>  title.value =  `📜 ${acuerdo.value.title}`,{ deep: true } )

  onMounted( iniciar )
  onUnmounted( finalizar )

  async function iniciar()
  {
    const gruposBoceto              = Object.assign( acuerdo.value.proGrupos, {} )
    await buscarCotizacion( id.value )
    copiarProductosDeBoceto()

    async function copiarProductosDeBoceto()
    {
      if(!!gruposBoceto.length){
        acuerdo.value.proGrupos     = gruposBoceto
        await deGruposAProductos()
        const ok                    = await copiarProductos( acuerdo.value.productos )
        if(ok)
          await buscarCotizacion( id.value )
      }
    }
  }


  function finalizar()  {
    acuerdo.value             = new Acuerdo()
  }

  async function generarPDFCotizacion()
  {
    loading.value.pdf         = true
    ventanaPDF.value          = true
    srcPDF.value              = await generarPDF( acuerdo.value )
    loading.value.pdf         = false
  }


  //* ////////////////////////////////////////////////////////////////////// Verificar permisos de lectura
  function verificarPermisosLectura()
  {
    if
    (
      ( acuerdo.value.tercero.esProveedor   && !permisos.value.terceros_ver_proveedor )
      ||
      ( !usuarioEsDueño.value       && !permisos.value.acceso_total && acuerdo.value.tercero.esCliente && !acuerdo.value.tercero.esProveedor )
    )
    {
      router.push("/error")
    }
  }
</script>
