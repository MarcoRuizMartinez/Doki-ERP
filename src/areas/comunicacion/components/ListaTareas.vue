<template>
  <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
  <q-table                        bordered dense flat
    class                         ="fit tabla-maco tabla-alto-min"
    row-key                       ="id"
    :filter                       ="filtro"
    :rows                         ="modelValue"
    :columns                      ="columnas"
    :visible-columns              ="columnasVisibles"
    :pagination                   ="{ sortBy: 'cuandoValue',  descending: false, }"
    :rows-per-page-options        ="[100]"
    @row-dblclick                 ="( e : Event, row : Object, i: number )=> emit( 'clickTarea', row as IAccion )"
    >
    <!-- //* ///////////////////  Columna Titulo  -->
    <template #body-cell-titulo   ="props">
      <q-td   :props              ="props">
        <span
          class                   ="cursor-pointer text-1_2em"
          @click                  ="emit( 'clickTarea', props.row )"
          >
          <span
            v-if                  ="props.row.prioridad.value >= 1"
            class                 ="text-1_3em"
            >
            {{ props.row.prioridadEmoji }}
          </span>
          {{ props.row.titulo }}
        </span>
        <Tooltip>
          Prioridad {{ props.row.prioridadLabel }}<br/>
          <span
            style                 ="max-width: 300px;"
            class                 ="ellipsis-3-lines"
            >
            {{ props.row.comentario }}
          </span>
        </Tooltip>
      </q-td>
    </template>
    <!-- //* ///////////////////  Columna Tipo y Tercero  -->
    <template #body-cell-tipoLabel="props">
      <q-td   :props              ="props">
        <q-btn                    rounded
          v-bind                  ="style.btnFlatMd"
          color                   ="primary"
          :label                  ="props.row.tipoLabel"
          type                    ="a"
          :to                     ="props.row.toTipo"
        />
        <q-btn
          v-if                    ="props.row.tieneTerceroYNoEsTercero"
          v-bind                  ="style.btnFlatMd"
          color                   ="primary"
          label                   ="🏪"
          type                    ="a"
          :to                     ="`/tercero/${props.row.terceroId}`"
          >
          <Tooltip label          ="Ver tercero"/>
        </q-btn>
      </q-td>
    </template>
    <!-- //* ///////////////////  Columna Progreso  -->
    <template #body-cell-progreso ="props">
      <q-td   :props              ="props">
        <progreso
          v-model                 ="props.row"
          class                   ="justify-around width110"
          size                    ="sm"
          @set                    ="( x100 : number ) => ejecutarCambiarProgreso( props.row.id, x100 )"
        />            
      </q-td>
    </template>  
    <!-- //* ///////////////////  Columna Cuando  -->
    <!-- @update:model-value   ="actualizar" -->
    <template
      #body-cell-cuandoLabel      ="props">
      <q-td   :props              ="props">
        <!-- //* //////////////   Cuando -->
        <select-label-value       no-filled
          v-if                    ="!props.row.esFecha"
          v-model                 ="props.row.cuando"
          :options                ="Cuando"
          :readonly               ="!props.row.usuarioPermitido"
          @update:model-value     ="()=> ejecutarCambiarCuando( props.row.id, props.row.cuando.value ) "
        />
        <span v-else>{{ props.row.cuandoLabel }}</span>
      </q-td>
    </template>
    <!-- //* ///////////////////  Columna Asignado  -->
    <template
      #body-cell-asignadoLabel    ="props">
      <q-td   :props              ="props">
        <chip-usuario             :usuario="props.row.asignado"/>
        <q-btn
          v-if                    ="!props.row.creadorEsAsignado"
          v-bind                  ="style.btnRedondoFlatSple"
          icon                    ="mdi-check-all"
          class                   ="q-ml-xs"
          :color                  ="props.row.aceptado ? 'info' : props.row.usuarioEsAsignado ? 'deep-orange-9' : 'grey-6' "
          @click                  ="()=> cambiarAceptar( props.row )"
          >
          <Tooltip  :label        ="props.row.aceptado ? 'Tarea aceptada' : 'Esperando aceptación'"/>
        </q-btn>
      </q-td>
    </template>
    <!-- //* ///////////////////  Columna Creador -->
    <template
      #body-cell-creadorLabel     ="props">
      <q-td   :props              ="props">
        <chip-usuario             :usuario="props.row.creador"/>
      </q-td>
    </template>        
    <!-- //* ///////////////////  Columna Editor  -->
    <template
      #body-cell-modificoLabel    ="props">
      <q-td   :props              ="props">
        <chip-usuario             :usuario="props.row.modifico"/>
      </q-td>
    </template>
    <!-- //* ///////////////////  Columna Privacidad  -->
    <template
      #body-cell-publicoLabel     ="props">
      <q-td   :props              ="props">
      <span @click                ="()=> cambiarPrivacidad( props.row )">
        {{ props.value }}
      </span>
      <inner-loading :cargando    ="props.row.editando" size="md"/>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            onMounted               } from "vue"

  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  style                   } from "src/composables/useEstilos"
  import {  useControlComunicacion  } from "src/areas/comunicacion/controllers/ControlComunicacion"
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  Columna, IColumna       } from "src/models/Tabla"
  import {  IAccion, Cuando         } from "src/areas/comunicacion/models/Accion"

  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    selectLabelValue          from "components/utilidades/select/SelectLabelValue.vue"
  import    progreso                  from "../components/Progreso.vue"
  import    chipUsuario               from "src/areas/usuarios/components/ChipUsuario.vue"
  import    innerLoading              from "components/utilidades/InnerLoading.vue"

  const { cambiarCuando,
          cambiarProgreso,
          cambiarAceptar,
          cambiarPrivacidad } = useControlComunicacion()

  type TEmit                  = {
    clickTarea      : [ value : IAccion ]
  }
  const emit                  = defineEmits<TEmit>()

  type TProps                 = {
    filtro                   ?: string
    columnas                  : IColumna[]
    columnasVisibles          : string[]
  }

  const { filtro = "" }       = defineProps< TProps     >()
  const modelValue            = defineModel< IAccion[]  >( { required: true })

  async function ejecutarCambiarProgreso( idTarea : number, progreso: number ){
    const ok              = await cambiarProgreso( idTarea, progreso )
  }

  async function ejecutarCambiarCuando( idTarea : number, cuando: number ){
    const ok              = await cambiarCuando( idTarea, cuando )
  }
</script>