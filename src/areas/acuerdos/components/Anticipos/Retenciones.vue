<template>
  <div
    class   ="text-1_1em text-right fuente-mono"
    style   ="width: 700px;"
    >
    <table style="width:100%">
      <tr>
        <td>
          <b>Total:</b>
          <div>{{ formatoPrecio (  modelValue.total ) }}</div>
          <div>{{ formatoPrecio (  modelValue.saldo ) }}</div>
        </td>      
        <td>
          <b>ReteF</b>
          <div>{{ formatoPrecio (  modelValue.aPagarReteFuente ) }}</div>
          <div>{{ formatoPrecio (  modelValue.saldoReteFuente ) }}</div>
        </td>
        <td>
          <b>ReteF + ReteIVA</b>
          <div>{{ formatoPrecio (  modelValue.aPagarReteIVA ) }}</div>
          <div>{{ formatoPrecio (  modelValue.saldoReteIVA ) }}</div>
        </td>
      </tr>
      <tr>
        <td>
          <b>ReteF + ReteICA 11.04</b>
          <div>{{ formatoPrecio (  modelValue.aPagarReteICA_11 ) }}</div>
          <div>{{ formatoPrecio (  modelValue.saldoReteICA_11 ) }}</div>
        </td>
        <td>
          <b>ReteF + ReteICA 9.6</b>
          <div>{{ formatoPrecio (  modelValue.aPagarReteICA_9 ) }}</div>
          <div>{{ formatoPrecio (  modelValue.saldoReteICA_9 ) }}</div>
        </td>
        <td>
          <b>ReteF + ReteICA 6.9</b>
          <div>{{ formatoPrecio (   modelValue.aPagarReteICA_6 ) }}</div>
          <div>{{ formatoPrecio (   modelValue.saldoReteICA_6 ) }}</div>	
        </td>
      </tr>      
      <tr>
        <td>
          <b>ReteF + ReteIVA + ReteICA 11.04</b>          
          <div>{{ formatoPrecio (  modelValue.aPagarReteICA_11_IVA ) }}</div>
          <div>{{ formatoPrecio (  modelValue.saldoReteICA_11_IVA ) }}</div>
        </td>
        <td>
          <b>ReteF + ReteIVA + ReteICA 9.6</b>
          <div>{{ formatoPrecio (  modelValue.aPagarReteICA_9_IVA ) }}</div>
          <div>{{ formatoPrecio (  modelValue.saldoReteICA_9_IVA ) }}</div>
        </td>
        <td>
          <b>ReteF + ReteIVA + ReteICA 6.9</b>
          <div>{{ formatoPrecio (  modelValue.aPagarReteICA_6_IVA ) }}</div>
          <div>{{ formatoPrecio (  modelValue.saldoReteICA_6_IVA ) }}</div>
        </td>
      </tr>
    </table>
  </div>    
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  PropType        } from "vue"
  import {  IRetenciones    } from "src/areas/acuerdos/models/Retenciones"
  import {  formatoPrecio   } from "src/composables/useTools" 

  const props                 = defineProps({      
    modelValue: { required: true,  type: Object as PropType< IRetenciones >  },
  })

  
</script>
<style>
b {
  font-size: 0.9em;
  font-family: Arial, Helvetica, sans-serif;
}
</style>