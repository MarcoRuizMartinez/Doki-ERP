<template>
  <ventana
    class                     ="col-12"
    class-contenido           ="column items-center"
    height                    ="100%"
    size-icon-carga           ="22em"
    icono                     ="mdi-package-variant-closed"
    :modo                     ="modo"
    :titulo                   ="titulo"
    :padding-contenido        ="modo === 'normal' ? '0' : '12px' "
    mensaje-sin-resultados    ="No se encontraron productos"
    >
    <template                 #barra>
      <tabs-busqueda />
    </template>
    <template                 #menu>
      <barra-busqueda
        @buscar               ="buscar"
        @limpiar              ="limpiarBusqueda"
        @exportar             ="descargarProductos"
        >
        <select-columnas
          v-model             ="columnasVisibles"
          label               ="Columnas"
          :almacen            ="ALMACEN_LOCAL.COL_PRODUCTOS"
          :options            ="columnas"
        />
      </barra-busqueda>
    </template>
    <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
    <div  class               ="bg-grey-3 fit">
      <tabla
        tipo-vista            ="grilla"
      />
    </div>
  </ventana>
</template>
  
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            toRefs,
            PropType,
            computed,
            onMounted,
            onUnmounted         } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreUser        } from 'src/stores/user'
  import {  useStoreProducto    } from 'src/stores/producto'
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesProductos   } from "src/areas/productos/services/servicesProductos"
  import {  useControlProductos } from "src/areas/productos/controllers/ControlProductosDolibarr"
  import {  useTools            } from "src/useSimpleOk/useTools"
  import {  generarCSVDesdeTabla} from "src/useSimpleOk/UtilFiles"
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  BusquedaProducto,
            IQueryProducto      } from "src/areas/productos/models/BusquedaProductos"
  import {  Columna, IColumna   } from "src/models/Tabla"
  import {  ModosVentana,
            ALMACEN_LOCAL       } from "src/models/TiposVarios"  
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"  
  import    selectColumnas        from "components/utilidades/select/SelectColumnas.vue"
  import    tabsBusqueda          from "src/areas/productos/components/Busqueda/TabsBusqueda.vue"
  import    barraBusqueda         from "src/areas/productos/components/Busqueda/BarraBusqueda.vue"
  import    tabla                 from "src/areas/productos/components/TablaProductos/TablaProductos.vue"
  
  // * ////////////////////////// Columnas
  const { buscarProductos       } = servicesProductos()
  const { usuario, permisos     } = storeToRefs( useStoreUser() )  
  const { producto,
          productos,
          busqueda,              
                                } = storeToRefs( useStoreProducto() )  
  const { esMobil, aviso        } = useTools()
  
  const modo                      = ref< ModosVentana >("esperando-busqueda")  
  const indexSelect               = ref< number >(-1)
  const ventanaVistaRapida        = ref< boolean >(false)  
  //const filtroMovil               = ref< boolean >(false)
  const titulo                    = computed(()=>
  {
    return productos.value.length > 0 ? `Resultado: ${productos.value.length} ` +
                                      ( productos.value.length === 1 ? "producto" : "productos" )
                                    : `Buscando productos...`
  })
  const columnas                  = ref< IColumna[] >([])
  const columnasVisibles          = ref< string[]   >([])
  const puedeAnterior             = computed(()=> indexSelect.value > 0 )
  const puedeSiguiente            = computed(()=> indexSelect.value < productos.value.length - 1)

  onMounted(()=>{
    productos.value               = []
    busqueda.value                = new BusquedaProducto()
    crearColumnas()
  })

  onUnmounted(()=>{
    productos.value               = []
    busqueda.value                = new BusquedaProducto()
  })  

  async function buscar( query : IQueryProducto )
  {
    console.log("vista buscar query: ", query);
    productos.value               = []            
    modo.value                    = "buscando"
    productos.value               = await buscarProductos( query )
    modo.value                    = !!productos.value.length ? "normal" : "sin-resultados"
  }

  function limpiarBusqueda()
  {
    modo.value                    = "esperando-busqueda"
    productos.value               = []
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
      new Columna({ name: "ref"                                                   }),
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
  } 

  function descargarProductos()
  {
    /*
    let ok = generarCSVDesdeTabla(  busqueda.value.producto,  columnas.value, productos.value )

    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file" )
    */
  }
</script>