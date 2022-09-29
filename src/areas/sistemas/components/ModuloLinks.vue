<template>
    <ventana                minimizar
      class-contenido       ="column items-center"
      titulo                ="Enlaces internos"
      icono                 ="mdi-link"
      size-icon-carga       ="14em"
      padding-contenido     ="0"
      :cargando             ="!enlaces.length"
      >
      <q-list>
        <q-item             clickable v-ripple
          v-for             ="enlace in enlaces"
          class             ="q-my-sm"
          :to               ="enlace.array_options.options_url"
          :key              ="enlace.ref"
          >
          <q-item-section   avatar>
            <q-avatar
              color         ="primary"
              text-color    ="white"
              >
              {{ enlace.question[0] }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ enlace.question }}
            </q-item-label>
            <q-item-label caption>
              {{ enlace.answer }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </ventana>

<!--     <q-separator spaced />
  overline
  caption

  question
  ref
  answer
  array_options.options_url
  options_grupos_usuarios
  options_url -->
  </template>

  <script setup lang="ts">
  import {  ref, onMounted          } from "vue"
  import    ventana                   from "components/utilidades/Ventana.vue"
  import {  useApiDolibarr        } from "src/services/useApiDolibarr"      
  ////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreUser        } from 'src/stores/user'

  const { usuario           } = storeToRefs( useStoreUser() )       
  const { apiDolibarr       } = useApiDolibarr()
  const enlaces               = ref<any[]>([])

  onMounted(cargarEnlaces)

  async function cargarEnlaces(){
    const { ok, data }        = await apiDolibarr( "buscar", "saber" )
    if(ok){
      if(Array.isArray(data))
        enlaces.value = data
        console.log("enlaces.value: ", enlaces.value);
    }
  }




    const contacts = [ {
  id: 1,
  name: 'Ruddy Jedrzej',
  email: 'rjedrzej0@discuz.net',
  letter: 'R'
}, {
  id: 2,
  name: 'Mallorie Alessandrini',
  email: 'malessandrini1@marketwatch.com',
  letter: 'M'
}, {
  id: 3,
  name: 'Elisabetta Wicklen',
  email: 'ewicklen2@microsoft.com',
  letter: 'E'
}, {
  id: 4,
  name: 'Seka Fawdrey',
  email: 'sfawdrey3@wired.com',
  letter: 'S'
} ]

const offline = [ {
  id: 5,
  name: 'Brunhilde Panswick',
  email: 'bpanswick4@csmonitor.com',
  avatar: 'avatar2.jpg'
}, {
  id: 6,
  name: 'Winfield Stapforth',
  email: 'wstapforth5@pcworld.com',
  avatar: 'avatar6.jpg'
} ]



  </script>