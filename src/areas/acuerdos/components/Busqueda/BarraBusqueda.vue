<template>
  <q-tab-panels                 animated keep-alive vertical
    v-model                     ="tabs.activa"
    class                       ="transparent fit"
    >
    <!-- //* /////////////////////////////////////////////////////// Tab 1 -->
    <q-tab-panel
      name                      ="tab_1"
      class                     ="row q-pa-none"
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
          v-model               ="busqueda.contacto"
          label                 ="Contactos"
          icon                  ="mdi-target-account"
          class                 ="width220"
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
          v-model               ="busqueda.condiciones"
          label                 ="Condiciones"
          class                 ="width160"
          icon                  ="mdi-account-cash"
          :options              ="condicionesPago.filter( c => c.esFacturable || !busqueda.esCotizacion )"
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
        <!-- //* ///////////////////////////////////////////////// Comercial Acuerdo -->
        <select-usuario         hundido clearable
          v-model               ="busqueda.comercial"
          class                 ="width160"
          label                 ="Asesor"
          :autoselect           ="autoSelectUsuario"
          :area                 ="usuario.area"
          :readonly             ="!permisos.acceso_total"
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
          />
          <Tooltip label        ="Resultados por pagina"/>
        </div>
        <!-- //* ///////////////////////////////////////////////// Pagina -->
        <div class              ="row justify-center full-width">
          <q-pagination         push unelevated dense
            v-model             ="busqueda.pagina"
            :max                ="busqueda.pagina + (acuerdos.length >= busqueda.resultadosXPage ? 1 : 0)"
            :max-pages          ="3"
            :ellipses           ="false"
            :boundary-numbers   ="false"
          />
          <Tooltip label        ="Pagina"/>
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
          <div>
            <!-- //* ///////////////////////////////////////////// Boton recargar -->
            <q-btn                round push glossy
              icon                ="mdi-refresh"
              padding             ="xs"
              color               ="primary"
              @click              ="buscar"
              >
              <Tooltip label      ="Recargar"/>
            </q-btn>
          </div>
          <div>
            <!-- //* ///////////////////////////////////////////// Boton limpiar -->
            <q-btn                round push glossy
              icon                ="mdi-magnify-close"
              padding             ="xs"
              color               ="primary"
              :disable            ="busqueda.busquedaVacia"
              @click              ="limpiarBusqueda"
              >
              <Tooltip label      ="Limpiar búsqueda"/>
            </q-btn>
          </div>
        </div>
      </fieldset-filtro>      
    </q-tab-panel>
    <!-- //* ///////////////////////////////////////////////////// Tab 2 -->
    <q-tab-panel
      name                      ="tab_2"
      class                     ="row q-pa-none"
      >
      <fieldset-filtro
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
        <!-- //* ///////////////////////////////////////////////// Creador -->
        <select-usuario         hundido clearable todos
          v-model               ="busqueda.creador"
          class                 ="width160"
          label                 ="Creador"
          :area                 ="usuario.area"
          :readonly             ="!permisos.acceso_total"
        />
        <!-- //* ///////////////////////////////////////////////// Municipio -->
        <municipios               hundido
          v-model                 ="busqueda.municipio"
          class                   ="width160"
          tooltip                 ="Municipio tercero"
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
            getMunicipioDB
                                } from "src/services/useDexie"
  import {  fechaValida,
            getQueryRouterDate,
            getQueryRouterString,
            getQueryRouterNumber,
            getQueryRouterLabelValue,
            getQueryRouterLabelValueArray            
                                } from "src/useSimpleOk/useTools"
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  Areas               } from "src/models/TiposVarios"
  import {  IQueryAcuerdo,
            IBusquedaAcuerdo    } from "src/areas/acuerdos/models/BusquedaAcuerdos"
  import {  estadosCtz,
            estadosPed          } from "src/areas/acuerdos/models/ConstantesAcuerdos"

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

  const origenes                  = dexieOrigenesContacto()
  const condicionesPago           = dexieCondicionesPago()
  const formasPago                = dexieFormasPago()
  const metodosEntrega            = dexieMetodosEntrega()

  const { usuario, permisos     } = storeToRefs( useStoreUser() )
  const { busqueda, acuerdos    } = storeToRefs( useStoreAcuerdo() )
  const { tabs                  } = storeToRefs( useStoreApp() )
  const opcionesFacturado         = [{value:0, label:'No facturado'},   {value:1, label:'Facturado'}]
  const opcionesTotales           = [{value:0, label:'Sin totalizar'},  {value:1, label:'Totalizado'}]
  const opcionesIVA               = [{value:0, label:'Sin IVA'},        {value:1, label:'Con IVA'   }]
  const estados                   = computed(()=>   busqueda.value.esCotizacion ? estadosCtz.filter(e => e.value >= -1)
                                                  : busqueda.value.esPedido     ? estadosPed.filter(e => e.value >= -1)
                                                  : [] )
  
  const autoSelectUsuario         = computed(()=> Object.keys(queryURL).length === 0 ? true : getQueryRouterNumber( queryURL.comercial ) ?? false )

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
    //busqueda.value.creador        = getQueryRouterNumber    ( queryURL.creador      )
    busqueda.value.area           = getQueryRouterLabelValue( queryURL.area,              Areas                 )
    busqueda.value.facturado      = getQueryRouterLabelValue( queryURL.facturado,         opcionesFacturado     )
    busqueda.value.conIva         = getQueryRouterLabelValue( queryURL.conIva,            opcionesIVA           )
    busqueda.value.totalizado     = getQueryRouterLabelValue( queryURL.conTotal,          opcionesTotales       )
    busqueda.value.estados        = getQueryRouterLabelValueArray ( queryURL.estados,     estados.value         )    
    busqueda.value.formaPago      = getQueryRouterLabelValueArray ( queryURL.formaPago,   formasPago.value      )
    busqueda.value.entrega        = getQueryRouterLabelValueArray ( queryURL.entrega,     metodosEntrega.value  )
    busqueda.value.condiciones    = getQueryRouterLabelValueArray ( queryURL.condiciones, condicionesPago.value )
    busqueda.value.origenes       = getQueryRouterLabelValueArray ( queryURL.origenes,    origenes.value        )
    if(!!queryURL.municipio)
      busqueda.value.municipio    = await getMunicipioDB( Array.isArray(queryURL.municipio) ? 0 : +queryURL.municipio ) 
  }


  const emit = defineEmits<{
    (e: 'buscar',   value: IQueryAcuerdo  ): void
    (e: 'limpiar',                        ): void
  }>()

  watch(busqueda, (b)=>
    {
      checkAlertTabs(b)
      //if( !permisos.value.acceso_total )
        //query.idComercial         = usuario.value.id
      buscar()
    },
    { deep: true }
  )

  function checkAlertTabs( b : IBusquedaAcuerdo ){
    tabs.value.alerts[0]  = ( !!b.tercero           || !!b.contacto           || fechaValida( b.desde ) || fechaValida( b.hasta ) ||
                              !!b.estados.length    || !!b.condiciones.length || !!b.facturado.label    || !!b.comercial
                            )
    tabs.value.alerts[1]  = ( !!b.formaPago.length  || !!b.entrega.length     || !!b.origenes.length    || !!b.conIva.label       ||  
                              !!b.area.label        || !!b.creador            || !!b.municipio.id       || !!b.totalizado.label   ||  
                              !!b.precioMinimo      || !!b.precioMaximo
                            )
  }


  function buscar()
  {
    const query         = busqueda.value.query
    if(!!Object.keys(query).length)
    {
      router.replace({ query: {...query }  })
      query.limite      = busqueda.value.resultadosXPage
      query.offset      = query.limite * (busqueda.value.pagina - 1)
      query.acuerdo     = busqueda.value.acuerdo
      query.tipo        = "busqueda"
      emit("buscar", query)
    }
    else{
      router.replace({ query: {} })
    }

  }

  function limpiarBusqueda()
  {
    queryURL = {}
    asignarQueryRouterACampos()
    emit("limpiar")
  }
</script>
