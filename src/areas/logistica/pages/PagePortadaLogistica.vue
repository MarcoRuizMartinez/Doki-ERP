<template>
  <q-page                 padding
    class                 ="row item-stretch content-start justify-start q-col-gutter-lg">
    <titulo
      label               ="Logística"
      color               ="#524B87"
      img                 ="iconoEntrega.webp"
    />
    <menu-enlaces />
  </q-page>
</template>

<script setup lang="ts">
  import {  ref,  provide           } from 'vue'
  import {  useStoreUser            } from 'src/stores/user'
  import {  useTitle                } from "@vueuse/core"
  import    titulo                    from "components/navegacion/PortadasTitulo.vue"
  import    menuEnlaces               from "components/navegacion/PortadasMenu.vue"
  import    panel                     from "components/utilidades/Panel.vue"

  const storeUser                 = useStoreUser()
  useTitle("🏠 Inicio Grupo Escom")
</script>
<style>

</style>
