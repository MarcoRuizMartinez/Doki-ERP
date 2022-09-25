<template>
  <q-page padding class         ="row item-stretch content-start justify-left">
    <ventana-busqueda
      :tipo                     ="TIPO_ACUERDO.PEDIDO"
    />
  </q-page>
</template>

<script setup lang="ts">
  import {  useTitle            } from "@vueuse/core"
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreUser        } from 'src/stores/user'    
  import    ventanaBusqueda       from "src/areas/acuerdos/components/Busqueda/VentanaBusqueda.vue"
  import {  TIPO_ACUERDO        } from "src/areas/acuerdos/models/ConstantesAcuerdos"

  const title                     = useTitle("🔍 Buscar cotizaciones")
</script>