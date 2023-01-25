<template>
    <ventana                      minimizar
      class-contenido             ="column items-center"
      titulo                      ="Categorías de productos"
      icono                       ="mdi-view-carousel"
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
    import {  ref                     } from "vue"
    import {  IColumna,
              Columna                 } from "src/models/Tabla"
    import    ventana                   from "components/utilidades/Ventana.vue"
    import    inputBuscar               from "src/components/utilidades/input/InputSimple.vue"
    import {  dexieCategoriasProducto } from "src/services/useDexie"

    const filtro                = ref< string >("")
    const lista                 = dexieCategoriasProducto({ cargarSiempre : true})
    const columnas: IColumna[]  = [
                                    new Columna({ name: "id"}),
                                    new Columna({ name: "nombre"}),
                                    new Columna({ name: "sigla"}),
                                    new Columna({ name: "grupo"}),
                                    new Columna({ name: "modificadorComision"}),
                                    new Columna({ name: "codigoVenta"}),
                                    new Columna({ name: "codigoCompra"}),
                                  ]
  </script>
