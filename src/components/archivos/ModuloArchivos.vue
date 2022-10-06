<template>
  <ventana                      minimizar
    class-contenido             ="column items-center"
    :titulo                     ="`Documentos (${archivos.length})`"
    icono                       ="mdi-file-document-multiple"
    size-icon-carga             ="6em"
    mensaje-sin-resultados      ="Sin documentos"
    icono-sin-resultados        ="mdi-file-document-multiple"
    :minimizado                 ="minimizado"
    :padding-contenido          ="modo == 'normal' ? '0' : '12px' "
    :modo                       ="modo"
    :menu-visible               ="puedeSubir"
    >
    <!-- //* ////////////////   Tabla  -->
    <q-table                    borbordered dense flat
      v-if                      ="!!archivos.length"
      class                     ="fit tabla-maco"
      row-key                   ="id"
      :rows-per-page-options    ="[10, 20, 50]"
      :hide-bottom              ="archivos.length <= 10"
      :rows                     ="archivos"
      :columns                  ="columnas"
      > 
      <template #body           ="props">
        <q-tr   :props          ="props">
          <q-td
            key                 ="name"
            style               ="padding-left: 4px;"
            :props              ="props" 
            >
            <!-- //* /////////  Icono Extencion  -->
            <q-icon
              v-if              ="!props.row.loading"
              class             ="iconos-doc op90"
              size              ="sm"
              :color            ="props.row.iconoColor"
              :name             ="props.row.icono"
              >
              <Tooltip :label   ="props.row.extension.toUpperCase()"/>
            </q-icon>
            <!-- //* /////////  Spinner  -->
            <q-spinner 
              v-else
              class             ="iconos-doc op90"
              size              ="1.2em"
              :thickness        ="10"
            />
            <!-- //* /////////  Nombre archivo de descarga  -->
            <q-btn              flat dense no-caps rounded
              padding           ="0px 6px"
              class             ="ellipsis btn-max"
              align             ="left"
              :label            ="props.row.nombreCorto"
              :disable          ="props.row.loading"
              @click            ="descargarArchivo(props.row as Archivo)"
              >
              <tooltip-documento  :archivo="( props.row as Archivo )" />
            </q-btn>
            
          </q-td>
          <q-td
            :props              ="props"
            key                 ="tipo"
            style               ="padding-right: 4px;"
            >
            <!-- //* /////////  Borrar archivo -->
            <q-btn              flat dense round
              v-if              ="puedeEditar"
              icon              ="mdi-delete"
              class             ="op40 op100-hover"
              padding           ="none"
              size              ="md"
              >
              <confirmar  @ok   ="borrarArchivoOk( props.row )"/>
              <Tooltip    :label="'Borrar archivo ' + props.row.name"/>
            </q-btn>            
            <!-- //* /////////  Lupa ver PDF  -->
            <q-btn              flat dense round
              v-if              ="props.row.esVisualizable"
              icon              ="mdi-magnify-plus"
              class             ="op40 op100-hover"
              padding           ="none"
              size              ="md"
              @click            ="verArchivo( props.row )"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- //* /////////////////  Visor PDF  -->
    <visor-pdf                  en-base-64
      v-model:src               ="srcPDF"
      v-model:visible           ="ventanaPDF"
      :nombre-pdf               ="fileNameSelect"
    />
    <visor-imagen               en-base-64
      v-model:src               ="imagenAver.src"
      v-model:visible           ="ventanaImagen"
      :ratio                    ="''"
      :titulo                   ="imagenAver.titulo"
      :fileType                 ="imagenAver.fileType"
    />
    <template                   #barra>
      <q-btn                    round dense flat
        icon                    ="mdi-refresh"
        class                   ="op60 op100-hover"
        @click                  ="buscarArchivos()"
        >
        <Tooltip label          ="Recargar"/>
      </q-btn>
      <!-- //* ///////////////  Boton subir  -->
      <!-- v-if                    ="!puedeSubir && puedeEditar" -->
    </template>
    <template #menu v-if        ="puedeSubir">
      <!-- //* ///////////////  Subir archivo  -->
      <subir-archivo
        :modulo                 ="modulo"
        :modulo-ref             ="moduloRef"
        @subida-ok              ="buscarArchivos"
      />
    </template>    
  </ventana>
</template>

<script setup lang="ts">
  //accept                  =".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx, .txt, .pdf, .ods, .odt" pdfjs
  import {  ref,
            toRefs,
            watch,
            onMounted,
            PropType
                            } from "vue"
  import {  useApiDolibarr  } from "src/services/useApiDolibarr"
  import {  ModosVentana    } from "src/models/TiposVarios"
  import {  useTools        } from "src/useSimpleOk/useTools"
  import {  DownloadFile_B64} from "src/useSimpleOk/UtilFiles"
  import {  TModulosDolibarr} from "src/useSimpleOk/UtilFiles"
  import {  IColumna,
            Columna         } from "src/models/Tabla"
  import {  IArchivo,
            Archivo         } from "src/models/Archivo"
  import    ventana           from "components/utilidades/Ventana.vue"
  import    visorPdf          from "components/utilidades/VisorPDF.vue"  
  import    visorImagen       from "components/utilidades/VisorImagen.vue"
  import    subirArchivo      from "./SubirArchivo.vue"
  import    tooltipDocumento  from "./TooltipArchivo.vue"
  import    confirmar         from "components/utilidades/MenuConfirmar.vue"

  const { apiDolibarr       } = useApiDolibarr()
  const { aviso             } = useTools()
  const modo                  = ref< ModosVentana >("buscando")
  const archivos              = ref< IArchivo[] >([])
  const fileNameSelect        = ref< string     >( "" )
  const ventanaPDF            = ref< boolean    >(false)
  const ventanaImagen         = ref< boolean    >(false)
  const srcPDF                = ref< string     >("")
  type  TImagenAver           = { src : string, titulo: string, fileType: string }
  const imagenAver            = ref< TImagenAver >( { titulo: "", src: "", fileType: "" } )
  
  const props                 = defineProps({
    modulo:       { required: true,   type: String as PropType < TModulosDolibarr > },
    moduloId:     { required: true,   type: Number                                  },
    moduloRef:    { required: true,   type: String                                  },
    puedeEditar:  { default:  false,  type: Boolean                                 },
    minimizado:   { default:  false,  type: Boolean                                 },
  })

  const { modulo,
          moduloId,
          moduloRef,
          puedeEditar
                            } = toRefs( props )
  let puedeSubir              = true//modulo.value === "thirdparty" || !puedeEditar.value ? false : true //computed(()=>{ modulo.value === "thirdparty" })
  const urlDolibarr           = process.env.URL_DOLIBARR

  const columnas: IColumna[]  = [
    new Columna({ name: "name",     label: "Archivo"  }),
    new Columna({ name: "tipo",     label: "."        })
  ]


  onMounted( buscarArchivos )

  watch(moduloId, (newId, oldId) => {
    buscarArchivos(newId)
  })

  async function buscarArchivos( id : number = moduloId.value )  
  {
    if(id                     <= 0) return 
    modo.value                = "buscando"
    let { data, ok }          = await apiDolibarr( "buscar", "documento", "modulepart=" + modulo.value + "&id=" + id )
    
    if(ok && Array.isArray( data ) && !!data.length)
    {
      archivos.value        = []
      for (const documento of data)
        archivos.value.push( Object.assign( new Archivo(), documento ) )        
      
      modo.value              = "normal"
    }
    else
      modo.value              = "sin-resultados"
  }

  async function descargarArchivo( archivo : IArchivo )
  {
    archivo.loading           = true
    let { data, ok }          = await apiDolibarr( "descargar", "documento", archivo.endPoint )
    archivo.loading           = false

    if(ok)
    {
      let descarga            = data as any
      DownloadFile_B64( descarga.content, archivo.name,  descarga["content-type"] )
      aviso("positive", "Archivo descargado", "file")
    }
    else
      aviso("negative", "Error descargando el archivo", "file")
  }


  async function verArchivo( archivo : IArchivo )
  {
    fileNameSelect.value      = archivo.nombreCorto
    archivo.loading           = true
    let { data, ok }          = await apiDolibarr( "descargar", "documento", archivo.endPoint )
    archivo.loading           = false

    if(ok){
      let descarga            = data as any
      //console.log("descarga: ", descarga);

      if(archivo.tipo         === "PDF"){        
        srcPDF.value          = descarga.content
        ventanaPDF.value      = true
      }
      else
      if(archivo.tipo         === "Imagen"){
        imagenAver.value      = { titulo: archivo.nombreCorto, src: descarga.content, fileType: archivo.fileType }
        ventanaImagen.value   = true
      }
    }
    else
      aviso("negative", "Error descargando el archivo", "file")
  }

  async function borrarArchivoOk( archivo : IArchivo )
  {
    archivo.loading           = true
    let { data, ok }          = await apiDolibarr( "borrar", "documento", archivo.endPoint)
    archivo.loading           = false
    
    if(ok)
    {
      let index               = archivos.value.findIndex( a => a.relativename == archivo.name ) 
      archivos.value.splice(index, 1)
      aviso("positive", "Archivo borrado", "file")

      if(!archivos.value.length)
        modo.value            = "sin-resultados"
    }
    else
      aviso("negative", "Error al borrar archivo", "file")
  }

</script>
<style>
.iconos-doc{
  width: 30px;
}
.btn-max{
  max-width: 280px;
}
</style>