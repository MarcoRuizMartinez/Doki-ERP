<template>
  <ventana
    class-contenido             ="column items-center"
    titulo                      ="Composición de producto"
    icono                       ="mdi-focus-field"
    padding-contenido           ="0"
    :cargando                   ="loading.carga"
    >
    <template
      v-for="(pro, index) of productos"
      :key = "pro.ref"
      >
      <div>{{ pro.nombre }}</div>

    </template>
  </ventana>
</template>
  
  <script setup lang="ts">
    import {  ref,
              onMounted
                                } from "vue"
    import {  storeToRefs       } from "pinia"
    import {  useStoreProducto  } from "src/stores/producto"
    import    ventana             from "components/utilidades/Ventana.vue"
    import {  servicesProductos } from "src/areas/productos/services/servicesProductos"
    import {  ProductoHijo      } from '../models/ProductoHijo';
  
    const { producto,
            loading               } = storeToRefs( useStoreProducto() )

    const { buscarProductosHijos  } = servicesProductos()

    const productos                 = ref<ProductoHijo[]>([])

    onMounted( async ()=>{
      await cargarHijos()
    })

    async function cargarHijos()
    {
      productos.value                 = await buscarProductosHijos( producto.value.id )
      console.log("productos: ", productos);
    }
  </script>