<template>
  <ventana                        
    class                       ="col-12"
    class-contenido             ="column justify-start items-center"
    height                      ="100%"
    size-icon-carga             ="22em"
    icono                       ="mdi-chart-areaspline"
    :modo                       ="modo"
    :titulo                     ="'Informe de ' + Acuerdo.getTipoAcuerdoPlural( tipo )"
    :padding-contenido          ="modo === 'normal' ? '0' : '12px' "
    :mensaje-sin-resultados     ="`No se encontraron datos para ${Acuerdo.getTipoAcuerdoPlural( tipo)}`"
    >
    <template                   #barra>
      <tabs-busqueda/>
    </template>
    <template                   #menu>
      <barra-busqueda
        @buscar                 ="buscar"
        >
      </barra-busqueda>
    </template>
    <div class                  ="width400 q-ma-md">
      <q-btn-toggle             spread push unelevated round no-caps
        v-model                 ="modelBtn"
        color                   ="white"
        text-color              ="grey-8"
        toggle-color            ="primary"
        :options="[
          {label: 'Numero de '      + Acuerdo.getTipoAcuerdoPlural(tipo), value: 'cantidad'},
          {label: 'Subtotales de '  + Acuerdo.getTipoAcuerdoPlural(tipo), value: 'subtotal'}
        ]"
      />
    </div>
    <div v-show                 ="modelBtn == 'cantidad'">
      <apex-chart
        tipo                    ="line"
        :titulo                 ="`Cuenta ${sufijoNombreGrafico}`"
        :series                 ="cuentas"
        :periodo                ="periodo"
        :categorias             ="categorias"
      />
      <apex-chart
        tipo                    ="bar"
        :titulo                 ="`Cuenta ${sufijoNombreGrafico}`"
        :series                 ="cuentas"
        :periodo                ="periodo"
        :categorias             ="categorias"
      />
      <apex-chart
        tipo                    ="bar100%"
        formato                 ="porcentaje"
        :titulo                 ="`Cuenta ${sufijoNombreGrafico}`"
        :series                 ="cuentas"
        :periodo                ="periodo"
        :categorias             ="categorias"
      />
    </div>
    <div v-show                 ="modelBtn == 'subtotal'">
      <apex-chart
        tipo                    ="line"
        formato                 ="precio"
        :titulo                 ="`Valor ${sufijoNombreGrafico}`"
        :series                 ="totales"
        :periodo                ="periodo"
        :categorias             ="categorias"
      />
      <apex-chart
        tipo                    ="bar"
        formato                 ="precio"
        :titulo                 ="`Valor ${sufijoNombreGrafico}`"
        :series                 ="totales"
        :periodo                ="periodo"
        :categorias             ="categorias"
      />
      <apex-chart
        tipo                    ="bar100%"
        formato                 ="porcentaje"
        :titulo                 ="`Valor ${sufijoNombreGrafico}`"
        :series                 ="totales"
        :periodo                ="periodo"
        :categorias             ="categorias"
      />
    </div>
  </ventana>
</template>
  
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            toRefs,
            watch,
            computed,
            PropType,
            onMounted,
            onUnmounted         } from "vue"
  import {  useRouter           } from "vue-router"

  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreUser        } from 'src/stores/user'
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'

  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useTitle            } from "@vueuse/core"
  import {  useControlInformes  } from "src/areas/acuerdos/controllers/ControlInformes"  
  import {  ToolDate            } from "src/composables/useTools"       
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  IQuery, Busqueda    } from "src/models/Busqueda"  
  import {  TModosVentana       } from "src/models/TiposVarios"  
  import {  Acuerdo             } from "src/areas/acuerdos/models/Acuerdo"
  import {  TTipoAcuerdo        } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  import {  Periodo,
            PERIODO,
            IApexSerie          } from "src/models/TiposInformes"
  
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"  
  import    apexChart             from "components/utilidades/graficos/GraficoApexChart.vue"  
  import    tabsBusqueda          from "./Busqueda/TabsBusquedaInformes.vue"
  import    barraBusqueda         from "./Busqueda/BarraBusquedaInformes.vue"  
  
  const props                     = defineProps({
    tipo:   { required: true, type: String as PropType< TTipoAcuerdo >  },
  })
  const { tipo }                  = toRefs(props)
  const { usuario, permisos     } = storeToRefs( useStoreUser() )  
  const { acuerdos,
          busqueda,
          loading               } = storeToRefs( useStoreAcuerdo() )    
  const router                    = useRouter()
  const { getSeries             } = useControlInformes()
  
  const modo                      = ref< TModosVentana >("esperando-busqueda")   
  const cuentas                   = ref< IApexSerie [] >([])
  const totales                   = ref< IApexSerie [] >([])
  const categorias                = ref< string     [] >([])
  const modelBtn                  = ref< string        >("cantidad")
  const periodo                   = ref< Periodo >( PERIODO.SEMANA )

  watch(tipo, iniciar)
  onMounted(iniciar)

  const sufijoNombreGrafico       = computed(()=> `de ${Acuerdo.getTipoAcuerdoPlural(tipo.value)} por ${busqueda.value.f.dimension.label.toLocaleLowerCase()} - ${busqueda.value.f.periodo.label}`)

  async function iniciar()
  {
    useTitle(`📈Informes ${Acuerdo.getTipoAcuerdoPlural(tipo.value)}`)
    acuerdos.value                = []
    modo.value                    = "esperando-busqueda"
    await busqueda.value.montarBusqueda( usuario.value.id, router, usuario.value.esComercial, permisos.value.acceso_total, 10, tipo.value )

    if(!busqueda.value.f.desde)
      busqueda.value.f.desde      = ToolDate.getDateToStr( `${new Date().getFullYear()}-01-01`, "UTC" )
    if(!busqueda.value.f.periodo.label)
      busqueda.value.f.periodo    = Busqueda.listaPeriodos[1]
    if(!busqueda.value.f.dimension.label)
      busqueda.value.f.dimension  = Busqueda.listaDimensiones[0]
  }

  onUnmounted(()=>{
    acuerdos.value                = []
    busqueda.value.desmontarBusqueda()
  })

  async function buscar( query : IQuery )
  {
    acuerdos.value                = []
    modo.value                    = "buscando"
    loading.value.carga           = true
    const { cuenta,
            total,
            ejeX                } = await getSeries( query )
    cuentas.value                 = cuenta
    totales.value                 = total
    categorias.value              = ejeX
    loading.value.carga           = false
    modo.value                    = !!total.length ? "normal" : "sin-resultados"
  }

  function limpiarBusqueda()
  {
    modo.value                    = "esperando-busqueda"
  }
</script>