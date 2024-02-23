<template>
  <ventana
    class-contenido             ="column items-center"
    icono                       ="mdi-image"
    titulo                      ="Imagen"
    padding-contenido           ="0"
    :cargando                   ="loading.carga"
    >
    <q-img
      :src                      ="producto.img.img_300px"
      class                     ="cursor-pointer"
      @click                    ="ventanaImagen = true"
    />
    <visor-imagen
      v-model:visible           ="ventanaImagen"
      :src                      ="producto.img.img_full"
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