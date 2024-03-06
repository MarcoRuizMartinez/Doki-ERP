<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core

  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreAcuerdo     } from 'stores/acuerdo'
  import {  useStoreProducto    } from 'stores/producto'

  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  ILineaAcuerdo       } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  IProductoDoli       } from "src/areas/productos/models/ProductoDolibarr"

// * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"

  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    busquedaProductos     from "src/areas/productos/components/Busqueda/BusquedaYAgregarProductos.vue"

  const { agregarProductos,
          borrarLineas      } = useControlProductos()

  const { productos         } = storeToRefs( useStoreProducto() )
  const { grupoElegido,
          modales,
          loading           } = storeToRefs( useStoreAcuerdo() )


  async function agregarProductosAControl( productoAdd : IProductoDoli[], cantidad : number  )
  {
    await agregarProductos(productoAdd, cantidad) 
    buscarSiProductosEstanEnGrupo()
  }

  function buscarSiProductosEstanEnGrupo(){
    productos.value.forEach( p => {
      p.elegido = grupoElegido.value.productos.some( pg => p.ref == pg.ref )
    })
  }

  async function eliminarLineaDesdeBusqueda( idProducto : number  )
  {
    grupoElegido.value.seleccion  = grupoElegido.value.productos.filter( ( p : ILineaAcuerdo ) => p.id === idProducto)
    if(!!grupoElegido.value.seleccion.length){
      borrarLineas( 200 )
    }
  }

  function cerrar(){
    modales.value.añadirProductos  = false
  }
</script>

<template>
  <busqueda-productos 
    :loading          ="loading.añadir || loading.borrarLote"
    @productos-add    ="agregarProductosAControl"
    @busqueda-ok      ="buscarSiProductosEstanEnGrupo"
    @borrar           ="eliminarLineaDesdeBusqueda"
    @cerrar           ="cerrar"
  />
</template>
