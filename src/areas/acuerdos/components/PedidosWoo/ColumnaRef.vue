<template>
  <div class          ="row fuente-mono width280">
    <btn-productos
      :pedido         ="modelValue"
    />
    <btn-pagos
      :pedido         ="modelValue"
      @click          ="emit('vistaPago', modelValue)"
    />
    <!-- //* //////// Vista Rapida -->
    <q-btn           
      v-bind          ="style.btnRedondoFlatMd"
      icon            ="mdi-eye"
      :style          ="`color:${modelValue.estadoColor};`"
      @click          ="emit('vistaRapida', modelValue)"
      >
      <Tooltip :label ="modelValue.estado"/>
    </q-btn>
    <!-- //* //////// Ir a tienda-->
    <q-btn           
      v-bind          ="style.btnRedondoFlatMd"
      icon            ="mdi-cart-outline"
      color           ="grey-7"
      target          ="_blank"
      :href           ="modelValue.url"
      >
      <Tooltip label  ="Ver pedido en tienda"/>
    </q-btn>    
    <!-- //* //////// Ref -->
    <div
      v-if            ="!modelValue.idPedido"
      class           ="pa row items-center"
      >      
      {{ modelValue.id }}
      <div
        v-if          ="modelValue.hayPagoSinPedido"
        class         ="q-ml-sm"
        >
        <q-icon
          name        ="mdi-alert"
          size        ="sm"
          color       ="warning"
          class       ="width20"
          >
          <Tooltip>No se ha creado el pedido y hay pago</Tooltip>
        </q-icon>
      </div>
    </div>
    <div v-else>
      <router-link
        class         ="link-limpio"
        :to           ="'/pedidos/cliente/' + modelValue.idPedido"
        >
        {{ modelValue.id }}
      </router-link>
      <q-btn
        v-bind        ="style.btnRedondoFlatMd"
        size          ="12px"
        icon          ="mdi-open-in-new"
        target        ="_blank"
        :to           ="'/pedidos/cliente/' + modelValue.idPedido"
      />      
    </div>
  </div>
</template>
<script lang="ts" setup>
  import {  PropType          } from "vue"  
  import {  IPedidoWoo        } from "src/areas/acuerdos/models/PedidoWoo"      
  import {  style             } from "src/composables/useEstilos"          
  import    btnProductos        from "./BtnProductos.vue"
  import    btnPagos            from "./BtnPago.vue"

  const props               = defineProps({
    modelValue: { required: true, type: Object as PropType< IPedidoWoo > },      
  })
  const emit = defineEmits<{
    (e: 'vistaRapida',  value: IPedidoWoo ): void
    (e: 'vistaPago',    value: IPedidoWoo ): void
  }>()    
</script>
<style>
  .pa{ padding-left: 6px; padding-top: 3px;}
</style>