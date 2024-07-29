<template>
  <ventana
    class-contenido             ="column items-center"
    icono                       ="mdi-focus-field"
    icono-sin-resultados        ="mdi-focus-field"
    padding-contenido           ="6px"
    size-icon-carga             ="200px"
    height-card-min             ="250px"
    mensaje-sin-resultados      ="Sin productos que lo compongan"
    :class                      ="$attrs.class"
    :titulo                     ="`Composición de producto (${productos.length})`"
    :cargando                   ="loading.carga"
    :modo                       ="modo"
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
      <div
        class                   ="row full-width items-center"
        style                   ="height: 45px;"
        >
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
          v-if                  ="!!productos.length"
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
        class                   ="row justify-between items-center fila q-px-sm degradado-gris"
        >
        <!-- //* ////////////////////////////////////////////////////////////////// Imagen de producto -->
        <imagen-producto
          class                 ="col-auto q-mr-sm"
          size                  ="xs"
          :imagen               ="pHijo.img"
          :nombre               ="pHijo.nombre"
        />
        <!-- //* ////////////////////////////////////////////////////////////////// Nombre y referencia -->
        <div class              ="col-auto column">
          <router-link
            class               ="link-limpio text-bold fuente-mono text-0_8em text-grey-9"
            :to                 ="'/productos/' + pHijo.id"
            >
            {{pHijo.ref}}
          </router-link>
          <span class           ="width370 ellipsis">{{ pHijo.nombre }}
            <Tooltip>
              <b>{{ pHijo.nombre }}</b><br/>
              {{ pHijo.naturaleza.label }}
            </Tooltip> 
          </span>
        </div>
        <!-- //* ////////////////////////////////////////////////////////////////// Cantidad -->
        <div class              ="width80 text-right fuente-mono">
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
          class                 ="width160"
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
  </ventana>
  <!-- //* ///////////////////////////////////////////////////////////// Modal Buscar productos -->
  <q-dialog                     maximized
    v-model                     ="showModalAgregar"
    v-bind                      ="style.dialogo"
    >      
    <buscar-productos
      @productos-add            ="agregarProductos"
      @busqueda-ok              ="buscarSiProductosEsta"
      @borrar                   ="borrarProducto"
      @cerrar                   ="cerrar"
    />
  </q-dialog>
</template>


<script setup lang="ts">
  ////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            computed,
            watch,
            onMounted
                                } from "vue"
  import {  VueDraggable        } from 'vue-draggable-plus'
  ////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from "pinia"
  import {  useStoreProducto    } from "stores/producto"
  import {  useStoreUser        } from 'stores/user'

  ////////////////////////////////////////////////////////////////////////// Modelos
  import {  IProductoHijo       } from 'src/areas/productos/models/ProductoHijo'
  import {  IProductoDoli       } from 'src/areas/productos/models/ProductoDolibarr'
  import {  TModosVentana       } from "src/models/TiposVarios"
  
  ////////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesProductos   } from "src/areas/productos/services/servicesProductos"
  import {  useControlProductos } from "src/areas/productos/controllers/ControlProductos"
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
  const modo                      = ref< TModosVentana >("buscando")
  const totalCompra               = computed( () => ToolArray.sumar( productos.value, "costoTotal"   ) )
  const totalVenta                = computed( () => ToolArray.sumar( productos.value, "precioTotal"  ) )
  
  onMounted( async ()=>{
    await cargarHijos()
  })

  watch( ()=>producto.value.id, cargarHijos )

  async function cargarHijos(){
    modo.value                    = "buscando"
    productos.value               = await buscarProductosHijos( producto.value.id )    
    actualizarModo()
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
    let totalAgregados                = 0

    for (const hijo of productoAdd)
    {
      const yaExiste                  = productos.value.some( p => p.id === hijo.id )
      if(yaExiste) continue
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
        totalAgregados++
      }
      else{
        todoOk                        = false
        aviso( "negative", "Error al añadir producto hijo " + hijo.nombre)
      }
    }

    if(todoOk && !!totalAgregados)
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
    actualizarModo()
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

  function actualizarModo()
  {
    modo.value                    = !!productos.value.length ? "normal" : "sin-resultados"
  }

</script>

<style scoped>
.fila{
  height: 50px;
}
</style>