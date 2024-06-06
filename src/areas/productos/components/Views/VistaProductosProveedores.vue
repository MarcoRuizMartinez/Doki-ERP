<template>
  <ventana
    v-bind                    ="$attrs"
    class                     ="col-12"
    class-contenido           ="column items-center"
    height                    ="100%"
    size-icon-carga           ="22em"
    icono                     ="mdi-package-variant-closed"
    mensaje-sin-resultados    ="No se encontraron productos"
    mensaje-esperando         ="Busca los productos que necesites..."
    :modo                     ="modo"
    :titulo                   ="titulo"
    padding-contenido         ="0"
    :cargando                 ="loading.carga || loading.crear"
    >
    <template                 #barra-centro>      
      <tabs-busqueda/>
    </template>
    <template                 #menu>
      <barra-busqueda
        @buscar               ="buscar"
        @crear-filas          ="crearNuevasFilas"
      />
    </template>
    <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
    <div class                ="bg-grey-3 fit">
      <tabla-productos  />
    </div>
  </ventana>  
</template>
  
<script setup lang="ts">  
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watchEffect,
            computed,
            onMounted,
            onUnmounted         } from "vue"

  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreProducto    } from 'stores/producto'
  
  /////////////////////////////////////////////////////////////////////// Componibles
  import {  useTitle            } from "@vueuse/core"
  import {  useControlProductosProveedor
                                } from "src/areas/productos/controllers/ControlProductosProveedor"

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  TModosVentana       } from "src/models/TiposVarios"  

  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"    
  import    barraBusqueda         from "./../ProductosProveedor/BarraBusquedaProductosProveedor.vue"
  import    tabsBusqueda          from "./../ProductosProveedor/TabsBusquedaProductosProveedor.vue"
  import    tablaProductos        from "../ProductosProveedor/TablaProductosPro.vue"

  
  const { productosPro,
          loading               } = storeToRefs( useStoreProducto() )

  const { buscar,
          crearNuevasFilas,
          iniciar,
          desmontar
                                } = useControlProductosProveedor()
  const modo                      = ref< TModosVentana >("esperando-busqueda")

  onMounted   ( iniciar )
  onUnmounted ( desmontar )

  //* Titulo Ventana busqueda
  const titulo                    = computed(()=>
  {
    let title                     = ""
    const total                   = productosPro.value.length
    const labelP                  = total >= 2 ? "productos" : "producto"
    if(!!total)
      title                       = `Resultado: ${total} ${labelP} de proveedor`
    return title
  })  

  //* Titulo Pestaña navegador 
  watchEffect(()=>{
    const largo                   = productosPro.value.length
    const extra                   = !!largo ? ` (${largo}) ` : " "
    useTitle(`🔍${extra}Productos proveedor`)
    if(!!largo) modo.value        = "normal"
  })    


</script>