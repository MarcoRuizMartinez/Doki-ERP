<template>
  <q-th>
    <q-btn                flat dense no-caps
      label               ="Precio"
      :icon               ="filtro.preciosMaxOrMinValidos ? 'mdi-filter-off'  : 'mdi-filter'"
      :color              ="filtro.preciosMaxOrMinValidos ? 'info'            : 'grey-9'"
      padding             ="0"
      size                ="12px"
      >
      <q-popup-proxy
        v-model           ="popupOn"
        transition-show   ="jump-down"
        transition-hide   ="jump-up"
        >
        <div class        ="q-pa-sm filtro-panel bg-gris column items-center shadow-3">                            
          <input-number   hundido clearable
            v-model       ="filtro.precioMinimo"
            label         ="Precio mínimo"
            icon          ="mdi-currency-usd"
            class         ="q-mb-sm"
            style         ="max-width: 200px;"
            :paso         ="10000"
            :minimo       ="0"
            :maximo       ="filtro.precioMaximo"
          />
          <input-number   hundido clearable
            v-model       ="filtro.precioMaximo"
            label         ="Precio máximo"
            icon          ="mdi-currency-usd"
            style         ="max-width: 200px;"
            :paso         ="10000"
            :minimo       ="filtro.precioMinimo"
          />
          <q-btn          no-caps rounded flat
            label         ="Ordenar de menor a mayor"
            icon          ="mdi-order-numeric-ascending"
            @click        ="ordenar('<')"
          />
          <q-btn          no-caps rounded flat
            label         ="Ordenar de mayor a menor"
            icon          ="mdi-order-numeric-descending"
            @click        ="ordenar('>')"
          />
        </div>
      </q-popup-proxy>
    </q-btn>
  </q-th>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,
                                } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreProducto    } from 'src/stores/producto'  
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IProductoDoli       } from "src/areas/productos/models/ProductoDolibarr"  
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  sortArray,
            filterArrayMaxMin,
                                } from "src/useSimpleOk/useTools"  
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"

  const { filtro,
          productos,
          productosFil,
                            } = storeToRefs( useStoreProducto() )
  const popupOn               = ref < boolean >(false)

  function ordenar( tipo : "<" | ">" ) {
    productosFil.value        = sortArray(productosFil.value, "precio", tipo)
  }

  watch([ ()=> filtro.value.precioMinimo , ()=> filtro.value.precioMaximo], ([newMin, newMax]) =>{
    productosFil.value        = filterArrayMaxMin< IProductoDoli >( productos.value, newMin, newMax, "precio" )
  })
</script>
<style>
  .filtro-panel{
    border-top: solid 6px #27313d;
  }
</style>
