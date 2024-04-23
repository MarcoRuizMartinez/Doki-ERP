<template>
  <q-tooltip
    v-if        ="!hide"
    v-model     ="show"
    class       ="bg-black text-caption"
    :max-width  ="anchoMax"
    >
    <slot>{{label}}</slot>
  </q-tooltip>
</template>
<script setup lang="ts">
  import { ref, watch, toRefs } from "vue"  
  const props = defineProps({    
    label:      { type: String,   default: ""     },
    hide:       { type: Boolean,  default: false  },
    mostrar:    { type: Boolean,  default: false  },
    anchoMax:   { type: String,   default: ''     },
  }) 
  const show        = ref<boolean>( false )
  const { mostrar } = toRefs( props )

  watch(mostrar, (m)=>
    {
      show.value = m
    },
    { immediate : true }
  )
</script>