<template>
  <ventana
    v-bind                    ="$attrs"
    class                     ="col-12"
    class-contenido           ="column items-center"
    height                    ="100%"
    size-icon-carga           ="22em"
    icono                     ="mdi-package-variant-closed"
    mensaje-sin-resultados    ="No se encontraron productos"
    :modo                     ="modo"
    :titulo                   ="titulo"
    :padding-contenido        ="modo === 'normal' ? '0' : '12px'"
    >
    <template                 #menu>
      <barra-busqueda
        @buscar               ="buscar"
        @limpiar              ="limpiarBusqueda"
      />
    </template>
    <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
    <div  class               ="bg-grey-3 fit">
      <ag-grid-vue
        style                 ="height: 500px"
        class                 ="ag-theme-quartz"
        :rowData              ="rowData"    
        :columnDefs           ="colDefs"
      >
      </ag-grid-vue>
    </div>
  </ventana>
</template>
  
<script setup lang="ts">  
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            computed,
            onMounted,
            onUnmounted         } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreUser        } from 'stores/user'
  import {  useStoreProducto    } from 'stores/producto'
  //* ///////////////////////////////////////////////////////////////////////////////// Ag Grid
  import    "ag-grid-community/styles/ag-grid.css"          // Mandatory CSS required by the grid
  import    "ag-grid-community/styles/ag-theme-quartz.css"  // Optional Theme applied to the grid
  import {  AgGridVue           } from "ag-grid-vue3"       // Vue Data Grid Component


  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesProductos   } from "src/areas/productos/services/servicesProductos"
  import {  useTools            } from "src/composables/useTools"
  import {  style               } from "src/composables/useEstilos"            
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  BusquedaProducto,
            IQueryProducto      } from "src/areas/productos/models/BusquedaProductos"
  import {  TModosVentana       } from "src/models/TiposVarios"  
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"  
  import    barraBusqueda         from "src/areas/productos/components/Busqueda/BarraBusquedaProductosProveedor.vue"


  // * ////////////////////////// Columnas
  const { buscarProductos       } = servicesProductos()
  const { usuario, permisos     } = storeToRefs( useStoreUser() )  
  const { producto,
          productos,
          productosFil,
          busqueda,
          loading,
          seleccion,
                                } = storeToRefs( useStoreProducto() )  
  const { esMobil, aviso        } = useTools()
  
  const modo                      = ref< TModosVentana >("normal")  
  const titulo                    = computed(()=>
  {
    return productos.value.length > 0 ? `Resultado: ${productos.value.length} ` +
                                      ( productos.value.length === 1 ? "producto" : "productos" )
                                    : modo.value === "esperando-busqueda" ?  "Buscar productos" : `Buscando productos...`
  })


  //const comColumnas               = ref< InstanceType<typeof selectColumnas> | null>(null)
  const rowData = ref([
   { make: "Tesla", model: "Model Y", price: 64950, electric: true },
   { make: "Ford", model: "F-Series", price: 33850, electric: false },
   { make: "Toyota", model: "Corolla", price: 29600, electric: false },
 ]);

 // Column Definitions: Defines the columns to be displayed.
 const colDefs = ref([
   { field: "make" },
   { field: "model" },
   { field: "price" },
   { field: "electric" }
 ]);

  onMounted(()=>{
    productos.value               = []
  })

  onUnmounted(()=>{
    productos.value               = []
    busqueda.value                = new BusquedaProducto()
  })  

  async function buscar( query : IQueryProducto )
  {
    productos.value               = []
    seleccion.value               = []
    modo.value                    = "buscando"
    productos.value               = await buscarProductos( query )
    productosFil.value            = productos.value
    modo.value                    = !!productos.value.length ? "normal" : "sin-resultados"
  }

  function limpiarBusqueda()
  {
    modo.value                    = "esperando-busqueda"
    productos.value               = []
    seleccion.value               = []
  }

</script>