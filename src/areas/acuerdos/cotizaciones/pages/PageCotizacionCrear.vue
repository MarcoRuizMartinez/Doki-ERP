<template>
  <q-page                     padding
    class                     ="row items-stretch content-start justify-left q-col-gutter-md"
    >
    <titulo-ctz               nuevo
      class                   ="col-12"
      :cotizacion             ="cotizacion"
      @click                  ="generarPDFCotizacion"
    />
    <barra  class             ="row col-12 justify-end gap-sm">
      <q-btn
        v-bind                ="btnBaseMd"
        label                 ="Crear cotizacion"
        color                 ="positive"
        icon=                 "mdi-plus"
        :disable              ="!formularioOk"
        :loading              ="cargando"
        @click                ="crearCotizacion"
      />
    </barra>
    <tercero-y-contacto       nuevo
      ref                     ="componenteTerYcont"
      v-model:cotizacion      ="cotizacion"
      class                   ="col-md-4 col-12 full-height"
      height-card             ="220px"
    />
    <condiciones              nuevo
      ref                     ="componenteCondiciones"
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
    <visor-pdf                
      v-model:src             ="srcPDF"
      v-model:visible         ="ventanaPDF"
    />
  </q-page>
</template>

<script setup lang="ts">
  import {  ref,
            watch,
            toRefs,
            provide,
            computed
                            } from "vue"
  import {  useRouter       } from 'vue-router'                  
  import {  servicesTerceros     } from "src/areas/terceros/services/servicesTerceros"  
  import {  useApiDolibarr  } from "src/services/useApiDolibarr"
  import {  useUsuario      } from "src/useSimpleOk/useUsuario"
  import {  useTitle        } from "@vueuse/core"
  import {  useTools        } from "src/useSimpleOk/useTools"
  import {  TIPOS_CONTACTO  } from "src/areas/terceros/models/Contacto"  
  import {  ICotizacion,
            Cotizacion      } from "src/areas/acuerdos/cotizaciones/models/Cotizacion"
  import    tituloCtz         from "src/areas/acuerdos/cotizaciones/components/TituloCotizacion.vue"
  import    productos         from "src/areas/acuerdos/.components/ProductosAcuerdo.vue"  
  import    barra             from "components/utilidades/Barra.vue"
  import    terceroYContacto  from "src/areas/acuerdos/cotizaciones/components/TerceroYcontacto.vue"
  import    condiciones       from "src/areas/acuerdos/cotizaciones/components/CondicionesCotizacion.vue" 
  import    totales           from "src/areas/acuerdos/cotizaciones/components/TotalesCotizacion.vue"
  import {  btnBaseMd       } from "src/useSimpleOk/useEstilos"
  import {  useCotizacionPDF} from "src/areas/acuerdos/cotizaciones/composables/useCotizacionPDF"
  import    visorPdf          from "components/utilidades/VisorPDF.vue"
  const  {  apiDolibarr     } = useApiDolibarr()

  const { usuario, permisos } = useUsuario()
  const { buscarTercero     } = servicesTerceros()
  const { aviso             } = useTools()  
  const router                = useRouter()
  const { generarPDF        } = useCotizacionPDF()

  const cotizacion            = ref< ICotizacion  >( new Cotizacion() )
  const cargando              = ref< boolean >(false)
  const ventanaPDF            = ref< boolean  >(false)
  const srcPDF                = ref< string   >("")
  //* /////////////////////////////////////////////////////////////// Props
  const props                 = defineProps({
    terceroId: { default: 0, type: [String, Number] }
  })
  const { terceroId }         = toRefs(props)
  const title                 = useTitle("📜 Crear cotización")

  //* /////////////////////////////////////////////////////////////// Provide Super minimizado
  const minimizadoTodo        = ref< boolean >(false)
  provide('superminimizado', minimizadoTodo)

  //* /////////////////////////////////////////////////////////////// Ref componentes
  const componenteTerYcont    = ref<InstanceType<typeof terceroYContacto> | null>(null)
  const componenteCondiciones = ref<InstanceType<typeof condiciones>      | null>(null)
  
  //* /////////////////////////////////////////////////////////////// Computed
  const usuarioEsDueño        = computed( () =>{ return cotizacion.value.tercero.responsables.some( r => r.id == usuario.value.id ) })
  const puedeModificar        = computed( () => permisos.value.cotizar_crear && ( usuarioEsDueño.value || permisos.value.acceso_total ) )
  
  //* /////////////////////////////////////////////////////////////// Computed Formulario Ok
  const formularioOk          = computed(()=>
  {
    const terceroOk           = !!cotizacion.value.tercero.id
    const contactoOk          = !!cotizacion.value.contacto.id
    const esPersona           = !cotizacion.value.tercero.esEmpresa
    const esEspecial          = cotizacion.value.esTerceroCtz
    const comercialOk         = cotizacion.value.comercial.id > 0
    const origenOk            = !!cotizacion.value.origenContacto.id
    const pagoOk              = !!cotizacion.value.condicionPago.id
    const vencimientoOk       = !!cotizacion.value.fechaFinValidezCorta

    return terceroOk && ( contactoOk || ( esPersona && !esEspecial ) ) && comercialOk && origenOk && vencimientoOk && pagoOk
  })

  async function generarPDFCotizacion()
  {
    ventanaPDF.value          = true
    srcPDF.value              = await generarPDF( cotizacion.value )
  }

  //* /////////////////////////////////////////////////////////////// Crear Cotizacion
  async function crearCotizacion()
  {
    cargando.value            = true
    const ctzForApi           = cotizacion.value.getCotizacionForApi( usuario.value.id )
    //* ////////////////////  Creando
    const { ok, data }        = await apiDolibarr("crear", "cotizacion", ctzForApi )
    if(!ok || !data) {
      aviso("negative", "Error al crear al tercero", "file")      
      cargando.value          = false
      return
    }
    const id                  = typeof data === "number" ? data : 0
    //* ////////////////////  Creando Contacto si corresponde
    if(!!cotizacion.value.contacto.id)
    {
      const { ok : vinculado  } = await apiDolibarr("contacto-vincular", "cotizacion",
                                          {
                                            id:   cotizacion.value.contacto.id,
                                            tipo: TIPOS_CONTACTO.CTZ_CUSTOMER
                                          },
                                          id
                                          )
        if(!vinculado){
          aviso("negative", "Error al asignar contacto", "file")
        }                                        
    }
    //* ////////////////////  Notificando y redireccionando
    aviso("positive", "Cotización creada", "file")
    cargando.value            = false
    router.push( "/cotizaciones/" + id )
  }

  //* /////////////////////////////////////////////////////////////// Buscar Tercero 
  watch( terceroId, async (newId)=>{
    if(!newId) return
    cotizacion.value.terceroId= +newId 
    cotizacion.value.tercero  = await buscarTercero( +newId )
  }
  ,{ immediate: true })
</script>