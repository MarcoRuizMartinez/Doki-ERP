<template>
  <q-icon
    name          ="mdi-package-variant-closed"
    size          ="xs"
    class         ="op60 op100-hover"
    >
    <tooltip-lineas
      :lineas     ="acuerdo.productos"
    />
  </q-icon>
  <router-link :to="`/${tipo}/${acuerdo.id}`">
    {{ acuerdo.refCorta }}
    <tooltip-acuerdo    :acuerdo="acuerdo"/>
  </router-link>
</template>
<script lang="ts" setup>
  import {  PropType        } from "vue"    
  import {  IAcuerdo        } from "src/areas/acuerdos/models/Acuerdo"
  import    tooltipLineas     from "src/areas/acuerdos/components/Tooltips/TooltipLineas.vue"
  import    tooltipAcuerdo    from "src/areas/acuerdos/components/Tooltips/TooltipAcuerdo.vue"
  import {  TTipoAcuerdo    } from "src/areas/acuerdos/models/ConstantesAcuerdos"

  const props               = defineProps({
    acuerdo:  { required: true, type: Object as PropType< IAcuerdo > },
    tipo:     { required: true, type: String as PropType< TTipoAcuerdo > },
  })
</script>