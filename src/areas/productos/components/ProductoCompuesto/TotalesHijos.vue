<template>
  <div class              ="text-bold text-grey-8" >
    <table style          ="line-height: 1.1;">
      <tr   class         ="text-center">
        <td>Costo:</td>
        <td><span class   ="fuente-mono text-orange-10">{{ Format.precio( totalCompra, "decimales-no" ) }}</span></td>
      </tr>
      <tr   class="text-center">
        <td >Valor:</td>
        <td ><span class   ="fuente-mono text-light-green-10">{{ Format.precio( totalVenta, "decimales-no" ) }}</span></td>
      </tr>              
    </table>    
  </div>
</template>

<script setup lang="ts">
  import { Format } from "src/composables/useTools"

  type TProps = {
    totalCompra : number
    totalVenta  : number
  }

  const { totalCompra, totalVenta  } = defineProps<TProps>()
</script>