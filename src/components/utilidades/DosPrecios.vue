<script setup lang="ts">
  import {  PropType            } from "vue"
  import {  Format              } from "src/composables/useTools"
  type  TLabelValue           = { label : string, value: number }

  const props                 = defineProps({      
    precio_1: { required: true,  type: Object as PropType< TLabelValue >  },
    precio_2: { required: true,  type: Object as PropType< TLabelValue >  },
  })

</script>

<template>
  <div>
    <div>{{ Format.precio( precio_1.value, "decimales-no" ) }} </div>              
    <div class="text-bold">{{ Format.precio( precio_2.value, "decimales-no" ) }} </div>
  </div>    
  <Tooltip> 
    <table  class       ="tabla-totales">
      <tr>
        <td>{{ precio_1.label }}:</td>
        <td>{{  Format.precio( precio_1.value, "decimales-no" ) }}</td>
      </tr>
      <tr>
        <td>{{ precio_2.label }}:</td>
        <td>{{  Format.precio( precio_2.value, "decimales-no" ) }}</td>
      </tr>
    </table>
  </Tooltip>  
</template>