<template>
  <ventana
    v-bind                      ="$attrs"
    titulo                      ="Anticipos"
    class-contenido             ="column items-center"
    icono                       ="mdi-cash-check"
    mensaje-sin-resultados      ="Sin anticipos"
    icono-sin-resultados        ="mdi-cash"
    size-icon-carga             ="8em"
    :padding-contenido          ="modo == 'normal' ? '0' : '12px' "
    :modo                       ="modo"
    >
    <template                   #barra>
      <!-- //* ///////////////  Nuevo anticipo  -->
      <q-btn        
        v-bind                  ="btnBaseSm"
        label                   ="Anticipo"
        color                   ="positive"
        icon                    ="mdi-cash-plus"        
        :disable                ="modo == 'buscando'"
        @click                  ="mostrarFormulario( new Anticipo( acuerdo.id ) )"
        >
        <Tooltip label          ="Subir anticipo"/>
      </q-btn>
      <q-btn                    round dense flat
        icon                    ="mdi-refresh"
        class                   ="op60 op100-hover"
        :disable                ="!acuerdo.id"
        @click                  ="buscarAcuerdos(acuerdo.id)"
        >
        <Tooltip label          ="Recargar anticipos"/>
      </q-btn>      
    </template>
    <template                   #menu>
      menu    {{ventanaFormulario}}
    </template>    
    <q-table                    borbordered dense flat grid hide-header hide-bottom
      class                     ="fit tabla-maco"
      row-key                   ="id"
      :rows                     ="anticipos"
      :columns                  ="columnas"
      >
      <!-- //* ///////////////////////////////////////////////////// Vista Card de producto -->
      <template                 #item="props">
        <card-anticipo
          :anticipo             ="props.row"
          @click-ver-archivo    ="verArchivo"
          @click-anticipo       ="mostrarFormulario"
          @click-subir          ="mostrarSubirArchivo"
        />
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
  </ventana>
  <!-- //* ///////////////////////////////////////////////////////////// Modal Buscar Formulario anticipo -->
  <q-dialog
    v-model                   ="ventanaFormulario"
    transition-show           ="slide-up"
    transition-hide           ="slide-down"
    >
    <formulario
      v-model                 ="anticipoSelect"
      @update:model-value     ="( ( a : IAnticipo ) => recibirAcuerdo( a, 'editar') )"
      @creado                 ="( ( a : IAnticipo ) => recibirAcuerdo( a, 'crear') )"
      @borrado                ="( ( a : IAnticipo ) => recibirAcuerdo( a, 'borrar') )"
    />
  </q-dialog>
    <!-- //* ///////////////////////////////////////////////////////////// Modal Buscar Formulario anticipo -->
  <q-dialog
    v-model                   ="ventanaSubirFile"
    transition-show           ="slide-up"
    transition-hide           ="slide-down"
    >
    <formulario-archivo
      :pedido-ref             ="acuerdo.ref"
      :tipo                   ="tipoFileSubir"
    />
  </q-dialog>
</template>

<script setup lang="ts">
  //* /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch                 } from "vue"
  //* /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'stores/acuerdo'
  //* /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAnticipo, Anticipo,
            TTipoFileAnticipo     } from "src/areas/acuerdos/models/Anticipo"
  import {  ModosVentana          } from "src/models/TiposVarios"
  import {  IColumna, Columna     } from "src/models/Tabla"  
  import {  IArchivo, Archivo     } from "src/models/Archivo"
  //* /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useFetch              } from "src/useSimpleOk/useFetch"
  import {  getURL,
            getFormData           } from "src/services/APIMaco"
  import {  useTools              } from "src/useSimpleOk/useTools"
  import {  btnBaseSm             } from "src/useSimpleOk/useEstilos"
  import {  useApiDolibarr        } from "src/services/useApiDolibarr"
  //* /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    cardAnticipo            from "./AnticipoCard.vue"
  import    formulario              from "./FormularioAnticipo.vue"
  import    formularioArchivo       from "./FormularioSubirAnticipo.vue"
  import    visorPdf                from "components/utilidades/VisorPDF.vue"  
  import    visorImagen             from "components/utilidades/VisorImagen.vue"

  const { acuerdo           } = storeToRefs( useStoreAcuerdo() )  
  const { miFetch           } = useFetch()
  const { aviso             } = useTools()
  const { apiDolibarr       } = useApiDolibarr()
  const anticipos             = ref< IAnticipo[]  >([])
  const modo                  = ref< ModosVentana >("buscando")
  const ventanaPDF            = ref< boolean    >(false)
  const ventanaImagen         = ref< boolean    >(false)
  const ventanaFormulario     = ref< boolean    >(false)
  const ventanaSubirFile      = ref< boolean    >(false)
  const tipoFileSubir         = ref< TTipoFileAnticipo >("interno")
  const fileNameSelect        = ref< string     >( "" )
  const anticipoSelect        = ref<IAnticipo>(new Anticipo())
  type  TImagenAver           = { src : string, titulo: string, fileType: string }
  const imagenAver            = ref< TImagenAver >( { titulo: "", src: "", fileType: "" } )
  const srcPDF                = ref< string     >("")
  const endPoint              = getURL("listas", "varios")

  const columnas: IColumna[]  = [
    new Columna({ name: "ref"       }),
  ]

  function unirAnticiposYFiles()
  {
    if(!acuerdo.value.archivos.length || !anticipos.value.length) return

    for (const anticipo of anticipos.value)
    {
      anticipo.fileInterno      = new Archivo()
      anticipo.fileInterno      = new Archivo()      
      if(!!anticipo.filenameInterno){
        const fileInterno       = acuerdo.value.archivos.find( ( a : IArchivo ) => a.name === anticipo.filenameInterno )
        if(!!fileInterno)
          anticipo.fileInterno  = fileInterno
      }

      if(!!anticipo.filenameCliente){
        const fileCliente       = acuerdo.value.archivos.find( ( a : IArchivo ) => a.name === anticipo.filenameCliente )
        if(!!fileCliente)
          anticipo.fileCliente  = fileCliente
      }
    }
  }

  watch(  ()        => acuerdo.value.id,
          async ( newId ) =>
            {
              if(!!newId) {                
                await buscarAcuerdos( newId )
              }
          },
          { immediate: true }
  )

  watch(  ()          => acuerdo.value.archivos,
          ( newFiles, oldFiles )=>
          {
            if(!!newFiles.length)
              unirAnticiposYFiles()
            
              // Se da cuando se boran todos los archivos
            if(!newFiles.length && !!oldFiles.length){
              anticipos.value.forEach( ( a :IAnticipo )=> {
                a.filenameCliente = ""
                a.filenameInterno = ""
                a.fileCliente     = new Archivo()
                a.fileInterno     = new Archivo()
              } )
            }
          },
          { deep: true }
  )


  async function buscarAcuerdos( id : number )
  {
    modo.value                = "buscando"
    anticipos.value           = []
    let { ok, data}           = await miFetch(  endPoint,
                                                { method: "POST", body: getFormData( "anticipos", { id } ) },
                                                { dataEsArray: true, mensaje: "buscar anticipos" }
                                              )
    if(ok)
    {
      modo.value              = "normal"
      if(!Array.isArray(data) || !data.length) return
      for (const item of data) 
        anticipos.value.push( await Anticipo.anticipoApiToAnticipo( item ) )      
    }
    else{
      modo.value              = "sin-resultados"
    }

    unirAnticiposYFiles()
  }

  function mostrarFormulario( anticipo : IAnticipo )
  {
    anticipoSelect.value      = anticipo
    ventanaFormulario.value   = true
  }

  function mostrarSubirArchivo( t : TTipoFileAnticipo ) {
    tipoFileSubir.value       = t
    ventanaSubirFile.value    = true
  } 

  async function verArchivo( archivo : IArchivo )
  {
    fileNameSelect.value      = archivo.nombreCorto
    archivo.loading           = true

    let { data, ok }          = await apiDolibarr( "descargar", "documento", archivo.endPoint )
    archivo.loading           = false

    if(ok){
      const descarga          = data as any
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

  function recibirAcuerdo( anticipo : IAnticipo, accion : "crear" | "editar" | "borrar" )
  {
    if(accion === "editar" || accion === "borrar")
    {
      const index                 = anticipos.value.findIndex( a => a.id === anticipo.id )
      if(index >= 0){
        if(accion === "editar")
          anticipos.value[index]  = anticipo
        else{
          anticipos.value.splice(index, 1)
          if(!anticipos.value.length)
            modo.value            = "sin-resultados"
        }
      }
    }
    else{ // Nuevo
      anticipos.value.push( anticipo )
      modo.value                  = "normal"
    }
    
    ventanaFormulario.value       = false
  }
</script>
