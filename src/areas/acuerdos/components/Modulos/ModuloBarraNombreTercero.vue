<template>
  <barra
    class                     ="row justify-between items-center text-white text-h6"
    >
    <div class                ="row items-center q-ml-md">
      <div>
        <campo-copiar
          v-if                ="!!acuerdo.id"
          :label              ="acuerdo.tercero.nombre"
          color               ="white"
          >
          <router-link
            class             ="link-limpio text-white fuente-delicada"
            :to               ="'/tercero/' + acuerdo.tercero.id"
            >
            {{ acuerdo.tercero.nombre }}
          </router-link>
        </campo-copiar>
        <span v-else>...</span>
        <tooltip-tercero
          v-if                ="!!acuerdo.tercero.id"
          :tercero            ="acuerdo.tercero"
        />
      </div>
    </div>
    <div
      v-if                    ="(acuerdo.esPedido || acuerdo.esOCProveedor) && (!acuerdo.esEstadoEntregado && !acuerdo.esEstadoAnulado)"
      class                   ="row q-mr-md items-center"
      >
      <span class="q-mr-sm">Dia compromiso:</span>
      <span
        class                 ="radius-10 q-px-sm text-capitalize text-1_1em "        
        :class                ="'bg-' + acuerdo.estadoAnimoColor"
        >
        {{ acuerdo.diasEntregarMensaje }}
      </span>
      <div
        v-if                  ="acuerdo.esPedido || acuerdo.esOCProveedor"
        class                 ="text-h4 q-pl-sm"
        >
        {{ acuerdo.estadoAnimoEmoji }}
      </div>      
    </div>
  </barra>
</template>


<script setup lang="ts">
  //* ///////////////////////////////////////////////////////////////////////////////// Core

  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
  //* ///////////////////////////////////////////////////////////////////////////////// Modelos

  //* ///////////////////////////////////////////////////////////////////////////////// Componibles

  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    barra                   from "components/utilidades/Barra.vue"
  import    campoCopiar             from "components/utilidades/CampoCopiar.vue" 
  import    tooltipTercero          from "src/areas/terceros/components/TooltipTerceros.vue"

  const { acuerdo } = storeToRefs( useStoreAcuerdo() )

</script>