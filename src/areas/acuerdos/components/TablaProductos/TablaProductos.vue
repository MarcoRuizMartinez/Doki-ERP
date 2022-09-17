<template>
  <q-table                      dense flat square wrap-cells
    v-model:selected            ="grupo.seleccion"
    table-header-class          ="bg-gris text-grey-10"
    row-key                     ="orden"
    class                       ="tabla-maco font-md"
    :selection                  ="acuerdo.esEstadoNoValidado ? 'multiple' : 'none'"
    :class                      ="$attrs.class"
    :rows                       ="grupo.productos"
    :columns                    ="columnas"
    :rows-per-page-options      ="[200, 400]"
    @selection                  ="seleccionarLineas(grupo)"
    >
    <!-- //* ////////////////////////////////////////////////////////////// Botones editar en lote seleccion -->
    <template                   #header-cell-ref="props">
      <q-th :props              ="props">
        <btn-editar-lote
          :largo                ="grupo.seleccion.length"
          @click-editar         ="activarEdicionEnLote"
          @click-borrar         ="activarBorrarEnLote"
        />
      </q-th>
    </template>
    <!-- //* ////////////////////////////////////////////////////////////// Imagen y Nombre -->
    <template #body-cell-ref    ="props">
      <q-td   :props            ="props"
        :class                  ="props.row.class" >
        <div class              ="w-600px row">
          <!-- //* //////////////////////////////////////////////////////// Imagen -->
          <imagen-producto
            class               ="col-shrink q-mr-sm"
            :linea              ="(props.row as LineaAcuerdo)"
          />
          <!-- //* //////////////////////////////////////////////////////// Nombre-->
          <nombre-descripcion
            class               ="col"
            :linea              ="(props.row as LineaAcuerdo)"
            @click              ="mostrarFormulario( props.row as LineaAcuerdo )"
          />
        </div>
      </q-td>
    </template>
    <!-- //* ////////////////////////////////////////////////////////////// Cantidad -->
    <template #body-cell-qtyUnd ="props">
      <q-td>
        <cantidad
          v-model               ="props.row"
          :estado               ="acuerdo.estado"
        />
      </q-td>
    </template>
    <!-- //* ////////////////////////////////////////////////////////////// Descuento -->
    <template #body-cell-descuentoX100="props">
      <q-td :props="props">
        <descuento
          v-model               ="props.row"
          :estado               ="acuerdo.estado"
        />
      </q-td>
    </template>
    <!-- //* ////////////////////////////////////////////////////////////// Precio base -->
    <template #body-cell-precioBase ="props">
      <q-td :props="props">
        <precio-tabla
          :precio               ="(props.row.precioBase   as number)"
          :iva                  ="(props.row.iva          as number)"
        />
      </q-td>
    </template>
    <!-- //* ////////////////////////////////////////////////////////////// Precio final -->
    <template #body-cell-precioFinal="props">
      <q-td :props="props">
        <precio-tabla
          :precio               ="(props.row.precioFinal  as number)"
          :iva                  ="(props.row.iva          as number)"
        />
      </q-td>
    </template>
    <!-- //* ////////////////////////////////////////////////////////////// Total con descuento -->
    <template #body-cell-totalConDescu="props">
      <q-td :props="props">
        <precio-tabla           negrita
          :precio               ="(props.row.totalConDescu  as number)"
          :iva                  ="(props.row.iva            as number)"
        />
      </q-td>
    </template>
    <!-- //* ////////////////////////////////////////////////////////////// Footer activar subtotal -->
    <template                   #bottom>
      <subtotal-toggle
        :grupo                  ="grupo"
        :disable                ="!acuerdo.puedeCrearSubtotal"
      />
    </template>
  </q-table>
</template>
<script setup lang="ts">
  // ////////////////////////////////////////////////////////////////////// Core
  import {  toRefs, PropType  } from "vue"
  // ////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs       } from 'pinia'
  import {  useStoreAcuerdo   } from 'src/stores/acuerdo'
  // ////////////////////////////////////////////////////////////////////// Models
  import {  IGrupoLineas      } from "src/areas/acuerdos/models/GrupoLineasAcuerdo"
  import {  ILineaAcuerdo,
            LineaAcuerdo      } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  IColumna,
            Columna           } from "src/models/Tabla"
  // ////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  // ////////////////////////////////////////////////////////////////////// Componentes
  import    btnEditarLote       from "./BotonesEditarEnLote.vue"
  import    subtotalToggle      from "./SubtotalToggle.vue"
  import    precioTabla         from "./Columnas/ColumnaPrecioProductos.vue"
  import    imagenProducto      from "./Columnas/ImagenProducto.vue"
  import    nombreDescripcion   from "./Columnas/NombreDescripcion.vue"
  import    cantidad            from "./Columnas/Cantidad.vue"
  import    descuento           from "./Columnas/Descuento.vue"

  const { borrarLineas,
          seleccionarLineas,
          mostrarFormularioLinea
                              } = useControlProductos()
  const { acuerdo,
          grupoElegido,
          modales             } = storeToRefs( useStoreAcuerdo() )
  const props                   = defineProps({
    grupo:      { required: true,   type: Object as PropType< IGrupoLineas >  },
  })
  const { grupo               } = toRefs( props )
  const columnas: IColumna[]    = [
    new Columna           ({ name: "ref",           label: "Productos", sortable: false }),
    new Columna           ({ name: "qtyUnd",        label: "Cant",      sortable: false,  align: "right"}),
    //new Columna           ({ name: "orden",                             sortable: false }),
    Columna.ColumnaPrecio ({ name: "precioBase",    label: "Precio",    sortable: false,  clase: "text-grey-7"  }),
    Columna.ColumnaX100   ({ name: "descuentoX100", label: "Descu",     sortable: false  }),
    Columna.ColumnaPrecio ({ name: "precioFinal",   label: "$ Final",   sortable: false  }),
    Columna.ColumnaPrecio ({ name: "totalConDescu", label: "Total",     sortable: false,  clase: "text-bold"    }),
  ]

  function mostrarFormulario( linea : ILineaAcuerdo ){
    mostrarFormularioLinea( linea, grupo.value )
  }

  // * ////////////////////////////////////////////////// Activar edicion en lote
  function activarEdicionEnLote(){
    grupoElegido.value              = grupo.value
    modales.value.editarEnLote      = true
  }

  // * ////////////////////////////////////////////////// Activar borrar en lote
  function activarBorrarEnLote(){
    grupoElegido.value              = grupo.value
    borrarLineas()
  }
</script>
<style>
.w-600px{
  width: 600px;
}
</style>
