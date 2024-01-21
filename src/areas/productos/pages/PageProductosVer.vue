<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  toRefs,
            onMounted,
                                  } from "vue"
  import {  useTitle              } from "@vueuse/core"      
  import {  useRouter             } from 'vue-router'                                   
  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'    
  import {  useStoreUser          } from 'src/stores/user'    
  import {  useStoreProducto      } from 'src/stores/producto'
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
  onMounted   ( iniciar )  

  async function iniciar()
  {
    loading.value.carga       = true
    const pro                 = await buscarProducto( id.value )
    if(!!pro){
      producto.value          = pro
      useTitle(`📦 ${producto.value.ref} - ${producto.value.nombre}`)
      buscarComentarios()
    }
    else{
      aviso("negative", "Error con la URL. Por favor verifique que este bien.", "account", 3000)
      router.push("/error") 
    }

    loading.value.carga       = false
  }

  async function buscarComentarios()
  {
    const query     = {
      codigo        : "AC_OTH",
      elementoId    : producto.value.id,
      elementoTipo  : "product"
    }
    
    loading.value.commentsLoad  = true
    producto.value.comentarios  = await buscarAcciones( query, "comentarios" )
    loading.value.commentsLoad  = false
  }
</script>

<template>
  <q-page padding     class  ="row items-stretch content-start justify-start q-col-gutter-md">
    <vista-producto  v-bind  ="props" />
    <comentarios
      v-model             ="producto.comentarios"
      tipo                ="product"
      :elemento-id        ="producto.id"
      :funcion-buscar     ="buscarComentarios"
      :asignado           ="usuario"
      :cargando           ="loading?.commentsLoad ?? false"
    />
  </q-page>
</template>