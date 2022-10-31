<template>
  <q-page padding class         ="row item-stretch content-start justify-start">
    <vista-busqueda
      icono                     ="mdi-cart"
      :tipo                     ="TIPO_ACUERDO.PEDIDO"
    />
  </q-page>
</template>

<script setup lang="ts">
  import {  useTitle            } from "@vueuse/core"
  import    vistaBusqueda         from "src/areas/acuerdos/components/Views/VistaAcuerdoBusqueda.vue" 
  import {  TIPO_ACUERDO        } from "src/areas/acuerdos/models/ConstantesAcuerdos"

  useTitle("🔍 Buscar cotizaciones")
</script>