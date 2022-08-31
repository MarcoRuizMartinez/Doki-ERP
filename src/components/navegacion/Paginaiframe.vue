<template>
  <q-page                 padding
    class                 ="row justify-center"
    >
    <ventana              full-screen
      class               ="col-12 col-md-9"
      padding-contenido   ="0"
      height              ="79vh"
      :titulo             ="titulo"
      :icono              ="icono"
      >
      <template           #barra
        v-if              ="!!link"
        >
        <q-btn            flat round dense
          color           ="white"
          icon            ="mdi-open-in-new"
          type            ="a"
          class           ="op40 op100-hover q-ml-xs"
          target          ="_blank"
          :href           ="link"
          >
          <Tooltip label  ="Ir a enlace"/>
        </q-btn>
      </template>
      <iframe
        class             ="iframe"
        :src              ="src"
        >
      </iframe>
    </ventana>
  </q-page>
</template>

<script setup lang="ts">

  import    ventana             from "components/utilidades/Ventana.vue"
  const props = defineProps({
    src:    { type: String, required: true },
    titulo: { type: String, required: true },
    icono:  { type: String, default: "mdi-book-open-variant" },
    link:   { type: String, default: "" },
  })
</script>

<style scoped>
.iframe {
  border:none;
  width:100%;  
  height: 100%;
}
</style>
