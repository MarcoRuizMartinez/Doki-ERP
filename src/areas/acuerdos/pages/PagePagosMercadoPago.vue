<template>
  <q-page padding class             ="row item-stretch content-start justify-start">
    <ventana
      class                         ="col-12"
      class-contenido               ="column items-center"
      height                        ="100%"
      size-icon-carga               ="22em"
      icono                         ="mdi-credit-card-check"
      :modo                         ="modo"
      titulo                        ="Pagos MercadoPago"
      :padding-contenido            ="modo === 'normal' ? '0' : '12px' "
      >
      <template                     #menu>
      <!-- //* ///////////////////////////////////////////////// Barra busqueda -->                
        <busqueda
          :total                    ="total"
          @buscar                   ="buscar"
          @limpiar                  ="limpiarBusqueda"
          @exportar                 ="descargarAcuerdos"        
          >          
          <template                 #filtro>
            <input-buscar           clearable hundido
              v-model               ="filtro"
              label                 ="Filtrar"
              class                 ="width200"
              icon                  ="mdi-filter"
              :disable              ="!pagos.length"
            />          
          </template>
        </busqueda>
      </template>
      <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
      <q-table                      bordered dense flat
        class                       ="fit tabla-maco tabla-alto-min"
        row-key                     ="id"
        :filter                     ="filtro"
        :rows                       ="pagos"
        :columns                    ="columnas"
        :rows-per-page-options      ="[100]"
        >
        <!-- //* //////////////////  Columna ref  -->
        <template #body-cell-estado ="props">
          <q-td   :props            ="props">
            <btn-pago
              :pago                 ="props.row"
              @click                ="verPago"              
            />
          </q-td>
        </template>
        <!-- //* //////////////////  Columna nombre  -->
<!--         <template #body-cell-nombre ="props">
          <q-td   :props            ="props">
            <col-cliente
              v-model               ="props.row"
              @crear-tercero        ="openCrearTercero"
            />
          </q-td>
        </template> -->
        <!-- //* //////////////////  Columna nombre  -->
<!--         <template #body-cell-estado ="props">
          <q-td   :props            ="props">
            <span
              class                 ="text-bold"
              :style                ="`color:${props.row.estadoColor};`"
              >
              {{props.value}}
            </span>
          </q-td>
        </template>     -->    
      </q-table>
    </ventana>
    <q-dialog
      v-model                       ="verPagoOn"
      v-bind                        ="style.dialogo"  
      >
      <!-- <pago v-model                 ="pedido"/> -->
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
  import {  storeToRefs         } from "pinia"
  import {  useStoreUser        } from "src/stores/user"
  import {  useStoreAcuerdo     } from "src/stores/acuerdo"
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useTitle            } from "@vueuse/core"
  import {  useControlPedidosWoo} from "src/areas/acuerdos/controllers/ControlPedidosWoo"
  import {  useTools,
            getDateToStr        } from "src/useSimpleOk/useTools"
  import {  generarCSVDesdeTabla} from "src/useSimpleOk/UtilFiles"
  import {  style               } from "src/useSimpleOk/useEstilos"
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  Columna, IColumna   } from "src/models/Tabla"
  import {  ModosVentana        } from "src/models/TiposVarios"    
  import {  IQuery              } from "src/models/Busqueda"
  import {  IMercadoPago        } from "src/areas/acuerdos/models/PagoMercadoPago"

  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"  
  import    inputBuscar           from "components/utilidades/input/InputSimple.vue"
  import    busqueda              from "src/areas/acuerdos/components/PagosMercadoPago/BarraBusquedaMercadoPago.vue"  
  import    pago                  from "src/areas/acuerdos/components/PedidosWoo/VistaPago.vue"    
  import    btnPago               from "src/areas/acuerdos/components/PagosMercadoPago/BtnPago.vue"

  const { loading,
          busqueda : b  }   = storeToRefs( useStoreAcuerdo() )
  const { buscarPagosMercadoPago      } = useControlPedidosWoo()  

  const { usuario           } = storeToRefs( useStoreUser() )  
  const { aviso             } = useTools()
  const router                = useRouter()  
  const pagos                 = ref< IMercadoPago[] > ( [] )
  const columnas              = ref< IColumna[] >     ( [] )
  const total                 = ref< number >         ( 0 )

  const verPagoOn             = ref< boolean      >( false )
  const filtro                = ref< string       >( ""    )
  const modo                  = ref< ModosVentana >( "esperando-busqueda" )
  
  onMounted( iniciar ) 

  async function iniciar()
  {
    useTitle("💳 MercadoPago")
    await b.value.montarBusqueda( usuario.value.id, router )
    crearColumnas()    

    const now                 = new Date()
    const año                 = now.getFullYear()
    const mes                 = now.getMonth() + 1

    if(!b.value.f?.desde)
        b.value.f.desde  = getDateToStr( `${año}-${mes}-01`, "UTC" )
    if(!b.value.f?.hasta)
        b.value.f.hasta  = now
  }

  //* ///////////////////////////////////////////////////////////// Consultar Si existe cliente y Pagos
  async function buscar( q : IQuery )
  {
    pagos.value               = []
    modo.value                = "buscando"
    loading.value.carga       = true
    const { pagos : p, paging}= await buscarPagosMercadoPago( { fechaDesde: q.fechaDesde, fechaHasta: q.fechaHasta, limite: q.limite, offset: q.offset } )
    loading.value.carga       = false
    pagos.value               = p
    total.value               = paging.total
    modo.value                = !!pagos.value.length ? "normal" : "sin-resultados" 
  }
  
  //* ///////////////////////////////////////////////////////////// Crear Columnas
  function crearColumnas(){
    columnas.value            = [
      new Columna           ({ name: "estado",            label: "ver"        }),
      new Columna           ({ name: "fechaAprobado",     label: "Fecha"      }),
      Columna.ColumnaPrecio ({ name: "total",             label: "pagado",    clase: "text-bold"}),
      new Columna           ({ name: "metodo",            label: "método",    clase: "text-uppercase"}),
      new Columna           ({ name: "nombreCompleto",    label: "nombre"     }),
      new Columna           ({ name: "descripcion",       label: "concepto"   }),
      new Columna           ({ name: "documento",         label: "documento"  }),
      new Columna           ({ name: "id"                                     }),
      new Columna           ({ name: "ref"                                    }),
      new Columna           ({ name: "moneda",            label: "moneda"     }),
      Columna.ColumnaPrecio ({ name: "totalRecibido",     label: "recibido"   }),
    ]
    columnas.value.forEach( c => c.sortable = false )
  }

  
  //* ///////////////////////////////////////////////////////////// Abrir ventana de pago
  function verPago( ){    
    verPagoOn.value                 = true
  }

  //* ///////////////////////////////////////////////////////////// Limpiar busqueda
  function limpiarBusqueda(){
    modo.value                    = "esperando-busqueda"
    pagos.value                   = []
    filtro.value                  = ""
  }  

  //* ///////////////////////////////////////////////////////////// Descargar Archivos
  function descargarAcuerdos()
  {
    const ok = generarCSVDesdeTabla( "Pagos MercadoPago", columnas.value, pagos.value )
    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file")
  }    
</script>
