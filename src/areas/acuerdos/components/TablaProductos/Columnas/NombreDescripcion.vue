<template>
  <div
    class               ="float-left cursor-pointer"
    style               ="display: contents;"
    @click              ="emit('click')"
    >
    <span class         ="text-bold">{{linea.ref}}</span> - 
    <span class         ="text-subtitle1">{{linea.nombre}} </span>
    <br/>
    <span 
      v-if              ="!!linea.descripcion"
      v-html            ="linea.descripcion"
      class             ="text-0_8em"
      >
    </span>
  </div>
</template>
<script lang="ts" setup>
  import {  PropType      } from "vue"    
  import {  ILineaAcuerdo } from "src/areas/acuerdos/models/LineaAcuerdo"
  const props               = defineProps({
    linea: { required: true, type: Object as PropType< ILineaAcuerdo > },
  })

  const emit = defineEmits<{
    (e: 'click',  value: void ): void
  }>()
</script>