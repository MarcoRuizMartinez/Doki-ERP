<template>
  <fieldset-filtro
    titulo                  ="Búsqueda"
    class-conenido          ="column q-gutter-xs"
    >
    <!-- //* ///////////////////////////////////////////////// Busqueda general -->        
    <input-buscar           clearable hundido
      v-model               ="busqueda.ref"
      label                 ="Búsqueda"
      class                 ="width220"
      icon                  ="mdi-account-search"
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
</template>
<script lang="ts" setup>
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  watch,
            computed,
            onMounted           } from "vue"
  import {  useRouter           } from "vue-router"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from "pinia"
  import {  useStoreApp         } from "src/stores/app"
  import {  useStoreUser        } from "src/stores/user"
  import {  useStoreAcuerdo     } from "src/stores/acuerdo"
  import {  useStoreNomina      } from "src/stores/nomina"

  // * /////////////////////////////////////////////////////////////////////// Componibles
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
  import {  IQueryIncentivo,
            IBusquedaIncentivo  } from "src/areas/nomina//models/BusquedaIncentivos"
  import {  estadosCtz,
            estadosPed,
            estadosOC,
            estadosEnt
                                } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  import {  GRUPO_USUARIO       } from "src/models/TiposVarios"
  import {  Anticipo            } from "src/areas/acuerdos/models/Anticipo"

  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    multiLabelValue       from "components/utilidades/select/SelectLabelValueMulti.vue"
  import    inputFecha            from "src/components/utilidades/input/InputFecha.vue"
  import    selectUsuario         from "src/areas/usuarios/components/SelectUsuario.vue"
  import    inputBuscar           from "src/components/utilidades/input/InputSimple.vue"

  const router                    = useRouter()
  let queryURL                    = router.currentRoute.value.query
  watch( ()=> router.currentRoute.value.query, (q) => {
    queryURL                      = q
  })

  const { usuario, permisos     } = storeToRefs( useStoreUser() )
  const { busqueda              } = storeToRefs( useStoreNomina() )

  const opcionesFacturado         = [{value:0, label:'No facturado'},   {value:1, label:'Facturado'   }]
  const opcionesTotales           = [{value:0, label:'Sin totalizar'},  {value:1, label:'Totalizado'  }]
  const opcionesIVA               = [{value:0, label:'Sin IVA'},        {value:1, label:'Con IVA'     }]
  const opcionesTerceroTipo       = [{value:0, label:'Externo'},        {value:1, label:'Interno'     }]
  const opcionesOrdenesProv       = [{value:0, label:'Sin ordenes'},    {value:1, label:'Con ordenes' }]
/*   const estados                   = computed(()=>   busqueda.value.esCotizacion ? estadosCtz.filter(e => e.value >= -1)
                                                  : busqueda.value.esPedido     ? estadosPed.filter(e => e.value >= -1)
                                                  : busqueda.value.esOCProveedor? estadosOC .filter(e => e.value >= -1)
                                                  : busqueda.value.esEntrega    ? estadosEnt.filter(e => e.value >= -1)
                                                  : [] ) */
  
  //const autoSelectComercial       = computed(()=> Object.keys(queryURL).length === 0 ? true : getQueryRouterNumber( queryURL.comercial  ) ?? false )
  //const autoSelectCreador         = computed(()=> busqueda.value.esOCProveedor && Object.keys(queryURL).length === 0 ? true : getQueryRouterNumber( queryURL.creador    ) ?? false )
  const siguientePagina           = 2//computed(()=> busqueda.value.pagina + (acuerdos.value.length >= busqueda.value.resultadosXPage ? 1 : 0) )
  const haySiguientePagina        = true//computed(()=> busqueda.value.pagina !== siguientePagina.value )

  let   copiaQ                    = ""
  let   bloqueoInicio             = true

/*   watch([estados, origenes, condicionesPago, formasPago], ([es,or,co,fp])=>{
    // Estan cargados las opciones, para que estas se puedan asignar desde la query de la URL
    if(!!es.length && !!or.length && !!co.length && !!fp.length ){
      asignarQueryRouterACampos()
    }
  }) */

  async function asignarQueryRouterACampos()
  {
/*     busqueda.value.tercero        = getQueryRouterString    ( queryURL.tercero      )
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
      busqueda.value.municipio          = await getMunicipioDB( Array.isArray(queryURL.municipio)         ? 0 : +queryURL.municipio ) 
    if(!!queryURL.municipioContacto)
      busqueda.value.municipioContacto  = await getMunicipioDB( Array.isArray(queryURL.municipioContacto) ? 0 : +queryURL.municipioContacto ) 
         */
      bloqueoInicio                 = false
  }

  const emit = defineEmits<{
    (e: 'buscar',   value: IQueryIncentivo  ): void
    (e: 'limpiar',                        ): void
    (e: 'exportar',                       ): void    
  }>()

  watch(busqueda, (b)=>
    {
      if(bloqueoInicio) return
      //checkAlertTabs(b)
      //if( !permisos.value.acceso_total )
        //query.idComercial         = usuario.value.id
      buscar()
    },
    { deep: true }
  )

  

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
