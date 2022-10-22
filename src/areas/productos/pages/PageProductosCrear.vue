<template>
  <q-page padding class         ="row item-stretch content-start justify-center">
    <formulario
      tipo                      ="crear"
      class                     ="col-12 col-md-6"
      @creado                   ="productoCreado"
    />
  </q-page>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  onMounted       } from "vue"  
  import {  useRouter       } from "vue-router"
  import {  useTitle        } from "@vueuse/core"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreUser        } from 'src/stores/user'
  import {  useStoreProducto    } from 'src/stores/producto'  
  import {  ProductoDoli,
            IProductoDoli       } from "src/areas/productos/models/ProductoDolibarr"
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    formulario              from "src/areas/productos/components/FormularioProducto.vue"
  useTitle("📦 Crear producto")

  const { producto              } = storeToRefs( useStoreProducto() )  

  const router                    = useRouter()
  onMounted(()=>{
    producto.value                = new ProductoDoli()
  })

  function productoCreado( pro : IProductoDoli )
  { 
    router.push(`/productos/${pro.id}`)
  }

</script>