<template>
  <q-popup-edit   buttons
    v-model       ="costo"
    v-slot        ="scope"
    class         ="q-pa-sm"
    anchor        ="top middle"
    self          ="bottom middle"
    label-set     ="Guardar"
    :validate     ="validar"
    >
    <input-number alerta solo-positivo no-cero autofocus 
      v-model     ="costo"
      label       ="Costo"      
      tipo        ="precio"
      class       ="width200"
      colores     ="verde-rojo"
      debounce    ="700"
      modo        ="right"
      :error      ="hayError"
      :paso       ="1000"
      :minimo     ="0"
      @enter      ="scope.set"
    />               
  </q-popup-edit>
</template>
<script lang="ts" setup>
  import {  ref,
            toRefs,
            PropType            } from "vue"  
  import {  ILineaAcuerdo       } from "src/areas/acuerdos/models/LineaAcuerdo"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  import {  valorValido         } from "src/composables/useTools"

  const { editarCostoLinea  } = useControlProductos()  
  const props                 = defineProps({
    modelValue: { required: true, type: Object as PropType< ILineaAcuerdo > },    
  })
  const { modelValue }        = toRefs(props)
  const costo                 = ref< number >( modelValue.value.costo )
  const hayError              = ref< boolean>( false )

  async function editar()
  {
    const ok                  = await editarCostoLinea( costo.value, modelValue.value.lineaId )
    if(ok)
      modelValue.value.costo  = costo.value
  }

  function validar() : boolean
  {
    let valido        = true

    if
    (
      !valorValido( costo.value )
      ||
      costo.value    === modelValue.value.costo
      ||
      costo.value    <= 0
    )
      valido          = false

    hayError.value    = !valido

    if(valido) editar()
    
    return valido
  }
</script>
