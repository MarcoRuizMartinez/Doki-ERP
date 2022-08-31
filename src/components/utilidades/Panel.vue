<template>
  <div class  ="column panel-blur70 full-width text-center radius8 q-pa-md">
    <div
      v-if    ="!!titulo"
      class   ="q-mb-sm"
      :class  ="'text-'+hx"
      >
      {{titulo}}
    </div>
    <div :class="$attrs.class">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
  import {  
            PropType,
            //computed,
            //onMounted,
            //ref               
                                } from 'vue'

  const props = defineProps({
    titulo: { default: "",    type: String },
    hx:     { default: "h3",  type: String as PropType<"h1" | "h2" | "h3" | "h4" | "h5" | "h6"> }
  })
</script>