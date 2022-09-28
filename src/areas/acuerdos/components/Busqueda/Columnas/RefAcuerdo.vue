<template>
  <q-icon
    name            ="mdi-package-variant-closed"
    size            ="xs"
    class           ="op60 op100-hover"
    >
    <tooltip-lineas
      :lineas       ="acuerdo.productos"
    />
  </q-icon>
  <span>
    <router-link
      v-if          ="acuerdo.esCotizacion"
      class         ="fuente-mono"
      :to           ="`/${acuerdo.tipo}/${acuerdo.id}`"
    >
      {{ acuerdo.refCorta }}
    </router-link>
    <a
      v-else
      class         ="fuente-mono"
      :href         ="urlDolibarr + '/commande/card.php?id=' + acuerdo.id"
      target        ="_blank"
      >
      {{ acuerdo.refCorta }}
    </a>
    <tooltip-acuerdo    :acuerdo="acuerdo"/>
  </span>
</template>
<script lang="ts" setup>
  import {  PropType        } from "vue"    
  import {  IAcuerdo        } from "src/areas/acuerdos/models/Acuerdo"
  import    tooltipLineas     from "src/areas/acuerdos/components/Tooltips/TooltipLineas.vue"
  import    tooltipAcuerdo    from "src/areas/acuerdos/components/Tooltips/TooltipAcuerdo.vue"
  import {  TTipoAcuerdo    } from "src/areas/acuerdos/models/ConstantesAcuerdos"

  const props               = defineProps({
    acuerdo:  { required: true, type: Object as PropType< IAcuerdo > },
  })
  const   urlDolibarr       = process.env.URL_DOLIBARR
</script>