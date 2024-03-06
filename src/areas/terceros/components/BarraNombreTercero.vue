<template>
    <barra
      class                     ="row justify-center items-center text-white text-h6"
      >
      <div class                ="row items-center q-ml-md q-px-md fit">
        <div class              ="col"></div>
        <div class              ="col-11 row justify-center">
          <campo-copiar
            :label              ="tercero.nombre"
            color               ="white"
            >
            <span class         ="text-white fuente-delicada el-md">
              {{ tercero.nombre }}
            </span>
          </campo-copiar>
          <tooltip-tercero
            :tercero            ="tercero"
          />
        </div>
        <div class              ="col-auto text_1em">
          <span class           ="op40 op100-hover text-0_8em text-right">
            {{tercero.fechaCreado.slice(0,10)}}
            <Tooltip label      ="Fecha de creación"/>
          </span>   
        </div>
      </div>
    </barra>
  </template>
  
  
<script setup lang="ts">
//* ///////////////////////////////////////////////////////////////////////////////// Core

  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'stores/acuerdo'
  //* ///////////////////////////////////////////////////////////////////////////////// Modelos
  //* ///////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  ITercero,
            Tercero,
                                  } from "src/areas/terceros/models/Tercero"  
  //* ///////////////////////////////////////////////////////////////////////////////// Componibles

  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    barra                   from "components/utilidades/Barra.vue"
  import    campoCopiar             from "components/utilidades/CampoCopiar.vue" 
  import    tooltipTercero          from "src/areas/terceros/components/TooltipTerceros.vue"

  type  TProps    = { tercero : ITercero }

  const { tercero } = defineProps< TProps >()

</script>