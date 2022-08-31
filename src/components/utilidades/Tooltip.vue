<template>
  <q-tooltip
    v-if    ="!hide"
    class   ="bg-black text-caption" 
    >
    <slot>{{label}}</slot>
  </q-tooltip>
</template>
<script setup lang="ts">
  const props = defineProps({
    label:  { type: String,   default: ""     },
    hide:   { type: Boolean,  default: false  }
  })
  /*
        anchor              ="top middle"
        self                ="bottom middle"
*/          
</script>