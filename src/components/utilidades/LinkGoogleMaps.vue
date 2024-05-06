<template>
  <q-btn
    v-bind            ="style.btnRedondoFlatSm"
    icon              ="mdi-google-maps"
    class             ="text-red"
    @click            ="abrirLink"
    >
    <Tooltip  label   ="Ver en Google Maps"/>
  </q-btn>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  computed              } from "vue"
  import {  style                 } from "src/composables/useEstilos"
  
  type TProps                       = { ciudad : string, direccion : string }
  const { ciudad, direccion }    = defineProps<TProps>()  
  const ruta                        = computed(()=> direccion + " " + ciudad   )
  const url                         = computed(()=> "https://www.google.com.co/maps/place/" + ruta.value  )
  const abrirLink                   = ()=> window.open(url.value, '_blank')
</script>