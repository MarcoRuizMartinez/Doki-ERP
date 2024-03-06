<template>
  <div
    v-if                  ="!!imagen.url"
    :class                ="[ $attrs.class, { 'float-left' : float }]"
    >
    <q-img
      :src                ="imagen.img_100px"
      class               ="cursor-pointer"
      spinner-color       ="white"
      :class              ="'imagen-woo-'+size"
      @click              ="clickImagen( imagen )"
      >
      <template v-slot:loading>
        <q-spinner-dots color="white" />
      </template>
    </q-img>
    <q-tooltip            class="bg-black">
      <q-img
        :src              ="imagen.img_300px"
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
  import {  ref,
            toRefs,
            PropType        } from "vue"  
  import    visorImagen       from "components/utilidades/VisorImagen.vue"
  import {  IImagenProducto } from 'src/areas/productos/models/ImagenProducto';

  const ventanaImagen       = ref< boolean >( false )
  type  TImagenBig          = { src : string, titulo: string }
  const imagenBig           = ref< TImagenBig >( { titulo: "", src: "" } )

  type  TSize               = "xs" | "sm" | "md"
  type  TProps              = {
    imagen  : IImagenProducto
    nombre  : string
    float  ?: boolean
    size   ?: TSize
  }

  const {
    imagen,
    nombre,
    float = false,
    size  = "md"
  }               = defineProps<TProps>()

  /*
  {
    imagen: { required: true,   type: Object as PropType< IImagenProducto > },
    nombre: { required: true,   type: String  },
    float:  { default:  false,  type: Boolean },
    mini:   { default:  false,  type: Boolean },
  }
  */

  //const { nombre }          = toRefs( props )

  function clickImagen( img : IImagenProducto ){
    imagenBig.value         = { titulo: nombre, src: img.img_full }
    ventanaImagen.value     = true
  }
</script>
