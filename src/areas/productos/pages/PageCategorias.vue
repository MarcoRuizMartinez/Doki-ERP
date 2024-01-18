<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  toRefs,
            onMounted,
                                  } from "vue"
  import {  useTitle              } from "@vueuse/core"      
  import {  useRouter             } from 'vue-router'                                   
  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'    
  import {  useStoreProducto      } from 'src/stores/producto'
  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesProductos     } from "src/areas/productos/services/servicesProductos"
  import {  useTools              } from "src/composables/useTools"
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    vistaProducto           from "src/areas/productos/components/Views/VistaProductoVer.vue"

  const router                = useRouter()
  const { aviso             } = useTools()  
  const { buscarProducto    } = servicesProductos()  
  const props                 = defineProps({
    id:   { required: true, type: String }      
  })

  const { id }                = toRefs( props )
  const { producto,
          loading
                            } = storeToRefs( useStoreProducto() )  
  onMounted   ( iniciar )  

  async function iniciar()
  {
    loading.value.carga       = true
    const pro                 = await buscarProducto( id.value )
    if(!!pro){
      producto.value          = pro
      useTitle(`📦 ${producto.value.ref} - ${producto.value.nombre}`)
    }
    else{
      aviso("negative", "Error con la URL. Por favor verifique que este bien.", "account", 3000)
      router.push("/error") 
    }

    loading.value.carga       = false
  }
</script>

<template>
  <q-page padding     class  ="row items-stretch content-start justify-start q-col-gutter-md">
    <vista-producto  v-bind  ="props" />
  </q-page>
</template>
