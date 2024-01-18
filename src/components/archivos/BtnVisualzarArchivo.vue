<script setup lang="ts">
  //accept                  =".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx, .txt, .pdf, .ods, .odt" pdfjs
  import {  ref,
            toRefs,
            PropType
                            } from "vue"
  import {  useApiDolibarr  } from "src/composables/useApiDolibarr"
  import {  useTools        } from "src/composables/useTools"
  import {  IArchivo        } from "src/models/Archivo"
  import    visorPdf          from "components/utilidades/VisorPDF.vue"  
  import    visorImagen       from "components/utilidades/VisorImagen.vue"

  const { apiDolibarr       } = useApiDolibarr()
  const { aviso             } = useTools()
  const fileNameSelect        = ref< string     >( "" )
  const ventanaPDF            = ref< boolean    >(false)
  const ventanaImagen         = ref< boolean    >(false)
  const srcPDF                = ref< string     >("")
  type  TImagenAver           = { src : string, titulo: string, fileType: string }
  const imagenAver            = ref< TImagenAver >( { titulo: "", src: "", fileType: "" } )
  
  const props                 = defineProps({
    archivo:  { required: true,   type: Object as PropType < IArchivo > },
  })
  const { archivo }            = toRefs( props )

  async function verArchivo()
  {
    fileNameSelect.value      = archivo.value.name
    archivo.value.loading     = true

    let { data, ok }          = await apiDolibarr( "descargar", "documento", archivo.value.endPoint )
    archivo.value.loading     = false

    if(ok){
      let descarga            = data as any
      if(archivo.value.tipo   === "PDF"){        
        srcPDF.value          = descarga.content
        ventanaPDF.value      = true
      }
      else
      if(archivo.value.tipo   === "Imagen"){
        imagenAver.value      = { titulo: archivo.value.name, src: descarga.content, fileType: archivo.value.fileType }
        ventanaImagen.value   = true
      }
    }
    else
      aviso("negative", "Error descargando el archivo", "file")
  }
</script>

<template>
  <!-- //* /////////  Lupa ver PDF  -->
  <q-btn              flat dense round
    v-bind            ="$attrs"
    icon              ="mdi-magnify-plus"
    class             ="op60 op100-hover"
    padding           ="none"
    size              ="md"
    @click            ="verArchivo"
  />   
  <!-- //* /////////////////  Visor PDF  -->
  <visor-pdf          en-base-64
    v-model:src       ="srcPDF"
    v-model:visible   ="ventanaPDF"
    :nombre-pdf       ="fileNameSelect"
  />
  <visor-imagen       en-base-64
    v-model:src       ="imagenAver.src"
    v-model:visible   ="ventanaImagen"
    :ratio            ="''"
    :titulo           ="imagenAver.titulo"
    :fileType         ="imagenAver.fileType"
  />
</template>