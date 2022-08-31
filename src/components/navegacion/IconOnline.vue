<template>
  <transition
    appear
    enter-active-class="animated fadeInUp"
    leave-active-class="animated fadeOutDown"
    >
    <q-icon
      v-if        ="!online"
      name        ="mdi-wifi-off"
      style       ="color: rgb(255 255 255 / 50%);" 
      size        ="2em"
      class       ="q-mr-md">
      <Tooltip
        label     ="Sin conexión"/>
    </q-icon>
  </transition>
</template>
<script setup lang="ts">
  import {    computed            } from 'vue'
  import {  useStoreApp       } from 'src/stores/app'

  const storeApp    = useStoreApp()
  const online      = computed(() => storeApp.online)
</script>