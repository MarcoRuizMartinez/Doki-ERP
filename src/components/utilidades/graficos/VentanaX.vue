<template>
  <ventana
    :titulo               ="titulo"
    icono                 ="mdi-chart-areaspline"
    padding-contenido     ="0"
    :modo                 ="modo"
    size-icon-carga       ="16em"
    >
    <apexchart
      :width              ="maximizado ? '1000' : '610'"
      :height             ="maximizado ? '500'  : '270'"
      :series             ="series"
      :options            ="options"
    ></apexchart>
    <template #barra>
      <slot></slot>      
    </template>    
  </ventana>
</template>

<script setup lang="ts">
/*
maximizar
class-restaurado      ="col-4"
class-maximizado      ="col-12"
@maximizar            ="maximizado = !maximizado"
*/
  import {  ref,
            toRefs,
            computed,
            PropType          } from "vue"
  import    ventana             from "components/utilidades/Ventana.vue"
  import    apexchart           from "vue3-apexcharts"
  import {  ModosVentana      } from "src/models/TiposVarios"
  import {  estiloApexChart   } from "src/composables/useEstilos"
  import {  Periodo,
            IApexSerie        } from "src/models/TiposInformes" 

  
  const maximizado        = ref< boolean >(false)
  type  formatos          = "precio" | "normal"
  const props             = defineProps({
    titulo:   { required: true,                 type: String},
    series:   { required: true,                 type: Array   as PropType<IApexSerie[]> },
    //modo:     { default:  "esperando-busqueda", type: String  as PropType<ModosVentana> },
    tiempo:   { required: true,                 type: String  as PropType<Periodo>       },
    formato:  { default:  "normal",             type: String  as PropType<formatos>     },
  })
  const { series,
          tiempo,
          titulo,
          formato       } = toRefs(props) 
  const options           = computed(()=> estiloApexChart( tiempo.value, titulo.value, getMaximo(series.value), formato.value) )
  const modo              = computed(()=> !!series.value.length ? "normal" : "esperando-busqueda")
  const getMaximo = ( serie : IApexSerie[] ) : number => !!serie.length && !!serie[0].maximo ? serie[0].maximo : 0  
</script>