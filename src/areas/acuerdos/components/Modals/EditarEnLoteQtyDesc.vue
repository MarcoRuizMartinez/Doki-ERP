<template>
  <ventana                  cerrar
    :titulo                 ="grupoElegido.seleccion.length + ' producto' + ( grupoElegido.seleccion.length == 1 ? '' : 's'  )"
    icono                   ="mdi-package-variant-closed"
    :width                  ="310"
    :cargando               ="loading.editarLote"
    class-contenido         ="column gap-sm"
    >
    <!-- //* ////////////////////////////////////////////////////////////// Cantidad -->
    <input-number           con-decimales
      v-model               ="cantidad"
      label                 ="Cantidad"
      icon                  ="mdi-counter"
      class                 ="full-width"
      :paso                 ="1"
      :minimo               ="0.1"
      :maximo               ="1000"
    />
    <div class              ="full-width row">
      <!-- //* //////////////////////////////////////////////////////////// Descuento -->
      <input-number         con-decimales
        v-model             ="descuento"
        label               ="Descuento"
        icon                ="mdi-percent-outline"
        tipo                ="porcentaje"
        class               ="col-8"
        :paso               ="0.1"
        :minimo             ="0"
        :maximo             ="100"
      />
      <!-- //* //////////////////////////////////////////////////////////// Sumar descuento al descuento actual -->
      <q-toggle
        v-model             ="addDescuento"
        label               ="Sumar"
        class               ="col">
        <Tooltip label      ="Sumar descuento sobre descuento"/>
      </q-toggle>
    </div>
    <!-- //* //////////////////////////////////////////////////////////////// Boton Editar -->
    <q-btn                  push glossy
      label                 ="Editar"
      color                 ="positive"
      class                 ="full-width"
      :disable              ="!cantidad && !descuento"
      @click                ="editar"
    />
  </ventana>
</template>

<script setup lang="ts">
  /* ////////////////////////////////////////////////////////////////////////// Core */
  import {  ref                 } from "vue"
  /* ////////////////////////////////////////////////////////////////////////// Store */
  import {  storeToRefs         } from 'pinia'
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'            
  /* ////////////////////////////////////////////////////////////////////////// Controles */
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  /* ////////////////////////////////////////////////////////////////////////// Componentes */
  import    ventana               from "components/utilidades/Ventana.vue"
  import    inputNumber           from "src/components/utilidades/input/InputFormNumber.vue"  

  const { editarEnLoteQtyYDescu}= useControlProductos()  

  const storeAcuerdo            = useStoreAcuerdo()
  const { grupoElegido,          
          loading             } = storeToRefs(storeAcuerdo)  

  const descuento               = ref < number >()
  const cantidad                = ref < number >()
  const addDescuento            = ref < boolean >(false)
  
  function editar()  {
    editarEnLoteQtyYDescu(cantidad.value, descuento.value, addDescuento.value)
  }
</script>