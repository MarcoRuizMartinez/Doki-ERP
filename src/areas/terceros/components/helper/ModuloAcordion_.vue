<template>
  <ventana
    titulo                      ="Ayudas"
    icono                       ="mdi-lifebuoy"
    class-contenido             ="column items-center"
    padding-contenido           ="0px"
    >
    <q-list class               ="rounded-borders fit">
      <q-expansion-item         dense default-opened
        label                   ="Notas"
        icon                    ="mdi-note-text"
        header-class            ="bg-primary text-white font-julius"
        expand-icon-class       ="text-white"
        >
        <nota/>
      </q-expansion-item>      
      <q-expansion-item         dense default-opened
        label                   ="Verificar en la DIAN"
        icon                    ="mdi-fingerprint"
        header-class            ="bg-primary text-white font-julius"
        expand-icon-class       ="text-white"
        >
        <dian />
      </q-expansion-item>
    </q-list>
  </ventana>
</template>
<script setup lang="ts">
  import  ventana                 from "components/utilidades/Ventana.vue"
  import  nota                    from "./AcordionNota.vue";
  import  dian                    from "./AcordionDian.vue";
</script>