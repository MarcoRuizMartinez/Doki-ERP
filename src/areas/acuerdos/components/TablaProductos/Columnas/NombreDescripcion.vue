<template>
  <div
    @click              ="emit('click')"
    :class              ="$attrs.class"
    >
    <span class         ="text-bold">{{linea.ref}}</span> -
    <span class         ="text-subtitle1">{{linea.nombre}} </span>
    <br/>
    <span
      v-if              ="!!linea.descripcion"
      v-html            ="linea.descripcion"
      class             ="text-0_8em"
      >
    </span>
  </div>
  <q-menu               touch-position context-menu>
    <q-btn              v-close-popup flat dense
      icon              ="mdi-open-in-new"
      type              ="a"
      label             ="Ir a producto"
      target            ="_blank"
      :href             ="`/productos/${linea.id}`"
    />
  </q-menu>  
</template>
<script lang="ts" setup>
//      style             ="min-width: 100px">
  import {  PropType      } from "vue"
  import {  ILineaAcuerdo } from "src/areas/acuerdos/models/LineaAcuerdo"
  const props               = defineProps({
    linea: { required: true, type: Object as PropType< ILineaAcuerdo > },
  })

  const emit = defineEmits<{
    (e: 'click',  value: void ): void
  }>()
</script>
