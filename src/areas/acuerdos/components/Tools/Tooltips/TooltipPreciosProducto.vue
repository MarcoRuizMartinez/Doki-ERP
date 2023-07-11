<template>
  <Tooltip
    v-if      ="producto.activo"
    :label    ="producto.nombre"
    >
    <table    class         ="tabla-totales text-1_2em">
      <tr>
        <td>Precio publico:</td>
        <td>{{ formatoPrecio( producto.precio_publico, "decimales-no" )}}</td>
      </tr>
      <tr>
        <td>+IVA:</td>
        <td>{{ formatoPrecio( producto.precioPublicoConIVA, "decimales-no" )}}</td>
      </tr>
      <tr v-if="producto.precio_publico != producto.precio_promocion">
        <td>Precio promoción:</td>
        <td>{{ formatoPrecio( producto.precio_promocion, "decimales-no" )}}</td>
      </tr>
      <tr v-if="producto.precio_publico != producto.precio_promocion">
        <td>+IVA:</td>
        <td>{{ formatoPrecio( producto.precioPromocionConIVA, "decimales-no" )}}</td>
      </tr>
      <tr v-if="producto.precio_publico != producto.precio_promocion">
        <td>Descuento:</td>
        <td>{{ producto.descuentoCalculado }}%</td>
      </tr>                                
    </table>
  </Tooltip>
</template>
<script lang="ts" setup>
  import {  PropType          } from "vue"
  import {  IProductoDoli     } from "src/areas/productos/models/ProductoDolibarr"
  import {  formatoPrecio     } from "src/composables/useTools"
  const props                 = defineProps({
    producto: { required: true,   type: Object as PropType< IProductoDoli >  },
  })

</script>