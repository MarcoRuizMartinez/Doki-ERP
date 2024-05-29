<template>
  <tablaAg
    v-model             ="productosPro"
    key-id              ="id"
    :ref                ="VISTAS_AG.PRODUCTOS_PROVEEDORES"
    :row-class-rules    ="reglasCSS"
    :rango-activo
    :columnas
    :columnas-defecto
    :auto-size-strategy
    @edicion-celda      ="procesarEdicion"
  />
</template>

<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,
            onMounted,
                                } from "vue"

  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp,
            EVENTOS             } from 'stores/app'  
  import {  useStoreUser        } from 'stores/user'
  import {  useStoreProducto    } from 'stores/producto'

  // * ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  VISTAS_AG           } from "components/utilidades/AgGrid/VistaAG"
  import {  getColumnas         } from "./ColumnasProductos"
  import {  TIPO_EDICION,
            TDatosEvento        } from "components/utilidades/AgGrid/AGTools"

  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesProductosPro} from "src/areas/productos/services/servicesProductosProveedor"
  import {  ToolType            } from "src/composables/useTools"

  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import tablaAg                  from "components/utilidades/AgGrid/TablaAG.vue"
  
  const { productosPro,
          busquedaPro : b,
          loading,
                                } = storeToRefs( useStoreProducto() )               

  const { campo_1, evento       } = storeToRefs( useStoreApp() )
  const { usuario               } = storeToRefs( useStoreUser() )
  const { editarCampoEnLote     } = servicesProductosPro()
  const AGProProvee               = ref< InstanceType<typeof tablaAg> | null>(null)
  const columnas                  = ref<any[]>([])
  const cambios :TDatosEvento[]   = []
  const rangoActivo               = ref<boolean>(false)
  const columnasDefecto           = {
    filter                        : "agTextColumnFilter",
    enableCellChangeFlash         : true,  
    floatingFilter                : true,
    //enableRowGroup                : true,
    //enablePivot                   : true,
    //enableValue                   : true,    
  }

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
    copiarColumnas()
  })

  function copiarColumnas( editar : boolean = false )
  {
    columnas.value              = getColumnas( editar ).map( c => c.api )
  }
  
  watch(evento, gestionarEventos)
  watch(columnas, ()=>
    {
      if(!!columnas.value.length)
        AGProProvee.value?.setColumnas( columnas.value )
    },
    { deep: true}
  )

  watch(campo_1, ()=> {
    rangoActivo.value             = campo_1.value === TIPO_EDICION.RANGO
    const editar                  = campo_1.value === TIPO_EDICION.RANGO || campo_1.value === TIPO_EDICION.CELDA

    setEdicion( editar )
    //AGProProvee.value?.updateGridOptions( columnas.value )
    //copiarColumnas( editar )
  })

  function setEdicion( editar : boolean )
  {
    productosPro.value.forEach( p => p.editable = editar )
    AGProProvee.value?.refreshCells()
  }

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function procesarEdicion( d : TDatosEvento )
  {
    cambios.push( d )

    if (timeoutId)  clearTimeout(timeoutId)    
    
    timeoutId     = setTimeout(subirCambios, 200);
  }

  async function subirCambios()
  {
    if(!cambios.length) return 
    const campo           = cambios[0].campo
    if(campo.includes("_n")) return

    loading.value.carga   = true

    for (const c of cambios)
    {
      if(typeof c.value     ==  "boolean")
        c.value = ToolType.anyToNum( c.value )
      else if(c.value       === null && typeof c.oldValue == "boolean")
        c.value             = 0
      else if(c.value       === null && typeof c.oldValue == "string")
        c.value             = ""
    }

    const ok                = await editarCampoEnLote( campo, cambios, usuario.value.id )    
    cambios.length          = 0
    loading.value.carga     = false
  }
  


  async function gestionarEventos()
  {
    if(evento.value === EVENTOS.COPIAR_DATOS)
    {
      productosPro.value.forEach( p => p.copiarDatos() )
      AGProProvee.value?.refreshCells( false )
    }
    else
    if(evento.value === EVENTOS.ACTUALIZAR_PRECIOS)
    {
      await copiarPreciosTemAPrecios( "precio" )
      await copiarPreciosTemAPrecios( "precioCredito" )
      AGProProvee.value?.refreshCells( false )
    }

    evento.value = EVENTOS.NULO    
  }


  async function copiarPreciosTemAPrecios( key : "precio" | "precioCredito" )
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

  const reglasCSS = {
      'bg-grey-3 text-grey-5' : ( params : any ) => { return params.data?.activo === false; },
  }
    
</script>


<style>
  .clase-test{
    background-color: #e4e4e4;
    border: 1px solid #e4e4e4;
    display: inline-block;
    vertical-align: text-top;  
  }
</style>