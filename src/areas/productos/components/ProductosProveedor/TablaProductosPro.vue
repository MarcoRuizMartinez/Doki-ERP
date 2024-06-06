<template>
  <tablaAg
    v-model                 ="productosPro"
    key-id                  ="id"
    :rango-activo           ="rangoActivo"
    :auto-size-strategy
    :ref                    ="VISTAS_AG.PRODUCTOS_PROVEEDORES"
    :row-class-rules        ="reglasCSS"
    :columnas               ="columnasProductos"
    :tipos-columnas         ="columnTypes"
    :get-context-menu-items ="getMenuContextual"
    @edicion-celda          ="procesarEdicionEnLote"
  />
</template>

<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////////// Core
  import {  computed, ref       } from "vue"

  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp         } from 'stores/app'
  import {  useStoreProducto    } from 'stores/producto'

  // * ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  TIPO_EDICION        } from "components/utilidades/AgGrid/AGTools"
  import {  VISTAS_AG           } from "components/utilidades/AgGrid/VistaAG"
  import {  columnasProductos,
            autoSizeStrategy,
            reglasCSS,
            columnTypes,
                                } from "./ColumnasProductos"
  import {  IProductoProveedor  } from "../../models/ProductoProveedor"
  import {  MenuItemDef,
            GetContextMenuItems,
            GetContextMenuItemsParams,
            IRowNode
                                  } from "ag-grid-community";
  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlProductosProveedor
                                } from "src/areas/productos/controllers/ControlProductosProveedor"
  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import tablaAg                  from "components/utilidades/AgGrid/TablaAG.vue"
  
  const { productosPro          } = storeToRefs( useStoreProducto() )
  const { campo_1 : modoEdicion } = storeToRefs( useStoreApp() )

  const { eventos,
          eliminarFila,
          procesarEdicionEnLote } = useControlProductosProveedor()

  const AGProProvee               = ref< InstanceType<typeof tablaAg> | null>(null)
  const rangoActivo               = computed(()=> modoEdicion.value === TIPO_EDICION.RANGO ) 


  eventos.on("solicitarRefrescarTabla", ( forzado : boolean = false )=>{
    AGProProvee.value?.refreshCells( forzado )
  })

  eventos.on("solicitarLimpiarFiltros", ()=>{
    AGProProvee.value?.limpiarFiltros()
  })

  eventos.on("solicitarCambiarNuevos", cambiarNuevosANoNuevos)
  function cambiarNuevosANoNuevos()
  {
    AGProProvee.value?.gridApi?.forEachNode((rowNode, index) =>
    {
      const esNuevoConId          = !!rowNode.data.esNuevo && !!rowNode.data.id && rowNode.data.id < 1_000_000
      if( esNuevoConId ){
        rowNode.setDataValue("esNuevo", false)
      }
    })
  }

  eventos.on("solicitarCrearFilas", crearNuevaFilas)
  function crearNuevaFilas( nuevosProductos : IProductoProveedor[] )
  {
    AGProProvee.value?.gridApi?.applyTransaction({
        add: nuevosProductos,
        addIndex: 0,
    })
  }

  eventos.on("solicitarEliminarFilas", quitarTodosLosResultados)
  function quitarTodosLosResultados(){
    const rowData : IRowNode<IProductoProveedor>[] = [];
    AGProProvee.value?.gridApi?.forEachNode     ( node => rowData.push( node.data ) )
    AGProProvee.value?.gridApi?.applyTransaction( { remove: rowData } )
  }

  function getMenuContextual( params : GetContextMenuItemsParams<IProductoProveedor> ) : (string | MenuItemDef)[] | GetContextMenuItems
  {
    return [
      "autoSizeAll",
      "expandAll",
      "contractAll",
      "separator",
      "copy",
      "cut",
      "paste",
      {
        name      : "Eliminar fila de resultados",
        tooltip   : "Eliminar de resultado, mas no elimina el producto",
        action    : () => eliminarFila( params.node?.data?.id ),
        icon      :"❌"
      },    
      "separator",  
      "resetColumns", 
      "excelExport",
    ]
  }
</script>