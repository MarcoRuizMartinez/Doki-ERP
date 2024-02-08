<template>
  <q-scroll-area
    class                   ="fit fill-available column"
    @mouseenter             ="adentro = true"
    @mouseleave             ="salir"
    >
    <notificaciones-alertas/>
    <notificaciones-tareas/>
  </q-scroll-area>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref          } from 'vue'
  
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs             } from 'pinia'
  import {  useStoreAcciones        } from 'src/stores/acciones'


  // * /////////////////////////////////////////////////////////////////////////////////// Modelos


  // * /////////////////////////////////////////////////////////////////////////////////// Componentes

  import    NotificacionesTareas      from "./NotificacionesTareas.vue"
  import    NotificacionesAlertas     from "./NotificacionesAlertas.vue"
  

  const adentro                 = ref<boolean>(false)
  const loading                 = ref<boolean>(false)


  const { menuTareasOn        } = storeToRefs( useStoreAcciones() )  



  function salir()
  {
    if(adentro.value && !loading.value ){
      menuTareasOn.value      = false
      adentro.value           = false
    } 
  }


  


</script>