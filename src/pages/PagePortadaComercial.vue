<template>
  <q-page                 padding
    class                 ="row item-stretch content-start justify-start q-col-gutter-lg">
    <titulo
      label               ="Gestión Comercial"
      color               ="#0080FF"
      img                 ="iconoCotizacion.webp"
      icono               ="mdi-account-supervisor-circle-outline"
    />
    <menu-enlaces
      :palabras           ="['omision', 'Anticipos', 'facturar', 'Niveles']"
    />
  </q-page>
</template>

<script setup lang="ts">
  import {  useTitle                } from "@vueuse/core"
  import    titulo                    from "components/navegacion/PortadasTitulo.vue"
  import    menuEnlaces               from "components/navegacion/PortadasMenu.vue"
  useTitle("🧑🏽‍💻 Comercial")
</script>