<template>
<div class="list-group-item" >

  <!-- //* ///////////////////////////////////////////////////////////////////// PRODUCTO O SERVICIO -->
  <div
    v-if                      ="producto.tipoLinea === 'producto' || producto.tipoLinea === 'servicio'"
    >
    {{producto.ref}} - {{producto.nombre}}
  </div>
  <!-- //* /////////////////////////////////////////////////////////////////////////// TITULO -->
  <div
    v-else-if                 ="producto.tipoLinea === 'titulo'"
    >
    Titulo:
    {{producto.nombre}}

  </div>
  <!-- //* /////////////////////////////////////////////////////////////////////////// SUBTOTAL -->
  <div
    v-else-if                 ="producto.tipoLinea === 'subtotal'"
    >
    Es un subtotal

  </div>
  <!-- //* /////////////////////////////////////////////////////////////////////////// DESCRIPCION -->
<div
    v-else-if                 ="producto.tipoLinea === 'descripcion'"
    >
    Es un descripcion

  </div>
  </div>
</template>
<script setup lang="ts">
  import {  ref,
            PropType,
            toRefs
                              } from "vue"
  import {  ILineaAcuerdo,
            LineaAcuerdo      } from "src/areas/acuerdos/.models/LineaAcuerdo"



  const props                   = defineProps({
    producto: { required: true, type: Object as PropType< any > },
  })
</script>