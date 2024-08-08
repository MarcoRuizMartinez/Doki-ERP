  <template>
  <ventana                      cerrar scroll
    titulo                      ="Nueva entrega"
    icono                       ="mdi-truck-delivery"      
    size-icon-carga             ="10em"
    class-contenido             ="row"
    padding-contenido           ="0"
    style                       ="width: 800px !important;"
    height-card-max             ="80vh"
    :cargando                   ="loading.entregas"
    >
    <template                   #barra>
      <alerta                   :entrega/>
      <!-- //* ///////////////////////////////////////////////////////////// Boton nueva entrega -->
      <q-btn
        v-bind                  ="style.btnBaseSm"
        label                   ="Crear"
        color                   ="positive"
        icon                    ="mdi-truck-fast"
        :disable                ="noSePuedeCrear"
        @click                  ="crearEntrega"
      /> 
    </template>
    <template                   #menu>
      <div class                ="row fit q-col-gutter-sm">
        <!-- //* ///////////////////////////////////////////////// Contacto entrega -->
        <div class              ="col-4">
          <select-contacto      tipo-entrega hundido
            v-model:contacto    ="entrega.contactoEntrega"
            label               ="Contacto entrega"
            icon                ="mdi-truck-delivery"
            :quitar-contacto    ="!acuerdo.esEntrega"
            :tercero            ="acuerdo.tercero"
            :disable            ="!acuerdo.tercero.id"
            @quitar-contacto    ="entrega.contactoEntrega = new Contacto()"
          />
        </div>
        <!-- //* ///////////////////////////////////////////////// Metodo entrega -->
        <div class              ="col-3">
          <select-label-value   hundido
            v-model             ="entrega.metodoEntrega"
            label               ="Método de entrega"
            icon                ="mdi-truck-delivery"
            error-message       ="Indique un método de entrega"
            :options            ="metodosEntrega"
            :loading            ="loading.metodoEntrega"
          />
        </div>
        <!-- //* ///////////////////////////////////////////////// Transportadora -->
        <div class              ="col-3">
          <select-label-value   hundido clearable
            v-model             ="entrega.transportadora"
            label               ="Transportadora"
            icon                ="mdi-truck"
            :options            ="transportadoras"
            :loading            ="!transportadoras.length"
          />
        </div>
        <div class              ="col">
          <q-btn-group          push spread>
            <q-btn              push glossy
              icon              ="mdi-minus-circle"
              @click            ="entregarNada"
              >
              <Tooltip label    ="Todas las cantidades en cero"/>
            </q-btn>
            <q-btn              push glossy
              icon              ="mdi-plus-circle" 
              @click            ="entregarTodo"
              >
              <Tooltip label    ="Entregar todo lo pendiente"/>
            </q-btn>     
          </q-btn-group>
        </div>
      </div>
    </template>
    <q-table                    dense flat square hide-bottom wrap-cells
      table-header-class        ="bg-gris text-grey-10"
      class                     ="fit"            
      row-key                   ="lineaId"
      :rows                     ="lineas"
      :rows-per-page-options    ="[200, 400]"
      :columns                  ="columnas"
      >
      <!-- //* ////////////////////////////////////////////////////////////// Imagen y Nombre -->
      <template #body-cell-ref  ="props">
        <q-td 
          :props                ="props"
          :class                ="props.row.class"
          >
          <div class            ="row">
            <!-- //* //////////////////////////////////////////////////////// Imagen -->
            <imagen-producto
              size              ="sm"
              class             ="col-shrink q-mr-sm"
              :class            ="!!props.row.qtyAEntregar ? 'op100' : 'op40'"
              :imagen           ="props.row.img"
              :nombre           ="props.row.nombre"
            />
            <!-- //* //////////////////////////////////////////////////////// Nombre-->
            <div
              class             ="width300 lh_1_3"
              :class            ="!!props.row.qtyAEntregar ? 'text-black' : 'text-grey-4'"
              >
              <span class       ="text-bold q-mr-xs">
                {{ props.row.ref }}
              </span>
              <span>
                {{ props.row.nombre }}
              </span>
            </div>
          </div>
        </q-td>
      </template>
      <!-- //* ////////////////////////////////////////////////////////////// Cantidad a enviar -->
      <template #body-cell-qtyAEntregar="props">
        <q-td :props            ="props">
          <div class            ="row justify-center items-center width200">
            <div>
              <q-btn
                v-bind          ="style.btnRedondoFlatSm"
                icon            ="mdi-close"
                :color          ="!!props.row.qtyAEntregar ? 'grey-6' : 'red'"
                @click          ="props.row.qtyAEntregar = 0"
                >
                <Tooltip label  ="No entregar"/>
              </q-btn>
            </div>
            <numero-paso
              v-model           ="props.row.qtyAEntregar"            
              modo              ="right"
              class             ="width120"
              :minimo           ="0"
              :maximo           ="props.row.qtyMaximoEntregar"
            />
            <div>
              <q-btn
                v-bind          ="style.btnRedondoFlatSm"
                icon            ="mdi-check"
                :color          ="props.row.qtyAEntregar === props.row.qtyPendiente ? 'green' : 'grey-6'"
                @click          ="props.row.qtyAEntregar = props.row.qtyMaximoEntregar"
                >
                <Tooltip label  ="Entregar completo"/>
              </q-btn>
            </div>          
          </div>
        </q-td>
      </template>      
    </q-table>
  </ventana>
</template>
<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            computed,
            onMounted             } from "vue"

  //* ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'      
  import {  useStoreUser          } from 'stores/user'
  import {  useStoreDexie         } from 'stores/dexieStore'
  import {  useStoreAcuerdo       } from 'stores/acuerdo'

  //* /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAcuerdo, Acuerdo     } from "src/areas/acuerdos/models/Acuerdo"
  import {  ILineaAcuerdo         } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  TIPO_ACUERDO          } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  import {  Contacto              } from "src/areas/terceros/models/Contacto"
  import {  IColumna,
            Columna               } from "src/models/Tabla"

  //* ///////////////////////////////////////////////////////////////////////////// Componibles  
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  useApiDolibarr        } from "src/composables/useApiDolibarr"
  import {  ToolType, useTools    } from "src/composables/useTools"
  import {  style                 } from "src/composables/useEstilos"
  import {  dexieMetodosEntrega,
            dexieTransportadoras  } from "src/composables/useDexie"

  //* ///////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    imagenProducto          from "src/areas/productos/components/Tools/ImagenProducto.vue"
  import    numeroPaso              from "components/utilidades/input/InputNumeroPaso.vue"
  import    selectContacto          from "src/areas/terceros/components/contactos/SelectContacto.vue"
  import    selectLabelValue        from "components/utilidades/select/SelectLabelValue.vue"
  import    alerta                  from "./Alerta.vue"
  
  const { apiDolibarr             } = useApiDolibarr()
  const { aviso                   } = useTools()
  const { usuario                 } = storeToRefs( useStoreUser() )
  const { acuerdo, loading        } = storeToRefs( useStoreAcuerdo() )
  const { buscarAcuerdoEnlazados  } = useControlAcuerdo()
  
  const entrega                     = ref<IAcuerdo>( new Acuerdo( TIPO_ACUERDO.ENTREGA_CLI ) )
  const lineas                      = ref<ILineaAcuerdo[]>([])

  type TEmit                        = { entregaCreada : [ id : number ]}
  const emit                        = defineEmits<TEmit>()

  dexieMetodosEntrega()
  dexieTransportadoras()
  const { metodosEntrega,
          transportadoras         } = storeToRefs( useStoreDexie() )

  const noSePuedeCrear              = computed(()=> entrega.value.alertaEntrega || lineas.value.every( l => !l.qtyAEntregar) )
  const entregarTodo                = ()=> lineas.value.forEach( l => l.qtyAEntregar = l.qtyPendiente )
  const entregarNada                = ()=> lineas.value.forEach( l => l.qtyAEntregar = 0 )

  const columnas: IColumna[]        = [
    new Columna({ name: "ref",            label: "Producto",    sortable: false }),
    new Columna({ name: "qty",            label: "Total",       sortable: false, align: "center"  }),
    new Columna({ name: "qtyEnEntregas",  label: "En entregas", sortable: false, align: "center"  }),
    new Columna({ name: "qtyAEntregar",   label: "A entregar",  sortable: false, align: "center"  }),
  ]

  onMounted( () => {
    acuerdo.value.calcularEntregado()
    lineas.value                    = acuerdo.value.productos.filter( p => p.tipo.esProducto )
    console.log("acuerdo.value.productos: ", acuerdo.value.productos);
    entrega.value.productos         = lineas.value
    entrega.value.metodoEntrega     = Object.assign( acuerdo.value.metodoEntrega,   {} )
    entrega.value.contactoEntrega   = Object.assign( acuerdo.value.contactoEntrega, {} )
    entrega.value.tercero           = Object.assign( acuerdo.value.tercero,         {} )
    entrega.value.comercial         = Object.assign( acuerdo.value.comercial,       {} )
    entrega.value.refCliente        = acuerdo.value.refCliente
    entrega.value.fechaEntrega      = acuerdo.value.fechaEntrega
    entrega.value.fechaADespachar   = acuerdo.value.fechaADespachar
  })

  async function crearEntrega()
  {
    loading.value.entregas    = true
    const entregaForApi       = entrega.value.getEntregaForApi( usuario.value.id, acuerdo.value.id, lineas.value.filter( l => !!l.qtyAEntregar ), acuerdo.value.ref )
    
    const { ok, data }        = await apiDolibarr("crear", "entrega", entregaForApi )
    if(!!ok){
      await buscarAcuerdoEnlazados()
      emit("entregaCreada", ToolType.anyToNum( data ))
      aviso("positive", "Nueva entrega creada")
    }

    loading.value.entregas    = false
  }
</script>