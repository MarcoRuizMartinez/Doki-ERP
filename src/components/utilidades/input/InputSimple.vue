<template>
  <div>
    <q-input          dense hide-bottom-space
      v-model         ="modelo"
      v-bind          ="$attrs"
      lazy-rules      ="ondemand"
      class           ="transi"
      :debounce       ="debounce"
      :class          ="{'campo-hundido' : hundido}"
      :filled         ="!hundido"
      :borderless     ="!hundido"      
      :label          ="label"
      @blur           ="onBlur"
      @focus          ="campoEnfocado = true"
      @clear          ="emit('clear')"
      @keydown.enter.prevent="emit('enter')"
      >
      <template #prepend>
        <q-icon :name ="icon" />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
  import {  computed,
            ref,
            toRefs      } from 'vue'

  const props           = defineProps(
    {
      modelValue: { type: String,   required: true          },
      label:      { type: String,   required: true          },
      icon:       { type: String,   default:  "mdi-magnify" },
      hundido:    { type: Boolean,  default:  false         },
      debounce:   { type: String,   default:  "400"         },
    }
  )

  const emit            = defineEmits(["update:modelValue", "blur", "clear", "enter"])

  const { modelValue  } = toRefs( props )
  const modelo          = computed({
                            get: ()     => modelValue.value,
                            set: valor  =>
                            {
                              valor         = valor ?? ""
                              emit("update:modelValue", valor.trim())
                            }
                          })

  const campoEnfocado   = ref< boolean >(false)

  function onBlur()
  {
    campoEnfocado.value     = false
    emit('blur')
  }
</script>