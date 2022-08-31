<template>
  <ventana                  cerrar
    :titulo                 ="titulo"
    icono                   ="mdi-image"    
    padding-contenido       ="0"    
    >
    <q-img
      class                 ="imagen-visor"
      :src                  ="src"
      :ratio                ="1"      
    />
  </ventana>
</template>
<script setup lang="ts">
  import    ventana             from "components/utilidades/Ventana.vue"
  const props                   = defineProps({
    titulo:     { required: true,   type: String }, 
    src:        { required: true,   type: String }, 
  })
</script>
<style>
.imagen-visor{
  max-width: 800px;
  min-width: 300px;
  width: 36vw;
}
</style>