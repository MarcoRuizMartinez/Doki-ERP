<template>
  <q-btn          dense flat rounded
    class         ="width80 q-mr-sm"
    :icon         ="!!tareas.length ? 'mdi-bell-ring' : 'mdi-bell-check'"
    @click        ="menuTareasOn = !menuTareasOn"
    @mouseover    ="menuTareasOn = true"
    >
    <q-badge      rounded
      v-if        ="!!tareas.length"
      color       ="red"
      :label      ="tareas.length"
    />
  </q-btn>
</template>

<script setup lang="ts">
  ///////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs       } from 'pinia'
  
  import {  useStoreAcciones  } from 'src/stores/acciones'
  //import {  useStoreUser      } from 'src/stores/user'
  const { tareas,
          menuTareasOn    } = storeToRefs( useStoreAcciones() )

</script>
