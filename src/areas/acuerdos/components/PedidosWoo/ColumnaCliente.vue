<template>
  <div class          ="row">
    <div class        ="col-1 q-mr-sm text-right">
      <q-icon
        v-if          ="modelValue.estadoCliente == '🖐🏻'"        
        name          ="mdi-power-off"
      />
      <q-icon
        v-else-if     ="modelValue.estadoCliente == '🔎'"
        class         ="mdi-loading"
        name          ="mdi-spin"
      />
      <q-btn
        v-else-if     ="modelValue.estadoCliente == '✖️'"
        v-bind        ="style.btnRedondoFlat"
        color         ="green"        
        icon          ="mdi-plus-circle"
        @click        ="emit('crearTercero', modelValue)"
      />      
      <q-btn
        v-else-if     ="modelValue.estadoCliente == '✅'"
        v-bind        ="style.btnRedondoFlat"
        size          ="12px"
        icon          ="mdi-open-in-new"
        target        ="_blank"
        :href         ="'tercero/' + modelValue.idTercero"
      />      
    </div>
    <div class        ="col text-bold q-ml-xs">
      <router-link
        v-if          ="!!modelValue.idTercero"
        class         ="link-limpio"
        :to           ="'/tercero/' + modelValue.idTercero"
        >
        {{ modelValue.nombre }}
      </router-link>
      <span v-else
        class         ="text-grey-9 pa"
        >
        {{ modelValue.nombre }}
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import {  PropType          } from "vue"  
  import {  IPedidoWoo        } from "src/areas/acuerdos/models/PedidoWoo"      
  import {  style             } from "src/useSimpleOk/useEstilos"            
  // * /////////////////////////////////////////////////////////////////////// Store
  const props               = defineProps({
    modelValue: { required: true, type: Object as PropType< IPedidoWoo > },      
  })
  const emit = defineEmits<{
    (e: 'crearTercero', value: IPedidoWoo ): void
  }>()  
</script>
<style>
  .pa{ padding-left: 6px; }
</style>