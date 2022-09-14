<template>
  <div class              ="text-right cursor-pointer">
    {{ linea.qtyUnd }}
  </div>
  <q-popup-edit           buttons
    v-if                  ="estado <= ESTADO_CTZ.BORRADOR"
    v-model               ="linea.qty"
    v-slot                ="scope"
    label-set             ="Editar"
    @update:model-value   ="actualizar"
    >
    <numero-paso
      v-model             ="scope.value"
      class               =""
      label               ="Cantidad"
      modo                ="right"
      :minimo             ="0.1"
      :readonly           ="estado > ESTADO_CTZ.BORRADOR"
      @enter              ="scope.set"
    />
  </q-popup-edit> 
</template>
<script lang="ts" setup>
  import {  ref, toRefs, PropType } from "vue"    
  import {  ILineaAcuerdo         } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  ESTADO_CTZ            } from "src/areas/acuerdos/models/Acuerdo"
  import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"            
  import    numeroPaso              from "components/utilidades/input/InputNumeroPaso.vue"

  const { editarCantidad  } = useControlProductos()  

  const props               = defineProps({
    modelValue: { required: true, type: Object as PropType< ILineaAcuerdo > },
    estado:     { required: true, type: Number                              },
  })
  const { modelValue }      = toRefs(props)
  const linea               = ref<ILineaAcuerdo>(modelValue.value)  
  const emit                = defineEmits<{
    (e: 'update:modelValue',  value: ILineaAcuerdo ): void
  }>()  

  function actualizar()
  {
    emit("update:modelValue", linea.value)
    editarCantidad( linea.value )
  }
</script>