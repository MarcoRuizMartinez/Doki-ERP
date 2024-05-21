<template>
  <q-tab-panels                 animated keep-alive vertical
    v-model                     ="tabs.activa"
    class                       ="transparent fit"
    >
    <!-- //* /////////////////////////////////////////////////////// Tab 1 -->
    <q-tab-panel
      name                      ="tab_1"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <!-- //* ///////////////////////////////////////////////////////////// Botones -->
      <fieldset-filtro
        titulo                  ="Acciones"
        class-contenido         ="column q-gutter-xs"
        >
        <q-btn
          v-bind                ="style.btnBaseMd"
          label                 ="Crear"
          icon                  ="mdi-layers-plus"
          color                 ="positive"
          @click                ="emit('crear')"
        />
      </fieldset-filtro>      
      <!-- //* ///////////////////////////////////////////////////////////// Busqueda y filtro -->
      <fieldset-filtro
        titulo                  ="Búsqueda"
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Busqueda general -->
        <input-buscar           clearable hundido
          v-model               ="busqueda.c.nombre"
          label                 ="Búsqueda"
          class                 ="width220"
          icon                  ="mdi-layers-search"
        />
        <!-- //* ///////////////////////////////////////////////// Filtro texto -->
        <input-buscar           clearable hundido
          v-model               ="busqueda.f.filtroTexto"
          label                 ="Filtro"
          class                 ="width220"
          icon                  ="mdi-filter"
          :disable              ="!productos.length"
        />
      </fieldset-filtro>
      <!-- //* ///////////////////////////////////////////////////////////// Categorías-->
      <fieldset-filtro
        titulo                  ="Categorías"
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////////////////// Campo Categoría -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="busqueda.c.categoria"
          label                 ="Categoría"
          icon                  ="mdi-file-tree-outline"
          options-sort          ="nombre"
          :options              ="categoriasProductos"          
        />    
      </fieldset-filtro> 
      <fieldset-filtro
        v-if                    ="false"
        titulo                  ="Estado"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Creador -->
        <select-usuario         hundido clearable
          v-model               ="busqueda.creador"
          class                 ="width160"
          label                 ="Creador"
          :area                 ="usuario.area"
          :readonly             ="!permisos.acceso_total"
        />
      </fieldset-filtro>
      <!-- //* /////////////////////////////////////////////////// Paginación -->
      <fieldset-filtro
        v-if                    ="false" 
        titulo                  ="Paginas"
        class-contenido         ="grilla-ribom fit"
        >
        <!-- //* ///////////////////////////////////////////////// Resultados por pagina -->
        <div>
          <q-btn-toggle         spread push unelevated round
            v-model             ="busqueda.resultadosXPage"
            color               ="white"
            text-color          ="grey-8"
            toggle-color        ="primary"
            :options            ="[{label: '25', value: 25},{label: '50', value: 50},{label: '100', value: 100}]"
            @update:model-value ="busqueda.pagina = 1"
          />
          <Tooltip label        ="Resultados por pagina"/>
        </div>
        <!-- //* ///////////////////////////////////////////////// Pagina -->
        <div class              ="row justify-center full-width">
          <q-pagination         push unelevated dense
            v-model             ="busqueda.pagina"
            :max                ="siguientePagina"
            :max-pages          ="3"
            :ellipses           ="false"
            :boundary-numbers   ="false"
          />
          <Tooltip label        ="Pagina"/>
          
          <q-spinner-puff
            v-if                ="haySiguientePagina"
            color               ="primary"
            size                ="2em"
            class               ="q-mt-xs"
          />          
        </div>
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Opciones"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Slot Columnas -->
        <slot></slot>
        <!-- //* ///////////////////////////////////////////////// Botones -->
        <div class                ="row justify-around q-mt-sm">
          <!-- //* /////////////////////////////////////////////// Boton recargar -->
          <div>
            <q-btn                round push glossy
              icon                ="mdi-refresh"
              padding             ="xs"
              color               ="primary"
              @click              ="buscar('btnRecargar')"
              >
              <Tooltip label      ="Recargar"/>
            </q-btn>
          </div>
          <!-- //* /////////////////////////////////////////////// Boton limpiar -->
          <div>
            <q-btn                round push glossy
              icon                ="mdi-close"
              padding             ="xs"
              color               ="primary"
              :disable            ="busqueda.busquedaVacia"
              @click              ="limpiarBusqueda"
              >
              <Tooltip label      ="Limpiar búsqueda"/>
            </q-btn>
          </div>
          <!-- //* /////////////////////////////////////////////// Boton exportar -->
          <div>
            <q-btn                round push glossy
              v-if                ="permisos.terceros_exportar"
              icon                ="mdi-microsoft-excel"
              color               ="primary"
              padding             ="xs"
              :disable            ="busqueda.busquedaVacia"
              @click              ="emit('exportar')"
              >
              <Tooltip label      ="Descargar"/>
            </q-btn>
          </div>
        </div>
        <div class                ="row justify-center content-start q-mt-sm">
          <grilla-lista
            v-model               ="busqueda.tipoVista"
            por-defecto           ="lista"
            color                 ="primary"
            toggle-color          ="primary"
            text-color            ="grey-6"
            toggle-text-color     ="white"            
          />
        </div>     
      </fieldset-filtro>
    </q-tab-panel>
    <!-- //* ///////////////////////////////////////////////////// Tab 2 -->
    <!-- <q-tab-panel
      name                      ="tab_2"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <fieldset-filtro
        titulo                  ="Grupo"
        class-contenido         ="column q-gutter-xs"
        >
      </fieldset-filtro>
    </q-tab-panel> -->
  </q-tab-panels>
</template>
<script lang="ts" setup>
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  watch,
            computed,
            onMounted           } from "vue"
  import {  useRouter           } from "vue-router"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp         } from 'stores/app'
  import {  useStoreUser        } from 'stores/user'
  import {  useStoreProducto    } from 'stores/producto'
  import {  useStoreDexie       } from 'stores/dexieStore'
  // * /////////////////////////////////////////////////////////////////////// Componibles
  //import {                      } from "src/composables/useDexie"
  import {  ToolQuery           } from "src/composables/useTools"
  import {  dexieCategoriasProducto,
            getCategoriaDB,
                                } from "src/composables/useDexie"                                
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  Areas               } from "src/models/TiposVarios"
  import {  IQueryProducto,
            IBusquedaProducto   } from "src/areas/productos/models/BusquedaProductos"
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  style               } from "src/composables/useEstilos"
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    multiLabelValue       from "components/utilidades/select/SelectLabelValueMulti.vue"
  import    selectUsuario         from "src/areas/usuarios/components/SelectUsuario.vue"
  import    inputBuscar           from "components/utilidades/input/InputSimple.vue"
  import    grillaLista           from "components/utilidades/ToggleGrillaLista.vue"

  const router                    = useRouter()
  let queryURL                    = router.currentRoute.value.query  

  const { usuario, permisos     } = storeToRefs( useStoreUser() )
  const { busqueda,
          productos,            } = storeToRefs( useStoreProducto() )
  const { tabs                  } = storeToRefs( useStoreApp() )
  dexieCategoriasProducto() 
  const { categoriasProductos   } = storeToRefs( useStoreDexie() )
  const siguientePagina           = computed(()=> busqueda.value.pagina + (productos.value.length >= busqueda.value.resultadosXPage ? 1 : 0) )
  const haySiguientePagina        = computed(()=> busqueda.value.pagina !== siguientePagina.value )
  let   copiaQ                    = ""
  let   bloqueoInicio             = true

  const emit = defineEmits<{
    (e: 'buscar',   value: IQueryProducto ): void
    (e: 'limpiar',                        ): void
    (e: 'exportar',                       ): void
    (e: 'crear',                          ): void
  }>()

  onMounted(()=>{
    tabs.value                    = { activa : "tab_1", alerts: [ false, true ]}
    asignarQueryRouterACampos()
  })

  /* watch([estados, origenes, condicionesPago, formasPago], ([es,or,co,fp])=>{
    // Estan cargados las opciones, para que estas se puedan asignar desde la query de la URL
    if(!!es.length && !!or.length && !!co.length && !!fp.length ){
      asignarQueryRouterACampos()
    }
  }) */

  async function asignarQueryRouterACampos()
  {
    busqueda.value.c.nombre       = ToolQuery.getQueryRouterString    ( queryURL.busqueda     )
    //busqueda.value.c.precioMinimo = getQueryRouterNumber    ( queryURL.subtotalMin  )
    //busqueda.value.c.precioMaximo = getQueryRouterNumber    ( queryURL.subtotalMax  )
    //busqueda.value.creador      = getQueryRouterNumber    ( queryURL.creador      )

    if(!!queryURL.sigla)
      busqueda.value.c.categoria  = await getCategoriaDB( Array.isArray(queryURL.sigla) ? "" : queryURL.sigla  ) 

    bloqueoInicio                 = false
    buscar()
  }


  watch(()=> busqueda.value.c, (c)=>
    {
      if(bloqueoInicio) return
      //checkAlertTabs(c)
      //if( !permisos.value.acceso_total )
        //query.idComercial         = usuario.value.id
      buscar()
    },
    { deep: true }
  )

  function buscar( origen : string = "" )
  {
    const query         = busqueda.value.query
    const qString       = JSON.stringify(query)
    //console.log("qString: ", qString);
    if(copiaQ           !== qString)
      copiaQ            = qString
    else if(origen      === "")
      return

    if(!!Object.keys(query).length)
    {
      router.replace({ query: {...query }  })
      query.tipo        = "busqueda"
      query.completa    = 1      
      emit("buscar", query)
    }
    else{
      router.replace({ query: {} })
    }
  }

  function limpiarBusqueda(){
    queryURL = {}
    asignarQueryRouterACampos()
    emit("limpiar")
  }


  function checkAlertTabs( b : IBusquedaProducto ){

  }  
</script>
