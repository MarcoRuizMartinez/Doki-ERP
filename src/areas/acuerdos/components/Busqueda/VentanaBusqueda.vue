<template>
  <ventana
    class                     ="col-12"
    class-contenido           ="column items-center"
    height                    ="100%"
    size-icon-carga           ="22em"
    :modo                     ="modo"
    :icono                    ="icono"
    :titulo                   ="titulo"
    :padding-contenido        ="modo === 'normal' ? '0' : '12px' "
    :mensaje-sin-resultados   ="'No se encontraron ' + tipo" 
    >
    <template                 #barra>
      <tabs-busqueda />
    </template>
    <template                 #menu>
      <barra-busqueda
        @buscar               ="buscar"
        @limpiar              ="limpiarBusqueda"
        @exportar             ="descargarAcuerdos"
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
      :rows                     ="acuerdos"
      :columns                  ="columnas"
      :visible-columns          ="columnasVisibles"
      :rows-per-page-options    ="[100]"
      >
      <!-- //* ///////////////  Columna Ref  -->
      <template #body-cell-ref  ="props">
        <q-td   :props          ="props">
          <ref-acuerdo :acuerdo ="props.row"/>
        </q-td>
      </template>
      <!-- //* ///////////////  Columna Tercero  -->
      <template
        #body-cell-tercero      ="props">
        <q-td   :props          ="props">
          <link-tercero         :tercero="props.value"/>
        </q-td>
      </template>
      <!-- //* ///////////////  Columna Comercial  -->
      <template
        #body-cell-comercial    ="props">
        <q-td   :props          ="props">
          <chip-usuario         :usuario="props.value"/>
        </q-td>
      </template>
      chipUsuario
      <!-- //* ///////////////  Columna contacto  -->
      <template
        #body-cell-contacto     ="props">
        <q-td   :props          ="props">
          <span class="ellipsis" v-html="props.value.empresaYnombre"></span>
          <tooltip-contacto :contacto="props.value" />
        </q-td>
      </template>
      <!-- //* ///////////////  Columna Estado  -->
      <template #body-cell-estado="props">
        <q-td   :props          ="props">
          <estado :acuerdo      ="props.row"/>
        </q-td>
      </template> 
    </q-table>
  </ventana>
</template>
  
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            toRefs,
            PropType,
            computed,
            onMounted,
            onUnmounted         } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreUser        } from 'src/stores/user'
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useTitle            } from "@vueuse/core"
  import {  servicesAcuerdos    } from "src/areas/acuerdos/services/servicesAcuerdos"
  import {  useTools,
            generarCSVDesdeTabla} from "src/useSimpleOk/useTools"  
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  BusquedaAcuerdo,
            IQueryAcuerdo       } from "src/areas/acuerdos/models/BusquedaAcuerdos"
  import {  Columna, IColumna   } from "src/models/Tabla"
  import {  ModosVentana,
            ALMACEN_LOCAL       } from "src/models/TiposVarios"  
  import {  TTipoAcuerdo,
            getTipoAcuerdoSingular 
                                } from "src/areas/acuerdos/models/ConstantesAcuerdos"            
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"  
  import    selectColumnas        from "components/utilidades/select/SelectColumnas.vue"
  import    linkTercero           from "src/areas/terceros/components/LinkTercero.vue"
  import    tooltipContacto       from "src/areas/terceros/components/contactos/TooltipContacto.vue"
  import    tabsBusqueda          from "./TabsBusqueda.vue"
  import    barraBusqueda         from "./BarraBusqueda.vue"
  // * ////////////////////////// Columnas
  import    refAcuerdo            from "./Columnas/RefAcuerdo.vue"
  import    estado                from "./Columnas/Estado.vue"
  import    chipUsuario           from "src/areas/usuarios/components/ChipUsuario.vue"

  
  const props                     = defineProps({
    tipo:   { required: true, type: String as PropType< TTipoAcuerdo >  },
    icono:  { required: true, type: String                              },
  })
  const { tipo }                  = toRefs(props) 
  const title                     = useTitle("🔍 Buscar " + tipo.value)
  const { usuario, permisos     } = storeToRefs( useStoreUser() )  
  const { acuerdos, busqueda    } = storeToRefs( useStoreAcuerdo() )  
  const { getAcuerdos           } = servicesAcuerdos()
  const { esMobil, aviso        } = useTools()
  
  const modo                      = ref< ModosVentana >("esperando-busqueda")  
  //const filtroMovil               = ref< boolean >(false)
  const titulo                    = computed(()=>
  {
    return acuerdos.value.length > 0 ? `Resultado: ${acuerdos.value.length} ` +
                                      ( acuerdos.value.length === 1 ? getTipoAcuerdoSingular(tipo.value) : tipo.value )
                                    : `Buscando ${tipo.value}...`
  })
  const columnas                  = ref< IColumna[] >([])
  const columnasVisibles          = ref< string[]   >( columnas.value.filter(c => c.visible ).map( c => c.name ) )
  
  onMounted(()=>{
    acuerdos.value                = []
    busqueda.value                = new BusquedaAcuerdo( tipo.value )
    crearColumnas()
  })

  onUnmounted(()=>{
    acuerdos.value                = []
    busqueda.value                = new BusquedaAcuerdo()
  })

  

  async function buscar( query : IQueryAcuerdo )
  {
    console.log("query: ", query);
    acuerdos.value                = []            
    modo.value                    = "buscando"
    acuerdos.value                = await getAcuerdos( query )

    modo.value                    = !!acuerdos.value.length ? "normal" : "sin-resultados"
  }

  function limpiarBusqueda()
  {
    modo.value                    = "esperando-busqueda"
    acuerdos.value                = []
  }

  function crearColumnas(){
    columnas.value                = [
      new Columna({ name: "ref"                                                   }),
      new Columna({ name: "refCliente",               label: "Ref cliente"        }),
      new Columna({ name: "estado"                                                }),
      new Columna({ name: "tercero"                                               }),
      new Columna({ name: "municipioTercero",         label: "Municipio tercero"  }),      
      new Columna({ name: "comercial",                label: "Asesor"             }),
      new Columna({ name: "contacto"                                              }),
      new Columna({ name: "fechaCreacionCorta",       label: "Creado"             }),
      new Columna({ name: "fechaValidacionCorta",     label: "Validado"           }),
      new Columna({ name: "condicionPagoLabel",       label: "Condiciones"        }), 
      new Columna({ name: "formaPagoLabel",           label: "Forma de pago"      }), 
      new Columna({ name: "metodoEntregaLabel",       label: "Entrega"            }), 
      new Columna({ name: "origenContactoLabel",      label: "Origen"             }),
      new Columna({ name: "area",                     label: "Área"               }),
      Columna.ColumnaPrecio ({ name: "totalConDescu", label: "Subtotal",          clase: "text-bold" }),
      Columna.ColumnaPrecio ({ name: "ivaValor",      label: "IVA",               clase: "text-bold" }),
      Columna.ColumnaPrecio ({ name: "totalConIva",   label: "Total",             clase: "text-bold" }),
    ]
    
    if(busqueda.value.esPedido)
      columnas.value.push( Columna.ColumnaSiNo({ name: "facturado",         label: "Facturado"      }) )    
  } 

  function descargarAcuerdos()
  {
    let ok = generarCSVDesdeTabla(  busqueda.value.acuerdo,  columnas.value, acuerdos.value )

    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file")
  }
</script>