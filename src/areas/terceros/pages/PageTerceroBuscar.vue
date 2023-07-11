<template>
  <q-page padding class           ="row item-stretch content-start justify-start">
    <ventana
      class                       ="col-12"
      class-contenido             ="column items-center"
      :titulo                     ="terceros.length > 0 ? terceros.length + ' terceros encontrados ' : 'Buscar terceros'"
      icono                       ="mdi-account-search"
      height                      ="100%"
      size-icon-carga             ="22em"
      mensaje-sin-resultados      ="No se encontraron terceros" 
      :padding-contenido          ="modo == 'normal' ? '0' : '12px' "
      :modo                       ="modo"
      >
      <template                   #menu>
        <barra-busqueda
          @buscar                 ="buscar"
          @limpiar                ="limpiarBusqueda"
          @exportar               ="descargarTerceros"
          >
          <select-columnas
            v-model               ="columnasVisibles"
            label                 ="Columnas"
            :almacen              ="ALMACEN_LOCAL.COL_TERCEROS"
            :options              ="columnas"
          />
        </barra-busqueda>
      </template>
      <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
      <q-table                    bordered dense flat
        class                     ="fit tabla-maco tabla-alto-min"
        row-key                   ="id"
        :filter                   ="filtro"
        :rows                     ="terceros"
        :columns                  ="columnas"
        :visible-columns          ="columnasVisibles"
        :rows-per-page-options    ="[100]"
        >
      <!-- //* ///////////////////////////////////////////////////// Ref con link -->
      <template #body-cell-nombre ="props">
        <q-td :props              ="props">
          <linkTercero            :tercero="( props.row as Tercero ) "/>
        </q-td>
      </template>
      </q-table>
    </ventana>
  </q-page>
</template>

<script setup lang="ts">

  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref, onMounted      } from "vue"
  import {  useTitle            } from "@vueuse/core"
  import {  useRouter           } from "vue-router"            
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreUser        } from 'src/stores/user'
  import {  useStoreTercero     } from 'src/stores/terceros'

  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesTerceros    } from "src/areas/terceros/services/servicesTerceros"
  import {  useTools            } from "src/composables/useTools"
  import {  generarCSVDesdeTabla
                                } from "src/composables/UtilFiles"
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  Columna, IColumna   } from "src/models/Tabla"
  import {  Tercero             } from "src/areas/terceros/models/Tercero"
  import {  ModosVentana,
            ALMACEN_LOCAL       } from "src/models/TiposVarios"
  import {  IQuery              } from "src/models/Busqueda"            
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    linkTercero       from "src/areas/terceros/components/LinkTercero.vue"
  import    barraBusqueda     from "src/areas/terceros/components/busqueda/BarraBusquedaTerceros.vue"
  import    ventana           from "components/utilidades/Ventana.vue"
  import    selectColumnas    from "components/utilidades/select/SelectColumnas.vue"

  const { terceros,
          busqueda,
          loading               } = storeToRefs( useStoreTercero() )  

  const { usuario, permisos     } = storeToRefs( useStoreUser() )  
  const { buscarTerceros        } = servicesTerceros()
  const { aviso                 } = useTools()
  const modo                      = ref< ModosVentana >("esperando-busqueda")
  const router                    = useRouter()
  const filtro                    = ref< string   >("")
  const title                     = useTitle("🔍 Buscar tercero")
  const columnas                  = ref< IColumna[] >([])
  const columnasVisibles          = ref< string[]   >([])

  onMounted(iniciar)

  async function iniciar()
  {    
    terceros.value                = []
    modo.value                    = "esperando-busqueda"
    await busqueda.value.montarBusqueda( usuario.value.id, router, usuario.value.esComercial, permisos.value.acceso_total, 50 )
    crearColumnas()
  }


  function crearColumnas()
  {
    columnas.value = [
      new Columna({name: "nombre",            iterable: false       }),
      new Columna({name: "responsablesLista", label: "Responsables" }),
      new Columna({name: "color"                                   }),
      new Columna({name: "ciudad"                                   }),
      new Columna({name: "correo",                                  visible: false  }),
      new Columna({name: "alias",                                   visible: false  }),
      new Columna({name: "telefono",          label: "Teléfono",    visible: false  }),
      new Columna({name: "numeroDocumento",   label: "Documento"    }),
      new Columna({name: "direccion",         label: "dirección"    }),
      new Columna({name: "areaNombre",        label: "area"         }),
      new Columna({name: "tiposTerceros",     label: "Tipo"         }),                                      
      new Columna({name: "fechaCreadoCorta",  label: "Creado",      visible: false  }),
    ]

    columnasVisibles.value  = columnas.value.filter(c => c.visible ).map( c => c.name )
  } 

  async function buscar( query : IQuery )
  {
    terceros.value                = []
    modo.value                    = "buscando"
    loading.value.carga           = true
    terceros.value                = await buscarTerceros( query )  
    loading.value.carga           = false
    modo.value                    = !!terceros.value.length ? "normal" : "sin-resultados"
  }

  function descargarTerceros()
  {
    let ok = generarCSVDesdeTabla(  "Terceros",  columnas.value, terceros.value )

    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file")
  }

  function limpiarBusqueda()
  {
    modo.value                    = "esperando-busqueda"
    terceros.value                = []
  }

</script>