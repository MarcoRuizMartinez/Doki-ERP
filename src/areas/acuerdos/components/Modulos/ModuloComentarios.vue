<template>
  <q-page-sticky
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
          :name                 ="loading.commentsLoad ? 'mdi-loading' : 'mdi-comment-multiple'"
          :class                ="{'mdi-spin' : loading.commentsLoad}"
        />
      </template>
      <q-btn                    round unelevated
        color                   ="positive"
        icon                    ="mdi-check"
        >
        <Tooltip label          ="Nueva tarea"/>
      </q-btn>
      <div class                ="chat panel-blur-70 shadow-6 radius-10 column justify-between">
        <!-- //* ///////////////////////////////////////////////////// Sroll Area -->
        <q-scroll-area
          ref                   ="componenteScroll"
          class                 ="col q-py-none q-px-md"
          >
          <!-- //* /////////////////////////////////////////////////// Chat Mensaje -->
          <q-chat-message       text-html
            v-for               ="(c, index) of acuerdo.comentarios"
            text-color          ="white"
            :key                ="index"
            :name               ="c.creador.nombre"
            :sent               ="c.creador.id === usuario.id"
            :avatar             ="c.creador.fotoPerfilMini"
            :text               ="[c.value]"
            :bg-color           ="c.creador.id === usuario.id ? 'indigo-9' : 'teal-9'"            
            :stamp              ="c.hace"
            >
            <q-spinner-dots
              v-if              ="c.editandoComentario" 
              size              ="2rem"
            />
            <div v-else>
              <span v-html      ="c.value"></span>
              <q-popup-edit     buttons
                v-if            ="c.sePuedeEditar && c.creador.id === usuario.id"
                v-model         ="c.value"
                v-slot          ="scope"
                label-set       ="Editar"
                class           ="panel-blur-70"
                :validate       ="validarEdicion"
                @save           ="( value: any, initialValue : any)=>ejecutarEditarComentario( c, value )"
                >
                <!-- //* /////////////////////////////////////////////////// Escribir comentario  @update:model-value ="editarTitulo"-->
                <input-buscar   autogrow autofocus
                  v-model       ="scope.value"
                  :error        ="errorEnEdicion"
                  error-message ="No puede estar vacío"
                  label         ="Editar comentario... Ctrl+Enter"
                  debounce      ="0"
                  type          ="textarea"
                  :icon         ="loading.commentEdit ? 'mdi-loading' : 'mdi-chat'"
                  :loading      ="loading.commentEdit"
                  :dense        ="false"
                  @ctrl-enter   ="scope.set"
                  >
                </input-buscar>               
              </q-popup-edit> 
            </div>
          </q-chat-message>
        </q-scroll-area>
        <div>
          <!-- //* /////////////////////////////////////////////////// Escribir comentario -->
          <input-buscar         autogrow
            v-model             ="textoComentario"
            label               ="Nuevo comentario... Control+Enter"
            class               ="col-md-2 col-6"
            debounce            ="0"
            type                ="textarea"
            :icon               ="loading.commentEdit ? 'mdi-loading' : 'mdi-chat'"
            :loading            ="loading.commentEdit"
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
              :loading          ="loading.commentsLoad"
              @click            ="recargar"
              >
              <Tooltip>Cargar comentarios</Tooltip>
            </q-btn>
          </input-buscar>
        </div>
      </div>
      <template                 #tooltip 
        v-if                    ="!isOpen && !!acuerdo.comentarios.length"
        >
        <!-- //* ///////////////////////////////////////////////////// Cantidad de mensajes -->
        <q-badge                floating
          color                 ="red"
          :label                ="acuerdo.comentarios.length"
        />
      </template>      
    </q-fab>
  </q-page-sticky>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref, onMounted, watch } from 'vue'
  import {  QScrollArea           } from 'quasar';
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'  
  import {  useStoreUser          } from 'src/stores/user'
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useApiDolibarr        } from "src/services/useApiDolibarr"  
  import {  useTools, pausa       } from "src/useSimpleOk/useTools"
  import {  style                 } from "src/useSimpleOk/useEstilos"
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  Comentario,
            IComentario           } from "src/models/Comentario"
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    inputBuscar             from "components/utilidades/input/InputSimple.vue"

  const isOpen                  = ref<boolean>(false)
  const textoComentario         = ref<string>("")
  const cuentaAperturas         = ref<number>(0)
  const errorEnEdicion          = ref<boolean>(false)
    
  const comentario              = ref<IComentario>( new Comentario() )  
  const { apiDolibarr         } = useApiDolibarr()
  const { aviso               } = useTools()
  const { acuerdo, loading    } = storeToRefs( useStoreAcuerdo() )
  const { usuario             } = storeToRefs( useStoreUser() )
  const { buscarComentarios,
          editarComentario    } = useControlAcuerdo()
  const componenteScroll        = ref<InstanceType<typeof QScrollArea> | null>(null)                              

  onMounted(()=>{
    asignarValoresAComentario()
  })

  watch(()=> acuerdo.value.comentarios.length, (largo)=>{
    console.log("largo: ", largo);
    if(cuentaAperturas.value == 0 && !!largo)
      isOpen.value = true
  })

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
    await buscarComentarios()
    scrollAlFinal()
  }
  async function crearComentario()
  {
    if(!textoComentario.value) return

    asignarValoresAComentario()
    const obj                   = comentario.value.commentToApi
    
    loading.value.commentEdit   = true
    const { ok, data }          = await apiDolibarr("crear", "comentario", obj)
    loading.value.commentEdit   = false
    if(ok && !!data && typeof data == "number"){
      comentario.value.id       = data
      comentario.value.value    = comentario.value.value.replaceAll("\n", "<br/>")
      acuerdo.value.comentarios.push( comentario.value )
      textoComentario.value     = ""
      comentario.value          = new Comentario()
      scrollAlFinal()
    }
    else
    {
      aviso("negative", "Error al publicar comentario")
    }
  }

  async function ejecutarEditarComentario( c : IComentario, valor : any )
  {
    if(typeof valor != "string" || !valor) return
    c.editandoComentario = true
    await editarComentario( c.id, valor )
    c.editandoComentario = false
  }

  async function scrollAlFinal()
  {
    if(!!componenteScroll.value){
      await pausa(200)
      componenteScroll.value.setScrollPercentage('vertical', 1, 400)
        
    }
  }

  function asignarValoresAComentario()
  {
    comentario.value.value      = textoComentario.value
    comentario.value.elementoId = acuerdo.value.id
    comentario.value.tipo       = Comentario.getTipo( acuerdo.value.tipo )
    comentario.value.terceroId  = acuerdo.value.tercero.id
    comentario.value.asignadoId = usuario.value.id
    comentario.value.creador    = usuario.value
    comentario.value.creadorId  = usuario.value.id
    comentario.value.label      = `Comentario de ${usuario.value.nombre}`
    comentario.value.creacion   = new Date()
  }

  function validarEdicion( val : string)
  {
    const valido = typeof val === "string" && val.length > 2
    errorEnEdicion.value = !valido
    return valido
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