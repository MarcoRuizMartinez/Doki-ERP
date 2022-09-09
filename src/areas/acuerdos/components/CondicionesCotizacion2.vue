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
      :loading                ="cargarFechaFinValidez"
      @update:model-value     ="editarFechaFinValidez"
    />
    <!-- //* ///////////////////////////////////////////////// Fecha entrega -->
    <input-fecha              no-pasado
      v-model                 ="acuerdo.fechaEntrega"
      label                   ="Fecha entrega"
      titulo                  ="Fecha entrega"
      class                   ="col-md-6 col-12"
      :loading                ="cargarFechaEntrega"
      @update:model-value     ="editarFechaEntrega"
    />
    <!-- //* ///////////////////////////////////////////////// Condiciones pago -->
    <select-label-value
      v-model                 ="acuerdo.condicionPago"
      label                   ="Condiciones de pago"
      icon                    ="mdi-account-cash"
      class                   ="col-md-6 col-12"
      defecto                 ="Anticipo 100%"
      :options                ="condicPago"
      :loading                ="cargarCondicionPago"
      @select                 ="editarCondicionPago"
    />
    <!-- //* ///////////////////////////////////////////////// Forma de pago -->
    <select-label-value
      v-model                 ="acuerdo.formaPago"
      label                   ="Forma de pago"
      icon                    ="mdi-cash-refund"
      class                   ="col-md-6 col-12"
      :options                ="formadPago"
      :loading                ="cargarFormaPago"
      @select                 ="editarFormaPago"
    />
    <!-- //* ///////////////////////////////////////////////// Metodo entrega -->
    <select-label-value
      v-model                 ="acuerdo.metodoEntrega"
      label                   ="Método de entrega"
      icon                    ="mdi-truck-delivery"
      class                   ="col-md-6 col-12"
      :options                ="entregas"
      :loading                ="cargarMetodoEntrega"
      @select                 ="editarMetodoEntrega"
    />
    <!-- //* ///////////////////////////////////////////////// Tiempo entrega -->
    <select-label-value
      v-model                 ="acuerdo.tiempoEntrega"
      label                   ="Tiempo de entrega"
      icon                    ="mdi-calendar-check"
      class                   ="col-md-6 col-12"
      :options                ="tiempoEntreg"
      :loading                ="cargarTiempoEntrega"
      @select                 ="editarTiempoEntrega"
    />
  </ventana>
</template>
<script setup lang="ts">
//Condiciones de pago
//Forma de pago
//Método de entrega
  import    ventana             from "components/utilidades/Ventana.vue"
  import    inputFecha          from "src/components/utilidades/input/InputFecha.vue"
  import    fechaVencimiento    from "src/areas/acuerdos/cotizaciones/components/tools/FechaValidezCtz.vue"
  import    selectLabelValue    from "components/utilidades/select/SelectLabelValue.vue"

  import {  ref               } from "vue"
  import {  ITercero,
            Tercero           } from "src/areas/terceros/models/Tercero"
  import {  servicesCotizaciones   } from "src/areas/acuerdos/cotizaciones/services/servicesCotizaciones"
  import {  useDexie, TABLAS  } from "src/services/useDexie"
  import {  useTools          } from "src/useSimpleOk/useTools"
  import {  ICondicionPago    } from "src/models/Diccionarios/CondicionPago"
  import {  IFormaPago        } from "src/models/Diccionarios/FormaPago"
  import {  IMetodoEntrega    } from "src/models/Diccionarios/MetodoEntrega"
  import {  ITiempoEntrega    } from "src/models/Diccionarios/TiempoEntrega"
  import {  IAcuerdo          } from "src/areas/acuerdos/models/Acuerdo"
  import {  storeToRefs       } from 'pinia'                            
  import {  useStoreAcuerdo   } from 'src/stores/acuerdo'  

  const storeAcuerdo          = useStoreAcuerdo()
  const { acuerdo           } = storeToRefs(storeAcuerdo)  
  const terceros                = ref< ITercero[] > ([])
  const { aviso               } = useTools()
  const { setFechaFinValidez,
          setFechaEntrega,
          setCondicionPago,
          setFormaPago,
          setMetodoEntrega,
          setTiempoEntrega,
                              } = servicesCotizaciones()
  //* /////////////////////////////////////////////////////////////// Define Emits
  const emit                  = defineEmits<{
    (e: 'update:cotizacion',  value: IAcuerdo ): void
  }>()
  
  
  //* /////////////////////////////////////////////////////////////// Tablas Dexie
  const { lista : condicPago  } = useDexie( TABLAS.CONDICION_PAGO )
  const { lista : formadPago  } = useDexie( TABLAS.FORMA_PAGO     )
  const { lista : entregas    } = useDexie( TABLAS.METODO_ENTREGA )
  const { lista : tiempoEntreg} = useDexie( TABLAS.TIEMPO_ENTREGA )

  //* /////////////////////////////////////////////////////////////// Cargadores  
  const cargarFechaFinValidez   = ref< boolean >( false )
  const cargarFechaEntrega      = ref< boolean >( false )
  const cargarCondicionPago     = ref< boolean >( false )
  const cargarFormaPago         = ref< boolean >( false )
  const cargarMetodoEntrega     = ref< boolean >( false )
  const cargarTiempoEntrega     = ref< boolean >( false )

  //* /////////////////////////////////////////////////////////////// Editar fecha validez
  async function editarFechaFinValidez( fecha : Date )
  {
    if(acuerdo.value.esNuevo) return
    
    cargarFechaFinValidez.value = true
    let ok                      = await setFechaFinValidez( acuerdo.value.id, acuerdo.value.fechaFinValidez )
    if (ok) aviso("positive", "Fecha cambiada", "clock" )
    cargarFechaFinValidez.value = false
  }

  //* /////////////////////////////////////////////////////////////// Editar fecha entrega
  async function editarFechaEntrega( fecha : Date )
  {
    if(acuerdo.value.esNuevo) return

    cargarFechaEntrega.value    = true
    let ok                      = await setFechaEntrega( acuerdo.value.id, acuerdo.value.fechaEntrega )
    if (ok) aviso("positive", "Fecha cambiada editarFechaEntrega", "clock" )
    cargarFechaEntrega.value    = false
  }
  
  //* /////////////////////////////////////////////////////////////// Editar condiciones de pago
  async function editarCondicionPago( condicion : ICondicionPago )
  {
    if(acuerdo.value.esNuevo) return

    cargarCondicionPago.value   = true
    let ok                      = await setCondicionPago( acuerdo.value.id, condicion.id )
    if (ok) aviso("positive", "Condición de pago cambiada" )
    cargarCondicionPago.value   = false
  }

  //* /////////////////////////////////////////////////////////////// Editar forma de pago
  async function editarFormaPago( forma : IFormaPago )
  {
    if(acuerdo.value.esNuevo) return

    cargarFormaPago.value       = true
    let ok                      = await setFormaPago( acuerdo.value.id, forma.id )
    if (ok) aviso("positive", "Forma de pago cambiada" )
    cargarFormaPago.value       = false
  }    

  //* /////////////////////////////////////////////////////////////// Editar metodo de entrega
  async function editarMetodoEntrega( metodo : IMetodoEntrega )
  {
    if(acuerdo.value.esNuevo) return

    cargarMetodoEntrega.value       = true
    let ok                          = await setMetodoEntrega( acuerdo.value.id, metodo.id )
    if (ok) aviso("positive", "Método de entrega cambiado" )
    cargarMetodoEntrega.value       = false
  }    

  //* /////////////////////////////////////////////////////////////// Editar tiempo de entrega
  async function editarTiempoEntrega( tiempo : ITiempoEntrega )
  {
    if(acuerdo.value.esNuevo) return

    cargarTiempoEntrega.value       = true
    let ok                          = await setTiempoEntrega( acuerdo.value.id, tiempo.id )
    if (ok) aviso("positive", "Tiempo de entrega cambiado" )
    cargarTiempoEntrega.value       = false
  }
</script>