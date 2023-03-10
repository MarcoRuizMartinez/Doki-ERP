<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,
            toRefs,
            PropType,            
                              } from "vue"
  import {  style             } from "src/useSimpleOk/useEstilos"

  type TTipoLista             = "grilla" | "lista"  

  const props                 = defineProps({
      modelValue: { required: true,     type: String                            },
      color:      { default:  "grey-3", type: String                            },  
      porDefecto: { default:  "grilla", type: String as PropType< TTipoLista >  },
  })

  const emit = defineEmits<{
    (e: "update:model-value",   value: TTipoLista  ): void
  }>()

  const { modelValue,
          porDefecto }  = toRefs( props )
  const tipoVista       = ref<TTipoLista>( porDefecto.value )

  watch(modelValue, (n)=>{
    if((n === "grilla" || n === "lista") && n != tipoVista.value)
      tipoVista.value   = n
  })
</script>

<template>
  <q-btn-toggle
    v-model               ="tipoVista"
    v-bind                ="style.toggleGris"
    :color                ="color"
    :options              ="[
                              { value: 'grilla', slot: 'grilla' },
                              { value: 'lista',  slot: 'lista' }
                            ]"
    @update:model-value   ="emit('update:model-value', tipoVista)"
    >
    <template             #grilla>
      <q-icon   name      ="mdi-view-module"      size="sm"/>
      <Tooltip label      ="Vista cuadricula"/>
    </template>
    <template             #lista>
      <q-icon   name      ="mdi-format-list-text" size="sm"/>
      <Tooltip label      ="Vista lista"/>
    </template>
  </q-btn-toggle>
</template>