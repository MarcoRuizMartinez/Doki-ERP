<template>
  <div class              ="text-right cursor-pointer">
    {{ linea.qtyUnd }}
  </div>
  <q-popup-edit           buttons
    v-if                  ="!readonly"
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
      @enter              ="scope.set"
    />
  </q-popup-edit> 
</template>
<script lang="ts" setup>
  import {  ref,
            watch,
            toRefs,
            PropType              } from "vue"    
  import {  ILineaAcuerdo         } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"            
  import    numeroPaso              from "components/utilidades/input/InputNumeroPaso.vue"

  const { editarLinea  }    = useControlProductos()  

  const props               = defineProps({
    modelValue: { required: true,   type: Object as PropType< ILineaAcuerdo > },
    readonly:   { default:  false,  type: Boolean                             }
  })
  const { modelValue }      = toRefs(props)
  const linea               = ref<ILineaAcuerdo>(modelValue.value)  
  const emit                = defineEmits<{
    (e: 'update:modelValue',  value: ILineaAcuerdo ): void
  }>()  

  watch( modelValue, (newLinea)=> linea.value = newLinea )

  function actualizar()
  {
    emit("update:modelValue", linea.value )
    editarLinea( linea.value )
  }
</script>