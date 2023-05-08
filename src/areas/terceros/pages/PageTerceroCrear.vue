<template>
  <q-page                     padding
    class                     ="row justify-between items-start q-col-gutter-xl"
    >
    <transition               appear enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown" mode="out-in">
      <formulario-tercero
        class                 ="col-md-7 col-12"
        :tipo                 ="tipo"
        @tercero-creado       ="( id : number ) => router.push('/tercero/' + id )" 
      />
    </transition>
    <acordion-ayudas
      class                   ="col gt-sm"
    />
    
  </q-page>
</template>

<script setup lang="ts">
  import {  toRefs,
            watch,
            PropType        } from 'vue'
  import {  useTitle        } from "@vueuse/core"
  import {  useRouter       } from 'vue-router'  
  import    formularioTercero from "src/areas/terceros/components/formularioTercero/FormularioTercero.vue"
  import    acordionAyudas    from "src/areas/terceros/components/helper/ModuloAcordion_.vue"
  const props = defineProps({
    tipo: { required: true, type: String as PropType <  "crear-cliente" | "crear-proveedor" > }
  })
  const { tipo }  = toRefs( props )
  const title     = useTitle()
  const router    = useRouter()

  watch(tipo, ()=>{
    title.value = tipo.value === "crear-cliente" ? "👩‍💼👨‍💼 Crear cliente" : "🏬 Crear proveedor"
  })
</script>