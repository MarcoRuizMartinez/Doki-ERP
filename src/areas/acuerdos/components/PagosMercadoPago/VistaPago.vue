<script lang="ts" setup>
  import {  PropType          } from "vue"
  import {  IMercadoPago      } from "src/areas/acuerdos/models/PagoMercadoPago"
  import {  Format,
            ToolDate          } from "src/composables/useTools"
  ////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana             from "components/utilidades/Ventana.vue"
  import    item                from "components/utilidades/TrTdTd.vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  const { pago }            = defineProps({
    pago: { required: true, type: Object as PropType< IMercadoPago > },
  })

</script>

<template>
  <ventana                  cerrar
    titulo                  ="Datos de pago MercadoPago"
    icono                   ="mdi-credit-card-outline"
    min-width               ="450px"
    class-contenido         ="column gap-sm"
    class-menu              ="c-menu"
    padding-contenido       ="0"
    >
    <table class            ="tabla-prop">
      <tbody>
        <item titulo="ID"                         :label="pago.id"  class="text-bold" copiar />
        <item titulo="Ref"                        :label="pago.ref" copiar />
        <item titulo="Fecha"                      :label="ToolDate.fechaYHora( pago.fechaCreado )"/>
        <item titulo="Fecha aprobado"             :label="ToolDate.fechaYHora( pago.fechaAprobado )" v-if="pago.aprobado"/>
        <item titulo="Estado"                     :label="`${pago.estado} ${pago.estadoDetalles}`" class="text-bold text-capitalize"  :class-label="'text-'+pago.estadoColor"/>
        <item titulo="Tipo pago"                  :label="`${pago.metodo} - ${pago.tipoPago}`" class="text-uppercase"/>
        <item :titulo="`Pagado ${pago.moneda}`"   :label="Format.precio( pago.total, 'decimales-no' )" :class-label="'text-bold fuente-mono text-'+pago.estadoColor" copiar />
        <item :titulo="`Recibido ${pago.moneda}`" :label="Format.precio( pago.totalRecibido, 'decimales-no' )" class-label="fuente-mono"/>
        <item titulo="Descripción"                :label="pago.descripcion"/>
        <item titulo="Nombre"                     :label="pago.nombreCompleto" class="text-capitalize" copiar/>
        <item titulo="Usuario MP"                 :label="`${pago.usuarioRegistrado} ${pago.usuarioCorreo}`" class="text-capitalize"/>
        <item titulo="Documento"                  :label="pago.documento" copiar/>
        <item titulo="Correo"                     :label="pago.correo" copiar/>
        <item titulo="Teléfono"                   :label="pago.telefono" copiar/>
        <item titulo="Direccion"                  :label="pago.direccion" copiar/>
      </tbody>
    </table>
  </ventana>
</template>

<style>
  .c-menu{
    padding: 0px !important;
    margin: 0px !important;
  }
</style>
