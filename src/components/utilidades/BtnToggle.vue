<template>
  <q-btn 
    v-bind                ="size == 'sm' ? style.btnRedondoFlat2Sm : style.btnRedondoFlat2Md"
    :icon                 ="toogle ? iconTrue : iconFalse"
    @click                ="toogle = !toogle"
    > 
    <Tooltip :label       ="toogle ? msjTrue : msjFalse"/>
  </q-btn> 
</template>
<script lang="ts" setup>
  import {  style           } from "src/composables/useEstilos"

  type TProps = {
    iconTrue   : string
    iconFalse  : string
    msjTrue    : string
    msjFalse   : string
    size      ?: "sm" | "md"
  }
  const { size = "sm" } = defineProps<TProps>()
  const toogle          = defineModel<boolean>( { required: true } )
</script>