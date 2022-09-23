<template>
  <div class="text-right cursor-pointer">
    {{ linea.descuentoX100 }}
  </div>
  <q-popup-edit           buttons
    v-if                  ="!readonly"
    v-model               ="linea.descuentoX100"
    v-slot                ="scope"
    label-set             ="Editar"
    @update:model-value   ="actualizar"
    >
    <numero-paso          porcentaje
      v-model             ="scope.value"
      label               ="Descuento"
      modo                ="right"
      :paso               ="0.1"
      :maximo             ="linea.x100Maximo"
      :minimo             ="0"
      @enter              ="scope.set"
    />        
  </q-popup-edit>
</template>
<script lang="ts" setup>
  import {  ref, toRefs, PropType } from "vue"    
  import {  ILineaAcuerdo         } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"            
  import    numeroPaso              from "components/utilidades/input/InputNumeroPaso.vue"

  const { editarDescuento } = useControlProductos()  

  const props               = defineProps({
    modelValue: { required: true, type: Object as PropType< ILineaAcuerdo > },
    readonly:   { default:  false,  type: Boolean                           }
  })
  const { modelValue }      = toRefs(props)
  const linea               = ref<ILineaAcuerdo>(modelValue.value)  
  const emit                = defineEmits<{
    (e: 'update:modelValue',  value: ILineaAcuerdo ): void
  }>()  

  function actualizar()
  {
    emit("update:modelValue", linea.value)
    editarDescuento( linea.value )
  }
</script>