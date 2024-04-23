<template>
  <titulo
    class                   ="col-12"
    @click                  ="generarPDFAcuerdo"
  />
  <barra  class             ="row col-12 justify-end gap-sm">
    <q-btn
      v-bind                ="style.btnBaseMd"
      color                 ="positive"
      icon                  ="mdi-plus"
      :label                ="`Crear ${acuerdo.tipo}`"
      :loading              ="loading.crear"
      :disable              ="!formularioOk"
      @click                ="crearAcuerdoEnControl"
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
  <lineas
    class                   ="col-12"
  />
  <notas
    class                   ="col-md-4 col-12"
    height-card             ="220px"  
  />    
  <!-- //* /////////////////  Visor PDF  -->
  <visor-pdf
    v-if                    ="acuerdo.esCotizacion"
    v-model:src             ="srcPDF"
    v-model:visible         ="ventanaPDF"
  />
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,
            toRefs,
            computed,
            PropType,
            onMounted,
            onUnmounted
                                  } from "vue"
  import {  useTitle              } from "@vueuse/core"      
  import {  useRouter             } from "vue-router"
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreUser          } from 'stores/user'
  import {  useStoreAcuerdo       } from 'stores/acuerdo'
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  Acuerdo               } from "src/areas/acuerdos/models/Acuerdo"
  import {  TTipoAcuerdo          } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  style                 } from "src/composables/useEstilos"
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  import {  useCotizacionPDF      } from "src/areas/acuerdos/composables/pdf/useCotizacion"
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    barra                   from "components/utilidades/Barra.vue"
  import    visorPdf                from "components/utilidades/VisorPDF.vue"
  import    notas                   from "src/areas/acuerdos/components/Modulos/ModuloNotas.vue"
  import    titulo                  from "src/areas/acuerdos/components/Modulos/ModuloTitulo.vue"
  import    lineas                  from "src/areas/acuerdos/components/Modulos/ModuloLineas.vue"
  import    terceroYContacto        from "src/areas/acuerdos/components/Modulos/ModuloTercero.vue"
  import    totales                 from "src/areas/acuerdos/components/Modulos/ModuloTotales.vue"
  import    condiciones             from "src/areas/acuerdos/components/Modulos/ModuloCondiciones.vue"

  const { acuerdo,
          loading           } = storeToRefs( useStoreAcuerdo() )
  const { getQuotePDF       } = useCotizacionPDF()
  const { crearAcuerdo      } = useControlAcuerdo()
  const { crearNuevoGrupo   } = useControlProductos()
  const { usuario           } = storeToRefs( useStoreUser() )
  const router                = useRouter()
  const ventanaPDF            = ref< boolean  >(false)
  const srcPDF                = ref< string   >("")
  let acuerdoCreado           = false
  let queryURL                = router.currentRoute.value.query

  //* /////////////////////////////////////////////////////////////// Props
  const props                 = defineProps({
    terceroId:  { default: 0,     type: [String, Number]                    },
    tipo:       { required: true, type: String as PropType< TTipoAcuerdo >  },
  })
  const { terceroId, tipo }   = toRefs(props)

  onMounted(  iniciar)  
  watch(tipo, iniciar, { immediate: true })
  
  function iniciar()
  { 
    asignarDatosAcuerdoTercero()
    crearGrupoSiNoHay()    
    useTitle(`${acuerdo.value.emoji} Crear ${acuerdo.value.tipo}`) // Titulo HTML

    function asignarDatosAcuerdoTercero() {
      const terceroTem          = Object.assign( acuerdo.value.tercero, {} )
      acuerdo.value             = new Acuerdo( tipo.value )
      if((!!terceroId.value || !!terceroTem.id) && queryURL.origen === "tercero")
          acuerdo.value.tercero = terceroTem
    }

    function crearGrupoSiNoHay() {
      if(!acuerdo.value.proGrupos.length)
      crearNuevoGrupo()
    }
  }

  onUnmounted(()=>{
    if(acuerdoCreado) return
    acuerdo.value             = new Acuerdo()
  })

  //* /////////////////////////////////////////////////////////////// Provide Super minimizado
  //const minimizadoTodo        = ref< boolean >(false)
  //provide('superminimizado', minimizadoTodo)

  //* /////////////////////////////////////////////////////////////// Ref componentes
  const componenteTerYcont    = ref<InstanceType<typeof terceroYContacto> | null>(null)
  const componenteCondiciones = ref<InstanceType<typeof condiciones>      | null>(null)

  //* /////////////////////////////////////////////////////////////// Computed
  //const usuarioEsDueño        = computed( () =>{ return acuerdo.value.tercero.responsables.some( r => r.id == usuario.value.id ) })

  //* /////////////////////////////////////////////////////////////// Computed Formulario Ok
  const formularioOk          = computed(()=>
  {
    const terceroOk           = !!acuerdo.value.tercero.id
    const contactoOk          = !!acuerdo.value.contactoComercial.id
    const esPersona           = !acuerdo.value.tercero.esEmpresa
    const esEspecial          = acuerdo.value.esTerceroCtz
    const comercialOk         = !! acuerdo.value.comercial && acuerdo.value.comercial.id > 0
    const origenOk            = !!acuerdo.value.origenContacto.id
    const pagoOk              = !!acuerdo.value.condicionPago.id
    const vencimientoOk       = !!acuerdo.value.fechaFinValidezCorta || !acuerdo.value.esCotizacion

    const ok                  = terceroOk
                                && 
                                ( contactoOk
                                  ||
                                  ( esPersona && !esEspecial )
                                )
                                && comercialOk
                                && origenOk
                                && vencimientoOk
                                && pagoOk;

    return ok
  })

  async function generarPDFAcuerdo(){
    if(acuerdo.value.esCotizacion){
      ventanaPDF.value          = true
      srcPDF.value              = await getQuotePDF( acuerdo.value )
    }
  }

  async function crearAcuerdoEnControl(){
    acuerdoCreado               = await crearAcuerdo( usuario.value.id )
  }
</script>
