<template>
  <q-th>
    <q-btn                flat dense no-caps
      label               ="Filtrar"
      :icon               ="!busqueda.f.filtroTexto? 'mdi-filter' : 'mdi-filter-off'"
      :color              ="!busqueda.f.filtroTexto? 'grey-9'     : 'info'"
      padding             ="0"
      size                ="12px"
      >
      <q-popup-proxy
        v-model           ="popupOn"
        transition-show   ="jump-down"
        transition-hide   ="jump-up"
        >
        <div class        ="q-pa-lg filtro-panel bg-gris">
          <input-buscar   hundido clearable
            v-model       ="busqueda.f.filtroTexto"
            label         ="Filtrar.."
            icon          ="mdi-magnify"
            style         ="max-width: 240px;"
            @clear        ="()=> { busqueda.f.filtroTexto = ''; popupOn = false } "
          />
        </div>
      </q-popup-proxy>
    </q-btn>
  </q-th>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref                 } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreProducto    } from 'stores/producto'  
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos

  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    inputBuscar           from "components/utilidades/input/InputSimple.vue"

  const { busqueda          } = storeToRefs( useStoreProducto() )
  const popupOn               = ref < boolean >(false)
</script>
<style>
  .filtro-panel{
    border-top: solid 6px #27313d;
  }
</style>
