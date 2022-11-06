<template>
  <q-page class="row items-center justify-evenly">
    <h2> No tienes permiso </h2>
    <q-btn label="Reintentar" :to="ruta"/>
  </q-page>
</template>

<script setup lang="ts">
  const props = defineProps({
    ruta: { default: "", type: String }
  })
</script>