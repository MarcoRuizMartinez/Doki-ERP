<script setup lang="ts">
  //accept                  =".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx, .txt, .pdf, .ods, .odt" pdfjs
  import {  ref,
            toRefs,
            watch,
            onMounted,
            PropType
                            } from "vue"
  import {  useApiDolibarr  } from "src/composables/useApiDolibarr"
  import {  TModosVentana    } from "src/models/TiposVarios"
  import {  useTools, Tool  } from "src/composables/useTools"
  import {  DownloadFile_B64} from "src/composables/UtilFiles"
  import {  TModulosDolibarr} from "src/composables/UtilFiles"
  import {  IColumna,
            Columna         } from "src/models/Tabla"
  import {  IArchivo,
            Archivo         } from "src/models/Archivo"
  import {  style           } from "src/composables/useEstilos"            
  import    ventana           from "components/utilidades/Ventana.vue"
  import    subirArchivo      from "./SubirArchivo.vue"
  import    tooltipDocumento  from "./TooltipArchivo.vue"
  import    btnVisualizar     from "./BtnVisualzarArchivo.vue"
  import    confirmar         from "components/utilidades/MenuConfirmar.vue"

  const { apiDolibarr       } = useApiDolibarr()
  const { aviso             } = useTools()
  const modo                  = ref< TModosVentana >("buscando")
  const archivos              = ref< IArchivo[] >([])

  const props                 = defineProps({
    modulo:       { required: true,   type: String as PropType < TModulosDolibarr > },
    moduloId:     { required: true,   type: Number                                  },
    retrasoInicio:{ default:  0,      type: Number                                  },
    moduloRef:    { required: true,   type: String                                  },
    puedeEditar:  { default:  false,  type: Boolean                                 },
    sinSubida:    { default:  false,  type: Boolean                                 },
    sinTitulo:    { default:  false,  type: Boolean                                 },
    sizeIcon:     { default:  "6em",  type: String                                  },    
  })
  const emit = defineEmits<{
    (e: "subidaOk",   value: IArchivo[]  ): void
    (e: "descargaOk", value: IArchivo[]  ): void
    (e: "borradoOk",  value: IArchivo[]  ): void
  }>()

  const { modulo,
          moduloId,
          moduloRef,
          puedeEditar,
          retrasoInicio
                            } = toRefs( props )
  //let puedeSubir              = true//modulo.value === "thirdparty" || !puedeEditar.value ? false : true //computed(()=>{ modulo.value === "thirdparty" })
  
  const columnas: IColumna[]  = [
    new Columna({ name: "name",     label: "Archivo"  }),
    new Columna({ name: "tipo",     label: "."        })
  ]

  onMounted( async ()=> { 
    await Tool.pausa( retrasoInicio.value )
    buscarArchivos() 
  })

  watch(moduloId,  (newId) => {    
    buscarArchivos("watch", newId)
  })

  async function buscarArchivos( origen : string = "desconocido", id : number = moduloId.value )
  {
    if(id                     <= 0) return 
    modo.value                = "buscando"
    let { data, ok }          = await apiDolibarr( "buscar", "documento", "modulepart=" + modulo.value + "&id=" + id )
    
    if(ok && Array.isArray( data ) && !!data.length)
    {
      archivos.value          = []
      for (const documento of data)
      {
        const file = Object.assign( new Archivo(), documento ) as IArchivo
        if("name" in documento)
          file.label = documento?.name ?? ""

        archivos.value.push( file )
      }
      
      if(origen === "subida")
        emit("subidaOk", archivos.value)
      if(!!archivos.value.length)
        emit("descargaOk", archivos.value)

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
      emit("borradoOk", archivos.value)
      if(!archivos.value.length)
        modo.value            = "sin-resultados"
    }
    else
      aviso("negative", "Error al borrar archivo", "file")
  }

</script>

<template>
  <ventana
    class-contenido             ="column items-center"
    :titulo                     ="`Documentos (${archivos.length})`"
    icono                       ="mdi-attachment"
    mensaje-sin-resultados      ="Sin documentos"
    icono-sin-resultados        ="mdi-file-document-multiple"
    :size-icon-carga            ="sizeIcon"
    :sin-titulo                 ="sinTitulo"
    :padding-contenido          ="modo == 'normal' ? '0' : '12px' "
    :modo                       ="modo"
    >
    <!-- :menu-visible               ="!sinSubida" -->
    <!-- //* ////////////////   Tabla  -->
    <q-table                    bordered dense flat
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
            class               ="row"
            style               ="padding-left: 4px;"
            :props              ="props" 
            >
            <!-- //* /////////  Icono Extencion  -->
            <div class         ="iconos-doc">
              <q-icon
                v-if            ="(!props.row.loading && true)"
                class           ="op90"
                size            ="sm"
                :color          ="props.row.iconoColor"
                :name           ="props.row.icono"
                >
                <Tooltip :label ="props.row.extension.toUpperCase()"/>
              </q-icon>
              <!-- //* /////////  Spinner  -->
              <q-spinner 
                v-else
                class           ="op90"
                size            ="xs"
                :thickness      ="4"
              />
            </div>
            <!-- //* /////////  Nombre archivo de descarga  -->
            <q-btn              flat dense no-caps rounded
              padding           ="0px 6px"
              class             ="ellipsis btn-max"
              align             ="left"
              :label            ="props.row.name"
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
            <btn-visualizar     
              :archivo          ="props.row"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
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
    <template                   #menu>
      <slot></slot>
      <q-btn
        v-if                    ="sinTitulo"
        v-bind                  ="style.btnRedondoFlatMd"
        icon                    ="mdi-refresh"
        class                   ="op60 op100-hover"
        @click                  ="buscarArchivos()"
        >
        <Tooltip label          ="Recargar"/>
      </q-btn>      
      <!-- //* ///////////////  Subir archivo  -->
      <subir-archivo
        v-if                    ="!sinSubida"
        class                   ="full-width"
        label                   ="Subir archivos"
        :modulo                 ="modulo"
        :modulo-ref             ="moduloRef"
        :archivos               ="archivos"
        @subida-ok              ="buscarArchivos('subida')"
      />
    </template>    
  </ventana>
</template>

<style>
.iconos-doc{
  width: 26px;
}
.btn-max{
  max-width: 280px;
}
</style>