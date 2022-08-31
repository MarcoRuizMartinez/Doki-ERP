<template>
  <q-timeline
    layout              ="loose"
    >
    <q-timeline-entry   heading
      v-if              ="!!titulo"
      :tag              ="hx"
      >
      {{titulo}}
    </q-timeline-entry>

    <q-timeline-entry
      v-for             ="(item, index) of lineaTiempo"
      :key              ="item.id"
      :icon             ="item.icon"
      :side             ="'left'/* !(index % 2) ? 'left' : 'right' */"
      :title            ="item.objetivo"
      :color            ="item.color"
      >
      <q-badge
        v-if            ="!!item.novedad"
        color           ="positive"
        :label          ="item.novedad"
      />
      <div>{{item.descripcion}}</div>
      <template         #subtitle>
        Fecha {{item.estado.includes('✅') ? 'finalizado' : 'estimada'}}: {{item.fechaEstimada}}
        <div
          v-if          ="!item.estado.includes('🎯') "
          class         ="text-1_2em"
          >
          {{item.estado}}
        </div>
        <div>Dias de trabajo estimados: {{item.dias}}</div>
      </template>
    </q-timeline-entry>
  </q-timeline>
</template>
<script setup lang="ts">
  import {  PropType          } from 'vue'
  import {  IObjetivo         } from "src/areas/empresa/models/HojaRutaAirTable"

  const props =                 defineProps({
    titulo:       { default:  "",   type: String },
    lineaTiempo:  { required: true, type: Array   as PropType< IObjetivo[] >},
    hx:           { default: "h4",  type: String  as PropType<"h1" | "h2" | "h3" | "h4" | "h5" | "h6"> }
  })
</script>