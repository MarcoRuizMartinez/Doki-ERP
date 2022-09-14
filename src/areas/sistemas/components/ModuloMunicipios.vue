<template>
    <ventana                      minimizar
      class-contenido             ="column items-center"
      titulo                      ="Municipios"
      icono                       ="mdi-map-marker"
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
    import {  ref             } from "vue"
    import {  IColumna,
              Columna         } from "src/models/Tabla"
    import    ventana           from "components/utilidades/Ventana.vue"
    import    inputBuscar       from "src/components/utilidades/input/InputSimple.vue"
    import {  dexieMunicipios } from "src/services/useDexie"
  
    const filtro                = ref< string >("")  
    const lista                 = dexieMunicipios()
    const columnas: IColumna[]  = [
                                    new Columna({ name: "id"}),
                                    new Columna({ name: "municipio"}),
                                    new Columna({ name: "departamento"}),
                                  ]

//[TABLAS.MUNICIPIOS]:        "++id, municipio, departamento 
  </script>