<template>
  <q-page padding class           ="row item-stretch content-start justify-left">
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
        <!-- //* //////////////////////////////////////////////////////// Busqueda Movil -->
        <div
          v-if                    ="esMobil"
          class                   ="row full-width  justify-between"
          >
          <input-buscar           autofocus clearable hundido
            v-model               ="busqueda"
            label                 ="Buscar.."
            class                 ="col-8"
            @clear                ="limpiarBusqueda"
          />
          <q-btn                  push dense
            class                 ="col-auto"
            color                 ="positive"
            label                 ="Mas"
            icon                  ="mdi-magnify-plus"
            @click                ="filtroMovil =!filtroMovil "
          />
        </div>
        <!-- //* //////////////////////////////////////////////////////// Busqueda Escritorio -->
        <fieldset-filtro
          v-else
          titulo                  ="Buscar"
          class-conenido          ="row q-gutter-sm"
          >
          <input-buscar           autofocus clearable hundido
            v-model               ="busqueda"
            label                 ="Buscar.."
            @clear                ="limpiarBusqueda"
          />
          <responsables           hundido inactivos
            v-if                  ="storeUser.permisos.acceso_total"
            class                 ="col-grow"
            v-model               ="responsable"
            :area                 ="storeUser.usuario.area"
            @clear                ="limpiarBusqueda"
          />          
          <municipios             hundido
            v-model               ="municipio"
            @clear                ="limpiarBusqueda"
          />
          <select-label-value     hundido clearable
            v-model               ="area"
            label                 ="Area"
            class                 ="col-grow"
            icon                  ="mdi-view-grid"
            :options              ="Areas"
            @clear                ="limpiarBusqueda"
          />          
          <favorito
            v-model               ="esFavorito"
            label                 ="Buscar favoritos"
            tooltip               ="Favorito"
          />
          <favorito
            v-model               ="esFamoso"
            label                 ="Buscar famosos"
            tooltip               ="Famoso"
          />          
          <input-buscar           clearable hundido
            v-model               ="filtro"
            label                 ="Filtrar busqueda"
            icon                  ="mdi-filter"
            :disable              ="modo == 'esperando-busqueda'"
          />
          <q-space/>
          <q-btn                  push dense
            v-if                  ="storeUser.permisos.terceros_exportar"
            icon                  ="mdi-microsoft-excel"
            color                 ="primary"
            :disable              ="modo == 'esperando-busqueda'"
            @click                ="descargarTerceros"
            >
            <Tooltip label        ="Descargar"/>
          </q-btn>
          <select-columnas
            v-model               ="columnasVisibles"
            :almacen              ="ALMACEN_LOCAL.COL_TERCEROS"
            :options              ="columnas"
          />          
        </fieldset-filtro>
      </template>
      <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
      <q-table                    borbordered dense flat
        class                     ="fit tabla-maco"
        row-key                   ="id"
        :filter                   ="filtro"
        :rows                     ="terceros"
        :columns                  ="columnas"
        :visible-columns          ="columnasVisibles"
        :rows-per-page-options    ="[25, 50, 100, 200, 500 ]"
        >
        <template #body     ="props">
          <q-tr :props            ="props">
            <q-td key="nombre"    :props="props"> 
              <linkTercero        :tercero="( props.row as Tercero ) "/>
            </q-td>
            <q-td
              v-for               ="item of columnas.filter( c => c.iterable )"
              :key                ="item.name"
              :props              ="props"
              >
              {{props.row[item.name]}}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </ventana>
    <!-- //* //////////////////////////////////////////////////////// Busqueda Movil -->
    <q-dialog
      v-model                     ="filtroMovil"
      position                    ="bottom"
      >
      <fieldset-filtro
        titulo                    ="Buscar"
        class                     ="menu-gris full-width q-pt-sm"
        class-conenido            ="column q-gutter-sm"
        >
        <responsables             hundido inactivos
          v-if                    ="storeUser.permisos.acceso_total"
          v-model                 ="responsable"
          :area                   ="storeUser.usuario.area"
          @clear                  ="limpiarBusqueda"
        />
        <municipios               hundido
          v-model                 ="municipio"
          @clear                  ="limpiarBusqueda"
        />
        <select-label-value       hundido clearable
          v-model                 ="area"
          label                   ="Area"
          icon                    ="mdi-view-grid"
          :options                ="Areas"
          @clear                  ="limpiarBusqueda"
        />        
        <favorito
          v-model                 ="esFavorito"
          label                   ="Buscar favoritos"
          tooltip                 ="Favorito"
        />
        <favorito
          v-model                 ="esFamoso"
          label                   ="Buscar famosos"
          tooltip                 ="Famoso"
        />        
        <input-buscar             clearable hundido
          v-model                 ="filtro"
          label                   ="Filtrar busqueda"
          icon                    ="mdi-filter"
          :disable                ="modo == 'esperando-busqueda'"
        />        
        <select-columnas
          v-model                 ="columnasVisibles"
          label                   ="Columnas"
          :almacen                ="ALMACEN_LOCAL.COL_TERCEROS"
          :options                ="columnas"
        />
        <q-btn                    push dense
          v-if                    ="storeUser.permisos.terceros_exportar"
          icon                    ="mdi-microsoft-excel"
          color                   ="primary"
          label                   ="Descargar"
          :disable                ="modo == 'esperando-busqueda'"
          @click                  ="descargarTerceros"
        />
      </fieldset-filtro>      
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
  import {  ref, watch      } from "vue"
  import {  useStoreUser    } from 'src/stores/user'    
  import {  servicesTerceros,
            IBusquedaTercero} from "src/areas/terceros/services/servicesTerceros"
  import {  ModosVentana,
            Areas,
            ALMACEN_LOCAL    } from "src/models/TiposVarios"
  import {  useTools,
            generarCSVDesdeTabla
                            } from "src/useSimpleOk/useTools"
  import {  Columna         } from "src/models/Tabla"
  import {  useTitle        } from "@vueuse/core"
  import    linkTercero       from "src/areas/terceros/components/LinkTercero.vue"
  import    ventana           from "components/utilidades/Ventana.vue"
  import    inputBuscar       from "src/components/utilidades/input/InputSimple.vue"
  import    fieldsetFiltro    from "components/utilidades/Fieldset.vue"
  import {  ITercero,
            Tercero         } from "src/areas/terceros/models/Tercero"
  import    responsables      from "src/areas/usuarios/components/SelectUsuarios.vue"
  import    selectLabelValue  from "components/utilidades/select/SelectLabelValue.vue"
  import {  IUsuario        } from "src/areas/usuarios/models/Usuario"
  import    favorito          from "src/components/utilidades/StarFavorito.vue"
  import    municipios        from "components/utilidades/select/SelectMunicipios.vue"
  import    selectColumnas    from "components/utilidades/select/SelectColumnas.vue"
  import {  IMunicipio,
            Municipio
                            } from "src/models/Municipio"

  const storeUser                 = useStoreUser()
  const { buscarTerceros        } = servicesTerceros()
  const { esMobil, aviso        } = useTools()
  const modo                      = ref< ModosVentana >("esperando-busqueda")
  const terceros                  = ref< ITercero[] >([])
  const filtroMovil               = ref< boolean  >(false)
  const filtro                    = ref< string   >("")
  const busqueda                  = ref< string   >("")
  const responsable               = ref< IUsuario[] >( [] )
  const esFavorito                = ref< boolean  >(false)
  const esFamoso                  = ref< boolean  >(false)
  const area                      = ref< any >({ label: "",  value: "" })
  const municipio                 = ref< IMunicipio >( new Municipio() )
  const title                     = useTitle("🔍 Buscar tercero")
  
  const columnas                  = [
    new Columna({name: "nombre",            iterable: false       }),
    new Columna({name: "responsablesLista", label: "Responsables" }),
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

  const columnasVisibles          = ref< string []>( columnas.filter(c => c.visible ).map( c => c.name ) )  

  async function buscar()  
  {
    let query :IBusquedaTercero   = {}

    if(busqueda.value.length      > 2     ) query.like        = busqueda.value
    if(!!esFavorito.value                 ) query.favorito    = 1
    if(!!esFamoso.value                   ) query.esFamoso    = 1
    if(!!responsable.value.length         ) query.idUsuarios  = responsable.value.map( r => r.id ).join(",")
    if(!!municipio.value.id               ) query.municipio   = municipio.value.municipio
    if(!!area.value && !!area.value.value ) query.area        = area.value.value

    if(Object.keys(query).length  == 0  ){
      limpiarBusqueda()
      return
    }

    query.limite                  = 1000    
    modo.value                    = "buscando"

    if( !storeUser.permisos.acceso_total )
        query.idUsuarios          = storeUser.usuario.id
    terceros.value                = await buscarTerceros( query )
    
    modo.value                    = !!terceros.value.length ? "normal" : "sin-resultados"
    query                         = {}
  }



  function descargarTerceros( )
  {
    let ok = generarCSVDesdeTabla( "Terceros",  columnasVisibles.value, terceros.value )

    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file")
  }

  watch( [ responsable, municipio, esFavorito, esFamoso, area ], buscar )
  
  watch( busqueda,    ( newValor, oldValor ) => {
    if(newValor.length < 2 )  return
    buscar()
  })

  function limpiarBusqueda()
  {
    modo.value                            = "esperando-busqueda"
    terceros.value                        = []
    if(!!busqueda.value                   ) busqueda.value          = ""
    if(!!esFavorito.value                 ) esFavorito.value        = false
    if(!!esFamoso.value                   ) esFamoso.value          = false
    if(!!responsable.value.length         ) responsable.value       = []
    if(!!municipio.value.id               ) municipio.value         = new Municipio()
    if(!!area.value && !!area.value.value ) area.value              = { label: "",  value: "" }
  }
</script>