<template>
  <span
    v-if          ="!hideLabel"
    v-bind        ="$attrs"
    >
    <slot>{{label}}</slot>
  </span>
  <q-btn          dense flat round
    v-if          ="label.toString().length > 2"    
    class         ="op60 op100-hover q-ml-sm"
    :size         ="size"
    :icon         ="copiando ? 'mdi-clipboard-check' : 'mdi-content-copy'"
    :color        ="copiando ? 'positive' : color"
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
  import {  Tool              } from "src/composables/useTools"
  import {  copyToClipboard   } from 'quasar'

  const props               = defineProps({
    label:      { required: true,       type: [String, Number]  },
    size:       { default:  "xs",       type: String  },
    hideLabel:  { default:  false,      type: Boolean },
    disable:    { default:  false,      type: Boolean },
    color:      { default:  "grey-10",  type: String },
  })
  const { label, color }    = toRefs( props )
  const copiando            = ref<boolean>(false)

  async function copiar()
  {
    copiando.value          = true
    await copyToClipboard( label.value.toString() )
    await Tool.pausa( 1000 )
    copiando.value          = false
  }
</script>
