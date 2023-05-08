<template>
  <ventana                  cerrar
    titulo                  ="Datos de pedido y envío"
    icono                   ="mdi-store"    
    min-width               ="450px"
    class-contenido         ="column gap-sm"
    padding-contenido       ="0"
    >
    <template               #barra>
      <!-- //* ///////////////////////////////////////////////////////////// Boton nuevo grupo   -->
      <q-btn
        v-if                ="!modelValue.idPedido"
        v-bind              ="style.btnBaseSm"
        label               ="Crear"
        color               ="positive"
        icon                ="mdi-plus"
        target              ="_blank"
        href                ="/pedidos/cliente/crear"
      />
    </template>
    <table class            ="tabla-prop">
      <!-- <thead><tr><th></th><th>Datos de envío</th></tr></thead> -->
      <tbody>
        <item titulo="Estado"             :label="modelValue.estado" class="text-bold" :style-label="`color:${modelValue.estadoColor};`"/>
        <item titulo="Cuidado"            label="Datos de envio y factura diferentes ⚠️" v-if="modelValue.enOtraDireccion"/>
        <item titulo="Nombre"             :label="modelValue.nombre" copiar/>
        <item titulo="Nombre envío"       :label="modelValue.nombreEnvio" v-if="modelValue.enOtraDireccion" copiar/>
        <item titulo="Municipio"          :label="modelValue.municipioEnvio"/>
        <item titulo="Dirección envío"    :label="modelValue.direccionEnvio" copiar/>
        <item titulo="Teléfono"           :label="modelValue.telefonos" copiar/>
        <item titulo="Correo"             :label="modelValue.billing.email" copiar/>
        <item titulo="Nota:⚠️"            :label="modelValue.customer_note" class-label="td-descripcion text-bold" v-if="!!modelValue.customer_note" copiar/>
        <item titulo="Calificación"       :label="modelValue.calificacion" v-if="!!modelValue.calificacion"/>
        <item titulo=""                   label="PRODUCTOS" class="text-bold"/>
        <tr
          v-for     ="(item, index) of modelValue.line_items"
          :key      ="index"
          >
          <td>
            {{item.sku}}<br/>
            Cantidad: {{item.quantity}}
          </td>
          <td>
            {{item.name}}<br/>
            <div class    ="row">
              <span class ="col-2">Unidad:</span>
              <span class ="col text-right">{{ formatoPrecio( item.price, 'decimales-no'  ) }} antes de IVA</span>
            </div>
            <div class    ="row">
              <span class ="col-2">Total:</span>
              <span class ="col text-right">{{ formatoPrecio( item.total, 'decimales-no'  ) }} antes de IVA</span>
            </div>
          </td>
        </tr>
        <item titulo="Total" :label="formatoPrecio( modelValue.total, 'decimales-no')" class="text-bold"/>
        
      </tbody>
    </table>
  </ventana>
</template>
<script lang="ts" setup>
  import {  PropType          } from "vue"  
  import {  IPedidoWoo        } from "src/areas/acuerdos/models/PedidoWoo"      
  import {  style             } from "src/useSimpleOk/useEstilos"
  import {  formatoPrecio       } from "src/useSimpleOk/useTools"
  ////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"  
  import    item                from "components/utilidades/TrTdTd.vue"  

  const props               = defineProps({
    modelValue: { required: true, type: Object as PropType< IPedidoWoo > },      
  })
</script>
<style>
  .pa{ padding-left: 6px; }

  .td-descripcion{
    display: block;
    font-style: italic;
    margin-top: 0px;
  }
</style>