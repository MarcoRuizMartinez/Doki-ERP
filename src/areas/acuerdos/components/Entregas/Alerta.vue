<template>
  <q-icon
    v-if        ="entrega.alertaEntrega"
    name        ="mdi-alert"
    color       ="orange"
    size        ="2em"
    >
    <Tooltip>
      <span
        v-html  ="entrega.alertasEntrega.join('<br/>')"
        >
      </span>
    </Tooltip>
  </q-icon>
</template>

<script setup lang="ts">
  import {  IAcuerdo              } from "src/areas/acuerdos/models/Acuerdo"
  type TProps                       = { entrega : IAcuerdo}
  const { entrega }                 = defineProps<TProps>()  
</script>