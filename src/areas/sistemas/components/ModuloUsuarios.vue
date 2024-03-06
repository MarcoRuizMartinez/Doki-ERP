<template>
  <ventana                      minimizar
    class-contenido             ="column items-center"
    titulo                      ="Usuarios"
    icono                       ="mdi-account-group"
    size-icon-carga             ="14em"
    padding-contenido           ="0"
    :cargando                   ="!usuarios.length"
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
      :rows                     ="usuarios"
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
  import {  dexieUsuarios         } from "src/composables/useDexie"

  //* ///////////////////////////////////////////////////////////////////////////// Modelos
  import {  IColumna,     
            Columna               } from "src/models/Tabla"

  //* ///////////////////////////////////////////////////////////////////////////// Componentes 
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    inputBuscar             from "components/utilidades/input/InputSimple.vue"

  const filtro                = ref< string >("")
  dexieUsuarios()
  const { usuarios }          = storeToRefs( useStoreDexie() )
  const columnas: IColumna[]  = [
                                  new Columna({ name: "id"}),
                                  new Columna({ name: "nombreCompleto",   label: "Usuario" }),
                                  new Columna({ name: "area"}),
                                  new Columna({ name: "estado"}),
                                  new Columna({ name: "gruposString",     label: "Grupos"}),
                                  new Columna({ name: "terceroIdCtz",     label: "tercero"}),
                                  new Columna({ name: "reglaComisionId",  label: "regla"}),
                                ]
</script>
