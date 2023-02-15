<template>
  <q-tab-panels                 animated keep-alive vertical
    v-model                     ="tabs.activa"
    class                       ="transparent fit"
    >    
    <!-- //* /////////////////////////////////////////////////////// Tab 1 -->
    <q-tab-panel
      name                      ="tab_1"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <fieldset-filtro
        titulo                  ="Búsqueda"
        class-conenido          ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Busqueda general -->        
        <input-buscar           clearable hundido
          v-model               ="busqueda.tercero"
          label                 ="Búsqueda"
          class                 ="width220"
          icon                  ="mdi-account-search"
        />
        <!-- //* ///////////////////////////////////////////////// Busqueda contacto -->
        <input-buscar           clearable hundido
          v-if                  ="!busqueda.esOCProveedor"
          v-model               ="busqueda.contacto"
          label                 ="Contactos"
          icon                  ="mdi-target-account"
          class                 ="width220"
        />
        <!-- //* ///////////////////////////////////////////////// Proveedores -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="busqueda.esOCProveedor"
          v-model               ="busqueda.proveedores"
          label                 ="Proveedores"
          icon                  ="mdi-storefront"
          class                 ="width220"
          :options              ="proveedores"
        />        
      </fieldset-filtro>
      <!-- //* /////////////////////////////////////////////////// Fecha creacion -->
      <fieldset-filtro
        titulo                  ="Creación"
        class-conenido          ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Fecha desde -->
        <input-fecha            hundido no-futuro clearable
          v-model               ="busqueda.desde"
          label                 ="Desde"
          class                 ="width160"
          :hasta                ="busqueda.hasta"
        />
        <!-- //* ///////////////////////////////////////////////// Fecha hasta -->
        <input-fecha            hundido no-futuro clearable
          v-model               ="busqueda.hasta"
          label                 ="Hasta"
          class                 ="width160"
          :desde                ="busqueda.desde"
        />
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Estado"
        class-conenido          ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Estado acuerdo -->
        <multi-label-value
          v-model               ="busqueda.estados"
          label                 ="Estado"
          class                 ="width160"
          icon                  ="mdi-label"
          :options              ="estados"
        />
        <!-- //* ///////////////////////////////////////////////// Condiciones pago -->
        <multi-label-value
          v-if                  ="!busqueda.esOCProveedor"
          v-model               ="busqueda.condiciones"
          label                 ="Condiciones"
          class                 ="width160"
          icon                  ="mdi-account-cash"
          :options              ="condicionesPago.filter( c => c.esFacturable || !busqueda.esCotizacion )"
        />
        <!-- //* ///////////////////////////////////////////////// Comercial Acuerdo -->
        <select-usuario         hundido clearable
          v-if                  ="!busqueda.esOCProveedor"
          v-model               ="busqueda.comercial"
          class                 ="width160"
          label                 ="Asesor"
          :autoselect           ="autoSelectComercial"
          :area                 ="usuario.area"
          :grupos               =[GRUPO_USUARIO.COMERCIALES]
          :readonly             ="!permisos.acceso_total"
        />
        <!-- //* ///////////////////////////////////////////////// Creador -->
        <select-usuario         hundido clearable
          v-model               ="busqueda.creador"
          class                 ="width160"
          label                 ="Creador"
          :autoselect           ="autoSelectCreador"
          :area                 ="usuario.area"
          :grupos               ="busqueda.esOCProveedor ? [GRUPO_USUARIO.PRODUCCION] : []"
          :readonly             ="!permisos.acceso_total"
        />
        <!-- //* ///////////////////////////////////////////////// Pedido facturado -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="busqueda.esPedido"
          v-model               ="busqueda.facturado"
          label                 ="Facturado"
          icon                  ="mdi-file-check"
          class                 ="width160"
          :options              ="opcionesFacturado"
        />        
      </fieldset-filtro>
      <!-- //* /////////////////////////////////////////////////// Paginación -->
      <fieldset-filtro
        titulo                  ="Paginas"
        class-conenido          ="grilla-ribom fit"
        >
        <!-- //* ///////////////////////////////////////////////// Resultados por pagina -->
        <div>
          <q-btn-toggle         spread push unelevated round
            v-model             ="busqueda.resultadosXPage"
            color               ="white"
            text-color          ="grey-8"
            toggle-color        ="primary"
            :options            ="[{label: '25', value: 25},{label: '50', value: 50},{label: '100', value: 100}]"
            @update:model-value ="busqueda.pagina = 1"
          />
          <Tooltip label        ="Resultados por pagina"/>
        </div>
        <!-- //* ///////////////////////////////////////////////// Pagina -->
        <div class              ="row justify-center full-width">
          <q-pagination         dense
            v-model             ="busqueda.pagina"
            :max                ="siguientePagina"
            :max-pages          ="3"
            :ellipses           ="false"
            :boundary-numbers   ="false"
          />
          <Tooltip label        ="Pagina"/>
          <q-spinner-puff
            v-if                ="haySiguientePagina"
            color               ="primary"
            size                ="2em"
            class               ="q-mt-xs"
          />          
        </div>
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Opciones"
        class-conenido          ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Slot Columnas -->
        <slot></slot>
        <!-- //* ///////////////////////////////////////////////// Botones -->
        <div class                ="row justify-around q-mt-sm">
          <!-- //* /////////////////////////////////////////////// Boton recargar -->
          <div>
            <q-btn                round push glossy
              icon                ="mdi-refresh"
              padding             ="xs"
              color               ="primary"
              @click              ="buscar('btnRecargar')"
              >
              <Tooltip label      ="Recargar"/>
            </q-btn>
          </div>
          <!-- //* /////////////////////////////////////////////// Boton limpiar -->
          <div>
            <q-btn                round push glossy
              icon                ="mdi-close"
              padding             ="xs"
              color               ="primary"
              :disable            ="busqueda.busquedaVacia"
              @click              ="limpiarBusqueda"
              >
              <Tooltip label      ="Limpiar búsqueda"/>
            </q-btn>
          </div>
          <!-- //* /////////////////////////////////////////////// Boton exportar -->
          <div>
            <q-btn                round push glossy
              v-if                ="permisos.terceros_exportar"
              icon                ="mdi-microsoft-excel"
              color               ="primary"
              padding             ="xs"
              :disable            ="busqueda.busquedaVacia"
              @click              ="emit('exportar')"
              >
              <Tooltip label      ="Descargar"/>
            </q-btn>
          </div>
        </div>
      </fieldset-filtro>
    </q-tab-panel>
    <!-- //* ///////////////////////////////////////////////////// Tab 2 -->
    <q-tab-panel
      name                      ="tab_2"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <fieldset-filtro
        v-if                    ="!busqueda.esOCProveedor"
        titulo                  ="Opciones"
        class-conenido          ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Forma de pago -->
        <multi-label-value
          v-model               ="busqueda.formaPago"
          label                 ="Pago"
          class                 ="width160"
          icon                  ="mdi-cash-refund"
          :options              ="formasPago"
        />
        <!-- //* ///////////////////////////////////////////////// Métodos de entrega -->
        <multi-label-value
          v-model               ="busqueda.entrega"
          label                 ="Entrega"
          class                 ="width160"
          icon                  ="mdi-truck-delivery"
          :options              ="metodosEntrega"
        />
        <!-- //* ///////////////////////////////////////////////// Origen contacto -->
        <multi-label-value
          v-model               ="busqueda.origenes"
          label                 ="Origen"
          class                 ="width160"
          icon                  ="mdi-source-branch"
          :options              ="origenes"
        />
        <!-- //* ///////////////////////////////////////////////// Con IVA o sin IVA -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="busqueda.esCotizacion"
          v-model               ="busqueda.conIva"
          label                 ="IVA"
          icon                  ="mdi-bank"
          class                 ="width160"
          :options              ="opcionesIVA"
        />
        <!-- //* ///////////////////////////////////////////////// Con total y sin total -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="busqueda.esCotizacion"
          v-model               ="busqueda.totalizado"
          label                 ="Totalizar"
          icon                  ="mdi-counter"
          class                 ="width160"
          :options              ="opcionesTotales"
        />
        <!-- //* ///////////////////////////////////////////////// Área o departamento -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="busqueda.area"
          label                 ="Área"
          icon                  ="mdi-google-circles-extended"
          class                 ="width160"
          :options              ="Areas"
        />
        <!-- //* ///////////////////////////////////////////////// Municipio -->
        <municipios             hundido
          v-model               ="busqueda.municipio"
          class                 ="width160"
          tooltip               ="Municipio tercero"
        />
        <!-- //* ///////////////////////////////////////////////// Tercero interno o externo -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="busqueda.tipoTercero"
          label                 ="Tipo tercero"
          icon                  ="mdi-circle-multiple"
          class                 ="width160"
          :options              ="opcionesTerceroTipo"
        />    
        <!-- //* ///////////////////////////////////////////////// Forma de pago -->
        <!-- //* ///////////////////////////////////////////////// Estado Anticipo -->
        <multi-label-value
          v-if                  ="busqueda.esPedido"
          v-model               ="busqueda.estadoAnticipo"
          label                 ="Estado anticipo"
          icon                  ="mdi-cash-check"
          class                 ="width160"
          :options              ="Anticipo.estados"
        />
        <!-- //* ///////////////////////////////////////////////// Estado Anticipo -->
        <multi-label-value
          v-if                  ="busqueda.esPedido"
          v-model               ="busqueda.tipoAnticipo"
          label                 ="Tipo anticipo"
          icon                  ="mdi-cash"
          class                 ="width160"
          :options              ="Anticipo.tipos"
        />
        <!-- //* ///////////////////////////////////////////////// Con pedidos a proveedor -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="busqueda.esPedido"
          v-model               ="busqueda.conOrdenes"
          label                 ="OC proveedor"
          icon                  ="mdi-factory"
          class                 ="width160"
          :options              ="opcionesOrdenesProv"
        />         
      </fieldset-filtro>
      <fieldset-filtro      
        titulo                  ="Subtotal"
        class-conenido          ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Precio Minimo -->
        <input-number           hundido clearable
          v-model               ="busqueda.precioMinimo"
          label                 ="Mínimo"
          icon                  ="mdi-currency-usd"
          class                 ="width160"
          :minimo               ="0"
          :maximo               ="!!busqueda.precioMaximo ? busqueda.precioMaximo : undefined"
        />
        <!-- //* ///////////////////////////////////////////////// Precio Maximo -->
        <input-number           hundido clearable
          v-model               ="busqueda.precioMaximo"
          label                 ="Máximo"
          icon                  ="mdi-currency-usd"
          class                 ="width160"
          :minimo               ="!!busqueda.precioMinimo ? busqueda.precioMinimo : undefined"
          :maximo               ="999_999_999"
        />
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Totales"
        class-conenido          ="column q-gutter-xs"
        >
        <table>
          <tbody>
            <tr>
              <td>Subtotal:</td>
              <td class         ="text-bold fuente-mono">
                {{ formatoPrecio( sumaAcuerdosSubtotal ) }}
              </td>
            </tr>
            <tr v-if            ="busqueda.esPedido">
              <td>Sin fletes:</td>
              <td class         ="text-bold fuente-mono">
                {{ formatoPrecio( sumaAcuerdosSubtotalLimpio ) }}
              </td>
            </tr>
            <tr>
              <td>Total:</td>
              <td class         ="text-bold fuente-mono">
                {{ formatoPrecio( sumaAcuerdosTotal ) }}
              </td>
            </tr>
          </tbody>
        </table>
      </fieldset-filtro>
    </q-tab-panel>
  </q-tab-panels>
</template>
<script lang="ts" setup>
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  watch,
            computed,
            onMounted           } from "vue"
  import {  useRouter           } from "vue-router"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp         } from 'src/stores/app'
  import {  useStoreUser        } from 'src/stores/user'
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  dexieOrigenesContacto,
            dexieCondicionesPago,
            dexieFormasPago,
            dexieMetodosEntrega,
            dexieProveedores,
            getMunicipioDB
                                } from "src/services/useDexie"
  import {  fechaValida,
            formatoPrecio,
            getQueryRouterDate,
            getQueryRouterString,
            getQueryRouterNumber,
            getQueryRouterLabelValue,
            getQueryRouterLabelValueArray,
                                } from "src/useSimpleOk/useTools"
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  Areas               } from "src/models/TiposVarios"
  import {  IQueryAcuerdo,
            IBusquedaAcuerdo    } from "src/areas/acuerdos/models/BusquedaAcuerdos"
  import {  estadosCtz,
            estadosPed,
            estadosOC,          } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  import {  GRUPO_USUARIO       } from "src/models/TiposVarios"
  import {  Anticipo            } from "src/areas/acuerdos/models/Anticipo"  
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    municipios            from "components/utilidades/select/SelectMunicipios.vue"
  import    multiLabelValue       from "components/utilidades/select/SelectLabelValueMulti.vue"
  import    inputFecha            from "src/components/utilidades/input/InputFecha.vue"
  import    selectUsuario         from "src/areas/usuarios/components/SelectUsuario.vue"
  import    inputBuscar           from "src/components/utilidades/input/InputSimple.vue"

  const router                    = useRouter()
  let queryURL                    = router.currentRoute.value.query
  watch( ()=> router.currentRoute.value.query, (q) => {
    queryURL                      = q
  })

  const origenes                  = dexieOrigenesContacto()
  const condicionesPago           = dexieCondicionesPago()
  const formasPago                = dexieFormasPago()
  const metodosEntrega            = dexieMetodosEntrega()
  const proveedores               = dexieProveedores()

  const { usuario, permisos     } = storeToRefs( useStoreUser() )
  const { busqueda, acuerdos    } = storeToRefs( useStoreAcuerdo() )
  const { tabs                  } = storeToRefs( useStoreApp() )

  const opcionesFacturado         = [{value:0, label:'No facturado'},   {value:1, label:'Facturado'   }]
  const opcionesTotales           = [{value:0, label:'Sin totalizar'},  {value:1, label:'Totalizado'  }]
  const opcionesIVA               = [{value:0, label:'Sin IVA'},        {value:1, label:'Con IVA'     }]
  const opcionesTerceroTipo       = [{value:0, label:'Externo'},        {value:1, label:'Interno'     }]
  const opcionesOrdenesProv       = [{value:0, label:'Sin ordenes'},    {value:1, label:'Con ordenes' }]
  const estados                   = computed(()=>   busqueda.value.esCotizacion ? estadosCtz.filter(e => e.value >= -1)
                                                  : busqueda.value.esPedido     ? estadosPed.filter(e => e.value >= -1)
                                                  : busqueda.value.esOCProveedor? estadosOC .filter(e => e.value >= -1)
                                                  : [] )
  
  const autoSelectComercial       = computed(()=> Object.keys(queryURL).length === 0 ? true : getQueryRouterNumber( queryURL.comercial  ) ?? false )
  const autoSelectCreador         = computed(()=> busqueda.value.esOCProveedor && Object.keys(queryURL).length === 0 ? true : getQueryRouterNumber( queryURL.creador    ) ?? false )
  const siguientePagina           = computed(()=> busqueda.value.pagina + (acuerdos.value.length >= busqueda.value.resultadosXPage ? 1 : 0) )
  const haySiguientePagina        = computed(()=> busqueda.value.pagina !== siguientePagina.value )
  const sumaAcuerdosSubtotal      = computed(()=> { 
    let suma                      = 0
    if(!!acuerdos.value && !!acuerdos.value.length)
      suma                        = acuerdos.value.map( a => a.totalConDescu ?? 0 ).reduce((acu, now) => (acu ?? 0) + now)
    return suma
  })
  const sumaAcuerdosSubtotalLimpio= computed(()=> { 
    let suma                      = 0
    if(!!acuerdos.value && !!acuerdos.value.length)
      suma                        = acuerdos.value.map( a => a.subTotalLimpio ).reduce((acu, now) => (acu ?? 0) + now)
    return suma
  })
  const sumaAcuerdosTotal         = computed(()=> { 
    let suma                      = 0
    if(!!acuerdos.value && !!acuerdos.value.length)
      suma                        = acuerdos.value.map( a => a.totalConIva ).reduce((acu, now) => (acu ?? 0) + now)
    return suma
  })  

  let   copiaQ                    = ""
  let   bloqueoInicio             = true

  onMounted(()=>{
    tabs.value                    = { activa : "tab_1", alerts: [ false, true]}
  })

  watch([estados, origenes, condicionesPago, formasPago], ([es,or,co,fp])=>{
    // Estan cargados las opciones, para que estas se puedan asignar desde la query de la URL
    if(!!es.length && !!or.length && !!co.length && !!fp.length ){
      asignarQueryRouterACampos()
    }
  })

  async function asignarQueryRouterACampos()
  {
    busqueda.value.tercero        = getQueryRouterString    ( queryURL.tercero      )
    busqueda.value.contacto       = getQueryRouterString    ( queryURL.contacto     )
    busqueda.value.desde          = getQueryRouterDate      ( queryURL.fechaDesde   )
    busqueda.value.hasta          = getQueryRouterDate      ( queryURL.fechaHasta   )
    busqueda.value.precioMinimo   = getQueryRouterNumber    ( queryURL.subtotalMin  )
    busqueda.value.precioMaximo   = getQueryRouterNumber    ( queryURL.subtotalMax  )
    if(!!queryURL.limite)
      busqueda.value.resultadosXPage= getQueryRouterNumber    ( queryURL.limite       )
    //busqueda.value.creador        = getQueryRouterNumber    ( queryURL.creador      )
    busqueda.value.area           = getQueryRouterLabelValue( queryURL.area,                  Areas                 )
    busqueda.value.facturado      = getQueryRouterLabelValue( queryURL.facturado,             opcionesFacturado     )
    busqueda.value.conIva         = getQueryRouterLabelValue( queryURL.conIva,                opcionesIVA           )
    busqueda.value.totalizado     = getQueryRouterLabelValue( queryURL.conTotal,              opcionesTotales       )
    busqueda.value.tipoTercero    = getQueryRouterLabelValue( queryURL.interno,               opcionesTerceroTipo   )
    busqueda.value.conOrdenes     = getQueryRouterLabelValue( queryURL.conOrdenes,            opcionesOrdenesProv   )
    busqueda.value.estadoAnticipo = getQueryRouterLabelValueArray ( queryURL.estadoAnticipo,  Anticipo.estados      )
    busqueda.value.tipoAnticipo   = getQueryRouterLabelValueArray ( queryURL.tipoAnticipo,    Anticipo.tipos        )
    busqueda.value.estados        = getQueryRouterLabelValueArray ( queryURL.estados,         estados.value         )    
    busqueda.value.formaPago      = getQueryRouterLabelValueArray ( queryURL.formaPago,       formasPago.value      )
    busqueda.value.entrega        = getQueryRouterLabelValueArray ( queryURL.entrega,         metodosEntrega.value  )
    busqueda.value.condiciones    = getQueryRouterLabelValueArray ( queryURL.condiciones,     condicionesPago.value )
    busqueda.value.origenes       = getQueryRouterLabelValueArray ( queryURL.origenes,        origenes.value        )
    if(!!queryURL.municipio)
      busqueda.value.municipio    = await getMunicipioDB( Array.isArray(queryURL.municipio) ? 0 : +queryURL.municipio ) 
    
      bloqueoInicio                 = false
  }

  const emit = defineEmits<{
    (e: 'buscar',   value: IQueryAcuerdo  ): void
    (e: 'limpiar',                        ): void
    (e: 'exportar',                       ): void    
  }>()

  watch(busqueda, (b)=>
    {
      if(bloqueoInicio) return
      checkAlertTabs(b)
      //if( !permisos.value.acceso_total )
        //query.idComercial         = usuario.value.id
      buscar()
    },
    { deep: true }
  )

  function checkAlertTabs( b : IBusquedaAcuerdo ){
    tabs.value.alerts[0]  = ( !!b.tercero           || !!b.contacto           || fechaValida( b.desde ) || fechaValida( b.hasta ) ||
                              !!b.estados.length    || !!b.condiciones.length || !!b.facturado.label    || !!b.comercial          || !!b.creador 
                            )
    tabs.value.alerts[1]  = ( !!b.formaPago.length  || !!b.entrega.length     || !!b.origenes.length    || !!b.conIva.label           ||  
                              !!b.area.label        || !!b.municipio.id       || !!b.totalizado.label   || !!b.estadoAnticipo.length  || !!b.tipoAnticipo.length || 
                              !!b.tipoTercero.label ||!!b.conOrdenes.label    ||!!b.precioMinimo        || !!b.precioMaximo
                            )
  }


  function buscar( origen : string = "" )
  {
    const query         = busqueda.value.query
    const qString       = JSON.stringify(query)
    if(copiaQ           !== qString)
      copiaQ            = qString
    else if(origen      === "")
      return

    if(!!Object.keys(query).length)
    {
      router.replace({ query: {...query }  })
      query.acuerdo     = busqueda.value.acuerdo
      query.tipo        = "busqueda"
      emit("buscar", query)
    }
    else{
      router.replace({ query: {} })
    }
  }

  function limpiarBusqueda(){
    queryURL = {}
    asignarQueryRouterACampos()
    emit("limpiar")
  }
</script>
