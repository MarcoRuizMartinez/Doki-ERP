<template>
  <ventana
    v-bind                    ="$attrs"
    class                     ="col-12"
    class-contenido           ="column items-center"
    height                    ="100%"
    size-icon-carga           ="22em"
    icono                     ="mdi-package-variant-closed"
    mensaje-sin-resultados    ="No se encontraron productos"
    :modo                     ="modo"
    :titulo                   ="titulo"
    :padding-contenido        ="modo === 'normal' ? '0' : '12px'"
    >
    <template                 #barra>
      <!-- <tabs-busqueda /> -->
    </template>
    <template                 #menu>
      <barra-busqueda
        @buscar               ="buscar"
        @limpiar              ="limpiarBusqueda"
        @exportar             ="descargarProductos"
        @crear                ="mostrarCrear"
        >
        <!-- <select-columnas
          v-model             ="columnasVisibles"
          ref                 ="comColumnas"
          label               ="Columnas"
          :almacen            ="ALMACEN_LOCAL.COL_PRODUCTOS"
          :options            ="columnas"
        /> -->
      </barra-busqueda>
    </template>
    <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
    <div  class               ="bg-grey-3 fit">
      <tabla                  modo-busqueda
        :tipo-vista           ="busqueda.tipoVista"
        :columnas             ="columnas"
        @click-editar         ="mostrarVerEditar"
      />
    </div>
  </ventana>
  <!-- //* ///////////////////////////////////////////////////////////// Modal formulario producto  -->
  <q-dialog
    v-model                   ="ventanaProducto"
    v-bind                    ="style.dialogo"      
    :persistent               ="loading.crear || loading.editar"
    >
    <formulario               modo-ventana
      :tipo                   ="tipoFormulario"        
      @creado                 ="productoCreado"
      @editado                ="productoEditado"
    />
  </q-dialog>  
</template>
  
<script setup lang="ts">  
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            computed,
            onMounted,
            onUnmounted         } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreUser        } from 'stores/user'
  import {  useStoreProducto    } from 'stores/producto'
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesProductos   } from "src/areas/productos/services/servicesProductos"
  import {  useTools            } from "src/composables/useTools"
  import {  generarCSVDesdeTabla} from "src/composables/UtilFiles"
  import {  IProductoDoli,
            ProductoDoli        } from "src/areas/productos/models/ProductoDolibarr"
  import {  style               } from "src/composables/useEstilos"            
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  BusquedaProducto,
            IQueryProducto      } from "src/areas/productos/models/BusquedaProductos"
  import {  Columna, IColumna   } from "src/models/Tabla"
  import {  TModosVentana,
            ALMACEN_LOCAL       } from "src/models/TiposVarios"  
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"  
  import    selectColumnas        from "components/utilidades/select/SelectColumnas.vue"  
  import    tabsBusqueda          from "src/areas/productos/components/Busqueda/TabsBusquedaProductos.vue"
  import    barraBusqueda         from "src/areas/productos/components/Busqueda/BarraBusquedaProductos.vue"
  import    tabla                 from "src/areas/productos/components/TablaProductos/TablaProductos.vue"  
  import    formulario            from "src/areas/productos/components/FormularioProducto.vue"  

  // * ////////////////////////// Columnas
  const { buscarProductos       } = servicesProductos()
  const { usuario, permisos     } = storeToRefs( useStoreUser() )  
  const { producto,
          productos,
          productosFil,
          busqueda,
          loading,
                                } = storeToRefs( useStoreProducto() )  
  const { esMobil, aviso        } = useTools()
  
  const modo                      = ref< TModosVentana >("esperando-busqueda")  
  const indexSelect               = ref< number >(-1)
  const ventanaProducto           = ref< boolean >(false)
  const tipoFormulario            = ref< "crear" | "ver" >("ver")
  const titulo                    = computed(()=>
  {
    return productos.value.length > 0 ? `Resultado: ${productos.value.length} ` +
                                      ( productos.value.length === 1 ? "producto" : "productos" )
                                    : modo.value === "esperando-busqueda" ?  "Buscar productos" : `Buscando productos...`
  })
  const columnas                  = ref< IColumna[] >([])
  const columnasVisibles          = ref< string[]   >([])
  const puedeAnterior             = computed(()=> indexSelect.value > 0 )
  const puedeSiguiente            = computed(()=> indexSelect.value < productos.value.length - 1)
  //const comColumnas               = ref< InstanceType<typeof selectColumnas> | null>(null)

  onMounted(()=>{
    productos.value               = []
    crearColumnas()
  })

  onUnmounted(()=>{
    productos.value               = []
    busqueda.value                = new BusquedaProducto()
  })  

  async function buscar( query : IQueryProducto )
  {
    productos.value               = []            
    modo.value                    = "buscando"
    productos.value               = await buscarProductos( query )
    productosFil.value            = productos.value
    modo.value                    = !!productos.value.length ? "normal" : "sin-resultados"
  }

  function limpiarBusqueda()
  {
    modo.value                    = "esperando-busqueda"
    productos.value               = []
  }

  function mostrarCrear()
  {
    producto.value                = new ProductoDoli()
    tipoFormulario.value          = "crear"    
    ventanaProducto.value         = true
  }

  function productoCreado( prod : IProductoDoli  )
  {
    ventanaProducto.value         = false
    productos.value.unshift( prod )
    productosFil.value            = productos.value
    modo.value                    = "normal"
  }

  function mostrarVerEditar( prod : IProductoDoli )
  {
    producto.value                = prod
    tipoFormulario.value          = "ver"
    ventanaProducto.value         = true
  }

  function productoEditado( prod : IProductoDoli )
  {
    const index = productos.value.findIndex(( p )=> p.id === prod.id )
    if(index > -1 )
      productos.value[index]      = prod
    
    ventanaProducto.value         = false
  }
    

  /* function vistaRapida(index : number)
  {
    seleccionarProducto(index)
    ventanaVistaRapida.value      = true    
  } */

  /* function anteriorProducto()
  {
    if(!puedeAnterior.value) return 
    seleccionarProducto( indexSelect.value - 1)
  } */

  /* function siguienteProducto()
  {
    if(!puedeSiguiente.value) return 
    seleccionarProducto( indexSelect.value + 1)
  } */

  /* function seleccionarProducto( index : number )
  {    
    indexSelect.value             = index
    producto.value                = productos.value[index]
  } */

  function crearColumnas(){
    columnas.value                = [
      new Columna           ({ name: "sigla",   sortable: false, label: "Producto", visible: false }),
      new Columna           ({ name: "ref",     sortable: false,                  clase: "text-bold" }),
      new Columna           ({ name: "nombre"                                     }),
      new Columna           ({ name: "precio",  sortable: false                   }),
      /*       
      new Columna({ name: "refCliente",               label: "Ref cliente"        }),
      new Columna({ name: "estado"                                                }),
      new Columna({ name: "tercero"                                               }),
      new Columna({ name: "municipioTercero",         label: "Municipio tercero"  }),      
      new Columna({ name: "comercial",                label: "Asesor"             }),
      new Columna({ name: "contacto"                                              }),
      new Columna({ name: "fechaCreacionCorta",       label: "Creado"             }),
      new Columna({ name: "fechaValidacionCorta",     label: "Validado"           }),
      new Columna({ name: "condicionPagoLabel",       label: "Condiciones"        }), 
      new Columna({ name: "formaPagoLabel",           label: "Forma de pago"      }), 
      new Columna({ name: "metodoEntregaLabel",       label: "Entrega"            }), 
      new Columna({ name: "origenContactoLabel",      label: "Origen"             }),
      new Columna({ name: "area",                     label: "Área"               }),
      Columna.ColumnaPrecio ({ name: "totalConDescu", label: "Subtotal",          clase: "text-bold" }),
      Columna.ColumnaPrecio ({ name: "subTotalLimpio",label: "Subtotal comisión", clase: "text-bold" }),
      Columna.ColumnaPrecio ({ name: "ivaValor",      label: "IVA",               clase: "text-bold" }),
      Columna.ColumnaPrecio ({ name: "totalConIva",   label: "Total",             clase: "text-bold" }),
      */
    ]

    columnasVisibles.value  = columnas.value.filter(c => c.visible ).map( c => c.name )
    //comColumnas.value?.cargarColumnasLocal()
  } 

/*   const columnas: IColumna[]  = [
    new Columna           ({ name: "sigla",   sortable: false, label: "Producto",  visible: false }),
    new Columna           ({ name: "ref",     sortable: false, label: modoBusqueda.value ? "REF" : "Filtrar", clase: "text-bold" }),
    new Columna           ({ name: "nombre"                                     }),
    new Columna           ({ name: "precio",  sortable: false                   }),
  ]
 */

  function descargarProductos()
  {
    let ok = generarCSVDesdeTabla(  "productos",  columnas.value, productos.value )

    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file" )
  }
</script>