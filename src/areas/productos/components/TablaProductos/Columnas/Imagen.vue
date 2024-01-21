<template>
  <q-img
    :src                ="producto.img.img_100px"
    class               ="imagen-woo-sm q-mr-md"
    ratio               ="1"
    :class              ="{ 'op40' : !producto.activo  }"
    >
    <template v-slot:loading>
      <q-spinner-dots color="white" />
    </template>
    <Tooltip>
    <q-img
      :src              ="producto.img.img_300px"
      class             ="imagen-woo-lg"
      ratio             ="1"
      >
      <template v-slot:loading>
        <q-spinner-dots color="white" />
      </template>
    </q-img>
    </Tooltip>
  </q-img>    
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  PropType            } from "vue"
  import {  IProductoDoli       } from "src/areas/productos/models/ProductoDolibarr"
  
  const props                 = defineProps({      
    producto:         { required: true,  type: Object as PropType< IProductoDoli >  },
  })
</script>