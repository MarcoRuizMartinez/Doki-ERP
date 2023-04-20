<template>
  <pagina-iframe
    src     ="https://docs.google.com/document/d/e/2PACX-1vR0QVyVBt-ec07KBkrMzoYzdq_J-H8dkZkG753jg29lPdTdPhHj9kPf5wn1oHNxOiupdQdrgtmIjbH-/pub?embedded=true"
    :titulo ="titulo"
    link    ="https://docs.google.com/document/d/1FJoti9p06IMaf22jVKZqTDv36Ad-sNwAApL69d0cWow"
  />
</template>

<script setup lang="ts">
  import    paginaIframe from "components/navegacion/VentanaIframe.vue"
  import {  useTitle            } from "@vueuse/core"
  const titulo  = "Políticas de entrega de productos"
  const title   = useTitle("📖 " + titulo)
</script>