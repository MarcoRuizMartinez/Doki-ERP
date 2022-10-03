<template>
  <q-file                   multiple use-chips append dense hide-bottom-space borderless
    v-model                 ="archivosSubir"
    label                   ="Subir archivos"
    class                   ="full-width campo-hundido transi"
    :disable                ="cargandoArchivos"
    :max-files              ="maxFiles"
    :max-file-size          ="maxSize"
    @rejected               ="rechazarArchivos"
    >
    <template #prepend>
      <q-icon name="mdi-paperclip" class="q-ml-sm"/>
    </template>
    <template #after>
      <q-btn                round dense flat
        v-if                ="!!archivosSubir.length"
        icon                ="mdi-cloud-upload"
        padding             ="none"
        :loading            ="cargandoArchivos"
        @click              ="subirArchivos"
      />
      <Tooltip label        ="Subir archivos"/>
    </template>
  </q-file>
</template>

<script setup lang="ts">
  //accept                  =".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx, .txt, .pdf, .ods, .odt" pdfjs
  import {  ref, 
            toRefs,
            PropType
                            } from "vue"
  import {  useApiDolibarr  } from "src/services/useApiDolibarr"
  import {  TModulosDolibarr} from "src/useSimpleOk/UtilFiles"

  import {  useTools        } from "src/useSimpleOk/useTools"
  import {  FileToBase64,
            DownloadFile_B64    } from "src/useSimpleOk/UtilFiles"

  import {  format          } from 'quasar'

  const { apiDolibarr       } = useApiDolibarr()
  const { aviso             } = useTools()
  const { humanStorageSize  } = format
  const cargandoArchivos      = ref< boolean    >(false)
  let   maxFiles              = 5
  let   maxSize               = 10_240_000

  const archivosSubir         = ref<File[]>( [] )

  const props                 = defineProps({
    modulo:       { required: true,   type: String as PropType < TModulosDolibarr > },
    moduloRef:    { required: true,   type: String                                  },
  })

  const { modulo,
          moduloRef,
                            } = toRefs( props )

  function rechazarArchivos( archivos : any[] )
  {
    let mensaje               = "Error en el archivo"

    if(archivos.some( file    => file.failedPropValidation == "max-files"))
      mensaje                 = `Solo se permiten máximo ${maxFiles} archivos por carga`
    else
    if(archivos.some( file    => file.failedPropValidation == "max-file-size"))
      mensaje                 = `Archivo muy pesado. Debe pesar menos de ${humanStorageSize(maxSize)} `

    aviso("negative", mensaje, "file", 2400)
  }

  async function subirArchivos()
  {
    cargandoArchivos.value    = true
    archivosSubir.value.forEach( async ( file : File ) =>
    {
      let b64                 = await FileToBase64(file)
      //DownloadFile_B64( b64, "ssdsd.pdf",  "application/pdf" )
      
      // console.log("b64: ", b64);      
      
      let objSubir            = {
                                  "filename":          file.name,
                                  "modulepart":        modulo.value,
                                  "ref":               moduloRef.value,
                                  "filecontent":        b64,
                                  //"fileencoding":      "base64",
                                  "fileencoding":      "",
                                  "overwriteifexists": "0",
                                  //"subdir":            "",
                                } 
      //console.log('%c⧭', 'FileToBase64: #00bf00', objSubir)

      let { data, ok }        = await apiDolibarr( "subir", "documento", objSubir )
      //console.log('%c⧭', 'color: #0088cc', ok, data)
    })
    cargandoArchivos.value    = false
  }
</script>