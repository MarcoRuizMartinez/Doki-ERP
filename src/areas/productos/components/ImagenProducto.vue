<template>
  <ventana
    class-contenido             ="column items-center"
    icono                       ="mdi-image"
    titulo                      ="Imagen"
    padding-contenido           ="0"
    :cargando                   ="loading.carga"
    >
    <q-img
      :src                      ="producto.imagen"
      class                     ="cursor-pointer"
      @click                    ="ventanaImagen = true"
    />
    <visor-imagen
      v-model:visible           ="ventanaImagen"
      :src                      ="producto.imagen"
      :ratio                    ="''"
      :titulo                   ="producto.nombre"
    />    
  </ventana>
</template>

<script setup lang="ts">
  import {  ref,
                            } from "vue"
  import {  storeToRefs     } from "pinia"
  import {  useStoreProducto} from "src/stores/producto"
  import    ventana           from "components/utilidades/Ventana.vue"
  import    visorImagen       from "components/utilidades/VisorImagen.vue"

  const ventanaImagen         = ref< boolean    >(false)

  const { producto,
          loading           } = storeToRefs( useStoreProducto() )
</script>