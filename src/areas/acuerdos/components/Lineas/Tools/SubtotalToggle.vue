<template>
  <q-space/>
  <!-- //* ///////////////////////////////////////////////////// Con total  -->
  <q-toggle             dense
    v-model             ="grupo.conTotal"
    label               ="Subtotal"
    class               ="q-mr-lg text-bold text-1_3em text-grey-8"
    :icon               ="loading.subtotal ? 'mdi-loading mdi-spin' : ''"
    :disable            ="disable || loading.subtotal"
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
  // * ///////////////////////////////////////////////////////////////////////////// Core
  import {  toRefs, PropType    } from "vue"
  // * ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'  
  // * ///////////////////////////////////////////////////////////////////////////// Modelos
  import {  IGrupoLineas        } from "src/areas/acuerdos/models/GrupoLineasAcuerdo"
  // * ///////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  import {  formatoPrecio       } from "src/useSimpleOk/useTools"

  const { loading               } = storeToRefs( useStoreAcuerdo() )  
  const { editarSubTotales      } = useControlProductos()  
  const props                     = defineProps({
    grupo:    { required: true, type: Object as PropType< IGrupoLineas > },
    disable:  { required: true, type: Boolean }
  })
  const { grupo }                 = toRefs(props)
  function actualizar( toggle : boolean )
  {
    //console.log({toggle}, grupo.value);
    editarSubTotales( toggle, grupo.value ) 
  }

  //subtotal
</script>