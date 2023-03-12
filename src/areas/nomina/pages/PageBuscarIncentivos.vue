<template>
  <q-page padding class         ="row item-stretch content-start justify-start">
    <ventana
      class                     ="col-12"
      class-contenido           ="column items-center"
      height                    ="100%"
      size-icon-carga           ="22em"
      icono                     ="mdi-account-details"
      :modo                     ="modo"
      :titulo                   ="titulo"
      :padding-contenido        ="modo === 'normal' ? '0' : '12px' "
      >
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

    </ventana>
  </q-page>
</template>
<script setup lang="ts">
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
  import {  useStoreNomina      } from "src/stores/nomina"
  
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useTitle            } from "@vueuse/core"
  import {  servicesAcuerdos    } from "src/areas/acuerdos/services/servicesAcuerdos"
  import {  useControlAcuerdo   } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  useTools            } from "src/useSimpleOk/useTools"
  import {  generarCSVDesdeTabla} from "src/useSimpleOk/UtilFiles"
  import {  style               } from "src/useSimpleOk/useEstilos"

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  BusquedaAcuerdo,
            IQueryAcuerdo       } from "src/areas/acuerdos/models/BusquedaAcuerdos"
  import {  Columna, IColumna   } from "src/models/Tabla"
  import {  ModosVentana,
            ALMACEN_LOCAL       } from "src/models/TiposVarios"  
  import {  Acuerdo             } from "src/areas/acuerdos/models/Acuerdo"
  import {  TTipoAcuerdo        } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  import {  IQueryIncentivo,
            IBusquedaIncentivo  } from "src/areas/nomina//models/BusquedaIncentivos"

  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"  
  import    selectColumnas        from "components/utilidades/select/SelectColumnas.vue"
  import    barraBusqueda         from "src/areas/nomina/components/BarraBusquedaIncentivos.vue"

  // * ////////////////////////// Columnas
  import    refAcuerdo            from "src/areas/acuerdos/components/Busqueda/Columnas/RefAcuerdo.vue"
  import    estado                from "src/areas/acuerdos/components/Busqueda/Columnas/Estado.vue"
  import    chipUsuario           from "src/areas/usuarios/components/ChipUsuario.vue"

    
  useTitle("🧮 Comisiones")

  const { usuario, permisos     } = storeToRefs( useStoreUser() )  
  const { acuerdo               } = storeToRefs( useStoreAcuerdo() )  
  const { busqueda, 
          incentivos,
                                } = storeToRefs( useStoreNomina() )
  const { getAcuerdos           } = servicesAcuerdos()
  const { buscarTerceroDolibarr } = useControlAcuerdo()  
  const { esMobil, aviso        } = useTools()
  
  const modo                      = ref< ModosVentana >("esperando-busqueda")  
  const indexSelect               = ref< number >(-1)
  const ventanaVistaRapida        = ref< boolean >(false)  
  //const filtroMovil               = ref< boolean >(false)
  
  const titulo                    = computed(()=>
  {
    let   titulo                  = "Titulo"
/*     const largo                   = acuerdos.value.length

    if(!largo)
      titulo                      = `Buscando ${Acuerdo.getTipoAcuerdoPlural(tipo.value)}...`
    else
    {
      titulo                      = `Resultado: ${largo} `
      if(largo                    === 1)
        titulo                    += Acuerdo.getTipoAcuerdoSingular ( tipo.value )
      else
        titulo                    += Acuerdo.getTipoAcuerdoPlural   ( tipo.value )
    } */

    return titulo
  })
  
  const almacenColumnas           = ALMACEN_LOCAL.COL_INVENTIVOS
  const columnas                  = ref< IColumna[] >([])
  const columnasVisibles          = ref< string[]   >([])

  onMounted(iniciar)

  function iniciar()
  {
    //useTitle(`${Acuerdo.getEmojiAcuerdo(tipo.value)}🔍 Buscar ${Acuerdo.getTipoAcuerdoPlural(tipo.value)}`)
    //acuerdos.value                = []
    //busqueda.value                = new BusquedaAcuerdo( tipo.value )
    modo.value                    = "esperando-busqueda"
    crearColumnas()
  }

  onUnmounted(()=>{
    //acuerdos.value                = []
    //busqueda.value                = new BusquedaAcuerdo( tipo.value )
  })  

  async function buscar( query : IQueryIncentivo )
  {
    console.log("query: ", query);
    incentivos.value              = []
    modo.value                    = "buscando"
    //incentivos.value              = await getAcuerdos( query )
    modo.value                    = !!incentivos.value.length ? "normal" : "sin-resultados"
  }

  function limpiarBusqueda()
  {
    modo.value                    = "esperando-busqueda"
    //acuerdos.value                = []
  }

  function seleccionarAcuerdo( index : number )
  {    
    indexSelect.value             = index
    //acuerdo.value.proGrupos       = []
    //acuerdo.value                 = acuerdos.value[index]
    buscarTerceroDolibarr( acuerdo.value.terceroId )
  }

  function crearColumnas()
  {
    columnas.value = [
      new Columna(            { name: "ref"                                                                   }),
      new Columna(            { name: "estado"                                                                }),
      new Columna(            { name: "pedidoId",             label: "Pedido ID"                              }),
      new Columna(            { name: "tercero"                                                               }),
      new Columna(            { name: "refCliente",           label: "Ref cliente"                            }),
      Columna.ColumnaSiNo   ( { name: "facturado",            label: "Facturado"                              }),
      Columna.ColumnaPrecio ( { name: "subTotalLimpio",       label: "Subtotal comisión", clase: "text-bold"  }),
      Columna.ColumnaPrecio ( { name: "totalConDescu",        label: "Subtotal",          clase: "text-bold"  }),
      Columna.ColumnaPrecio ( { name: "ivaValor",             label: "IVA",               clase: "text-bold"  }),
      Columna.ColumnaPrecio ( { name: "totalConIva",          label: "Total",             clase: "text-bold"  }),
    ]
/* 
    const colsEli = busqueda.value.esCotizacion   ? ["facturado", "pedidoId"]
                  : busqueda.value.esPedido       ? ["pedidoId"]
                  : busqueda.value.esEntrega      ? ["facturado", "condicionPagoLabel", "formaPagoLabel", "origenContactoLabel", "subTotalLimpio", "totalConDescu", "ivaValor", "totalConIva"]
                  : busqueda.value.esOCProveedor  ? ["refCliente", "comercial", "metodoEntregaLabel", "facturado", "origenContactoLabel", "subTotalLimpio", "pedidoId" ]
                  : []
    Columna.eliminarColums( colsEli, columnas.value )

    const colHide = ["refCliente", "contactoSmartDir", "contactoSmartTel", "formaPagoLabel", "area", "municipioTercero", "creador", "fechaCreacionCorta", "fechaValidacionCorta", "subTotalLimpio", "ivaValor", "totalConIva"]
    const colsOcu = busqueda.value.esCotizacion   ? [...colHide, "metodoEntregaLabel",]
                  : busqueda.value.esPedido       ? [...colHide]
                  : busqueda.value.esEntrega      ? [...colHide]
                  : busqueda.value.esOCProveedor  ? [...colHide]
                  : [...colHide]
    Columna.ocultarColums( colsOcu, columnas.value ) */
    
    columnasVisibles.value  = columnas.value.filter(c => c.visible ).map( c => c.name )
  } 

  function descargarAcuerdos()
  {
/* 
    let ok = generarCSVDesdeTabla(  busqueda.value.acuerdo,  columnas.value, acuerdos.value )

    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file")
     */
  }  
</script>
<style>
.alto-tabla{
  min-height: 360px;
}
</style>