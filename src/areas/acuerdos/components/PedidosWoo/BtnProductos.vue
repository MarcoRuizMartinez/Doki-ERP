<template>
  <q-btn
    v-bind            ="style.btnRedondoFlat"
    icon              ="mdi-package-variant-closed"
    >
    <Tooltip>
      <div class      ="column">
        <div
          v-for       ="(producto, index) of pedido.line_items"
          :key        ="index"
          class       ="col"
          >
          <span class ="text-white">{{producto.quantity}} x {{producto.name}}</span>
        </div>
      </div>
    </Tooltip>
  </q-btn>
</template>
<script lang="ts" setup>
  import {  PropType          } from "vue"  
  import {  IPedidoWoo        } from "src/areas/acuerdos/models/PedidoWoo"      
  import {  style             } from "src/useSimpleOk/useEstilos"
  const props               = defineProps({
    pedido: { required: true, type: Object as PropType< IPedidoWoo > },      
  })
</script>