<template>
  <ventana
    class-contenido             ="column items-center"
    icono                       ="mdi-image"
    titulo                      ="Imagen"
    padding-contenido           ="0"
    :cargando                   ="loading.carga"
    >
    <q-img
      :src ="producto.imagen"
    />
  </ventana>
</template>

<script setup lang="ts">
  import {  ref,
            toRefs,
            computed,
            PropType,
            onMounted,
            watch
                            } from "vue"
  import {  storeToRefs     } from "pinia"
  import {  useStoreProducto} from "src/stores/producto"
  import    ventana           from "components/utilidades/Ventana.vue"

  const { producto,
          loading           } = storeToRefs( useStoreProducto() )
</script>