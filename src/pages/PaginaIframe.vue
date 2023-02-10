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
  import    ventanaIframe   from "src/components/navegacion/VentanaIframe.vue"

  const props = defineProps({
    src:            { type: String, required: true },
    titulo:         { type: String, required: true },
    icono:          { type: String, default: "mdi-book-open-variant" },
    srcFormulario:  { type: String, default: "" },
    link:           { type: String, default: "" },
  })


</script>