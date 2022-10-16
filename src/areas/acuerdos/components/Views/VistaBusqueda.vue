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
          :almacen            ="ALMACEN_LOCAL.COL_ACUERDOS"
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
          <ref-acuerdo
            :acuerdo            ="props.row"
            @vista-rapida       ="vistaRapida(props.rowIndex)"
          />
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
    <!-- //* ///////////////////////////////////////////////////////////// Modal vista rapida -->
    <q-dialog                   maximized
      v-model                   ="ventanaVistaRapida"
      :persistent               ="false"
      transition-show           ="slide-up"
      transition-hide           ="slide-down"
      >
      <ventana                  cerrar scroll full-screen
        titulo                  ="Vista rapida"
        class                   ="panel-blur"
        icono                   ="mdi-eye"
        backgroundColor         ="rgb(0 0 0 / 0%)"
        class-contenido         ="row items-start content-start justify-start q-col-gutter-md q-mt-none"
        >
        <vista-acuerdo
          :id                   ="acuerdo.id.toString()"
          :tipo                 ="tipo"
        />        
        <template               #barra>
          <q-btn                dense flat unelevated  
            icon                ="mdi-chevron-left"
            class               ="op40 op100-hover"
            :disable            ="!puedeAnterior"
            @click              ="anteriorAcuerdo"
            >
            <tooltip label      ="Anterior"/>
          </q-btn>
          <q-btn                dense flat unelevated  
            icon                ="mdi-chevron-right"
            class               ="op40 op100-hover"
            :disable            ="!puedeSiguiente"
            @click              ="siguienteAcuerdo"
            >
            <tooltip label      ="Siguiente"/>
          </q-btn>
        </template>
      </ventana>
    </q-dialog>    
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
  import {  useControlAcuerdo   } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  useTools            } from "src/useSimpleOk/useTools"
  import {  generarCSVDesdeTabla} from "src/useSimpleOk/UtilFiles"
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  BusquedaAcuerdo,
            IQueryAcuerdo       } from "src/areas/acuerdos/models/BusquedaAcuerdos"
  import {  Columna, IColumna   } from "src/models/Tabla"
  import {  ModosVentana,
            ALMACEN_LOCAL       } from "src/models/TiposVarios"  
  import {  TTipoAcuerdo,
            getTipoAcuerdoPlural
                                } from "src/areas/acuerdos/models/ConstantesAcuerdos"            
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"  
  import    selectColumnas        from "components/utilidades/select/SelectColumnas.vue"
  import    linkTercero           from "src/areas/terceros/components/LinkTercero.vue"
  import    tooltipContacto       from "src/areas/terceros/components/contactos/TooltipContacto.vue"
  import    tabsBusqueda          from "src/areas/acuerdos/components/Busqueda/TabsBusqueda.vue"
  import    barraBusqueda         from "src/areas/acuerdos/components/Busqueda/BarraBusqueda.vue"
  import    vistaAcuerdo          from "src/areas/acuerdos/components/Views/VistaAcuerdoVer.vue"  
  // * ////////////////////////// Columnas
  import    refAcuerdo            from "src/areas/acuerdos/components/Busqueda/Columnas/RefAcuerdo.vue"
  import    estado                from "src/areas/acuerdos/components/Busqueda/Columnas/Estado.vue"
  import    chipUsuario           from "src/areas/usuarios/components/ChipUsuario.vue"
  
  const props                     = defineProps({
    tipo:   { required: true, type: String as PropType< TTipoAcuerdo >  },
    icono:  { required: true, type: String                              },
  })
  const { tipo }                  = toRefs(props) 
  const title                     = useTitle("🔍 Buscar " + tipo.value)
  const { usuario, permisos     } = storeToRefs( useStoreUser() )  
  const { acuerdo,
          acuerdos,
          busqueda              } = storeToRefs( useStoreAcuerdo() )  
  const { getAcuerdos           } = servicesAcuerdos()
  const { buscarTerceroDolibarr } = useControlAcuerdo()  
  const { esMobil, aviso        } = useTools()
  
  const modo                      = ref< ModosVentana >("esperando-busqueda")  
  const indexSelect               = ref< number >(-1)
  const ventanaVistaRapida        = ref< boolean >(false)  
  //const filtroMovil               = ref< boolean >(false)
  const titulo                    = computed(()=>
  {
    return acuerdos.value.length > 0 ? `Resultado: ${acuerdos.value.length} ` +
                                      ( acuerdos.value.length === 1 ? tipo.value : getTipoAcuerdoPlural(tipo.value) )
                                    : `Buscando ${tipo.value}...`
  })
  const columnas                  = ref< IColumna[] >([])
  const columnasVisibles          = ref< string[]   >([])
  const puedeAnterior             = computed(()=> indexSelect.value > 0 )
  const puedeSiguiente            = computed(()=> indexSelect.value < acuerdos.value.length - 1)

  onMounted(()=>{
    acuerdos.value                = []
    busqueda.value                = new BusquedaAcuerdo( tipo.value )
    crearColumnas()
  })

  onUnmounted(()=>{
    acuerdos.value                = []
    busqueda.value                = new BusquedaAcuerdo( tipo.value )
  })  

  async function buscar( query : IQueryAcuerdo )
  {
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

  function vistaRapida(index : number)
  {
    seleccionarAcuerdo(index)
    ventanaVistaRapida.value      = true    
  }

  function anteriorAcuerdo()
  {
    if(!puedeAnterior.value) return 
    seleccionarAcuerdo( indexSelect.value - 1)
  }

  function siguienteAcuerdo()
  {
    if(!puedeSiguiente.value) return 
    seleccionarAcuerdo( indexSelect.value + 1)
  }

  function seleccionarAcuerdo( index : number )
  {    
    indexSelect.value             = index
    acuerdo.value                 = acuerdos.value[index]
    buscarTerceroDolibarr( acuerdo.value.terceroId )
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
      Columna.ColumnaPrecio ({ name: "subTotalLimpio",label: "Subtotal comisión", clase: "text-bold" }),
      Columna.ColumnaPrecio ({ name: "ivaValor",      label: "IVA",               clase: "text-bold" }),
      Columna.ColumnaPrecio ({ name: "totalConIva",   label: "Total",             clase: "text-bold" }),
    ]
    
    if(busqueda.value.esPedido)
      columnas.value.push( Columna.ColumnaSiNo({ name: "facturado",         label: "Facturado"      }) )    

    columnasVisibles.value  = columnas.value.filter(c => c.visible ).map( c => c.name )       
  } 

  function descargarAcuerdos()
  {
    let ok = generarCSVDesdeTabla(  busqueda.value.acuerdo,  columnas.value, acuerdos.value )

    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file")
  }
</script>