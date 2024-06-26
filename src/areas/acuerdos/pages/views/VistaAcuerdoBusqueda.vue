<template>
  <ventana
    v-bind                      ="$attrs"
    class                       ="col-12"
    class-contenido             ="column items-center"
    class-titulo                ="col-auto"
    height                      ="100%"
    size-icon-carga             ="22em"
    :modo                       ="modo"
    :icono                      ="Acuerdo.getIconoAcuerdo(tipo)"
    :titulo                     ="titulo"
    :padding-contenido          ="modo === 'normal' ? '0' : '12px' "
    :mensaje-sin-resultados     ="`No se encontraron ${Acuerdo.getTipoAcuerdoPlural( tipo)}`"
    :mensaje-esperando          ="`Indica que tipo de ${Acuerdo.getTipoAcuerdoPlural( tipo)} quieres buscar`"
    >
    <template                   #barra-centro>      
      <tabs-busqueda/>      
    </template>
    <template                   #barra>
      <div
        class                   ="text-bold text-1_1em text-center radius-6 q-px-md"
        style                   ="min-width: 220px;"
        :style                  ="'background-color:' + busqueda.color + ';'"
        >
        <span v-if="!!busqueda.label">{{busqueda.label}} ({{acuerdos.length}})</span>
      </div>
    </template>    
    <template                   #menu>
      <barra-busqueda
        @buscar                 ="buscar"
        @limpiar                ="limpiarBusqueda"
        @exportar               ="descargarAcuerdos"
        >
        <select-columnas
          v-model               ="columnasVisibles"
          ref                   ="comColumnas"
          label                 ="Columnas"
          :almacen              ="almacenColumnas"
          :options              ="columnas"
        />
      </barra-busqueda>
    </template>
    <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
    <q-table                    bordered dense flat
      v-model:selected          ="seleccion"
      class                     ="fit tabla-maco tabla-alto-min"
      row-key                   ="id"
      :selection                ="tipo === TIPO_ACUERDO.ENTREGA_CLI ? 'multiple' : 'none'"
      :rows                     ="acuerdos"
      :columns                  ="columnas"
      :visible-columns          ="columnasVisibles"
      :rows-per-page-options    ="[100]"
      >
      <!-- //* ///////////////  Columna Ref  -->
      <template #body-cell-ref  ="props">
        <q-td   :props          ="props">
          <ref-acuerdo          vista-rapida
            :acuerdo            ="props.row"
            @vista-rapida       ="vistaRapida(props.rowIndex)"
          />
        </q-td>
      </template>
      <!-- //* ///////////////  Columna Pedido  -->
      <template #body-cell-pedidoId="props">
        <q-td   :props          ="props">
          <router-link :to      ="'/pedidos/cliente/' + props.value">      
            {{ props.row.refPedido }}
          </router-link>
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
        #body-cell-contactoSmart="props">
        <q-td   :props          ="props">
          <span
            class               ="ellipsis"
            v-html              ="props.value.empresaYnombre"
          ></span>
          <tooltip-contacto :contacto="props.value" />
        </q-td>
      </template>
      <!-- //* ///////////////  Columna Estado  -->
      <template #body-cell-estado="props">
        <q-td   :props          ="props">
          <estado :acuerdo      ="props.row"/>
        </q-td>
      </template> 
      <!-- //* ///////////////  Columna Creador  -->
      <template
        #body-cell-creador      ="props">
        <q-td   :props          ="props">
          <chip-usuario         :usuario="props.value"/>
        </q-td>
      </template>
    </q-table>
    <!-- //* ///////////////////////////////////////////////////////////// Modal vista rapida -->
    <q-dialog                   maximized
      v-model                   ="ventanaVistaRapida"
      v-bind                    ="style.dialogo"
      :persistent               ="false"
      >
      <ventana                  cerrar scroll full-screen
        :titulo                 ="`Vista rapida ${Acuerdo.getTipoAcuerdoSingular(tipo)}`"
        icono                   ="mdi-eye"
        backgroundColor         ="rgb(255 255 255 / 70%)"
        class-contenido         ="row items-start content-start justify-start q-col-gutter-md q-mt-none"
        >
        <vista-acuerdo
          :tipo
          :id                   ="acuerdo.id.toString()"
        />
        <template               #barra>
          <q-btn
            v-bind              ="style.btnRedondoFlatMd"
            icon                ="mdi-open-in-new"
            :to                 ="acuerdo.urlDoki"
            >
            <Tooltip :label     ="'Ir a ' + acuerdo.tipo"/>            
          </q-btn>
          <q-btn                dense flat   
            icon                ="mdi-chevron-left"
            class               ="op100-hover"
            :class              ="puedeAnterior ? 'op60' : 'white-a20'"
            padding             ="none"
            size                ="1.5em"
            :disable            ="!puedeAnterior"
            @click              ="anteriorAcuerdo"
            >
            <Tooltip
              v-if              ="puedeAnterior"
              label             ="Anterior"
            />
          </q-btn>
          <q-btn                dense flat
            icon                ="mdi-chevron-right"
            class               ="op100-hover"
            :class              ="puedeSiguiente ? 'op60' : 'white-a20'"
            padding             ="none"
            size                ="1.5em"
            :disable            ="!puedeSiguiente"
            @click              ="siguienteAcuerdo"
            >
            <Tooltip
              v-if              ="puedeSiguiente"
              label             ="Siguiente"
            />
          </q-btn>
        </template>
      </ventana>
    </q-dialog>
  </ventana>
  <botones-seleccion
    @click-rotulos              ="modales.rotulos = true"
  />
  <!-- //* ///////////////////////////////////////////////////////////// Modal Rotulo -->
  <q-dialog                     maximized
    v-model                     ="modales.rotulos"
    v-bind                      ="style.dialogo"
    >
    <rotulos
      :acuerdos                 ="seleccion"
    />
  </q-dialog>  
</template>
  
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            toRefs,
            watch,
            PropType,
            computed,
            onMounted,
            onUnmounted         } from "vue"
  import {  useRouter           } from "vue-router"

  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreApp         } from 'stores/app'
  import {  useStoreUser        } from 'stores/user'
  import {  useStoreAcuerdo     } from 'stores/acuerdo'

  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useTitle            } from "@vueuse/core"
  import {  servicesAcuerdos    } from "src/areas/acuerdos/controllers/servicesAcuerdos"
  import {  useControlAcuerdo   } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  useTools            } from "src/composables/useTools"
  import {  generarCSVDesdeTabla} from "src/composables/UtilFiles"
  import {  style               } from "src/composables/useEstilos"            

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  IQuery              } from "src/models/Busqueda"
  import {  Columna, IColumna   } from "src/models/Tabla"
  import {  TModosVentana,
            ALMACEN_LOCAL       } from "src/models/TiposVarios"  
  import {  Acuerdo             } from "src/areas/acuerdos/models/Acuerdo"
  import {  TTipoAcuerdo,
            TIPO_ACUERDO        } from "src/areas/acuerdos/models/ConstantesAcuerdos"

  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"  
  import    selectColumnas        from "components/utilidades/select/SelectColumnas.vue"
  import    linkTercero           from "src/areas/terceros/components/LinkTercero.vue"
  import    tooltipContacto       from "src/areas/terceros/components/contactos/TooltipContacto.vue"
  import    tabsBusqueda          from "./Busqueda/TabsBusquedaAcuerdos.vue"
  import    barraBusqueda         from "./Busqueda/BarraBusquedaAcuerdos.vue"
  import    vistaAcuerdo          from "./VistaAcuerdoVer.vue"
  import    botonesSeleccion      from "./../../components/Modulos/BotonesSeleccion.vue"
  import    rotulos               from "src/areas/acuerdos/components/PDF/RotulosPDF.vue"

  // * ////////////////////////// Columnas
  import    refAcuerdo            from "src/areas/acuerdos/components/Tools/RefAcuerdo.vue"
  import    estado                from "src/areas/acuerdos/components/Tools/Estado.vue"
  import    chipUsuario           from "src/areas/usuarios/components/ChipUsuario.vue"
  
  const props                     = defineProps({
    tipo:   { required: true, type: String as PropType< TTipoAcuerdo >  },
  })
  const { tipo }                  = toRefs(props)
  const { usuario, permisos     } = storeToRefs( useStoreUser() )  
  const { tabs                  } = storeToRefs( useStoreApp() )
  const { acuerdo,
          acuerdos,
          seleccion,
          modales,
          busqueda,
          loading               } = storeToRefs( useStoreAcuerdo() )  
  const { getAcuerdos           } = servicesAcuerdos()
  const { buscarTerceroDolibarr,
          buscarAcuerdoEnlazados,
          buscarProyecto        } = useControlAcuerdo()  
  const { esMobil, aviso        } = useTools()
  const router                    = useRouter()
  const comColumnas               = ref< InstanceType<typeof selectColumnas> | null>(null)
  const modo                      = ref< TModosVentana >("esperando-busqueda")  
  const indexSelect               = ref< number >(-1)
  const ventanaVistaRapida        = ref< boolean >(false)  
  //const filtroMovil               = ref< boolean >(false)
  const titulo                    = computed(()=>
  {
    let   titulo                  = ""
    const largo                   = acuerdos.value.length

    if(modo.value                 === "esperando-busqueda")
      titulo                      = `Buscador de ${Acuerdo.getTipoAcuerdoPlural(tipo.value)}`
    else
    if(!largo)
      titulo                      = `Buscando ${Acuerdo.getTipoAcuerdoPlural(tipo.value)}...`
    else
    {
      titulo                      = `Resultado: ${largo} `
      if(largo                    === 1)
        titulo                    += Acuerdo.getTipoAcuerdoSingular ( tipo.value )
      else
        titulo                    += Acuerdo.getTipoAcuerdoPlural   ( tipo.value )
    }

    return titulo
  })
  const almacenColumnas           = computed(()=>{
    return    busqueda.value.esCotizacion   ? ALMACEN_LOCAL.COL_COTIZACIONES
            : busqueda.value.esPedido       ? ALMACEN_LOCAL.COL_PEDIDOS
            : busqueda.value.esOCProveedor  ? ALMACEN_LOCAL.COL_OC_PROVEE
            : busqueda.value.esEntrega      ? ALMACEN_LOCAL.COL_ENTREGAS
            : ""
  })
  const columnas                  = ref< IColumna[] >([])
  const columnasVisibles          = ref< string[]   >([])
  const puedeAnterior             = computed(()=> indexSelect.value > 0 )
  const puedeSiguiente            = computed(()=> indexSelect.value < acuerdos.value.length - 1)

  watch(tipo, iniciar)
  onMounted(iniciar)

  async function iniciar()
  {
    useTitle(`${Acuerdo.getEmojiAcuerdo(tipo.value)}🔍 Buscar ${Acuerdo.getTipoAcuerdoPlural(tipo.value)}`)
    acuerdos.value                = []
    modo.value                    = "esperando-busqueda"
    tabs.value.activa             ="tab_1"
    await busqueda.value.montarBusqueda( usuario.value.id, router, usuario.value.esComercial, permisos.value.acceso_total, 10, tipo.value )
    crearColumnas()
  }

  onUnmounted(()=>{
    acuerdos.value                = []
    busqueda.value.desmontarBusqueda()
  })  

  async function buscar( query : IQuery )
  {
    acuerdos.value                = []
    modo.value                    = "buscando"
    loading.value.carga           = true
    acuerdos.value                = await getAcuerdos( query )  
    loading.value.carga           = false
    modo.value                    = !!acuerdos.value.length ? "normal" : "sin-resultados"
  }

  function limpiarBusqueda()
  {
    modo.value                    = "esperando-busqueda"
    acuerdos.value                = []
    seleccion.value               = []
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

  async function seleccionarAcuerdo( index : number )
  {    
    indexSelect.value             = index
    //acuerdo.value.proGrupos       = []
    acuerdo.value                 = acuerdos.value[index]
    await buscarTerceroDolibarr ( acuerdo.value.terceroId )
    await buscarProyecto        ( acuerdo.value.proyectoId  )
    await buscarAcuerdoEnlazados()
  }

  function crearColumnas()
  {
    columnas.value = [
      new Columna(            { name: "ref"                                                                   }),
      new Columna(            { name: "estado"                                                                }),
      new Columna(            { name: "pedidoId",             label: "Pedido"                                 }),
      new Columna(            { name: "tercero"                                                               }),
      new Columna(            { name: "refCliente",           label: "Ref cliente"                            }),
      new Columna(            { name: "comercial",            label: "Asesor"                                 }),
      new Columna(            { name: "contactoSmart",        label: "Contacto"                               }),
      new Columna(            { name: "contactoSmartMun",     label: "Municipio contacto"                     }),
      new Columna(            { name: "contactoSmartDir",     label: "Dirección contacto"                     }),
      new Columna(            { name: "contactoSmartTel",     label: "Teléfono contacto"                      }),
      new Columna(            { name: "fechaEntregaCorta",    label: "Fecha compromiso"                       }),
      new Columna(            { name: "estadoAnimoEmoji",     label: "Animo",           clase:"text-1_4em"    }),
      new Columna(            { name: "diasEntregarFormato",  label: "Días compromiso"                        }),
      new Columna(            { name: "diasADespacharFormato",label: "Días a despachar"                       }),      
      new Columna(            { name: "diasAprobadoFormato",  label: "Días aprobado"                          }),
      new Columna(            { name: "diasEnviadoFormato",   label: "Días enviado"                           }),
      new Columna(            { name: "fechaEnvioOCCorta",    label: "Fecha envió OC"                         }),
      new Columna(            { name: "fechaListoCorta",      label: "Fecha listo"                            }),
      new Columna(            { name: "fechaADespacharCorta", label: "Fecha a despachar"                      }), 
      new Columna(            { name: "metodoEntregaLabel",   label: "Entrega"                                }), 
      new Columna(            { name: "condicionPagoLabel",   label: "Condiciones"                            }), 
      new Columna(            { name: "formaPagoLabel",       label: "Forma de pago"                          }), 
      Columna.ColumnaSiNo   ( { name: "facturado",            label: "Facturado"                              }),
      Columna.ColumnaSiNo   ( { name: "aceptadaProveedor",    label: "En progreso"                            }),
      new Columna(            { name: "area",                 label: "Área"                                   }),
      new Columna(            { name: "municipioTercero",     label: "Municipio tercero"                      }),
      new Columna(            { name: "origenContactoLabel",  label: "Origen"                                 }), 
      new Columna(            { name: "creador"                                                               }),
      new Columna(            { name: "fechaCreacionCorta",   label: "Creado"                                 }),
      new Columna(            { name: "fechaValidacionCorta", label: "Validado"                               }),            
      Columna.ColumnaPrecio ( { name: "subTotalLimpio",       label: "Subtotal comisión", clase: "text-bold"  }),
      Columna.ColumnaPrecio ( { name: "totalConDescu",        label: "Subtotal",          clase: "text-bold"  }),
      Columna.ColumnaPrecio ( { name: "ivaValor",             label: "IVA",               clase: "text-bold"  }),
      Columna.ColumnaPrecio ( { name: "totalConIva",          label: "Total",             clase: "text-bold"  }),
    ]

    const colsEli = busqueda.value.esCotizacion   ? ["aceptadaProveedor", "fechaEnvioOCCorta", "diasEnviadoFormato", "diasAprobadoFormato", "diasEntregarFormato", "diasADespacharFormato", "estadoAnimoEmoji", "facturado", "pedidoId", "refPedido", "fechaListoCorta", "fechaADespacharCorta", "fechaEntregaCorta"]
                  : busqueda.value.esPedido       ? ["aceptadaProveedor", "fechaEnvioOCCorta", "diasEnviadoFormato", "diasAprobadoFormato", "pedidoId", "refPedido"]
                  : busqueda.value.esEntrega      ? ["aceptadaProveedor", "fechaEnvioOCCorta", "diasEnviadoFormato", "diasAprobadoFormato", "facturado", "condicionPagoLabel", "formaPagoLabel", "origenContactoLabel", "subTotalLimpio", "totalConDescu", "ivaValor", "totalConIva", "fechaListoCorta"]
                  : busqueda.value.esOCProveedor  ? ["refCliente", "comercial", "metodoEntregaLabel", "facturado", "origenContactoLabel", "subTotalLimpio", "pedidoId", "refPedido", "fechaListoCorta"]
                  : []

    if(usuario.value.esProduccion && busqueda.value.esCotizacion)
      colsEli.push("contactoSmartTel", "contactoSmart", "subTotalLimpio", "totalConDescu", "ivaValor", "totalConIva")
    Columna.eliminarColums( colsEli, columnas.value )

    const colHide = ["refCliente", "contactoSmartDir", "contactoSmartTel", "formaPagoLabel", "area", "municipioTercero", "creador", "fechaCreacionCorta", "fechaValidacionCorta", "subTotalLimpio", "ivaValor", "totalConIva"]
    const colsOcu = busqueda.value.esCotizacion   ? [...colHide, "metodoEntregaLabel",]
                  : busqueda.value.esPedido       ? [...colHide]
                  : busqueda.value.esEntrega      ? [...colHide]
                  : busqueda.value.esOCProveedor  ? [...colHide]
                  : [...colHide]
    Columna.ocultarColums( colsOcu, columnas.value )
    
    columnasVisibles.value  = columnas.value.filter(c => c.visible ).map( c => c.name )
    comColumnas.value?.cargarColumnasLocal()
  }

  function descargarAcuerdos()
  {
    let ok = generarCSVDesdeTabla(  busqueda.value.acuerdo,  columnas.value, acuerdos.value )

    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file")
  } 
</script>