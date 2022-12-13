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
    <!-- //* //////// Vista Rapida -->
    <q-btn            flat dense round
      icon            ="mdi-eye"
      class           ="op40 op100-hover q-ml-sm"
      padding         ="none"
      size            ="md"
      @click          ="emit('vistaRapida')"
    />    
    <router-link

      class         ="fuente-mono"
      :to           ="`/${acuerdo.labelPlural}/${acuerdo.id}`"
      >
      {{ acuerdo.refCorta }}
    </router-link>
<!--     <a
      class         ="fuente-mono"
      :href         ="urlDolibarr + '/commande/card.php?id=' + acuerdo.id"
      target        ="_blank"
      >
      {{ acuerdo.refCorta }}
    </a> -->
    <tooltip-acuerdo    :acuerdo="acuerdo"/>
  </span>
</template>
<script lang="ts" setup>
  import {  PropType        } from "vue"    
  import {  IAcuerdo        } from "src/areas/acuerdos/models/Acuerdo"
  import    tooltipLineas     from "src/areas/acuerdos/components/Tooltips/TooltipLineas.vue"
  import    tooltipAcuerdo    from "src/areas/acuerdos/components/Tooltips/TooltipAcuerdo.vue"

  const props               = defineProps({
    acuerdo:  { required: true, type: Object as PropType< IAcuerdo > },
  })
  const emit                = defineEmits(["vistaRapida"])
</script>