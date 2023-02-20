<template>
  <q-page                 padding
    class                 ="row justify-center"
    >
    <ventana-iframe
      v-bind= "props"
    />
  </q-page>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  toRefs, watch } from 'vue'
  import {  useTitle      } from "@vueuse/core"
  import    ventanaIframe   from "src/components/navegacion/VentanaIframe.vue"

  const props = defineProps({
    src:            { type: String, required: true },
    titulo:         { type: String, required: true },
    icono:          { type: String, default: "mdi-book-open-variant" },
    srcFormulario:  { type: String, default: "" },
    link:           { type: String, default: "" },
  })

  const { titulo }  = toRefs( props )


  watch( titulo, ( newTitulo )=> useTitle( newTitulo ), { immediate: true }) 

</script>