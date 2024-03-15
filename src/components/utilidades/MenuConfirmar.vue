<template>
  <q-menu
    class           ="bg-transparent no-shadow" 
    anchor          ="bottom middle"
    self            ="top middle"
    style           ="height: 50px;"
    transition-show ="jump-down"
    transition-hide ="jump-up"
    >
    <q-btn-group>
      <q-btn        v-close-popup
        v-bind      ="style.btnBaseSm"
        color       ="negative"
        icon        ="mdi-close"
        :label      ="conLabel ? 'No' : ''"
      />
      <q-btn        v-close-popup
        v-bind      ="style.btnBaseSm"
        color       ="positive"
        icon        ="mdi-check"
        :label      ="conLabel ? 'Si' : ''"
        @click      ="(e)=>emit('ok', e)"
      />
    </q-btn-group>
  </q-menu>
</template>
<script setup lang="ts">
  import { style } from "src/composables/useEstilos"
  type TEmit = { ok  : [value : Event]  }
  const emit        = defineEmits<TEmit>()
  const props       = defineProps({
    conLabel:       { default: true, type: Boolean }
  })
</script>