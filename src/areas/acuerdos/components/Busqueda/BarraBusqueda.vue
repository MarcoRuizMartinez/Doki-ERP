<template>
  <q-tab-panels                 animated keep-alive vertical
    v-model                     ="tabs" 
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
          label                 ="Terceros"
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
      <fieldset-filtro
        titulo                  ="Opciones"
        class-conenido          ="grilla-ribom"
        >
        <select-responsable     hundido clearable
          v-model               ="busqueda.responsable"
          class                 ="width170"
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
        <!-- //* ///////////////////////////////////////////////////////////// Unidad -->
<!--         <select-label-value     use-input hundido clearable flat bordered
          v-model               ="busqueda.estado"
          label                 ="Estado"
          icon                  ="mdi-label"
          class                 ="width150"
          :options              ="estadosCtz.filter(e => e.value >= 0)"
        /> -->
<!--         <select-label-value     use-input hundido clearable flat bordered
          v-model               ="busqueda.origen"
          label                 ="Origen"
          icon                  ="mdi-source-branch"
          class                 ="width150"
          :options              ="origenes"
        /> -->
        <multi-label-value
          v-model               ="busqueda.estado"
          label                 ="Estado"
          icon                  ="mdi-label"
          :options              ="estados"
        />             
        <multi-label-value
          v-model               ="busqueda.origen"
          label                 ="Origen"
          icon                  ="mdi-source-branch"
          :options              ="origenes"
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
  import {  dexieOrigenesContacto
                                } from "src/services/useDexie"
  import {  getQueryRouterDate,
            getQueryRouterString,
            getQueryRouterNumber,
            getQueryRouterLabelValue,
            getQueryRouterLabelValueArray
                                } from "src/useSimpleOk/useTools"
  // * /////////////////////////////////////////////////////////////////////// Modelos
  
  import {  IQueryAcuerdo       } from "src/areas/acuerdos/models/BusquedaAcuerdos"
  import {  estadosCtz,
            estadosPed,
                                } from "src/areas/acuerdos/models/ConstantesAcuerdos"

  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"     
  import    multiLabelValue       from "components/utilidades/select/SelectLabelValueMulti.vue"
  import    inputFecha            from "src/components/utilidades/input/InputFecha.vue"
  import    selectResponsable     from "src/areas/usuarios/components/SelectUsuario.vue"
  import    inputBuscar           from "src/components/utilidades/input/InputSimple.vue"
  import {  ILabelValue,
            labelValueNulo      } from "src/models/TiposVarios"

  const router                    = useRouter()
  let queryURL                    = router.currentRoute.value.query  
  const origenes                  = dexieOrigenesContacto()
  const { usuario, permisos }     = storeToRefs( useStoreUser() )  
  const { busqueda              } = storeToRefs( useStoreAcuerdo() )  
  const opcionesTotales           = [{value:0, label:'Sin totalizar'},  {value:1, label:'Totalizado'}]
  const opcionesIVA               = [{value:0, label:'Sin IVA'},        {value:1, label:'Con IVA'   }]

  const multi                     = ref<ILabelValue[]>([])
  const estados                   = computed(()=>   busqueda.value.esCotizacion ? estadosCtz.filter(e => e.value >= -1) 
                                                  : busqueda.value.esPedido     ? estadosPed.filter(e => e.value >= -1)
                                                  : [] )

  const { tabs }                  = storeToRefs( useStoreApp() )
  //const queryToApi                = ref< IBusquedaAcuerdo >({})

  const autoSelectUsuario         = computed(()=> Object.keys(queryURL).length === 0 ? true : getQueryRouterNumber( queryURL.idComercial ) ?? false )
  //const queryToApiLength          = computed(()=> Object.keys(queryToApi.value).length)
  

  
  onMounted(()=>{
    tabs.value                    = "tab_2"
  })

  const props                     = defineProps({
    totalResultados: { required: true,   type: Number },
  })  
  
  watch([estados, origenes], ()=>{
    // Estan cargados las opciones, para que estas se puedan asignar desde la query de la URL 
    if(!!estados.value.length && !!origenes.value.length){
      asignarQueryRouterACampos()
    }
  })

  function asignarQueryRouterACampos()
  {
    busqueda.value.tercero        = getQueryRouterString    ( queryURL.tercero      )
    busqueda.value.contacto       = getQueryRouterString    ( queryURL.contacto     )
    busqueda.value.desde          = getQueryRouterDate      ( queryURL.fechaDesde   )
    busqueda.value.hasta          = getQueryRouterDate      ( queryURL.fechaHasta   )
    busqueda.value.precioMinimo   = getQueryRouterNumber    ( queryURL.subtotalMin  )
    busqueda.value.precioMaximo   = getQueryRouterNumber    ( queryURL.subtotalMax  )
    busqueda.value.conIva         = getQueryRouterLabelValue( queryURL.conIva,        opcionesIVA     )
    busqueda.value.totalizado     = getQueryRouterLabelValue( queryURL.conTotal,      opcionesTotales )
    busqueda.value.estado         = getQueryRouterLabelValueArray ( queryURL.estado,  estados.value      )
    busqueda.value.origen         = getQueryRouterLabelValueArray ( queryURL.origen,  origenes.value     )
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
      //if( !permisos.value.acceso_total )
        //query.idComercial         = usuario.value.id
      buscar()

      if(!Object.keys(b.query).length){
        router.replace({ query: {} })
        return
      }
    },
    { deep: true }
  )


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
  }

  function limpiarBusqueda()
  {
    queryURL = {}
    asignarQueryRouterACampos()
    emit("limpiar")
  }
</script>