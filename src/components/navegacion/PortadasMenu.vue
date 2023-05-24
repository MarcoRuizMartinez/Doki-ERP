<template>
  <div  class           ="row item-stretch content-start justify-start q-col-gutter-lg">
    <div                v-ripple
      v-for             ="enlace in enlaces"
      :key              ="enlace.ref"
      class             ="col-3 box bg-white q-pa-md"
      >
      <span>{{ enlace.question }}</span>
    </div>    
  </div>
</template>
<script setup lang="ts">
//:to               ="enlace.array_options.options_url"
  import {  ref, onMounted          } from "vue"
  import {  useApiDolibarr        } from "src/services/useApiDolibarr"      
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
<style>
.box{

}
</style>