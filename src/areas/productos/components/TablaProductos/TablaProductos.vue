<template>
  <q-table                    dense bordered flat
    v-model:selected          ="seleccion"    
    row-key                   ="id"
    selection                 ="multiple"
    class                     ="fit tabla-maco tabla-alto-min"
    table-header-class        ="q-my-md bg-gris text-bold shadow-1"
    :grid                     ="tipoVista === 'grilla'"
    :grid-header              ="tipoVista === 'grilla'"
    :rows                     ="productosFil"
    :columns                  ="columnas"
    :filter                   ="busqueda.f.filtroTexto"
    :hide-bottom              ="productos.length < 25"
    :rows-per-page-options    ="[100, 200, 500]"
    @update:selected          ="seleccionar"
    >
    <!-- :visible-columns          ="tipoVista === 'grilla' ? columnas.filter(c => c.visible).map(c=>c.name) : columnas.map(c=>c.name)" -->
    <!-- //* ///////////////////////////////////////////////////// Filtro busqueda en columna -->
    <template                 #header-cell-ref
      v-if                    ="!modoBusqueda"
      >
      <input-filtro-texto />
    </template>
    <!-- //* ///////////////////////////////////////////////////// Filtro precios en columna -->
    <template                 #header-cell-precio="props">
      <input-filtro-precios/>
    </template>
    <!-- //* ///////////////////////////////////////////////////// Checbox vista lista -->
    <template v-slot:body-selection="scope">
      <q-checkbox
        v-model               ="scope.selected"
        :disable              ="!scope.row.activo && !modoBusqueda"
      />
    </template>    
    <template #body-cell-sigla="props">
      <q-td :props            ="props">
        <!-- //* ///////////////////////////////////////////////// Imagen  -->
        <imagen :producto     ="props.row"/>        
        <template v-if        ="modoBusqueda">
          <q-btn              
            v-bind            ="style.btnRedondoFlat"
            icon              ="mdi-alpha-d-circle"
            target            ="_blank"
            :href             ="props.row.urlDolibarr"
          />
          <q-btn              
            v-bind            ="style.btnRedondoFlat"
            icon              ="mdi-lead-pencil"
            @click            ="emit('clickEditar', props.row)"
          />
        </template>
        <!-- //* ///////////////////////////////////////////////// Boton agregar en lista  -->
        <btn-agregar          v-else
          :producto           ="props.row"
          @click              ="emit('agregar', [ props.row ] )"
          @click-largo        ="()=> mouseLargo( props.row )"
        />
      </q-td>
    </template>
    <!-- //* ///////////////////////////////////////////////////// Ref con link -->
    <template #body-cell-ref  ="props">
      <q-td :props            ="props">        
        <router-link
          class               ="link-limpio text-bold fuente-mono text-1_1em"
          :to                 ="'/productos/' + props.row.id"
          >
          {{props.row.ref}}
        </router-link>
      </q-td>
    </template>
    <!-- //* ///////////////////////////////////////////////////// Columna precio  -->
    <template #body-cell-precio="props">
      <q-td :props            ="props">
        <precio-tabla
          :precio               ="(props.row.precio_publico as number)"
          :iva                  ="(props.row.iva            as number)"
        />        
      </q-td>
    </template>
    <!-- //* ///////////////////////////////////////////////////// Vista Card de producto -->
    <template                 #item="props">
      <card-producto
        v-model:selected      ="props.selected"
        :producto             ="props.row"
        :selected-all         ="modoBusqueda"
        @mouse-largo          ="mouseLargo"
      />
    </template>    
  </q-table>    
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  toRefs, PropType    } from "vue"
  import {  useRouter           } from 'vue-router'
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreProducto    } from 'src/stores/producto'  
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IColumna, Columna   } from "src/models/Tabla"
  import {  IProductoDoli       } from "src/areas/productos/models/ProductoDolibarr"  
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  formatoPrecio       } from "src/useSimpleOk/useTools"
  import {  style               } from "src/useSimpleOk/useEstilos"  
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  //import    tooltipPrecios        from "src/areas/acuerdos/components/Tools/Tooltips/TooltipPreciosProducto.vue"
  import    inputFiltroTexto      from "src/areas/productos/components/TablaProductos/HeaderCell/FiltroTexto.vue"
  import    inputFiltroPrecios    from "src/areas/productos/components/TablaProductos/HeaderCell/FiltroPrecios.vue"
  import    cardProducto          from "src/areas/productos/components/TablaProductos/Columnas/CardProducto.vue"
  import    imagen                from "src/areas/productos/components/TablaProductos/Columnas/Imagen.vue"
  import    btnAgregar            from "src/areas/productos/components/TablaProductos/Columnas/BotonAgregar.vue"
  import    precioTabla           from "src/areas/productos/components/Tools/PrecioProducto.vue"

  const { 
          busqueda,
          seleccion,
          productos,
          productosFil,
                            } = storeToRefs( useStoreProducto() )  
  const router                = useRouter()  
  const props                 = defineProps({      
    tipoVista:    { required: true,     type: String },
    modoBusqueda: { default:  false,    type: Boolean},
    columnas:     { required: true,     type: Array as PropType<IColumna[]> },
  })

  const { modoBusqueda  } = toRefs( props )

  const emit = defineEmits<{
    (e: "mouseLargoElegido",  value: IProductoDoli  ): void
    (e: "mouseLargoNuevo",    value: IProductoDoli[]): void
    (e: "agregar",            value: IProductoDoli[]): void
    (e: "clickEditar",        value: IProductoDoli): void
  }>()

  function mouseLargo( producto : IProductoDoli )
  {
    if(modoBusqueda.value)
      router.push("/productos/" + producto.id)
          
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

<style>
.q-table__middle {
  min-height: auto !important;
}
</style>