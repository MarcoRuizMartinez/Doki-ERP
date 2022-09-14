<template>
  <q-table                      dense flat square wrap-cells
    v-model:selected            ="grupo.seleccion"
    table-header-class          ="bg-gris text-grey-10"
    row-key                     ="orden"
    class                       ="tabla-maco font-md"
    :selection                  ="acuerdo.estado === ESTADO_CTZ.BORRADOR ? 'multiple' : 'none'"
    :class                      ="$attrs.class"
    :rows                       ="grupo.productos"
    :columns                    ="columnas"
    :rows-per-page-options      ="[200, 400]"
    >
    <!-- //* ////////////////////////////////////////////////////////////// Botones editar en lote seleccion -->
    <template                   #header-cell-ref="props">
      <q-th :props              ="props">
        <btn-editar-lote
          :largo                ="grupo.seleccion.length"
          @click-editar         ="activarSeleccionEnLote"
          @click-borrar         ="activarBorrarEnLote"
        />
      </q-th>
    </template>    
    <!-- //* ////////////////////////////////////////////////////////////// Imagen y Nombre -->
    <template #body-cell-ref    ="props">
      <q-td   :props            ="props"
        :class                  ="props.row.class" >
        <div class              ="w-600px">
          <!-- //* //////////////////////////////////////////////////////// Imagen -->
          <imagen-producto      :linea="(props.row as LineaAcuerdo)"/>
          <!-- //* //////////////////////////////////////////////////////// Nombre-->
          <nombre-descripcion
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
      <subtotal-toggle :grupo   ="grupo" />
    </template>
  </q-table>
</template>
<script setup lang="ts">
  import {  ref,
            PropType,
            toRefs
                              } from "vue"
  import {  storeToRefs       } from 'pinia'
  import {  ILineaAcuerdo,
            LineaAcuerdo      } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  IColumna,
            Columna           } from "src/models/Tabla"
  import {  IGrupoLineas      } from "src/areas/acuerdos/models/GrupoLineasAcuerdo"
  import {  formatoPrecio,
            useTools          } from "src/useSimpleOk/useTools"
  
  
  import    btnEditarLote       from "./BotonesEditarEnLote.vue"  
  import    subtotalToggle      from "./SubtotalToggle.vue"
  import    precioTabla         from "./Columnas/ColumnaPrecioProductos.vue"
  import    imagenProducto      from "./Columnas/ImagenProducto.vue"
  import    nombreDescripcion   from "./Columnas/NombreDescripcion.vue"
  import    cantidad            from "./Columnas/Cantidad.vue"
  import    descuento           from "./Columnas/Descuento.vue"
  //import    formularioLinea     from "./FormularioLinea/FormularioLinea.vue"
  import    numeroPaso          from "components/utilidades/input/InputNumeroPaso.vue"
  import {  ESTADO_CTZ        } from "src/areas/acuerdos/cotizaciones/models/Cotizacion"
  import {  useApiDolibarr    } from "src/services/useApiDolibarr"
  import {  useStoreAcuerdo   } from 'src/stores/acuerdo'
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"            

  const { aviso               } = useTools()
  const { apiDolibarr         } = useApiDolibarr()
  
  const { borrarLineas         } = useControlProductos()  
  const storeAcuerdo            = useStoreAcuerdo()
  const { acuerdo,
          grupoElegido,
          modales,
          lineaElegida        } = storeToRefs(storeAcuerdo)
  const emit                    = defineEmits(["update:grupo", "editarSubTotales"])
  const props                   = defineProps({
    grupo:      { required: true,   type: Object as PropType< IGrupoLineas >  },
  })
  const { grupo               } = toRefs( props )

  const lineaSelect             = ref< ILineaAcuerdo    >( new LineaAcuerdo() )
  const ventanaEditarVarios     = ref< boolean >( false )

  const limpiarSeleccion        = ()=> { grupoElegido.value.seleccion = [] }


  const columnas: IColumna[]    = [
    new Columna           ({ name: "ref",           label: "Productos", sortable: false }),
    //new Columna           ({ name: "orden",                             sortable: false }),
    new Columna           ({ name: "qtyUnd",        label: "Cant",      sortable: false,  align: "right"}),
    Columna.ColumnaPrecio ({ name: "precioBase",    label: "Precio",    sortable: false,  clase: "text-grey-7"  }),
    Columna.ColumnaX100   ({ name: "descuentoX100", label: "Descu",     sortable: false  }),
    Columna.ColumnaPrecio ({ name: "precioFinal",   label: "$ Final",   sortable: false  }),
    Columna.ColumnaPrecio ({ name: "totalConDescu", label: "Total",     sortable: false,  clase: "text-bold"    }),
  ]
  //columnas.forEach( c =>  { c.sortable = false } )

  function activarSeleccionEnLote()
  {
    grupoElegido.value              = grupo.value
    modales.value.editarEnLote      = true    
  }

  function activarBorrarEnLote()
  {
    grupoElegido.value              = grupo.value
    borrarLineas()
  }

  function mostrarFormulario( linea : ILineaAcuerdo )
  {
    grupoElegido.value              = grupo.value
    lineaElegida.value              = linea
    modales.value.formulario        = true    
  }

  //( { cargarSiempre = false, demora = 0 } = paramDefault ) 

 

  function lineaEditada( lineaModificada : ILineaAcuerdo )
  {
    let i                           = grupo.value.productos.findIndex( p => p.orden == lineaModificada.orden )
    grupo.value.productos[i] = lineaModificada
    emitir()
  }

  function editarVariosOk()
  {
    ventanaEditarVarios.value   = false
    emitir()
  }

  function emitir()
  {
    emit("update:grupo", grupo.value)
  }






  //(e: 'cambio',         value: "editarSubTotales" | "moverGrupo" ): void




</script>
<style>
.w-600px{
  width: 600px;
}
</style>