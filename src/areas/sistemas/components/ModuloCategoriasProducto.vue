<template>
    <ventana                      minimizar
      class-contenido             ="column items-center"
      titulo                      ="Categorías de productos"
      icono                       ="mdi-view-carousel"
      size-icon-carga             ="14em"
      padding-contenido           ="0"
      :cargando                   ="!categoriasProductos.length"
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
        :rows                     ="categoriasProductos"
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
    import { dexieCategoriasProducto} from "src/composables/useDexie"

    //* ///////////////////////////////////////////////////////////////////////////// Modelos
    import {  IColumna,     
              Columna               } from "src/models/Tabla"

    //* ///////////////////////////////////////////////////////////////////////////// Componentes 
    import    ventana                 from "components/utilidades/Ventana.vue"
    import    inputBuscar             from "components/utilidades/input/InputSimple.vue"
    

    const filtro                = ref< string >("")
    dexieCategoriasProducto()
    const { categoriasProductos}= storeToRefs( useStoreDexie() )
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
