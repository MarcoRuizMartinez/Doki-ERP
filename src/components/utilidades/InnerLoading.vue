<template>
  <!-- //?* ////////////////////////////////////////////////////////////// Cargando... spinner --> 
  <q-inner-loading
    :showing    ="cargando"
    :label      ="mensaje"
    >
    <q-spinner-dots
      :size     ="size"
      color     ="primary"
    />
  </q-inner-loading>
</template>
<script lang="ts" setup>
  const props   = defineProps({
    cargando:   { required: true,           type: Boolean },
    mensaje:    { default:  "Cargando...",  type: String  },
    size:       { default:  "5em",          type: String  },
  })
</script>