<script setup lang="ts">
  import {  ref,
            toRefs,
            watch,
                            } from "vue"
  import {  TModosVentana    } from "src/models/TiposVarios"
  import    ventana           from "components/utilidades/Ventana.vue"
  import {  File_B64_ToBlob } from "src/composables/UtilFiles"
  import {  useTools        } from "src/composables/useTools"
  import {  style           } from "src/composables/useEstilos"
  import    efecto            from "components/utilidades/Efecto.vue"

  const emit                  = defineEmits(["update:visible", "update:src", "clickDescargar"])
  const props                 = defineProps({
    src:          { required: true,       type: String  },
    visible:      { default:  false,      type: Boolean },
    nombrePdf:    { default:  "archivo",  type: String  },
    enBase64:     { required: false,      type: Boolean },
    descargar:    { default:  false,      type: Boolean }
  })
  const { aviso, esMobil    } = useTools()
  const cargando              = ref< boolean >(true)
  const modo                  = ref< TModosVentana >("buscando")
  const { src,
          visible,
          enBase64          } = toRefs( props )
  const visibleModel          = ref< boolean  >(false)
  const srcModel              = ref< string   >("")

  watch(src, (newSRC) =>{
    if(!!newSRC.length)
    {
      if(enBase64.value)
        srcModel.value       = File_B64_ToBlob( newSRC )
      else
        srcModel.value       = newSRC

      cargando.value          = false
      modo.value              = "normal"
    }
  })

  watch(visible, (newValue) =>{
    visibleModel.value        = newValue
  }, { immediate: true })

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

<template>
  <q-dialog                   maximized 
    v-model                   ="visibleModel"
    v-bind                    ="style.dialogo"
    @escape-key               ="cerrarVentana"
    >
    <ventana                  cerrar full-screen scroll
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
          v-bind              ="style.btnBaseSm"
          icon                ="mdi-download"
          label               ="Descargar"
          @click              ="descargarPDF"
      />
      </efecto>
    </template>
    <div class                ="fit">
      <q-pdfviewer
        :type                 ="esMobil ? 'pdfjs' : 'html5'"
        :src                  ="srcModel"
      />
      <!--  -->
    </div>
    </ventana>
  </q-dialog>
</template>
