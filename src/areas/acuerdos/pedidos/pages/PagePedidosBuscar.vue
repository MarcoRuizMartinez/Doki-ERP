<template>
  <q-page padding class         ="row item-stretch content-start justify-left">
    <ventana-busqueda
    />
  </q-page>
</template>

<script setup lang="ts">
  import {  useTitle            } from "@vueuse/core"
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreUser        } from 'src/stores/user'    
  import    ventanaBusqueda       from "src/areas/acuerdos/components/Busqueda/VentanaBusqueda.vue"
  
  const title                     = useTitle("🔍 Buscar cotizaciones")
</script>