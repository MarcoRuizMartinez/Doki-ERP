<template>
    <ventana                      minimizar
      class-contenido             ="column items-center"
      titulo                      ="Tipos de contacto"
      icono                       ="mdi-account-group"
      size-icon-carga             ="14em"
      padding-contenido           ="0"
      :cargando                   ="!lista.length"
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
    import {  dexieTiposContacto  } from "src/services/useDexie"

    const filtro                = ref< string >("")
    const lista                 = dexieTiposContacto()
    const columnas: IColumna[]  = [
                                    new Columna({ name: "id"}),
                                    new Columna({ name: "codigo"}),
                                    new Columna({ name: "tipo"}),
                                    new Columna({ name: "origen"}),
                                  ]
  </script>
