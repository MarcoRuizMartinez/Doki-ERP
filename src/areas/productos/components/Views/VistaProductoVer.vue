<script setup lang="ts">
  //* ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            provide
                                  } from "vue"
  import {  useTitle              } from "@vueuse/core"
  
  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreProducto      } from 'src/stores/producto'
  import {  useStoreUser          } from 'src/stores/user'

  //* ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IArchivo              } from "src/models/Archivo"
  import {  IProductoDoli } from '../../models/ProductoDolibarr';

  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlProductos   } from "src/areas/productos/controllers/ControlProductosDolibarr"

  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    titulo                  from "src/areas/productos/components/Titulo.vue"
  import    imagen                  from "src/areas/productos/components/ImagenProducto.vue"
  import    formulario              from "src/areas/productos/components/FormularioProducto.vue"
  import    productoCompuesto       from "src/areas/productos/components/ProductoCompuesto/ProductoCompuesto.vue"
  import    documentos              from "components/archivos/ModuloArchivos.vue"
  
  const { editarURL         } = useControlProductos()  
  const { producto,
          loading           } = storeToRefs( useStoreProducto() )
  const { usuario           } = storeToRefs( useStoreUser() )
  const minimizadoTodo        = ref< boolean >(false)
    
  const props                 = defineProps({
    id:   { required: true, type: String }
  })

  provide('superminimizado', minimizadoTodo)

  async function cargarProductos( archivos : IArchivo[] )
  {
    if(archivos[0].tipo       === "Imagen")
    {
      const url               = archivos[0].url
      const ok                = await editarURL( url )
      if(ok)
        producto.value.img.url= url
    }    
  }

  function productoEditado( prod : IProductoDoli )
  {
    producto.value =  prod
  }
</script>

<template>
  <titulo
    class               ="col-12"
  />
  <formulario
    class               ="col-md-6 col-12"
    @editado            ="productoEditado"
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
    @subida-ok          ="cargarProductos"
  />
  <producto-compuesto
    v-if                ="(usuario.esProduccion || usuario.esGerencia) && producto.naturaleza.esCompuesto_o_Kit"
    class               ="col-12 col-md-6"
  />
</template>