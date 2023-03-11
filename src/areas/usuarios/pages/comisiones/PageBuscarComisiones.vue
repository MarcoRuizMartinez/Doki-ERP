<template>
  <q-page padding class         ="row item-stretch content-start justify-start">
    <vista-busqueda/>
  </q-page>
</template>

<script setup lang="ts">
  import {  useTitle            } from "@vueuse/core"
  import    vistaBusqueda         from "src/areas/productos/components/Views/VistaProductoBusqueda.vue" 
  useTitle("📦 Buscar productos")
</script>