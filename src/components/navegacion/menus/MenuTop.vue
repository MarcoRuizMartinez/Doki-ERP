<template>
  <div class              ="maco-wrapper">
    <ul class             ="maco-menu">
      <template v-for     ="(item, index) of menu">
        <lista
          v-if            ="item.visible"
          :index          ="item.label"
          :label          ="item.label" 
          :to             ="item.to"
          :count          ="item.count"
          :submenu        ="item.submenu"
        />
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import {  computed,         } from 'vue'
  import {  useStoreApp       } from 'stores/app'
  import    lista               from "./MenuTopLi.vue"

  const storeApp          = useStoreApp()
  const menu              = computed (() => storeApp.menu  )  
</script>

