<template>
  <q-tab-panels                 animated keep-alive vertical
    v-model                     ="tabs.activa"
    class                       ="transparent fit"
    >
    <q-tab-panel
      name                      ="tab_1"
      class                     ="row q-pa-none"
      >
      <fieldset-filtro
        titulo                  ="Búsqueda"
        class-conenido          ="column q-gutter-xs"
        >
        <input-buscar           clearable hundido
          v-model               ="busqueda.tercero"
          label                 ="Búsqueda"
          class                 ="width220"
          icon                  ="mdi-account-search"
        />
        <input-buscar           clearable hundido
          v-model               ="busqueda.contacto"
          label                 ="Contactos"
          icon                  ="mdi-target-account"
          class                 ="width220"
        />
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Fechas"
        class-conenido          ="column q-gutter-xs"
        >
        <input-fecha            hundido no-futuro clearable
          v-model               ="busqueda.desde"
          label                 ="Desde"
          class                 ="width140"
          :hasta                ="busqueda.hasta"
        />
        <input-fecha            hundido no-futuro clearable
          v-model               ="busqueda.hasta"
          label                 ="Hasta"
          class                 ="width140"
          :desde                ="busqueda.desde"
        />
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Opciones"
        class-conenido          ="grilla-ribom"
        >
        <select-usuario         hundido clearable
          v-model               ="busqueda.comercial"
          class                 ="width170"
          label                 ="Asesor"
          :autoselect           ="autoSelectUsuario"
          :area                 ="usuario.area"
          :readonly             ="!permisos.acceso_total"
        />
        <slot>

        </slot>
        <div class              ="">
          <q-btn-toggle         spread push unelevated round
            v-model             ="busqueda.resultadosXPage"
            color               ="white"
            text-color          ="grey-8"
            toggle-color        ="primary"
            :options            ="[{label: '25', value: 25},{label: '50', value: 50},{label: '100', value: 100}]"
          />
          <Tooltip label        ="Resultados por pagina"/>
        </div>

        <div class              ="row justify-center full-width">
          <q-pagination         push unelevated dense
            v-model             ="busqueda.pagina"
            :max                ="busqueda.pagina + (totalResultados >= busqueda.resultadosXPage ? 1 : 0)"
            :max-pages          ="3"
            :ellipses           ="false"
            :boundary-numbers   ="false"
          />
          <Tooltip label        ="Pagina"/>
        </div>
        <div class              ="q-ml-sm">
          <q-btn                round push glossy
            icon                ="mdi-refresh"
            padding             ="xs"
            color               ="primary"
            @click              ="buscar"
            >
            <Tooltip label      ="Recargar"/>
          </q-btn>
        </div>
        <div class              ="q-ml-sm">
          <q-btn                round push glossy
            icon                ="mdi-filter-remove"
            padding             ="xs"
            color               ="primary"
            @click              ="limpiarBusqueda"
            >
            <Tooltip label      ="Limpiar búsqueda"/>
          </q-btn>
        </div>
      </fieldset-filtro>
    </q-tab-panel>
    <q-tab-panel
      name                      ="tab_2"
      class                     ="row q-pa-none"
      >
      <fieldset-filtro
        titulo                  ="Opciones"
        class-conenido          ="grilla-ribom"
        >
        <multi-label-value
          v-model               ="busqueda.estados"
          label                 ="Estado"
          class                 ="width140"
          icon                  ="mdi-label"
          :options              ="estados"
        />
        <!-- //* ///////////////////////////////////////////////// Condiciones pago -->
        <multi-label-value
          v-model               ="busqueda.condiciones"
          label                 ="Condiciones"
          class                 ="width140"
          icon                  ="mdi-account-cash"
          :options              ="condicionesPago.filter( c => c.esFacturable || !busqueda.esCotizacion )"
        />
        <!-- //* ///////////////////////////////////////////////// Forma de pago -->
        <multi-label-value
          v-model               ="busqueda.formaPago"
          label                 ="Pago"
          class                 ="width140"
          icon                  ="mdi-cash-refund"
          :options              ="formasPago"
        />
        <!-- //* ///////////////////////////////////////////////// Métodos de entrega -->
        <multi-label-value
          v-model               ="busqueda.entrega"
          label                 ="Entrega"
          class                 ="width140"
          icon                  ="mdi-truck-delivery"
          :options              ="metodosEntrega"
        />          
        <multi-label-value
          v-model               ="busqueda.origenes"
          label                 ="Origen"
          class                 ="width140"
          icon                  ="mdi-source-branch"
          :options              ="origenes"
        />
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="busqueda.facturado"
          label                 ="Facturado"
          icon                  ="mdi-file-check"
          class                 ="width140"
          :options              ="opcionesFacturado"
        />        
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="busqueda.conIva"
          label                 ="IVA"
          icon                  ="mdi-bank"
          class                 ="width140"
          :options              ="opcionesIVA"
        />
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="busqueda.totalizado"
          label                 ="Totalizar"
          icon                  ="mdi-counter"
          class                 ="width140"
          :options              ="opcionesTotales"
        />
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="busqueda.area"
          label                 ="Área"
          icon                  ="mdi-google-circles-extended"
          class                 ="width140"
          :options              ="Areas"
        />        
        <select-usuario         hundido clearable todos
          v-model               ="busqueda.creador"
          class                 ="width140"
          label                 ="Creador"
          :area                 ="usuario.area"
          :readonly             ="!permisos.acceso_total"
        />
      <!-- //* //////////////   Municipio o Ciudad  -->
      <municipios               hundido
        v-model                 ="busqueda.municipio"
        class                   ="width140"
        tooltip                 ="Municipio tercero"
      />
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Subtotal"
        class-conenido          ="column q-gutter-xs"
        >
        <input-number           hundido clearable
          v-model               ="busqueda.precioMinimo"
          label                 ="Mínimo"
          icon                  ="mdi-currency-usd"
          class                 ="width160"
          :minimo               ="0"
          :maximo               ="!!busqueda.precioMaximo ? busqueda.precioMaximo : undefined"
        />
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
  import {  ref,
            watch,
            computed,
            onMounted,
                                } from "vue"
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
            estadosPed,
                                } from "src/areas/acuerdos/models/ConstantesAcuerdos"

  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    municipios            from "components/utilidades/select/SelectMunicipios.vue"
  import    multiLabelValue       from "components/utilidades/select/SelectLabelValueMulti.vue"
  import    inputFecha            from "src/components/utilidades/input/InputFecha.vue"
  import    selectUsuario         from "src/areas/usuarios/components/SelectUsuario.vue"
  import    inputBuscar           from "src/components/utilidades/input/InputSimple.vue"
  import {  ILabelValue,
            labelValueNulo      } from "src/models/TiposVarios"

  const router                    = useRouter()
  let queryURL                    = router.currentRoute.value.query

  const origenes                  = dexieOrigenesContacto()
  const condicionesPago           = dexieCondicionesPago()
  const formasPago                = dexieFormasPago()
  const metodosEntrega            = dexieMetodosEntrega()

  const { usuario, permisos }     = storeToRefs( useStoreUser() )
  const { busqueda              } = storeToRefs( useStoreAcuerdo() )
  const opcionesFacturado         = [{value:0, label:'No facturado'},   {value:1, label:'Facturado'}]
  const opcionesTotales           = [{value:0, label:'Sin totalizar'},  {value:1, label:'Totalizado'}]
  const opcionesIVA               = [{value:0, label:'Sin IVA'},        {value:1, label:'Con IVA'   }]

  const multi                     = ref<ILabelValue[]>([])
  const estados                   = computed(()=>   busqueda.value.esCotizacion ? estadosCtz.filter(e => e.value >= -1)
                                                  : busqueda.value.esPedido     ? estadosPed.filter(e => e.value >= -1)
                                                  : [] )

  const { tabs }                  = storeToRefs( useStoreApp() )
  //const queryToApi                = ref< IBusquedaAcuerdo >({})

  const autoSelectUsuario         = computed(()=> Object.keys(queryURL).length === 0 ? true : getQueryRouterNumber( queryURL.comercial ) ?? false )
  //const queryToApiLength          = computed(()=> Object.keys(queryToApi.value).length)



  onMounted(()=>{
    tabs.value                    = { activa : "tab_2", alerts: [ false, true]}
  })

  const props                     = defineProps({
    totalResultados: { required: true,   type: Number },
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
    busqueda.value.municipio      = await getMunicipioDB( Array.isArray(queryURL.municipio) ? 0 : +queryURL.municipio ) 
  }

  //watch(origenes,()=>
  //  busqueda.value.origen         = getQueryRouterLabelValueArray( queryURL.origen, origenes.value )
  //)

  const emit = defineEmits<{
    (e: 'buscar',   value: IQueryAcuerdo  ): void
    (e: 'limpiar',                            ): void
  }>()

  watch(busqueda, (b)=>
    {
      checkAlertTabs(b)
      //if( !permisos.value.acceso_total )
        //query.idComercial         = usuario.value.id
      buscar()

/*       if(!Object.keys(b.query).length){
        router.replace({ query: {} })
        return
      } */
    },
    { deep: true }
  )

  function checkAlertTabs( b : IBusquedaAcuerdo ){
    tabs.value.alerts[0]  = ( !!b.tercero || !!b.contacto || !!b.comercial || fechaValida( b.desde )  || fechaValida( b.hasta ) )
    tabs.value.alerts[1]  = ( !!b.estados.length    || !!b.condiciones.length || !!b.origenes.length  || !!b.formaPago.length ||
                              !!b.entrega.length    || !!b.area.label         || !!b.facturado.label  || !!b.conIva.label     || !!b.municipio.id || 
                              !!b.totalizado.label  || !!b.creador            || !!b.precioMinimo     || !!b.precioMaximo
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
      console.log("query: ", query);
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
