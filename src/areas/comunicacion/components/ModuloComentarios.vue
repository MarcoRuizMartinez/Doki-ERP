<template>
  <q-page-sticky
    v-bind                      ="$attrs"
    position                    ="bottom-right"
    :offset                     ="[18, 18]"
    >
    <!-- //* ///////////////////////////////////////////////////////// Boton Flotante -->
    <q-fab
      v-model                   ="isOpen"
      direction                 ="up"
      padding                   ="sm"
      :color                    ="isOpen ? 'red' : 'positive'"
      >
      <template                 #icon>
        <q-icon
          :name                 ="cargando ? 'mdi-loading' : 'mdi-comment-multiple'"
          :class                ="{'mdi-spin' : cargando}"
        />
      </template>
      <!-- //* /////////////////////////////////////////////////////// Boton nueva Tarea -->
      <q-btn                    round unelevated
        color                   ="positive"
        icon                    ="mdi-check"
        @click                  ="abrirFormularioTarea"
        >
        <Tooltip label          ="Nueva tarea"/>
      </q-btn>
      <div class                ="chat panel-blur-70 shadow-6 radius-10 column justify-between">
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
              v-bind            ="style.btnRedondoFlat"
              icon              ="mdi-send"
              @click            ="crearComentario"
              >
              <Tooltip>Enviar</Tooltip>
            </q-btn>
            <!-- //* ///////////////////////////////////////////////// Boton recargar -->
            <q-btn
              v-bind            ="style.btnRedondoFlat"
              icon              ="mdi-reload"
              :loading          ="cargando"
              @click            ="recargar"
              >
              <Tooltip>Cargar comentarios</Tooltip>
            </q-btn>
          </input-buscar>
        </div>
      </div>
      <template                 #tooltip
        v-if                    ="!isOpen && !!modelValue.length"
        >
        <!-- //* ///////////////////////////////////////////////////// Cantidad de mensajes -->
        <q-badge                floating
          color                 ="red"
          :label                ="modelValue.length"
        />
      </template>
    </q-fab>
  </q-page-sticky>
  <!-- //* ///////////////////////////////////////////////////////////// Modal Buscar Formulario anticipo -->
  <q-dialog
    v-model                     ="formularioOn"
    v-bind                      ="style.dialogo"
    >
    <formulario-tarea
      v-model                   ="tareaSelect"
      :elemento-id              ="elementoId"
      :tipo                     ="tipo"
      :tercero-id               ="terceroId"
      :proyecto-id              ="proyectoId"
      @tarea-creada             ="recibirTareaCreada"
      @tarea-editada            ="recibirTareaEditada"
    />
  </q-dialog>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref, onMounted, watch } from 'vue'
  import {  QScrollArea           } from 'quasar';
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreUser          } from 'src/stores/user'
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useApiDolibarr        } from "src/services/useApiDolibarr"
  import {  useTools, pausa       } from "src/useSimpleOk/useTools"
  import {  style                 } from "src/useSimpleOk/useEstilos"
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  useControlComunicacion} from "../controllers/ControlComunicacion"
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  Accion, IAccion, 
            PropsAccion           } from "../models/Accion"
  import {  IUsuario, Usuario     } from "src/areas/usuarios/models/Usuario"            
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    inputBuscar             from "components/utilidades/input/InputSimple.vue"
  import    formularioTarea         from "./FormularioTarea.vue"
  import    mensaje                 from "./Mensaje.vue"

  const { apiDolibarr         } = useApiDolibarr()
  const { aviso               } = useTools()
  const { usuario             } = storeToRefs( useStoreUser() )  
  const { crearAccion         } = useControlComunicacion()

  const isOpen                  = ref<boolean>(false)
  const formularioOn            = ref<boolean>(false)
  const editando                = ref<boolean>(false)
  const textoComentario         = ref<string>("")
  const cuentaAperturas         = ref<number>(0)
  const tareaSelect             = ref< IAccion >( new Accion( usuario.value.id ) )
  const comentario              = ref <IAccion >( new Accion( usuario.value.id ) )
  const componenteScroll        = ref<InstanceType<typeof QScrollArea> | null>(null)

  const modelValue              = defineModel<IAccion[]>( { required: true })
  type TypeProps                = PropsAccion & { cargando: boolean, asignado: IUsuario, funcionBuscar: Function }
  const { elementoId            = 0,
          tipo                  = "",
          terceroId             = 0,
          proyectoId            = 0,
          cargando              = false,
          asignado              = new Usuario(),
          funcionBuscar
                              } = defineProps< TypeProps >()

  onMounted(()=>{
    asignarValoresAComentario()
  })

  watch(()=> modelValue.value.length, abrirAlIniciarSiHayComentarios)

  async function abrirAlIniciarSiHayComentarios( largo : number )
  {
    if(cuentaAperturas.value == 0 && !!largo){
      await pausa(600)
      isOpen.value = true
    }   
  }

  watch(isOpen, (open)=>{
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
    tareaSelect.value           = t
    formularioOn.value          = true
  }

  function abrirFormularioTarea(){
    tareaSelect.value           = new Accion( usuario.value.id )
    tareaSelect.value.asignado  = asignado
    formularioOn.value          = true
  }

  function recibirTareaCreada( t : IAccion ){
    modelValue.value.push( t )
    scrollAlFinal()
  }

  function recibirTareaEditada( t : IAccion, cerrar : boolean = true )
  {
    const index                 = modelValue.value.findIndex( ( tarea )=> tarea.id === t.id )
    if( index >= 0 ){
      modelValue.value[index]   = Object.assign( modelValue.value[index], t )
      formularioOn.value        = !cerrar
    }
  }



  async function scrollAlFinal(){
    if(!!componenteScroll.value){
      await pausa(200)
      componenteScroll.value.setScrollPercentage('vertical', 1, 400)
    }
  }

  function asignarValoresAComentario()
  {
    comentario.value.comentario = textoComentario.value
    comentario.value.elementoId = elementoId
    comentario.value.tipo       = tipo
    comentario.value.terceroId  = terceroId
    comentario.value.proyectoId = proyectoId
    comentario.value.asignado   = usuario.value
    comentario.value.creador    = usuario.value
    comentario.value.titulo     = `Comentario de ${usuario.value.nombre}`
    comentario.value.creacion   = new Date()
    //console.log("asignarValoresAComentario: ", comentario.value);
  }


</script>
<style>
.chat{
  height: 380px;
  width: 360px;
  margin-bottom: -100px;
  margin-left: -420px;
}
</style>
