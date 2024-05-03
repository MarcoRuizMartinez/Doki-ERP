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
  
  //* /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IMunicipio            } from "src/models/Municipio"  

  //* /////////////////////////////////////////////////////////////////////////////////// Componibles  
  import {  style                 } from "src/composables/useEstilos"
  
  type TProps                       = { municipio : IMunicipio, direccion : string }
  const { municipio, direccion }    = defineProps<TProps>()  
  const ruta                        = computed(()=> direccion + " " + municipio.nombreCompleto   )
  const url                         = computed(()=> "https://www.google.com.co/maps/place/" + ruta.value  )
  const abrirLink                   = ()=> window.open(url.value, '_blank')
</script>