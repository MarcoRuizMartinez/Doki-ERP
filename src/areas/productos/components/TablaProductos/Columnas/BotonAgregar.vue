<template>
  <efecto efecto        ="UpDown">
    <q-icon
      v-if              ="producto.elegido"
      name              ="mdi-check-decagram"
      color             ="positive"
      size              ="sm"
      v-touch-hold.mouse="()=> emit('clickLargo')"
      >
      <Tooltip  label   ="Ya seleccionado"/>
    </q-icon>
    <q-btn              round
      v-else-if         ="producto.activo"
      color             ="grey-10"
      icon              ="mdi-plus-circle-outline"
      padding           ="0"
      class             ="op30 op100-hover"
      @click            ="emit('click')"
      >
      <Tooltip label    ="Agregar producto"/>
    </q-btn>
  </efecto>
</template>  
<script setup lang="ts">
//, [ props.row ] 
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  PropType            } from "vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IProductoDoli       } from "src/areas/productos/models/ProductoDolibarr"  
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    efecto                from "components/utilidades/Efecto.vue"

  
  const props                 = defineProps({      
    producto:         { required: true,  type: Object as PropType< IProductoDoli >  },
  })

  const emit = defineEmits<{
    (e: "click"       ): void
    (e: "clickLargo"  ): void    
  }>()

</script>
