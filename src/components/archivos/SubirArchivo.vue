<template>
  <q-file                   use-chips append dense hide-bottom-space borderless multiple
    v-bind                  ="$attrs"
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
        icon                ="mdi-cloud-upload"
        padding             ="none"
        :loading            ="cargandoArchivos"
        @click              ="subirArchivos"
        >
        <Tooltip label      ="Subir archivos"/>
      </q-btn>
    </template>
  </q-file>
  <!-- //* ///////////////////////////////////// Boton borrar mantener productos -->
  <q-btn                    round dense flat
    icon                    ="mdi-image-area-close"
    class                   ="op70 op100-hover"
    :disable                ="cargandoArchivos"    
    >
    <Tooltip label          ="Pegar imagen"/>
    <q-menu                 fit
      v-model               ="menuCopiarPegar"
      transition-show       ="jump-down"
      transition-hide       ="jump-up"
      anchor                ="bottom middle"
      self                  ="top middle"
      @hide                 ="limpiarCopiaPegar"
      >
      <div
        class               ="q-ma-md gap-md"
        style               ="min-width: 220px; max-width: 440px;"
        >
        <q-form
          ref               ="formulario"
          class             ="column"
          @submit           ="subirImagenPegadaBase64"
          >
          <div  class       ="text-center q-mb-sm text-grey-7 text-1em">
            Copia y pega una captura de pantalla
          </div>
          <input-text       autofocus alerta
            v-model         ="nombreImagen"
            label           ="Nombre"
            icon            ="mdi-sign-text"
            class           ="q-mb-sm"
            :loading        ="cargandoArchivos"
            :disable        ="cargandoArchivos"
            :rules          ="[ archivoExistente ]"
          />
          <q-btn
            v-bind          ="btnBaseSm"
            label           ="Pegar"
            color           ="positive"
            icon            ="mdi-clipboard-check"
            type            ="submit"
            class           ="q-mb-sm"
            :loading        ="cargandoArchivos"
            :disable        ="modelEditor.length < 20"
          />
          <q-editor        
            v-bind          ="WYSIWYG_Imagen"
            v-model         ="modelEditor"
            placeholder     ="Pega aca"
            max-height      ="220px"
            :disable        ="cargandoArchivos"
          />          
        </q-form>        
      </div>
    </q-menu>   
  </q-btn>
</template>

<script setup lang="ts">
  //accept                  =".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx, .txt, .pdf, .ods, .odt" pdfjs
  import {  ref, 
            toRefs,
            PropType,
            computed,
                            } from "vue"
  import {  useApiDolibarr  } from "src/services/useApiDolibarr"
  import {  useTools        } from "src/useSimpleOk/useTools"
  import {  FileToBase64,
            limpiarStringBase64,
            TModulosDolibarr
                            } from "src/useSimpleOk/UtilFiles"

  import {  format          } from "quasar"
  import {  btnBaseSm,
            WYSIWYG_Imagen  } from "src/useSimpleOk/useEstilos"
  import    inputText         from "src/components/utilidades/input/InputFormText.vue"  
  import {  IArchivo        } from "src/models/Archivo"

  const { apiDolibarr       } = useApiDolibarr()
  const { aviso             } = useTools()
  const { humanStorageSize  } = format
  const cargandoArchivos      = ref< boolean >(false)
  const formulario            = ref< any >()  
  
  let   maxFiles              = 5
  let   maxSize               = 10_240_000

  const archivosSubir         = ref< File[]>( [] )
  const menuCopiarPegar       = ref< boolean >( false )
  const modelEditor           = ref< string>( "" )
  const nombreImagen          = ref< string>( "" )
  
  const props                 = defineProps({
    modulo:       { required: true,   type: String as PropType < TModulosDolibarr > },
    moduloRef:    { required: true,   type: String                                  },
    soloUno:      { default:  false,  type: Boolean                                 },
    archivos:     { required: true,   type: Array as PropType < IArchivo[] > },
  })

  const emit = defineEmits<{
    (e: "limpiar"   ): void
    (e: "subidaOk"  ): void    
  }>()
  const { modulo,
          moduloRef,
          soloUno,
          archivos,
                            } = toRefs( props )

  const nombreImagenFull      = computed(()=> nombreImagen.value + ".png")
  const ref_o_dir             = computed(()=> modulo.value === "thirdparty" ? "subdir" : "ref")

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
    
    for (const file  of archivosSubir.value)
    {
      const file_B64          = await FileToBase64(file)
      const objSubir          = getObjetoSubir( file.name, file_B64 )
      const ok                = await subirArchivo(objSubir, file.name)
      if(!ok){
        terminar()
        return
      } 
    }

    emit("subidaOk")
    aviso("positive", archivosSubir.value.length == 1 ? "Archivo subido" : "Archivos subidos",  "file", 2400)
    terminar()

    function terminar(){
      cargandoArchivos.value    = false
      archivosSubir.value       = []
    }
  }

  async function subirArchivo( archivoSubir : any, nombre : string) : Promise<boolean>
  {
    const { data, ok }      = await apiDolibarr( "subir", "documento", archivoSubir )
    if(!ok){
      aviso("negative", "Error al subir " + nombre, "file", 2400)
    }
    return ok
  }

  function getObjetoSubir( nombre : string, file_B64 : string ) : any
  {
    const objSubir          = {
                                  "filename":           nombre,
                                  "modulepart":         modulo.value,
                                  [ref_o_dir.value]:    moduloRef.value,
                                  "filecontent":        file_B64,
                                  "fileencoding":       "base64",
                                  "overwriteifexists":  "1",
                                }
    return objSubir
  }

  //* ////////////////////////////////////////////////////////////////////////////////////// Validar
  async function validar() {
    const  validacionOk        = await formulario.value.validate()
    if(validacionOk)          subirImagenPegadaBase64()  
  }

  //* ////////////////////////////////////////////////////////////////////////////////////// Submit
  async function subirImagenPegadaBase64()
  {
    const img64               = getImgPegadaBase64()
    if(!!img64)
    {
      const objSubir          = getObjetoSubir( nombreImagenFull.value, img64 )
      cargandoArchivos.value  = true
      const ok                = await subirArchivo(objSubir, nombreImagenFull.value)
      if(ok)
      {
        emit("subidaOk")
        aviso("positive", "Imagen de portapapeles subida",  "file", 2400)        
      }
      cargandoArchivos.value  = false 
      menuCopiarPegar.value   = false
      limpiarCopiaPegar()
    }
    else
    {
      modelEditor.value       = ""
    }
  }


  function getImgPegadaBase64() : string 
  {
    const el                  = document.createElement( 'html' );
    el.innerHTML              = modelEditor.value
    const images              = el.getElementsByTagName( "img" )
    let   imagenBase64        = ""

    if(!!images && !!images.length && "src" in images[0] && images[0].src.length > 10)
      imagenBase64            = limpiarStringBase64( images[0].src )
    
    return imagenBase64
  }

  function archivoExistente() : boolean | string {
    const noExiste            = !archivos.value.find( a => a.name === nombreImagenFull.value )
    return noExiste  || "Ya hay un archivo con ese nombre"
  }

  function limpiarCopiaPegar()  {
    nombreImagen.value        = ""
    modelEditor.value         = ""
  }

</script>