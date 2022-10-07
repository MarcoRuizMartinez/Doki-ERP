<template>
  <q-page                     padding
    class                     ="row items-stretch content-start justify-start q-col-gutter-md"
    >
    <titulo-ctz
      class                   ="col-12"
      @click                  ="generarPDFCotizacion"
    />
    <barra  class             ="row col-12 justify-end gap-sm">
      <q-btn
        v-bind                ="btnBaseMd"
        label                 ="Crear cotizacion"
        color                 ="positive"
        icon                  ="mdi-plus"
        :loading              ="loading.crear"
        :disable              ="!formularioOk"
        @click                ="crearCotizacionEnControl"
        />
    </barra>
    <tercero-y-contacto
      ref                     ="componenteTerYcont"
      class                   ="col-md-4 col-12 full-height"
      height-card             ="220px"
    />
    <condiciones
      ref                     ="componenteCondiciones"
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
    <!-- //* /////////////////  Visor PDF  -->
    <visor-pdf
      v-model:src             ="srcPDF"
      v-model:visible         ="ventanaPDF"
    />
  </q-page>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            toRefs,
            computed,
            onMounted,
            onUnmounted
                                  } from "vue"
  import {  useTitle        } from "@vueuse/core"
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreUser          } from 'src/stores/user'
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  Acuerdo               } from "src/areas/acuerdos/models/Acuerdo"
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  btnBaseMd             } from "src/useSimpleOk/useEstilos"
  import {  useControlAcuerdo  } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  import {  useCotizacionPDF      } from "src/areas/acuerdos/composables/useCotizacionPDF"
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    barra                   from "components/utilidades/Barra.vue"
  import    visorPdf                from "components/utilidades/VisorPDF.vue"
  import    tituloCtz               from "src/areas/acuerdos/components/Titulo.vue"
  import    productos               from "src/areas/acuerdos/components/ProductosAcuerdo.vue"
  import    terceroYContacto        from "src/areas/acuerdos/components/TerceroYcontacto.vue"
  import    totales                 from "src/areas/acuerdos/components/Totales.vue"
  import    condiciones             from "src/areas/acuerdos/components/Condiciones.vue"

  const { acuerdo,
          loading           } = storeToRefs( useStoreAcuerdo() )
  const { generarPDF        } = useCotizacionPDF()
  const { crearAcuerdo      } = useControlAcuerdo()
  const { crearNuevoGrupo   } = useControlProductos()
  const { usuario           } = storeToRefs( useStoreUser() )
  const ventanaPDF            = ref< boolean  >(false)
  const srcPDF                = ref< string   >("")

  onMounted(()=>{
    const terceroTem        = Object.assign( acuerdo.value.tercero, {} )
    acuerdo.value           = new Acuerdo()
    if(!!terceroId.value)
      acuerdo.value.tercero = terceroTem
    if(!acuerdo.value.proGrupos.length)
      crearNuevoGrupo()
  })

  onUnmounted(()=>{
    if(cotizacionCreada) return
    acuerdo.value             = new Acuerdo()
  })
  //* /////////////////////////////////////////////////////////////// Props
  const props                 = defineProps({
    terceroId: { default: 0, type: [String, Number] }
  })
  const { terceroId }         = toRefs(props)
  const title                 = useTitle("📜 Crear cotización")
  let cotizacionCreada        = false

  //* /////////////////////////////////////////////////////////////// Provide Super minimizado
  //const minimizadoTodo        = ref< boolean >(false)
  //provide('superminimizado', minimizadoTodo)

  //* /////////////////////////////////////////////////////////////// Ref componentes
  const componenteTerYcont    = ref<InstanceType<typeof terceroYContacto> | null>(null)
  const componenteCondiciones = ref<InstanceType<typeof condiciones>      | null>(null)

  //* /////////////////////////////////////////////////////////////// Computed
  const usuarioEsDueño        = computed( () =>{ return acuerdo.value.tercero.responsables.some( r => r.id == usuario.value.id ) })

  //* /////////////////////////////////////////////////////////////// Computed Formulario Ok
  const formularioOk          = computed(()=>
  {
    const terceroOk           = !!acuerdo.value.tercero.id
    const contactoOk          = !!acuerdo.value.contacto.id
    const esPersona           = !acuerdo.value.tercero.esEmpresa
    const esEspecial          = acuerdo.value.esTerceroCtz
    const comercialOk         = acuerdo.value.comercial.id > 0
    const origenOk            = !!acuerdo.value.origenContacto.id
    const pagoOk              = !!acuerdo.value.condicionPago.id
    const vencimientoOk       = !!acuerdo.value.fechaFinValidezCorta

    return terceroOk && ( contactoOk || ( esPersona && !esEspecial ) ) && comercialOk && origenOk && vencimientoOk && pagoOk
  })

  async function generarPDFCotizacion(){
    ventanaPDF.value          = true
    srcPDF.value              = await generarPDF( acuerdo.value )
  }

  async function crearCotizacionEnControl()
  {
    cotizacionCreada          = await crearAcuerdo( usuario.value.id )
  }
</script>
