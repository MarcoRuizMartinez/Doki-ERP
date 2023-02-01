<template>
  <q-page                 padding
    class                 ="row justify-center"
    >
    <ventana              full-screen
      class               ="col-12"
      padding-contenido   ="0"
      height              ="79vh"
      :titulo             ="titulo"
      :icono              ="icono"
      >
      <template           #barra>
        <q-btn            flat round dense
          color           ="white"
          icon            ="mdi-refresh"          
          class           ="op40 op100-hover q-ml-xs"
          @click          ="recargar"
          >
          <Tooltip label  ="Recargar"/>
        </q-btn>
        <q-btn            flat round dense
          v-if            ="!!link"
          color           ="white"
          icon            ="mdi-open-in-new"
          type            ="a"
          class           ="op40 op100-hover q-ml-xs"
          target          ="_blank"
          :href           ="link"
          >
          <Tooltip label  ="Ir a enlace"/>
        </q-btn>
      </template>
      <iframe
        class             ="iframe"
        :src              ="modelSrc"
        frameborder       ="0"
        onmousewheel      =""
        width             ="100%"
        height            ="100%"
        style             ="background: transparent; border: 1px solid #ccc;"
        >
      </iframe>
    </ventana>
  </q-page>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref, toRefs, watch    } from "vue"  
  import {  pausa                 } from "src/useSimpleOk/useTools" 
  
  import    ventana             from "components/utilidades/Ventana.vue"
  const props = defineProps({
    src:    { type: String, required: true },
    titulo: { type: String, required: true },
    icono:  { type: String, default: "mdi-book-open-variant" },
    link:   { type: String, default: "" },
  })
  
  const { src, titulo }        = toRefs( props )
  const modelSrc = ref<string>( src.value )

  async function recargar(){
    modelSrc.value = ""
    await pausa(50)
    modelSrc.value = src.value
  }



  watch(src, async (newSrc)=>{
    if(!newSrc) return
    recargar()
  })
</script>

<style scoped>
.iframe {
  border:none;
  width:100%;  
  height: 100%;
}
</style>
