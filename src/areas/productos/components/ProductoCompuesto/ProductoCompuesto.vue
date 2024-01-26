<script setup lang="ts">
  ////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            computed,
            onMounted
                                } from "vue"
  import {  VueDraggable        } from 'vue-draggable-plus'
  ////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from "pinia"
  import {  useStoreProducto    } from "src/stores/producto"
  import {  useStoreUser        } from 'src/stores/user'

  ////////////////////////////////////////////////////////////////////////// Modelos
  import {  IProductoHijo       } from 'src/areas/productos/models/ProductoHijo'

  ////////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesProductos   } from "src/areas/productos/services/servicesProductos"
  import {  useControlProductos } from "src/areas/productos/controllers/ControlProductosDolibarr"
  import {  ToolArray           } from "src/composables/useTools"
  import {  style               } from "src/composables/useEstilos"

  ////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana             from "components/utilidades/Ventana.vue"
  import    imagenProducto      from "src/areas/productos/components/Tools/ImagenProducto.vue"
  import    confirmar           from "components/utilidades/MenuConfirmar.vue"
  import    totales             from "./TotalesHijos.vue"
  import    precios             from "./PreciosHijo.vue"
  import    buscarProductos     from "./BuscarAgregarProductos.vue"
  import    numeroPaso          from "components/utilidades/input/InputNumeroPaso.vue"

  
  const { producto,
          loading               } = storeToRefs( useStoreProducto() )
  const { usuario               } = storeToRefs( useStoreUser() )

  const { buscarProductosHijos,
          ordenarProductosHijos,
          cambiarQtyHijo,
                                } = servicesProductos()

  const { editarProducto        } = useControlProductos()

  const showModalAgregar          = ref<boolean>(false)
  const productos                 = ref<IProductoHijo[]>([])
  const totalCompra               = computed( () => ToolArray.sumar( productos.value, "costoTotal"   ) )
  const totalVenta                = computed( () => ToolArray.sumar( productos.value, "precioTotal"  ) )
  
  onMounted( async ()=>{
    await cargarHijos()
  })

  async function cargarHijos(){
    productos.value                 = await buscarProductosHijos( producto.value.id )
  }

  async function reordenar()
  {
    for (let i = 0; i < productos.value.length; i++) {
      productos.value[ i ].orden = i + 1      
    }

    const listaIds = productos.value.map( p => p.relacion_id ).join()
    await ordenarProductosHijos( producto.value.id, listaIds )
  }

  async function cambiarQty( productoHijo : IProductoHijo )
  {
    producto.value.costo = totalCompra.value
    await cambiarQtyHijo( productoHijo.relacion_id, productoHijo.qty )
    await editarProducto( producto.value, "precio" )
  }
</script>


<template>
  <ventana
    class-contenido             ="column items-center"
    titulo                      ="Composición de producto"
    icono                       ="mdi-focus-field"
    padding-contenido           ="6px"
    :cargando                   ="loading.carga"
    >
    <template                   #barra>
      <q-btn                    round dense flat
        icon                    ="mdi-refresh"
        class                   ="op60 op100-hover"
        @click                  ="cargarHijos"
        >
        <Tooltip label          ="Recargar"/>
      </q-btn>
      <!-- //* ///////////////  Boton subir  -->
      <!-- v-if                    ="!puedeSubir && puedeEditar" -->
    </template>    
    <template #menu>
      <div class                ="row full-width">
        <!-- //* //////////////////////////////////////////////////////////////////// Boton agregar nuevo producto hijo -->
        <div class="col-grow">
          <q-btn                dense flat
            label               ="Nuevo"
            @click              ="showModalAgregar = true"
          />
        </div>
        <!-- //* //////////////////////////////////////////////////////////////////// Totales -->
        <totales
          :total-compra         ="totalCompra"
          :total-venta          ="totalVenta"
        />
      </div>
    </template>
    <vue-draggable
      v-model                   ="productos"
      :animation                ="150"
      handle                    =".handle"
      class                     ="column gap-xs full-width"
      @end                      ="reordenar"
      >
      <!-- //* //////////////////////////////////////////////////////////////////// Iterable Contenedor de productos-->
      <div
        v-for                   ="pHijo of productos"
        :key                    ="pHijo.hijo_id"  
        class                   ="row items-center fila q-px-sm gap-sm degradado-gris"
        >
        <!-- //* ////////////////////////////////////////////////////////////////// Imagen de producto -->
        <imagen-producto        mini
          class                 ="col-auto q-mr-sm"
          :imagen               ="pHijo.img"
          :nombre               ="pHijo.nombre"
        />
        <!-- //* ////////////////////////////////////////////////////////////////// Nombre y referencia -->
        <div class              ="col-shrink column">
          <span class="text-bold">{{ pHijo.ref }}</span>
          <span class="width450 ellipsis">{{ pHijo.nombre }}
            <Tooltip :label     ="pHijo.nombre"/>
          </span>
        </div>
        <!-- //* ////////////////////////////////////////////////////////////////// Cantidad -->
        <div>
          {{ pHijo.qty }} {{ pHijo.unidad.sigla }}
          <q-popup-edit         buttons    
            v-if                ="usuario.esProduccion || usuario.esGerencia"
            v-model             ="pHijo.qty"
            v-slot              ="scope"
            class               ="alto-min-100 width200"
            label-set           ="Editar"            
            @update:model-value ="cambiarQty(pHijo)"
            >
            <numero-paso
              v-model           ="scope.value"
              label             ="Cantidad"
              modo              ="right"
              :minimo           ="0.1"
              @enter            ="scope.set"
            />
          </q-popup-edit>          
        </div>
        <!-- //* ////////////////////////////////////////////////////////////////// Precio y Costo -->
        <precios :producto      ="pHijo"/>
        <!-- //* ////////////////////////////////////////////////////////////////// Icono Drag -->
        <q-icon
          name                  ="mdi-drag"
          size                  ="sm"
          class                 ="col-shrink handle cursor-move"
        />
      </div>
      <!-- //* ////////////////////////////////////////////////////////////////// Borrar producto -->
      <q-menu                   touch-position context-menu>
        <q-btn                  flat dense no-caps
          icon                  ="mdi-trash-can"
          label                 ="Borrar producto"          
          >
          <confirmar            @ok="console.log('Hola')"/>
        </q-btn>
      </q-menu>      
    </vue-draggable>
    <!-- //* ///////////////////////////////////////////////////////////// Modal Buscar productos -->
    <q-dialog                   maximized
      v-model                   ="showModalAgregar"
      v-bind                    ="style.dialogo"
      >
      <buscar-productos />
    </q-dialog> 
  </ventana>

<!--   :persistent               ="loading.añadir || loading.borrarLote"
      @hide                     ="grupoElegido.noDestacarProductos()" -->
</template>

<style scoped>
.fila{
  height: 50px;
}
</style>