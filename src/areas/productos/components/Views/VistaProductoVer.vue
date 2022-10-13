<template>
  <titulo
    class               ="col-12"
  />
  <formulario
    class               ="col-md-6 col-12"
  />
  <imagen
    class               ="col-md-3 col-12"
  />
  <documentos
    class               ="col-md-3 col-12"
    height-card-min     ="164px"
    modulo              ="product"
    :modulo-id          ="producto.id ?? 0"
    :modulo-ref         ="producto.ref"
    :puede-editar       ="true"
  />
</template>

<script setup lang="ts">
  //* ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,
            //toRefs,
            provide,
            PropType,
                                  } from "vue"
  import {  useTitle              } from "@vueuse/core"                                  
  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'    
  import {  useStoreProducto      } from 'src/stores/producto'
  //* ///////////////////////////////////////////////////////////////////////////////// Modelos

  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    titulo                  from "src/areas/productos/components/Titulo.vue"
  import    imagen                  from "src/areas/productos/components/ImagenProducto.vue"
  import    formulario              from "src/areas/productos/components/FormularioProducto.vue"
  import    documentos              from "components/archivos/ModuloArchivos.vue"

  const { producto,
          loading
                            } = storeToRefs( useStoreProducto() )                                
  const minimizadoTodo        = ref< boolean  >(false)

  const props                 = defineProps({
    id:   { required: true, type: String }
  })

  /* watch ( [()=>acuerdo.value.id, ()=>acuerdo.value.tipo],
          ()=> useTitle(`${acuerdo.value.emoji} ${acuerdo.value.title}`)
        ) */

  provide('superminimizado', minimizadoTodo)
</script>