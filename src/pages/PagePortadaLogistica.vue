<template>
  <q-page                 padding
    class                 ="row item-stretch content-start justify-start q-col-gutter-lg">
    <titulo
      label               ="Logística"
      color               ="#800080"
      img                 ="iconoEntrega.webp"
      icono               ="mdi-truck-fast"
    />
    <menu-enlaces
      :palabras           ="['edidos', 'arantias', 'guías', 'envíos']"
    />
  </q-page>
</template>

<script setup lang="ts">
  import {  useTitle                } from "@vueuse/core"
  import    titulo                    from "components/navegacion/PortadasTitulo.vue"
  import    menuEnlaces               from "components/navegacion/PortadasMenu.vue"
  useTitle("🚛 Logística")
</script>