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
        <!-- //* ///////////////////////////////////////////////// Proveedores -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.proveedores"
          label                 ="Proveedor"
          icon                  ="mdi-storefront"
          class                 ="width170"
          :options              ="b.o.proveedores"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Campo Categoría -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.categorias"
          label                 ="Categoría"
          icon                  ="mdi-file-tree-outline"
          options-sort          ="nombre"
          class                 ="width170"
          :options              ="b.o.categorias"          
        />     
        <!-- //* ///////////////////////////////////////////////// Activo -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.activo"
          label                 ="Activo"
          icon                  ="mdi-book-check"
          class                 ="width150"
          :options              ="Busqueda.listaActivoProducto"
        />
        <!-- //* ///////////////////////////////////////////////// Disponible -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.disponible"
          label                 ="Disponible"
          icon                  ="mdi-clipboard-check"
          class                 ="width150"
          :options              ="Busqueda.listaDisponible"
        />
        <!-- //* ///////////////////////////////////////////////// Estado acuerdo -->
        <multi-label-value
          v-model               ="b.f.tiposProProve"
          label                 ="Tipo"
          class                 ="width150"
          icon                  ="mdi-shape"
          :options              ="b.o.tiposProductosProv"
        />
        <!-- //* ///////////////////////////////////////////////// Ordenado -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l1"
          label                 ="Ordenado"
          icon                  ="mdi-sort-ascending"
          class                 ="width150"
          :options              ="[{ value : 1, label : 'Ordenado' }, { value : 0, label : 'Sin orden' }]"
        />        
        <!-- //* ///////////////////////////////////////////////// Familia proveedor -->
        <input-buscar           clearable hundido
          v-model               ="b.f.buscar1"
          label                 ="Familia proveedor"
          class                 ="width150"
          icon                  ="mdi-account-group"
          debounce              ="800"
        />
        <!-- //* ///////////////////////////////////////////////// Familia Nuestra -->
        <input-buscar           clearable hundido
          v-model               ="b.f.buscar2"
          label                 ="Familia nuestra"
          class                 ="width150"
          icon                  ="mdi-account-group-outline"
          debounce              ="800"
        />
        <!-- //* ///////////////////////////////////////////////// Documento -->
        <input-buscar           clearable hundido
          v-model               ="b.f.buscar3"
          label                 ="Documento"
          class                 ="width150"
          icon                  ="mdi-file-document"
          debounce              ="800"
        />

        <!-- //* ///////////////////////////////////////////////// Precio actualizado -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.actualizado"
          label                 ="Precio actualizado"
          icon                  ="mdi-cash-check"
          class                 ="width150"
          :options              ="Busqueda.listaActualizado"
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
    <!-- //* /////////////////////////////////////////////////////// Tab 2 -->
    <q-tab-panel
      name                      ="tab_2"
      class                     ="row q-pa-none no-wrap scroll"
      >
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

      <!-- //* /////////////////////////////////////////////////// Acciones -->
      <fieldset-filtro  
        titulo                  ="Acciones"
        class-contenido         ="grilla-ribom fit"
        >
        <div class              ="centerh">
          <q-btn
            v-bind              ="style.btnBaseMd"
            label               ="Copiar valores"
            icon                ="mdi-content-duplicate"
            color               ="blue-8"
            class               ="full-width"
            @click              ="copiarADatosTemporales"
            >
            <Tooltip label      ="Copiar valores a campos temporales"/>
          </q-btn>
        </div>
        <div class              ="centerh">
          <q-btn
            v-bind              ="style.btnBaseMd"
            label               ="Cambiar precios"
            icon                ="mdi-cash-usd"
            color               ="positive"           
            class               ="full-width"
            >
            <confirmar @ok      ="actualizarPrecios"/>
            <Tooltip label      ="Copiar precios de temporales precios de proveedor"/>
          </q-btn>
        </div>
        <div class              ="centerh">
          <q-btn
            v-bind              ="style.btnBaseMd"
            label               ="Precios actualizados"
            icon                ="mdi-cash-check"
            color               ="teal-9"
            class               ="full-width"            
            >
            <confirmar @ok      ="marcarPreciosActualizados( true )"/>
            <Tooltip label      ="Marcar precios como actualizados"/>
          </q-btn>
        </div>
        <div class              ="centerh">
          <q-btn
            v-bind              ="style.btnBaseMd"
            label               ="Precios desactualizados"
            icon                ="mdi-cash-remove"
            color               ="deep-orange-9"
            class               ="full-width"            
            >
            <confirmar @ok      ="marcarPreciosActualizados( false )"/>
            <Tooltip label      ="Marcar precios como desactualizados"/>
          </q-btn>
        </div>
        <!-- <div class              ="centerh">
          <q-btn
            v-bind              ="style.btnBaseMd"
            label               ="Subir IVA"
            icon                ="mdi-arrow-up-bold-box"
            color               ="indigo"
            class               ="full-width"            
            >
            <confirmar  @ok     ="cambiarPreciosPorIVA('subir')"/>
            <Tooltip :label     ="`Aumenta un ${IVA}% de IVA a los precios temporales`"/>
          </q-btn>
        </div> -->
        <div class              ="centerh">
          <q-btn
            v-bind              ="style.btnBaseMd"
            label               ="Bajar IVA"
            icon                ="mdi-arrow-down-bold-box"
            color               ="indigo"
            class               ="full-width"            
            >
            <confirmar  @ok     ="cambiarPreciosPorIVA('bajar')"/>
            <Tooltip :label     ="`Disminuye un ${IVA}% de IVA a los precios temporales`"/>
          </q-btn>
        </div>              
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
    <!-- //* ///////////////////////////////////////////////////// Tab 3 -->
    <q-tab-panel
      name                      ="tab_4"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <vistas :ref-vista        ="VISTAS_AG.PRODUCTOS_PROVEEDORES"/>
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
  import {  useStoreApp         } from 'stores/app'
  import {  useStoreProducto    } from 'stores/producto'

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  IQuery, Busqueda    } from "src/models/Busqueda"
  import {  GRUPO_USUARIO       } from "src/models/TiposVarios"
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
  //import    busquedasRapidas      from "./BusquedasRapidas.vue"
 
  const { busquedaPro : b,
          productosPro,
          loading           } = storeToRefs( useStoreProducto() )
  const { tabs,
          filtro,
          campo_1 : modoEdicion
                            } = storeToRefs( useStoreApp() )
  const { crearProductos,
          limpiarFiltros,
          limpiarBusqueda,
          actualizarPrecios,
          cambiarPreciosPorIVA,
          setEdicionEnProductos,
          copiarADatosTemporales,
          crearFilasNuevosProductos,
          marcarPreciosActualizados,
                            } = useControlProductosProveedor()

  type TEmit                  = {
    buscar          : [ value : IQuery  ]
    exportar        : [ value : void    ]
  }
  const emit                  = defineEmits<TEmit>()
  const IVA                   = parseInt( process.env.IVA ?? "0" )

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