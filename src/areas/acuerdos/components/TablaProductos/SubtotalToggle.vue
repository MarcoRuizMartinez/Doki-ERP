<template>
  <q-space/>
  <!-- //* ///////////////////////////////////////////////////// Con total  -->
  <q-toggle             dense
    v-model             ="grupo.conTotal"
    label               ="Subtotal"
    class               ="q-mr-lg text-bold text-1_3em text-grey-8"
    @update:model-value ="actualizar"
  /> 
  <span
    class               ="fuente-mono text-1_2em"
    :class              ="{ 'text-grey-6' : !grupo.conTotal }"
    >
    {{ formatoPrecio( grupo.totalConDescu )}}
  </span>
</template>
<script lang="ts" setup>
  import {  toRefs, PropType    } from "vue"
  import {  IGrupoLineas        } from "src/areas/acuerdos/models/GrupoLineasAcuerdo"
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  import {  formatoPrecio       } from "src/useSimpleOk/useTools"

  const { editarSubTotales} = useControlProductos()  
  const props               = defineProps({
    grupo: { required: true, type: Object as PropType< IGrupoLineas > },
  })
  const { grupo }           = toRefs(props)
  function actualizar( toggle : boolean )
  {
    console.log({toggle}, grupo.value);
    editarSubTotales( toggle, grupo.value ) 
  }
</script>