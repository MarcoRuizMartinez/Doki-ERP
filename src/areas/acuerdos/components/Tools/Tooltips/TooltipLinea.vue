<template>
  <q-tooltip
    class                 ="bg-black"
    >
    <q-img
      :src                ="modelValue.imagen100px"
      class               ="imagen-woo-md cursor-pointer q-mr-sm"
      spinner-color       ="white"
    />
<!--     
    <div>
      <div class="text-1_4em">
        <span class="text-bold">{{ modelValue.ref }}</span> - <span>{{ modelValue.nombre }} </span>        
      </div>
      <div class="text-1_4em">
        {{ modelValue.descripcion }}
      </div>
    </div>
-->

  </q-tooltip>
</template>
<script setup lang="ts">
  import {  PropType, ref      } from "vue"
  import {  ILineaAcuerdo } from "src/areas/acuerdos/models/LineaAcuerdo"

  const props = defineProps({
    modelValue:  { required: true, type: Object as PropType<ILineaAcuerdo> }
  })

</script>