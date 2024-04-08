<template>
  <!-- //* /////////////////////////////////////////////////////// Boton nueva Tarea -->
  <q-btn                    round unelevated
    v-if                    ="fix"
    color                   ="positive"
    icon                    ="mdi-check"
    @click                  ="abrirFormularioTarea"
    >
    <Tooltip label          ="Nueva tarea"/>
  </q-btn>  
  <div
    v-bind                  ="$attrs"
    class                   ="chat column justify-between"
    :class                  ="fix ? 'chat-fix panel-blur-70 shadow-6 radius-10' : 'full-width'"
    >
    <!-- //* ///////////////////////////////////////////////////// Sroll Area -->
    <q-scroll-area
      ref                   ="componenteScroll"
      class                 ="col q-py-none q-px-md"
      >
      <template
        v-for               ="(comentario, index) of modelValue"
        :key                ="index"
        >
        <!-- //* /////////////////////////////////////////////////// Chat Mensaje -->
        <mensaje  
          :msj              ="comentario"
          @click            ="verTarea"
        />
      </template>
    </q-scroll-area>
    <div>
      <!-- //* /////////////////////////////////////////////////// Escribir comentario -->
      <input-buscar         autogrow
        v-model             ="textoComentario"
        label               ="Nuevo comentario... Control+Enter"
        class               ="col-md-2 col-6"
        debounce            ="0"
        type                ="textarea"
        :icon               ="editando ? 'mdi-loading' : 'mdi-chat'"
        :loading            ="editando"
        :dense              ="false"
        @ctrl-enter         ="crearComentario"
        >
        <!-- //* ///////////////////////////////////////////////// Boton enviar -->
        <q-btn
          v-if              ="!!textoComentario"
          v-bind            ="style.btnRedondoFlatMd"
          icon              ="mdi-send"
          @click            ="crearComentario"
          >
          <Tooltip>Enviar</Tooltip>
        </q-btn>
        <!-- //* ///////////////////////////////////////////////// Boton recargar -->
        <q-btn
          v-bind            ="style.btnRedondoFlatMd"
          icon              ="mdi-reload"
          :loading          ="cargando"
          @click            ="recargar"
          >
          <Tooltip>Cargar comentarios</Tooltip>
        </q-btn>
      </input-buscar>
    </div>
  </div>
  <!-- //* ///////////////////////////////////////////////////////////// Modal Buscar Formulario anticipo -->
  <q-dialog
    v-model                 ="formularioOn"
    v-bind                  ="style.dialogo"
    >
    <formulario-tarea
      v-model               ="tareaSelect"
      :elemento-id          ="elementoId"
      :tipo                 ="tipo"
      :tercero-id           ="terceroId"
      :proyecto-id          ="proyectoId"
      @tarea-creada         ="recibirTareaCreada"
      @tarea-editada        ="recibirTareaEditada"
    />
  </q-dialog>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref, onMounted, watch } from 'vue'
  import {  QScrollArea           } from 'quasar';
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreUser          } from 'stores/user'
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles  
  import {  Tool                  } from "src/composables/useTools"
  import {  style                 } from "src/composables/useEstilos"
  import {  useControlComunicacion} from "../controllers/ControlComunicacion"
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  Accion, IAccion, 
            PropsAccion           } from "../models/Accion"
  import {  IUsuario, Usuario     } from "src/areas/usuarios/models/Usuario"            
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    inputBuscar             from "components/utilidades/input/InputSimple.vue"
  import    formularioTarea         from "./FormularioTarea.vue"
  import    mensaje                 from "./Mensaje.vue"

  const { usuario             } = storeToRefs( useStoreUser() )  
  const { crearAccion         } = useControlComunicacion() 
  
  const editando                = ref<boolean>(false)
  const textoComentario         = ref<string>("")
  const cuentaAperturas         = ref<number>(0)
  const tareaSelect             = ref<IAccion >( new Accion( usuario.value.id ) )
  const comentario              = ref<IAccion >( new Accion( usuario.value.id ) )
  const componenteScroll        = ref<InstanceType<typeof QScrollArea> | null>(null)

  const modelValue              = defineModel<IAccion[]>( { required: true })
  const formularioOn            = defineModel<boolean>('tareaOn', { default: false })
  type TypeChat                 = {
    cargando                    : boolean,
    asignado                    : IUsuario,
    funcionBuscar               : Function,
    chatAbierto                 : boolean
    fix                        ?: boolean
  }
  type TypeProps                = PropsAccion & TypeChat

  const { elementoId            = 0,
          tipo                  = "",
          terceroId             = 0,
          proyectoId            = 0,
          cargando              = false,
          asignado              = new Usuario(),
          fix                   = false,
          chatAbierto           = false,
          funcionBuscar          
                              } = defineProps< TypeProps >()

  onMounted(()=>{
    scrollAlFinal()
    asignarValoresAComentario()
  })

  watch(()=>chatAbierto, (open)=>{
    if(open){
      cuentaAperturas.value++
      scrollAlFinal()
      if(cuentaAperturas.value > 1)
        recargar()
    }
  })

  async function recargar()
  {
    await funcionBuscar()
    scrollAlFinal()
  }
  
  async function crearComentario()
  {
    if(!textoComentario.value) return

    asignarValoresAComentario()    

    editando.value                = true
    const id                      = await crearAccion(comentario.value)
    editando.value                = false
    if(!!id){
      comentario.value.id         = id
      comentario.value.comentario = comentario.value.comentario.replaceAll("\n", "<br/>")
      modelValue.value.push( comentario.value )
      textoComentario.value       = ""
      comentario.value            = new Accion( usuario.value.id )
      scrollAlFinal()
    }
  }

  function verTarea( t : IAccion ) {
    tareaSelect.value             = t
    formularioOn.value            = true
  }

  function abrirFormularioTarea(){
    tareaSelect.value             = new Accion( usuario.value.id )
    tareaSelect.value.asignado    = asignado
    formularioOn.value            = true
  }

  function recibirTareaCreada( t : IAccion ){
    modelValue.value.push( t )
    scrollAlFinal()
  }

  function recibirTareaEditada( t : IAccion, cerrar : boolean = true )
  {
    const index                   = modelValue.value.findIndex( ( tarea )=> tarea.id === t.id )
    if( index >= 0 ){
      modelValue.value[index]     = Object.assign( modelValue.value[index], t )
      formularioOn.value          = !cerrar
    }
  }



  async function scrollAlFinal(){
    if(!!componenteScroll.value){
      await Tool.pausa(200)
      componenteScroll.value.setScrollPercentage('vertical', 1, 400)
    }
  }

  function asignarValoresAComentario()
  {
    comentario.value.comentario   = textoComentario.value
    comentario.value.elementoId   = elementoId
    comentario.value.tipo         = tipo
    comentario.value.terceroId    = terceroId
    comentario.value.proyectoId   = proyectoId
    comentario.value.asignado     = usuario.value
    comentario.value.creador      = usuario.value
    comentario.value.titulo       = `Comentario de ${usuario.value.nombre}`
    comentario.value.creacion     = new Date()
    //console.log("asignarValoresAComentario: ", comentario.value);
  }
</script>

<style>
.chat{
  height: 380px;
  width: 360px;
}
.chat-fix{
  margin-bottom: -100px;
  margin-left: -420px;
}

</style>