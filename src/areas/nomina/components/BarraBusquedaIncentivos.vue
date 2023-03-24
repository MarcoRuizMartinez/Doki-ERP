<template>
  <div class                  ="full-width relative-position row q-pa-none no-wrap scroll">
    <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET REF Y USUARIO  -->
    <fieldset-filtro
      titulo                  ="Búsqueda"
      class-conenido          ="column q-gutter-xs"
      >
      <!-- //* ///////////////////////////////////////////////// Busqueda general -->        
      <input-buscar           clearable hundido
        v-model               ="b.f.buscar"
        label                 ="Búsqueda Ref"
        class                 ="width200"
        icon                  ="mdi-magnify"
      />
      <!-- //* ///////////////////////////////////////////////// Usuario -->
      <select-usuario         hundido clearable
        v-model               ="b.f.usuario"
        class                 ="width200"
        label                 ="Usuario"
        :readonly             ="!b.puedeCambiarUser"
        :grupos               =[GRUPO_USUARIO.EN_NOMINA]
      />
    </fieldset-filtro>
    <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET VALOR -->
    <fieldset-filtro
      titulo                  ="Valor"
      class-conenido          ="column q-gutter-xs"
      >
      <!-- //* ///////////////////////////////////////////////// Precio Minimo -->
      <input-number           hundido clearable
        v-model               ="b.f.valorMin"
        label                 ="Mínimo"
        icon                  ="mdi-currency-usd"
        class                 ="width160"
        :minimo               ="0"
        :maximo               ="!!b.f.valorMax ? b.f.valorMax : undefined"
      />
      <!-- //* ///////////////////////////////////////////////// Precio Maximo -->
      <input-number           hundido clearable
        v-model               ="b.f.valorMax"
        label                 ="Máximo"
        icon                  ="mdi-currency-usd"
        class                 ="width160"
        :minimo               ="!!b.f.valorMin ? b.f.valorMin : undefined"
        :maximo               ="999_999_999"
      />
    </fieldset-filtro>
    <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET ESTADOS -->
    <fieldset-filtro
      titulo                  ="Estado"
      class-conenido          ="column q-gutter-xs"
      >
      <!-- //* ///////////////////////////////////////////////// Estado -->
      <select-label-value     use-input hundido clearable flat bordered
        v-model               ="b.f.incEstado"
        label                 ="Estado"
        icon                  ="mdi-file-check"
        class                 ="width180"
        :options              ="Incentivo.estados"
      />
      <!-- //* ///////////////////////////////////////////////// Pagado -->
      <select-label-value     use-input hundido clearable flat bordered
        v-model               ="b.f.incPago"
        label                 ="Pago"
        icon                  ="mdi-cash-check"
        class                 ="width180"
        :options              ="Incentivo.estadosPago.filter( e => e.visible )"
      />    
    </fieldset-filtro>  
    <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET Paginación -->
    <fieldset-filtro
      titulo                  ="Paginas"
      class-conenido          ="grilla-ribom fit"
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
      class-conenido          ="grilla-ribom"
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
        <!-- //* /////////////////////////////////////////////// Boton limpiar -->
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
    <inner-loading :cargando    ="loading.carga"/>
  </div>
</template>
<script lang="ts" setup>
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  watch,
            computed            } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from "pinia"
  import {  useStoreUser        } from "src/stores/user"
  import {  useStoreNomina      } from "src/stores/nomina"

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  Incentivo           } from "src/areas/nomina//models/Incentivo"            
  import {  GRUPO_USUARIO       } from "src/models/TiposVarios"
  import {  IQuery, Busqueda    } from "src/models/Busqueda"

  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    selectUsuario         from "src/areas/usuarios/components/SelectUsuario.vue"
  import    inputBuscar           from "src/components/utilidades/input/InputSimple.vue"
  import    innerLoading          from "src/components/utilidades/InnerLoading.vue"

  const { incentivos,
          loading,
          incentivosSearch : b  } = storeToRefs( useStoreNomina() )

  // * /////////////////////////////////////////////////////////////////////// Router
    
  const emit = defineEmits<{
    (e: 'buscar',   value: IQuery ): void
    (e: 'limpiar',                ): void
    (e: 'exportar',               ): void    
  }>()

  watch(()=>b.value.f, ()=>
  {
            if(b.value.puedeBuscar) buscar()
      else  if(b.value.queryVacia ) limpiarBusqueda()
    },
    { deep: true }
  )

  function buscar()
  {
    b.value.copiarQueryARourter()
    emit("buscar", b.value.query)
  }

  function limpiarBusqueda(){
    const todoLimpio  = b.value.limpiarQueryDeRouter()
    if(todoLimpio) emit("limpiar")
  }  

  const siguientePagina           = computed(()=> b.value.siguientePagina( incentivos.value.length ) )
</script>
