<template>
  <ventana                       scroll 
    class                       ="col-12"
    class-contenido             ="column fit justify-start items-center"
    height                      ="100%"
    size-icon-carga             ="22em"
    :modo                       ="modo"
    icono                       ="mdi-chart-areaspline"
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
        @limpiar                ="limpiarBusqueda"        
        >
      </barra-busqueda>
    </template>
    <apex-chart
      titulo                    ="Mi grafico"
      :series                   ="cuentas"
      :periodo                  ="periodo"
    />
  </ventana>
</template>
  
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            toRefs,
            watch,
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
  import {  useTools            } from "src/useSimpleOk/useTools"
  import {  style               } from "src/useSimpleOk/useEstilos"
  
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  IQuery              } from "src/models/Busqueda"  
  import {  ModosVentana        } from "src/models/TiposVarios"  
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
  const { esMobil, aviso        } = useTools()
  const router                    = useRouter()
  const { getSeriesTotales      } = useControlInformes()
  
  const modo                      = ref< ModosVentana >("esperando-busqueda")   
  const cuentas                   = ref< IApexSerie [] >([])
  const totales                   = ref< IApexSerie [] >([])
  const periodo                   = ref< Periodo >( PERIODO.MES )

  watch(tipo, iniciar)

  onMounted(iniciar)

  async function iniciar()
  {
    useTitle(`📈Informes ${Acuerdo.getTipoAcuerdoPlural(tipo.value)}`)
    acuerdos.value                = []
    modo.value                    = "esperando-busqueda"
    await busqueda.value.montarBusqueda( usuario.value.id, router, usuario.value.esComercial, permisos.value.acceso_total, 10, tipo.value )
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
    const { cuenta, total }       = await getSeriesTotales( query, "bar" )
    cuentas.value                 = cuenta
    totales.value                 = total
    periodo.value                 = query?.periodo ?? PERIODO.MES

    //console.log("total: ", total);
    console.log("cuenta: ", cuenta);
    loading.value.carga           = false
    modo.value                    = !!total.length ? "normal" : "sin-resultados"
  }

  async function cargarInformes()  
  {
 /*    await generarSeriesTotales(tiempo.value)

    if(!comercial.value && !!comerciales.value.length)
    {
      const usuarioEstaEnInforme  = comerciales.value.some( c => c === usuario.value.nombre )
      comercial.value             = usuarioEstaEnInforme ? usuario.value.nombre : comerciales.value[0]
    } */
  }



  function limpiarBusqueda()
  {
    modo.value                    = "esperando-busqueda"
    acuerdos.value                = []
  } 

  /*

/////////////////////////////////////////// Usuario

Torta de cuenta cotizado
Torta de total cotizado


Vendedor Serie: cotizaciones por estado 
Vendedor Torta: Estados 
Vendedor Ratio Efectividad
/////////////////////////////////////////// General
Linea de Comparativa total entre vendedores
Linea de Comparativa cuenta entre vendedores

Barra de Comparativa % total entre vendedores
Barra de Comparativa % cuenta entre vendedores
https://apexcharts.com/vue-chart-demos/column-charts/stacked-columns-100/

Barra de Comparativa total entre vendedores
Barra de Comparativa cuenta entre vendedores
https://apexcharts.com/vue-chart-demos/column-charts/stacked/


*/
</script>