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
          class                 ="width190"
          icon                  ="mdi-account-search"
          debounce              ="800"
        />
        <!-- //* ///////////////////////////////////////////////// Filtro texto -->
        <input-buscar           clearable hundido
          v-model               ="filtro"
          label                 ="Filtro"
          class                 ="width190"
          icon                  ="mdi-filter"
          :disable              ="!productosPro.length"
        />        
      </fieldset-filtro>
      <!-- //* /////////////////////////////////////////////////// Paginación -->
      <fieldset-filtro
        titulo                  ="Opciones"
        class-contenido         ="grilla-ribom fit"
        >
        <!-- //* ///////////////////////////////////////////////// Proveedores -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.proveedores"
          label                 ="Proveedor"
          icon                  ="mdi-storefront"
          class                 ="width190"
          :options              ="b.o.proveedores"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Campo Categoría -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.categorias"
          label                 ="Categoría"
          icon                  ="mdi-file-tree-outline"
          options-sort          ="nombre"
          class                 ="width190"
          :options              ="b.o.categorias"          
        />        
      </fieldset-filtro>      
      <fieldset-filtro
        titulo                  ="Búsqueda" 
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Activo -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.activo"
          label                 ="Activo proveedor"
          icon                  ="mdi-book-check"
          class                 ="width180"
          :options              ="Busqueda.listaActivoProducto"
        />
        <!-- //* ///////////////////////////////////////////////// Busqueda general -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.disponible"
          label                 ="Disponibilidad"
          icon                  ="mdi-clipboard-check"
          class                 ="width180"
          :options              ="Busqueda.listaDisponible"
        />        
        <!-- //* ///////////////////////////////////////////////// Proveedores -->
        <!-- <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.proveedores"
          label                 ="Proveedor"
          icon                  ="mdi-storefront"
          class                 ="width190"
          :options              ="b.o.proveedores"
        /> -->
      </fieldset-filtro>      
      <fieldset-filtro
        titulo                  ="Precio"
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Precio Minimo -->
        <input-number           hundido clearable
          v-model               ="b.f.valorMin"
          label                 ="Mínimo"
          icon                  ="mdi-currency-usd"
          class                 ="width140"
          :minimo               ="0"
          :maximo               ="!!b.f.valorMax ? b.f.valorMax : undefined"
        />
        <!-- //* ///////////////////////////////////////////////// Precio Maximo -->
        <input-number           hundido clearable
          v-model               ="b.f.valorMax"
          label                 ="Máximo"
          icon                  ="mdi-currency-usd"
          class                 ="width140"
          :minimo               ="!!b.f.valorMin ? b.f.valorMin : undefined"
          :maximo               ="999_999_999"
        />
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
            :options            ="Busqueda.listaResultadosXPag"
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
        <!-- //* ///////////////////////////////////////////////// Slot Columnas -->
        <slot></slot>
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
              :disable            ="b.queryVacia"
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
              @click              ="evento = EVENTOS.LIMPIAR_FILTROS"
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
    <!-- //* /////////////////////////////////////////////////////// Tab 2 -->
    <q-tab-panel
      name                      ="tab_2"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <!-- //* /////////////////////////////////////////////////// Fecha creacion -->
      <fieldset-filtro
        titulo                  ="Fechas creación"
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Fecha desde -->
        <input-fecha            hundido no-futuro clearable
          v-model               ="b.f.desde"
          label                 ="Desde"
          class                 ="width160"
          :hasta                ="b.f.hasta"
        />
        <!-- //* ///////////////////////////////////////////////// Fecha hasta -->
        <input-fecha            hundido no-futuro clearable
          v-model               ="b.f.hasta"
          label                 ="Hasta"
          class                 ="width160"
          :desde                ="b.f.desde"
        />
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Usuarios"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Creador -->
        <select-usuario         hundido clearable          
          v-model               ="b.f.creador"
          class                 ="width180"
          label                 ="Creador"
          :grupos               ="[GRUPO_USUARIO.PRODUCTOS]"          
        />
        <!-- //* ///////////////////////////////////////////////// Editor -->
        <select-usuario         hundido clearable          
          v-model               ="b.f.usuario"
          class                 ="width180"
          label                 ="Editor"          
          :grupos               =[GRUPO_USUARIO.PRODUCTOS]
        />        
      </fieldset-filtro>      
    </q-tab-panel>
    <!-- //* ///////////////////////////////////////////////////// Tab 3 -->
    <q-tab-panel
      name                      ="tab_3"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <vistas :ref-vista        ="VISTAS_AG.PRODUCTOS_PROVEEDORES"/>
    </q-tab-panel>
    <!-- //* ///////////////////////////////////////////////////// Tab 3 -->
    <q-tab-panel
      name                      ="tab_4"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <!-- //* /////////////////////////////////////////////////// Modo Edicion -->
      <fieldset-filtro
        titulo                  ="Acciones"
        class-contenido         ="column q-gutter-sm width160"
        style                   ="height: 120px;"
        >
        <div >
          <q-btn
            v-bind              ="style.btnBaseMd"
            label               ="Copiar valores"
            icon                ="mdi-content-duplicate"
            color               ="blue-8"
            class               ="full-width"
            @click              ="evento = EVENTOS.COPIAR_DATOS"
            >
            <Tooltip label      ="Copiar valores a campos temporales"/>
          </q-btn>
        </div>
        <div>
          <q-btn
            v-bind              ="style.btnBaseMd"
            label               ="Cambiar precios"
            icon                ="mdi-cash-usd"
            color               ="positive"
            class               ="full-width"            
            @click              ="evento = EVENTOS.ACTUALIZAR_PRECIOS"
            >
            <Tooltip label      ="Copiar precios de temporales precios de proveedor"/>
          </q-btn>
        </div>        
      </fieldset-filtro>      
      <!-- //* /////////////////////////////////////////////////// Modo Edicion -->
      <fieldset-filtro
        titulo                  ="Modo de edición"
        class-contenido         ="column q-gutter-xs"
        style                   ="height: 120px;"  
        >
        <div>
          <q-btn-toggle         no-caps push glossy
            v-model             ="campo_1"
            color               ="white"
            text-color          ="grey-10"          
            toggle-color        ="primary"
            :options            ="TiposDeEdicion"
          />
        </div>
      </fieldset-filtro>
    </q-tab-panel>
  </q-tab-panels>
  <inner-loading :cargando      ="loading.carga || b.f.copiando"/>
</template>

<script lang="ts" setup>
/*

*/
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  watch,
            computed,
            onMounted,
                                } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp, 
            EVENTOS             } from 'stores/app'
  import {  useStoreProducto    } from 'stores/producto'

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  IQuery, Busqueda    } from "src/models/Busqueda"
  import {  GRUPO_USUARIO       } from "src/models/TiposVarios"
  import {  VISTAS_AG           } from "components/utilidades/AgGrid/VistaAG"

  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  style               } from "src/composables/useEstilos"
  import {  TiposDeEdicion,
            TIPO_EDICION
                                } from "components/utilidades/AgGrid/AGTools"
  
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"  
  //import    multiLabelValue       from "components/utilidades/select/SelectLabelValueMulti.vue"
  import    inputFecha            from "components/utilidades/input/InputFecha.vue"
  import    selectUsuario         from "src/areas/usuarios/components/SelectUsuario.vue"
  import    inputBuscar           from "components/utilidades/input/InputSimple.vue"
  import    innerLoading          from "components/utilidades/InnerLoading.vue"
  import    vistas                from "components/utilidades/AgGrid/VistasTablasAG.vue"
  //import    busquedasRapidas      from "./BusquedasRapidas.vue"
 

  const { busquedaPro : b,
          productosPro,
          loading           } = storeToRefs( useStoreProducto() )
  const { tabs,
          filtro,
          evento,
          campo_1,
                            } = storeToRefs( useStoreApp() )

  type TEmit                  = {
    buscar          : [ value : IQuery  ]
    limpiar         : [ value : void    ]
    exportar        : [ value : void    ]
  }  
  const emit                  = defineEmits<TEmit>()

  onMounted(()=>{
    campo_1.value             = TIPO_EDICION.BLOQUEDA
  })

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

  async function limpiarBusqueda(){
    const todoLimpio  = await b.value.limpiarQueryDeRouter()
    if(todoLimpio) emit("limpiar")
  }

  // * /////////////////////////////////////////////////////////////////////// Computed
  const siguientePagina           = computed(()=> b.value.siguientePagina( productosPro.value.length ) )
</script>