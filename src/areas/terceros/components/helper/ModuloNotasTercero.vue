<template>
  <ventana                      minimizar
    class-contenido             ="column items-center"
    titulo                      ="Notas"
    icono                       ="mdi-notebook-edit"
    size-icon-carga             ="6em"
    padding-contenido           ="0"
    :modo                       ="modo"
    >
    <q-input                    filled 
      v-model                   ="modelo"
      debounce                  ="800"
      rows                      ="6"
      class                     ="fit"
      type                      ="textarea"
      placeholder               ="Apuntes sobre el tercero..."
      :readonly                 ="!puedeEditar"
      :loading                  ="cargando"
      @update:model-value       ="escribir"
    />
  </ventana>
</template>

<script setup lang="ts">
  import {  ref,
            toRefs,
            watch,
                            } from "vue"
  import {  servicesTerceros     } from "src/areas/terceros/services/servicesTerceros"
  import {  ModosVentana    } from "src/models/TiposVarios"
  import    ventana           from "components/utilidades/Ventana.vue"

  const modelo                = ref< string > ("")
  const modo                  = ref< ModosVentana >("buscando")
  const { setNota           } = servicesTerceros()

  const props                 = defineProps({
    terceroId:    { required: true,   type: Number, default: 0  },
    nota:         { required: true,   type: String              },
    puedeEditar:  { default:  false,  type: Boolean             },
  })

  const { terceroId, nota }   = toRefs( props )
  const cargando              = ref<boolean>(false)

  watch([nota, terceroId], ([newNota, oldNota], [newId, oldId]) => {
    modelo.value              = newNota
    modo.value                = "normal"
  })

  async function escribir( texto : any )
  {
    if(typeof texto != "string" && !!terceroId.value) return

    cargando.value            = true
    let ok                    = await setNota(terceroId.value, modelo.value)
    cargando.value            = false
  }


</script>