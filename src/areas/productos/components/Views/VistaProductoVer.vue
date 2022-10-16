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
    @load               ="cargarProductos"
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
  import {  IArchivo,
            Archivo               } from "src/models/Archivo"
  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlProductos   } from "src/areas/productos/controllers/ControlProductosDolibarr"
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    titulo                  from "src/areas/productos/components/Titulo.vue"
  import    imagen                  from "src/areas/productos/components/ImagenProducto.vue"
  import    formulario              from "src/areas/productos/components/FormularioProducto.vue"
  import    documentos              from "components/archivos/ModuloArchivos.vue"

  const { editarURL         
                            } = useControlProductos()  
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

  async function cargarProductos( archivos : IArchivo[] )
  {
    if(archivos[0].tipo       === "Imagen")
    {
      const url               = archivos[0].url
      const ok                = await editarURL( url )
      if(ok)
        producto.value.imagen = url
    }

    
  }
</script>