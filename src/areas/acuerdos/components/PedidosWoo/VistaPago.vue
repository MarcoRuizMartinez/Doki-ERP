<template>
  <ventana                  cerrar
    titulo                  ="Datos de pago MercadoPago"
    icono                   ="mdi-credit-card-outline"    
    min-width               ="450px"
    class-contenido         ="column gap-sm"
    class-menu              ="c-menu"
    padding-contenido       ="0"
    >
    <template               #menu
      v-if                  ="modelValue.pagos.length >= 2"
      >
      <q-tabs               dense no-caps
        v-model             ="boton"
        class               ="full-width"
        >
        <q-tab
          v-for             ="(item, index) of modelValue.pagos"
          :key              ="index"
          :name             ="index.toString()"
          :label            ="'Pago ' + (index + 1)"
        />
      </q-tabs>
    </template>
    <table class            ="tabla-prop">
      <tbody>
        <item titulo="ID"                         :label="pago.id" class="text-bold" copiar />
        <item titulo="Ref pedido tienda"          :label="modelValue.id" class="text-bold" copiar />
        <item titulo="Estado"                     :label="`${pago.estado} ${pago.estadoDetalles}`" class="text-bold text-capitalize"  :class-label="'text-'+pago.estadoColor"/>
        <item titulo="Tipo pago"                  :label="`${pago.metodo} - ${pago.tipoPago}`" class="text-uppercase"/>
        <item :titulo="`Pagado ${pago.moneda}`"   :label="formatoPrecio( pago.total, 'decimales-no' )" :class-label="'text-bold fuente-mono text-'+pago.estadoColor" copiar />
        <item :titulo="`Recibido ${pago.moneda}`" :label="formatoPrecio( pago.totalRecibido, 'decimales-no' )" class-label="fuente-mono"/>
        <item titulo="Descripción"                :label="pago.descripcion"/>
        <item titulo="Nombre"                     :label="pago.nombreCompleto" class="text-capitalize" copiar/>
        <item titulo="Usuario MP"                 :label="`${pago.usuarioRegistrado} ${pago.usuarioCorreo}`" class="text-capitalize"/>
        <item titulo="Documento"                  :label="pago.documento" copiar/>
        <item titulo="Correo"                     :label="pago.correo" copiar/>
        <item titulo="Teléfono"                   :label="pago.telefono" copiar/>
        <item titulo="Direccion"                  :label="pago.direccion" copiar/>
        <item titulo="Fecha aprobado"             :label="fechaCorta(pago.fechaAprobado)"/>
      </tbody>
    </table>
  </ventana>
</template>
<script lang="ts" setup>
  import {  ref, 
            toRefs,
            PropType,
            computed          } from "vue"  
  import {  IPedidoWoo        } from "src/areas/acuerdos/models/PedidoWoo"      
  import {  formatoPrecio,
            fechaCorta        } from "src/useSimpleOk/useTools"
  ////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana             from "components/utilidades/Ventana.vue"  
  import    item                from "components/utilidades/TrTdTd.vue"  
  // * /////////////////////////////////////////////////////////////////////// Store
  const props               = defineProps({
    modelValue: { required: true, type: Object as PropType< IPedidoWoo > },      
  })
  const { modelValue }      = toRefs( props )
  const boton               = ref<string>("0")
  const pago                = computed(()=> modelValue.value.pagos[ parseInt( boton.value ) ] )
</script>
<style>
  .c-menu{
    padding: 0px !important;
    margin: 0px !important;
  }
</style>