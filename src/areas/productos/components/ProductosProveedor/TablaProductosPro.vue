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
  import {  ToolNum, ToolType   } from "src/composables/useTools"
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


  eventos.on("solicitarEliminarFilasPorId", eliminarFilasPorId)

  function eliminarFilasPorId( ids : number[] ){
    const myTransaction = { remove: ids.map( n => { return { id: n }}) }
    AGProProvee.value?.gridApi?.applyTransaction( myTransaction )
  }

  eventos.on("solicitarCrearFilas", crearNuevaFilas)
  function crearNuevaFilas( nuevosProductos : IProductoProveedor[] ){
    AGProProvee.value?.gridApi?.applyTransaction({
        add: nuevosProductos,
        addIndex: 0,
    })
  }

  eventos.on("solicitarEliminarFilas", quitarTodosLosResultados)
  function quitarTodosLosResultados()
  {
    //AGProProvee.value?.gridApi?.setGridOption("rowData", []);
    const rowData : IRowNode<IProductoProveedor>[] = [];
    AGProProvee.value?.gridApi?.forEachNode     ( node => rowData.push( node.data ) )
    AGProProvee.value?.gridApi?.applyTransaction( { remove: rowData } )
  }

  eventos.on("solicitarCambiarIVAPrecios", cambiarPreciosPorIVA)

  function cambiarPreciosPorIVA( tipo : string )
  {
    const IVA                     = parseInt( process.env.IVA ?? "0" )
    AGProProvee.value?.gridApi?.forEachNode((fila : IRowNode<IProductoProveedor>) =>
    {
      if(!fila.data) return 

      const precioCon             = ToolType.keyNumberValido( fila.data, "precio" )
      const precioCre             = ToolType.keyNumberValido( fila.data, "precioCredito" )

      if(tipo == "subir"){
        if(!!precioCon)   fila.data.precio_n          = ToolNum.roundInt( ToolNum.X100_Aumento( precioCon, IVA ), 0 )
        if(!!precioCre)   fila.data.precioCredito_n   = ToolNum.roundInt( ToolNum.X100_Aumento( precioCre, IVA ), 0 )
      }
      else{
        if(!!precioCon)   fila.data.precio_n          = ToolNum.roundInt( ToolNum.X100_Reduccion( precioCon, IVA ), 0 )
        if(!!precioCre)   fila.data.precioCredito_n   = ToolNum.roundInt( ToolNum.X100_Reduccion( precioCre, IVA ), 0 )
      }

      if(!!precioCon)     fila.setDataValue("precio_n",         fila.data.precio_n)
      if(!!precioCre)     fila.setDataValue("precioCredito_n",  fila.data.precioCredito_n)
    })
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