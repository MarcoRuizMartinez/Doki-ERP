<template>
  <q-table                bordered dense flat hide-bottom
    class                 ="fit tabla-maco"
    row-key               ="lineaId"
    :rows                 ="entrega.productos"
    :columns              ="columnas"
    >
    <!-- //* ///////////////  Columna ref  -->
    <template
      #body-cell-ref      ="props"
      >
      <q-td :props        ="props" class="text-0_8em q-ma-none q-pa-none">
        <imagen-producto  float
          class           ="col-shrink q-mr-sm"
          size            ="xs"
          :imagen         ="props.row.img"
          :nombre         ="props.row.nombre"
        />
        <div class        ="row q-ma-none q-pa-none">
          <div class      ="col-8 q-ma-none q-pa-none">
            <span class   ="fuente-mono">{{props.row.qtyDeTotal}}</span> 
            <span class   ="text-bold q-ml-sm">{{props.row.ref}}</span>
          </div>
          <div class      ="col-4 text-grey-7 text-0_8em text-right q-ma-none q-pa-none">
            {{props.row.bodega.label}}
            <q-icon name  ="mdi-home-city"/>
            <Tooltip>{{ 'Bodega: ' + props.row.bodega.label }}</Tooltip>
          </div>
        </div>
        <div>{{props.row.nombre}}</div>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  //* /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAcuerdo              } from "../../models/Acuerdo"
  import {  IColumna,
            Columna               } from "src/models/Tabla"

  //* ///////////////////////////////////////////////////////////////////////////// Componentes
  import    imagenProducto          from "src/areas/productos/components/Tools/ImagenProducto.vue"

  type TProps                       = { entrega : IAcuerdo}
  const { entrega }                 = defineProps<TProps>()

  const columnas: IColumna[]  = [
    new Columna({ name: "ref",        label: "Producto"  })
  ]
</script>