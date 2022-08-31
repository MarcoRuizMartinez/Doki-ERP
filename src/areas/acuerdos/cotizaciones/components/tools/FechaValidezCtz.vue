<template>
  <input-fecha
    v-model                 ="modelo"
    label                   ="Fecha validez"
    class                   ="col-md-6 col-12"
    titulo                  ="Fecha vencimiento"
    :loading                ="loading"
    :dias-validos           ="diasDefault"
    @update:model-value     ="emitir"
    >
    {{dias + ( dias === 1 ? " día" : " días")}}
  </input-fecha>
</template>
<script setup lang="ts">
  import {  ref,
            toRefs,
            watch,
                              } from "vue"
  import    inputFecha          from "src/components/utilidades/input/InputFecha.vue"
  import {  useConstantes,
            CONSTANTES        } from "src/models/Diccionarios/Constante"
  import {  date              } from 'quasar'

  const emit                  = defineEmits(["update:model-value"])
  const props                 = defineProps({
    modelValue: { default:  new Date(), type: Date    },
    dias:       { required: true,       type: Number  },
    loading:    { default:  false,      type: Boolean },
    nuevo:      { default:  false,      type: Boolean },
  })

  
  const { modelValue, nuevo } = toRefs(props)
  const modelo                = ref<Date> ( modelValue.value )
  const diasDefault           = useConstantes( CONSTANTES.CTZ_DIAS_VALIDEZ )

  watch([modelValue, diasDefault], ([ newFecha, newDias ]) =>
  {
    let miliSec1970           = newFecha.valueOf()
    if(!miliSec1970           && !!newDias && nuevo.value)
    {
      modelo.value            = getFechaDefault()
      emitir()
    }
    else
    if(!!miliSec1970)
      modelo.value            = newFecha
  },
  {
    immediate: true
  })



  function emitir(){
    emit('update:model-value', modelo.value)
  }

  function getFechaDefault() : Date {
    return date.addToDate(new Date(), { days: diasDefault.value })
  }
</script>