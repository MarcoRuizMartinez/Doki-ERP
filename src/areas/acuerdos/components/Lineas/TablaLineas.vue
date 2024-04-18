<template>
      <!-- 
      <q-grid                   dense flat bordered square 
        class                   ="fit tabla-maco"
        classes                 ="tabla-alto-min"
        :columns_filter         ="true"
        :data                   ="incentivos"
        :columns                ="columnas"
        >
        <template #body         ="props">
          <q-tr :props          ="props">
            <q-td key           ="origenRef">

            </q-td>
            <q-td key           ="estadoLabel">{{ props.row.estadoLabel }}</q-td>
            <q-td key           ="valor" class="text-bold fuente-mono text-right">{{ Format.precio( props.row.valor, 'decimales-no' )  }}</q-td>
            <q-td key           ="pagado" class="text-bold fuente-mono text-right">{{ Format.precio( props.row.pagado, 'decimales-no' )  }}</q-td>
            <q-td key           ="usuarioLabel"><chip-usuario :usuario="props.row.usuario"/></q-td>
            <q-td key           ="creadorLabel"><chip-usuario :usuario="props.row.creador"/></q-td>
            <q-td key           ="nota">{{ props.row.nota }}</q-td>
          </q-tr>
        </template>
      </q-grid> -->

  
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
            v-if                ="!props.row.urlImagen"
            class               ="col-shrink q-mr-sm"
            :imagen             ="props.row.img"
            :nombre             ="props.row.nombre"
          />
          <imagen
            v-else
            class               ="col-shrink q-mr-sm"
            :src                ="props.row.urlImagen"
            :nombre             ="props.row.nombre"
          />
          <!-- //* //////////////////////////////////////////////////////// Nombre-->
          <nombre-descripcion
            v-model             ="props.row"
            class               ="col"
            :class              ="{'cursor-pointer' : acuerdo.esEstadoNoValidado}"
            :es-validado        ="acuerdo.esEstadoValido"
            @click              ="mostrarFormulario( props.row as LineaAcuerdo )"
            @borrar-linea       ="borrarLineaMenu"
          />
        </div>
      </q-td>
    </template>
    <!-- //* ////////////////////////////////////////////////////////////// Cantidad -->
    <template #body-cell-qtyUnd ="props">
      <q-td>
        <cantidad
          v-model               ="props.row"
          :class                ="{'cursor-pointer' : acuerdo.esEstadoNoValidado}"
          :readonly             ="acuerdo.esEstadoValido"
        />
      </q-td>
    </template>
    <!-- //* ////////////////////////////////////////////////////////////// Descuento -->
    <template #body-cell-descuentoX100="props">
      <q-td :props="props">
        <descuento
          v-model               ="props.row"
          :class                ="{'cursor-pointer' : acuerdo.esEstadoNoValidado}"
          :readonly             ="acuerdo.esEstadoValido"
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
        v-if                    ="!acuerdo.esEntrega"
        :grupo                  ="grupo"
        :disable                ="!acuerdo.puedeCrearSubtotal"
      />
    </template>
  </q-table>
</template>
<script setup lang="ts">
  // ////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            toRefs,
            watch,
            PropType            } from "vue"
            
  // ////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreAcuerdo     } from 'stores/acuerdo'

  // ////////////////////////////////////////////////////////////////////// Models
  import {  IGrupoLineas        } from "src/areas/acuerdos/models/GrupoLineasAcuerdo"
  import {  ILineaAcuerdo,
            LineaAcuerdo        } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  IColumna,
            Columna             } from "src/models/Tabla"
            
  // ////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"

  // ////////////////////////////////////////////////////////////////////// Componentes
  import    precioTabla           from "src/areas/productos/components/Tools/PrecioProducto.vue"
  import    btnEditarLote         from "./Tools/BotonesEditarEnLote.vue"
  import    subtotalToggle        from "./Tools/SubtotalToggle.vue"
  import    imagenProducto        from "src/areas/productos/components/Tools/ImagenProducto.vue"
  import    imagen                from "components/utilidades/Imagen.vue"
  import    nombreDescripcion     from "./Columnas/NombreDescripcion.vue"
  import    cantidad              from "./Columnas/Cantidad.vue"
  import    descuento             from "./Columnas/Descuento.vue"

  const { borrarLinea,
          borrarLineas,
          seleccionarLineas,
          destacarLineaElegida,
          mostrarFormularioLinea
                              } = useControlProductos()
  const { acuerdo,
          grupoElegido,
          lineaElegida,
          modales             } = storeToRefs( useStoreAcuerdo() )
  const props                   = defineProps({
    grupo:      { required: true,   type: Object as PropType< IGrupoLineas >  },
  })
  const { grupo               } = toRefs( props )
  const columnas                = ref< IColumna[] >([])

  watch( () => acuerdo.value.tipo, crearColumnas, { immediate: true } )  

  function crearColumnas()
  {
    columnas.value              = [
      new Columna           ({ name: "ref",           label: "Productos", sortable: false }),
      new Columna           ({ name: "qtyUnd",        label: "Cant",      sortable: false,  align: "right"}),
      Columna.ColumnaPrecio ({ name: "precioBase",    label: "Precio",    sortable: false,  clase: "text-grey-7"  }),
      Columna.ColumnaX100   ({ name: "descuentoX100", label: "Descu",     sortable: false  }),
      Columna.ColumnaPrecio ({ name: "precioFinal",   label: "$ Final",   sortable: false  }),
      Columna.ColumnaPrecio ({ name: "totalConDescu", label: "Total",     sortable: false,  clase: "text-bold"    }),      
    ]
    
    if(acuerdo.value.esPedido && acuerdo.value.condicionPago.esGarantia){
      Columna.eliminarColums( ["precioBase", "descuentoX100", "precioFinal", "totalConDescu"], columnas.value )
    }

    if(acuerdo.value.esEntrega)
    {
      Columna.eliminarColums( ["qtyUnd", "precioBase", "descuentoX100", "precioFinal", "totalConDescu"], columnas.value )
      columnas.value.push( new Columna({ name: "qtyDeTotal",  label: "Cantidad",  sortable: false } ) )
      columnas.value.push( new Columna({ name: "bodegaLabel", label: "Bodega",  sortable: false } ) )
    }
  }



  function mostrarFormulario( linea : ILineaAcuerdo ){
    if(acuerdo.value.esEstadoValido) return
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

  async function borrarLineaMenu( linea : ILineaAcuerdo )
  {
    grupoElegido.value              = grupo.value
    lineaElegida.value              = linea
    const ok  = await borrarLinea( linea )    
    if(ok) destacarLineaElegida(false)
  }
</script>
<style>
.w-600px{
  width: 600px;
}
</style>
