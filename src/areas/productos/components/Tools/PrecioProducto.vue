<script lang="ts" setup>
  import {  ref,
            toRefs,
            PropType,
            computed,
                              } from "vue"
  import {  Format,
            ToolNum           } from "src/composables/useTools"
  const props                   = defineProps({
    precio:   { required: true,   type: Number  },
    iva:      { required: true,   type: Number  },
    negrita:  { default: false,   type: Boolean },
    alineado: { default: "right", type: String as PropType< "left" | "right" | "justify" | "center" > },
  })
  const { precio, iva }         = toRefs(props)
  const precioConIva            = computed(()=>{
    if(iva.value <= 0)
      return precio.value
    else
      return ToolNum.X100_Aumento(precio.value, iva.value)
  })
</script>

<template>
  <div
    class     ="fuente-mono"
    :class    ="'text-' + alineado + ( negrita ? ' text-bold' : '' )"
    >
    <div>
      {{Format.precio(precio)}}
    </div>
    <div class="text-grey-6">
      {{Format.precio(precioConIva)}}
    </div>
    <Tooltip>
      <table    class         ="tabla-totales text-1_2em">
        <tr><td>Precio sin IVA: </td><td>{{ Format.precio( precio )}}</td></tr>
        <tr><td>Precio con IVA: </td><td>{{ Format.precio( precioConIva )}}</td></tr>           
        <tr><td>IVA:            </td><td>{{ iva }} %</td></tr>
      </table>
    </Tooltip>
  </div>
  
</template>