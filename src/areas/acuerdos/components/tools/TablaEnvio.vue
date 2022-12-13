<template>
  <table  class           ="tabla-info text-1em bg-grey-3 rounded-borders q-px-sm min-w-100">
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
          </td>
        </tr>        
        <tr>
          <td>Ciudad:</td>
          <td>
            {{ acuerdo.contactoEntrega.municipio.label }}
          </td>
        </tr>
        <tr>
          <td>Indicaciones:</td>
          <td>
            {{ acuerdo.contactoEntrega.nota.length > 3 ? acuerdo.contactoEntrega.nota : '❕' }}
          </td>
        </tr>
      </tbody>
    </table>
</template>
<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs     } from 'pinia'                            
  import {  useStoreAcuerdo } from 'src/stores/acuerdo'
  const { acuerdo           } = storeToRefs( useStoreAcuerdo() )
</script>