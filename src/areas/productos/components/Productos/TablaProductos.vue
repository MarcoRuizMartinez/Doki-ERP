<template>
  <tabla-agrid
    v-model                 ="productos"
    ref                     ="AGProductos"
    key-id                  ="id"
    :rango-activo           ="rangoActivo"
    :auto-size-strategy
    :columnas
    :row-class-rules        ="reglasCSS"
    :tipos-columnas         ="columnTypes"
    :get-context-menu-items ="getMenuContextual"
    @edicion-celda          ="procesarEdicionEnLote"
  />
</template>

<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            onMounted,
            computed            } from "vue"

  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp         } from 'stores/app'
  import {  useStoreUser        } from 'stores/user'
  import {  useStoreProducto    } from 'stores/producto'

  // * ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  TIPO_EDICION        } from "components/utilidades/AgGrid/AGTools"
  import {  columnasProductos,
            autoSizeStrategy,
            reglasCSS,
            columnTypes,
                                } from "./ColumnasProductos"
  import {  IProductoDoli       } from "../../models/ProductoDolibarr"
  import {  MenuItemDef,
            GetContextMenuItems,
            GetContextMenuItemsParams,
                                } from "ag-grid-community";

  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlProductosDolibarr
                                } from "src/areas/productos/controllers/ControlProductosNew"
  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import tablaAgrid               from "components/utilidades/AgGrid/TablaAG.vue"
  
  const { productos             } = storeToRefs( useStoreProducto() )
  const { usuario               } = storeToRefs( useStoreUser() )
  const { tablaAG, 
          campo_1 : modoEdicion } = storeToRefs( useStoreApp() )

  const { eliminarFila,
          procesarEdicionEnLote } = useControlProductosDolibarr()

  const AGProductos               = ref< InstanceType<typeof tablaAgrid> | null>( null )
  const columnas                  = ref( columnasProductos( !usuario.value.esComercial ) )
  const rangoActivo               = computed(()=> modoEdicion.value === TIPO_EDICION.RANGO ) 

  onMounted(()=>{
    tablaAG.value                 = AGProductos.value
  })

  function getMenuContextual( params : GetContextMenuItemsParams<IProductoDoli> ) : (string | MenuItemDef)[] | GetContextMenuItems
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