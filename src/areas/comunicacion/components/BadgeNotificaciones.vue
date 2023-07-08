<template>
  <q-spinner-puff
    v-if          ="!!tareas.length"
    color         ="white"
    size          ="md"
    style         ="right: 61px; top: 9px;"
    class         ="absolute-top-right"
  />      
  <q-btn          dense flat rounded
    v-bind        ="$attrs"
    class         ="width80 q-mr-sm"
    :icon         ="  !!tareas.length ? 'mdi-bell-ring'
                    : yaBusco         ? 'mdi-bell-check'
                    :                   'mdi-bell'
                    "
    to            ="/tareas"
    @mouseover    ="menuTareasOn = true"
    >
    <q-badge      rounded
      v-if        ="!!tareas.length"
      color       ="red"
      :label      ="tareas.length"
    />
    <Tooltip label="Ir a buscador de tareas"/>
  </q-btn>  
</template>

<script setup lang="ts">
  ///////////////////////////////////////////////////////////////////////// Store  
  import {  storeToRefs       } from 'pinia'    
  import {  useStoreAcciones  } from 'src/stores/acciones'  
  const { tareas, yaBusco,
          menuTareasOn    } = storeToRefs( useStoreAcciones() )
</script>
