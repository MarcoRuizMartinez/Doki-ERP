<template>
  <div
    v-if                  ="!!linea.imagen"
    class                 ="float-left-xxx"
    :class                ="$attrs.class"
    >
    <q-img
      :src                ="linea.imagen100px"
      class               ="imagen-woo-sm cursor-pointer"
      spinner-color       ="white"
      @click              ="clickImagen( linea )"
    />
    <q-tooltip            class="bg-black">
      <q-img
        :src              ="linea.imagen300px"
        class             ="imagen-woo-lg"
        spinner-color     ="white"
      />
    </q-tooltip>
  </div>
  <visor-imagen
    :visible              ="ventanaImagen"
    :titulo               ="imagenBig.titulo"
    :src                  ="imagenBig.src"
  />
</template>
<script lang="ts" setup>
  import {  ref, PropType } from "vue"
  import {  ILineaAcuerdo } from "src/areas/acuerdos/models/LineaAcuerdo"
  import    visorImagen     from "components/utilidades/VisorImagen.vue"

  const ventanaImagen       = ref< boolean >( false )
  type  TImagenBig          = { src : string, titulo: string }
  const imagenBig           = ref< TImagenBig >( { titulo: "", src: "" } )
  const props               = defineProps({
    linea: { required: true, type: Object as PropType< ILineaAcuerdo > },
  })
  function clickImagen( linea : ILineaAcuerdo ){
    imagenBig.value         = { titulo: linea.nombre, src: linea.imagenFull }
    ventanaImagen.value     = true
  }
</script>
