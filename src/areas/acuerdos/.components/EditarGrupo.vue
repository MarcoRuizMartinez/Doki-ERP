<template>
  <div
    v-if              ="cotizacion.proGrupos.length > 1"
    class             ="w-320px"
    >
    <!-- //* /////////////////////////////////////////////////////// Tres puntos -->
    <div>
      <q-icon
        v-if          ="cotizacion.estado === ESTADO_CTZ.BORRADOR" 
        name          ="mdi-dots-vertical"
        size          ="xs"
        class         ="cursor-pointer"
        style         ="margin-top: -4px;"
      />
      {{grupo.conTitulo ? grupo.titulo : 'Grupo ' + ( grupo.index + 1 )}}
    </div>
    <!-- //* /////////////////////////////////////////////////////// Popup Edit nombre -->
    <q-popup-edit     auto-save fit 
      v-if            ="cotizacion.estado === ESTADO_CTZ.BORRADOR" 
      v-model         ="grupo.titulo"
      v-slot          ="scope"
      class           ="row panel-blur70 q-col-gutter-xs"
      max-width       ="320px"
      :persistent     ="cargandoMenuGrupo"
      @update:model-value ="(titulo)=> editarTituloGrupo(titulo, grupo)"
      >
      <!-- //* ///////////////////////////////////////////////////// Con titulo  -->
      <!-- <q-toggle
        v-model       ="grupo.conTitulo"
        label         ="Con titulo"
        class         ="col-6"
      /> -->              
      <!-- //* ///////////////////////////////////////////////////// Nombre Grupo -->
      <q-input        dense filled
        v-model       ="scope.value"
        label         ="Nombre de grupo"
        class         ="col-10"
        :disable      ="!grupo.conTitulo"
        @keyup.enter  ="scope.set"
      />
      <!-- //* ///////////////////////////////////// Botones ordenar grupos -->
      <div class      ="col-2 column">
        <!-- //* //////////////////////////////// Boton subir grupo -->
        <q-btn        v-close-popup
          v-bind      ="btnFlatSm"
          class       ="full-width col-6"
          icon        ="mdi-menu-up"
          :disable    ="grupo.index == 0"
          @click      ="moverGrupo( grupo.index, 'subir' )"
          >
          <Tooltip>Subir grupo</Tooltip>
        </q-btn>
        <!-- //* //////////////////////////////// Boton bajar grupo -->
        <q-btn        v-close-popup
          v-bind      ="btnFlatSm"
          class       ="full-width col-6"
          icon        ="mdi-menu-down"
          :disable    ="grupo.index == cotizacion.proGrupos.length-1"
          @click      ="moverGrupo( grupo.index, 'bajar' )"
          >
          <Tooltip>Bajar grupo</Tooltip>
        </q-btn>              
      </div>

      <!-- //* ///////////////////////////////////////////////////// Boton borrar grupo -->
      <div class      ="col-6" v-if="false">
        <q-btn         
          v-bind      ="btnBaseMd"
          label       ="Borrar grupo"
          class       ="q-mt-sm"
          color       ="negative"
          icon        ="mdi-trash-can-outline"
          >
          <q-menu     transition-show="jump-down" transition-hide="jump-up"
            class     ="panel-blur70" auto-close
            >
            <div class="column q-ma-md gap-md">
              <!-- //* ///////////////////////////////////// Boton borrar mantener productos -->
              <q-btn
                v-bind="btnBaseMd"
                label ="Mantener productos"
                class ="full-width"
                color ="positive"
                @click="emit('borrarConservar', grupo)"
              />
              <!-- //* ///////////////////////////////////// Boton borrar - borrar productos -->
              <q-btn        
                v-bind="btnBaseMd"
                label ="Borrar productos"
                class ="full-width"
                color ="negative"
                @click="emit('borrarTodo', grupo)"
              />                        
            </div>
          </q-menu>                    
        </q-btn>                  
      </div>
      <!-- //* //////////////////////////////// Loading edicion -->
      <q-inner-loading
        :showing      ="cargandoMenuGrupo"
        label         ="Actualizando..."
        label-class   ="text-teal"
        label-style   ="font-size: 1.1em"
      />
    </q-popup-edit>
  </div>
</template>
<script lang="ts" setup>
/*
@click="borrarGrupo(grupo, 'conservar')"
@click="borrarGrupo(grupo, 'borrar')"
*/
  import {  ref,
            PropType,
            toRefs
                              } from "vue"
  import {  ICotizacion,
            ESTADO_CTZ        } from "src/areas/acuerdos/cotizaciones/models/Cotizacion"
  import {  IGrupoLineas      } from "src/areas/acuerdos/.models/GrupoLineasAcuerdo"
  import {  useTools          } from "src/useSimpleOk/useTools"
  import {  useApiDolibarr    } from "src/services/useApiDolibarr"
  import {  btnBaseMd,
            btnFlatSm         } from "src/useSimpleOk/useEstilos"
  import {  mayusculasPrimeraLetra
                            } from "src/useSimpleOk/useTools"

  const cargandoMenuGrupo       = ref< boolean >( false )
  const { apiDolibarr         } = useApiDolibarr()
  const { aviso               } = useTools()
  const emit = defineEmits<{
    (e: 'borrarConservar',value: IGrupoLineas   ): void
    (e: 'borrarTodo',     value: IGrupoLineas   ): void
    (e: 'moverGrupo',     value: void           ): void
    

//@click="borrarGrupo(grupo, 'conservar')"
//@click="borrarGrupo(grupo, 'borrar')"    
  }>()
  const props                   = defineProps({
    cotizacion: { required: true, type: Object as PropType< ICotizacion > },
    grupo:      { required: true, type: Object as PropType< IGrupoLineas > },
  })
  const { cotizacion }          = toRefs( props )

  async function editarTituloGrupo( nuevoTitulo :string , grupo : IGrupoLineas )
  {
    grupo.titulo            = mayusculasPrimeraLetra( nuevoTitulo ).trim()
    cargandoMenuGrupo.value = true
    let lineaEdit           = { id: grupo.lineaIdTitulo, label: grupo.titulo }
    let {ok, data}          = await apiDolibarr("editar", "lineaCotizacion", lineaEdit, cotizacion.value.id)
    if(!ok) aviso("negative", "Error al cambiar nombre de grupo")
    cargandoMenuGrupo.value = false
  }

  function moverGrupo( index: number, accion: "subir" | "bajar" )
  {
    let ope                     = accion == "subir" ? -1 : 1
    cotizacion.value.proGrupos[ index      ].index = index + ope
    cotizacion.value.proGrupos[ index + ope].index = index
    cotizacion.value.proGrupos  = cotizacion.value.proGrupos.sort ( ( a : IGrupoLineas, b : IGrupoLineas ) =>
                                  {
                                    if(a.index < b.index) return -1
                                    if(a.index > b.index) return 1
                                    return 0
                                  })
    emit("moverGrupo")
  }

</script>
<style>
.w-320px{
  width: 320px;
}
</style>