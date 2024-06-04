<template>
  <tablaAg
    v-model                 ="productosPro"
    key-id                  ="id"
    :ref                    ="VISTAS_AG.PRODUCTOS_PROVEEDORES"
    :row-class-rules        ="reglasCSS"
    :columnas               ="columnasProductos"
    :rango-activo
    :auto-size-strategy
    :tipos-columnas         ="columnTypes"
    :get-context-menu-items ="getMenuContextual"
    @edicion-celda          ="procesarEdicionEnLote"
  />
</template>

<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,
            onUnmounted         } from "vue"

  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp         } from 'stores/app'  
  import {  useStoreUser        } from 'stores/user'
  import {  useStoreProducto    } from 'stores/producto'

  // * ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  VISTAS_AG           } from "components/utilidades/AgGrid/VistaAG"
  import {  columnasProductos,
            autoSizeStrategy,
            reglasCSS,
            columnTypes,
                                } from "./ColumnasProductos"
  import {  TIPO_EDICION,
            TDatosEvento        } from "components/utilidades/AgGrid/AGTools"
  import {  IProductoProveedor, ProductoProveedor  } from "../../models/ProductoProveedor"
  import {  MenuItemDef,
            GetContextMenuItems,
            GetContextMenuItemsParams
                                  } from "ag-grid-community";
  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesProductosPro} from "src/areas/productos/services/servicesProductosProveedor"
  import {  ToolType, Eventos   } from "src/composables/useTools"

  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import tablaAg                  from "components/utilidades/AgGrid/TablaAG.vue"
  import { TIPO_PRO_PROVIDEDOR  } from "../../models/TipoProductoProveedor"
  
  const { productosPro,
          loading               } = storeToRefs( useStoreProducto() )               

  const { campo_1 : modoEdicion } = storeToRefs( useStoreApp() )
  const { usuario               } = storeToRefs( useStoreUser() )
  const { editarCampoEnLote,
          buscarProductoByRef,
                                } = servicesProductosPro()
  const AGProProvee               = ref< InstanceType<typeof tablaAg> | null>(null)
  const cambios   : TDatosEvento[]= []
  let   timeoutId : ReturnType<typeof setTimeout> | null = null;

  function procesarEdicionEnLote( d : TDatosEvento )
  {
    if(!!d.data.esNuevo) {
      gestionarCambiosEnNuevo(d)
      return
    }

    cambios.push( d )

    if (timeoutId)  clearTimeout(timeoutId)    
    timeoutId               = setTimeout(subirCambios, 200);
  }

  async function subirCambios()
  {
    if(!cambios.length) return

    const campo             = cambios[0].campo
    if(campo.includes("_n")) return

    loading.value.carga     = true

    for (const c of cambios)
    {
      if(typeof c.value     ==  "boolean")
        c.value = ToolType.anyToNum( c.value )
      else if(c.value       === null && typeof c.oldValue == "boolean")
        c.value             = 0
      else if(c.value       === null && typeof c.oldValue == "string")
        c.value             = ""
      else if(
            campo           === "diasDespacho"
        ||  campo           === "categoria"
        ||  campo           === "garantiaMeses"
        ||  campo           === "hechoEn"
      )
      {
        c.value             = ToolType.anyToNumOStr( c.value?.value )
      }
    }
    
    const ok                = await editarCampoEnLote( campo, cambios, usuario.value.id )    
    cambios.length          = 0
    loading.value.carga     = false
  }
  
  // * ////////////////////////////////////////////////////////////////////////////////////////////////////
  // * ////////////////////////////////////////////////////////////////////////////// Gestion de precios

  Eventos.on("actualizarPrecios", actualizarPrecios)

  async function actualizarPrecios()
  {
    await copiarYSubirPreciosDeTemporales( "precio" )
    await copiarYSubirPreciosDeTemporales( "precioCredito" )
    AGProProvee.value?.refreshCells( false )
  }


  async function copiarYSubirPreciosDeTemporales( key : "precio" | "precioCredito" )
  {
    cambios.length = 0
    for (const p of productosPro.value)
    {
      if(key === "precio"         && p.precio         === p.precio_n)         continue
      if(key === "precioCredito"  && p.precioCredito  === p.precioCredito_n)  continue

      p.copiarPrecios( key )

      const valor   = key === "precio" ? p.precio : p.precioCredito
      if(!valor) continue
      
      cambios.push({
        campo     : key,
        data      : p,
        value     : valor,
        index     : 0,
        oldValue  : 0,
      })
    }

    await subirCambios()
  }
  // * /////////////////////////////////////////////////////////////////////////////////////////////////////////
  // * ////////////////////////////////////////////////////////////////////////////// Gestion cambios en nuevo

  async function gestionarCambiosEnNuevo( d : TDatosEvento )
  {
    let revisarCampos         = false
    if(d.campo === "refPadre" || d.campo === "tipo")
    {
      if(d.data.tipo.value    === TIPO_PRO_PROVIDEDOR.HIJO && d.data.refPadre.length > 3)
      {
        const producto        = await buscarProductoByRef( d.data.refPadre )
        if(!!producto.id)
        {
          d.data              = ProductoProveedor.getCopiaProducto( producto, d.data ) 
          revisarCampos       = true
        }

        d.data.okRefPadre     = !!producto.id
      }
    }

    if(d.campo                === "ref"       || revisarCampos){
      const producto          = await buscarProductoByRef( d.data.ref )
      const repetido          = productosPro.value.some( p => p.ref === d.data.ref && p.id != d.data.id ) 
      const muyCorto          = d.data.ref.length <= 4
      d.data.okRef            = !(!!producto.id || repetido || muyCorto )
    }

    if(d.campo                === "nombre"    || revisarCampos)
      d.data.okNombre         = d.data.nombre.length > 10
    
    if(d.campo                === "tipo"      || revisarCampos)
      d.data.okTipo           = !!d.data.tipo.value

    if(d.campo                === "proveedor" || revisarCampos)
      d.data.okProveedor      = !!d.data.proveedor.id

    if(d.campo                === "categoria" || revisarCampos)
      d.data.okCategoria      = !!d.data.categoria.id

    if(d.campo                === "hechoEn"   || revisarCampos)
      d.data.okHechoEn        = !!d.data.hechoEn.value
    
    if(d.campo                === "precio"    || revisarCampos)
      d.data.okPrecio         = ToolType.anyToNum( d.data.precio ) != 0

    const refrescarTodo       = !!d.data.sePuedeCrear
    AGProProvee.value?.refreshCells( refrescarTodo )
  }

  // * ////////////////////////////////////////////////////////////////////////////////////////////////////
  // * ////////////////////////////////////////////////////////////////////////////// Gestion modo edicion 
  const rangoActivo               = ref<boolean>(false)
  watch(modoEdicion,  gestionarModoEdicion)
 
  function gestionarModoEdicion(){
    rangoActivo.value             = modoEdicion.value === TIPO_EDICION.RANGO
    const editar                  = modoEdicion.value === TIPO_EDICION.RANGO || modoEdicion.value === TIPO_EDICION.CELDA
    setEdicionEnProductos( editar )
  }

  function setEdicionEnProductos( editar : boolean ){
    productosPro.value.forEach( p => p.editable = editar )
    AGProProvee.value?.refreshCells()
  }

  // * ////////////////////////////////////////////////////////////////////////////////////////////// 
  // * ////////////////////////////////////////////////////////////////////////////// Otros  

  Eventos.on("copiarDatos", copiarADatosTemporales)

  function copiarADatosTemporales()
  {
    productosPro.value.forEach( p => p.copiarDatos() )
    AGProProvee.value?.refreshCells( false )
  }

  onUnmounted(()=>{
    Eventos.off("actualizarPrecios")
    Eventos.off("copiarDatos")
  })


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

  function eliminarFila( id : number = 0 )
  {
    if(!id) return
    const index = productosPro.value.findIndex( p => p.id === id )
    if(index < 0 ) return 
    
    productosPro.value.splice( index, 1 )
  }

/* 
  onMounted(()=>{
    copiarColumnas()
  })

  function copiarColumnas(){
    columnas.value              = getColumnas().map( c => c.api )
  }
  */
/*
watch(columnas, ()=>
    {
      if(!!columnas.value.length)
        AGProProvee.value?.setColumnas( columnas.value )
    },
    { deep: true}
  )
*/
</script>


<style>
  .clase-test{
    background-color: #e4e4e4;
    border: 1px solid #e4e4e4;
    display: inline-block;
    vertical-align: text-top;  
  }
</style>