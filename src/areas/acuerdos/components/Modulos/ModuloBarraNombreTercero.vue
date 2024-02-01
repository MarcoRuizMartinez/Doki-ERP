<template>
  <barra
    class                     ="row justify-between items-center text-white fuente-delicada text-h6"
    >
    <div class                ="row items-center q-ml-md">
      <div class              ="text-h4">
        {{ acuerdo.estadoAnimoEmoji }}
      </div>
      <div>
        <campo-copiar
          v-if                ="!!acuerdo.id"
          :label              ="acuerdo.tercero.nombre"
          color               ="white"
          >
          <router-link
            class             ="link-limpio text-white"
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
    <div class                ="q-mr-md">
      Dia compromiso:
      <span
        class                 ="text-bold fuente-delicada text-capitalize text-brillo-suave"
        :class                ="acuerdo.estadoAnimoColor"
        >
        {{ acuerdo.diasEntregarMensaje }} 
      </span>
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