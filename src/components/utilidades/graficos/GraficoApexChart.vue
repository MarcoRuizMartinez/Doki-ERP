<template>
  <div class              ="boxChart">
    <apexchart
      :width              ="1100"
      :height             ="500"
      :series             ="seriesM"
      :options            ="options"
    ></apexchart>
  </div>
</template>

<script setup lang="ts">
  import {  toRefs,
            computed,
            PropType          } from "vue"
  import    apexchart           from "vue3-apexcharts"  
  import {  Periodo,
            IApexSerie,
            estiloApexChartBar,
            estiloApexChartLine,
                              } from "src/models/TiposInformes" 
  import {  FormatosNumero    } from "src/useSimpleOk/useTools"

  type  Formatos         = FormatosNumero
  type  TipoXCord        = "line" | "bar" | "bar100%" 

  const props             = defineProps({
    titulo:     { required: true,       type: String},
    series:     { required: true,       type: Array   as PropType<IApexSerie[]> },    
    periodo:    { required: true,       type: String  as PropType<Periodo>      },
    formato:    { default:  "normal",   type: String  as PropType<Formatos>     },
    categorias: { required: true,       type: Array   as PropType<string[]>     },    
    tipo:       { required: true,       type: String  as PropType<TipoXCord>     },    
  })
  const { series,
          tipo,
          titulo,
          formato,
          categorias     }  = toRefs(props) 

  const seriesM             = computed(()=>
  {
    const sRaw              =   tipo.value == "bar"
                            ? series.value
                            : series.value.filter( s => s.name != "Total" )
    const seriesFinal       : IApexSerie[] = []

    for(const s of sRaw)
    {
      const newSerie        = Object.assign( {}, s )
      if(( tipo.value == "bar" || tipo.value == "bar100%" ) && s.name !== "Total")
      {
        newSerie.type       = "bar"
        newSerie.stacked    = true
      }
      
      seriesFinal.push( newSerie )
    }

    return seriesFinal
  })
    

/* s */
  const options           = computed(()=> {
      let obj =   tipo.value == "bar"
                ? estiloApexChartBar  ( titulo.value, categorias.value, formato.value, "normal", getMaximo( series.value )) 
                : tipo.value == "bar100%"
                ? estiloApexChartBar  ( titulo.value, categorias.value, formato.value, "100%")
                : tipo.value == "line"
                ? estiloApexChartLine ( titulo.value, categorias.value, formato.value )                
                : {}
      
      return obj
    }
  )  
  function getMaximo( serie : IApexSerie[] ) : number
  {
    const max = !!serie.length && !!serie[0].maximo ? serie[0].maximo : 0     
    return max
  }


</script>
<style>
.boxChart{
  /* width: 500px; */
  /* height: 500px; */
  background-color: rgb(255, 255, 255);
}
</style>