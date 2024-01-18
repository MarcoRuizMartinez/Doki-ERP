<script lang="ts" setup>
  import {  PropType          } from "vue"
  import {  IProductoDoli     } from "src/areas/productos/models/ProductoDolibarr"
  import {  Format            } from "src/composables/useTools"
  const props                 = defineProps({
    producto: { required: true,   type: Object as PropType< IProductoDoli >  },
  })

</script>

<template>
  <Tooltip
    v-if      ="producto.activo"
    :label    ="producto.nombre"
    >
    <table    class         ="tabla-totales text-1_2em">
      <tr>
        <td>Precio publico:</td>
        <td>{{ Format.precio( producto.precio_publico, "decimales-no" )}}</td>
      </tr>
      <tr>
        <td>+IVA:</td>
        <td>{{ Format.precio( producto.precioPublicoConIVA, "decimales-no" )}}</td>
      </tr>
      <tr v-if="producto.precio_publico != producto.precio_promocion">
        <td>Precio promoción:</td>
        <td>{{ Format.precio( producto.precio_promocion, "decimales-no" )}}</td>
      </tr>
      <tr v-if="producto.precio_publico != producto.precio_promocion">
        <td>+IVA:</td>
        <td>{{ Format.precio( producto.precioPromocionConIVA, "decimales-no" )}}</td>
      </tr>
      <tr v-if="producto.precio_publico != producto.precio_promocion">
        <td>Descuento:</td>
        <td>{{ producto.descuentoCalculado }}%</td>
      </tr>                                
    </table>
  </Tooltip>
</template>