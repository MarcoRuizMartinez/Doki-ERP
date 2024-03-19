<template>
  <q-btn 
    v-bind                ="size == 'sm' ? style.btnRedondoFlat2Sm : style.btnRedondoFlat2Md"
    :icon                 ="toogle ? iconTrue   : iconFalse"
    :color                ="toogle ? colorTrue  : colorFalse"
    @click                ="click"
    > 
    <Tooltip :label       ="toogle ? msjTrue : msjFalse"/>
  </q-btn> 
</template>
<script lang="ts" setup>
  import {  style           } from "src/composables/useEstilos"

  type TProps = {
    iconTrue    : string
    iconFalse   : string
    msjTrue     : string
    msjFalse    : string
    colorTrue  ?: string
    colorFalse ?: string    
    size       ?: "sm" | "md"
  }
  const { size        = "sm",
          colorTrue   = "",
          colorFalse  = "",
                      } = defineProps<TProps>()
  const toogle          = defineModel<boolean>( { required: true } )

  type TEmits = {
    click : [ value : boolean ]
  }
  const emit            = defineEmits<TEmits>()

  function click()
  {
    toogle.value        = !toogle.value
    emit('click', toogle.value)
  }
</script>