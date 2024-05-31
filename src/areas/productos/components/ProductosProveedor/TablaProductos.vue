<template>
  <tablaAg
    v-model             ="productosPro"
    key-id              ="id"
    :ref                ="VISTAS_AG.PRODUCTOS_PROVEEDORES"
    :row-class-rules    ="reglasCSS"
    :columnas           ="ColumnasProductos"
    :rango-activo
    :columnas-defecto
    :auto-size-strategy
    @edicion-celda      ="procesarEdicionEnLote"
  />
</template>

<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref, watch          } from "vue"

  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp,
            EVENTOS             } from 'stores/app'  
  import {  useStoreUser        } from 'stores/user'
  import {  useStoreProducto    } from 'stores/producto'

  // * ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  VISTAS_AG           } from "components/utilidades/AgGrid/VistaAG"
  import {  ColumnasProductos,
            autoSizeStrategy,
            reglasCSS,
            columnasDefecto,
                                } from "./ColumnasProductos"
  import {  TIPO_EDICION,
            TDatosEvento        } from "components/utilidades/AgGrid/AGTools"
  import {  ProductoProveedor   } from "../../models/ProductoProveedor"            

  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesProductosPro} from "src/areas/productos/services/servicesProductosProveedor"
  import {  ToolType            } from "src/composables/useTools"

  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import tablaAg                  from "components/utilidades/AgGrid/TablaAG.vue"
  
  const { productosPro,
          loading               } = storeToRefs( useStoreProducto() )               

  const { campo_1   : modoEdicion,
          numero_1  : nuevasFilas,
          evento                } = storeToRefs( useStoreApp() )
  const { usuario               } = storeToRefs( useStoreUser() )
  const { editarCampoEnLote     } = servicesProductosPro()
  const AGProProvee               = ref< InstanceType<typeof tablaAg> | null>(null)
  const cambios   : TDatosEvento[]= []
  let   timeoutId : ReturnType<typeof setTimeout> | null = null;

  function procesarEdicionEnLote( d : TDatosEvento )
  {
    /* const hayEsNuevo        = ToolType.existeYEsValido(d.data, "esNuevo")
    if(hayEsNuevo && !!d.data.esNuevo) return

    cambios.push( d )

    if (timeoutId)  clearTimeout(timeoutId)    
    timeoutId               = setTimeout(subirCambios, 200); */
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
  // * ////////////////////////////////////////////////////////////////////////////// Gestion eventos
  watch(evento,       gestionarEventos)
  async function gestionarEventos()
  {
    if(evento.value === EVENTOS.COPIAR_DATOS)       copiarADatosTemporales()
    else
    if(evento.value === EVENTOS.ACTUALIZAR_PRECIOS) actualizarPrecios()
    else
    if(evento.value === EVENTOS.NUEVAS_FILAS)       crearNuevasFilas()

    evento.value = EVENTOS.NULO    
  }

  // * ////////////////////////////////////////////////////////////////////////////////////////////// 
  // * ////////////////////////////////////////////////////////////////////////////// Otros  
  function copiarADatosTemporales()
  {
    productosPro.value.forEach( p => p.copiarDatos() )
    AGProProvee.value?.refreshCells( false )
  }

  function crearNuevasFilas()
  {
    const largo       = productosPro.value.length
    for (let i = 0; i < nuevasFilas.value; i++) {
      const newProducto = new ProductoProveedor( "nuevo" )
      newProducto.id    = ( largo + i + 1 ) + 1_000_000
      productosPro.value.unshift( newProducto  )

    }
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