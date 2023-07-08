<template>
  <div class                  ="full-width relative-position row q-pa-none no-wrap scroll">
    <!-- //* /////////////////////////////////////////////////// Fecha creacion -->
    <fieldset-filtro
      titulo                  ="Búsqueda"
      class-contenido         ="grilla-ribom"
      > 
      <!-- //* ///////////////////////////////////////////////// Cuando -->
      <multi-label-value
        v-model               ="b.f.cuando"
        label                 ="Cuando"
        class                 ="width160"
        icon                  ="mdi-calendar"
        :options              ="Cuando"
      />
      <!-- //* ///////////////////////////////////////////////// Prioridad -->
      <multi-label-value
        v-model               ="b.f.prioridad"
        label                 ="Prioridad"
        class                 ="width160"
        icon                  ="mdi-alarm-light"
        :options              ="Prioridades "
      />
      <!-- //* ///////////////////////////////////////////////// Prioridad -->
      <multi-label-value
        v-model               ="b.f.progreso"
        label                 ="Progreso"
        class                 ="width160"
        icon                  ="mdi-run-fast"
        :options              ="Progresos"
      />
      <slot name              ="filtro"></slot>
    </fieldset-filtro>
    <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET REF Y USUARIO  -->
    <fieldset-filtro
      titulo                  ="Usuarios"
      class-contenido         ="grilla-ribom"
      >
      <!-- //* ///////////////////////////////////////////////// Asignado -->
      <select-usuario         hundido clearable
        v-model               ="b.f.usuario"
        class                 ="width160"
        label                 ="Asignado"
        :grupos               ="[GRUPO_USUARIO.MIEMBRO]"
      />      
      <!-- //* ///////////////////////////////////////////////// Creador -->
      <select-usuario         hundido clearable
        v-model               ="b.f.creador"
        class                 ="width160"
        label                 ="Creador"
        :grupos               ="[GRUPO_USUARIO.MIEMBRO]"
      />
      <!-- //* ///////////////////////////////////////////////// Usuarios -->      
      <multi-label-value
        v-model               ="b.f.usuarios"
        label                 ="Asignados"
        class                 ="width160"
        icon                  ="mdi-account-multiple"
        :options              ="b.o.usuarios"
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
          :options            ="[ {value: 25,   label: '25' },
                                  {value: 50,   label: '50' },
                                  {value: 100,  label: '100' },
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
      <slot></slot>
      <!-- //* ///////////////////////////////////////////////// Botones -->
      <div class              ="row justify-around q-mt-sm">
        <!-- //* /////////////////////////////////////////////// Boton recargar -->
        <div>
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
        <!-- //* /////////////////////////////////////////////// Boton limpiar -->
        <div>
          <q-btn              round push glossy
            icon              ="mdi-close"
            padding           ="xs"
            color             ="primary"
            :disable          ="b.queryVacia"
            @click            ="limpiarBusqueda"
            >
            <Tooltip label    ="Limpiar búsqueda"/>
          </q-btn>
        </div>
        <!-- //* /////////////////////////////////////////////// Boton exportar -->
        <div>
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
    <fieldset-filtro
      titulo                  ="Acciones"
      class-contenido         ="grilla-ribom"
      >
      <div class              ="q-mb-sm">
        <q-btn              
          v-bind              ="style.btnBaseMd"
          icon                ="mdi-account-check"
          label               ="Tarea personal"
          color               ="info"
          class               ="width140"
          @click              ="emit('nuevaTarea', true)"
        >
          <Tooltip label      ="Nueva tarea personal"/>
        </q-btn>
      </div>
      <div>
        <q-btn              
          v-bind              ="style.btnBaseMd"
          icon                ="mdi-check-bold"          
          label               ="Asignar tarea"
          color               ="positive"
          class               ="width140"
          @click              ="emit('nuevaTarea', false)"
        />        
      </div>      
    </fieldset-filtro>    
    <inner-loading :cargando  ="loading?.carga ?? false"/>
  </div>
</template>
<script lang="ts" setup>
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  watch,
            computed            } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from "pinia"
  import {  useStoreAcciones    } from "src/stores/acciones"
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  IQuery              } from "src/models/Busqueda"
  import {  Cuando,
            Progresos,
            Prioridades         } from "src/areas/comunicacion/models/Accion"  
  import {  GRUPO_USUARIO       } from "src/models/TiposVarios"
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import {  style               } from "src/useSimpleOk/useEstilos"
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    innerLoading          from "components/utilidades/InnerLoading.vue"
  import    multiLabelValue       from "components/utilidades/select/SelectLabelValueMulti.vue"
  import    selectUsuario         from "src/areas/usuarios/components/SelectUsuario.vue"

  const { loading,
          busqueda : b  }   = storeToRefs( useStoreAcciones() )

  const { largo }           = defineProps< { largo : number }>()

  const emit                = defineEmits<{
    buscar:     [ value: IQuery ],
    limpiar:    [ value: void ],
    exportar:   [ value: void ],
    nuevaTarea: [ personal: boolean ],
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
    if(!busquedaCompleta.value) return
    emit("buscar", b.value.query)
  }

  async function limpiarBusqueda(){
    const todoLimpio  = await b.value.limpiarQueryDeRouter()
    if(todoLimpio) emit("limpiar")
  }  

  const busquedaCompleta          = computed(()=> true /* ( "fechaDesde"  in b.value.query &&
                                                    "fechaHasta"  in b.value.query
                                                  ) */
                                            )
  const siguientePagina           = computed(()=> b.value.siguientePagina( largo ) )  
</script>