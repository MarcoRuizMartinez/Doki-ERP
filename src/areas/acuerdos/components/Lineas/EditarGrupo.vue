<template>
  <div
    v-if                  ="acuerdo.proGrupos.length > 1"
    class                 ="w-320px"
    >
    <!-- //* /////////////////////////////////////////////////////// Tres puntos -->
    <div>
      <q-icon
        v-if              ="acuerdo.esEstadoNoValidado" 
        name              ="mdi-dots-vertical"
        size              ="xs"
        class             ="cursor-pointer"
        style             ="margin-top: -4px;"
      />
      {{grupo.conTitulo ? grupo.titulo : 'Grupo ' + ( grupo.index + 1 )}}
    </div>
    <!-- //* /////////////////////////////////////////////////////// Popup Edit nombre -->
    <q-popup-edit         auto-save fit 
      v-if                ="acuerdo.esEstadoNoValidado" 
      v-model             ="grupo.titulo"
      v-slot              ="scope"
      class               ="row panel-blur70 q-col-gutter-xs"
      max-width           ="320px"
      :persistent         ="loading.editarGrupo"
      @update:model-value ="(titulo : string)=> editarTituloGrupo(titulo, grupo)"
      >
      <!-- //* ///////////////////////////////////////////////////// Con titulo  -->
      <!-- <q-toggle
        v-model           ="grupo.conTitulo"
        label             ="Con titulo"
        class             ="col-6"
      /> -->              
      <!-- //* ///////////////////////////////////////////////////// Nombre Grupo -->
      <q-input            dense filled
        v-model           ="scope.value"
        label             ="Nombre de grupo"
        class             ="col-10"
        :disable          ="!grupo.conTitulo"
        @keyup.enter      ="scope.set"
      />
      <!-- //* ///////////////////////////////////// Botones ordenar grupos -->
      <div class          ="col-2 column">
        <!-- //* //////////////////////////////// Boton subir grupo -->
        <q-btn            v-close-popup
          v-bind          ="style.btnFlatSm"
          class           ="full-width col-6"
          icon            ="mdi-menu-up"
          :disable        ="grupo.index == 0"
          @click          ="moverGrupo( grupo.index, 'subir' )"
          >
          <Tooltip>Subir grupo</Tooltip>
        </q-btn>
        <!-- //* //////////////////////////////// Boton bajar grupo -->
        <q-btn            v-close-popup
          v-bind          ="style.btnFlatSm"
          class           ="full-width col-6"
          icon            ="mdi-menu-down"
          :disable        ="grupo.index == acuerdo.proGrupos.length-1"
          @click          ="moverGrupo( grupo.index, 'bajar' )"
          >
          <Tooltip>Bajar grupo</Tooltip>
        </q-btn>              
      </div>

      <!-- //* ///////////////////////////////////////////////////// Boton borrar grupo -->
      <div class          ="col-6" v-if="false">
        <q-btn         
          v-bind          ="style.btnBaseMd"
          label           ="Borrar grupo"
          class           ="q-mt-sm"
          color           ="negative"
          icon            ="mdi-trash-can-outline"
          >
          <q-menu         transition-show="jump-down" transition-hide="jump-up"
            class         ="panel-blur70" auto-close
            >
            <div class    ="column q-ma-md gap-md">
              <!-- //* ///////////////////////////////////// Boton borrar mantener productos -->
              <q-btn
                v-bind    ="style.btnBaseMd"
                label     ="Mantener productos"
                class     ="full-width"
                color     ="positive"
              />
              <!-- //* ///////////////////////////////////// Boton borrar - borrar productos -->
              <q-btn        
                v-bind    ="style.btnBaseMd"
                label     ="Borrar productos"
                class     ="full-width"
                color     ="negative"
              />                        
            </div>
          </q-menu>                    
        </q-btn>                  
      </div>
      <!-- //* //////////////////////////////// Loading edicion -->
      <q-inner-loading
        :showing          ="loading.editarGrupo"
        label             ="Actualizando..."
        label-class       ="text-teal"
        label-style       ="font-size: 1.1em"
      />
    </q-popup-edit>
  </div>
</template>
<script lang="ts" setup>
/*
@click="borrarGrupo(grupo, 'conservar')"
@click="borrarGrupo(grupo, 'borrar')"
*/
  //* //////////////////////////////////////////////////////////////////////////////// Core
  import {  PropType            } from "vue"
  //* //////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'  
  //* //////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"  
  import {  style               } from "src/useSimpleOk/useEstilos"
  //* //////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IGrupoLineas        } from "src/areas/acuerdos/models/GrupoLineasAcuerdo"
  

  const { acuerdo, loading      } = storeToRefs( useStoreAcuerdo() )  
  const { moverGrupo,
          editarTituloGrupo     } = useControlProductos()

  const props                     = defineProps({
    grupo:      { required: true, type: Object as PropType< IGrupoLineas > },
  })
</script>
<style>
.w-320px{
  width: 320px;
}
</style>