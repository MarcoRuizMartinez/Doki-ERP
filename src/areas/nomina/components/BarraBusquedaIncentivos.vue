<template>
  <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET REF Y USUARIO  -->
  <fieldset-filtro
    titulo                  ="Búsqueda"
    class-conenido          ="column q-gutter-xs"
    >
    <!-- //* ///////////////////////////////////////////////// Busqueda general -->        
    <input-buscar           clearable hundido
      v-model               ="incentivosSearch.ref"
      label                 ="Búsqueda Ref"
      class                 ="width200"
      icon                  ="mdi-magnify"
    />
    <!-- //* ///////////////////////////////////////////////// Usuario -->
    <select-usuario         hundido clearable
      v-model               ="incentivosSearch.usuario"
      class                 ="width200"
      label                 ="Usuario"
      :autoselect           ="autoSelectUsuario"
      :readonly             ="!permisos.acceso_total"
      :grupos               =[GRUPO_USUARIO.EN_NOMINA]
    />
  </fieldset-filtro>
  <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET VALOR -->
  <fieldset-filtro
    titulo                  ="Valor"
    class-conenido          ="column q-gutter-xs"
    >
    <!-- //* ///////////////////////////////////////////////// Precio Minimo -->
    <input-number           hundido clearable
      v-model               ="incentivosSearch.valorMin"
      label                 ="Mínimo"
      icon                  ="mdi-currency-usd"
      class                 ="width160"
      :minimo               ="0"
      :maximo               ="!!incentivosSearch.valorMax ? incentivosSearch.valorMax : undefined"
    />
    <!-- //* ///////////////////////////////////////////////// Precio Maximo -->
    <input-number           hundido clearable
      v-model               ="incentivosSearch.valorMax"
      label                 ="Máximo"
      icon                  ="mdi-currency-usd"
      class                 ="width160"
      :minimo               ="!!incentivosSearch.valorMin ? incentivosSearch.valorMin : undefined"
      :maximo               ="999_999_999"
    />
  </fieldset-filtro>
  <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET ESTADOS -->
  <fieldset-filtro
    titulo                  ="Estado"
    class-conenido          ="column q-gutter-xs"
    >
    <!-- //* ///////////////////////////////////////////////// Estado -->
    <select-label-value     use-input hundido clearable flat bordered
      v-model               ="incentivosSearch.estado"
      label                 ="Estado"
      icon                  ="mdi-file-check"
      class                 ="width180"
      :options              ="Incentivo.estados"
    />
    <!-- //* ///////////////////////////////////////////////// Pagado -->
    <select-label-value     use-input hundido clearable flat bordered
      v-model               ="incentivosSearch.pagado"
      label                 ="Pago"
      icon                  ="mdi-cash-check"
      class                 ="width180"
      :options              ="Incentivo.estadosPago"
    />    
  </fieldset-filtro>  
  <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET Paginación -->
  <fieldset-filtro
    titulo                  ="Paginas"
    class-conenido          ="grilla-ribom fit"
    >
    <!-- //* ///////////////////////////////////////////////// Resultados por pagina -->
    <div>
      <q-btn-toggle         spread push unelevated round
        v-model             ="incentivosSearch.resultadosXPage"
        color               ="white"
        text-color          ="grey-8"
        toggle-color        ="primary"
        :options            ="[{label: '25', value: 25},{label: '50', value: 50},{label: '100', value: 100}]"
        @update:model-value ="incentivosSearch.pagina = 1"
      />
      <Tooltip label        ="Resultados por pagina"/>
    </div>
    <!-- //* ///////////////////////////////////////////////// Pagina -->
    <div class              ="row justify-center full-width">
      <q-pagination         dense
        v-model             ="incentivosSearch.pagina"
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
          :disable            ="incentivosSearch.busquedaVacia"
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
          :disable            ="incentivosSearch.busquedaVacia"
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
            onMounted,
            computed            } from "vue"
  import {  useRouter           } from "vue-router"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from "pinia"

  import {  useStoreUser        } from "src/stores/user"
  import {  useStoreNomina      } from "src/stores/nomina"

  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  getQueryRouterString,
            getQueryRouterNumber,
            getQueryRouterLabelValue,
                                } from "src/useSimpleOk/useTools"

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  IQueryIncentivo     } from "src/areas/nomina//models/BusquedaIncentivos"
  import {  Incentivo           } from "src/areas/nomina//models/Incentivo"            
  import {  GRUPO_USUARIO       } from "src/models/TiposVarios"

  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    selectUsuario         from "src/areas/usuarios/components/SelectUsuario.vue"
  import    inputBuscar           from "src/components/utilidades/input/InputSimple.vue"

  const router                    = useRouter()
  let queryURL                    = router.currentRoute.value.query
  watch( ()=> router.currentRoute.value.query, (q) => {
    queryURL                      = q
  })

  const { permisos              } = storeToRefs( useStoreUser() )
  const { incentivos,
          incentivosSearch      } = storeToRefs( useStoreNomina() )

  onMounted(asignarQueryRouterACampos)
  
  const autoSelectUsuario         = computed(()=> Object.keys(queryURL).length === 0 ? true : getQueryRouterNumber( queryURL.usuarioId  ) ?? false )
  const siguientePagina           = computed(()=> incentivosSearch.value.pagina + (incentivos.value.length >= incentivosSearch.value.resultadosXPage ? 1 : 0) )
  const haySiguientePagina        = computed(()=> incentivosSearch.value.pagina !== siguientePagina.value )

  let   copiaQ                    = ""
  let   bloqueoInicio             = true

  async function asignarQueryRouterACampos()
  {
    incentivosSearch.value.ref      = getQueryRouterString    ( queryURL.ref )
    incentivosSearch.value.valorMin = getQueryRouterNumber    ( queryURL.valorMin  )
    incentivosSearch.value.valorMax = getQueryRouterNumber    ( queryURL.valorMax  )
    incentivosSearch.value.estado   = getQueryRouterLabelValue( queryURL.estado, Incentivo.estados)
    incentivosSearch.value.pagado   = getQueryRouterLabelValue( queryURL.pagado, Incentivo.estadosPago)
    if(!!queryURL.limite)
      incentivosSearch.value.resultadosXPage = getQueryRouterNumber ( queryURL.limite       )
    
    bloqueoInicio                 = false
  }

  const emit = defineEmits<{
    (e: 'buscar',   value: IQueryIncentivo  ): void
    (e: 'limpiar',                          ): void
    (e: 'exportar',                         ): void    
  }>()

  watch(incentivosSearch, (b)=>
    {
      if(bloqueoInicio) return
      buscar()
    },
    { deep: true }
  )

  function buscar( origen : string = "" )
  {
    const query         = incentivosSearch.value.query
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
