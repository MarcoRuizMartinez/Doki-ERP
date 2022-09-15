<template>
  <ventana                    cerrar full-screen
    titulo                    ="Buscar"
    icono                     ="mdi-magnify"
    class-contenido           ="row justify-left"
    mensaje-sin-resultados    ="No se encontraron productos o servicios"
    padding-contenido         ="0"
    size-icon-carga           ="28vw"
    :modo                     ="modo"
    :cargando                 ="loading.añadir || loading.borrarLote"
    @cerrar                   ="cerrar"
    >
    <template                 #barra>
      <q-btn-toggle
        v-model               ="tipoVista"
        v-bind                ="toggleGris"
        :options="[{ value: 'grilla', slot: 'grilla' }, { value: 'lista',  slot: 'lista' }]"
        >
        <template             #grilla>
          <q-icon   name      ="mdi-view-module"      size="sm"/>
          <Tooltip label      ="Vista cuadricula"/>
        </template>
        <template             #lista>
          <q-icon   name      ="mdi-format-list-text" size="sm"/>
          <Tooltip label      ="Vista lista"/>
        </template>
      </q-btn-toggle>
      <q-btn                  round push glossy
        icon                  ="mdi-refresh-circle"
        padding               ="0"
        class                 ="lt-md"
        color                 ="primary"
        :disable              ="!productosOriginal.length"
        :loading              ="modo == 'buscando'"
        @click                ="buscar"
        size                  ="1.1em"
        >
        <Tooltip label        ="Recargar"/>
      </q-btn>
    </template>                 
    <!-- //* ///////////////////////////////////////////////////////////// Referencia y nombre -->
    <template                 #menu>    
      <div class              ="row col gap-pa-md">
        <input-buscar         autofocus clearable hundido
          v-model             ="busqueda"
          label               ="Buscar.."
          class               ="col-md-2 col-6"
          @clear              ="buscar"
          @update:model-value ="editarBusqueda"
        />
        <!-- //* ///////////////////////////////////////////////////////////// Unidad -->
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
        :disable              ="!productosOriginal.length"
        :loading              ="modo == 'buscando'"
        @click                ="buscar"
        >
        <Tooltip label        ="Recargar"/>
      </q-btn>
    </template>
    <div  class                 ="bg-grey-3 fit">
      <q-table                  dense  
        v-model:selected        ="seleccion"
        class                   ="bg-grey-3"
        row-key                 ="id"
        selection               ="multiple"
        table-header-class      ="q-my-md bg-gris text-bold shadow-1"
        :grid                   ="tipoVista === 'grilla'"
        :grid-header            ="tipoVista === 'grilla'"
        :rows                   ="productos"
        :columns                ="columnas"
        :visible-columns        ="tipoVista === 'grilla' ? columnas.filter(c => c.visible).map(c=>c.name) : columnas.map(c=>c.name)"
        :filter                 ="filtro"
        :hide-bottom            ="productos.length < 25"
        :rows-per-page-options  ="[100, 200, 500]"
        @update:selected        ="seleccionar"
        >
        <template               #header-cell-ref>
          <q-th>
            <q-btn              flat dense no-caps
              label             ="Filtrar"
              :icon             ="!filtro.length ? 'mdi-filter' : 'mdi-filter-off'"
              color             ="grey-9"
              padding           ="0"
              size              ="12px"
              >
              <q-popup-proxy
                v-model         ="popupOn"
                transition-show ="jump-down"
                transition-hide ="jump-up"                
                >
                <div class      ="q-pa-lg filtro-panel bg-gris">
                  <input-buscar autofocus hundido clearable
                    v-model     ="filtro"
                    label       ="Filtrar.."
                    icon        ="mdi-magnify"
                    style       ="max-width: 240px;"
                    @clear      ="()=> { filtro = ''; popupOn = false } "
                  />
                </div>
              </q-popup-proxy>
            </q-btn>
          </q-th>
        </template>
        <template               #header-cell-precio="props">
          <q-th>
            <q-btn              flat dense no-caps
              label             ="Precio"
              :icon             ="!filtro.length ? 'mdi-filter' : 'mdi-filter-off'"
              color             ="grey-9"
              padding           ="0"
              size              ="12px"              
              >
              <q-popup-proxy
                v-model         ="popupOnPrecio"
                transition-show ="jump-down"
                transition-hide ="jump-up"                
                >
                <div class      ="q-pa-sm filtro-panel bg-gris column items-center shadow-3">
<!--                   <input-number hundido clearable
                    v-model     ="precioMinFiltro"
                    label       ="Precio mínimo "
                    icon        ="mdi-currency-usd"
                    class       ="q-mb-sm"
                    style       ="max-width: 200px;"
                    :paso       ="10000"
                    :minimo     ="0"
                    :maximo     ="precioMaxFiltro"
                  /> -->
                  <input-number hundido clearable
                    v-model     ="precioMaxFiltro"
                    label       ="Precio máximo"
                    icon        ="mdi-currency-usd"
                    style       ="max-width: 200px;"
                    :paso       ="10000"
                    :minimo     ="precioMinFiltro"
                  />
                  <q-btn        no-caps rounded flat
                    label       ="Ordenar de menor a mayor"
                    icon        ="mdi-order-numeric-ascending"
                    @click      ="ordenar('<')"
                  />
                  <q-btn        no-caps rounded flat
                    label       ="Ordenar de mayor a menor"
                    icon        ="mdi-order-numeric-descending"
                    @click      ="ordenar('>')"
                  />                  
                </div>
              </q-popup-proxy>
            </q-btn>
          </q-th>
        </template>        
        <template             #item="props">
          <div
            class             ="q-pa-xs col-xs-6 col-sm-3 col-md-12-5 col-lg-12-5 grid-style-transition "
            :style=           "props.selected ? 'transform: scale(0.95);' : ''"
            >
            <q-card           
              class           ="card-producto"
              :class          ="[ { 'select-producto' : props.selected    },
                                  { 'cursor-pointer'  : props.row.activo  },
                                  { 'op40'           : !props.row.activo  },
                                ]"
              @click            ="()=> { if( props.row.activo ) props.selected = !props.selected }"
              v-touch-hold.mouse="()=> mouseLargo( props.row )"
              >
              <q-card-section
                class         ="column items-center q-pa-xs"
                >
                <q-img
                  :src        ="props.row.imagen300px"
                  ratio       ="1"
                />
                <Tooltip v-if ="!props.row.activo">
                  <div class="text-h6 text-center">Producto inactivo</div>
                  <table    class         ="text-1_2em">
                    <tr><td>Activo en Dolibarr:     </td><td>{{ siNo(props.row.en_venta)}}         </td></tr>
                    <tr><td>Activo en proveedor:    </td><td>{{ siNo(props.row.activo_proveedor)}} </td></tr>
                    <tr><td>Disponible en proveedor:</td><td>{{ siNo(props.row.disponible)}}       </td></tr>
                  </table>
                </Tooltip>
                <efecto efecto="UpDown">
                  <q-icon 
                    v-if      ="props.row.elegido"
                    name      ="mdi-check-decagram"
                    class     ="absolute-right"
                    color     ="positive"
                    size      ="lg"
                    >
                      <Tooltip  label="Ya seleccionado"/>                
                  </q-icon>
                </efecto>
                <q-badge
                  v-if        ="props.row.descuentoCalculado > 0"
                  class       ="absolute-left h-20px"
                  color       ="orange"
                  >
                  <span>{{props.row.descuentoCalculado}}%</span>
                  <Tooltip>Descuento del {{props.row.descuentoCalculado}}%</Tooltip>   
                </q-badge>
              </q-card-section>
              <q-separator />
              <div
                class         ="q-ma-xs conte-nombre column full-width text-bold"
                :class        ="{'bg-gris' : props.selected }"
                >
                <div class    ="text-grey-7 col-3">{{props.row.ref}}</div>
                <div class    ="ellipsis-2-lines text-indigo-9 col-6">{{props.row.nombre}}
                  <Tooltip
                    v-if      ="props.row.activo"
                    :label    ="props.row.nombre"
                  />
                </div>                
                <div class    ="fuente-mono col-2 text-grey-9 text-1_1em">
                  {{ formatoPrecio( props.row.precio, "decimales-no" ) }}
                  <tooltip-precios
                    :producto ="(props.row as ProductoDoli)"
                  />
                </div>
              </div>
            </q-card>
          </div>
        </template>

        <template v-slot:body-selection="scope">
          <q-checkbox  disable  v-model="scope.selected" />
        </template>

        <template #body-cell-sigla="props">
          <q-td :props        ="props">
            <q-img
              :src        ="props.row.imagen100px"
              class       ="imagen-woo-xs q-mr-md"
              ratio       ="1"
              :class      ="{ 'op40' : !props.row.activo  }"
              >
              <Tooltip>
                <q-img
                  :src        ="props.row.imagen300px"
                  class       ="imagen-woo-lg"
                  ratio       ="1"
                />
              </Tooltip>
            </q-img>
            <efecto efecto    ="UpDown"
              >
              <q-icon 
                v-if          ="props.row.elegido"
                name          ="mdi-check-decagram"
                color         ="positive"
                size          ="sm"
                v-touch-hold.mouse="()=> mouseLargo( props.row )"
                >
                  <Tooltip  label="Ya seleccionado"/>                
              </q-icon>
              <q-btn          round
                v-else-if     ="props.row.activo"
                color         ="grey-10"
                icon          ="mdi-plus-circle-outline"
                padding       ="0"
                class         ="op30 op100-hover"
                @click        ="agregarProducctosAControl( [ ( props.row as ProductoDoli ) ] )"
                >
                <Tooltip label="Agregar producto"/>
              </q-btn>
            </efecto>
            
          </q-td>
        </template>
        <template #body-cell-precio="props">
          <q-td :props        ="props">
            <div class        ="text-right">
              {{formatoPrecio(props.row.precio, "decimales-no")}}
            </div>
            <tooltip-precios
              :producto ="(props.row as ProductoDoli)"
            />
          </q-td>
        </template>
    </q-table>

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
          @click              ="agregarProducctosAControl( seleccion )"
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
  import {  ref, watch,       } from "vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs       } from 'pinia'
  import {  useStoreAcuerdo   } from 'src/stores/acuerdo'  
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  ILineaAcuerdo       } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  IColumna, Columna   } from "src/models/Tabla"  
  import {  ModosVentana        } from "src/models/TiposVarios"
  import {  IProductoCategoria,
            ProductoCategoria   } from "src/areas/productos/models/ProductoCategoria"
  import {  ProductoDoli,
            IProductoDoli       } from "src/areas/productos/models/ProductoDolibarr"
// * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"      
  import {  servicesProductos,
            IBusquedaProducto   } from "src/areas/productos/services/servicesProductos"
  
  import {  dexieCategoriasProducto
                              } from "src/services/useDexie"
  import {  toggleGris        } from "src/useSimpleOk/useEstilos"
  import {  formatoPrecio,
            sortArray,
            useTools,
            filterArrayMaxMin,
            siNo
                                } from "src/useSimpleOk/useTools"
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    efecto                from "components/utilidades/Efecto.vue"
  import    ventana               from "components/utilidades/Ventana.vue"
  import    inputBuscar           from "components/utilidades/input/InputSimple.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    tooltipPrecios        from "src/areas/acuerdos/components/Tooltips/TooltipPreciosProducto.vue"

  const emit = defineEmits<{
    (e: 'cerrar',         value: void           ): void
    (e: 'eliminarLineaId',value: number         ): void
    (e: 'addLineas',      value: ILineaAcuerdo[]): void
  }>()

  const tipoVista             = ref<"grilla" | "lista">("grilla")

  const { aviso             } = useTools()  
  const { agregarProductos  } = useControlProductos()
  const storeAcuerdo          = useStoreAcuerdo()                            
  const { grupoElegido,
          modales,
          loading           } = storeToRefs(storeAcuerdo)                              
  const busqueda              = ref< string   >("")
  const modo                  = ref< ModosVentana >("esperando-busqueda")
  const categoria             = ref< IProductoCategoria  >( new ProductoCategoria() )
  const productos             = ref< IProductoDoli[] >([])
  const productosOriginal     = ref< IProductoDoli[] >([])
  const seleccion             = ref< IProductoDoli[] >([])
  const filtro                = ref< string >("")
  const { buscarProductos   } = servicesProductos()  
  const categorias            = dexieCategoriasProducto()
  const popupOn               = ref < boolean >(false)
  const popupOnPrecio         = ref < boolean >(false)
  const precioMinFiltro       = ref < number >()
  const precioMaxFiltro       = ref < number >()
  const precioMinQuery        = ref < number >()
  const precioMaxQuery        = ref < number >()
  const descuento             = ref < number >()
  const cantidad              = ref < number >()
  const soloConImagen         = ref < boolean>(false)

  const columnas: IColumna[]  = [
    new Columna           ({ name: "sigla",   sortable: false, label: "Imagen",  visible: false }),
    new Columna           ({ name: "ref",     sortable: false, label: "Filtrar", clase: "text-bold" }),
    new Columna           ({ name: "nombre"                                     }),
    new Columna           ({ name: "precio",  sortable: false                   }),
  ]

  async function buscar()
  {
    if(busquedaVacia()) return

    modo.value                = "buscando"
    productosOriginal.value   = await buscarProductos( getQuery() )
    productos.value           = sortArray( productosOriginal.value, "activo", ">")

    modo.value                = !!productos.value.length ? "normal" : "sin-resultados"
    buscarSiProductosEstanEnGrupo()
  }

  async function agregarProducctosAControl( productoAdd : IProductoDoli[] )
  {
    await agregarProductos(productoAdd, cantidad.value, descuento.value)
    buscarSiProductosEstanEnGrupo()
    seleccion.value           = []
    aviso(  "positive",
            seleccion.value.length > 1 ? "Productos agregados" : "Producto agregado",
            "",
            2000,
            [{ label: 'Cerrar', color: 'white', handler: cerrar }]
        )
  }

  function cerrar()
  {
    emit("cerrar")
    modales.value.añadirProductos  = false
  }

  function buscarSiProductosEstanEnGrupo()
  {
    productos.value.forEach( p => {
      p.elegido = grupoElegido.value.productos.some( pg => p.ref == pg.ref ) 
    })
  }
  
  function editarBusqueda(txt : string )
  {
    busqueda.value = txt.trim()
    if( txt.length >= 3 ) buscar()
  }

  function seleccionar( rows : readonly IProductoDoli[] ){ 
    seleccion.value   = rows.filter(p=>p.activo)
  }

  function ordenar( tipo : "<" | ">" ) {
    productos.value           = sortArray(productos.value, "precio", tipo)
  }

  watch([precioMinFiltro, precioMaxFiltro], ([newMin, newMax]) =>{
    productos.value = filterArrayMaxMin< IProductoDoli >(productosOriginal.value, newMin, newMax, "precio")
  })

  watch([precioMinQuery, precioMaxQuery], ([newMin, newMax]) =>{
    if(
        (
          busqueda.value.length >= 3
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

  function mouseLargo( producto : IProductoDoli )
  {
    if( !producto.activo ) return

    if( producto.elegido )
      emitirBorrarProducto( producto )
    else
      agregarProducctosAControl( [ producto ] )
  }
  function emitirBorrarProducto( producto : IProductoDoli )
  {
    emit("eliminarLineaId", producto.id)
    producto.elegido = false
  }  



  function getQuery() : IBusquedaProducto
  {
    let q : IBusquedaProducto = { completa: +true }

    if(busqueda.value.length  >= 3  ) {
      busqueda.value          = busqueda.value.trim()
      q.busqueda              = busqueda.value
    }
    if(!!categoria.value.value      ) q.sigla     = categoria.value.sigla
    if(!!precioMinQuery.value       ) q.minimo    = precioMinQuery.value
    if(!!precioMaxQuery.value       ) q.maximo    = precioMaxQuery.value
    if(soloConImagen.value          ) q.soloConImg= 1

    return q
  }

  function busquedaVacia() : boolean 
  {
    return  !categoria.value.value && busqueda.value.length < 3
  }
</script>
<style>
.card-producto{
  border-radius: 6px;
  transition: box-shadow 0.3s ease-in-out, margin-top 200ms linear;
}
.conte-nombre{
  height: 100px;
  text-align: center;
}
.card-producto:hover {
  box-shadow: 0 7px 16px 0 rgb(0 0 0 / 20%), 0 1px 3px 0 rgba(95, 83, 83, 0.1);
  margin-top: -3px;
}
.select-producto,
.select-producto:hover{
  box-shadow: 0px 0px 6px 5px #4a84cd;
}

.filtro-panel{
  border-top: solid 6px #27313d;
}
</style>