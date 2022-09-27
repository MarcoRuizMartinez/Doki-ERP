<template>
  <q-page padding class         ="row item-stretch content-start justify-left">
    <ventana-busqueda
      icono                     ="mdi-format-list-checks"
      :tipo                     ="TIPO_ACUERDO.COTIZACION "
    />
  </q-page>
</template>

<script setup lang="ts">
  import {  useTitle            } from "@vueuse/core"
  import    ventanaBusqueda       from "src/areas/acuerdos/components/Busqueda/VentanaBusqueda.vue"
  import {  TIPO_ACUERDO        } from "src/areas/acuerdos/models/ConstantesAcuerdos"

  const title                     = useTitle("🔍 Buscar cotizaciones")
</script>