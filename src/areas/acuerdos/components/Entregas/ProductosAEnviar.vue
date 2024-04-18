<template>
  <q-table                bordered dense flat hide-bottom
    class                 ="fit tabla-maco"
    row-key               ="lineaId"
    :rows                 ="entrega.productos"
    :columns              ="columnas"
    :rows-per-page-options="[200, 400]"
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
        <div>
          <span>{{props.row.nombre}}</span>
          <template v-if  ="props.row.acabado || !!props.row.seEntrega  || !!props.row.medida">
            <table  class ="tabla-info q-ml-xl">
              <!-- //* ////////////////////////////////////////////////// Acabado -->
              <tr v-if    ="!!props.row.acabado">
                <td>Acabado</td>
                <td>{{ props.row.acabado }}</td>                          
              </tr>
              <!-- //* ////////////////////////////////////////////////// Acabado -->
              <tr v-if    ="!!props.row.seEntrega">
                <td>Se entrega</td>
                <td>{{ props.row.seEntrega }}</td>                          
              </tr>
              <!-- //* ////////////////////////////////////////////////// Medida -->
              <tr v-if    ="!!props.row.medida">
                <td>Medida</td>
                <td>{{ props.row.medida }}</td>                          
              </tr>
            </table>
          </template>
        </div>
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