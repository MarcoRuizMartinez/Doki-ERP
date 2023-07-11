<template>
  <div>
    <div>{{ formatoPrecio( precio_1.value, "decimales-no" ) }} </div>              
    <div class="text-bold">{{ formatoPrecio( precio_2.value, "decimales-no" ) }} </div>
  </div>    
  <Tooltip> 
    <table  class       ="tabla-totales">
      <tr>
        <td>{{ precio_1.label }}:</td>
        <td>{{  formatoPrecio( precio_1.value, "decimales-no" ) }}</td>
      </tr>
      <tr>
        <td>{{ precio_2.label }}:</td>
        <td>{{  formatoPrecio( precio_2.value, "decimales-no" ) }}</td>
      </tr>
    </table>
  </Tooltip>  
</template>
<script setup lang="ts">
  import {  PropType            } from "vue"
  import {  formatoPrecio       } from "src/composables/useTools"
  type  TLabelValue           = { label : string, value: number }

  const props                 = defineProps({      
    precio_1: { required: true,  type: Object as PropType< TLabelValue >  },
    precio_2: { required: true,  type: Object as PropType< TLabelValue >  },
  })

</script>