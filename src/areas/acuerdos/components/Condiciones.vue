<template>
  <ventana                    minimizar
    titulo                    ="Condiciones"
    icono                     ="mdi-handshake"
    :cargando                 ="!acuerdo.tercero.id && !acuerdo.esNuevo"
    class-contenido           ="q-col-gutter-sm"
    >    
    <!-- //* ///////////////////////////////////////////////// Fecha Creacion -->
    <input-fecha              readonly
      v-if                    ="!acuerdo.esNuevo"
      v-model                 ="acuerdo.fechaCreacion"
      label                   ="Fecha creación"
      class                   ="col-md-6 col-12"
    />
    <!-- //* ///////////////////////////////////////////////// Fecha Validacion -->
    <input-fecha              readonly
      v-if                    ="!acuerdo.esNuevo"
      v-model                 ="acuerdo.fechaValidacion"
      label                   ="Fecha validación"
      class                   ="col-md-6 col-12"
    />           
    <!-- //* ///////////////////////////////////////////////// Fecha Fin de validez -->
    <fecha-vencimiento
      v-model                 ="acuerdo.fechaFinValidez"
      class                   ="col-md-6 col-12"
      :dias                   ="acuerdo.diasValidez"
      :nuevo                  ="acuerdo.esNuevo"
      :loading                ="loading.fechaFinValidez"
      @update:model-value     ="editarFechaFinValidez"
    />
    <!-- //* ///////////////////////////////////////////////// Fecha entrega -->
    <input-fecha              no-pasado
      v-model                 ="acuerdo.fechaEntrega"
      label                   ="Fecha entrega"
      titulo                  ="Fecha entrega"
      class                   ="col-md-6 col-12"
      :loading                ="loading.fechaEntrega"
      @update:model-value     ="editarFechaEntrega"
    />
    <!-- //* ///////////////////////////////////////////////// Condiciones pago -->
    <select-label-value
      v-model                 ="acuerdo.condicionPago"
      label                   ="Condiciones de pago"
      icon                    ="mdi-account-cash"
      class                   ="col-md-6 col-12"
      defecto                 ="Anticipo 100%"
      :options                ="condicPago.filter( c => c.esFacturable || !acuerdo.esCotizacion )"
      :loading                ="loading.condicionPago"
      @select                 ="editarCondicionPago"
    />
    <!-- //* ///////////////////////////////////////////////// Forma de pago -->
    <select-label-value
      v-model                 ="acuerdo.formaPago"
      label                   ="Forma de pago"
      icon                    ="mdi-cash-refund"
      class                   ="col-md-6 col-12"
      :options                ="formadPago"
      :loading                ="loading.formaPago"
      @select                 ="editarFormaPago"
    />
    <!-- //* ///////////////////////////////////////////////// Metodo entrega -->
    <select-label-value
      v-model                 ="acuerdo.metodoEntrega"
      label                   ="Método de entrega"
      icon                    ="mdi-truck-delivery"
      class                   ="col-md-6 col-12"
      :options                ="entregas"
      :loading                ="loading.metodoEntrega"
      @select                 ="editarMetodoEntrega"
    />
    <!-- //* ///////////////////////////////////////////////// Tiempo entrega -->
    <select-label-value
      v-model                 ="acuerdo.tiempoEntrega"
      label                   ="Tiempo de entrega"
      icon                    ="mdi-calendar-check"
      class                   ="col-md-6 col-12"
      :options                ="tiempoEntrega"
      :loading                ="loading.tiempoEntrega"
      @select                 ="editarTiempoEntrega"
    />
  </ventana>
</template>
<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'  
  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlAcuerdo  } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  dexieCondicionesPago,
            dexieFormasPago,
            dexieMetodosEntrega,
            dexieTiemposEntrega   } from "src/services/useDexie"
  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    inputFecha              from "components/utilidades/input/InputFecha.vue"
  import    selectLabelValue        from "components/utilidades/select/SelectLabelValue.vue"
  import    fechaVencimiento        from "src/areas/acuerdos/components/tools/FechaValidezCtz.vue"

  const { acuerdo, loading        } = storeToRefs( useStoreAcuerdo() )
  //* //////////////////////      ///////////////////////////////////////// Tablas Dexie
  const condicPago                  = dexieCondicionesPago()
  const formadPago                  = dexieFormasPago()
  const entregas                    = dexieMetodosEntrega()
  const tiempoEntrega               = dexieTiemposEntrega()
  const { editarTiempoEntrega,
          editarMetodoEntrega,
          editarFormaPago,
          editarCondicionPago,
          editarFechaEntrega,
          editarFechaFinValidez
                                  } = useControlAcuerdo()
</script>