<template>
  <ventana              full-screen
    class               ="col-12"
    padding-contenido   ="0"
    height              ="79vh"
    :cerrar             ="esFormulario"
    :titulo             ="titulo"
    :icono              ="icono"
    :cargando           ="cargando || cargandoRaiz"
    @cerrar             ="$emit('cerrar')"
    >
    <template           #barra>
      <q-btn            flat round dense
        v-if            ="!!srcFormulario"
        color           ="white"
        icon            ="mdi-plus"          
        class           ="op40 op100-hover q-ml-xs"
        @click          ="abrirFormulario"
        >
        <Tooltip label  ="Nuevo registro"/>
      </q-btn>        
      <q-btn            flat round dense
        color           ="white"
        icon            ="mdi-refresh"          
        class           ="op40 op100-hover q-ml-xs"
        @click          ="recargar"
        >
        <Tooltip label  ="Recargar"/>
      </q-btn>
      <q-btn            flat round dense
        v-if            ="copiar"
        color           ="white"
        icon            ="mdi-content-copy"          
        class           ="op40 op100-hover q-ml-xs"
        @click          ="copiarSRC"
        >
        <Tooltip label  ="Copiar link"/>
      </q-btn>      
      <q-btn            flat round dense
        v-if            ="!!link || esFormulario"
        color           ="white"
        icon            ="mdi-open-in-new"
        type            ="a"
        class           ="op40 op100-hover q-ml-xs"
        target          ="_blank"
        :href           ="!!link ? link : src"
        >
        <Tooltip label  ="Ir a enlace"/>
      </q-btn>
    </template>
    <template           #menu v-if="showMenu">
      <slot></slot>
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
    <!-- //* ///////////////////////////////////////////////////////////// Formulario -->
    <q-dialog                   
      v-model           ="formularioOk"
      v-bind            ="style.dialogo"
      >
      <formulario-iframe es-formulario
        icono           ="mdi-form-textbox"
        :src            ="srcFormulario"
        :titulo         ="'Formulario ' + titulo"
        :cargando       ="cargandoModel"
        @cerrar         ="recargar"
      />
    </q-dialog>
  </ventana>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            toRefs,
            watch,                } from "vue"  
  import {  pausa                 } from "src/useSimpleOk/useTools" 
  import {  style                 } from "src/useSimpleOk/useEstilos"
  import    formularioIframe        from "components/navegacion/VentanaIframe.vue"
  import    ventana                 from "components/utilidades/Ventana.vue"
  import {  copyToClipboard       } from 'quasar'
  const formularioOk  = ref<boolean>(false)
  const emits         = defineEmits(["cerrar"])

  const props         = defineProps({
    src:            { type: String,   required: true },
    titulo:         { type: String,   required: true },
    icono:          { type: String,   default: "mdi-book-open-variant" },
    srcFormulario:  { type: String,   default: "" },
    link:           { type: String,   default: "" },    
    esFormulario:   { type: Boolean,  default: false },
    cargando:       { type: Boolean,  default: false },
    showMenu:       { type: Boolean,  default: false },
    copiar:         { type: Boolean,  default: false },
  })
  
  const { src,
          cargando,
          titulo }= toRefs( props )

  const modelSrc          = ref<string> ( src.value )
  const cargandoModel     = ref<boolean>( cargando.value )
  const cargandoRaiz      = ref<boolean>( false )

  async function recargar(){
    modelSrc.value      = ""
    await pausa(50)
    cargandoRaiz.value  = true
    modelSrc.value      = src.value
    await pausa(4000)
    cargandoRaiz.value  = false
  }

  async function abrirFormulario()
  {
    formularioOk.value  = true
    cargandoModel.value = true    
    await pausa(5000)
    cargandoModel.value = false
  }
  async function copiarSRC()
  {
    await copyToClipboard( src.value )
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
