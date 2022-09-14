<template>
    <ventana                      minimizar
      class-contenido             ="column items-center"
      titulo                      ="Tiempos de entrega"
      icono                       ="mdi-calendar-clock"
      size-icon-carga             ="14em"
      :cargando                   ="!lista.length"
      >
      <template                   #menu>
        <input-buscar             autofocus clearable hundido
          v-model                 ="filtro"
          label                   ="Filtrar.."
          class                   ="full-width"        
        />
      </template>    
      <q-table                    borbordered dense flat
        class                     ="fit tabla-maco"
        row-key                   ="id"
        :rows                     ="lista"
        :columns                  ="columnas"
        :filter                   ="filtro"
        >
      </q-table>
    </ventana>
  </template>
  
  <script setup lang="ts">
    import {  ref                 } from "vue"
    import {  IColumna,
              Columna             } from "src/models/Tabla"
    import    ventana               from "components/utilidades/Ventana.vue"
    import    inputBuscar           from "src/components/utilidades/input/InputSimple.vue"
    import {  dexieTiemposEntrega } from "src/services/useDexie"
  
    const filtro                = ref< string >("")  
    const lista                 = dexieTiemposEntrega()
    const columnas: IColumna[]  = [
                                    new Columna({ name: "id"}),
                                    new Columna({ name: "label"}),
                                    new Columna({ name: "codigo"}),
                                  ]
  </script>