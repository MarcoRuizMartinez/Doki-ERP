<template>
  <div>
    <fieldset >
    <legend>{{titulo}}:</legend>
      <div  :class          ="classConenido">
        <slot></slot>
      </div>
    </fieldset>
  </div>
</template>
<script setup lang="ts">
//class         ="col" col
  const props           = defineProps({
    titulo:         { required: true, type: String  },
    classConenido:  { default: "",    type: String  },
  })
</script>