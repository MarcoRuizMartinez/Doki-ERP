<template>
  <div
    class           ="q-px-sm"
    :class          ="{ 'bg-grey-3 rounded-borders' : !dark }"
    >
    <table  class   ="tabla-info text-1em min-w-x100"      
      >
      <tbody>
        <tr>
          <td>Contacto</td>
          <td>
            {{ acuerdo.contactoEntrega.nombreCompleto }}
            <template v-if="!!acuerdo.contactoEntrega.telefono">
              - {{ acuerdo.contactoEntrega.telefono }}
            </template>
            <template v-if="!!acuerdo.contactoEntrega.telefono_2">
              - {{ acuerdo.contactoEntrega.telefono_2 }}
            </template>
          </td>
        </tr>
        <tr>
          <td>Método</td>
          <td>
            <template v-if="!!acuerdo.metodoEntrega.label">
              {{ acuerdo.metodoEntrega.label}}
            </template>
            <template v-else>
              ⚠️
            </template>
          </td>
        </tr>
        <tr>
          <td>Dirección:</td>
          <td>
            {{ acuerdo.contactoEntrega.direccion.length > 3 ? acuerdo.contactoEntrega.direccion : '⚠️' }}
            <link-maps
              :municipio  ="acuerdo.contactoEntrega.municipio"
              :direccion  ="acuerdo.contactoEntrega.direccion"
            />
          </td>
        </tr>        
        <tr>
          <td>Ciudad:</td>
          <td>
            {{ acuerdo.contactoEntrega.municipio.label }}
          </td>
        </tr>
        <template v-if="conFechas">
        <tr>
          <td>Fecha de compromiso:</td>
          <td>
            <span class="q-mr-md">{{ acuerdo.fechaEntregaCorta }}</span> {{ acuerdo.diasEntregarFormato }} {{ acuerdo.estadoAnimoEmoji }} 
          </td>
        </tr>
        <tr>
          <td>Fecha de despacho:</td>
          <td>
            <span class="q-mr-md">{{ acuerdo.fechaADespacharCorta }}</span> {{ acuerdo.diasADespacharFormato }}
          </td>
        </tr>
        </template>
      </tbody>
    </table>
    <div class="q-ml-xs">
      <div class="text-bold">Indicaciones: </div>
      <div>
        {{ acuerdo.contactoEntrega.nota.length > 3 ? acuerdo.contactoEntrega.nota : 'Sin indicaciones' }}
      </div>
    </div>
  </div>  
</template>
<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////////// Core
  import {  PropType        } from "vue"    
  // * ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAcuerdo        } from "src/areas/acuerdos/models/Acuerdo"
  import    linkMaps          from "src/components/utilidades/LinkGoogleMaps.vue"


  const props               = defineProps({
    acuerdo     : { required: true,   type: Object as PropType< IAcuerdo > },
    dark        : { default:  false,  type: Boolean },
    conFechas   : { default:  false,  type: Boolean },
  })

</script>