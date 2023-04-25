<template>
  <div class              ="boxChart">
    <apexchart
      :width              ="1100"
      :height             ="500"
      :series             ="series"
      :options            ="options"
    ></apexchart>
  </div>
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
  import    apexchart           from "vue3-apexcharts"  
  import {  Periodo,
            IApexSerie,
            estiloApexChart   } from "src/models/TiposInformes" 

  type  formatos          = "precio" | "normal"
  const props             = defineProps({
    titulo:   { required: true,       type: String},
    series:   { required: true,       type: Array   as PropType<IApexSerie[]> },    
    periodo:  { required: true,       type: String  as PropType<Periodo>      },
    formato:  { default:  "normal",   type: String  as PropType<formatos>     },
  })
  const { series,
          periodo,
          titulo,
          formato       } = toRefs(props) 
  const options           = computed(()=> estiloApexChart( periodo.value, titulo.value, getMaximo(series.value), formato.value) )  
  function getMaximo( serie : IApexSerie[] ) : number
  {
    const max = !!serie.length && !!serie[0].maximo ? serie[0].maximo : 0 
    console.log("max: ", max)
    return max
  }
</script>
<style>
.boxChart{
  /* width: 500px; */
  /* height: 500px; */
  background-color: white;
}
</style>