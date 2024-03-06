<template>
  <!-- <q-spinner-puff
    v-if          ="!!tareas.length"
    color         ="white"
    size          ="md"
    style         ="right: 69px; top: 9px;"
    class         ="absolute-top-right"
  /> -->
  <q-btn          dense flat rounded
    v-bind        ="$attrs"
    class         ="width100 q-mr-sm"
    :icon         ="  !!tareas.length ? 'mdi-bell-ring'
                    : yaBusco         ? 'mdi-bell-check'
                    :                   'mdi-bell'
                    "
    to            ="/tareas"
    @mouseover    ="menuTareasOn = true"
    >
    <div class    ="row gap-xs">
      <q-badge    rounded
        v-if      ="!!tareas.length"
        color     ="green"
        :label    ="tareas.length"
      />
      <q-badge    rounded
        v-if      ="!!alertas"
        color     ="orange-9"
        :label    ="alertas"
      />
    </div>
    <Tooltip label="Ir a buscador de tareas"/>
  </q-btn>  
</template>

<script setup lang="ts">
  ///////////////////////////////////////////////////////////////////////// Store  
  import {  storeToRefs       } from 'pinia'    
  import {  useStoreAcciones  } from 'stores/acciones'  
  import {  useStoreApp       } from 'stores/app'

  const { alertas         } = storeToRefs( useStoreApp() )
  const { tareas, yaBusco,
          menuTareasOn    } = storeToRefs( useStoreAcciones() )
</script>
