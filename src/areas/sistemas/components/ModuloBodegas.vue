<template>
    <ventana                      minimizar
      class-contenido             ="column items-center"
      titulo                      ="Bodegas"
      icono                       ="mdi-office-building"
      size-icon-carga             ="14em"
      padding-contenido           ="0"
      :cargando                   ="!bodegas.length"
      >
      <template                   #menu>
        <input-buscar             clearable hundido
          v-model                 ="filtro"
          label                   ="Filtrar.."
          class                   ="full-width"
        />
      </template>
      <q-table                    bordered dense flat
        class                     ="fit tabla-maco"
        row-key                   ="id"
        :rows                     ="bodegas"
        :columns                  ="columnas"
        :filter                   ="filtro"
        >
      </q-table>
    </ventana>
  </template>

  <script setup lang="ts">
    //* ///////////////////////////////////////////////////////////////////////////// Core
    import {  ref                   } from "vue"
    
    //* ///////////////////////////////////////////////////////////////////////////// Store
    import {  storeToRefs           } from 'pinia'      
    import {  useStoreDexie         } from 'stores/dexieStore'

    //* ///////////////////////////////////////////////////////////////////////////// Componibles
    import {  dexieBodegas          } from "src/composables/useDexie"

    //* ///////////////////////////////////////////////////////////////////////////// Modelos
    import {  IColumna,     
              Columna               } from "src/models/Tabla"

    //* ///////////////////////////////////////////////////////////////////////////// Componentes 
    import    ventana                 from "components/utilidades/Ventana.vue"
    import    inputBuscar             from "components/utilidades/input/InputSimple.vue"

    const filtro                = ref< string >("")
    dexieBodegas()
    const { bodegas           } = storeToRefs( useStoreDexie() )
    const columnas: IColumna[]  = [
                                    new Columna({ name: "id"}),
                                    new Columna({ name: "label"}),
                                  ]
  </script>
