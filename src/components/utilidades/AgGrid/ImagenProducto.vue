<template>
  <imagen-producto    
    size    ="xs"
    :imagen
    :nombre
  />  
</template>
  
<script setup lang="ts">
  //* ////////////////////////////////////////////////////////////////////////// Core
  import {  ref, 
            onMounted
                                } from "vue"
  import    imagenProducto        from "src/areas/productos/components/Tools/ImagenProducto.vue"
  import {  IImagenProducto,
            ImagenProducto      } from "src/areas/productos/models/ImagenProducto"

  const nombre  = ref<boolean>(false)
  const imagen  = ref<IImagenProducto>( new ImagenProducto() )

  type TProps                       = { params : any }
  const { params }                 = defineProps<TProps>()  

  onMounted(()=>{
    nombre.value  = params.data.nombre
    imagen.value  = Object.assign( new ImagenProducto(), params.value )
  })
</script>