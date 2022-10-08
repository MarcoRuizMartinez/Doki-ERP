<template>
  <q-page                     padding
    class                     ="row items-stretch content-start justify-start q-col-gutter-md"
    >
    <vista-acuerdo
      v-bind="props"
    />
  </q-page>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  PropType              } from "vue"
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    vistaAcuerdo            from "src/areas/acuerdos/components/Views/VistaAcuerdoVer.vue"
  import {  TTipoAcuerdo          } from "src/areas/acuerdos/models/ConstantesAcuerdos"

  const props                 = defineProps({
    id:   { required: true, type: String },
    tipo: { required: true, type: String as PropType< TTipoAcuerdo > },
  })
</script>