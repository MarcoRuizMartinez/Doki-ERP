<template>
  <div class                  ="full-width relative-position row q-pa-none no-wrap scroll">
    <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET REF Y USUARIO  -->
    <fieldset-filtro
      titulo                  ="Búsqueda"
      class-contenido         ="column q-gutter-xs"
      >
      <!-- //* ///////////////////////////////////////////////// Busqueda general -->        
      <input-buscar           clearable hundido
        v-model               ="b.f.buscar"
        label                 ="Búsqueda Ref"
        class                 ="width200"
        icon                  ="mdi-magnify"
      />
      <slot name              ="filtro"></slot>
    </fieldset-filtro>
    <!-- //* /////////////////////////////////////////////////// Fecha creacion -->
    <fieldset-filtro
      titulo                  ="Creación"
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
    <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET Paginación -->
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
          :options            ="[ {value: 5,      label: '5',   },
                                  {value: 10,     label: '10',   },
                                  {value: 30,     label: '30',   },                                  
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
      class-contenido         ="grilla-ribom"
      >
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
    <inner-loading :cargando    ="loading?.carga ?? false"/>
  </div>
</template>
<script lang="ts" setup>
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  toRefs,
            watch,
            computed            } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from "pinia"
  import {  useStoreAcuerdo     } from "stores/acuerdo"

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  IQuery              } from "src/models/Busqueda"

  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    inputBuscar           from "components/utilidades/input/InputSimple.vue"
  import    inputFecha            from "components/utilidades/input/InputFecha.vue"
  import    innerLoading          from "components/utilidades/InnerLoading.vue"

  const { loading,
          busqueda : b  }   = storeToRefs( useStoreAcuerdo() )

  const props               = defineProps({
    largo: { required: true, type: Number },
  })

  const { largo }           = toRefs( props )

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
    emit("buscar", b.value.query)
  }

  async function limpiarBusqueda(){
    const todoLimpio  = await b.value.limpiarQueryDeRouter()
    if(todoLimpio) emit("limpiar")
  }  

  const siguientePagina           = computed(()=> b.value.siguientePagina( largo.value ) )
</script>
