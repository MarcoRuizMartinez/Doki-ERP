<template>
  <ventana                      scroll cerrar
    icono                       ="mdi-check"
    width                       ="440px"
    :titulo                     ="titulo"
    :cargando                   ="cargando"
    height-card-max             ="80vh"
    >
    <!-- loading.carga || loading.editar || loading.crear -->
    <template                   #barra
      v-if                      ="tarea.usuarioPermitido"
      >
      <efecto efecto            ="Down">
        <!-- //* //////////////////////////////////////////////////////////  Botones -->
        <q-btn
          v-if                  ="tarea.esNuevo"
          v-bind                ="style.btnBaseSm"
          color                 ="positive"
          icon                  ="mdi-check"
          label                 ="Crear"
          @click                ="validar"
        />
        <q-btn
          v-else-if             ="!modoEdicion"
          v-bind                ="style.btnBaseSm"
          color                 ="positive"
          icon                  ="mdi-lead-pencil"
          label                 ="Editar"
          @click                ="modoEdicion = true"
        />
        <div v-else>
          <q-btn
            v-bind              ="style.btnBaseSm"
            color               ="black"
            label               ="Cancelar"
            icon                ="mdi-close"            
            class               ="q-mr-sm"
            @click              ="modoEdicion = false"
          />          
          <q-btn
            v-bind              ="style.btnBaseSm"
            color               ="positive"
            icon                ="mdi-content-save"
            label               ="Guardar"
            @click              ="validar"
          />
        </div>
      </efecto>
    </template>
    <!-- //* /////////////  FORMULARIO  -->
    <q-form
      ref                   ="formulario"
      class                 ="col-12 row q-col-gutter-sm"
      @submit               ="onSubmit"
      >
      <!-- //* ///////////  Titulo  -->
      <input-text           clearable AZ09 alerta autofocus alert
        v-model             ="tarea.titulo"
        class               ="col-12"
        icon                ="mdi-check"
        label               ="Titulo"
        debounce            ="1"
        :readonly           ="readonly"
        @enter              ="validar"
      />
      <!-- //* ///////////  Usuario asignado -->
      <select-usuario
        v-model             ="tarea.asignado"
        label               ="Asignado"
        class               ="col-12 col-md-6"
        tooltip             ="Usuario asignado"
        :use-input          ="tarea.asignado.id < 1"
        :grupos             ="[GRUPO_USUARIO.MIEMBRO]"
        :readonly           ="readonly"
        @update:model-value="tarea.publico = !tarea.usuarioEsAsignado"
      />
      <progreso
        v-model             ="tarea"
        class               ="col-12 col-md-6 justify-around"
        size                ="md"
        @set                ="ejecutarCambiarProgreso"
      />
      <!-- //* ///////////  Cuando -->
      <select-label-value   use-input flat bordered
        v-model             ="tarea.cuando"
        label               ="Cuando"
        icon                ="mdi-calendar"
        class               ="col-12 col-md-6"
        :defecto            ="Cuando[1].label"
        :options            ="Cuando"
        :readonly           ="readonly"
      />
      <!-- //* ///////////  Prioridad -->
      <select-label-value   use-input flat bordered
        v-model             ="tarea.prioridad"
        label               ="Prioridad"
        icon                ="mdi-alarm-light"
        class               ="col-12 col-md-6"
        :defecto            ="Prioridades[0].label"
        :options            ="Prioridades"
        :readonly           ="readonly"
      />
      <!-- //* ///////////  Fecha inicio -->
      <input-fecha          alerta
        v-model             ="tarea.fechaInicio"
        label               ="Fecha"
        class               ="col-12 col-md-6"
        :class              ="{'op50' : !tarea.esFecha }"
        :disable            ="!tarea.esFecha"
        :readonly           ="readonly"
        @update:model-value ="cambiarFecha"
      />
      <!-- //* ///////////  Fecha fin -->
      <!-- <input-fecha          alerta
        v-model             ="tarea.fechaFin"
        label               ="Fecha final"
        class               ="col-12 col-md-6"            
        :class              ="{'op50' : !tarea.esFecha }"
        :desde              ="tarea.fechaInicio"
        :disable            ="!tarea.esFecha"
        :readonly           ="readonly"
      /> -->
      <!-- //* ///////////  Publico -->
      <q-checkbox
        v-model             ="tarea.publico" 
        label               ="Publico"
        color               ="positive"
        class               ="col-12 col-md-6"
        :disable            ="readonly"
      />              
      <!-- //* ///////////  Descripción  -->
      <q-input              filled dense autogrow
        v-model             ="tarea.comentario"
        label               ="Descripción"
        type                ="textarea"
        class               ="col-12"
        debounce            ="800"
        :readonly           ="readonly"
        >
        <template           #prepend >
          <q-icon name      ="mdi-subtitles-outline" />
        </template>
      </q-input>
      <documentos           minimizar puede-editar sin-titulo sin-subida
        v-if                ="!tarea.esNuevo"
        class               ="col-12"
        modulo              ="action"
        size-icon           ="2em"
        size-text-carga     ="1em"
        height-card-min     ="100px"
        :retraso-inicio     ="600"
        :sin-sombra         ="!!totalArchivos"
        :modulo-id          ="tarea.id"
        :modulo-ref         ="tarea.id.toString()"
        @descarga-ok        ="( f:IArchivo[] )=> totalArchivos = f.length"
        >
        <q-btn        
          v-bind            ="style.btnRedondoFlat"
          icon              ="mdi-file-upload"
          class             ="op60 op100-hover"
          target            ="_blank"
          :href             ="tarea.urlDolibarrFiles"          
          >
          <Tooltip label    ="Subir archivo en Dolibarr"/>
        </q-btn>     
      </documentos>
    </q-form>
  </ventana>
</template>
<script setup lang="ts">
  //* ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,
            computed,
            onMounted
                                  } from "vue"
  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreUser          } from "src/stores/user"
  //* ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAccion,
            Accion,
            Prioridades,
            Cuando,
            PropsAccion           } from "../models/Accion"
  import {  GRUPO_USUARIO         } from "src/models/TiposVarios"
  import {  IArchivo              } from "src/models/Archivo"  
  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useTools, confeti     } from "src/composables/useTools"
  import {  style                 } from "src/composables/useEstilos"
  import {  useControlComunicacion} from "../controllers/ControlComunicacion"
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    efecto                  from "components/utilidades/Efecto.vue"
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    selectLabelValue        from "components/utilidades/select/SelectLabelValue.vue"
  import    inputText               from "components/utilidades/input/InputFormText.vue"
  import    selectUsuario           from "src/areas/usuarios/components/SelectUsuario.vue"
  import    inputFecha              from "components/utilidades/input/InputFecha.vue"
  import    documentos              from "components/archivos/ModuloArchivos.vue"
  import    progreso                from "./Progreso.vue"
  
  const { crearAccion,
          editarAccion,
          cambiarProgreso   } = useControlComunicacion()
  const { usuario           } = storeToRefs( useStoreUser() )
  const { aviso             } = useTools()
  const tarea                 = ref< IAccion >( new Accion( usuario.value.id ) )
  const formulario            = ref< any      >()
  const modoEdicion           = ref< boolean  >(false)
  const cargando              = ref< boolean  >(false)
  const totalArchivos         = ref< number   >(0)
  const modelValue            = defineModel<IAccion>( { required: true })
  const emit                  = defineEmits<{
    tareaCreada:      [ value: IAccion ],
    tareaEditada:     [ tarea: IAccion, cerrar: boolean ],
  }>()  

  const { elementoId          = 0,
          tipo                = "",
          terceroId           = 0,
          proyectoId          = 0,
                              } = defineProps< PropsAccion >()

  

  watch(modelValue, (m)=>{
    tarea.value               = Object.assign( new Accion( usuario.value.id ), m)
  }, { immediate: true })
  
  //* ////////////////////////////////////////////////////////////////////////////////////// onMounted
  onMounted( async ()=>{
    if(tarea.value.esNuevo){
      asignarValoresATarea()
    }
  })

  //* ////////////////////////////////////////////////////////////////////////////////////// Validar
  async function validar()  {
    
    if(tarea.value.asignado.id < 1){
      aviso("negative", "Falta usuario asignado", "account" )
      return
    }
    
    const validacionOk      = await formulario.value.validate()
    if(validacionOk)          onSubmit()
  }

  //* ////////////////////////////////////////////////////////////////////////////////////// Submit
  function onSubmit() {
    if(tarea.value.esNuevo)
      crearTarea()
    else
      modificarTarea()
  }

  async function crearTarea()
  {
    cargando.value                = true
    const id                      = await crearAccion( tarea.value )
    cargando.value                = false
    if(!!id){
      tarea.value.id              = id
      tarea.value.comentario      = tarea.value.comentario.replaceAll("\n", "<br/>")
      aviso("positive", "Tarea creada", "shield" )
      emit("tareaCreada", tarea.value)
    }
  }

  async function modificarTarea(){
    const ok              = await editarAccion( tarea.value.id, tarea.value.accionToApiDolibarr )
    modoEdicion.value     = false
    if(ok){      
      aviso("positive", "Tarea editada", "shield" )
      emit("tareaEditada", tarea.value, true )
    }
  }

  async function ejecutarCambiarProgreso( progreso : number )
  {
    const ok              = await cambiarProgreso( tarea.value.id, progreso )
    
    if(ok){
      emit("tareaEditada", tarea.value, false )
    }
  }

  function asignarValoresATarea()
  {
    tarea.value.progreso    = 0
    tarea.value.elementoId  = elementoId
    tarea.value.tipo        = tipo
    tarea.value.terceroId   = terceroId
    tarea.value.creador     = usuario.value
    tarea.value.proyectoId  = proyectoId
  }

  function cambiarFecha()
  {
    if(tarea.value.fechaFin.valueOf() < tarea.value.fechaInicio.valueOf())
      tarea.value.fechaFin  = tarea.value.fechaInicio
  }


  const readonly            = computed(()=> !tarea.value.esNuevo && !modoEdicion.value )
  const titulo              = computed(()=>   tarea.value.esNuevo ? 'Nueva tarea'
                                            : modoEdicion.value   ? 'Editar tarea'
                                            : `Tarea al ${ tarea.value.progreso }%`
                                      )
</script>
