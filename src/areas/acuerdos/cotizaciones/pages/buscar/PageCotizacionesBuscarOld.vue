<template>
  <q-page padding class         ="row item-stretch content-start justify-left">
    <ventana
      class                     ="col-12"
      class-contenido           ="column items-center"
      icono                     ="mdi-table-search"
      height                    ="100%"
      size-icon-carga           ="22em"
      mensaje-sin-resultados    ="No se encontraron cotizaciones" 
      :titulo                   ="titulo"
      :padding-contenido        ="modo === 'normal' ? '0' : '12px' "
      :modo                     ="modo"
      >
      <template                 #menu>
        <barra-busqueda
          :total-resultados     ="cotizaciones.length"
          @buscar               ="buscar"
          @limpiar              ="limpiarBusqueda"
          >
          <select-columnas
            v-model             ="columnasVisibles"
            label               ="Columnas"
            :almacen            ="ALMACEN_LOCAL.COL_TERCEROS"
            :options            ="columnas"
          />
        </barra-busqueda>


      </template>
      <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
      <q-table                    borbordered dense flat
        class                     ="fit tabla-maco"
        row-key                   ="id"
        :filter                   ="filtro"
        :rows                     ="cotizaciones"
        :columns                  ="columnas"
        :visible-columns          ="columnasVisibles"
        :rows-per-page-options    ="[100]"
        >
        <!-- //* ///////////////  Columna Ref  -->
        <template #body-cell-ref  ="props">
          <q-td   :props          ="props">
            <q-icon name          ="mdi-package-variant-closed" size="xs" class="op60 op100-hover">
              <tooltip-lineas     :lineas="props.row.productos"/>
            </q-icon>
            <router-link :to      ="'/cotizaciones2/' + props.row.id">
              {{ props.row.refCorta }}
              <tooltip-cotizacion :cotizacion="props.row"/>
            </router-link>
          </q-td>
        </template>
        <!-- //* ///////////////  Columna Tercero  -->
        <template
          #body-cell-tercero      ="props">
          <q-td   :props          ="props">
            <link-tercero         :tercero="( props.value as Tercero ) "/>
          </q-td>
        </template>
        <!-- //* ///////////////  Columna contacto  -->
        <template
          #body-cell-contacto     ="props">
          <q-td   :props          ="props">
            <span class="ellipsis" v-html="props.value.empresaYnombre"></span>
            <tooltip-contacto :contacto="( props.value as Contacto )" />
          </q-td>
        </template>
        <!-- //* ///////////////  Columna Estado  -->
        <template #body-cell-estado="props">
          <q-td   :props          ="props">
            <span
              class               ="q-px-xs text-white"
              style               ="border-radius: 6px;"
              :style              ="'background-color: ' + props.row.estadoColor"
              >
              {{ props.row.estadoLabel }}
            </span>
          </q-td>
        </template> 
      </q-table>
    </ventana>
  </q-page>
</template>

<script setup lang="ts">
  import {  ref,
            computed            } from "vue"
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreUser        } from 'src/stores/user'  
  import {  servicesCotizaciones,
            IBusquedaCotizacion } from "src/areas/acuerdos/cotizaciones/services/servicesCotizaciones"
  import {  ModosVentana,
            ALMACEN_LOCAL       } from "src/models/TiposVarios"
  import {  useTools,
            //generarCSVDesdeTabla
                                } from "src/useSimpleOk/useTools"
  import {  Columna             } from "src/models/Tabla"
  import {  useTitle            } from "@vueuse/core"
  import    linkTercero           from "src/areas/terceros/components/LinkTercero.vue"
  import    ventana               from "components/utilidades/Ventana.vue"  
  import {  Tercero             } from "src/areas/terceros/models/Tercero"
  import {  Contacto            } from "src/areas/terceros/models/Contacto"    
  import {  IAcuerdo            } from "src/areas/acuerdos/models/Acuerdo"
  import    selectColumnas        from "components/utilidades/select/SelectColumnas.vue"
  import    tooltipCotizacion     from "src/areas/acuerdos/cotizaciones/components/tools/TooltipCotizacion.vue"
  import    tooltipLineas         from "src/areas/acuerdos/components/Tooltips/TooltipLineas.vue"
  import    tooltipContacto       from "src/areas/terceros/components/contactos/TooltipContacto.vue"
  import    barraBusqueda         from "./BarraBusqueda.vue"
  
  const title                     = useTitle("🔍 Buscar cotizaciones")
  const { usuario, permisos }     = storeToRefs( useStoreUser() )  
  const { getCotizaciones       } = servicesCotizaciones()
  const { esMobil, aviso        } = useTools()
  const modo                      = ref< ModosVentana >("esperando-busqueda")  
  const cotizaciones              = ref< IAcuerdo[] >([])
  //const filtroMovil               = ref< boolean >(false)
  const filtro                    = ref< string   >("")
  const titulo                    = computed(()=>
  {
    return cotizaciones.value.length > 0 ? cotizaciones.value.length + 
                                      ( cotizaciones.value.length === 1
                                        ? ' cotización encontrada '
                                        : ' cotizaciones encontradas '
                                      )
                                    : 'Buscando cotizaciones...'
  })
  
  
  const columnas                  = [
    new Columna({ name: "ref"       }),
    new Columna({ name: "estado"    }),
    new Columna({ name: "tercero"   }),
    new Columna({ name: "contacto"  }),
    new Columna({ name: "fechaCreacionCorta", label: "Fecha"    }),
    Columna.ColumnaPrecio ({ name: "totalConDescu", label: "Subtotal",    clase: "text-bold"    }),
/* 
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
     */
  ]

  const columnasVisibles          = ref< string []>( columnas.filter(c => c.visible ).map( c => c.name ) )  
  
  async function buscar( query : IBusquedaCotizacion)
  {
    cotizaciones.value            = []            
    modo.value                    = "buscando"

    cotizaciones.value            = await getCotizaciones( query )    

    modo.value                    = !!cotizaciones.value.length ? "normal" : "sin-resultados"
    query                         = {}
  }

  function limpiarBusqueda()
  {
    modo.value                    = "esperando-busqueda"
    cotizaciones.value            = []
  }
</script>