<template>
  <q-btn                flat dense round
    icon                ="mdi-comment-multiple"
    class               ="op60 op100-hover"
    padding             ="none"
    size                ="md"
    :loading            ="loading"
    >
    <q-badge            floating transparent
      v-if              ="!!modelo"
      color             ="red"
      label             ="1"
    />
    <Tooltip :label     ="!!modelo ? modelo : 'Agregar ' + label"/>
    <q-popup-proxy
      transition-show   ="jump-down"
      transition-hide   ="jump-up"
      >
      <div class        ="q-pa-sm filtro-panel bg-gris column items-center shadow-3">                            
        <q-input        filled dense
          v-model       ="modelo"      
          :label        ="mayusculasPrimeraLetra(label)"
          :placeholder  ="`Editar ${label}`"
          type          ="textarea"      
          class         ="col-12"
          debounce      ="800"
          :loading      ="loading"
          :disable      ="loading"
        />
      </div>
    </q-popup-proxy> 
  </q-btn>
</template>

<script setup lang="ts">
  import {  ref,
            toRefs,
            computed
                            } from "vue"
  import {  mayusculasPrimeraLetra  } from "src/useSimpleOk/useTools"  
  const popupOn               = ref<boolean>( true )
  const props                 = defineProps({
    modelValue: { required: true,   type: String  },
    label:      { default:  "nota", type: String  },
    loading:    { default:  false,  type: Boolean },
  })
  const { modelValue }        = toRefs( props )

  const emit            = defineEmits(["update:modelValue"])
  const modelo          = computed({
                            get: ()     => modelValue.value,
                            set: valor  => emit("update:modelValue", valor ?? "")
                          })
</script>