<template>
  <ventana                minimizar
    class-contenido       ="column items-center"
    titulo                ="Enlaces internos"
    icono                 ="mdi-link"
    size-icon-carga       ="14em"
    padding-contenido     ="0"
    :cargando             ="!enlaces.length"
    >
    <div>
    <q-list class         ="full-width">
      <q-item             clickable v-ripple
        v-for             ="enlace in enlaces"
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
          <q-item-label         >{{ enlace.question }}</q-item-label>
          <q-item-label caption v-html="enlace.answer" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
  </ventana>

<!-- 
  <q-separator spaced />
  overline  

  array_options.options_grupos_usuarios
  
-->
</template>

  <script setup lang="ts">
  import {  ref, onMounted          } from "vue"
  import    ventana                   from "components/utilidades/Ventana.vue"
  import {  useApiDolibarr        } from "src/composables/useApiDolibarr"      
  ////////////////////////////////////////////////////////////////////////// Store
  //import {  storeToRefs         } from 'pinia'
  //import {  useStoreUser        } from 'src/stores/user'

  //const { usuario           } = storeToRefs( useStoreUser() )
  const { apiDolibarr       } = useApiDolibarr()
  const enlaces               = ref<any[]>([])

  onMounted(cargarEnlaces)

  async function cargarEnlaces(){
    const { ok, data }        = await apiDolibarr( "buscar", "saber" )
    if(ok){
      if(Array.isArray(data))
        enlaces.value = data
    }
  }
  </script>