<template>
  <div class          ="row fuente-mono width180">
    <btn-productos
      :pedido         ="modelValue"
    />
    <btn-pagos
      :pedido         ="modelValue"
      @click          ="emit('vistaPago', modelValue)"
    />
    <!-- //* //////// Vista Rapida -->
    <q-btn           
      v-bind          ="style.btnRedondoFlat"
      icon            ="mdi-eye"
      :style          ="`color:${modelValue.estadoColor};`"
      @click          ="emit('vistaRapida', modelValue)"
      >
      <Tooltip :label ="modelValue.estado"/>
    </q-btn>
    <!-- //* //////// Ref -->
    <span
      v-if            ="!modelValue.idPedido"
      class           ="pa"
      >
      {{ modelValue.id }}
    </span>
    <div v-else>
      <router-link
        class         ="link-limpio"
        :to           ="'/pedidos/cliente/' + modelValue.idPedido"
        >
        {{ modelValue.id }}
      </router-link>
      <q-btn
        v-bind        ="style.btnRedondoFlat"
        size          ="12px"
        icon          ="mdi-open-in-new"
        target        ="_blank"
        :href         ="'pedidos/cliente/' + modelValue.idPedido"
      />      
    </div>
  </div>
</template>
<script lang="ts" setup>
  import {  PropType          } from "vue"  
  import {  IPedidoWoo        } from "src/areas/acuerdos/models/PedidoWoo"      
  import {  style             } from "src/useSimpleOk/useEstilos"          
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