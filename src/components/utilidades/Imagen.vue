<template>
  <div
    v-if                  ="!!src"
    :class                ="[ $attrs.class, { 'float-left' : float }]"
    >
    <q-img
      :src                ="src"
      class               ="cursor-pointer"
      spinner-color       ="white"
      :class              ="'imagen-woo-'+size"
      @click              ="ventanaImagen = true"
      >
      <template v-slot:loading>
        <q-spinner-dots color="white" />
      </template>
    </q-img>
    <q-tooltip            class="bg-black">
      <q-img
        :src              ="src"
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
    v-model:src           ="imagenBig"
    :titulo               ="nombre"
  />
</template>
<script lang="ts" setup>
  import {  ref,
            onMounted,
            PropType        } from "vue"  
  import    visorImagen       from "components/utilidades/VisorImagen.vue"  

  const ventanaImagen       = ref< boolean >( false )
  type  TImagenBig          = { src : string, titulo: string }
  const imagenBig           = ref< string >("")

  type  TSize               = "xs" | "sm" | "md"
  type  TProps              = {
    src     : string
    nombre  : string
    float  ?: boolean
    size   ?: TSize
  }

  const {
    src,
    nombre,
    float = false,
    size  = "md"
  }               = defineProps<TProps>()

  onMounted(()=>{
    imagenBig.value = src
  })
</script>
