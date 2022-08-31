<template>
  <div>
    <q-input          dense hide-bottom-space
      v-model         ="modelo"
      lazy-rules      ="ondemand"
      class           ="transi"
      debounce        ="400"
      :class          ="{'campo-hundido' : hundido}"
      :filled         ="!hundido"
      :borderless     ="!hundido"      
      :label          ="label"
      :autofocus      ="autofocus"
      :clearable      ="clearable"
      @blur           ="onBlur"
      @focus          ="campoEnfocado = true"
      @clear          ="emit('clear')"
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
      autofocus:  { type: Boolean,  default:  false         },
      clearable:  { type: Boolean,  default:  false         },
      hundido:    { type: Boolean,  default:  false         },
    }
  )

  const emit            = defineEmits(["update:modelValue", "blur", "clear"])

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