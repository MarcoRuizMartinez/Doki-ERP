<template>
  <div class                  ="full-width relative-position row q-pa-none no-wrap scroll">
    <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET REF Y USUARIO  -->
    <fieldset-filtro
      titulo                  ="Lugares"
      class-conenido          ="grilla-ribom"
      >
      <!-- //* ///////////////////////////////////////////////// Origen -->
      <municipios             hundido alerta
        v-model               ="b.f.municipio"
        class                 ="width200"
        label                 ="Origen"
      />
      <!-- //* ///////////////////////////////////////////////// Destino -->
      <municipios             hundido alerta
        v-model               ="b.f.municipioContacto"
        class                 ="width200"
        label                 ="Destino"
      />
    </fieldset-filtro>
    <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET VALOR -->
    <fieldset-filtro
      titulo                  ="Peso y Valor"
      class-conenido          ="grilla-ribom"
      >
      <!-- //* ///////////////////////////////////////////////// Peso -->
      <numero-paso            hundido alerta
        v-model               ="b.f.peso"
        label                 ="Peso KG"
        :debounce             ="600"    
        modo                  ="right"
        class                 ="width160"
        :minimo               ="1"        
      /> 
      <!-- //* ///////////////////////////////////////////////// Valor envio -->
      <input-number           hundido clearable
        v-model               ="b.f.valorMax"
        label                 ="Valor"
        icon                  ="mdi-currency-usd"
        class                 ="width160"
        :minimo               ="1000"
        :maximo               ="999_999_999"
      />
    </fieldset-filtro>
    <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET ESTADOS -->
    <fieldset-filtro
      titulo                  ="Medidas"
      class-conenido          ="grilla-ribom"
      >
      <!-- //* ///////////////////////////////////////////////// Precio Maximo -->
      <input-number           hundido clearable
        v-model               ="b.f.altura"
        label                 ="Altura CM"
        icon                  ="mdi-tape-measure"
        class                 ="width160"
        :minimo               ="10"
        :maximo               ="1000"
      />
      <!-- //* ///////////////////////////////////////////////// Precio Maximo -->
      <input-number           hundido clearable
        v-model               ="b.f.largo"
        label                 ="Largo CM"
        icon                  ="mdi-tape-measure"
        class                 ="width160"
        :minimo               ="10"
        :maximo               ="1000"
      />
      <!-- //* ///////////////////////////////////////////////// Precio Maximo -->
      <input-number           hundido clearable
        v-model               ="b.f.ancho"
        label                 ="Ancho CM"
        icon                  ="mdi-tape-measure"
        class                 ="width160"
        :minimo               ="10"
        :maximo               ="1000"
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
  import {  useStoreNomina      } from "src/stores/nomina"

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  IQuery, Busqueda    } from "src/models/Busqueda"

  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"  
  import    numeroPaso            from "components/utilidades/input/InputNumeroPaso.vue"
  import    innerLoading          from "components/utilidades/InnerLoading.vue"
  import    municipios            from "components/utilidades/select/SelectMunicipios.vue"

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
    if(!busquedaCompleta.value) return
    
    b.value.query.municipio         = b.value.f.municipio         .codigoDianLargo
    b.value.query.municipioContacto = b.value.f.municipioContacto .codigoDianLargo
    const cosa = Object.assign( {}, b.value.query)
    cosa.municipio         = b.value.f.municipio         .codigoDianLargo
    cosa.municipioContacto = b.value.f.municipioContacto .codigoDianLargo
    emit("buscar", cosa)
  }

  function limpiarBusqueda(){
    const todoLimpio  = b.value.limpiarQueryDeRouter()
    if(todoLimpio) emit("limpiar")
  }

  const siguientePagina           = computed(()=> b.value.siguientePagina( incentivos.value.length ) )
  const busquedaCompleta          = computed(()=> ("municipio" in b.value.query && "municipioContacto" in b.value.query && "peso" in b.value.query) )
</script>
