<template>
  <div class              ="maco-wrapper">
    <ul class             ="maco-menu">
      <lista
        v-for             ="(item, index) of menu"
        :index            ="item.label"
        :label            ="item.label" 
        :to               ="item.to"
        :count            ="item.count"
        :submenu          ="item.submenu"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
  import {  computed,         } from 'vue'
  import {  useStoreApp       } from 'src/stores/app'
  import    lista               from "./MenuTopLi.vue"

  const storeApp          = useStoreApp()
  const menu              = computed (() => storeApp.menu  )  
</script>

