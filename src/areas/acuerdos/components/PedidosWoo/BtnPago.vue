<template>
  <q-btn
    v-bind            ="style.btnRedondoFlat"
    :icon             ="icono"
    :color            ="color"
    @click            ="clickBtn"
    >
    <Tooltip :label   ="label"/>
  </q-btn>
</template>
<script lang="ts" setup>
  import {  ref,
            toRefs,
            PropType,
            watch,
                              } from "vue"  
  import {  IPedidoWoo        } from "src/areas/acuerdos/models/PedidoWoo"
  import {  style             } from "src/composables/useEstilos"

  const props               = defineProps({
    pedido: { required: true, type: Object as PropType< IPedidoWoo > },      
  })

  const emit                  = defineEmits<{
    (e: "click"): void
  }>()

  const { pedido : p }        = toRefs(props)

  function clickBtn()
  {
    if(clickEnable) emit("click")
  }

  const color               = ref<string>("")
  const icono               = ref<string>("")
  const label               = ref<string>("")
  let clickEnable           = false

  watch(p, ()=>
    {
      if(p.value.estadoPago   === "🖐🏻"){
        icono.value           = "mdi-credit-card-clock"
        color.value           = "grey-8"
        label.value           = "A la espera"
        clickEnable           = false
      }
      else
      if(p.value.estadoPago   === "🔎"){
        icono.value           = "mdi-credit-card-wireless"
        color.value           = "purple-10"
        label.value           = "Buscando..."
        clickEnable           = false
      }
      else
      if(p.value.estadoPago   === "✖️"){
        icono.value           = "mdi-blank"
        color.value           = ""
        label.value           = "Sin pago"
        clickEnable           = false
      }
      else
      if(p.value.pagos.length >= 2){
        icono.value           = "mdi-credit-card-settings"
        color.value           = "indigo-14"
        label.value           = `Hay ${p.value.pagos.length} pagos`
        clickEnable           = true
      }
      else
      if(p.value.pagos[0].aprobado){
        icono.value           = "mdi-credit-card-check"
        color.value           = "light-green-14"
        label.value           = "Pago aprobado"
        clickEnable           = true
      }
      else{
        icono.value           = "mdi-credit-card-remove"
        color.value           = "red-10"
        label.value           = "Pago fallido"
        clickEnable           = true
      }    
    }
    , { deep: true, immediate: true }
  )
</script>