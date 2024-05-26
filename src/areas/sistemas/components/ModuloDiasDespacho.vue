<template>
    <ventana                      minimizar
      class-contenido             ="column items-center"
      titulo                      ="Días despacho"
      icono                       ="mdi-calendar"
      size-icon-carga             ="14em"
      padding-contenido           ="0"
      :cargando                   ="!diasDespacho.length"
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
        :rows                     ="diasDespacho"
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
    import {  dexieDiasDespacho     } from "src/composables/useDexie"

    //* ///////////////////////////////////////////////////////////////////////////// Modelos
    import {  IColumna,     
              Columna               } from "src/models/Tabla"

    //* ///////////////////////////////////////////////////////////////////////////// Componentes 
    import    ventana                 from "components/utilidades/Ventana.vue"
    import    inputBuscar             from "components/utilidades/input/InputSimple.vue"

    const filtro                = ref< string >("")
    dexieDiasDespacho()
    const { diasDespacho        } = storeToRefs(useStoreDexie())
    const columnas: IColumna[]  = [
                                    new Columna({ name: "id"}),
                                    new Columna({ name: "label"}),
                                  ]
  </script>
