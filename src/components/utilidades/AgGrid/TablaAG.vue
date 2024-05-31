<template>                        
  <ag-grid-vue                    suppress-multi-range-selection suppress-clear-on-fill-reduction 
    :style                        ="estilo"
    style                         ="min-height: 800px;"
    class                         ="ag-theme-quartz"
    fill-handle-direction         ="y"
    :auto-size-strategy
    :get-row-id
    :column-types
    :data-type-definitions
    :row-class-rules
    row-group-panel-show          ="onlyWhenGrouping"
    pivot-panel-show              ="onlyWhenPivoting" 
    :side-bar                     ="{ toolPanels: ['filters', 'columns'] } "
    :locale-text                  ="Spanish"
    :tooltip-show-delay           ="500"
    :row-data                     ="datos"
    :default-col-def              ="columnasDefecto"
    :column-defs                  ="columnas"
    :undo-redo-cell-editing       ="true"
    :undo-redo-cell-editing-limit ="10"
    :enable-range-selection       ="rangoActivo"
    :enable-fill-handle           ="rangoActivo"
    @cell-value-changed           ="eventoCambio"
    @grid-ready                   ="tablaLista"
    @displayed-columns-changed    ="cambioEnColumna"
    @sort-changed                 ="cambioEnColumna"
    @cell-double-clicked          ="console.log('Doble click')"
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
  import {  useStoreApp,
            EVENTOS               } from 'stores/app'

  // * ///////////////////////////////////////////////////////////////////////////////// Componibles  
  import {  Format, ToolType      } from "src/composables/useTools" 

  //* ///////////////////////////////////////////////////////////////////////////////// Ag Grid
  import {  AgGridVue             } from "ag-grid-vue3"       // Vue Data Grid Component
  import {  IniciarAG,
            Spanish,
            TDatosEvento          } from "./AGTools"
            IniciarAG()

  import {  GridReadyEvent,
            GridApi,
            ColumnState,
            CellValueChangedEvent,
            GetRowIdParams        } from "ag-grid-community";

  type TProps                     = {
    columnasDefecto               : any
    columnas                      : any[]
    keyId                         : string
    autoSizeStrategy             ?: any
    rangoActivo                   : boolean
    rowClassRules                ?: any
  }
  const { keyId,
          rangoActivo = false  }  = defineProps<TProps>()

  type TEmit                      = { edicionCelda : [ value : TDatosEvento ] }
  const emit                      = defineEmits<TEmit>()          
  const datos                     = defineModel< any[] >( { required: true })
  const getRowId                  = ref< any >( null )
  const gridApi                   = ref< GridApi >()
  const { vista, filtro, evento } = storeToRefs( useStoreApp() )  


  watch(filtro, aplicarFiltroRapido)
  watch(evento, gestionarEventos)
  watch(vista,  gestionarCambiosEnVista, { deep: false })

  const estilo                    = computed(()=>
  {
    const alturaHeader            = 210
    const alturaEnBlanco          = 300
    const alturaFila              = 41
    let altura                    = alturaHeader

    if(!datos.value.length)
      altura                      += alturaEnBlanco
    else
      altura                      += alturaFila * datos.value.length
    
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
    const datosEvento  : TDatosEvento = {
      campo     : ToolType.anyToStr( e.colDef.field ),
      data      : e.data,
      value     : e.value,
      index     : ToolType.anyToNum( e.rowIndex ),
      oldValue  : e.oldValue,
    }

    emit("edicionCelda", datosEvento)
  }

  const columnTypes = ref(
    {
      moneda:
      { 
        valueFormatter  : Format.precioAG,
        cellClass       : "text-right",
      },
      numero:
      {
        cellClass       : "text-right",
      },
      editable:
      {
        editable: ( p : any) => {
          const hayData     = ToolType.existeYEsValido( p,      "data" )
          const hayEditable = ToolType.existeYEsValido( p.data, "editable" )
          return hayData && hayEditable ? p.data.editable : false
        }
      },
      creacion:
      {
        editable: ( p : any) => {
          const hayData     = ToolType.existeYEsValido( p,      "data" )
          const hayEsNuevo  = ToolType.existeYEsValido( p.data, "esNuevo" )          
          return hayData && hayEsNuevo ? p.data.esNuevo : false
        }
      },
      editarYCrear:
      {
        editable: ( p : any) => {
          const hayData     = ToolType.existeYEsValido( p,      "data" )
          const hayEsNuevo  = ToolType.existeYEsValido( p.data, "esNuevo" )
          const hayEditable = ToolType.existeYEsValido( p.data, "editable" )
          return hayData && hayEsNuevo && hayEditable ? p.data.esNuevo || p.data.editable : false
        }
      }     
    }
  )

  function setId(){
    getRowId.value                = ( params : GetRowIdParams ) => params.data[ keyId ]
  }

  async function setColumnas( cols : any[] ){
    if(!cols.length) return

    gridApi.value?.setGridOption('columnDefs', cols)
  }


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
    vista.value.vista         = getVista()
  }

  function cargando( modo : "show" | "hide" )
  {
    if(modo === "show" )
      gridApi.value?.showLoadingOverlay();
    else
      gridApi.value?.hideOverlay();
  }

  

  function gestionarCambiosEnVista()
  {
    const accion            = vista.value.accion
      
    if(accion               == "restaurar")
      reiniciarVista()
    else
      aplicarVista()
  }


  function gestionarEventos()
  {
    if(evento.value === EVENTOS.LIMPIAR_FILTROS) limpiarFiltros()

    evento.value = EVENTOS.NULO    
  }

  function limpiarFiltros() {
    gridApi.value?.setFilterModel(null)
    filtro.value  = ""
  }

  function aplicarFiltroRapido() {
    gridApi.value?.setGridOption("quickFilterText", filtro.value)
  }



  function getVista() : ColumnState[] | void
  {
    const vista = gridApi.value?.getColumnState();
    if(!vista) return
    
    return vista
  }

  watchEffect(()=>{
    if(!!datos.value.length)
      setId()
  })

  defineExpose({
    setColumnas,
    refreshCells,
    cargando,
  })
</script>