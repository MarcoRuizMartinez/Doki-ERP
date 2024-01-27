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
  import {  IProductoDoli       } from 'src/areas/productos/models/ProductoDolibarr'

  ////////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesProductos   } from "src/areas/productos/services/servicesProductos"
  import {  useControlProductos } from "src/areas/productos/controllers/ControlProductosDolibarr"
  import {  useApiDolibarr      } from "src/composables/useApiDolibarr"
  import {  Tool,
            ToolArray, useTools } from "src/composables/useTools"
  import {  style               } from "src/composables/useEstilos"

  ////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana             from "components/utilidades/Ventana.vue"
  import    imagenProducto      from "src/areas/productos/components/Tools/ImagenProducto.vue"
  import    confirmar           from "components/utilidades/MenuConfirmar.vue"
  import    totales             from "./TotalesHijos.vue"
  import    precios             from "./PreciosHijo.vue"
  import    buscarProductos     from "src/areas/productos/components/Busqueda/BusquedaYAgregarProductos.vue"
  import    numeroPaso          from "components/utilidades/input/InputNumeroPaso.vue"

  const { producto,
          productos : productosBusqueda,
          loading               } = storeToRefs( useStoreProducto() )
  const { usuario               } = storeToRefs( useStoreUser() )

  const { buscarProductosHijos,
          ordenarProductosHijos,
          cambiarQtyHijo        } = servicesProductos()

  const { editarProducto        } = useControlProductos()
  const { apiDolibarr           } = useApiDolibarr()
  const { aviso                 } = useTools()

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

  async function agregarProductos( productoAdd : IProductoDoli[], cantidad : number = 1 )
  {
    loading.value.añadir              = true
    let todoOk                        = true
    let orden                         = productos.value.length

    for (const hijo of productoAdd)
    {
      orden++
      const objeto                    = {  subproduct_id : hijo.id,
                                           qty           : cantidad,
                                           incdec        : 1,
                                           rang          : orden,
                                         }

      const { ok, data }              = await apiDolibarr("crear", "producto-hijo", objeto, producto.value.id)

      if(ok)
      {
        const hijoPush                = hijo.getComoProductoHijo
              hijoPush.padre_id       = producto.value.id
              hijoPush.qty            = cantidad 
              hijoPush.orden          = orden
        productos.value.push( hijoPush )
        producto.value.costo          = totalCompra.value
      }
      else{
        todoOk                        = false
        aviso( "negative", "Error al añadir producto hijo " + hijo.nombre)
      }
    }

    if(todoOk)
    {
      await Tool.pausa( 100 )
      await editarProducto( producto.value, "precio" )
    }

    loading.value.añadir              = false
    cargarHijos()
  }

  async function borrarProducto( idHijo : number )
  {
    const { ok  }                     = await apiDolibarr("borrar", "producto-hijo", idHijo, producto.value.id)

    if(ok){
      const index                     = productos.value.findIndex( p => p.id === idHijo )
      productos.value.splice(index, 1)
      aviso("positive", "Producto hijo borrado")
    }
    else{
      aviso("negative", "Error al eliminar producto hijo")
    }

    buscarSiProductosEsta()
  }

  function buscarSiProductosEsta()
  {
    productosBusqueda.value.forEach( p => {
      p.elegido = productos.value.some( h => p.ref == h.ref )
    })
  }

  function cerrar(){
    showModalAgregar.value  = false
  }

</script>


<template>
  <ventana
    class-contenido             ="column items-center"
    :titulo                     ="`Composición de producto (${productos.length})`"
    icono                       ="mdi-focus-field"
    padding-contenido           ="6px"
    :cargando                   ="loading.carga"
    >
    <!-- //* ///////////////////////////////////////////////////////////////////////// Boton recargar -->
    <template                   #barra>
      <q-btn                    round dense flat
        icon                    ="mdi-refresh"
        class                   ="op60 op100-hover"
        @click                  ="cargarHijos"
        >
        <Tooltip label          ="Recargar"/>
      </q-btn>      
    </template>    
    <template #menu>
      <div class                ="row full-width items-center">
        <!-- //* //////////////////////////////////////////////////////////////////// Boton agregar nuevo producto hijo -->
        <div class              ="col-grow">
          <q-btn
            v-if                ="usuario.esProduccion || usuario.esGerencia"
            v-bind              ="style.btnBaseMd"
            label               ="Agregar"
            color               ="primary"
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
        <div class              ="col-grow column">
          <router-link
            class               ="link-limpio text-bold fuente-mono text-0_8em text-grey-9"
            :to                 ="'/productos/' + pHijo.id"
            >
            {{pHijo.ref}}
          </router-link>
          <span class           ="width400 ellipsis">{{ pHijo.nombre }}
            <Tooltip :label     ="pHijo.nombre"/>
          </span>
        </div>
        <!-- //* ////////////////////////////////////////////////////////////////// Cantidad -->
        <div class              ="width50">
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
        <precios
          class                 ="width110"
          :producto             ="pHijo"
        />
        <!-- //* ////////////////////////////////////////////////////////////////// Icono Drag -->
        <q-icon
          name                  ="mdi-drag"
          size                  ="sm"
          class                 ="col-shrink handle cursor-move op30 op100-hover"
        />
        <!-- //* ////////////////////////////////////////////////////////////////// Borrar producto -->
        <q-menu                 touch-position context-menu>
          <q-btn                flat dense no-caps
            icon                ="mdi-trash-can"
            label               ="Borrar producto"
            >
            <confirmar          @ok="()=>borrarProducto( pHijo.id )"/>
          </q-btn>
        </q-menu>
      </div>
    </vue-draggable>
    <!-- //* ///////////////////////////////////////////////////////////// Modal Buscar productos -->
    <q-dialog                   maximized
      v-model                   ="showModalAgregar"
      v-bind                    ="style.dialogo"
      >
      <buscar-productos
        @productos-add          ="agregarProductos"
        @busqueda-ok            ="buscarSiProductosEsta"
        @borrar                 ="borrarProducto"
        @cerrar                 ="cerrar"
      />
    </q-dialog> 
  </ventana>
</template>

<style scoped>
.fila{
  height: 50px;
}
</style>