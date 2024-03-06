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
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Dimensión -->
        <select-label-value     fc use-input hundido flat bordered
          v-model               ="b.f.dimension"
          label                 ="Dimensión"
          icon                  ="mdi-axis-arrow"
          class                 ="width160"
          :options              ="Busqueda.listaDimensiones"
        />
        <!-- //* ///////////////////////////////////////////////// Pedido facturado -->
        <select-label-value     use-input hundido flat bordered
          v-model               ="b.f.periodo"
          label                 ="Periodo *"
          icon                  ="mdi-calendar"
          class                 ="width160"
          :options              ="Busqueda.listaPeriodos"
        />
      </fieldset-filtro>
      <!-- //* /////////////////////////////////////////////////// Fecha  -->
      <fieldset-filtro
        titulo                  ="Fecha"
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Fecha desde -->
        <input-fecha            hundido no-futuro clearable
          v-model               ="b.f.desde"
          label                 ="Desde *"
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
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Busqueda general -->        
        <!--
        <input-buscar           clearable hundido
          v-model               ="b.f.buscar"
          label                 ="Búsqueda"
          class                 ="width160"
          icon                  ="mdi-account-search"
        />
        -->
        <!-- //* ///////////////////////////////////////////////// Estado acuerdo -->
        <multi-label-value
          v-model               ="b.f.estados"
          label                 ="Estado"
          class                 ="width160"
          icon                  ="mdi-label"
          :options              ="b.o.estados"
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
        <!-- //* ///////////////////////////////////////////////// Con total y sin total -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esCotizacion"
          v-model               ="b.f.totalizado"
          label                 ="Totalizar"
          icon                  ="mdi-counter"
          class                 ="width160"
          :options              ="Busqueda.listaTotales"
        />
        <!-- //* ///////////////////////////////////////////////// Municipio -->
        <municipios             hundido
          v-model               ="b.f.municipio"
          class                 ="width160"
          tooltip               ="Municipio tercero"
        />
        <!-- //* ///////////////////////////////////////////////// Usuarios -->
        <multi-label-value
          v-model               ="b.f.usuarios"
          label                 ="Comerciales"
          class                 ="width160"
          icon                  ="mdi-account-multiple"
          :options              ="b.o.usuarios"
        />        
        <!-- //* ///////////////////////////////////////////////// Área o departamento -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.area"
          label                 ="Área"
          icon                  ="mdi-google-circles-extended"
          class                 ="width160"
          :options              ="Busqueda.listaAreas"
        />
    
        <!-- //* ///////////////////////////////////////////////// Comercial Acuerdo -->
        <!-- <select-usuario         hundido clearable
          v-if                  ="!b.esOCProveedor"
          v-model               ="b.f.usuario"
          class                 ="width160"
          label                 ="Asesor"
          :area                 ="usuario.area"
          :grupos               =[GRUPO_USUARIO.COMERCIALES]
          :readonly             ="!b.puedeCambiarUser"
        /> -->
        
        <!-- //* ///////////////////////////////////////////////// Pedido facturado -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esPedido"
          v-model               ="b.f.facturado"
          label                 ="Facturado"
          icon                  ="mdi-file-check"
          class                 ="width160"
          :options              ="Busqueda.listaFacturado"
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
      </fieldset-filtro>
      <fieldset-filtro
        v-if                    ="!b.esEntrega"
        titulo                  ="Subtotal"
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Precio Minimo -->
        <input-number           hundido clearable
          v-model               ="b.f.valorMin"
          label                 ="Mínimo"
          icon                  ="mdi-currency-usd"
          class                 ="width140"
          :minimo               ="0"
          :maximo               ="!!b.f.valorMax ? b.f.valorMax : undefined"
        />
        <!-- //* ///////////////////////////////////////////////// Precio Maximo -->
        <input-number           hundido clearable
          v-model               ="b.f.valorMax"
          label                 ="Máximo"
          icon                  ="mdi-currency-usd"
          class                 ="width140"
          :minimo               ="!!b.f.valorMin ? b.f.valorMin : undefined"
          :maximo               ="999_999_999"
        />
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
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Métodos de entrega -->
        <multi-label-value
          v-model               ="b.f.entrega"
          label                 ="Entrega"
          class                 ="width160"
          icon                  ="mdi-truck-delivery"
          :options              ="b.o.metodosEntrega"
        />
        <!-- //* ///////////////////////////////////////////////// Con IVA o sin IVA -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esCotizacion"
          v-model               ="b.f.conIva"
          label                 ="IVA"
          icon                  ="mdi-bank"
          class                 ="width160"
          :options              ="Busqueda.listaIVA"
        />
              
        <!-- //* ///////////////////////////////////////////////// Forma de pago -->
        <multi-label-value
          v-if                  ="!b.esEntrega"
          v-model               ="b.f.formaPago"
          label                 ="Pago"
          class                 ="width160"
          icon                  ="mdi-cash-refund"
          :options              ="b.o.formasPago"
        />
        <!-- //* ///////////////////////////////////////////////// Tercero interno o externo -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.terceroInterno"
          label                 ="Tipo tercero"
          icon                  ="mdi-circle-multiple"
          class                 ="width160"
          :options              ="Busqueda.listaTerceroInterno"
        /> 
        <!-- //* ///////////////////////////////////////////////// Forma de pago -->
        <!-- //* ///////////////////////////////////////////////// Estado Anticipo -->
        <!-- <multi-label-value
          v-if                  ="b.esPedido"
          v-model               ="b.f.estadoAnticipo"
          label                 ="Estado anticipo"
          icon                  ="mdi-cash-check"
          class                 ="width160"
          :options              ="Busqueda.listaAnticipoEstados"
        /> -->
        <!-- //* ///////////////////////////////////////////////// Estado Anticipo -->
        <!-- <multi-label-value
          v-if                  ="b.esPedido"
          v-model               ="b.f.tipoAnticipo"
          label                 ="Tipo anticipo"
          icon                  ="mdi-cash"
          class                 ="width160"
          :options              ="Busqueda.listaAnticipoTipos"
        /> -->
        <!-- //* ///////////////////////////////////////////////// Con pedidos a proveedor -->
        <!-- <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esPedido"
          v-model               ="b.f.conOrdenes"
          label                 ="OC proveedor"
          icon                  ="mdi-factory"
          class                 ="width160"
          :options              ="Busqueda.listaOrdenesProv"
        />   -->       
        <!-- //* ///////////////////////////////////////////////// Comision -->
        <!-- <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esPedido"
          v-model               ="b.f.incPago"
          label                 ="Comisión"
          icon                  ="mdi-cash-check"
          class                 ="width160"
          :options              ="Busqueda.listaEstadosPago"
        />     -->       
      </fieldset-filtro>

    </q-tab-panel>
  </q-tab-panels>
</template>
<script lang="ts" setup>
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  watch, computed
                                } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp         } from 'stores/app'
  import {  useStoreUser        } from 'stores/user'
  import {  useStoreAcuerdo     } from 'stores/acuerdo'
  // * /////////////////////////////////////////////////////////////////////// Componibles

  // * /////////////////////////////////////////////////////////////////////// Modelos  
  import {  IQuery, Busqueda    } from "src/models/Busqueda"
  import {  GRUPO_USUARIO       } from "src/models/TiposVarios"
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    municipios            from "components/utilidades/select/SelectMunicipios.vue"
  import    multiLabelValue       from "components/utilidades/select/SelectLabelValueMulti.vue"
  import    inputFecha            from "components/utilidades/input/InputFecha.vue"
  import    selectUsuario         from "src/areas/usuarios/components/SelectUsuario.vue"
  import    inputBuscar           from "components/utilidades/input/InputSimple.vue"
  import    innerLoading          from "components/utilidades/InnerLoading.vue"

  // * /////////////////////////////////////////////////////////////////////// Importaciones 
  const { usuario, permisos     } = storeToRefs( useStoreUser() )
  const { busqueda : b, 
          acuerdos,
          loading               } = storeToRefs( useStoreAcuerdo() )
  const { tabs                  } = storeToRefs( useStoreApp() )

  const emit = defineEmits<{
    (e: 'buscar',   value: IQuery ): void
    (e: 'limpiar',                ): void
    (e: 'exportar',               ): void    
  }>()

  watch(()=>b.value.f, ()=>
    {
      if(b.value.puedeBuscar && b.value.checkPage())
        buscar()
      else  if(b.value.queryVacia ) limpiarBusqueda()
    },
    { deep: true }
  )

  function buscar()
  {
    b.value.copiarQueryARourter()
    if(!busquedaCompleta.value) return

    const query       = b.value.query
    query.acuerdo     = b.value.acuerdo
    emit("buscar", query)
  }

  async function limpiarBusqueda(){
    const todoLimpio  = await b.value.limpiarQueryDeRouter()
    if(todoLimpio) emit("limpiar")
  }  

  const busquedaCompleta          = computed(()=> ( "fechaDesde"  in b.value.query &&
                                                    "periodo"     in b.value.query &&
                                                    "dimension"   in b.value.query
                                                  )
                                            )

</script>
