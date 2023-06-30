<template>
  <q-scroll-area
    class                   ="fit fill-available"
    @mouseover              ="adentro = true"
    @mouseleave             ="salir"
    >
    <div
      class                 ="q-pa-md"     
      >
      <div class            ="fuente-delicada text-1_4em q-mb-md">Tareas</div>
      <div class            ="row">
        <q-btn 
          v-bind            ="style.btnElegante"
          class             ="col-12 q-mb-sm"
          label             ="Tareas que asigne"
          :to               ="`/tareas?creador=${usuario.id}&cuando=1_2_3_4_5&progreso=0_25_50_75&limite=50&offset=0`"
        />
        <q-btn 
          v-bind            ="style.btnElegante"
          class             ="col q-mr-sm"
          label             ="Tarea personal"
          @click            ="tareaPersonal"
          >
          <Tooltip  label   ="Nueva tarea personal"/>
        </q-btn>
        <q-btn 
          v-bind            ="style.btnElegante"
          class             ="col"
          label             ="Asignar tarea"
          @click            ="tareaAsignada"
          >
          <Tooltip  label   ="Asignar una tarea"/>
        </q-btn>        
      </div>
      <q-separator class    ="q-my-sm"/>      
      <div  class           ="row justify-between items-center">
        <q-btn              flat rounded          
          label             ="Mis tareas de hoy"
          :to               ="`/tareas?usuario=${usuario.id}&limite=50&offset=0&cuando=2&progreso=0_25_50_75`"
        />           
        <q-btn              flat round dense
          icon              ="mdi-refresh"
          class             ="op60 op100-hover "
          @click            ="buscar"
        />
      </div>
      <div class            ="q-mt-sm">
        <div
          v-for             ="(t, index) of tareas"
          :key              ="index"
          class             ="task radius-10 bg-grey-3 q-pa-sm q-mb-sm"
          >
          <div>
            <span class     ="text-1_1em">
              <span class   ="text-1_3em">{{ t.prioridadEmoji }}</span>
              {{ t.titulo  }}
            </span>
            <Tooltip>Prioridad {{ t.prioridadLabel }}<br/> {{ t.comentario }}</Tooltip>
          </div>
          <div>
            Asignado por
            <chip-usuario :usuario="t.asignado"/>
          </div>
        </div>
      </div>
    </div>
    <inner-loading :cargando="loading"/>
    <q-dialog
      v-model               ="formularioOn"
      v-bind                ="style.dialogo"
      >
      <formulario-tarea
        v-model             ="tarea"
        :tipo               ="TASK"
        @tarea-creada       ="recibirTareaCreada"
      />
    </q-dialog>
  </q-scroll-area>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            onMounted               } from 'vue'
  import {  usePageLeave            } from '@vueuse/core'
  
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs             } from 'pinia'
  import {  useStoreAcciones        } from 'src/stores/acciones'
  import {  useStoreUser            } from 'src/stores/user'

  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  pausa                   } from "src/useSimpleOk/useTools"
  import {  useControlComunicacion  } from "src/areas/comunicacion/controllers/ControlComunicacion"
  import {  style                   } from "src/useSimpleOk/useEstilos"

  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAccion, Accion, TASK   } from "../models/Accion"
  import {  IQuery                  } from "src/models/Busqueda"

  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    chipUsuario               from "src/areas/usuarios/components/ChipUsuario.vue"
  import    innerLoading              from "components/utilidades/InnerLoading.vue"
  import    formularioTarea           from "./FormularioTarea.vue"

  const adentro                 = ref<boolean>(false)
  const loading                 = ref<boolean>(false)
  const formularioOn            = ref<boolean>(false)

  const { usuario             } = storeToRefs( useStoreUser() )
  const { tareas, tarea,
          menuTareasOn        } = storeToRefs( useStoreAcciones() )  
  const { buscarAcciones      } = useControlComunicacion()
  const usuarioAfuera           = usePageLeave()
  
  

  onMounted(iniciar)

  async function iniciar()
  {
    await pausa( 5_000 )
    buscar()
  }

  async function buscar()
  {
    if(!usuarioAfuera.value)
    {
      const q : IQuery          = {
                                    codigo    : "AC_OTH",
                                    cuando    : "2",
                                    progreso  : "0_25_50_75",
                                    usuario   : usuario.value.id,
                                    user      : usuario.value.id
                                  }
      loading.value             = true
      tareas.value              = await buscarAcciones( q, "tareas" )
      loading.value             = false
    }
    
    await pausa( 60_000 )
    buscar()
  }

  function recibirTareaCreada( t : IAccion ){
    formularioOn.value        = false
  }


  function salir()
  {
    if(adentro.value && !loading.value ){
      menuTareasOn.value      = false
      adentro.value           = false
    } 
  }

  function tareaPersonal()
  {
    tarea.value               = new Accion( usuario.value.id )
    tarea.value.asignado      = usuario.value
    tarea.value.publico       = false
    

    formularioOn.value        = true
  }
  
  function tareaAsignada()
  {
    tarea.value               = new Accion( usuario.value.id )
    //tarea.value.asignado      = usuario.value    
    tarea.value.publico       = true

    formularioOn.value        = true
  }

</script>
<style>
.task{
  min-height: 50px;
  
}
</style>