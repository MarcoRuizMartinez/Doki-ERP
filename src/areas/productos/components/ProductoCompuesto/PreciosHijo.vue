<template>
  <DefineTemplate>
    <table  class="fit">
      <tr   class="text-center text-bold">
        <td>Proveedor</td>
        <td>Ref</td>
        <td class="text-right">Precio</td>
      </tr>                
      <tr
        v-for           ="pp of producto.productosPro"
        :key            ="pp.id"
        >
        <td>{{ Tool.siNo( pp.disponible, "iconos" ) }} {{ pp.proveedor }}</td>
        <td class="q-px-md">{{ pp.ref }}      </td>
        <td class="fuente-mono text-right"> {{ Format.precio( pp.precio,  "decimales-no" )  }}</td>
      </tr>
    </table>
  </DefineTemplate>
  <div
    class                   ="row items-center"
    :class                  ="$attrs.class"
    >
    <!-- //* //////////////////////////////////////////////////////////////// Tooltip de precios de proveedor -->
    <div>
      <q-btn
        v-bind              ="style.btnRedondoFlat"
        :icon               ="producto.naturaleza.esCompuesto_o_Kit ? 'mdi-focus-field' : 'mdi-package'"
        color               ="grey-8"
        class               ="q-mr-sm"
        @click              ="clickBotonPreciosProveedor"
      />
      <Tooltip v-if         ="producto.hayProductosPro">
        <ReuseTemplate />
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
  <q-dialog                     
    v-model                     ="showPreciosProveedor"
    v-bind                      ="style.dialogo"
    >      
    <ventana                    cerrar
      icono                     ="mdi-currency-usd-circle"
      titulo                    ="Precios de proveedores"
      min-width                 ="500px"
      >
      <ReuseTemplate />
    </ventana>
  </q-dialog>  
</template>

<script setup lang="ts">
  import {  ref                     } from 'vue'
  import {  createReusableTemplate  } from '@vueuse/core'
  import {  Format, Tool            } from "src/composables/useTools"
  import {  IProductoHijo           } from '../../models/ProductoHijo'
  import {  style                   } from "src/composables/useEstilos"
  ////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                   from "components/utilidades/Ventana.vue"


  const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

  type TProps = {
    producto : IProductoHijo
  }

  const { producto } = defineProps<TProps>()

  const showPreciosProveedor = ref<boolean>(false)

  function clickBotonPreciosProveedor()
  {
    if(producto.hayProductosPro)
     showPreciosProveedor.value = true 
  }
</script>
