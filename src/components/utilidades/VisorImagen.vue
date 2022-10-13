<template>
  <q-dialog
    v-model                   ="visibleModel"
    transition-show           ="slide-up"
    transition-hide           ="slide-down"
    :maximized                ="fullScreen"
    @hide                     ="cerrarVentana"    
    >  
    <ventana                  cerrar scroll
      icono                   ="mdi-image"    
      padding-contenido       ="0"
      class-contenido         =""
      :titulo                 ="titulo"
      :full-screen            ="fullScreen"      
      @cerrar                 ="cerrarVentana"
      >
      <template               #barra>
        <q-btn                dense round glossy push unelevated
          class               ="boton-ventana"          
          color               ="positive"
          size                ="sm"
          :icon               ="fullScreen ? 'mdi-arrow-collapse-all' : 'mdi-arrow-expand-all'"
          @click              ="fullScreen = !fullScreen"
          >
          <Tooltip :label     ="fullScreen ? 'Reducir' : 'Ampliar'"/>
        </q-btn>        
      </template>
      <!-- :modo                   ="modo" -->
      <div class              ="row flex-center fit">
        <q-img        
          class               ="cursor-pointer"
          :src                ="srcModel"
          :class              ="{'imagen-visor' : !fullScreen}"
          @click              ="fullScreen = !fullScreen"
          >
          <Tooltip :label     ="fullScreen ? 'Reducir' : 'Ampliar'"/>
        </q-img>
      </div>
    </ventana>
  </q-dialog>    
</template>
<script setup lang="ts">
  import {  ref,
            toRefs,
            watch,
                              } from "vue"  
  import    ventana             from "components/utilidades/Ventana.vue"
  import {  File_B64_ToBlob   } from "src/useSimpleOk/UtilFiles"
  import {  ModosVentana      } from "src/models/TiposVarios"

  const visibleModel            = ref< boolean  >(false)
  const srcModel                = ref< string   >("")
  const cargando                = ref< boolean >(true)
  const fullScreen              = ref< boolean >(false)  
  const modo                    = ref< ModosVentana >("buscando")
  const emit                    = defineEmits(["update:visible", "update:src"])
  const props                   = defineProps({
    titulo:     { required: true,   type: String  }, 
    src:        { required: true,   type: String  },
    enBase64:   { default:  false,  type: Boolean },
    visible:    { required: true,   type: Boolean },
    fileType:   { default:  "",     type: String  },
    ratio:      { default:  "",     type: [String, Number]},
  })
  const { src,
          visible,
          fileType,
          enBase64          } = toRefs( props )  

  watch(visible, (v) => visibleModel.value = v)


  watch(src, (newSRC) =>
  {
    if(!!newSRC.length)
    {
      if(enBase64.value)
        srcModel.value        = File_B64_ToBlob( newSRC, fileType.value )
      else
        srcModel.value        = newSRC

      cargando.value          = false
      modo.value              = "normal"
    }
  })

  function cerrarVentana()
  {
    emit("update:visible", false)
    emit("update:src", "")
    modo.value                = "buscando"
    srcModel.value            = ""
    visibleModel.value        = false
    fullScreen.value          = false
  }

</script>
<style>
.imagen-visor{
  max-width: 800px;
  min-width: 300px;
  width: 36vw;
}
</style>