<template>
  <q-page padding     class  ="row items-stretch content-start justify-start q-col-gutter-md">
    

  </q-page>
</template>


<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            toRefs,
            onMounted,
                                  } from "vue"
  import {  useTitle              } from "@vueuse/core"      
  import {  useRouter             } from 'vue-router'                                   
  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'    
  import {  useStoreProducto      } from 'stores/producto'
  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesProductos     } from "src/areas/productos/services/servicesProductos"
  import {  useTools              } from "src/composables/useTools"
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component

  const router                = useRouter()
  const { aviso             } = useTools()  
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


  onMounted   ( iniciar )  

  async function iniciar()
  {
  }
</script>

