<template>
  <q-table                    dense
    v-model:selected          ="seleccion"    
    row-key                   ="id"
    selection                 ="multiple"
    table-header-class        ="q-my-md bg-gris text-bold shadow-1"
    :grid                     ="tipoVista === 'grilla'"
    :grid-header              ="tipoVista === 'grilla'"
    :rows                     ="productosFil"
    :columns                  ="columnas"
    :visible-columns          ="tipoVista === 'grilla' ? columnas.filter(c => c.visible).map(c=>c.name) : columnas.map(c=>c.name)"
    :filter                   ="filtro.filtroTexto"
    :hide-bottom              ="productos.length < 25"
    :rows-per-page-options    ="[100, 200, 500]"
    @update:selected          ="seleccionar"
    >
    <template                 #header-cell-ref
      v-if                    ="!modoBusqueda"
      >
      <input-filtro-texto />
    </template>
    <template                 #header-cell-precio="props">
      <input-filtro-precios/>
    </template>
    <template                 #item="props">
      <card-producto
        v-model:selected      ="props.selected"
        :producto             ="props.row"
        :selected-all         ="modoBusqueda"
        @mouse-largo          ="mouseLargo"
      />
    </template>

    <template v-slot:body-selection="scope">
      <q-checkbox
        v-model               ="scope.selected"
        :disable              ="!scope.row.activo && !modoBusqueda"
      />
    </template>

    <template #body-cell-sigla="props">
      <q-td :props            ="props">
        <imagen :producto     ="props.row"/>
        <btn-agregar
          v-if                ="!modoBusqueda"
          :producto           ="props.row"
          @click              ="emit('agregar', [ props.row ] )"
          @click-largo        ="()=> mouseLargo( props.row )"
        />
      </q-td>
    </template>
    <template #body-cell-precio="props">
      <q-td :props            ="props">
        <div class            ="text-right">
          {{ formatoPrecio(props.row.precio, "decimales-no") }}
        </div>
        <tooltip-precios
          :producto           ="props.row"
        />
      </q-td>
    </template>
  </q-table>    
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  toRefs              } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreProducto    } from 'src/stores/producto'  
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IColumna, Columna   } from "src/models/Tabla"
  import {  IProductoDoli       } from "src/areas/productos/models/ProductoDolibarr"  
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  formatoPrecio       } from "src/useSimpleOk/useTools"  
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    tooltipPrecios        from "src/areas/acuerdos/components/Tooltips/TooltipPreciosProducto.vue"
  import    inputFiltroTexto      from "src/areas/productos/components/TablaProductos/HeaderCell/FiltroTexto.vue"
  import    inputFiltroPrecios    from "src/areas/productos/components/TablaProductos/HeaderCell/FiltroPrecios.vue"
  import    cardProducto          from "src/areas/productos/components/TablaProductos/Columnas/CardProducto.vue"
  import    imagen                from "src/areas/productos/components/TablaProductos/Columnas/Imagen.vue"
  import    btnAgregar            from "src/areas/productos/components/TablaProductos/Columnas/BotonAgregar.vue"

  const { 
          filtro,
          seleccion,
          productos,
          productosFil,
                            } = storeToRefs( useStoreProducto() )  
  
  const props                 = defineProps({      
    tipoVista:    { required: true,     type: String },      
    modoBusqueda: { default:  false,    type: Boolean},
  })

  const { modoBusqueda  } = toRefs( props )

  const emit = defineEmits<{
    (e: "mouseLargoElegido",  value: IProductoDoli  ): void
    (e: "mouseLargoNuevo",    value: IProductoDoli[]): void
    (e: "agregar",            value: IProductoDoli[]): void
  }>()

  const columnas: IColumna[]  = [
    new Columna           ({ name: "sigla",   sortable: false, label: "Imagen",  visible: false }),
    new Columna           ({ name: "ref",     sortable: false, label: "Filtrar", clase: "text-bold" }),
    new Columna           ({ name: "nombre"                                     }),
    new Columna           ({ name: "precio",  sortable: false                   }),
  ]

  function mouseLargo( producto : IProductoDoli )
  {
    if( !producto.activo ) return

    if( producto.elegido )
      emit("mouseLargoElegido", producto)
    else
      emit("mouseLargoNuevo", [ producto ] )
  }
  
  function seleccionar( rows : readonly IProductoDoli[] ){
    seleccion.value   = rows.filter( p => p.activo || modoBusqueda.value )
  }
  //class                     ="bg-grey-3"
</script>