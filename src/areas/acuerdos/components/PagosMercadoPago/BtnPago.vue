<template>
  <q-btn
    v-bind            ="style.btnRedondoFlat"
    :icon             ="icono"
    :color            ="color"
    @click            ="emit('click')"
    >
    <Tooltip :label   ="label"/>
  </q-btn>
</template>
<script lang="ts" setup>
  import {  ref,
            PropType,
            watch,
            toRefs,
                              } from "vue"  
  import {  IMercadoPago      } from "src/areas/acuerdos/models/PagoMercadoPago"
  import {  style             } from "src/useSimpleOk/useEstilos"

  const props             = defineProps({
    pago: { required: true, type: Object as PropType< IMercadoPago > },      
  })

  const { pago }          = toRefs( props )

  const emit              = defineEmits<{
    (e: "click"): void
  }>()


  const color             = ref<string>("")
  const icono             = ref<string>("")
  const label             = ref<string>("")

  watch(pago, ()=>
    {
      if(pago.value.aprobado){
        icono.value       = "mdi-credit-card-check"
        color.value       = "light-green-14"
      }
      else
      {
        icono.value       = "mdi-credit-card-remove"
        color.value       = "red-10"        
      } 
      label.value         = pago.value.estadoDetalles
    }
    , { deep: true, immediate: true }
  )
</script>