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
      <chat                     fix
        v-model                 ="modelValue"
        :chat-abierto           ="isOpen"
        :elemento-id
        :tipo
        :tercero-id
        :proyecto-id
        :cargando
        :asignado
        :funcion-buscar
      />
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

</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref, watch            } from 'vue'

  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  Tool                  } from "src/composables/useTools"

  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAccion, 
            PropsAccion           } from "../models/Accion"
  import {  IUsuario, Usuario     } from "src/areas/usuarios/models/Usuario"

  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    chat                    from "./ChatMensajes.vue"

  const isOpen                  = ref<boolean>(false)
  const cuentaAperturas         = ref<number>(0)

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


  watch(()=> modelValue.value.length, abrirAlIniciarSiHayComentarios)

  async function abrirAlIniciarSiHayComentarios( largo : number )
  {
    if(cuentaAperturas.value == 0 && !!largo){
      await Tool.pausa(600)
      isOpen.value = true
    }   
  }
</script>