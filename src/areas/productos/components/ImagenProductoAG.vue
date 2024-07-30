<template>
  <div>
    <imagen-producto
      v-if        ="!productoACrear"
      size        ="xs"
      :imagen
      :nombre
    />
    <q-icon
      v-else
      :color      ="sePuedeCrear ? 'light-green-10'   : 'yellow-10'"
      :name       ="sePuedeCrear ? 'mdi-check-circle' : 'mdi-alert-octagon'"
      size        ="md"
    />
  </div>
</template>
  
<script setup lang="ts">
  //* ////////////////////////////////////////////////////////////////////////// Core
  import {  ref, 
            onMounted
                                } from "vue"
  import    imagenProducto        from "src/areas/productos/components/Tools/ImagenProducto.vue"
  import {  IImagenProducto,
            ImagenProducto      } from "src/areas/productos/models/ImagenProducto"

  const nombre          = ref<string>("")
  const imagen          = ref<IImagenProducto>( new ImagenProducto() )
  const productoACrear  = ref<boolean>( false )
  const sePuedeCrear    = ref<boolean>( false )

  type TProps                       = { params : any }
  const { params }                 = defineProps<TProps>()  

  onMounted(()=>{
    nombre.value          = params.data?.nombre ?? ""
    imagen.value          = Object.assign( new ImagenProducto(), params.value )
    productoACrear.value  = params.data?.esNuevo ?? false
    sePuedeCrear.value    = params.data?.sePuedeCrear ?? false
  })
</script>