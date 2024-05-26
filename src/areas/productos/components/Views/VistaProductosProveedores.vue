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
    :cargando                 ="loading.carga"
    >
    <template                 #barra-centro>      
      <tabs-busqueda/>
    </template>
    <template                 #menu>
      <barra-busqueda
        @buscar               ="buscar"
        @limpiar              ="limpiarBusqueda"
      />
    </template>
    <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
    <div class                   ="bg-grey-3 fit">
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
  import {  useRouter           } from "vue-router"

  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreUser        } from 'stores/user'
  import {  useStoreProducto    } from 'stores/producto'
  import {  useStoreApp         } from 'stores/app'
  
//////////////////////////////////////////////////// Componibles
  import {  useTitle            } from "@vueuse/core"
  import {  servicesProductosPro} from "src/areas/productos/services/servicesProductosProveedor"

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  IQuery              } from "src/models/Busqueda"
  import {  TModosVentana       } from "src/models/TiposVarios"  

  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"    
  import    barraBusqueda         from "./../ProductosProveedor/BarraBusquedaProductosProveedor.vue"
  import    tabsBusqueda          from "./../ProductosProveedor/TabsBusquedaProductosProveedor.vue"
  import    tablaProductos        from "./../ProductosProveedor/TablaProductos.vue"

  // * ////////////////////////// Columnas
  const { buscarProductos       } = servicesProductosPro()
  const { usuario               } = storeToRefs( useStoreUser() )  
  const { productosPro,
          busquedaPro : b,
          loading,
                                } = storeToRefs( useStoreProducto() )    
  const { tabs                  } = storeToRefs( useStoreApp() )
  const router                    = useRouter()
  const modo                      = ref< TModosVentana >("esperando-busqueda")

  onMounted(  async ()=>
  {
    productosPro.value            = []    
    tabs.value.activa             = "tab_1"
    await b.value.montarBusqueda( usuario.value.id, router, false, true, 50 )
  })

  onUnmounted(()=>
  {
    productosPro.value            = []
    b.value.desmontarBusqueda()
  })

  async function buscar( query : IQuery )
  {
    modo.value                    = "normal"
    productosPro.value            = []        
    loading.value.carga           = true
    productosPro.value            = await buscarProductos( query )
    loading.value.carga           = false
  } 

  function limpiarBusqueda()
  {
    productosPro.value            = []
  }

  const titulo                    = computed(()=>
  {
    let title                     = ""
    const total                   = productosPro.value.length
    const labelP                  = total >= 2 ? "productos" : "producto"
    if(!!total)
      title                       = `Resultado: ${total} ${labelP} de proveedor`
    /* else
      title                       =   modo.value === "esperando-busqueda"
                                    ? "Buscar productos proveedor"
                                    : "Buscando productos proveedor..." */
    return title
  })  


  //* Titulo Pestaña navegador 
  watchEffect(()=>{
    const largo                   = productosPro.value.length
    const extra                   = !!largo ? ` (${largo}) ` : " "
    useTitle(`🔍${extra}Productos proveedor`)
  })    
</script>