<template>
  <q-tabs             dense no-caps inline-label
    v-model           ="tabs.activa"
    class             ="q-ma-none"
    >
    <q-tab
      label           ="Busqueda"
      name            ="tab_1"
      icon            ="mdi-magnify"
      :alert          ="!!tabs.alerts[0] ? 'red' : false"
      >
      <!-- <Tooltip label  ="Validar"/> -->
    </q-tab>
    <q-tab
      label           ="Otros"
      name            ="tab_2"
      icon            ="mdi-toolbox"
      :alert          ="!!tabs.alerts[1] ? 'red' : false"      
      >
      <Tooltip label  ="Mas opciones"/>
    </q-tab>
    <!--
    <q-tab
      label           ="Filtros"
      name            ="tab_3"
      icon            ="mdi-filter"
      >
      <Tooltip label  ="Validar"/>
    </q-tab>
    -->
  </q-tabs>  
</template>

<script setup lang="ts">
  import  { storeToRefs         } from 'pinia'                                            
  import  { useStoreApp         } from 'src/stores/app'
  const   { tabs                } = storeToRefs( useStoreApp() )
</script>