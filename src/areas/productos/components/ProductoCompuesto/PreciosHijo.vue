<script setup lang="ts">
  import { Format, Tool   } from "src/composables/useTools"
  import { IProductoHijo  } from '../../models/ProductoHijo';

  type TProps = {
    producto : IProductoHijo
  }

  const { producto } = defineProps<TProps>()

</script>
<template>
  <div class                ="row items-center">
    <!-- //* //////////////////////////////////////////////////////////////// Tooltip de precios de proveedor -->
    <div>
      <q-icon
        name                ="mdi-information"
        color               ="grey-5"
        size                ="sm"
        class               ="q-mr-sm"
      />
      <Tooltip>
        <table>
          <tr   class="text-center">
            <td class="width200">Proveedor</td>
            <td class="width100">Ref</td>
            <td class="width80 text-right">Precio</td>
            <td class="width60">Activo</td>
            <td class="width60">Disponible</td>
          </tr>                
          <tr
            v-for           ="pp of producto.productosPro"
            :key            ="pp.id"
            >
            <td>{{ pp.proveedor }}</td>
            <td>{{ pp.ref }}      </td>
            <td class="fuente-mono text-right"> {{ Format.precio( pp.precio,  "decimales-no" )  }}</td>
            <td class="text-center">            {{ Tool.siNo( pp.activo,      "iconos" )        }}</td>
            <td class="text-center">            {{ Tool.siNo( pp.disponible, "iconos" )         }}</td>
          </tr>
        </table>
      </Tooltip>
    </div>      
    <div class              ="fuente-mono text-right col column text-bold">
      <span class           ="text-orange-10">
        {{ Format.precio( producto.costoTotal, "decimales-no" ) }}
      </span>
      <span class           ="text-light-green-10">
        {{ Format.precio( producto.precioTotal, "decimales-no" ) }}
      </span>
      <Tooltip>
      <table class  ="text-right">
        <tr>
          <td class="width100">Compra UND</td>
          <td class="width100">Venta UND</td>
        </tr>                
        <tr>
          <td class="fuente-mono"> {{ Format.precio( producto.costo,  "decimales-no" )  }}</td>
          <td class="fuente-mono"> {{ Format.precio( producto.precio, "decimales-no" )  }}</td>
        </tr>
      </table>
    </Tooltip>    
    </div>
  </div>
</template>