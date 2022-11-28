<template>
  <ventana
    class                     ="col-12"
    class-contenido           ="column items-center"
    height                    ="100%"
    size-icon-carga           ="22em"
    :modo                     ="modo"
    :icono                    ="Acuerdo.getIconoAcuerdo(tipo)"
    :titulo                   ="titulo"
    :padding-contenido        ="modo === 'normal' ? '0' : '12px' "
    :mensaje-sin-resultados   ="`No se encontraron ${Acuerdo.getTipoAcuerdoPlural( tipo)}`"
    >
    <template                 #barra>
      <tabs-busqueda/>
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
          :almacen            ="almacenColumnas"
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
          <ref-acuerdo          vista-full
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
      <!-- //* ///////////////  Columna Comercial  -->
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
      :persistent               ="false"
      transition-show           ="slide-up"
      transition-hide           ="slide-down"
      >
      <ventana                  cerrar scroll full-screen
        :titulo                 ="`Vista rapida ${Acuerdo.getTipoAcuerdoSingular(tipo)}`"
        icono                   ="mdi-eye"
        backgroundColor         ="rgb(255 255 255 / 70%)"
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
            watch,
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
  import {  Acuerdo             } from "src/areas/acuerdos/models/Acuerdo"
  import {  TTipoAcuerdo        } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"  
  import    selectColumnas        from "components/utilidades/select/SelectColumnas.vue"
  import    linkTercero           from "src/areas/terceros/components/LinkTercero.vue"
  import    tooltipContacto       from "src/areas/terceros/components/contactos/TooltipContacto.vue"
  import    tabsBusqueda          from "src/areas/acuerdos/components/Busqueda/TabsBusquedaAcuerdos.vue"
  import    barraBusqueda         from "src/areas/acuerdos/components/Busqueda/BarraBusquedaAcuerdos.vue"
  import    vistaAcuerdo          from "src/areas/acuerdos/components/Views/VistaAcuerdoVer.vue"  
  // * ////////////////////////// Columnas
  import    refAcuerdo            from "src/areas/acuerdos/components/Busqueda/Columnas/RefAcuerdo.vue"
  import    estado                from "src/areas/acuerdos/components/Busqueda/Columnas/Estado.vue"
  import    chipUsuario           from "src/areas/usuarios/components/ChipUsuario.vue"
  
  const props                     = defineProps({
    tipo:   { required: true, type: String as PropType< TTipoAcuerdo >  },
  })
  const { tipo }                  = toRefs(props)
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
    let   titulo                  = ""
    const largo                   = acuerdos.value.length

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
            : ""
  })
  const columnas                  = ref< IColumna[] >([])
  const columnasVisibles          = ref< string[]   >([])
  const puedeAnterior             = computed(()=> indexSelect.value > 0 )
  const puedeSiguiente            = computed(()=> indexSelect.value < acuerdos.value.length - 1)

  watch(tipo, iniciar)

  onMounted(iniciar)

  function iniciar()
  {
    useTitle(`${Acuerdo.getEmojiAcuerdo(tipo.value)}🔍 Buscar ${Acuerdo.getTipoAcuerdoPlural(tipo.value)}`)
    acuerdos.value                = []
    busqueda.value                = new BusquedaAcuerdo( tipo.value )
    modo.value                    = "esperando-busqueda"
    crearColumnas()
  }

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
      new Columna({ name: "estado"                                                }),
      new Columna({ name: "tercero"                                               }),
      new Columna({ name: "municipioTercero",         label: "Municipio tercero"  }),      
      new Columna({ name: "fechaCreacionCorta",       label: "Creado"             }),
      new Columna({ name: "fechaValidacionCorta",     label: "Validado"           }),
      new Columna({ name: "creador"                                               }),
      Columna.ColumnaPrecio ({ name: "totalConDescu", label: "Subtotal",          clase: "text-bold"  }),      
      Columna.ColumnaPrecio ({ name: "ivaValor",      label: "IVA",               clase: "text-bold"  }),
      Columna.ColumnaPrecio ({ name: "totalConIva",   label: "Total",             clase: "text-bold"  }),
    ]
    if(!busqueda.value.esOCProveedor){
      columnas.value.splice(1, 0,  new Columna({ name: "refCliente",          label: "Ref cliente"    }) )
      columnas.value.splice(4, 0,  new Columna({ name: "comercial",           label: "Asesor"         }) )
      columnas.value.splice(5, 0,  new Columna({ name: "contacto"                                     }) )
      columnas.value.splice(7, 0,  new Columna({ name: "condicionPagoLabel",  label: "Condiciones"    }) )
      columnas.value.splice(8, 0,  new Columna({ name: "formaPagoLabel",      label: "Forma de pago"  }) )
      columnas.value.splice(9, 0,  new Columna({ name: "metodoEntregaLabel",  label: "Entrega"        }) )
      columnas.value.splice(10, 0, new Columna({ name: "origenContactoLabel", label: "Origen"         }) )
      columnas.value.splice(14, 0, Columna.ColumnaPrecio ({ name: "subTotalLimpio",label: "Subtotal comisión", clase: "text-bold"  }) )
      columnas.value.splice(11, 0, new Columna({ name: "area",                label: "Área"           }) )     
    }

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