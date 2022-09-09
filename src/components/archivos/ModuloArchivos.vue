<template>
  <ventana                      minimizar
    class-contenido             ="column items-center"
    titulo                      ="Documentos"
    icono                       ="mdi-file-document-multiple"
    size-icon-carga             ="6em"
    mensaje-sin-resultados      ="Sin documentos"
    icono-sin-resultados        ="mdi-file-document-multiple"
    :padding-contenido          ="modo == 'normal' ? '0' : '12px' "
    :modo                       ="modo"
    :menu-visible               ="puedeSubir"
    >
    <!-- //* ////////////////   Tabla  -->
    <q-table                    borbordered dense flat
      v-if                      ="!!archivos.length"
      class                     ="fit tabla-maco"
      row-key                   ="id"
      :rows                     ="archivos"
      :columns                  ="columnas"
      > 
      <template #body           ="props">
        <q-tr   :props          ="props">
          <q-td :props          ="props"  key="name" >
            <!-- //* /////////  Icono Extencion  -->
            <q-icon
              v-if              ="!props.row.loading"
              class             ="iconos-doc op90"
              size              ="sm"
              :name             ="props.row.icono"
            />
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
              :label            ="props.row.name"
              :disable          ="props.row.loading"
              @click            ="descargarArchivo(props.row as Archivo)"
            />
            <tooltip-documento :archivo="( props.row as Archivo )" />
          </q-td>
          <q-td :props          ="props"  key="tipo" >
            <!-- //* /////////  Borrar archivo -->
            <q-btn              flat dense round
              v-if              ="puedeEditar"
              icon              ="mdi-delete"
              class             ="op40 op100-hover"
              padding           ="none"
              size              ="sm"
              @click            ="borrarArchivoAks( props.row as Archivo )"
            />
            <!-- //* /////////  Lupa ver PDF  -->
            <q-btn              flat dense round
              v-if              ="props.row.tipo == 'PDF'"
              icon              ="mdi-magnify-plus"
              class             ="op40 op100-hover"
              padding           ="none"
              size              ="sm"
              @click            ="verPDF( props.row as Archivo )"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- //* /////////////////  Visor PDF  -->
    <visor-pdf
      v-model:src               ="srcPDF"
      v-model:visible           ="ventanaPDF"
      :nombre-pdf               ="fileNameSelect"
    />
    <template #barra  v-if="!puedeSubir && puedeEditar">
      <!-- //* ///////////////  Boton subir  -->
      <q-btn                    round dense flat
        icon                    ="mdi-cloud-upload"
        class                   ="op60 op100-hover"
        type                    ="a"
        target                  ="_blank"
        :href                   ="urlDolibarr + '/societe/document.php?socid=' + refModulo"
      />
      <Tooltip label            ="Subir archivos en Dolibarr"/>      
    </template>
    <template #menu v-if        ="puedeSubir">
      <!-- //* ///////////////  Subir archivo  -->
      <subir-archivo />
    </template>    
  </ventana>
</template>

<script setup lang="ts">
  //accept                  =".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx, .txt, .pdf, .ods, .odt" pdfjs
  import {  ref,
            toRefs,
            watch,
            //onMounted,
            PropType
                            } from "vue"
  import {  useApiDolibarr  } from "src/services/useApiDolibarr"
  import {  ModosVentana    } from "src/models/TiposVarios"
  import {  useQuasar       } from 'quasar'
  import {  useTools,
            DownloadFile_B64} from "src/useSimpleOk/useTools"
  import {  IColumna,
            Columna         } from "src/models/Tabla"
  import {  IArchivo,
            Archivo         } from "src/models/Archivo"
  import    ventana           from "components/utilidades/Ventana.vue"
  import    visorPdf          from "components/utilidades/VisorPDF.vue"
  import    subirArchivo      from "./SubirArchivo.vue"
  import    tooltipDocumento  from "./TooltipArchivo.vue"
  const { apiDolibarr    } = useApiDolibarr()
  const { aviso             } = useTools()
  const { dialog            } = useQuasar()
  const modo                  = ref< ModosVentana >("buscando")
  const archivos              = ref< IArchivo[] >([])
  const fileNameSelect        = ref< string     >( "" )
  const ventanaPDF            = ref< boolean    >(false)
  const srcPDF                = ref< string     >("")
  type  Modulos               = "thirdparty" | "proposal" | "invoice" | "supplier_invoice" | "shipment" | "project"
  const props                 = defineProps({
    refModulo:    { required: true,   type: Number, default: 0          },
    modulo:       { required: true,   type: String as PropType<Modulos> },
    puedeEditar:  { default:  false,  type: Boolean                     },
  })


  const { refModulo,
          modulo,
          puedeEditar
                            } = toRefs( props )
  let puedeSubir              = false//modulo.value === "thirdparty" || !puedeEditar.value ? false : true //computed(()=>{ modulo.value === "thirdparty" })
  const urlDolibarr           = process.env.URL_DOLIBARR

  const columnas: IColumna[]  = [
    new Columna({ name: "name",     label: "Archivo"  }),
    new Columna({ name: "tipo",     label: "."  })
  ]


  //onMounted( buscarArchivos )
  watch(refModulo, (newId, oldId) => {
    buscarArchivos(newId)
  })

  async function buscarArchivos( id : number = refModulo.value )  
  {
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


  async function verPDF( archivo : IArchivo )
  {
    ventanaPDF.value          = true
    fileNameSelect.value      = archivo.name
    let { data, ok }          = await apiDolibarr( "descargar", "documento", archivo.endPoint )

    if(ok)
    {
      let descarga            = data as any
      srcPDF.value            = descarga.content
    }
    else
      aviso("negative", "Error descargando el archivo", "file")
  }

  function borrarArchivoAks( archivo : IArchivo )
  {
    dialog({
      title:    'Confirmar borrar archivo',
      message:  'Realmente deseas eliminar este documento? <br/><b>' + archivo.name + '</b>',
      class:    "text-center",
      cancel:   true,
      html:     true,
    }).onOk(() => {
      borrarArchivoOk( archivo )
    })
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
</style>