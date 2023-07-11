<template>
  <span
    v-if          ="!hideLabel"
    v-bind        ="$attrs"
    >
    {{ dato }}
  </span>
  <q-btn          dense flat round
    v-if          ="dato.toString().length > 2"    
    class         ="op60 op100-hover q-ml-sm"
    :size         ="size"
    :icon         ="copiando ? 'mdi-clipboard-check' : 'mdi-content-copy'"
    :color        ="copiando ? 'positive' : 'grey-10'"
    :disable      ="disable"
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
  import {  pausa             } from "src/composables/useTools"
  import {  copyToClipboard   } from 'quasar'

  const props               = defineProps({
    dato:       { required: true,   type: [String, Number]  },
    size:       { default:  "xs",   type: String  },
    hideLabel:  { default:  false,  type: Boolean },
    disable:    { default:  false,  type: Boolean },
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