<template>
  <tablaAg
    v-model             ="productosPro"
    :ref                ="VISTAS_AG.PRODUCTOS_PROVEEDORES"
    :columnas
    :columnas-defecto
    :auto-size-strategy
  />
</template>

<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,
            watchEffect,
            onMounted,
                                } from "vue"

  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp         } from 'stores/app'
  import {  useStoreProducto    } from 'stores/producto'

  // * ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  VISTAS_AG           } from "components/utilidades/AgGrid/VistaAG"
  import {  columnasBase        } from "./Columnas"

  // * ///////////////////////////////////////////////////////////////////////////////// Componentes  
  import imagen                   from "components/utilidades/AgGrid/ImagenProducto.vue"
  import tablaAg                  from "components/utilidades/AgGrid/TablaAG.vue"
  import { IColAg               } from "components/utilidades/AgGrid/ColumnasAG"
  
  const { productosPro,
          busquedaPro : b,
          loading,
                                } = storeToRefs( useStoreProducto() )                           
  const AGProProvee               = ref< InstanceType<typeof tablaAg> | null>(null)
  
  const columnas                  = ref<IColAg[]>([])
  const columnasDefecto           = ref({
    filter                        : "agTextColumnFilter",
    enableCellChangeFlash         : true,  
    floatingFilter                : true,
  })

  const autoSizeStrategy          = ref({
    type                          : 'fitCellContents', // fitProvidedWidth fitGridWidth
    defaultMinWidth               : 200,
    columnLimits                  : [
      {
        colId                     : 'ref',
        minWidth                  : 900
      }
    ]
  })

  onMounted(()=>{
    if(!columnas.value.length){}
      columnas.value              = columnasBase.filter( c => c.visible ).map( c => c.api )
  })

  //cellRenderer: ( params: any ) => { return 'Value is <b>' + params.value + '</b>'; },      
  watchEffect(()=>{
    if(!!productosPro.value.length)
      AGProProvee.value?.setId( "id" )
  })


  watch(columnas, ()=>{
    if(!!columnas.value.length)
      AGProProvee.value?.setColumnas( columnas.value )
  },
  { deep: true}
  )
</script>


<style>
  .clase-test{
    background-color: #e4e4e4;
    border: 1px solid #e4e4e4;
    display: inline-block;
    vertical-align: text-top;  
  }
</style>