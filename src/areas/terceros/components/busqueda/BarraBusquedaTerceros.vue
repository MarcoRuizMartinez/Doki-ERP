<template>
  <q-tab-panels                 animated keep-alive vertical
    v-model                     ="tabs.activa"
    class                       ="transparent fit"
    >    
    <!-- //* /////////////////////////////////////////////////////// Tab 1 -->
    <q-tab-panel
      name                     ="tab_1"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <fieldset-filtro
        titulo                  ="Búsqueda"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Busqueda general -->        
        <input-buscar           clearable hundido
          v-model               ="b.f.buscar"
          label                 ="Búsqueda"
          class                 ="width200"
          icon                  ="mdi-account-search"
        />
        <!-- //* ///////////////////////////////////////////////// Comercial Tercero -->
        <select-usuario         hundido clearable
          v-model               ="b.f.usuario"
          class                 ="width200"
          label                 ="Asesor"
          :area                 ="usuario.area"
          :grupos               =[GRUPO_USUARIO.COMERCIALES]
          :readonly             ="!b.puedeCambiarUser"
        />
        <!-- //* ///////////////////////////////////////////////// Municipio -->
        <municipios             hundido
          v-model               ="b.f.municipio"
          class                 ="width200"
          tooltip               ="Municipio tercero"
        />
        <!-- //* ///////////////////////////////////////////////// Tercero interno o externo -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.tipoTercero"
          label                 ="Tipo tercero"
          icon                  ="mdi-account-switch"
          class                 ="width200"
          :options              ="Busqueda.listaTipoTercero"
        />
        <!-- //* ///////////////////////////////////////////////// Área o departamento -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.area"
          label                 ="Área"
          icon                  ="mdi-google-circles-extended"
          class                 ="width140"
          :options              ="Busqueda.listaAreas"
        />
        <!-- //* ///////////////////////////////////////////////// Tercero interno o externo -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.terceroInterno"
          label                 ="Interno Externo"
          icon                  ="mdi-circle-multiple"
          class                 ="width140"
          :options              ="Busqueda.listaTerceroInterno"
        />
        <!-- //* ///////////////////////////////////////////////// Tercero Activo o Inactivo -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.activo"
          label                 ="Activo"
          icon                  ="mdi-toggle-switch"
          class                 ="width140"
          :options              ="Busqueda.listaActivo"
        />
        <!-- //* ///////////////////////////////////////////////////// Con titulo  -->
        <q-toggle
          v-model               ="b.f.color"
          label                 ="Color"
        />
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Especiales"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Es favorito de comercial -->
        <favorito
          v-model               ="b.f.favorito"
          label                 ="Es favorito"
          class                 ="q-my-xs"
        />
        <!-- //* ///////////////////////////////////////////////// Es tercero famoso -->
        <favorito
          v-model               ="b.f.destacado"
          label                 ="Es famoso"
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
              :disable            ="b.queryVacia"
              @click              ="buscar"
              >
              <Tooltip label      ="Recargar"/>
            </q-btn>
          </div>
          <!-- //* /////////////////////////////////////////////// Boton limpiar 'btnRecargar -->
          <div>
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
          <!-- //* /////////////////////////////////////////////// Boton exportar -->
          <div>
            <q-btn                round push glossy
              v-if                ="permisos.terceros_exportar"
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
      <inner-loading :cargando    ="loading.carga || b.f.copiando"/>
    </q-tab-panel>
  </q-tab-panels>
  <!--
        <div
          v-if                    ="esMobil"
          class                   ="row full-width  justify-between"
          >
          <input-buscar           autofocus clearable hundido
            v-model               ="busqueda"
            label                 ="Buscar.."
            class                 ="col-8"
            @clear                ="limpiarBusqueda"
          />
          <q-btn                  push dense
            class                 ="col-auto"
            color                 ="positive"
            label                 ="Mas"
            icon                  ="mdi-magnify-plus"
            @click                ="filtroMovil =!filtroMovil "
          />
        </div>
        
        <fieldset-filtro
          v-else
          titulo                  ="Buscar"
          class-contenido         ="row q-gutter-sm"
          >

          <responsables           hundido inactivos
            v-if                  ="storeUser.permisos.acceso_total"
            class                 ="col-grow"
            v-model               ="responsable"
            :area                 ="storeUser.usuario.area"
            @clear                ="limpiarBusqueda"
          />          
          <municipios             hundido
            v-model               ="municipio"
            @clear                ="limpiarBusqueda"
          />
          <select-label-value     hundido clearable
            v-model               ="area"
            label                 ="Area"
            class                 ="col-grow"
            icon                  ="mdi-view-grid"
            :options              ="Areas"
            @clear                ="limpiarBusqueda"
          />          
          <favorito
            v-model               ="esFavorito"
            label                 ="Buscar favoritos"
            tooltip               ="Favorito"
          />
          <favorito
            v-model               ="esFamoso"
            label                 ="Buscar famosos"
            tooltip               ="Famoso"
          />          
          <input-buscar           clearable hundido
            v-model               ="filtro"
            label                 ="Filtrar busqueda"
            icon                  ="mdi-filter"
            :disable              ="modo == 'esperando-busqueda'"
          />
          <q-space/>
          <q-btn                  push dense
            v-if                  ="storeUser.permisos.terceros_exportar"
            icon                  ="mdi-microsoft-excel"
            color                 ="primary"
            :disable              ="modo == 'esperando-busqueda'"
            @click                ="descargarTerceros"
            >
            <Tooltip label        ="Descargar"/>
          </q-btn>
          <select-columnas
            v-model               ="columnasVisibles"
            :almacen              ="ALMACEN_LOCAL.COL_TERCEROS"
            :options              ="columnas"
          />          
        </fieldset-filtro>
        
-->
    <!-- //* //////////////////////////////////////////////////////// Busqueda Movil -->
<!--    
    <q-dialog
      v-model                     ="filtroMovil"
      v-bind                      ="style.dialogo"
      position                    ="bottom"
      >
      <fieldset-filtro
        titulo                    ="Buscar"
        class                     ="menu-gris full-width q-pt-sm"
        class-contenido           ="column q-gutter-sm"
        >
        <responsables             hundido inactivos
          v-if                    ="storeUser.permisos.acceso_total"
          v-model                 ="responsable"
          :area                   ="storeUser.usuario.area"
          @clear                  ="limpiarBusqueda"
        />
        <municipios               hundido
          v-model                 ="municipio"
          @clear                  ="limpiarBusqueda"
        />
        <select-label-value       hundido clearable
          v-model                 ="area"
          label                   ="Area"
          icon                    ="mdi-view-grid"
          :options                ="Areas"
          @clear                  ="limpiarBusqueda"
        />        
        <favorito
          v-model                 ="esFavorito"
          label                   ="Buscar favoritos"
          tooltip                 ="Favorito"
        />
        <favorito
          v-model                 ="esFamoso"
          label                   ="Buscar famosos"
          tooltip                 ="Famoso"
        />        
        <input-buscar             clearable hundido
          v-model                 ="filtro"
          label                   ="Filtrar busqueda"
          icon                    ="mdi-filter"
          :disable                ="modo == 'esperando-busqueda'"
        />        
        <select-columnas
          v-model                 ="columnasVisibles"
          label                   ="Columnas"
          :almacen                ="ALMACEN_LOCAL.COL_TERCEROS"
          :options                ="columnas"
        />
        <q-btn                    push dense
          v-if                    ="storeUser.permisos.terceros_exportar"
          icon                    ="mdi-microsoft-excel"
          color                   ="primary"
          label                   ="Descargar"
          :disable                ="modo == 'esperando-busqueda'"
          @click                  ="descargarTerceros"
        />
      </fieldset-filtro>      
    </q-dialog>
  -->
</template>
<script lang="ts" setup>
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  watch,
            computed,
                                } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp         } from 'stores/app'
  import {  useStoreUser        } from 'stores/user'
  import {  useStoreTercero     } from 'stores/terceros'
  // * /////////////////////////////////////////////////////////////////////// Componibles
  
  // * /////////////////////////////////////////////////////////////////////// Modelos  
  import {  IQuery, Busqueda    } from "src/models/Busqueda"
  import {  GRUPO_USUARIO       } from "src/models/TiposVarios"
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    selectUsuario         from "src/areas/usuarios/components/SelectUsuario.vue"
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    favorito              from "components/utilidades/StarFavorito.vue"
  import    innerLoading          from "components/utilidades/InnerLoading.vue"  
  import    inputBuscar           from "components/utilidades/input/InputSimple.vue"  
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    municipios            from "components/utilidades/select/SelectMunicipios.vue"  

  // * /////////////////////////////////////////////////////////////////////// Importaciones 
  const { usuario, permisos     } = storeToRefs( useStoreUser() )
  const { busqueda : b, 
          terceros,
          loading               } = storeToRefs( useStoreTercero() )
  const { tabs                  } = storeToRefs( useStoreApp() )
  const tab1                      = "tab_1"
  tabs.value                      = { activa : tab1, alerts: [ false ] }
  const emit = defineEmits<{
    (e: 'buscar',   value: IQuery ): void
    (e: 'limpiar',                ): void
    (e: 'exportar',               ): void
  }>()

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
    emit("buscar", query)
  }

  async function limpiarBusqueda(){
    const todoLimpio  = await b.value.limpiarQueryDeRouter()
    if(todoLimpio) emit("limpiar")
  }  

  // * /////////////////////////////////////////////////////////////////////// Computed
  const siguientePagina           = computed(()=> b.value.siguientePagina( terceros.value.length ) )  

</script>
