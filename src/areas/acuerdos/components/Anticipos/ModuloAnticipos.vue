po<template>
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
        @click                  ="mostrarFormulario( 'nuevo' )"
        >
        <Tooltip label          ="Subir anticipo"/>
      </q-btn>
      <q-btn                    round dense flat
        icon                    ="mdi-refresh"
        class                   ="op60 op100-hover"
        :disable                ="!acuerdo.id"
        @click                  ="buscarAnticipos(acuerdo.id)"
        >
        <Tooltip label          ="Recargar anticipos"/>
      </q-btn>      
    </template>
    <template                   #menu>
      <div  class               ="text-center full-width text-1_1em">
        <span class             ="text-grey-10">
          Total anticipos:
        </span>
        <span class             ="fuente-mono text-grey-8 text-bold">
          {{ formatoPrecio( acuerdo.totalAnticipos, 'decimales-no' )}}
        </span>
      </div>
    </template>    
    <q-table                    borbordered dense flat grid hide-header hide-bottom
      class                     ="fit tabla-maco"
      row-key                   ="id"
      :rows                     ="acuerdo.anticipos"
      :columns                  ="columnas"
      >
      <!-- //* ///////////////////////////////////////////////////// Vista Card de producto -->
      <template                 #item="props">
        <card-anticipo
          v-model               ="props.row"
          @click-ver-archivo    ="verArchivo"
          @click-anticipo       ="mostrarFormulario"
          @click-recibo         ="generarReciboCaja"
        />
      </template>
    </q-table>
    <!-- //* /////////////////  Visor PDF anticipo -->
    <visor-pdf                  en-base-64
      v-model:src               ="srcPDF"
      v-model:visible           ="ventanaPDF"
      :nombre-pdf               ="fileNameSelect"
    />
    <!-- //* /////////////////  Visor imagen anticipo -->
    <visor-imagen               en-base-64
      v-model:src               ="imagenAver.src"
      v-model:visible           ="ventanaImagen"
      :ratio                    ="''"
      :titulo                   ="imagenAver.titulo"
      :fileType                 ="imagenAver.fileType"
    />
    <!-- //* /////////////////  Visor recibo caja  -->
    <visor-pdf                  descargar
      v-model:src               ="srcPDFRecibo"
      v-model:visible           ="ventanaPDFRecibo"
      nombre-pdf                ="ReciboCaja"      
    />
    <!-- @click-descargar        ="guardarPDF" -->
  </ventana>
  <!-- //* ///////////////////////////////////////////////////////////// Modal Buscar Formulario anticipo -->
  <q-dialog
    v-model                   ="ventanaFormulario"
    transition-show           ="slide-up"
    transition-hide           ="slide-down"
    >
    <formulario
      v-model                 ="anticipo"
      @update:model-value     ="( ( a : IAnticipo ) => recibirAnticipo( a, 'editar') )"
      @creado                 ="( ( a : IAnticipo ) => recibirAnticipo( a, 'crear') )"
      @borrado                ="( ( a : IAnticipo ) => recibirAnticipo( a, 'borrar') )"
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
  import {  useTools, 
            formatoPrecio         } from "src/useSimpleOk/useTools"
  import {  btnBaseSm             } from "src/useSimpleOk/useEstilos"
  import {  useApiDolibarr        } from "src/services/useApiDolibarr"
  import {  useReciboCajaPDF      } from "src/areas/acuerdos/composables/useReciboCajaPDF"
  //* /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    cardAnticipo            from "./CardAnticipo.vue"
  import    formulario              from "./FormularioAnticipo.vue"
  import    visorPdf                from "components/utilidades/VisorPDF.vue"  
  import    visorImagen             from "components/utilidades/VisorImagen.vue"

  const { acuerdo, anticipo } = storeToRefs( useStoreAcuerdo() )  
  const { miFetch           } = useFetch()
  const { aviso             } = useTools()
  const { apiDolibarr       } = useApiDolibarr()
  const modo                  = ref< ModosVentana >("buscando")
  const ventanaPDF            = ref< boolean    >(false)
  const ventanaPDFRecibo      = ref< boolean    >(false)
  const ventanaImagen         = ref< boolean    >(false)
  const ventanaFormulario     = ref< boolean    >(false)
  const tipoFileSubir         = ref< TTipoFileAnticipo >("interno")
  const fileNameSelect        = ref< string     >( "" )
  type  TImagenAver           = { src : string, titulo: string, fileType: string }
  const imagenAver            = ref< TImagenAver >( { titulo: "", src: "", fileType: "" } )
  const srcPDF                = ref< string     >("")
  const srcPDFRecibo          = ref< string     >("")
  const endPoint              = getURL("listas", "varios")

  const { generarPDF,
          guardarPDF        } = useReciboCajaPDF()

  const columnas: IColumna[]  = [
    new Columna({ name: "ref"       }),
  ]

  function unirAnticiposYFiles()
  {
    if(!acuerdo.value.archivos.length || !acuerdo.value.anticipos.length) return

    for (const pago of acuerdo.value.anticipos)
    {
      pago.fileInterno      = new Archivo()
      pago.fileInterno      = new Archivo()      
      if(!!pago.filenameInterno){
        const fileInterno       = acuerdo.value.archivos.find( ( a : IArchivo ) => a.name === pago.filenameInterno )
        if(!!fileInterno)
          pago.fileInterno  = fileInterno
      }

      if(!!pago.filenameCliente){
        const fileCliente       = acuerdo.value.archivos.find( ( a : IArchivo ) => a.name === pago.filenameCliente )
        if(!!fileCliente)
          pago.fileCliente  = fileCliente
      }
    }
  }

  watch(  ()        => acuerdo.value.id,
          async ( newId ) =>
            {
              if(!!newId) {                
                await buscarAnticipos( newId )
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
              acuerdo.value.anticipos.forEach( ( a :IAnticipo )=> {
                a.filenameCliente = ""
                a.filenameInterno = ""
                a.fileCliente     = new Archivo()
                a.fileInterno     = new Archivo()
              } )
            }
          },
          { deep: true }
  )


  async function buscarAnticipos( id : number )
  {
    modo.value                = "buscando"
    acuerdo.value.anticipos   = []
    let { ok, data}           = await miFetch(  endPoint,
                                                { method: "POST", body: getFormData( "anticipos", { id } ) },
                                                { dataEsArray: true, mensaje: "buscar anticipos" }
                                              )
    if(ok)
    {
      modo.value              = "normal"
      if(!Array.isArray(data) || !data.length) return
      for (const item of data){ 
        const acu             = await Anticipo.anticipoApiToAnticipo( item )
        acuerdo.value.anticipos.push( acu )
      }
    }
    else{
      modo.value              = "sin-resultados"
    }

    unirAnticiposYFiles()
  }

  function mostrarFormulario( anti : IAnticipo | 'nuevo' )
  {
    if(anti                   === 'nuevo')
      anticipo.value          = new Anticipo( acuerdo.value.id )
    else
      anticipo.value          = anti
    console.log("anticipo.value: ", anticipo.value);
    ventanaFormulario.value   = true
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

  function recibirAnticipo( antici : IAnticipo, accion : "crear" | "editar" | "borrar" )
  {
    if(accion === "editar" || accion === "borrar")
    {
      const index                 = acuerdo.value.anticipos.findIndex( a => a.id === antici.id )
      if(index >= 0){
        if(accion === "editar")
          acuerdo.value.anticipos[index]  = antici
        else{
          acuerdo.value.anticipos.splice(index, 1)
          if(!acuerdo.value.anticipos.length)
            modo.value            = "sin-resultados"
        }
      }
    }
    else{ // Nuevo
      acuerdo.value.anticipos.push( antici )
      modo.value                  = "normal"
    }
    
    ventanaFormulario.value       = false
  }

  async function generarReciboCaja( anti : IAnticipo )
  {
    ventanaPDFRecibo.value        = true
    anticipo.value                = anti
    srcPDFRecibo.value            = await generarPDF()
  }
</script>
