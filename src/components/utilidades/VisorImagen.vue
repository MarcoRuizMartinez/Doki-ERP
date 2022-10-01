<template>
  <q-dialog
    v-model                   ="visibleModel"
    transition-show           ="slide-up"
    transition-hide           ="slide-down"
    @hide                     ="cerrarVentana"
    
    >  
    <ventana                  cerrar
      :titulo                 ="titulo"
      icono                   ="mdi-image"    
      padding-contenido       ="0"
      class-contenido         =""
      @cerrar                 ="cerrarVentana"
      >
      <!-- :modo                   ="modo" -->
      <q-img
        class                 ="imagen-visor"
        :src                  ="srcModel"
        :ratio                ="ratio"
      />
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
  const modo                    = ref< ModosVentana >("buscando")
  const emit                    = defineEmits(["update:visible", "update:src"])
  const props                   = defineProps({
    titulo:     { required: true,   type: String  }, 
    src:        { required: true,   type: String  },
    enBase64:   { default:  false,  type: Boolean },
    visible:    { required: true,   type: Boolean },
    fileType:   { default:  "",     type: String  },
    ratio:      { default:  1,      type: [String, Number]},
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
      console.log("enBase64.value): ", enBase64.value);
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
    visibleModel.value        = false
    srcModel.value            = ""
  }

</script>
<style>
.imagen-visor{
  max-width: 800px;
  min-width: 300px;
  width: 36vw;
}
</style>