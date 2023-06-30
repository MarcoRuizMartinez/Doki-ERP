<template>
  <div>
    <fieldset class="full-height">
    <legend>{{titulo}}:</legend>
      <div  :class          ="classContenido">
        <slot></slot>
      </div>
    </fieldset>
  </div>
</template>
<script setup lang="ts">
//class         ="col" col
  const props           = defineProps({
    titulo:         { required: true, type: String  },
    classContenido:  { default: "",    type: String  },
  })
</script>