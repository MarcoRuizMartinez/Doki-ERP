<template>
  <fieldset-filtro
    titulo                  ="Búsqueda"
    class-conenido          ="column q-gutter-xs"
    >
    <input-buscar           clearable hundido
      v-model               ="busquedaTercero"
      label                 ="Terceros"
      class                 ="width180"
      icon                  ="mdi-account-search"      
    />
    <input-buscar           clearable hundido
      v-model               ="busquedaContacto"
      label                 ="Contactos"
      icon                  ="mdi-target-account"
      class                 ="width180"
    />
  </fieldset-filtro>
  <fieldset-filtro
    titulo                  ="Fechas"
    class-conenido          ="column q-gutter-xs"
    >
    <input-fecha            hundido no-futuro clearable
      v-model               ="desde"
      label                 ="Desde"
      class                 ="width140"
      :hasta                ="hasta"
    />
    <input-fecha            hundido no-futuro clearable
      v-model               ="hasta"
      label                 ="Hasta"
      class                 ="width140"
      :desde                ="desde"
    />
  </fieldset-filtro>
  <fieldset-filtro
    titulo                  ="Subtotal"
    class-conenido          ="column q-gutter-xs"
    >
    <input-number           hundido clearable
      v-model               ="precioMinimo"
      label                 ="Mínimo"
      icon                  ="mdi-currency-usd"
      class                 ="width160"
      :minimo               ="0"
      :maximo               ="!!precioMaximo ? precioMaximo : undefined"
    />
    <input-number           hundido clearable
      v-model               ="precioMaximo"
      label                 ="Máximo"
      icon                  ="mdi-currency-usd"
      class                 ="width160"
      :minimo               ="!!precioMinimo ? precioMinimo : undefined"
      :maximo               ="999_999_999"
    />
  </fieldset-filtro>    
  <fieldset-filtro
    titulo                  ="Opciones"
    class-conenido          ="grilla-ribom"
    >
    <!-- //* ///////////////////////////////////////////////////////////// Unidad -->
    <select-label-value     use-input hundido clearable flat bordered
      v-model               ="estado"
      label                 ="Estado"
      icon                  ="mdi-label"
      class                 ="width150"
      :options              ="estadosCtz.filter(e => e.value >= 0)"
    />
    <select-label-value     use-input hundido clearable flat bordered
      v-model               ="origen"
      label                 ="Origen"
      icon                  ="mdi-source-branch"
      class                 ="width150"
      :options              ="origenes"
    />
    <select-label-value     use-input hundido clearable flat bordered
      v-model               ="conIva"
      label                 ="IVA"
      icon                  ="mdi-bank"
      class                 ="width140"
      :options              ="opcionesIVA"
    />
    <select-label-value     use-input hundido clearable flat bordered
      v-model               ="totalizado"
      label                 ="Totalizar"
      icon                  ="mdi-counter"
      class                 ="width140"
      :options              ="opcionesTotales"
    />
    <select-responsable     hundido clearable
      v-model               ="responsable"
      class                 ="width170"
      :autoselect           ="comercialSelect"
      :area                 ="usuario.area"
      :readonly             ="!permisos.acceso_total"
    />
    <slot>

    </slot>
    <div class              ="">
      <q-btn-toggle         spread push unelevated round 
        v-model             ="resultadosPorPagina"
        color               ="white"
        text-color          ="grey-8"
        toggle-color        ="primary"
        :options            ="[{label: '25', value: 25},{label: '50', value: 50},{label: '100', value: 100}]"
      />
      <Tooltip label        ="Resultados por pagina"/>        
    </div>  

    <div class              ="row justify-center full-width">   
      <q-pagination         push unelevated dense
        v-model             ="pagina"
        :max                ="pagina + (totalResultados >= resultadosPorPagina ? 1 : 0)"
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
</template>
<script lang="ts" setup>

  import {  ref,
            watch,
            computed,
            onMounted,
                                } from "vue"
  import {  storeToRefs         } from 'pinia'
  import {  IBusquedaCotizacion } from "src/areas/acuerdos/cotizaciones/services/servicesCotizaciones"
  import {  IUsuario            } from "src/areas/usuarios/models/Usuario"
  import {  useStoreUser        } from 'src/stores/user'
  import {  estadosCtz          } from "src/areas/acuerdos/cotizaciones/models/Cotizacion"
  import {  dexieOrigenesContacto
                                } from "src/services/useDexie"
  import {  ILabelValue,
            labelValueNulo      } from "src/models/TiposVarios"
  import {  useRouter           } from "vue-router"
  import    inputBuscar           from "src/components/utilidades/input/InputSimple.vue"
  import    selectResponsable     from "src/areas/usuarios/components/SelectUsuario.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"     
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    inputFecha            from "src/components/utilidades/input/InputFecha.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import {  getQueryRouterLabelValue,
            getQueryRouterString,
            getQueryRouterNumber,
            getQueryRouterDate
                                } from "src/useSimpleOk/useTools"  
  const router                    = useRouter()
  let queryURL                    = router.currentRoute.value.query  
  const origenes                  = dexieOrigenesContacto()
  const storeUser                 = useStoreUser()
  const { usuario, permisos }     = storeToRefs(storeUser)  
  const opcionesTotales           = [{value:0, label:'Sin totalizar'},  {value:1, label:'Totalizado'}]
  const opcionesIVA               = [{value:0, label:'Sin IVA'},        {value:1, label:'Con IVA'   }]  

  const queryToApi                = ref<IBusquedaCotizacion >({})
  const busquedaTercero           = ref< string             >("")
  const busquedaContacto          = ref< string             >("")
  const desde                     = ref< Date | string      >("")
  const hasta                     = ref< Date | string      >("")
  const precioMinimo              = ref< number | undefined >()
  const precioMaximo              = ref< number | undefined >()
  const estado                    = ref< ILabelValue        >( labelValueNulo )
  const conIva                    = ref< ILabelValue        >( labelValueNulo )
  const totalizado                = ref< ILabelValue        >( labelValueNulo )
  const origen                    = ref< ILabelValue        >( labelValueNulo )
  
  const responsable               = ref< IUsuario >()
  const resultadosPorPagina       = ref< number   >(25)
  const pagina                    = ref< number   >(1)
  const comercialSelect           = computed(()=> Object.keys(queryURL).length === 0 ? true : getQueryRouterNumber( queryURL.idComercial ) ?? false )
  //const queryToApiLength          = computed(()=> Object.keys(queryToApi.value).length)
  
  onMounted(asignarQueryRouterACampos)

  const props                     = defineProps({
    totalResultados: { required: true,   type: Number },
  })  
  
  function asignarQueryRouterACampos()
  {
    busquedaTercero.value         = getQueryRouterString    ( queryURL.tercero      )
    busquedaContacto.value        = getQueryRouterString    ( queryURL.contacto     )
    desde.value                   = getQueryRouterDate      ( queryURL.fechaDesde   )
    hasta.value                   = getQueryRouterDate      ( queryURL.fechaHasta   )
    precioMinimo.value            = getQueryRouterNumber    ( queryURL.subtotalMin  )
    precioMaximo.value            = getQueryRouterNumber    ( queryURL.subtotalMax  )
    estado.value                  = getQueryRouterLabelValue( queryURL.estado,      estadosCtz      )
    conIva.value                  = getQueryRouterLabelValue( queryURL.conIva,      opcionesIVA     )
    totalizado.value              = getQueryRouterLabelValue( queryURL.conTotal,    opcionesTotales )
    origen.value                  = getQueryRouterLabelValue( queryURL.origen,      origenes.value  )
  }
  watch(origenes,()=>origen.value = getQueryRouterLabelValue( queryURL.origen, origenes.value,  "number" ))
  
  const emit = defineEmits<{
    (e: 'buscar',   value: IBusquedaCotizacion  ): void
    (e: 'limpiar',                              ): void
  }>()

  watch
  (
    [ busquedaTercero,
      busquedaContacto,
      desde,
      hasta,
      precioMinimo,
      precioMaximo,
      estado,
      origen,
      conIva,
      totalizado,
      responsable,
      resultadosPorPagina,
      pagina,
    ],
    (
      [ terceroNew,
        contactoNew,
        desdeNew,
        hastaNew,
        precioMixNew,
        precioMaxNew,
        estadoNew,
        origenNew,
        conIvaNew,
        totalizadoNew,
        responsableNew,
        porPaginaNew,
        paginaNew
      ]
    ) =>
    {
      queryToApi.value                                              = {}
      if(terceroNew.length  > 3)    queryToApi.value.tercero        = terceroNew
      if(contactoNew.length > 3)    queryToApi.value.contacto       = contactoNew
      if(!!precioMixNew)            queryToApi.value.subtotalMin    = precioMixNew
      if(!!precioMaxNew)            queryToApi.value.subtotalMax    = precioMaxNew
      if(!!estadoNew.label)         queryToApi.value.estado         = estadoNew.value
      if(!!origenNew.label)         queryToApi.value.origen         = origenNew.value
      if(!!conIvaNew.label)         queryToApi.value.conIva         = conIvaNew.value
      if(!!totalizadoNew.label)     queryToApi.value.conTotal       = totalizadoNew.value
      if(!!responsableNew)          queryToApi.value.idComercial    = responsableNew.id
      if(desdeNew instanceof Date && !isNaN(desdeNew.valueOf()))  queryToApi.value.fechaDesde  = desdeNew.toLocaleDateString('sv-SE') 
      if(hastaNew instanceof Date && !isNaN(hastaNew.valueOf()))  queryToApi.value.fechaHasta  = hastaNew.toLocaleDateString('sv-SE') 
      //if( !permisos.value.acceso_total )
        //query.idComercial         = usuario.value.id


      buscar()

      if(Object.keys(queryToApi.value).length  == 0  ){
        router.replace({ query: {} })
        return
      }
    }
  )

  function buscar(){
    if(Object.keys(queryToApi.value).length > 0)
    {
      router.replace({ query: {...queryToApi.value}  })
      queryToApi.value.limite     = resultadosPorPagina.value
      queryToApi.value.offset     = queryToApi.value.limite * (pagina.value - 1)
      emit("buscar", queryToApi.value)
    }
  }

  function limpiarBusqueda()
  {
    queryURL = {}
    asignarQueryRouterACampos()
    emit("limpiar")

  }
</script>