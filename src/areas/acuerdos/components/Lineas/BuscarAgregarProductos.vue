<template>
  <ventana                    cerrar full-screen scroll
    titulo                    ="Buscar"
    icono                     ="mdi-magnify"
    class-contenido           ="row justify-start"
    mensaje-sin-resultados    ="No se encontraron productos o servicios"
    padding-contenido         ="0"
    size-icon-carga           ="28vw"
    :modo                     ="modo"
    :cargando                 ="loading.añadir || loading.borrarLote"
    @cerrar                   ="cerrar"
    >
    <template                 #barra>
      <grilla-lista
        v-model               ="tipoVista"
      />
      <q-btn                  round push glossy
        icon                  ="mdi-refresh-circle"
        padding               ="0"
        class                 ="lt-md"
        color                 ="primary"
        :disable              ="!productos.length"
        :loading              ="modo == 'buscando'"
        @click                ="buscar"
        size                  ="1.1em"
        >
        <Tooltip label        ="Recargar"/>
      </q-btn>
    </template>
    <template                 #menu>
      <div class              ="row col gap-pa-md">
        <!-- //* ///////////////////////////////////////////////////////////// Campo buscar -->
        <input-buscar         autofocus clearable hundido
          v-model             ="busquedaTxt"
          label               ="Buscar.."
          class               ="col-md-2 col-6"
          @clear              ="buscar"
          @update:model-value ="editarBusqueda"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Campo Categoría -->
        <select-label-value   use-input hundido clearable flat bordered
          v-model             ="categoria"
          label               ="Categoría"
          icon                ="mdi-file-tree-outline"
          class               ="col-md-2 col-6"
          options-sort        ="nombre"
          :options            ="categorias"
          @update:model-value ="buscar"
        />
        <input-number         hundido clearable
          v-model             ="precioMinQuery"
          label               ="Precio mínimo "
          icon                ="mdi-currency-usd"
          class               ="col-md-2 col-6"
          :paso               ="10000"
          :minimo             ="0"
          :maximo             ="precioMaxQuery"
        />
        <input-number         hundido clearable
          v-model             ="precioMaxQuery"
          label               ="Precio máximo"
          icon                ="mdi-currency-usd"
          class               ="col-md-2 col-6"
          :paso               ="10000"
          :minimo             ="!!precioMinQuery ? precioMinQuery : 0"
        />
        <input-number         con-decimales hundido clearable
          v-model             ="cantidad"
          label               ="Cantidad"
          icon                ="mdi-counter"
          class               ="col-md-2 col-6"
          :paso               ="1"
          :minimo             ="0.1"
          :maximo             ="1000"
        />
        <q-toggle
          v-model             ="soloConImagen"
          label               ="Solo con imagen"
          @update:model-value ="buscar"
        />
        <!--
        <input-number         con-decimales hundido clearable
          v-model             ="descuento"
          label               ="Descuento"
          icon                ="mdi-percent-outline"
          class               ="col-md-2 col-6"
          :paso               ="0.1"
          :minimo             ="0"
          :maximo             ="100"
        />
        -->
      </div>
      <q-btn                  round push glossy
        icon                  ="mdi-refresh"
        padding               ="0"
        size                  ="1.4em"
        class                 ="gt-sm col-auto"
        color                 ="primary"
        :disable              ="!productos.length"
        :loading              ="modo == 'buscando'"
        @click                ="buscar"
        >
        <Tooltip label        ="Recargar"/>
      </q-btn>
    </template>
    <div  class               ="bg-grey-3 fit">
      <tabla
        :tipo-vista           ="tipoVista"
        :columnas             ="columnas"
        @agregar              ="agregarProductosAControl"
        @mouse-largo-nuevo    ="agregarProductosAControl"
        @mouse-largo-elegido  ="eliminarLineaDesdeBusqueda"
      />
    </div>
    <q-page-sticky
      position                ="bottom-right"
      :offset                 ="[25, 25]"
      >
      <efecto efecto          ="UpDown">
        <q-btn                fab-mini
          v-if                ="!!seleccion.length"
          icon                ="mdi-plus"
          color               ="primary"
          @click              ="agregarProductosAControl( seleccion )"
          >
          <q-tooltip
            class             ="bg-black text-caption"
            anchor            ="center left"
            self              ="center end"
            >
            Añadir producto
          </q-tooltip>
          <q-badge color="red" floating>{{seleccion.length}}</q-badge>
        </q-btn>
      </efecto>
    </q-page-sticky>
  </ventana>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref, watch          } from "vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'
  import {  useStoreUser        } from 'src/stores/user'
  import {  useStoreProducto    } from 'src/stores/producto'
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  ILineaAcuerdo       } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  ModosVentana        } from "src/models/TiposVarios"
  import {  ICategoriaProducto,
            CategoriaProducto   } from "src/areas/productos/models/CategoriaProducto"
  import {  IProductoDoli       } from "src/areas/productos/models/ProductoDolibarr"
  import {  IQueryProducto      } from "src/areas/productos/models/BusquedaProductos"
  import {  IColumna, Columna   } from "src/models/Tabla"
// * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  import {  servicesProductos   } from "src/areas/productos/services/servicesProductos"
  import {  dexieCategoriasProducto
                                } from "src/composables/useDexie"
  import {
            sortArray,
            useTools,
                                } from "src/composables/useTools"
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    efecto                from "components/utilidades/Efecto.vue"
  import    ventana               from "components/utilidades/Ventana.vue"
  import    grillaLista           from "components/utilidades/ToggleGrillaLista.vue"
  import    inputBuscar           from "components/utilidades/input/InputSimple.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    tabla                 from "src/areas/productos/components/TablaProductos/TablaProductos.vue"
  const emit = defineEmits<{
    (e: 'cerrar',         value: void           ): void
    (e: 'addLineas',      value: ILineaAcuerdo[]): void
  }>()

  const columnas: IColumna[]  = [
    new Columna           ({ name: "sigla",   sortable: false, label: "Producto",  visible: false }),
    new Columna           ({ name: "ref",     sortable: false, label: "Filtrar",  clase: "text-bold" }),
    new Columna           ({ name: "nombre"                                     }),
    new Columna           ({ name: "precio",  sortable: false                   }),
  ]


  const tipoVista             = ref<"grilla" | "lista">("grilla")

  const { aviso             } = useTools()
  const { agregarProductos,
          borrarLineas      } = useControlProductos()
  const { grupoElegido,
          modales,
          loading           } = storeToRefs( useStoreAcuerdo() )
  const { usuario           } = storeToRefs( useStoreUser() )
  const busquedaTxt           = ref< string   >("")
  const modo                  = ref< ModosVentana >("esperando-busqueda")
  const categoria             = ref< ICategoriaProducto  >( new CategoriaProducto() )

  const { buscarProductos   } = servicesProductos()
  const categorias            = dexieCategoriasProducto({ cargarSiempre : true})

  const {
          productos,
          productosFil,
          seleccion,
          //busqueda,
                            } = storeToRefs( useStoreProducto() )

  const precioMinQuery        = ref < number >()
  const precioMaxQuery        = ref < number >()
  const cantidad              = ref < number >()
  const soloConImagen         = ref < boolean>( false )

  async function buscar()
  {
    if(busquedaVacia()) return

    modo.value                = "buscando"
    productos.value           = await buscarProductos( getQuery() )
    productos.value           = procesarProductosDeBusqueda( productos.value )
    productosFil.value        = productos.value
    modo.value                = !!productos.value.length ? "normal" : "sin-resultados"
    buscarSiProductosEstanEnGrupo()
  }

  function busquedaVacia() : boolean {
    return  !categoria.value.value && busquedaTxt.value.length < 3
  }

  function procesarProductosDeBusqueda( productosProcesar : IProductoDoli[] ) : IProductoDoli[]
  {
    if(usuario.value.areaEsEscom)
      asignarPreciosDeEscom()
    return sortArray( productosProcesar, "activo", ">")

    function asignarPreciosDeEscom()
    {
      productosProcesar.forEach( (p)=> {
        let precioPromo     = 0
        let precioPubli     = 0
        if(p.precio_escom < p.precio_publico){
          precioPromo       = p.precio_escom
          precioPubli       = p.precio_publico
        }
        else{
          precioPromo       = p.precio_escom
          precioPubli       = p.precio_escom
        }
        p.precio            = precioPromo
        p.precio_promocion  = precioPromo
        p.precio_publico    = precioPubli
      })
    }
  }

  async function agregarProductosAControl( productoAdd : IProductoDoli[] )
  {
    await agregarProductos(productoAdd, cantidad.value) /* descuento.value */
    buscarSiProductosEstanEnGrupo()
    seleccion.value           = []
    aviso(  "positive",
            seleccion.value.length > 1 ? "Productos agregados" : "Producto agregado",
            "",
            2000,
            [{ label: 'Cerrar', color: 'white', handler: cerrar }]
        )
  }

  function cerrar(){
    emit("cerrar")
    modales.value.añadirProductos  = false
  }

  function buscarSiProductosEstanEnGrupo(){
    productos.value.forEach( p => {
      p.elegido = grupoElegido.value.productos.some( pg => p.ref == pg.ref )
    })
  }

  function editarBusqueda(txt : string ){
    busquedaTxt.value = txt.trim()
    if( txt.length >= 3 ) buscar()
  }

  watch([precioMinQuery, precioMaxQuery], ([newMin, newMax]) =>{
    if(
        (
          busquedaTxt.value.length >= 3
          ||
          !!categoria.value.value
        )
        &&
        (
          (!!newMin && newMin > 0)
          ||
          (!!newMax && newMax > 0)
        )
      )
      buscar()
  })

  async function eliminarLineaDesdeBusqueda( producto : IProductoDoli  )
  {
    producto.elegido              = false
    grupoElegido.value.seleccion  = grupoElegido.value.productos.filter( ( p : ILineaAcuerdo ) => p.id === producto.id)
    if(!!grupoElegido.value.seleccion.length){
      borrarLineas( 200 )
    }
  }

  function getQuery() : IQueryProducto
  {
    let q : IQueryProducto = { completa: +true }

    if(busquedaTxt.value.length  >= 3  ) {
      busquedaTxt.value       = busquedaTxt.value.trim()
      q.busqueda              = busquedaTxt.value
    }
    if(!!categoria.value.value      ) q.sigla     = categoria.value.sigla
    if(!!precioMinQuery.value       ) q.minimo    = precioMinQuery.value
    if(!!precioMaxQuery.value       ) q.maximo    = precioMaxQuery.value
    if(soloConImagen.value          ) q.soloConImg= 1 

    q.tipo                    = "busqueda"
    q.activo                  = 1
    return q
  }


</script>
