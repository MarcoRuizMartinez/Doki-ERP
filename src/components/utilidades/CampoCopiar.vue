<template>
  <span v-bind    ="$attrs">
    {{ dato }}
  </span>
  <q-btn
    v-if          ="dato.toString().length > 2"
    v-bind        ="style.btnRedondoFlat"
    size          ="sm"
    class         ="q-ml-none"
    :icon         ="copiando ? 'mdi-clipboard-check' : 'mdi-content-copy'"
    :color        ="copiando ? 'positive' : 'grey-10'"
    @click        ="copiar"
    >
    <Tooltip 
      v-if        ="copiando"
      label       ="✅ Copiado"
      :mostrar    ="copiando"
    />
  </q-btn>
</template>
<script lang="ts" setup>
  import {  ref, 
            toRefs            } from "vue"  
  
  import {  style             } from "src/useSimpleOk/useEstilos"
  import {  pausa             } from "src/useSimpleOk/useTools"
  import {  copyToClipboard   } from 'quasar'

  const props               = defineProps({
    dato: { required: true, type: [String, Number]  },
  })
  const { dato }            = toRefs( props )
  const copiando            = ref<boolean>(false)

  async function copiar()
  {
    copiando.value          = true
    await copyToClipboard( dato.value.toString() )
    await pausa( 1000 )
    copiando.value          = false
  }
</script>