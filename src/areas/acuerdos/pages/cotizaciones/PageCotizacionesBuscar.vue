<template>
  <q-page padding class         ="row item-stretch content-start justify-start">
    <vista-busqueda
      icono                     ="mdi-format-list-checks"
      :tipo                     ="TIPO_ACUERDO.COTIZACION "
    />
  </q-page>
</template>

<script setup lang="ts">
  import {  useTitle            } from "@vueuse/core"
  import    vistaBusqueda         from "src/areas/acuerdos/components/Views/VistaBusqueda.vue" 
  import {  TIPO_ACUERDO        } from "src/areas/acuerdos/models/ConstantesAcuerdos"

  useTitle("🔍 Buscar cotizaciones")
</script>