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
          v-model               ="b.f.tercero"
          label                 ="Búsqueda"
          class                 ="width200"
          icon                  ="mdi-account-search"
        />
        <!-- //* ///////////////////////////////////////////////// Busqueda contacto -->
        <input-buscar           clearable hundido
          v-if                  ="!b.esOCProveedor"
          v-model               ="b.f.contacto"
          label                 ="Contactos"
          icon                  ="mdi-target-account"
          class                 ="width200"
        />
        <!-- //* ///////////////////////////////////////////////// Proveedores -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esOCProveedor"
          v-model               ="b.f.proveedores"
          label                 ="Proveedores"
          icon                  ="mdi-storefront"
          class                 ="width220"
          :options              ="b.o.proveedores"
        />
      </fieldset-filtro>
      <!-- //* /////////////////////////////////////////////////// Fecha creacion -->
      <fieldset-filtro
        titulo                  ="Creación"
        class-conenido          ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Fecha desde -->
        <input-fecha            hundido no-futuro clearable
          v-model               ="b.f.desde"
          label                 ="Desde"
          class                 ="width160"
          :hasta                ="b.f.hasta"
        />
        <!-- //* ///////////////////////////////////////////////// Fecha hasta -->
        <input-fecha            hundido no-futuro clearable
          v-model               ="b.f.hasta"
          label                 ="Hasta"
          class                 ="width160"
          :desde                ="b.f.desde"
        />
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Estado"
        class-conenido          ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Estado acuerdo -->
        <multi-label-value
          v-model               ="b.f.estados"
          label                 ="Estado"
          class                 ="width160"
          icon                  ="mdi-label"
          :options              ="b.o.estados"
        />
        <!-- //* ///////////////////////////////////////////////// Métodos de entrega -->
        <multi-label-value
          v-model               ="b.f.entrega"
          label                 ="Entrega"
          class                 ="width160"
          icon                  ="mdi-truck-delivery"
          :options              ="b.o.metodosEntrega"
        />
        <!-- //* ///////////////////////////////////////////////// Condiciones pago -->
        <multi-label-value
          v-if                  ="!b.esOCProveedor && !b.esEntrega"
          v-model               ="b.f.condiciones"
          label                 ="Condiciones"
          class                 ="width160"
          icon                  ="mdi-account-cash"
          :options              ="b.o.condicionesPago"
        />
        <!-- //* ///////////////////////////////////////////////// Comercial Acuerdo -->
        <select-usuario         hundido clearable
          v-if                  ="!b.esOCProveedor"
          v-model               ="b.f.comercial"
          class                 ="width160"
          label                 ="Asesor"
          :autoselect           ="usuario.esComercial && !b.hayComercialInicio"  
          :area                 ="usuario.area"
          :grupos               =[GRUPO_USUARIO.COMERCIALES]
          :readonly             ="!permisos.acceso_total"
        />
        <!-- //* ///////////////////////////////////////////////// Creador -->
        <select-usuario         hundido clearable
          v-model               ="b.f.creador"
          class                 ="width160"
          label                 ="Creador"
          :area                 ="usuario.area"
          :grupos               ="b.esOCProveedor ? [GRUPO_USUARIO.PRODUCCION] : []"
          :readonly             ="!permisos.acceso_total"
        />
        <!-- //* ///////////////////////////////////////////////// Municipio contacto -->
        <municipios             hundido
          v-if                  ="b.esEntrega"
          v-model               ="b.f.municipioContacto"
          class                 ="width160"
          label                 ="Lugar envió"
          tooltip               ="Municipio contacto"
        />        
        <!-- //* ///////////////////////////////////////////////// Pedido facturado -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esPedido"
          v-model               ="b.f.facturado"
          label                 ="Facturado"
          icon                  ="mdi-file-check"
          class                 ="width160"
          :options              ="BusquedaAcuerdo.listaFacturado"
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
            v-model             ="b.f.resultadosXPage"
            color               ="white"
            text-color          ="grey-8"
            toggle-color        ="primary"
            :options            ="[{label: '10', value: 10}, {label: '25', value: 25},{label: '50', value: 50},{label: '100', value: 100}]"
            @update:model-value ="b.f.pagina = 1"
          />
          <Tooltip label        ="Resultados por pagina"/>
        </div>
        <!-- //* ///////////////////////////////////////////////// Pagina -->
        <div class              ="row justify-center full-width">
          <q-pagination         dense
            v-model             ="b.f.pagina"
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
              :disable            ="b.queryVacia"
              @click              ="buscar"
              >
              <Tooltip label      ="Recargar"/>
            </q-btn>
          </div>
          <!-- //* /////////////////////////////////////////////// Boton limpiar 'btnRecargar -->
          <div>
            <q-btn                round push glossy
              icon                ="mdi-close"
              padding             ="xs"
              color               ="primary"
              :disable            ="b.queryVacia"
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
              :disable            ="b.queryVacia"
              @click              ="emit('exportar')"
              >
              <Tooltip label      ="Descargar"/>
            </q-btn>
          </div>
        </div>
      </fieldset-filtro>
      <inner-loading :cargando    ="loading.carga || b.f.copiando"/>
    </q-tab-panel>
    <!-- //* ///////////////////////////////////////////////////// Tab 2 -->
    <q-tab-panel
      name                      ="tab_2"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <fieldset-filtro
        v-if                    ="!b.esOCProveedor"
        titulo                  ="Opciones"
        class-conenido          ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Forma de pago -->
        <multi-label-value
          v-if                  ="!b.esEntrega"
          v-model               ="b.f.formaPago"
          label                 ="Pago"
          class                 ="width160"
          icon                  ="mdi-cash-refund"
          :options              ="b.o.formasPago"
        />
        <!-- //* ///////////////////////////////////////////////// Métodos de entrega -->
        <multi-label-value
          v-if                  ="!b.esEntrega"
          v-model               ="b.f.entrega"
          label                 ="Entrega"
          class                 ="width160"
          icon                  ="mdi-truck-delivery"
          :options              ="b.o.metodosEntrega"
        />
        <!-- //* ///////////////////////////////////////////////// Origen contacto -->
        <multi-label-value
          v-if                  ="!b.esEntrega"
          v-model               ="b.f.origenes"
          label                 ="Origen"
          class                 ="width160"
          icon                  ="mdi-source-branch"
          :options              ="b.o.origenes"
        />
<!--         <select-origenes
          v-if                  ="!b.esEntrega"
          ref                   ="comOrigenes"
          v-model               ="b.origenes"
          class                 ="width160"
        /> -->
        <!-- //* ///////////////////////////////////////////////// Con IVA o sin IVA -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esCotizacion"
          v-model               ="b.f.conIva"
          label                 ="IVA"
          icon                  ="mdi-bank"
          class                 ="width160"
          :options              ="BusquedaAcuerdo.listaIVA"
        />
        <!-- //* ///////////////////////////////////////////////// Con total y sin total -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esCotizacion"
          v-model               ="b.f.totalizado"
          label                 ="Totalizar"
          icon                  ="mdi-counter"
          class                 ="width160"
          :options              ="BusquedaAcuerdo.listaTotales"
        />
        <!-- //* ///////////////////////////////////////////////// Área o departamento -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.area"
          label                 ="Área"
          icon                  ="mdi-google-circles-extended"
          class                 ="width160"
          :options              ="BusquedaAcuerdo.listaAreas"
        />
        <!-- //* ///////////////////////////////////////////////// Municipio -->
        <municipios             hundido
          v-model               ="b.f.municipio"
          class                 ="width160"
          tooltip               ="Municipio tercero"
        />
        <!-- //* ///////////////////////////////////////////////// Tercero interno o externo -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.tipoTercero"
          label                 ="Tipo tercero"
          icon                  ="mdi-circle-multiple"
          class                 ="width160"
          :options              ="BusquedaAcuerdo.listaTerceroTipo"
        />    
        <!-- //* ///////////////////////////////////////////////// Forma de pago -->
        <!-- //* ///////////////////////////////////////////////// Estado Anticipo -->
        <multi-label-value
          v-if                  ="b.esPedido"
          v-model               ="b.f.estadoAnticipo"
          label                 ="Estado anticipo"
          icon                  ="mdi-cash-check"
          class                 ="width160"
          :options              ="BusquedaAcuerdo.listaAnticipoEstados"
        />
        <!-- //* ///////////////////////////////////////////////// Estado Anticipo -->
        <multi-label-value
          v-if                  ="b.esPedido"
          v-model               ="b.f.tipoAnticipo"
          label                 ="Tipo anticipo"
          icon                  ="mdi-cash"
          class                 ="width160"
          :options              ="BusquedaAcuerdo.listaAnticipoTipos"
        />
        <!-- //* ///////////////////////////////////////////////// Con pedidos a proveedor -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esPedido"
          v-model               ="b.f.conOrdenes"
          label                 ="OC proveedor"
          icon                  ="mdi-factory"
          class                 ="width160"
          :options              ="BusquedaAcuerdo.listaOrdenesProv"
        />         
        <!-- //* ///////////////////////////////////////////////// Comision -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esPedido"
          v-model               ="b.f.comision"
          label                 ="Comisión"
          icon                  ="mdi-cash-check"
          class                 ="width160"
          :options              ="BusquedaAcuerdo.listaEstadosPago"
        />           
      </fieldset-filtro>
      <fieldset-filtro
        v-if                    ="!b.esEntrega"
        titulo                  ="Subtotal"
        class-conenido          ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Precio Minimo -->
        <input-number           hundido clearable
          v-model               ="b.f.precioMinimo"
          label                 ="Mínimo"
          icon                  ="mdi-currency-usd"
          class                 ="width140"
          :minimo               ="0"
          :maximo               ="!!b.f.precioMaximo ? b.f.precioMaximo : undefined"
        />
        <!-- //* ///////////////////////////////////////////////// Precio Maximo -->
        <input-number           hundido clearable
          v-model               ="b.f.precioMaximo"
          label                 ="Máximo"
          icon                  ="mdi-currency-usd"
          class                 ="width140"
          :minimo               ="!!b.f.precioMinimo ? b.f.precioMinimo : undefined"
          :maximo               ="999_999_999"
        />
      </fieldset-filtro>
      <fieldset-filtro
        v-if                    ="!b.esEntrega"
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
            <tr v-if            ="b.esPedido">
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
        <inner-loading :cargando="loading.carga"/>
      </fieldset-filtro>
    </q-tab-panel>
  </q-tab-panels>
</template>
<script lang="ts" setup>
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  watch,
            computed,
                                } from "vue"
  import {  useRouter           } from "vue-router"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp         } from 'src/stores/app'
  import {  useStoreUser        } from 'src/stores/user'
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  formatoPrecio       } from "src/useSimpleOk/useTools"
  // * ///////////////////////////////////////////////.//////////////////////// Modelos  
  import {  IQueryAcuerdo,
            BusquedaAcuerdo     } from "src/areas/acuerdos/models/BusquedaAcuerdos"
  import {  GRUPO_USUARIO       } from "src/models/TiposVarios"
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    municipios            from "components/utilidades/select/SelectMunicipios.vue"
  import    multiLabelValue       from "components/utilidades/select/SelectLabelValueMulti.vue"
  import    inputFecha            from "src/components/utilidades/input/InputFecha.vue"
  import    selectUsuario         from "src/areas/usuarios/components/SelectUsuario.vue"
  import    inputBuscar           from "src/components/utilidades/input/InputSimple.vue"
  import    innerLoading          from "src/components/utilidades/InnerLoading.vue"

  // * /////////////////////////////////////////////////////////////////////// Importaciones 
  const { usuario, permisos     } = storeToRefs( useStoreUser() )
  const { busqueda : b, 
          acuerdos,
          loading               } = storeToRefs( useStoreAcuerdo() )
  const { tabs                  } = storeToRefs( useStoreApp() )

  // * /////////////////////////////////////////////////////////////////////// Router
  const router                    = useRouter()
  watch(  ()=> b.value.acuerdo,
          ()=> b.value.iniciarOpciones( router.currentRoute.value.query )
        )

  const emit = defineEmits<{
    (e: 'buscar',   value: IQueryAcuerdo  ): void
    (e: 'limpiar',                        ): void
    (e: 'exportar',                       ): void    
  }>()

  watch(()=>b.value.f, ()=>
    {
      //console.log(">>>>>>>>b.value.f,: ", b.value.f.copiando, !b.value.copiandoACampos);
      //if(b.value.f.camposOk && !b.value.copiandoACampos) buscar()      

      console.log("puedeBuscar. ", b.value.puedeBuscar, b.value.o.opcionesOk, !b.value.f.copiando);
      if(b.value.puedeBuscar) buscar()
    },
    { deep: true }
  )

  function buscar()
  {
    if(!b.value.queryVacia)
    {
      const query       = b.value.query
      router.replace({ query: { ...query }  })
      query.acuerdo     = b.value.acuerdo
      query.tipo        = "busqueda"
      emit("buscar", query)
    }
    else router.replace({ query: {} })
  }

  function limpiarBusqueda(){
    b.value.copiarQueryACampos( "limpiar" )
    emit("limpiar")
  }
  

  // * /////////////////////////////////////////////////////////////////////// Computed
  const siguientePagina           = computed(()=> b.value.f.pagina + (acuerdos.value.length >= b.value.f.resultadosXPage ? 1 : 0) )
  const haySiguientePagina        = computed(()=> b.value.f.pagina !== siguientePagina.value )
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
</script>
