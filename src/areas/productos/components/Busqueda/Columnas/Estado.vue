<template>
  <span
    class               ="q-px-xs text-white"
    style               ="border-radius: 6px;"
    :style              ="'background-color: ' + acuerdo.estadoColor"
    >
    {{ acuerdo.estadoLabel }}
  </span>
</template>
<script lang="ts" setup>
  import {  PropType        } from "vue"    
  import {  IAcuerdo        } from "src/areas/acuerdos/models/Acuerdo"

  const props               = defineProps({
    acuerdo:  { required: true, type: Object as PropType< IAcuerdo > },
  })
</script>