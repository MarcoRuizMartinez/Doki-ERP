<template>
  <q-page padding class         ="row item-stretch content-start justify-start">
    <vista-informe :tipo       ="tipo"/>
  </q-page>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  PropType          } from "vue"
  import {  TTipoAcuerdo      } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  import    vistaInforme        from "./views/VistaAcuerdoInformes.vue"
  //* /////////////////////////////////////////////////////////////// Props
  const props                 = defineProps({
    tipo:       { required: true, type: String as PropType< TTipoAcuerdo > },
  })
</script>
