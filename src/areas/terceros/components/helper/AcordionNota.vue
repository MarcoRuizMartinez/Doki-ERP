<template>
  <div class="q-pa-sm" style="max-width: 100%">
    <q-input
      v-model="nota"
      filled
      type="textarea"
    />
  </div>
</template>
<script setup lang="ts">
  import { ref }    from "vue"
  const nota  = ref<string>("")
</script>