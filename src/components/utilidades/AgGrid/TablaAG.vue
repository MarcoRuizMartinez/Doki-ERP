<template>
  <ag-grid-vue            
    style                         ="height: 1500px;"
    class                         ="ag-theme-quartz"
    :autoSizeStrategy
    :getRowId
    :columnTypes
    :rowData                      ="datos"
    :defaultColDef                ="columnasDefecto"
    :columnDefs                   ="columnas"
    :undo-redo-cell-editing       ="true"
    :undo-redo-cell-editing-limit ="10"
    :enable-range-selection       ="true"
    :enable-fill-handle           ="true"
    @cell-edit-request            ="console.log('cellEditRequest')"
    @cell-value-changed           ="eventoCambio"
    @grid-ready                   ="tablaLista"
    @displayed-columns-changed    ="cambioEnColumna"
    >
  </ag-grid-vue>
</template>
<script setup lang="ts">
//@grid-ready                   ="tablaLista"
  import    "ag-grid-community/styles/ag-grid.css"          // Mandatory CSS required by the grid
  import    "ag-grid-community/styles/ag-theme-quartz.css"  // Optional Theme applied to the grid

  // * ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref, watch            } from "vue"

  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp         } from 'stores/app'

  // * ///////////////////////////////////////////////////////////////////////////////// Componibles  
  import {  Format                } from "src/composables/useTools" 

  //* ///////////////////////////////////////////////////////////////////////////////// Ag Grid
  import {  AgGridVue             } from "ag-grid-vue3"       // Vue Data Grid Component
  import {  IniciarAG             } from "./InicioAG"
            IniciarAG()

  import {  GridReadyEvent,
            GridApi,
            ColumnState,
            CellValueChangedEvent,
            GetRowIdParams        } from "ag-grid-community";

  type TProps                     = { columnasDefecto : any, columnas : any[], autoSizeStrategy ?: any }
  const datos                     = defineModel<any[]>( { required: true })
  const getRowId                  = ref< any >( null )
  const gridApi                   = ref< GridApi >()
  const { vista                 } = storeToRefs( useStoreApp() )  

  defineProps<TProps>()

  function tablaLista( params : GridReadyEvent ){
    gridApi.value                 = params.api
  }


  function eventoCambio( event : CellValueChangedEvent ){
    //console.log("event: ", event.column.getColId());
  }

  const columnTypes = ref(
    {
      currency:
      { 
        valueFormatter  : Format.precioAG,
        cellClass       : "text-right",
      },
    }
  )

  function setId( key : string ){
    if(!key) return    
    getRowId.value                = ( params : GetRowIdParams ) => params.data[key];    
  }

  function setColumnas( cols : any[] ){    
    if(!cols.length) return
    gridApi.value?.setGridOption('columnDefs', cols);
  }


  function reiniciarVista(){
    gridApi.value?.resetColumnState();
  }  

  

  function aplicarVista( vista : any ){
    gridApi.value?.applyColumnState({ state: vista });
  }

  function cambioEnColumna(){
    console.log("cambioEnColumna: ");
    vista.value.vista         = getVista()
  }


  watch(vista, ()=>
    {
      const accion            = vista.value.accion
        
      if(accion               == "restaurar")
        reiniciarVista()
      else
        aplicarVista( vista.value.vista )
    },
    { deep: false }
  )

  
  function getVista() : ColumnState[] | void
  {
    const vista = gridApi.value?.getColumnState();
    if(!vista) return
    
    return vista
  }


  defineExpose({
    setId,
    setColumnas,
  })
/* 

    @columnEverythingChanged      ="console.log('columnEverythingChanged')"      
    @columnVisible                ="console.log('columnVisible')"
    @columnValueChanged           ="console.log('columnValueChanged')"
    @columnPivotChanged           ="console.log('columnPivotChanged')"
    @columnRowGroupChanged        ="console.log('columnRowGroupChanged')"
    @menuVisibleChanged           ="console.log('menuVisibleChanged')"
    @visibleChanged               ="console.log('visibleChanged')"
    @widthChanged                 ="console.log('widthChanged')"
    @movingChanged                ="console.log('movingChanged')"
    @leftChanged                  ="console.log('leftChanged')"
    @sortChanged                  ="console.log('sortChanged')"
    @filterActiveChanged          ="console.log('filterActiveChanged')"
    @columnPinned                 ="console.log('columnPinned')"                 
    @columnResized                ="console.log('columnResized')"                
    @columnMoved                  ="console.log('columnMoved')"                  
    @columnPivotModeChanged       ="console.log('columnPivotModeChanged')"
    @columnGroupOpened            ="console.log('columnGroupOpened')"            
    @newColumnsLoaded             ="console.log('newColumnsLoaded')"             
    @gridColumnsChanged           ="console.log('gridColumnsChanged')"           
    @virtualColumnsChanged        ="console.log('virtualColumnsChanged')"        
    @columnHeaderClicked          ="console.log('columnHeaderClicked')"          
    @columnHeaderContextMenu      ="console.log('columnHeaderContextMenu')"      
    @pivotMaxColumnsExceeded      ="console.log('pivotMaxColumnsExceeded')"       
     */
</script>