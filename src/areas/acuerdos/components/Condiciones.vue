<template>
  <ventana                    minimizar
    titulo                    ="Condiciones"
    icono                     ="mdi-handshake"
    :cargando                 ="!acuerdo.tercero.id && !acuerdo.esNuevo"
    class-contenido           ="q-col-gutter-sm items-start"
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
      v-if                    ="acuerdo.esCotizacion"
      v-model                 ="acuerdo.fechaFinValidez"
      class                   ="col-md-6 col-12"
      :dias                   ="acuerdo.diasValidez"
      :nuevo                  ="acuerdo.esNuevo"
      :loading                ="loading.fechaFinValidez"
      @update:model-value     ="editarFechaFinValidez"
    />
    <!-- //* ///////////////////////////////////////////////// Contacto entrega -->
    <select-contacto          quitar-contacto tipo-entrega
      v-if                    ="acuerdo.esPedido && !acuerdo.tercero.esEmpresa"
      class                   ="col-12"
      v-model:contacto        ="acuerdo.contactoEntrega"
      label                   ="Contacto entrega"
      icon                    ="mdi-truck-delivery"
      :tercero                ="acuerdo.tercero"
      :disable                ="!acuerdo.tercero.id"
      @contacto-nuevo         =" c => vincularContactoAcuerdo           ( c,        TIPOS_CONTACTO.ENTREGA  )"
      @quitar-contacto        =" c => desvincularContactoAcuerdo        ( c.id,     TIPOS_CONTACTO.ENTREGA, true  )"
      @contacto-cambio        =" ( c, idOld ) => cambiarContactoAcuerdo ( c, idOld, TIPOS_CONTACTO.ENTREGA  )"
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
      v-if                    ="!acuerdo.esPedido || acuerdo.esNuevo"
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
      v-if                    ="!acuerdo.esPedido"
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
      v-if                    ="acuerdo.esPedido && !!acuerdo.contactoEntrega.id"
      class                   ="col-12"
      >
      <table>
          <tbody>
            <tr>
              <td>Contacto:</td>
              <td class         ="text-bold fuente-mono">
                {{ acuerdo.contactoEntrega.nombreCompleto }}
                <span v-if="!!acuerdo.contactoEntrega.telefono">
                  - {{ acuerdo.contactoEntrega.telefono }}
                </span>
                <span v-if="!!acuerdo.contactoEntrega.telefono_2">
                  - {{ acuerdo.contactoEntrega.telefono_2 }}
                </span>
              </td>
            </tr>
            <tr>
              <td>Ciudad:</td>
              <td class         ="text-bold fuente-mono">
                {{ acuerdo.contactoEntrega.municipio.label }}
              </td>
            </tr>
            <tr>
              <td>Dirección:</td>
              <td class         ="text-bold fuente-mono">
                {{ acuerdo.contactoEntrega.direccion }}
              </td>
            </tr>
            <tr>
              <td>Indicaciones:</td>
              <td class         ="text-bold fuente-mono">
                {{ acuerdo.contactoEntrega.nota }}
              </td>
            </tr>
          </tbody>
        </table>
    </div>
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
  import {  TIPOS_CONTACTO        } from "src/areas/terceros/models/Contacto"  
  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    inputFecha              from "components/utilidades/input/InputFecha.vue"
  import    selectLabelValue        from "components/utilidades/select/SelectLabelValue.vue"
  import    fechaVencimiento        from "src/areas/acuerdos/components/tools/FechaValidezCtz.vue"
  import    selectContacto          from "src/areas/terceros/components/contactos/SelectContacto.vue"

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
          editarFechaFinValidez,
          cambiarContactoAcuerdo,
          vincularContactoAcuerdo,
          desvincularContactoAcuerdo,
                                  } = useControlAcuerdo()
</script>