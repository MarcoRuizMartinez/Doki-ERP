<template>
  <pagina-iframe
    src     ="https://docs.google.com/document/d/e/2PACX-1vTi2uUuwHw63UiZuQkcRIwpdYoMc0bNiDY71Jsl2RiZjol7biXxZgrIX8d1HStN5e6fB2-nXVL_RtRC/pub?embedded=true"
    :titulo ="titulo"
    link    ="https://docs.google.com/document/d/12NiKLRbP2vQPh-wz52F5y8HU4qAZPpOkdHXI1ENCIII"
  />
</template>

<script setup lang="ts">
  import    paginaIframe    from "src/components/navegacion/VentanaIframe.vue"
  import {  useTitle            } from "@vueuse/core"
  const titulo  = "Políticas para el manejo de clientes entre comerciales de Escom y Mublex"
  const title   = useTitle("📖 " + titulo)
</script>