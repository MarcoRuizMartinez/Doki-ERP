<template>
  <div
    v-if                  ="!!linea.img.url"
    :class                ="[ $attrs.class, { 'float-left' : float }]"
    >
    <q-img
      :src                ="linea.img.img_100px"
      class               ="cursor-pointer"
      spinner-color       ="white"
      :class              ="mini ? 'imagen-woo-xs' : 'imagen-woo-md'"
      @click              ="clickImagen( linea )"
      >
      <template v-slot:loading>
        <q-spinner-dots color="white" />
      </template>
    </q-img>
    <q-tooltip            class="bg-black">
      <q-img
        :src              ="linea.img.img_300px"
        class             ="imagen-woo-lg"
        spinner-color     ="white"
        >
        <template v-slot:loading>
          <q-spinner-dots color="white" />
        </template>
      </q-img>
    </q-tooltip>
  </div>
  <visor-imagen
    v-model:visible       ="ventanaImagen"
    v-model:src           ="imagenBig.src"
    :titulo               ="imagenBig.titulo"    
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
    linea:  { required: true,   type: Object as PropType< ILineaAcuerdo > },
    float:  { default:  false,  type: Boolean },
    mini:   { default:  false,  type: Boolean },
  })
  function clickImagen( linea : ILineaAcuerdo ){
    imagenBig.value         = { titulo: linea.nombre, src: linea.img.img_full }
    ventanaImagen.value     = true
  }
</script>
