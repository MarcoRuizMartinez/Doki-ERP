<template>
  <ventana                    minimizar
    titulo                    ="Condiciones"
    icono                     ="mdi-handshake"
    :cargando                 ="!acuerdo.tercero.id && !acuerdo.esNuevo"
    class-contenido           ="q-col-gutter-sm items-start"
    >
    <!-- //* ///////////////////////////////////////////////// Fecha Creacion -->
    <input-fecha              readonly
      v-if                    ="!acuerdo.esNuevo && !acuerdo.esPedido && !acuerdo.esEntrega"
      v-model                 ="acuerdo.fechaCreacion"
      label                   ="Fecha creación"
      class                   ="col-md-6 col-12"
    />
    <!-- //* ///////////////////////////////////////////////// Fecha Validacion -->
    <input-fecha              readonly
      v-if                    ="!acuerdo.esNuevo && !acuerdo.esPedido && !acuerdo.esEntrega"
      v-model                 ="acuerdo.fechaValidacion"
      label                   ="Fecha validación"
      class                   ="col-md-6 col-12"
    />
    <!-- //* ///////////////////////////////////////////////// Fecha Fin de validez -->
    <fecha-vencimiento
      v-if                    ="acuerdo.esCotizacion"
      v-model                 ="acuerdo.fechaFinValidez"
      class                   ="col-md-6 col-12"
      :dias                   ="acuerdo.diasValidez"
      :nuevo                  ="acuerdo.esNuevo"
      :loading                ="loading.fechaFinValidez"
      @update:model-value     ="editarFechaFinValidez"
    />
    <!-- //* ///////////////////////////////////////////////// Contacto entrega -->
    <select-contacto          tipo-entrega
      v-if                    ="acuerdo.esEntrega || (!acuerdo.esNuevo && acuerdo.esPedido && !acuerdo.tercero.esEmpresa)"
      class                   ="col-12"
      v-model:contacto        ="acuerdo.contactoEntrega"
      label                   ="Contacto entrega"
      icon                    ="mdi-truck-delivery"
      :quitar-contacto        ="!acuerdo.esEntrega"
      :tercero                ="acuerdo.tercero"
      :disable                ="!acuerdo.tercero.id"
      @contacto-nuevo         =" c => vincularContactoAcuerdo           ( c,        TIPOS_CONTACTO.ENTREGA  )"
      @quitar-contacto        =" c => desvincularContactoAcuerdo        ( c.id,     TIPOS_CONTACTO.ENTREGA, true)"
      @contacto-cambio        ="( c, idOld ) => cambiarContactoAcuerdo  ( c, idOld, TIPOS_CONTACTO.ENTREGA  )"
      @update:contacto        ="editarDatosEntregaSistemaViejo"
    />
    <!-- //* ///////////////////////////////////////////////// Fecha entrega -->
    <input-fecha              no-pasado
      v-model                 ="acuerdo.fechaEntrega"
      label                   ="Fecha compromiso"
      titulo                  ="Fecha compromiso entrega"
      class                   ="col-md-6 col-12"
      error-message           ="Es necesaria una fecha de entrega"
      :error                  ="errorFecha"
      :loading                ="loading.fechaEntrega"
      @update:model-value     ="editarFechaEntrega"
    />
    <!-- //* ///////////////////////////////////////////////// Condiciones pago -->
    <select-label-value
      v-if                    ="acuerdo.esNuevo || (!acuerdo.esPedido && !acuerdo.esEntrega)"
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
      v-if                    ="!acuerdo.esPedido && !acuerdo.esEntrega"
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
      error-message           ="Indique un método de entrega"
      :error                  ="errorMetodo"
      :options                ="entregas"
      :loading                ="loading.metodoEntrega"
      @select                 ="editarMetodoEntrega"
    />
    <!-- //* ///////////////////////////////////////////////// Tiempo entrega -->
    <select-label-value       clearable 
      v-if                    ="acuerdo.esCotizacion"
      v-model                 ="acuerdo.tiempoEntrega"
      label                   ="Tiempo de entrega"
      icon                    ="mdi-calendar-check"
      class                   ="col-md-6 col-12"
      :options                ="tiempoEntrega"
      :loading                ="loading.tiempoEntrega"
      @select                 ="editarTiempoEntrega"
    />
    <div
      v-if                    ="(acuerdo.esPedido || acuerdo.esEntrega) && !!acuerdo.contactoEntrega.id"
      class                   ="col-12"
      >
      <tabla-envio/>
    </div>
  </ventana>
</template>
<script setup lang="ts">
  //* ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref                   } from "vue"
  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'  
  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlAcuerdo  } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  dexieCondicionesPago,
            dexieFormasPago,
            dexieBodegas,
            dexieMetodosEntrega,
            dexieTiemposEntrega   } from "src/services/useDexie"
  import {  TIPOS_CONTACTO        } from "src/areas/terceros/models/Contacto"  
  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    inputFecha              from "components/utilidades/input/InputFecha.vue"
  import    selectLabelValue        from "components/utilidades/select/SelectLabelValue.vue"
  import    fechaVencimiento        from "src/areas/acuerdos/components/tools/FechaValidezCtz.vue"
  import    selectContacto          from "src/areas/terceros/components/contactos/SelectContacto.vue"
  import    tablaEnvio              from "src/areas/acuerdos/components/tools/TablaEnvio.vue"                                          
import { boolean } from 'yargs'

  const { acuerdo, loading        } = storeToRefs( useStoreAcuerdo() )
  //* //////////////////////      ///////////////////////////////////////// Tablas Dexie
  const condicPago                  = dexieCondicionesPago()
  const formadPago                  = dexieFormasPago()
  const entregas                    = dexieMetodosEntrega()
  const bodegas                     = dexieBodegas()
  const tiempoEntrega               = dexieTiemposEntrega()
  const { editarTiempoEntrega,
          editarMetodoEntrega,
          editarFormaPago,
          editarCondicionPago,
          editarFechaEntrega,
          editarFechaFinValidez,
          cambiarContactoAcuerdo,
          vincularContactoAcuerdo,
          desvincularContactoAcuerdo,
          editarDatosEntregaSistemaViejo
                                  } = useControlAcuerdo()

  const errorFecha                  = ref<boolean>(false)
  const errorMetodo                 = ref<boolean>(false)

  defineExpose({  validar })  

  function validar() : boolean
  {
    errorFecha.value  = !acuerdo.value.fechaEntrega
    errorMetodo.value = !acuerdo.value.metodoEntrega.id
    return !errorFecha.value && !errorMetodo.value
  }

</script>