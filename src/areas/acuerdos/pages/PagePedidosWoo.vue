<template>
  <q-page padding class             ="row item-stretch content-start justify-start">
    <ventana
      class                         ="col-12"
      class-contenido               ="column items-center"
      height                        ="100%"
      size-icon-carga               ="22em"
      icono                         ="mdi-store"
      :modo                         ="modo"
      titulo                        ="Pedidos en Mublex.com"
      :padding-contenido            ="modo === 'normal' ? '0' : '12px' "
      >
      <template                     #menu>
        <busqueda
          :largo                    ="pedidos.length"
          @buscar                   ="buscar"
          @limpiar                  ="limpiarBusqueda"
          @exportar                 ="descargarAcuerdos"        
          >
          <!-- //* ///////////////////////////////////////////////// Filtrar resultados -->        
          <template                 #filtro>
            <input-buscar           clearable hundido
              v-model               ="filtro"
              label                 ="Filtrar"
              class                 ="width200"
              icon                  ="mdi-filter"
              :disable              ="!pedidos.length"
            />          
          </template>
        </busqueda>
      </template>
      <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
      <q-table                      bordered dense flat
        class                       ="fit tabla-maco tabla-alto-min"
        row-key                     ="id"
        :filter                     ="filtro"
        :rows                       ="pedidos"
        :columns                    ="columnas"
        :rows-per-page-options      ="[100]"
        >
        <!-- //* //////////////////  Columna ref  -->
        <template #body-cell-id     ="props">
          <q-td   :props            ="props">
            <col-ref
              v-model               ="props.row"
              @vista-rapida         ="verPedido"
              @vista-pago           ="verPago"
            />
          </q-td>
        </template>        
        <!-- //* //////////////////  Columna nombre  -->
        <template #body-cell-nombre ="props">
          <q-td   :props            ="props">
            <col-cliente
              v-model               ="props.row"
              @crear-tercero        ="openCrearTercero"
            />
          </q-td>
        </template>
        <!-- //* //////////////////  Columna Estado  -->
        <template #body-cell-estado ="props">
          <q-td   :props            ="props">
            <span
              class                 ="text-bold"
              :style                ="`color:${props.row.estadoColor};`"
              >
              {{props.value}}
            </span>
          </q-td>
        </template>        
      </q-table>
    </ventana>
    <q-dialog
      v-model                       ="formClienteOn"
      v-bind                        ="style.dialogo"  
      >
      <formulario-tercero
        tipo                        ="crear-cliente"
        :tercero-carga              ="tercero"
        @tercero-creado             ="clienteCreado" 
      />
    </q-dialog>
    <q-dialog
      v-model                       ="verPedidoOn"
      v-bind                        ="style.dialogo"  
      >
      <pedido-tienda
        v-model                     ="pedido"
      />
    </q-dialog>
    <q-dialog
      v-model                       ="verPagoOn"
      v-bind                        ="style.dialogo"  
      >
      <pago v-model                 ="pedido"/>
    </q-dialog>    
  </q-page>
</template>

<script setup lang="ts">
//:columns                  ="columnas"
//:visible-columns          ="columnasVisibles"
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            onMounted           } from "vue"
  import {  useRouter           } from "vue-router"            
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreUser        } from 'src/stores/user'
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useTitle            } from "@vueuse/core"
  import {  useControlPedidosWoo} from "src/areas/acuerdos/controllers/ControlPedidosWoo"
  import {  useTools            } from "src/useSimpleOk/useTools"
  import {  generarCSVDesdeTabla} from "src/useSimpleOk/UtilFiles"
  import {  style               } from "src/useSimpleOk/useEstilos"
  import {  servicesTerceros    } from "src/areas/terceros/services/servicesTerceros"
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  Columna, IColumna   } from "src/models/Tabla"
  import {  AREA, ModosVentana  } from "src/models/TiposVarios"    
  import {  IPedidoWoo,
            PedidoWoo           } from "src/areas/acuerdos/models/PedidoWoo"  
  import {  ITercero,
            Tercero,
                                } from "src/areas/terceros/models/Tercero"              
  import {  IQuery              } from "src/models/Busqueda"
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"
  import    inputBuscar           from "components/utilidades/input/InputSimple.vue"
  import    pago                  from "src/areas/acuerdos/components/PedidosWoo/VistaPago.vue"  
  import    pedidoTienda          from "src/areas/acuerdos/components/PedidosWoo/VistaPedido.vue"  
  import    colRef                from "src/areas/acuerdos/components/PedidosWoo/ColumnaRef.vue"  
  import    colCliente            from "src/areas/acuerdos/components/PedidosWoo/ColumnaCliente.vue"
  import    busqueda              from "src/areas/acuerdos/components/PedidosWoo/BarraBusquedaWoo.vue"  
  import    formularioTercero     from "src/areas/terceros/components/formularioTercero/FormularioTercero.vue"
  
  const { buscarOrdenesWoo,
          buscarPedidosDolibarr,
          buscarPagosMercadoPago,     } = useControlPedidosWoo()
  const { vericarDocumentoEnDolibarr  } = servicesTerceros()

  const { usuario           } = storeToRefs( useStoreUser() )  
  const { busqueda : b      } = storeToRefs( useStoreAcuerdo() )
  const { aviso             } = useTools()

  const router                = useRouter()  
  const pedidos               = ref< IPedidoWoo[] >( [] )
  //const pedidosCopia          = ref< IPedidoWoo[] >( [] )
  const columnas              = ref< IColumna[]   >( [] )
  const formClienteOn         = ref< boolean      >( false )
  const verPedidoOn           = ref< boolean      >( false )
  const verPagoOn             = ref< boolean      >( false )
  const filtro                = ref< string       >( ""    )
  const modo                  = ref< ModosVentana >( "esperando-busqueda" )
  const pedido                = ref< IPedidoWoo   >( new PedidoWoo() )
  const tercero               = ref< ITercero     >( new Tercero() )

  onMounted( iniciar ) 

  async function iniciar()
  {
    useTitle("🏪 Pedidos Tienda")
    await b.value.montarBusqueda( usuario.value.id, router )
    crearColumnas()
  }

  //* ///////////////////////////////////////////////////////////// Buscar
  async function buscar( query : IQuery  )
  { 
    pedidos.value             = []
    modo.value                = "buscando"
    pedidos.value             = await buscarOrdenesWoo( query )
    //pedidosCopia.value        = pedidos.value
    modo.value                = !!pedidos.value.length ? "normal" : "sin-resultados"
    await consultarPedidosCreados()
    await consultarClienteYPago()
  }

  //* ///////////////////////////////////////////////////////////// Revisar cuales pedidos ya se crearon
  async function consultarPedidosCreados(){
    const ids                 = pedidos.value.map( p => p.id ).join(",") 
    const refIds              = await buscarPedidosDolibarr( ids )
    for (const p of pedidos.value)
      p.idPedido              = refIds.find( ri => ri.ref === p.id )?.id ?? 0
  }

  //* ///////////////////////////////////////////////////////////// Consultar Si existe cliente y Pagos
  async function consultarClienteYPago(){
    for (const p of pedidos.value)
    {
      /////////////////////// Tercero
      p.estadoCliente         = "🔎"
      const doc               = parseInt( p.documento ).toString()
      p.idTercero             = await vericarDocumentoEnDolibarr( doc, false)
      p.estadoCliente         = !!p.idTercero ? "✅" : "✖️"
      /////////////////////// Pago
      p.estadoPago            = "🔎"      
      const { pagos }         = await buscarPagosMercadoPago( { id: p.id } )  
      p.pagos                 = pagos
      p.estadoPago            = !!p.pagos.length ? "✅" : "✖️"      
    }
  }
  
  //* ///////////////////////////////////////////////////////////// Crear Columnas
  function crearColumnas(){
    columnas.value            = [
      new Columna           ({ name: "id",              label: "ref"        }),
      new Columna           ({ name: "estado"                               }),
      new Columna           ({ name: "nombre",          label: "cliente"    }),
      Columna.ColumnaPrecio ({ name: "total"                                }),
      new Columna           ({ name: "hace",            label: "hace"       }),
      new Columna           ({ name: "fecha"                                }),
      new Columna           ({ name: "asesor"                               }),
      new Columna           ({ name: "municipioEnvio",  label: "municipo"   }),
      new Columna           ({ name: "productos"                            }),
    ]

    columnas.value.forEach( c => c.sortable = false )
  }

  //* ///////////////////////////////////////////////////////////// Abrir ventana para crear tercero
  function openCrearTercero( p : IPedidoWoo ){
    tercero.value.nombre            = p.nombre.toUpperCase()
    tercero.value.documento.numero  = p.documento
    tercero.value.direccion         = p.direccionFactura
    tercero.value.correo            = p.billing.email.toLowerCase()
    tercero.value.telefono          = p.billing.phone
    tercero.value.area              = AREA.MUBLEX
    pedido.value                    = p
    formClienteOn.value             = true
  }

  //* ///////////////////////////////////////////////////////////// Recibir ID de nuevo cliente
  function clienteCreado( id : number ){
    formClienteOn.value             = false
    tercero.value                   = new Tercero()
    pedido.value.idTercero          = id
    pedido.value.estadoCliente      = "✅"
  }

  //* ///////////////////////////////////////////////////////////// Abrir ventana de nuevo cliente
  function verPedido( p : IPedidoWoo ){
    pedido.value                    = p
    verPedidoOn.value               = true
  }
  
  //* ///////////////////////////////////////////////////////////// Abrir ventana de pago
  function verPago( p : IPedidoWoo ){
    pedido.value                    = p
    verPagoOn.value                 = true
  }

  //* ///////////////////////////////////////////////////////////// Limpiar busqueda
  function limpiarBusqueda(){
    modo.value                    = "esperando-busqueda"
    pedidos.value                 = []
    filtro.value                  = ""
  }  

  //* ///////////////////////////////////////////////////////////// Descargar Archivos
  function descargarAcuerdos()
  {
    const ok = generarCSVDesdeTabla( "Pedidos Tienda", columnas.value, pedidos.value )
    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file")
  }    
</script>
