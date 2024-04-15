<template>
  <q-page padding     class ="row items-stretch content-start justify-start q-col-gutter-md">
    Hola
  </q-page>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  toRefs,
            watch,
            onMounted,
                                  } from "vue"
  import {  useTitle              } from "@vueuse/core"      
  import {  useRouter             } from 'vue-router'                                   
  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'    
  import {  useStoreUser          } from 'stores/user'    
  import {  useStoreProducto      } from 'stores/producto'
  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesProductos     } from "src/areas/productos/services/servicesProductos"
  import {  useControlComunicacion} from "src/areas/comunicacion/controllers/ControlComunicacion"
  import {  useTools              } from "src/composables/useTools"
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    vistaProducto           from "src/areas/productos/components/Views/VistaProductoVer.vue"
  import    comentarios             from "src/areas/comunicacion/components/ModuloComentarios.vue"

  const router                = useRouter()
  const { aviso             } = useTools()  
  const { buscarProducto    } = servicesProductos()  
  const { buscarAcciones    } = useControlComunicacion()
  const props                 = defineProps({
    id:   { required: true, type: String }      
  })

  const { id }                = toRefs( props )
  const { producto,
          loading           } = storeToRefs( useStoreProducto() )  
  const { usuario           } = storeToRefs( useStoreUser() )                                            
  

</script>