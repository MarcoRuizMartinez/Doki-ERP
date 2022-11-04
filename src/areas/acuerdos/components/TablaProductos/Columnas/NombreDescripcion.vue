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
    <div  class         ="column items-start ">
      <q-btn            v-close-popup flat dense no-caps
        icon            ="mdi-open-in-new"
        type            ="a"
        label           ="Ver producto"
        target          ="_blank"
        :to             ="`/productos/${linea.id}`"
      />
      <q-btn            flat dense no-caps
        v-if            ="!esValidado"
        icon            ="mdi-trash-can"
        label           ="Borrar línea"
        >
        <confirmar      @ok="emit('borrarLinea', linea)"/>
      </q-btn>
    </div>
  </q-menu>  
</template>
<script lang="ts" setup>
//      style             ="min-width: 100px">
  import {  PropType      } from "vue"
  import {  ILineaAcuerdo } from "src/areas/acuerdos/models/LineaAcuerdo"
  import    confirmar       from "components/utilidades/MenuConfirmar.vue"

  const props               = defineProps({
    linea:      { required: true, type: Object as PropType< ILineaAcuerdo > },
    esValidado: { required: true, type: Boolean },
  })

  const emit = defineEmits<{
    (e: 'click',        value: void           ): void
    (e: 'borrarLinea',  value: ILineaAcuerdo  ): void
  }>()
</script>
