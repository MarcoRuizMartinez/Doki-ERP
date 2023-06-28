<template>
  <q-chat-message       text-html
    text-color          ="white"
    :name               ="msj.creador.nombre"
    :sent               ="msj.creador.id === usuario.id"
    :avatar             ="msj.creador.fotoPerfilMini"
    :text               ="[msj.comentario]"
    :bg-color           ="color"
    :stamp              ="msj.hace"
    @click              ="()=> { if(msj.esTarea) emit('click', msj ) }"
    >
    <q-spinner-dots
      v-if              ="msj.editandoComentario"
      size              ="2rem"
    />
    <div
      v-else-if         ="msj.esTarea"
      class             ="cursor-pointer"
      >
      Tarea para 
      <chip-usuario
        :usuario        ="msj.asignado"
      />
      <br/>
      <span>{{ msj.tareaCompletada ? 'Completada 👌🏼' : ( !msj.progreso ? 'Pendiente 🕑' : 'Progreso 🏃🏼‍♀️' ) }} {{ msj.progreso }}% </span>
      <div class        ="text-bold">{{ msj.titulo }}</div>
      <span
        v-if            ="!!msj.comentario"
        class           ="text-italic"
        >
        {{ msj.comentario }}
      </span>
    </div>
    <div v-else>
      <span v-html      ="msj.comentario"></span>
      <q-popup-edit     buttons
        v-if            ="msj.sePuedeEditar && msj.creador.id === usuario.id"
        v-model         ="msj.comentario"
        v-slot          ="scope"
        label-set       ="Editar"
        class           ="panel-blur-70"
        :validate       ="validarEdicion"
        @save           ="( value: any, initialValue : any) => ejecutarEditarComentario( msj, value )"
        >
        <!-- //* /////////////////////////////////////////////////// Escribir comentario  @update:model-value ="editarTitulo"-->
        <input-buscar   autogrow autofocus
          v-model       ="scope.value"
          :error        ="errorEnEdicion"
          error-message ="No puede estar vacío"
          label         ="Editar comentario... Ctrl+Enter"
          debounce      ="0"
          type          ="textarea"
          :icon         ="loading ? 'mdi-loading' : 'mdi-chat'"
          :loading      ="loading"
          :dense        ="false"
          @ctrl-enter   ="scope.set"
          >
        </input-buscar>
      </q-popup-edit>
    </div>
  </q-chat-message>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            computed,
            PropType              } from 'vue'
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreUser          } from 'src/stores/user'
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAccion               } from "../models/Accion"
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    inputBuscar             from "components/utilidades/input/InputSimple.vue"
  import    chipUsuario             from "src/areas/usuarios/components/ChipUsuario.vue"

  const errorEnEdicion          = ref<boolean>(false)
  const loading                 = ref<boolean>(false)
  const { msj }                 = defineProps({      
    msj: { required: true,  type: Object as PropType< IAccion >  },
  })

  const emit                    = defineEmits<{
    click: [ value: IAccion ]
  }>()  

  const { usuario             } = storeToRefs( useStoreUser() )
  const { editarComentario    } = useControlAcuerdo()

  const color                   = computed(()=>   msj.esTarea && msj.tareaCompletada  ? 'green-14'
                                                : msj.esTarea && !msj.tareaCompletada ? 
                                                    ( !!msj.progreso ? 'purple-10' : 'deep-orange-10')
                                                : msj.creador.id === usuario.value.id ? 'indigo-9'
                                                :                                       'teal-9'
                                          )

  async function ejecutarEditarComentario( c : IAccion, valor : any )
  {
    if(typeof valor != "string" || !valor) return
    c.editandoComentario = true
    await editarComentario( c.id, valor )
    c.editandoComentario = false
  }

  function validarEdicion( val : string)
  {
    const valido = typeof val === "string" && val.length > 2
    errorEnEdicion.value = !valido
    return valido
  }
</script>