<template>
  <q-rating
    v-model             ="modelValue.progreso_1_4"
    color               ="grey-8"
    :readonly           ="!modelValue.usuarioPermitido"
    :max                ="4"
    :icon               ="[ 'mdi-circle-slice-2', 'mdi-circle-slice-4', 'mdi-circle-slice-6', 'mdi-check-circle']"
    :color-selected     ="[ 'lime-8', 'orange', 'light-blue-14', 'green-10' ]"
    @update:model-value ="emit('set', modelValue.progreso )"
    >
    <template v-slot:tip-1><Tooltip label="Progreso 25%"/></template>
    <template v-slot:tip-2><Tooltip label="Progreso 50%"/></template>
    <template v-slot:tip-3><Tooltip label="Progreso 75%"/></template>
    <template v-slot:tip-4><Tooltip label="Tarea completada"/></template>
  </q-rating>
</template>

<script setup lang="ts">
  import {  IAccion } from "../models/Accion"
  const modelValue            = defineModel<IAccion>( { required: true } )
  const emit                  = defineEmits<{
    set: [ value: number ]
  }>()

</script>
