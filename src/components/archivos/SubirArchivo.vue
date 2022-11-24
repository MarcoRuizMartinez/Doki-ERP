<template>
  <q-file                   use-chips append dense hide-bottom-space borderless multiple
    v-model                 ="archivosSubir"    
    class                   ="campo-hundido transi"    
    :disable                ="cargandoArchivos"
    :max-files              ="maxFiles"
    :max-file-size          ="maxSize"
    @rejected               ="rechazarArchivos"
    @update:model-value     ="seleccionar"
    >
    <template #prepend>
      <q-icon name="mdi-paperclip" class="q-ml-sm"/>
    </template>
    <template #after>
      <q-btn                round dense flat
        v-if                ="!!archivosSubir.length"
        icon                ="mdi-cl  oud-upload"
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
  import {  FileToBase64    } from "src/useSimpleOk/UtilFiles"

  import {  format          } from 'quasar'

  const { apiDolibarr       } = useApiDolibarr()
  const { aviso             } = useTools()
  const { humanStorageSize  } = format
  const cargandoArchivos      = ref< boolean >(false)
  let   maxFiles              = 5
  let   maxSize               = 10_240_000

  const archivosSubir         = ref<File[]>( [] )

  const props                 = defineProps({
    modulo:       { required: true,   type: String as PropType < TModulosDolibarr > },
    moduloRef:    { required: true,   type: String                                  },
    soloUno:      { default:  false,  type: Boolean                                 },
  })

  const emit = defineEmits<{
    (e: 'limpiar',                        ): void
    (e: 'subidaOk', value: File[] ): void    
  }>()
  const { modulo,
          moduloRef,
          soloUno,
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

  function seleccionar(){
    if(soloUno.value)
      archivosSubir.value.splice(1, archivosSubir.value.length-1)
  }

  async function subirArchivos()
  {
    cargandoArchivos.value    = true
    let ref_o_dir             = modulo.value === "thirdparty" ? "subdir" : "ref"
    for (const file  of archivosSubir.value)
    {
      let file_B64            = await FileToBase64(file)
      let objSubir            = {
                                  "filename":           file.name,
                                  "modulepart":         modulo.value,
                                  [ref_o_dir]:          moduloRef.value,
                                  "filecontent":        file_B64,
                                  "fileencoding":       "base64",
                                  "overwriteifexists":  "1",
                                }
      let { data, ok }        = await apiDolibarr( "subir", "documento", objSubir )
      if(!ok){
        aviso("negative", "Error al subir " + file.name, "file", 2400)
        terminar()
        return 
      }
    }

    emit("subidaOk", archivosSubir.value)
    aviso("positive", archivosSubir.value.length == 1 ? "Archivo subido" : "Archivos subidos",  "file", 2400)
    terminar()

    function terminar(){
      cargandoArchivos.value    = false
      archivosSubir.value       = []
    }
  }
</script>