<template>
  <q-page padding class         ="row item-stretch content-start justify-start">
    <vista-busqueda :tipo       ="tipo"/>
  </q-page>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  PropType          } from "vue" 
  import {  TTipoAcuerdo      } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  import    vistaBusqueda       from "src/areas/acuerdos/components/Views/VistaAcuerdoBusqueda.vue"   
  //* /////////////////////////////////////////////////////////////// Props
  const props                 = defineProps({
    tipo:       { required: true, type: String as PropType< TTipoAcuerdo > },
  })
</script>