<template>
  <ag-grid-vue                    suppress-multi-range-selection suppress-clear-on-fill-reduction 
    :style                        ="estilo"
    style                         ="min-height: 800px;"
    class                         ="ag-theme-quartz"
    fill-handle-direction         ="y"
    :auto-size-strategy
    :get-row-id
    :column-types                 ="tiposColumnas"
    :data-type-definitions
    :row-class-rules
    :get-context-menu-items
    :group-default-expanded       ="-1"
    group-display-type            ="groupRows"
    row-group-panel-show          ="always"
    pivot-panel-show              ="onlyWhenPivoting" 
    :side-bar                     ="{ toolPanels: ['filters', 'columns'] } "
    :locale-text                  ="Spanish"
    :tooltip-show-delay           ="500"
    :row-data                     ="datos"
    :default-col-def              ="columnasDefecto"
    :column-defs                  ="columnas"
    :undo-redo-cell-editing       ="true"
    :undo-redo-cell-editing-limit ="10"
    :enable-range-selection       ="true"
    :enable-fill-handle           ="rangoActivo"
    @cell-value-changed           ="eventoCambio"
    @cell-edit-request            ="solicitudCambio"
    @grid-ready                   ="tablaLista"
    @displayed-columns-changed    ="cambioEnColumna"
    @sort-changed                 ="cambioEnColumna"
    >
  </ag-grid-vue>
</template>
<script setup lang="ts">
/*
single-click-edit
    row-group-panel-show          ="onlyWhenGrouping" // 'always' | 'onlyWhenGrouping' | 'never'
    pivot-panel-show              ="onlyWhenPivoting" // 'always' | 'onlyWhenPivoting' | 'never'
*/
  import    "ag-grid-community/styles/ag-grid.css"          // Mandatory CSS required by the grid
  import    "ag-grid-community/styles/ag-theme-quartz.css"  // Optional Theme applied to the grid

  // * ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,
            computed,
            watchEffect           } from "vue"

  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreApp           } from 'stores/app'

  // * ///////////////////////////////////////////////////////////////////////////////// Componibles  
  import {  ToolType              } from "src/composables/useTools" 

  //* ///////////////////////////////////////////////////////////////////////////////// Ag Grid
  import {  AgGridVue             } from "ag-grid-vue3"       // Vue Data Grid Component
  import {  IniciarAG,
            Spanish,
            TDatosEvento          } from "./AGTools"
            IniciarAG()

  import {  ColDef,
            GridReadyEvent,
            GridApi,
            ColTypeDef,
            ColumnState,
            MenuItemDef,            
            CellValueChangedEvent,
            CellEditRequestEvent,
            GetContextMenuItems,  
            GetRowIdParams        } from "ag-grid-community";

  type TProps                     = {
    columnas                      : any[]
    keyId                         : string
    autoSizeStrategy             ?: any
    rangoActivo                   : boolean
    rowClassRules                ?: any
    tiposColumnas                ?: ColTypeDef
    getContextMenuItems          ?: (string | MenuItemDef)[] | GetContextMenuItems
  }
  const { keyId,
          rangoActivo = false  }  = defineProps<TProps>()

  type TEmit                      = { edicionCelda : [ value : TDatosEvento<any> ] }
  const emit                      = defineEmits<TEmit>()          
  const datos                     = defineModel< any[] >( { required: true })
  const getRowId                  = ref< any >( null )
  const gridApi                   = ref< GridApi >()
  const { vista, filtro         } = storeToRefs( useStoreApp() )  


  watch(filtro, aplicarFiltroRapido)  
  watch(vista,  gestionarCambiosEnVista, { deep: false })

  const estilo                    = computed(()=>
  {
    const alturaHeader            = 210
    const alturaEnBlanco          = 300
    const alturaFila              = 64
    let altura                    = alturaHeader

    if(!datos.value.length)
      altura                      += alturaEnBlanco
    else
      altura                      += alturaFila * datos.value.length
    
    //altura  = 800;
    const style                   = `height: ${altura}px;`
    return style
  })

  const dataTypeDefinitions       = {
    object: {
      baseDataType    : "object",
      extendsDataType : "object",
      valueParser     : ( params : any ) => ({ name: params.newValue }),
      valueFormatter  : ( params : any ) => params.value == null ? "" : params.value.name,
    }
  }

  function tablaLista( params : GridReadyEvent ){
    gridApi.value                 = params.api
  }


  function eventoCambio( e : CellValueChangedEvent )
  {
    console.log("eventoCambio: ", e);
    //"rangeService" | "paste"
    const datosEvento  : TDatosEvento<any>= {
      campo     : ToolType.anyToStr( e.colDef.field ),
      data      : e.data,
      value     : e.value,
      index     : ToolType.anyToNum( e.rowIndex ),
      oldValue  : e.oldValue,
      source    : ToolType.keyStringValido( e, "source" ),
    }

    emit("edicionCelda", datosEvento)
  }

  function solicitudCambio( e : CellEditRequestEvent )
  {
    console.log( "solicitudCambio e", e)
  }


  function setId(){
    getRowId.value                = ( params : GetRowIdParams ) => {
      if(     "data" in params
          &&  typeof params.data === "object"
          &&  params.data       !== "null"
          &&  keyId in params.data 
        ) 
        return params.data[ keyId ] 
    }
  }

  /* async function setColumnas( cols : any[] ){
    if(!cols.length) return

    gridApi.value?.setGridOption('columnDefs', cols)
  } */


  async function refreshCells( force : boolean = true ){    
    gridApi.value?.refreshCells( { force } )
  }

  function reiniciarVista(){
    gridApi.value?.resetColumnState();
  }  

  function aplicarVista(){
    gridApi.value?.applyColumnState({ state: vista.value.vista,  applyOrder: true })
  }

  function cambioEnColumna(){
    vista.value.vista             = getVista()
  }

  /* function cargando( modo : "show" | "hide" )
  {
    if(modo === "show" )
      gridApi.value?.showLoadingOverlay();
    else
      gridApi.value?.hideOverlay();
  } */

  

  function gestionarCambiosEnVista()
  {
    const accion                  = vista.value.accion
      
    if(accion                     == "restaurar")
      reiniciarVista()
    else
      aplicarVista()
  }


  function limpiarFiltros() {
    gridApi.value?.setFilterModel(null)
    filtro.value                  = ""
  }

  function aplicarFiltroRapido() {
    gridApi.value?.setGridOption("quickFilterText", filtro.value)
  }

  function volverAOrdenar()
  {
    const colState                = gridApi.value?.getColumnState()
    const sortState               = colState?.filter ( s => s.sort != null ).map( s => { return { colId: s.colId, sort: s.sort, sortIndex: s.sortIndex } })
    if(sortState?.length          != 1) return    
    gridApi.value?.applyColumnState({ defaultState: { sort: null } })
    //gridApi.value?.applyColumnState({ state: sortState, defaultState: { sort: null } })
    gridApi.value?.applyColumnState({ state: [{ colId: sortState[0].colId, sort: sortState[0].sort }],  defaultState: { sort: null }, })
  }


  function getVista() : ColumnState[] | void
  {
    const vista = gridApi.value?.getColumnState()
    if(!vista) return
    
    return vista
  }

  watchEffect(()=>{
    if(!!datos.value.length){
      setId()  
    }
  })

  const columnasDefecto : ColDef = {
    filter                        : "agTextColumnFilter",
    enableCellChangeFlash         : true,  
    floatingFilter                : true,
    width                         : 150, 
    filterParams                  : { buttons: ['reset'], defaultToNothingSelected: true,},
    //enableRowGroup                : true,
    //enablePivot                   : true,
    //enableValue                   : true,    
  }


  defineExpose({
    refreshCells,
    limpiarFiltros,
    volverAOrdenar,
    gridApi,
  })
</script>

<style>
.ag-group-expanded > .ag-icon-tree-open, .ag-group-contracted > .ag-icon-tree-closed{
  color: white !important;
}
</style>