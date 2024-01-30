<template>
  <ventana
    v-bind                      ="$attrs"
    titulo                      ="Anticipos / Autorización"
    class-contenido             ="column items-center"
    icono                       ="mdi-cash-check"
    mensaje-sin-resultados      ="Sin anticipos o autorizacion"
    icono-sin-resultados        ="mdi-cash"
    size-icon-carga             ="6.5em"
    :padding-contenido          ="modo == 'normal' ? '0' : '12px' "
    :modo                       ="modo"
    >
    <template                   #barra>
      <!-- //* ///////////////  Nuevo anticipo  -->
      <q-btn        
        v-bind                  ="style.btnBaseSm"
        color                   ="positive"
        icon                    ="mdi-plus"        
        :disable                ="modo == 'buscando'"
        @click                  ="mostrarFormulario( 'nuevo' )"
        >
        <Tooltip label          ="Subir anticipo o autorización"/>
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
      <!-- //* ///////////////////////////////////////////////// Condiciones pago -->
      <select-label-value       hundido
        v-model                 ="acuerdo.condicionPago"
        label                   ="Condiciones de pago"
        icon                    ="mdi-account-cash"
        class                   ="col-md-6 col-12"
        :options                ="condicPago"
        :loading                ="loading.condicionPago"
        @select                 ="editarCondicionPago"
      />
      <!-- //* ///////////////////////////////////////////////// Forma de pago -->
      <select-label-value       hundido
        v-model                 ="acuerdo.formaPago"
        label                   ="Forma de pago"
        icon                    ="mdi-cash-refund"
        class                   ="col-md-6 col-12"
        :options                ="formadPago"
        :loading                ="loading.formaPago"
        @select                 ="editarFormaPago"
      />
    </template>    
    <q-table                    bordered dense flat grid hide-header hide-pagination hide-bottom
      class                     ="fit tabla-maco"
      row-key                   ="id"
      style                     ="min-height: 160px;"
      :rows                     ="acuerdo.anticipos"
      :columns                  ="columnas"
      :rows-per-page-options    ="[200, 400]"
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
      <!-- //* ///////////////////////////////////////////////////// Vista Card de producto -->
      <template                 #top>
        <div  class             ="text-center full-width text-1_1em">
          <span class           ="text-grey-10">
            Total anticipos:
          </span>
          <span class           ="fuente-mono text-grey-8 text-bold">
            {{ Format.precio( acuerdo.totalAnticipos, 'decimales-no' )}}
          </span>
        </div>
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
      @click-descargar          ="saveReciboCajaPDF"
    />
  </ventana>
  <!-- //* ///////////////////////////////////////////////////////////// Modal Buscar Formulario anticipo -->
  <q-dialog
    v-model                     ="ventanaFormulario"
    v-bind                      ="style.dialogo"
    >
    <formulario
      v-model                   ="anticipo"
      @update:model-value       ="( ( a : IAnticipo ) => recibirAnticipo( a, 'editar') )"
      @creado                   ="( ( a : IAnticipo ) => recibirAnticipo( a, 'crear') )"
      @borrado                  ="( ( a : IAnticipo ) => recibirAnticipo( a, 'borrar') )"
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
  import {  TModosVentana         } from "src/models/TiposVarios"
  import {  IColumna, Columna     } from "src/models/Tabla"  
  import {  IArchivo, Archivo     } from "src/models/Archivo"
  //* /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useFetch              } from "src/composables/useFetch"
  import {  getURL,
            getFormData           } from "src/composables/APIMaco"
  import {  useTools, 
            Format                } from "src/composables/useTools"
  import {  style                 } from "src/composables/useEstilos"
  import {  useApiDolibarr        } from "src/composables/useApiDolibarr"
  import {  useReciboCajaPDF      } from "src/areas/acuerdos/composables/pdf/useReciboCaja"
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  dexieCondicionesPago,
            dexieFormasPago       } from "src/composables/useDexie"
  //* /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    cardAnticipo            from "../Anticipos/CardAnticipo.vue"
  import    formulario              from "../Anticipos/FormularioAnticipo.vue"
  import    visorPdf                from "components/utilidades/VisorPDF.vue"  
  import    visorImagen             from "components/utilidades/VisorImagen.vue"
  import    selectLabelValue        from "components/utilidades/select/SelectLabelValue.vue"

  const { acuerdo,
          anticipo,
          loading           } = storeToRefs( useStoreAcuerdo() )  
  const { miFetch           } = useFetch()
  const { aviso             } = useTools()
  const { apiDolibarr       } = useApiDolibarr()
  const condicPago            = dexieCondicionesPago()
  const formadPago            = dexieFormasPago()
  const { editarFormaPago,
          editarCondicionPago}= useControlAcuerdo()
  const modo                  = ref< TModosVentana >("buscando")
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

  const { getReciboCajaPDF,
          saveReciboCajaPDF   } = useReciboCajaPDF()

  const columnas: IColumna[]  = [
    new Columna({ name: "ref"       }),
  ]

  function unirAnticiposYFiles()
  {
    if(!acuerdo.value.archivos.length || !acuerdo.value.anticipos.length) return

    for (const pago of acuerdo.value.anticipos)
    {
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
    const { ok, data }        = await miFetch(  endPoint,
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
      
    ventanaFormulario.value   = true
  }

  async function verArchivo( archivo : IArchivo )  
  {
    fileNameSelect.value      = archivo.name
    archivo.loading           = true

    const { data, ok }        = await apiDolibarr( "descargar", "documento", archivo.endPoint )
    archivo.loading           = false

    if(ok){
      const descarga          = data as any
      if(archivo.tipo         === "PDF"){        
        srcPDF.value          = descarga.content
        ventanaPDF.value      = true
      }
      else
      if(archivo.tipo         === "Imagen"){
        imagenAver.value      = { titulo: archivo.name, src: descarga.content, fileType: archivo.fileType }
        ventanaImagen.value   = true
      }
    }
    else
      aviso("negative", "Error descargando el archivo", "file")
  }  

  async function recibirAnticipo( antici : IAnticipo, accion : "crear" | "editar" | "borrar" )
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

      for await (const forma of ["datafono", "banc", "efectivo", "línea"])
      {
        const ok = await cambiarFormaPago( forma )
        if(ok) break
      }
    }
    
    ventanaFormulario.value       = false

    async function cambiarFormaPago( formaLabel : string ) : Promise<boolean>
    {
      const encontro              = antici.cuenta.label.toLowerCase().includes(formaLabel)
      if(encontro)
      {
        const forma               = formadPago.value.find( f => f.label.toLowerCase().includes(formaLabel))
        if(!!forma){
          acuerdo.value.formaPago = forma
          await editarFormaPago(forma)
          return true
        }
      }

      return false
    }
  }

  async function generarReciboCaja( anti : IAnticipo )
  {
    ventanaPDFRecibo.value        = true
    anticipo.value                = anti
    srcPDFRecibo.value            = await getReciboCajaPDF()
  }
</script>