<template>
  <ventana                  minimizar
    titulo                  ="Totalesss"
    icono                   ="mdi-counter"
    class-contenido         ="q-col-gutter-sm"
    >
    <div
      v-if                  ="!!acuerdo.id"
      class                 ="col-12 row">
      <!-- //* /////////////////////////////////////////////////////////////  Con Total -->
      <q-toggle             dense
        v-model             ="acuerdo.conTotal"
        label               ="Con Total"
        class               ="col-4"
        :icon               ="loading.conTotal ? 'mdi-loading mdi-spin' : ''"
        @update:model-value ="editarConTotal"
      />
      <!-- //* /////////////////////////////////////////////////////////////  Con IVA -->
      <q-toggle             dense
        v-model             ="acuerdo.conIVA"
        label               ="Con IVA"
        class               ="col-4"
        :icon               ="loading.conIVA ? 'mdi-loading mdi-spin' : ''"
        :disable            ="acuerdo.tercero.aplicaIVA || loading.conIVA " 
        @update:model-value ="editarConIVA"
      />
      <!-- //* /////////////////////////////////////////////////////////////  Con AIU -->
      <q-toggle             dense
        v-model             ="acuerdo.aiuOn"
        label               ="Con AIU"
        class               ="col-4"
        :icon               ="loading.conAIU ? 'mdi-loading mdi-spin' : ''"
        @update:model-value ="editarConAIU"
      />
    </div>
    <!-- //* ///////////////////////////////////////////////////////////// Valores AIUs -->
    <transition             enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown" mode="out-in">
      <div
        v-if                ="acuerdo.aiuOn"
        class               ="col-12 row q-col-gutter-sm"
        >
        <!-- //* ///////////////////////////////////////////////////////// AIU Administración -->
        <div class          ="col-4">
          <input-number     conDecimales
            v-model         ="acuerdo.aiuAdmin"
            label           ="Administración"
            :paso           ="0.1"
            @update:model-value="(valor)=> editarValorAIU(valor, 'aiuAdmin')"
          />
          <div  class       ="fuente-mono text-grey-8 text-center"
            >
            {{ formatoPrecio( acuerdo.aiuAdminValor ) }}
          </div>
        </div>
        <!-- //* ///////////////////////////////////////////////////////// AIU Imprevistos -->
        <div class          ="col-4">
          <input-number     conDecimales
            v-model         ="acuerdo.aiuImpre"
            label           ="Imprevistos"
            :paso           ="0.1"
            @update:model-value="(valor)=> editarValorAIU(valor, 'aiuImpre')"
          />
          <div  class       ="fuente-mono text-grey-8 text-center"
            >
            {{ formatoPrecio( acuerdo.aiuImpreValor ) }}
          </div>
        </div>
        <!-- //* ///////////////////////////////////////////////////////// AIU Utilidad -->
        <div class          ="col-4">
          <input-number     conDecimales
            v-model         ="acuerdo.aiuUtili"
            label           ="Utilidad"
            :paso           ="0.1"
            @update:model-value="(valor)=> editarValorAIU(valor, 'aiuUtili')"
          />
          <div  class       ="fuente-mono text-grey-8 text-center"
            >
            {{ formatoPrecio( acuerdo.aiuUtiliValor ) }}
          </div>          
        </div>
      </div>
    </transition>
    <!-- //* ///////////////////////////////////////////////////////////// Tabla totales -->
    <div        class       ="col-12">
      <div      class       ="row justify-center bg-grey-3 rounded-borders transi"
                :class      ="{ 'op40' : !acuerdo.conTotal } ">
        <table  class       ="tabla-totales">
          <tr>
            <td>Subtotal bruto:</td>
            <td>{{ formatoPrecio( acuerdo.totalSinDescu )}}</td>
          </tr>
          <tr>
            <td>Descuento:</td>
            <td>{{ formatoPrecio( acuerdo.descuentoValor )}}</td>
          </tr>
          <tr>
            <td>Subtotal neto:</td>
            <td>{{ formatoPrecio( acuerdo.totalConDescu )}}</td>
          </tr>
          <tr v-if="acuerdo.aiuOn">
            <td>AIU:</td>
            <td>{{ formatoPrecio( acuerdo.aiuTotal )}}</td>
          </tr>          
          <tr>
            <td>IVA:</td>
            <td>{{ formatoPrecio( acuerdo.ivaValor )}}</td>
          </tr>        
          <tr>
            <td>TOTAL:</td>
            <td>{{ formatoPrecio( acuerdo.totalConIva )}}</td>
          </tr>       
        </table>
      </div>
    </div>      
  </ventana>
</template>
<script setup lang="ts">
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'  
  import {  formatoPrecio         } from "src/useSimpleOk/useTools" 
  import {  useControlCotizacion  } from "src/areas/acuerdos/controllers/ControlCotizaciones"
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    inputNumber             from "src/components/utilidades/input/InputFormNumber.vue"

  const storeAcuerdo            = useStoreAcuerdo()
  const { acuerdo, loading    } = storeToRefs(storeAcuerdo)  
  const { editarConAIU,
          editarValorAIU,
          editarConTotal,
          editarConIVA,
                              } = useControlCotizacion()
</script>