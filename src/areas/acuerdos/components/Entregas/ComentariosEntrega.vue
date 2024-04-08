<template>
  <div v-bind               ="$attrs">
    <q-btn                  dense flat round
      icon                  ="mdi-comment-text-multiple"
      size                  ="md"
      @click                ="popupOn = true"
      >
      <q-badge              floating rounded
        v-if                 ="!!entrega.comentarios.length"
        color               ="red"
        >
        {{ entrega.comentarios.length }}
      </q-badge>
      <Tooltip>{{ !!entrega.comentarios.length ? 'Ver mensajes' : 'Dejar un mensaje'}}</Tooltip>
    </q-btn>
  </div>
  <!-- //* ///////////////////////////////////////////////////////////// Modal calendario de enventos de acuerdo -->
  <q-dialog                 
    v-model                 ="popupOn"
    v-bind                  ="style.dialogo"
    >
    <ventana                cerrar
      titulo                ="Mensajes"
      icono                 ="mdi-android-messages"
      class-contenido       ="column items-center"
      padding-contenido     ="0"
      min-width             ="390px"
      >
      <template             #barra>
        <q-btn
          v-bind            ="style.btnBaseSm"
          color             ="positive"
          label             ="Nueva tarea"
          icon              ="mdi-checkbox-marked-outline"
          @click            ="formularioTarea=true"
          >
        </q-btn>
      </template>
      <chat
        v-model             ="entrega.comentarios"
        v-model:tarea-on    ="formularioTarea"
        :cargando
        :asignado           ="acuerdo.comercial"
        :elemento-id        ="entrega.id"
        :tipo               ="Accion.getTipoByAcuerdo( entrega.tipo )"
        :terceroId          ="entrega.tercero.id"
        :proyectoId         ="entrega.proyecto.id"
        :chat-abierto       ="popupOn"
        :funcion-buscar     ="()=> buscarComentarios( entrega )"
      />
    </ventana>
  </q-dialog>  
</template> 

<script setup lang="ts">

  // * ///////////////////////////////////////////////////////////////////////////// Core
  import {  ref, onMounted        } from "vue"  

  //* ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'stores/acuerdo'

  //* ///////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAcuerdo              } from "../../models/Acuerdo"  

  //* ///////////////////////////////////////////////////////////////////////////// Componibles
  import {  style                 } from "src/composables/useEstilos"
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  Accion                } from "src/areas/comunicacion/models/Accion"  

  //* ///////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"    
  import    chat                    from "src/areas/comunicacion/components/ChatMensajes.vue"

  type TProps                       = { entrega : IAcuerdo}
  const { entrega }                 = defineProps<TProps>()
  const { acuerdo }                 = storeToRefs( useStoreAcuerdo() )
  const { buscarComentarios       } = useControlAcuerdo()

  const popupOn                     = ref<boolean>(false)
  const cargando                    = ref<boolean>(false)
  const formularioTarea             = ref<boolean>(false)    

  onMounted( buscarComentariosEntrega )

  async function buscarComentariosEntrega()
  {
    cargando.value                  = true
    await buscarComentarios( entrega )     
    cargando.value                  = false
  }
</script>