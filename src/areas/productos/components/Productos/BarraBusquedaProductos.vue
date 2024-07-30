<template>
  <q-tab-panels                 animated keep-alive vertical
    v-model                     ="tabs.activa"
    v-bind                      ="$attrs"
    class                       ="transparent fit"
    style                       ="min-height: 140px;"
    >
    <!-- //* /////////////////////////////////////////////////////// Tab 1 -->
    <q-tab-panel
      name                      ="tab_1"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <fieldset-filtro
        titulo                  ="Búsqueda"
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Busqueda general -->
        <input-buscar           clearable hundido
          v-model               ="b.f.buscar"
          label                 ="Búsqueda"
          class                 ="width170"
          icon                  ="mdi-account-search"
          debounce              ="800"
        />
        <!-- //* ///////////////////////////////////////////////// Filtro texto -->
        <input-buscar           clearable hundido
          v-model               ="filtro"
          label                 ="Filtro"
          class                 ="width170"
          icon                  ="mdi-filter"
          :disable              ="!productosPro.length"
        />        
      </fieldset-filtro> 
      <fieldset-filtro
        titulo                  ="Búsqueda" 
        class-contenido         ="grilla-ribom fit"
        >
      </fieldset-filtro>          
      <!-- //* /////////////////////////////////////////////////// Paginación -->
      <fieldset-filtro
        titulo                  ="Paginas"
        class-contenido         ="grilla-ribom fit"
        >
        <!-- //* ///////////////////////////////////////////////// Resultados por pagina -->
        <div>
          <q-btn-toggle         spread push unelevated round
            v-model             ="b.f.resultadosXPage"
            color               ="white"
            text-color          ="grey-8"
            toggle-color        ="primary"
            :options            ="[ { value: 50,  label: '50',  },
                                    { value: 100, label: '100', },
                                    { value: 200, label: '200', },
                                    { value: 500, label: '500', },
                                  ]"
            @update:model-value ="b.f.pagina = 1"
          />
          <Tooltip label        ="Resultados por pagina"/>
        </div>
        <!-- //* ///////////////////////////////////////////////// Pagina -->
        <div class              ="row justify-center full-width">
          <q-pagination         dense
            v-model             ="b.f.pagina"
            :max                ="siguientePagina"
            :max-pages          ="3"
            :ellipses           ="false"
            :boundary-numbers   ="false"
          />
          <Tooltip label        ="Pagina"/>
          <q-spinner-puff
            v-if                ="b.haySiguientePagina"
            color               ="primary"
            size                ="2em"
            class               ="q-mt-xs"
          />
        </div>
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Opciones"
        >
        <!-- //* ///////////////////////////////////////////////// Botones -->
        <div class                ="row width80 q-col-gutter-sm">
          <!-- //* /////////////////////////////////////////////// Boton recargar -->
          <div class              ="col-6 row justify-center">
            <q-btn                round push glossy
              icon                ="mdi-refresh"
              padding             ="xs"
              color               ="primary"
              :disable            ="b.queryVacia"
              @click              ="buscar"
              >
              <Tooltip label      ="Recargar"/>
            </q-btn>
          </div>
          <!-- //* /////////////////////////////////////////////// Boton limpiar 'btnRecargar -->
          <div class              ="col-6 row justify-center">
            <q-btn                round push glossy
              icon                ="mdi-close"
              padding             ="xs"
              color               ="primary"
              :disable            ="b.queryVacia && !productosPro.length"
              @click              ="limpiarBusqueda"
              >
              <Tooltip label      ="Limpiar búsqueda"/>
            </q-btn>
          </div>
          <!-- //* /////////////////////////////////////////////// Boton limpiar 'btnRecargar -->
          <div class              ="col-6 row justify-center">
            <q-btn                round push glossy
              icon                ="mdi-filter-off"
              padding             ="xs"
              color               ="primary"
              @click              ="limpiarFiltros"
              >
              <Tooltip label      ="Limpiar filtros"/>
            </q-btn>
          </div>          
          <!-- //* /////////////////////////////////////////////// Boton exportar -->
          <div class              ="col-6 row justify-center">
            <q-btn                round push glossy
              icon                ="mdi-microsoft-excel"
              color               ="primary"
              padding             ="xs"
              :disable            ="b.queryVacia"
              @click              ="emit('exportar')"
              >
              <Tooltip label      ="Descargar"/>
            </q-btn>
          </div>
        </div>
      </fieldset-filtro>      
    </q-tab-panel>
    <!-- //* /////////////////////////////////////////////////////// Tab 3 Crear Editar -->
    <q-tab-panel
      name                      ="tab_3"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <!-- //* /////////////////////////////////////////////////// Modo Edicion -->
      <fieldset-filtro
        titulo                  ="Crear productos"
        class-contenido         ="column q-gutter-sm"
        style                   ="height: 120px;"
        >
        <div class              ="row items-center">
          <!-- //* ///////////////////////////////////////////////////////////// Nuevas Filas -->
          <numero-paso          hundido
            v-model             ="totalACrear"
            label               ="Nuevas filas"
            modo                ="right"
            :minimo             ="1"
            class               ="width110"
          />
          <div>
            <q-btn
              v-bind            ="style.btnBaseMd"
              icon              ="mdi-table-row-plus-after"
              color             ="positive"
              class             ="q-ml-sm"
              @click            ="crearFilasNuevosProductos( totalACrear )"
              >
              <Tooltip label    ="Crear nuevas filas"/>
            </q-btn>          
          </div>
        </div>
        <q-btn
          v-bind                ="style.btnBaseMd"
          label                 ="Crear productos"
          icon                  ="mdi-plus"
          color                 ="positive"
          class                 ="q-ml-sm"
          :disable              ="!hayProductosNuevos"
          @click                ="crearProductos"
          >
          <Tooltip label        ="Crear productos que esten listos"/>
        </q-btn>
      </fieldset-filtro>    

      <!-- //* /////////////////////////////////////////////////// Modo Edicion -->
      <fieldset-filtro
        titulo                  ="Modo de edición"
        class-contenido         ="column q-gutter-xs"        
        >
        <div>
          <q-btn-toggle         no-caps push glossy stack
            v-model             ="modoEdicion"
            color               ="white"
            text-color          ="grey-10"          
            toggle-color        ="primary"
            @update:model-value ="setEdicionEnProductos"
            :options            ="[ { value: TIPO_EDICION.BLOQUEDA, icon: 'mdi-lock',             slot:'bloqueada'  },
                                    { value: TIPO_EDICION.CELDA,    icon: 'mdi-form-textbox',     slot:'celda'      },
                                    { value: TIPO_EDICION.RANGO,    icon: 'mdi-table-arrow-down', slot:'rango'      },
                                  ]"
            >
            <template v-slot:bloqueada> <Tooltip label="Edición bloqueada"    /></template>
            <template v-slot:celda>     <Tooltip label="Edición por celda"    /></template>
            <template v-slot:rango>     <Tooltip label="saEdición por rango"  /></template>
          </q-btn-toggle>
        </div>
      </fieldset-filtro>      
    </q-tab-panel>
  </q-tab-panels>
  <inner-loading :cargando      ="loading.carga || b.f.copiando"/>
</template>

<script lang="ts" setup>
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,
            computed            } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreUser        } from 'stores/user'
  import {  useStoreApp         } from 'stores/app'
  import {  useStoreProducto    } from 'stores/producto'

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  IQuery, Busqueda    } from "src/models/Busqueda"
  import {  GRUPO_USUARIO,
            labelValueNulo      } from "src/models/TiposVarios"
  import {  VISTAS_AG           } from "components/utilidades/AgGrid/VistaAG"
  import {  TIPO_EDICION        } from "components/utilidades/AgGrid/AGTools"

  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  style               } from "src/composables/useEstilos"  
  import {  useControlProductosProveedor
                                } from "src/areas/productos/controllers/ControlProductosProveedor"
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"  
  import    multiLabelValue       from "components/utilidades/select/SelectLabelValueMulti.vue"
  import    inputFecha            from "components/utilidades/input/InputFecha.vue"
  import    selectUsuario         from "src/areas/usuarios/components/SelectUsuario.vue"
  import    inputBuscar           from "components/utilidades/input/InputSimple.vue"
  import    innerLoading          from "components/utilidades/InnerLoading.vue"
  import    vistas                from "components/utilidades/AgGrid/VistasTablasAG.vue"
  import    numeroPaso            from "components/utilidades/input/InputNumeroPaso.vue"
  import    confirmar             from "components/utilidades/MenuConfirmar.vue"  
 
  const { busquedaPro : b,
          productosPro,
          loading           } = storeToRefs( useStoreProducto() )
  const { tabs,
          filtro,
          campo_1 : modoEdicion
                            } = storeToRefs( useStoreApp() )
  const { usuario           } = storeToRefs( useStoreUser() )                            
  
  const { crearProductos,
          limpiarFiltros,
          limpiarBusqueda,          
          setEdicionEnProductos,
          crearFilasNuevosProductos,
                            } = useControlProductosProveedor()

  type TEmit                  = {
    buscar          : [ value : IQuery  ]
    exportar        : [ value : void    ]
  }
  const emit                  = defineEmits<TEmit>()
  
  const totalACrear           = ref<number>(1)
  const hayProductosNuevos    = computed(()=> !!(productosPro.value.filter( p => p.esNuevo ).length) )  

  watch(()=>b.value.f, ()=>
  {
      if(b.value.puedeBuscar && b.value.checkPage())
        buscar()
      else  if(b.value.queryVacia ) limpiarBusqueda()
    },
    { deep: true }
  )

  function buscar()
  {
    b.value.copiarQueryARourter()
    const query       = b.value.query
    query.acuerdo     = b.value.acuerdo
    emit("buscar", query)
  }

  // * /////////////////////////////////////////////////////////////////////// Computed
  const siguientePagina           = computed(()=> b.value.siguientePagina( productosPro.value.length ) )
</script>