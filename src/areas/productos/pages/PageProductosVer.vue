<template>
    <q-page padding     class  ="row items-stretch content-start justify-start q-col-gutter-md">
      <vista-producto  v-bind  ="props" />
    </q-page>
  </template>
  
  <script setup lang="ts">
    // * /////////////////////////////////////////////////////////////////////// Core
    import {  toRefs,
              onMounted,
                                    } from "vue"
    import {  useTitle              } from "@vueuse/core"                                         
    //* ///////////////////////////////////////////////////////////////////////////////// Store
    import {  storeToRefs           } from 'pinia'    
    import {  useStoreProducto      } from 'src/stores/producto'
    //* ///////////////////////////////////////////////////////////////////////////////// Componibles
    import {  useControlProductos   } from "src/areas/productos/controllers/ControlProductosDolibarr"
    //* ///////////////////////////////////////////////////////////////////////////////// Componentes
    import    vistaProducto           from "src/areas/productos/components/Views/VistaProductoVer.vue"

  
    const props                 = defineProps({
      id:   { required: true, type: String }      
    })
  
    const { id }                = toRefs( props )
    const { producto,
            loading
                              } = storeToRefs( useStoreProducto() )

    const { buscarProducto } = useControlProductos()
  
    onMounted   ( iniciar )  
  
    async function iniciar()
    {
      await buscarProducto( id.value )
      useTitle(`📦 ${producto.value.ref} - ${producto.value.nombre}`)
    }
  </script>