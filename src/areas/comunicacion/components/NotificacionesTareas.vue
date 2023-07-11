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
          class             ="col q-mr-sm"
          label             ="Tarea personal"
          icon              ="mdi-account-check"
          padding           ="2px 6px"
          @click            ="tareaPersonal"
          >
          <Tooltip>
            <span v-html    ="'Nueva tarea personal.<br/>Alt + S o Alt + M'"></span>
          </Tooltip>
        </q-btn>
        <q-btn 
          v-bind            ="style.btnElegante"
          label             ="Asignar tarea"
          class             ="col"
          icon              ="mdi-check-bold"
          padding           ="2px 6px"
          @click            ="tareaAsignada"
          >
          <Tooltip>
            <span v-html    ="'Asignar una tarea.<br/>Alt + A o Alt + O'"></span>
          </Tooltip>
        </q-btn>
        <q-btn 
          v-bind            ="style.btnElegante"
          class             ="col-12 q-mt-sm"
          label             ="Tareas que asigne"
          icon              ="mdi-account-supervisor-circle"
          :to               ="`/tareas?creador=${usuario.id}&cuando=1_2_3_4_5&progreso=0_25_50_75&limite=50&offset=0`"
        />
        <q-btn 
          v-bind            ="style.btnElegante"
          class             ="col-12 q-mt-sm"
          label             ="Mis tareas de hoy"
          icon              ="mdi-account-details"
          :to               ="`/tareas?usuario=${usuario.id}&limite=50&offset=0&cuando=2_3&progreso=0_25_50_75`"
        />          
      </div>
      <q-separator class    ="q-my-sm"/>      
      <div  class           ="row justify-between items-center">
        <span class         ="text-1_2em">Mis tareas de hoy</span>
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
          class             ="task radius-10 bg-grey-3 q-pa-sm q-mb-sm cursor-pointer"
          @click            ="()=>abrirFormularioTarea( t )"
          >
          <div>
            <span class     ="text-1_1em">
              <span 
                v-if        ="t.prioridad.value >= 1"
                class       ="text-1_3em"                
                >
                {{ t.prioridadEmoji }}
              </span>
              {{ t.titulo  }}
            </span>
            <Tooltip>
              Prioridad {{ t.prioridadLabel }}<br/>
              <span
                style       ="max-width: 300px;"
                class       ="ellipsis-3-lines"
                >
                {{ t.comentario }}
              </span>
            </Tooltip>
          </div>
          <div>
            Asignado por
            <chip-usuario   :usuario="t.creador"/>
            <q-btn          unelevated dense no-caps
              v-if          ="!t.usuarioEsCreador && !t.aceptado"
              label         ="Aceptar"
              icon          ="mdi-check-all"
              class         ="q-ml-xs"
              color         ="positive"
              @click        ="()=> cambiarAceptar( t )"
            />            
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
        @tarea-editada      ="recibirTareaEditada"
      />
    </q-dialog>
  </q-scroll-area>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watchEffect,
            onMounted,
            onUnmounted             } from 'vue'
  import {  usePageLeave,
            useMagicKeys            } from '@vueuse/core'
  
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
  import {  Usuario                 } from "src/areas/usuarios/models/Usuario"

  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    chipUsuario               from "src/areas/usuarios/components/ChipUsuario.vue"
  import    innerLoading              from "components/utilidades/InnerLoading.vue"
  import    formularioTarea           from "./FormularioTarea.vue"
  

  const adentro                 = ref<boolean>(false)
  const loading                 = ref<boolean>(false)
  const formularioOn            = ref<boolean>(false)

  const { usuario             } = storeToRefs( useStoreUser() )
  const { tareas, tarea,
          yaBusco,
          menuTareasOn        } = storeToRefs( useStoreAcciones() )  
  const { buscarAcciones,
          cambiarAceptar      } = useControlComunicacion()
  const usuarioAfuera           = usePageLeave()
  
  onMounted(iniciar)
  onUnmounted(()=> tareas.value = [])

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
                                    cuando    : "2_3",
                                    progreso  : "0_25_50_75",
                                    usuario   : usuario.value.id,
                                    user      : usuario.value.id
                                  }
      loading.value             = true
      tareas.value              = await buscarAcciones( q, "tareas" )
      yaBusco.value             = true
      loading.value             = false
    }
    
    await pausa( 60_000 )
    buscar()
  }

  function recibirTareaCreada( t : IAccion ){
    formularioOn.value        = false
    buscar()
  }

  function recibirTareaEditada( t : IAccion, cerrar : boolean = true )
  {
    const index               = tareas.value.findIndex( ( ti )=> ti.id === t.id )
    if( index >= 0 ){
      tareas.value[index]     = Object.assign( tareas.value[index], t )
      formularioOn.value      = !cerrar
    }

    buscar()
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
    tarea.value.asignado      = new Usuario()
    tarea.value.publico       = true

    formularioOn.value        = true
  }

  function abrirFormularioTarea( t : IAccion)
  {
    tarea.value               = t
    formularioOn.value        = true
  }

  const { alt_s, alt_m, alt_a, alt_o } = useMagicKeys()

  watchEffect(() => 
  {
    if(formularioOn.value) return 

    if ( alt_s.value || alt_m.value )
      tareaPersonal()
    if ( alt_a.value || alt_o.value )
      tareaAsignada()
      
  })  

</script>
<style>
.task{
  min-height: 50px;
  
}
</style>