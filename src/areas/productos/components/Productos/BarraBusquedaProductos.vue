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
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////////////////// Busqueda general -->
        <input-buscar           clearable hundido
          v-model               ="b.f.buscar"
          label                 ="Búsqueda"
          class                 ="width170"
          icon                  ="mdi-account-search"
          debounce              ="800"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Filtro texto -->
        <input-buscar           clearable hundido
          v-model               ="filtro"
          label                 ="Filtro"
          class                 ="width170"
          icon                  ="mdi-filter"
          :disable              ="!productos.length"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Busqueda Documento -->
        <input-buscar           clearable hundido
          v-model               ="b.f.buscar2"
          label                 ="Documento"
          class                 ="width170"
          icon                  ="mdi-file-document"
          debounce              ="800"
        />  
        <!-- //* ///////////////////////////////////////////////////////////// Busqueda Familia -->
        <input-buscar           clearable hundido
          v-model               ="b.f.buscar3"
          label                 ="Familia"
          class                 ="width170"
          icon                  ="mdi-account-group"
          debounce              ="800"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Busqueda Descripción y Notas -->
        <input-buscar           clearable hundido
          v-model               ="b.f.buscar1"
          label                 ="Descripción"
          tooltip               ="Buscar en descripción y notas"
          class                 ="width170"
          icon                  ="mdi-text-box"
          debounce              ="800"
        />        
        <!-- //* ///////////////////////////////////////////////////////////// Hay aumento base -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l16"
          label                 ="Hay descripción"
          tooltip               ="Producto tiene o no descripción"
          icon                  ="mdi-text-box-check"
          class                 ="width170"          
          :options              ="Busqueda.listaBase"
        />        
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Otros datos"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////////////////// Categoría -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.categorias"
          label                 ="Categoría"
          icon                  ="mdi-file-tree-outline"
          options-sort          ="nombre"
          class                 ="width160"
          :options              ="b.o.categorias"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Tipo de producto -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l1"
          label                 ="Tipo producto"
          icon                  ="mdi-ballot"
          class                 ="width160"
          :options              ="[{ value : 0, label : 'Productos' }, { value : 1, label : 'Servicios' }]"
        />          
        <!-- //* ///////////////////////////////////////////////////////////// Con proveedor -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l3"
          label                 ="Con proveedor"
          icon                  ="mdi-fireplace-off"
          class                 ="width160"
          :options              ="Busqueda.listaBase"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Proveedores -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.proveedores"
          label                 ="Proveedor"
          icon                  ="mdi-storefront"
          class                 ="width160"
          :options              ="b.o.proveedores"
          @clear                ="b.f.l6 = labelValueNulo"
        />        
        <!-- //* ///////////////////////////////////////////////////////////// En venta -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.activo"
          label                 ="En venta"
          icon                  ="mdi-cart-arrow-up"
          class                 ="width160"
          :options              ="Busqueda.listaActivo"
        />
        <!-- //* ///////////////////////////////////////////////////////////// En compra -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.disponible"
          label                 ="En compra"
          icon                  ="mdi-cart-arrow-down"
          class                 ="width160"
          :options              ="Busqueda.listaActivo"
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
        <div class              ="row width80 q-col-gutter-sm">
          <!-- //* /////////////////////////////////////////////// Boton recargar -->
          <div class            ="col-6 row justify-center">
            <q-btn              round push glossy
              icon              ="mdi-refresh"
              padding           ="xs"
              color             ="primary"
              :disable          ="b.queryVacia"
              @click            ="buscar"
              >
              <Tooltip label    ="Recargar"/>
            </q-btn>
          </div>
          <!-- //* /////////////////////////////////////////////// Boton limpiar 'btnRecargar -->
          <div class            ="col-6 row justify-center">
            <q-btn              round push glossy
              icon              ="mdi-close"
              padding           ="xs"
              color             ="primary"
              :disable          ="b.queryVacia && !productos.length"
              @click            ="limpiarBusqueda"
              >
              <Tooltip label    ="Limpiar búsqueda"/>
            </q-btn>
          </div>
          <!-- //* /////////////////////////////////////////////// Boton limpiar 'btnRecargar -->
          <div class            ="col-6 row justify-center">
            <q-btn              round push glossy
              icon              ="mdi-filter-off"
              padding           ="xs"
              color             ="primary"
              @click            ="limpiarFiltros"
              >
              <Tooltip label    ="Limpiar filtros"/>
            </q-btn>
          </div>          
          <!-- //* /////////////////////////////////////////////// Boton exportar -->
          <div class            ="col-6 row justify-center">
            <q-btn              round push glossy
              icon              ="mdi-microsoft-excel"
              color             ="primary"
              padding           ="xs"
              :disable          ="b.queryVacia"
              @click            ="emit('exportar')"
              >
              <Tooltip label    ="Descargar"/>
            </q-btn>
          </div>
        </div>
      </fieldset-filtro>      
    </q-tab-panel>
    <!-- //* /////////////////////////////////////////////////////// Tab 2 Mas -->
    <q-tab-panel
      name                      ="tab_2"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <fieldset-filtro
        titulo                  ="Mas datos"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////////////////// Unidad -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.und"
          label                 ="Unidad"
          icon                  ="mdi-tape-measure"
          class                 ="width160"
          :options              ="b.o.unidades"
        />        
        <!-- //* ///////////////////////////////////////////////////////////// Con imagen -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l2"
          label                 ="Con imagen"
          icon                  ="mdi-image"
          class                 ="width160"
          :options              ="[{ value : 1, label : 'Con imagen' }, { value : 0, label : 'Sin imagen' }]"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Naturaleza -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.ntz"
          label                 ="Naturaleza"
          icon                  ="mdi-leaf"
          class                 ="width160"
          :options              ="b.o.naturalezas"
        />        
        <!-- //* ///////////////////////////////////////////////////////////// En tienda -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l15"
          label                 ="En tienda"
          icon                  ="mdi-storefront"
          class                 ="width160"
          :options              ="Busqueda.listaBase"
        />
      </fieldset-filtro>      
      <fieldset-filtro
        titulo                  ="Stock"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////////////////// Stock gestionado -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l4"
          label                 ="Gestion stock"
          tooltip               ="Productos cuyo proveedor maneja un nivel de stock"
          icon                  ="mdi-package-variant"
          class                 ="width160"
          :options              ="Busqueda.listaBase"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Con Stock -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l5"
          label                 ="Con Stock"
          tooltip               ="Proveedor tiene mas de una unidad de stock"
          icon                  ="mdi-clipboard-check"
          class                 ="width160"
          :options              ="Busqueda.listaBase"
        /> 
      </fieldset-filtro>
      <!-- //* /////////////////////////////////////////////////// Fecha creacion -->
      <fieldset-filtro
        titulo                  ="Fechas creación"
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Desde -->
        <input-fecha            hundido no-futuro clearable
          v-model               ="b.f.desde"
          label                 ="Desde"
          class                 ="width140"
          :hasta                ="b.f.hasta"
        />
        <!-- //* ///////////////////////////////////////////////// Hasta -->
        <input-fecha            hundido no-futuro clearable
          v-model               ="b.f.hasta"
          label                 ="Hasta"
          class                 ="width140"
          :desde                ="b.f.desde"
        />
      </fieldset-filtro>
      <!-- //* /////////////////////////////////////////////////// Fecha Edición -->
      <fieldset-filtro
        titulo                  ="Fechas edición"
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Desde -->
        <input-fecha            hundido no-futuro clearable
          v-model               ="b.f.desde2"
          label                 ="Desde"
          class                 ="width140"
          :hasta                ="b.f.hasta2"
        />
        <!-- //* ///////////////////////////////////////////////// Hasta -->
        <input-fecha            hundido no-futuro clearable
          v-model               ="b.f.hasta2"
          label                 ="Hasta"
          class                 ="width140"
          :desde                ="b.f.desde2"
        />
      </fieldset-filtro>
      <!-- //* /////////////////////////////////////////////////// Usuario Creacion y Edición -->
      <fieldset-filtro
        titulo                  ="Usuarios"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Creador -->
        <select-usuario         hundido clearable          
          v-model               ="b.f.creador"
          class                 ="width160"
          label                 ="Creador"
          :grupos               ="[GRUPO_USUARIO.PRODUCTOS]"
        />
        <!-- //* ///////////////////////////////////////////////// Editor -->
        <select-usuario         hundido clearable          
          v-model               ="b.f.usuario"
          class                 ="width160"
          label                 ="Editor"          
          :grupos               ="[GRUPO_USUARIO.PRODUCTOS]"
        />        
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Requerimientos"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////////////////// Requiere Acabado -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l6"
          label                 ="Acabado"
          tooltip               ="Asesor debe indicar color o acabado de producto"
          icon                  ="mdi-format-list-checks"
          class                 ="width120"
          :options              ="Busqueda.listaBase"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Requiere Medida -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l7"
          label                 ="Medida"
          tooltip               ="Asesor debe indicar las medidas de producto"
          icon                  ="mdi-format-list-checks"
          class                 ="width120"
          :options              ="Busqueda.listaBase"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Requiere Entregado -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l8"
          label                 ="Entrega"
          tooltip               ="Asesor debe indicar como se debe entregar el producto como, armado, instalado o en caja"
          icon                  ="mdi-format-list-checks"
          class                 ="width120"
          :options              ="Busqueda.listaBase"
        />          
      </fieldset-filtro>      
    </q-tab-panel>
    <!-- //* /////////////////////////////////////////////////////// Tab 3 Precios -->
    <q-tab-panel
      name                      ="tab_3"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <fieldset-filtro
        titulo                  ="Precio"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Precio Maximo -->
        <input-number           hundido clearable
          v-model               ="b.f.valorMax"
          label                 ="Máximo"
          tooltip               ="Precio venta máximo"
          icon                  ="mdi-currency-usd"
          class                 ="width140"
          :minimo               ="!!b.f.valorMin ? b.f.valorMin : undefined"
          :maximo               ="999_999_999"
        />        
        <!-- //* ///////////////////////////////////////////////// Precio Minimo -->
        <input-number           hundido clearable
          v-model               ="b.f.valorMin"
          label                 ="Mínimo"
          tooltip               ="Precio venta mínimo"
          icon                  ="mdi-currency-usd"
          class                 ="width140"
          :minimo               ="0"
          :maximo               ="!!b.f.valorMax ? b.f.valorMax : undefined"
        />
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Costo"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Costo máximo -->
        <input-number           hundido clearable
          v-model               ="b.f.max1"
          label                 ="Máximo"
          tooltip               ="Costo máximo"
          icon                  ="mdi-currency-usd"
          class                 ="width130"
          :minimo               ="!!b.f.min1 ? b.f.min1 : undefined"
          :maximo               ="999_999_999"
        />
        <!-- //* ///////////////////////////////////////////////// Costo mínimo -->
        <input-number           hundido clearable
          v-model               ="b.f.min1"
          label                 ="Mínimo"
          tooltip               ="Costo mínimo"
          icon                  ="mdi-currency-usd"
          class                 ="width130"
          :minimo               ="0"
          :maximo               ="!!b.f.max1 ? b.f.max1 : undefined"
        />
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Costo extra"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Costo extra máximo -->
        <input-number           hundido clearable
          v-model               ="b.f.max2"
          label                 ="Máximo"
          tooltip               ="Costo extra máximo"
          icon                  ="mdi-currency-usd"
          class                 ="width130"
          :minimo               ="!!b.f.min2 ? b.f.min2 : undefined"
          :maximo               ="999_999_999"
        />
        <!-- //* ///////////////////////////////////////////////// Costo extra mínimo -->
        <input-number           hundido clearable
          v-model               ="b.f.min2"
          label                 ="Mínimo"
          tooltip               ="Costo extra mínimo"
          icon                  ="mdi-currency-usd"
          class                 ="width130"
          :minimo               ="0"
          :maximo               ="!!b.f.max2 ? b.f.max2 : undefined"
        />
      </fieldset-filtro>
      <!-- //* /////////////////////////////////////////////////// Aumentos -->
      <fieldset-filtro
        titulo                  ="Aumentos"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Aumento base Maximo -->
        <input-number           hundido clearable
          v-model               ="b.f.max3"
          label                 ="Base"
          tooltip               ="Aumento base máximo"
          icon                  ="mdi-arrow-collapse-up"
          class                 ="width110"
          :minimo               ="!!b.f.min3 ? b.f.min3 : undefined"
          :maximo               ="999_999_999"
        />
        <!-- //* ///////////////////////////////////////////////// Aumento base Minimo -->
        <input-number           hundido clearable
          v-model               ="b.f.min3"
          label                 ="Base"
          tooltip               ="Aumento base mínimo"
          icon                  ="mdi-arrow-collapse-down"
          class                 ="width110"
          :minimo               ="0"
          :maximo               ="!!b.f.max3 ? b.f.max3 : undefined"
        />
        <!-- //* ///////////////////////////////////////////////// Aumento descuento Maximo -->
        <input-number           hundido clearable
          v-model               ="b.f.max4"
          label                 ="Descuento"
          tooltip               ="Aumento descuento máximo"
          icon                  ="mdi-arrow-collapse-up"
          class                 ="width110"
          :minimo               ="!!b.f.min4 ? b.f.min4 : undefined"
          :maximo               ="999_999_999"
        />
        <!-- //* ///////////////////////////////////////////////// Aumento descuento Minimo -->
        <input-number           hundido clearable
          v-model               ="b.f.min4"
          label                 ="Descuento"
          tooltip               ="Aumento descuento mínimo"
          icon                  ="mdi-arrow-collapse-down"
          class                 ="width110"
          :minimo               ="0"
          :maximo               ="!!b.f.max4 ? b.f.max4 : undefined"
        />
        <!-- //* ///////////////////////////////////////////////// Aumento Escom Maximo -->
        <input-number           hundido clearable
          v-model               ="b.f.max5"
          label                 ="Escom"
          tooltip               ="Aumento Escom máximo"
          icon                  ="mdi-arrow-collapse-up"
          class                 ="width110"
          :minimo               ="!!b.f.min5 ? b.f.min5 : undefined"
          :maximo               ="999_999_999"
        />
        <!-- //* ///////////////////////////////////////////////// Aumento Escom Minimo -->
        <input-number           hundido clearable
          v-model               ="b.f.min5"
          label                 ="Escom"
          tooltip               ="Aumento Escom mínimo"
          icon                  ="mdi-arrow-collapse-down"
          class                 ="width110"
          :minimo               ="0"
          :maximo               ="!!b.f.max5 ? b.f.max5 : undefined"
        />
        <!-- //* ///////////////////////////////////////////////// Aumento Black Friday -->
        <input-number           hundido clearable
          v-model               ="b.f.max6"
          label                 ="Black Friday"
          tooltip               ="Aumento Black Friday máximo"
          icon                  ="mdi-arrow-collapse-up"
          class                 ="width110"
          :minimo               ="!!b.f.min6 ? b.f.min6 : undefined"
          :maximo               ="999_999_999"
        />
        <!-- //* ///////////////////////////////////////////////// Aumento Black Friday -->
        <input-number           hundido clearable
          v-model               ="b.f.min6"
          label                 ="Black Friday"
          tooltip               ="Aumento Black Friday mínimo"
          icon                  ="mdi-arrow-collapse-down"
          class                 ="width110"
          :minimo               ="0"
          :maximo               ="!!b.f.max6 ? b.f.max6 : undefined"
        />
      </fieldset-filtro>
      <!-- //* /////////////////////////////////////////////////// Aumentos -->
      <fieldset-filtro
        titulo                  ="Hay aumento"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////////////////// Hay aumento base -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l11"
          label                 ="Base"
          tooltip               ="Hay aumento base"
          icon                  ="mdi-arrow-top-right-thick"
          class                 ="width140"          
          :options              ="Busqueda.listaBase"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Hay aumento descuento -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l12"
          label                 ="Descuento"
          tooltip               ="Hay aumento descuento"
          icon                  ="mdi-arrow-top-right-thick"
          class                 ="width140"          
          :options              ="Busqueda.listaBase"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Hay aumento Escom -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l13"
          label                 ="Escom"
          tooltip               ="Hay aumento Escom"
          icon                  ="mdi-arrow-top-right-thick"
          class                 ="width140"          
          :options              ="Busqueda.listaBase"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Hay aumento Black Friday -->        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l14"
          label                 ="Black Friday"
          tooltip               ="Hay aumento Black Friday"
          icon                  ="mdi-arrow-top-right-thick"
          class                 ="width140"          
          :options              ="Busqueda.listaBase"
        />        
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Contable"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////////////////// Con IVA -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l9"
          label                 ="Con IVA"
          icon                  ="mdi-bank"
          class                 ="width140"
          :options              ="Busqueda.listaBase"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Codigo contable -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.l17"
          label                 ="Codigo contable"
          tooltip               ="Con código contable"
          icon                  ="mdi-barcode"
          class                 ="width140"
          :options              ="Busqueda.listaBase"
        />
      </fieldset-filtro>      
    </q-tab-panel>
    <!-- //* /////////////////////////////////////////////////////// Tab 4 Crear Editar -->
    <q-tab-panel
      name                      ="tab_4"
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
  import {  useControlProductosDolibarr
                                } from "src/areas/productos/controllers/ControlProductosNew"
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
          productos,
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
                            } = useControlProductosDolibarr()

  type TEmit                  = {
    buscar          : [ value : IQuery  ]
    exportar        : [ value : void    ]
  }
  const emit                  = defineEmits<TEmit>()
  
  const totalACrear           = ref<number>(1)
  const hayProductosNuevos    = computed(()=> !!( productos.value /*.filter( p => p.esNuevo )*/ .length ) )  

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
  const siguientePagina           = computed(()=> b.value.siguientePagina( productos.value.length ) )
</script>