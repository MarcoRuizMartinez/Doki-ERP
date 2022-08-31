<template>
  <q-dialog                   maximized 
    v-model                   ="visibleModel"
    transition-show           ="slide-up"
    transition-hide           ="slide-down"
    @escape-key               ="cerrarVentana"
    >
    <ventana                  cerrar full-screen
      v-touch-swipe.mouse.down="cerrarVentana"
      :titulo                 ="nombrePdf"
      icono                   ="mdi-pdf-box"
      class                   ="fit"
      padding-contenido       ="0"
      class-contenido         ="fit"
      size-icon-carga         ="60vw"
      mensaje-cargando        ="Cargando PDF..."
      :modo                   ="modo"
      @cerrar                 ="cerrarVentana"
    >
    <template                 #barra>
      <efecto efecto          ="UpDown">
        <q-btn
          v-if                ="descargar && !!srcModel"
          v-bind              ="btnBaseSm"
          icon                ="mdi-download"
          label               ="Descargar"
          @click              ="descargarPDF"
      />
      </efecto>
    </template>
    <div class                ="fit">
      <q-pdfviewer
        type                  ="pdfjs"
        :src                  ="srcModel"
      />
    </div>
    </ventana>
  </q-dialog>
</template>
<script setup lang="ts">
  import {  ref,
            toRefs,
            watch,
                            } from "vue"
  import {  ModosVentana    } from "src/models/TiposVarios"
  import    ventana           from "components/utilidades/Ventana.vue"
  import {  PDF_B64_ToBlob  } from "src/useSimpleOk/UtilPDF"
  import {  useTools        } from "src/useSimpleOk/useTools"
  import {  btnBaseSm       } from "src/useSimpleOk/useEstilos"
  import    efecto            from "components/utilidades/Efecto.vue"

  const emit                  = defineEmits(["update:visible", "update:src", "clickDescargar"])
  const props                 = defineProps({
    src:          { required: true,       type: String  },
    visible:      { required: true,       type: Boolean },
    nombrePdf:    { default:  "archivo",  type: String  },
    toBase64:     { required: false,      type: Boolean },
    descargar:    { default:  false,      type: Boolean }
  })
  const { aviso               } = useTools()
  const cargando              = ref< boolean >(true)
  const modo                  = ref< ModosVentana >("buscando")
  const { src,
          visible,
          toBase64          } = toRefs( props )
  const visibleModel          = ref< boolean  >(false)
  const srcModel              = ref< string   >("")

  watch(src, (newSRC) =>{
    if(!!newSRC.length)
    {
      if(toBase64.value)
        srcModel.value       = PDF_B64_ToBlob( newSRC )
      else
        srcModel.value       = newSRC

      cargando.value          = false
      modo.value              = "normal"
    }
  })

  watch(visible, (newValue, oldValue) =>{
    visibleModel.value        = newValue
  })

  function cerrarVentana()
  {
    emit("update:visible", false)
    emit("update:src", "")
    modo.value                = "buscando"
    visibleModel.value        = false
    srcModel.value            = ""
  }

  function descargarPDF()
  {
    emit("clickDescargar")
  }
</script>