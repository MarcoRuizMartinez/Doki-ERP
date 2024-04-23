<template>
  <div
    class                 ="text-right"
    :class                ="$attrs.class"
    >
    {{ linea.descuentoX100 }}
    <q-icon :name="linea.iconoNivel" color="grey-6" size="sm" class="q-mr-xs"/>
  </div>
  <q-popup-edit           buttons cover separate-close-popup
    v-if                  ="!readonly && !acuerdo.facturado"
    v-model               ="linea.descuentoX100"
    class                 ="alto-min-100"
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
  import {  ref,
            watch,
            toRefs,
            PropType              } from "vue"    
  import {  ILineaAcuerdo         } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"            
  import    numeroPaso              from "components/utilidades/input/InputNumeroPaso.vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreAcuerdo     } from 'stores/acuerdo'  

  const { acuerdo         } = storeToRefs( useStoreAcuerdo() )
  const { editarLinea }     = useControlProductos()

  const props               = defineProps({
    modelValue: { required: true, type: Object as PropType< ILineaAcuerdo > },
    readonly:   { default:  false,  type: Boolean                           }
  })
  const { modelValue }      = toRefs(props)
  const linea               = ref< ILineaAcuerdo >( modelValue.value )  
  const emit                = defineEmits<{
    (e: 'update:modelValue',  value : ILineaAcuerdo ): void
  }>()

  watch( modelValue, (newLinea)=> linea.value = newLinea )

  function actualizar()
  {
    emit("update:modelValue", linea.value)
    editarLinea( linea.value )
  }
</script>