<template>
  <q-page                     padding
    class                     ="row item-stretch content-start justify-left q-col-gutter-lg"
    >
    <div class                ="col-12">
      <panel titulo           ="Informes de cotizaciones">
        <q-btn-toggle         dense no-caps spread stretch 
          v-model             ="tiempo"
          toggle-color        ="primary"
          :options            ="tiempos"
        />
      </panel>
    </div>
    <!-- formato                 ="porcentaje" -->
    <ventana-apex-chart
      class                   ="col-6"
      :titulo                 ="'Cotizaciones por estado ' + (!!comercial ? ' de ' + comercial : '')"      
      :series                 ="estadosCtzSerie"
      :tiempo                 ="tiempo"
      >
      <q-select               dense filled  hide-bottom-space borderless
        class                 ="campo-hundido"
        v-model               ="comercial"
        :options              ="comerciales"
      />
    </ventana-apex-chart>
    <!-- formato                 ="porcentaje" -->
    <ventana-apex-chart
      class                   ="col-6"
      titulo                  ="Cotizaciones realizadas"      
      :series                 ="cuentaCtzSerie"
      :tiempo                 ="tiempo"
    />  
    <ventana-apex-chart
      class                   ="col-6"
      titulo                  ="Total cotizado"
      formato                 ="precio"      
      :series                 ="totalesCtzConTotalSerie"
      :tiempo                 ="tiempo"
    />      
    <ventana-apex-chart
      class                   ="col-6"
      titulo                  ="Total cotizado sin totalizar"
      formato                 ="precio"      
      :series                 ="totalesCtzSinTotalSerie"
      :tiempo                 ="tiempo"
    />     
  </q-page>
</template>

<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,  
            onMounted,
                                } from "vue"
  import {  useTitle            } from "@vueuse/core"
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreUser        } from 'src/stores/user'  
  // * ///////////////////////////////////////////////////////////////////////// Componibles
  import {  useTools            } from "src/useSimpleOk/useTools"
  import {  useInformesCtz      } from "src/areas/acuerdos/composables/useInformesCtz"
  // * ///////////////////////////////////////////////////////////////////////// Modelos
  import {  Tiempo,             } from "src/models/TiposInformes"
  import {  ILabelValue         } from "src/models/TiposVarios"
  // * ///////////////////////////////////////////////////////////////////////// Componentes
  import    panel                 from "components/utilidades/Panel.vue"
  import    ventanaApexChart      from "components/utilidades/VentanaX.vue"

  const tiempos :ILabelValue[]    = [
    { label: "Diario",    value:"day"   },
    { label: "Semanal",   value:"week"  },
    { label: "Mensual",   value:"month" },
    //{ label: "Año",     value:"year" },
  ]

  const {
          generarSeriesTotales,
          generarSeriesEstados,
          comerciales,
          cuentaCtzSerie,
          totalesCtzConTotalSerie,
          totalesCtzSinTotalSerie,
          estadosCtzSerie,
        }                         = useInformesCtz()

  const title                     = useTitle("📈 Cotizaciones informes")
  const { esMobil, aviso        } = useTools()
  const tiempo                    = ref< Tiempo >("week")
  const comercial                 = ref< string >("") 
  const { usuario, permisos     } = storeToRefs( useStoreUser() )

  onMounted(cargarInformes)

  watch(comercial, (newComercial)=>{
    if(!!newComercial)      
      cargarInformesEstados()
  })

  watch(tiempo, async (newTiempo)=>{
    if(!newTiempo) return
    
    await cargarInformes()
    await cargarInformesEstados()
  })
  

  async function cargarInformes()  
  {
    await generarSeriesTotales(tiempo.value)

    if(!comercial.value && !!comerciales.value.length)
    {
      const usuarioEstaEnInforme  = comerciales.value.some( c => c === usuario.value.nombre )
      comercial.value             = usuarioEstaEnInforme ? usuario.value.nombre : comerciales.value[0]
    }
  }

  async function cargarInformesEstados()
  {
    await generarSeriesEstados(tiempo.value, comercial.value)
  }
</script>