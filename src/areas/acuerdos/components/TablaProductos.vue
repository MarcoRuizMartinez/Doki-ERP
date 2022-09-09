<template>
  <q-table                      dense flat square wrap-cells
    v-model:selected            ="seleccion"
    table-header-class          ="bg-gris text-grey-10"
    row-key                     ="orden"
    class                       ="tabla-maco font-md"
    :selection                  ="estado === ESTADO_CTZ.BORRADOR ? 'multiple' : 'none'"
    :class                      ="$attrs.class"
    :rows                       ="grupo.productos"
    :columns                    ="columnas"
    :rows-per-page-options      ="[200, 400]"
    >
    <template                   #header-cell-ref="props">
      <q-th :props              ="props">
        <efecto efecto          ="Left">
          <div v-if             ="!seleccion.length">
            {{ props.col.label }}
          </div>
          <q-btn                dense no-caps
            v-else
            icon                ="mdi-playlist-edit"
            color               ="positive"
            size                ="14px"
            :label              ="seleccion.length >= 2 ? 'Editar Productos' : 'Editar Producto'"
            @click              ="ventanaEditarVarios = true"
            >
          </q-btn>
        </efecto>
      </q-th>
    </template>    
    <template #body-cell-ref    ="props">
      <q-td   :props            ="props"
        :class                  ="props.row.class" >
        <div class              ="w-600px">
          <div
            v-if                ="!!props.row.imagen"
            class               ="float-left"
            >
            <q-img
              :src              ="props.row.imagen100px"
              class             ="imagen-woo-sm cursor-pointer"
              spinner-color     ="white"
              @click            ="clickImagen( props.row )"
            />
            <q-tooltip          class="bg-black">
              <q-img
                :src            ="props.row.imagen300px"
                class           ="imagen-woo-lg"
                spinner-color   ="white"
              />
            </q-tooltip>
          </div>
          <div
            class               ="float-left cursor-pointer"
            style               ="display: contents;"
            @click              ="mostrarVentana( ( props.row as LineaAcuerdo ), props.rowIndex )"
            >
            <span class         ="text-bold">{{props.row.ref}}</span> - 
            <span class         ="text-subtitle1">{{props.row.nombre}} </span>
            <br/>
            <span 
              v-if              ="!!props.row.descripcion"
              v-html            ="props.row.descripcion"
              class             ="text-0_8em"
              >
            </span>
          </div>
        </div>
      </q-td>
    </template>
    <template #body-cell-qtyUnd ="props">
      <q-td>
        <div class="text-right cursor-pointer">
          {{ props.row.qtyUnd }}
        </div>
        <q-popup-edit           buttons
          v-if                  ="estado <= ESTADO_CTZ.BORRADOR"
          v-model               ="props.row.qty"
          v-slot                ="scope"
          label-set             ="Editar"
          @update:model-value   ="editarCantidad( props.row )"
          >
          <numero-paso
            v-model             ="scope.value"
            class               =""
            label               ="Cantidad"
            modo                ="right"
            :minimo             ="0.1"
            :readonly           ="estado > ESTADO_CTZ.BORRADOR"
            @enter              ="scope.set"
          />
        </q-popup-edit>
      </q-td>
    </template>
    <template #body-cell-descuentoX100="props">
      <q-td :props="props">
        <div class="text-right cursor-pointer">
          {{ props.value }}
        </div>
        <q-popup-edit           buttons
          v-if                  ="estado <= ESTADO_CTZ.BORRADOR"
          v-model               ="props.row.descuentoX100"
          v-slot                ="scope"
          label-set             ="Editar"
          @update:model-value   ="editarDescuento( props.row )"
          >
          <numero-paso          porcentaje
            v-model             ="scope.value"
            label               ="Descuento"
            modo                ="right"
            :paso               ="0.1"
            :maximo             ="props.row.x100Maximo"
            :minimo             ="0"
            :readonly           ="estado > ESTADO_CTZ.BORRADOR"
            @enter              ="scope.set"
          />        
        </q-popup-edit>
      </q-td>
    </template>    
    <template #body-cell-precioBase ="props">
      <q-td :props="props">
        <precio-tabla
          :precio               ="(props.row.precioBase   as number)"
          :iva                  ="(props.row.iva          as number)"
        />
      </q-td>
    </template>
    <template #body-cell-precioFinal="props">
      <q-td :props="props">
        <precio-tabla
          :precio               ="(props.row.precioFinal  as number)"
          :iva                  ="(props.row.iva          as number)"
        />
      </q-td>
    </template>
    <template #body-cell-totalConDescu="props">
      <q-td :props="props">
        <precio-tabla           negrita
          :precio               ="(props.row.totalConDescu  as number)"
          :iva                  ="(props.row.iva            as number)"
        />
      </q-td>
    </template>       
    <template                   #bottom>
      <q-space/>
      <!-- //* ///////////////////////////////////////////////////// Con total  -->
      <q-toggle       dense
        v-model       ="grupo.conTotal"
        label         ="Subtotal"
        class         ="q-mr-lg text-bold text-1_3em text-grey-8"
        @update:model-value="( toggle ) => editarSubTotales( toggle, grupo )"
      /> 
      <span
        class         ="fuente-mono text-1_2em"
        :class        ="{ 'text-grey-6' : !grupo.conTotal }"
        >
        {{ formatoPrecio( grupo.totalConDescu )}}
      </span>
    </template>
  </q-table>
  <q-dialog
    v-model                     ="ventanaLinea"
    @hide                       ="cerrarVentana"
    >
    <formulario-linea
      v-model                   ="lineaSelect"
      :estado                   ="estado"
      @update:model-value       ="lineaEditada"
      @cerrar                   ="cerrarVentana"
      @borrar                   ="borrarLinea"
    />
  </q-dialog>
  <q-dialog v-model             ="ventanaEditarVarios"
    >
    <editar-en-masa             
      v-model:lineas            ="seleccion"
      @edicion-ok               ="editarVariosOk"
      @borrar-linea             ="borrarLinea"
      @borrado-ok               ="limpiarSeleccion"
    />
  </q-dialog>
  <q-dialog v-model             ="ventanaImagen">
    <visor-imagen v-bind        ="imagenBig"/>
  </q-dialog>  
</template>
<script setup lang="ts">
  import {  ref,
            PropType,
            toRefs
                              } from "vue"
  import {  ILineaAcuerdo,
            LineaAcuerdo      } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  IColumna,
            Columna           } from "src/models/Tabla"
  import {  IGrupoLineas      } from "src/areas/acuerdos/models/GrupoLineasAcuerdo"
  import {  formatoPrecio,
            useTools          } from "src/useSimpleOk/useTools"
  import    formularioLinea     from "src/areas/acuerdos/components/FormularioLinea.vue"
  import    visorImagen         from "components/utilidades/VisorImagen.vue"
  import    efecto              from "components/utilidades/Efecto.vue"
  import    editarEnMasa        from "src/areas/acuerdos/components/TablaProductosEditarEnMasa.vue"  
  import    precioTabla         from "src/areas/acuerdos/components/TablaProductosPrecio.vue"  
  import    numeroPaso          from "components/utilidades/input/InputNumeroPaso.vue"
  import {  ESTADO_CTZ        } from "src/areas/acuerdos/cotizaciones/models/Cotizacion"
  import {  useApiDolibarr    } from "src/services/useApiDolibarr"

  const { aviso               } = useTools()
  const { apiDolibarr         } = useApiDolibarr()
  const emit                    = defineEmits(["update:grupo", "editarSubTotales"])
  const props                   = defineProps({
    grupo:      { required: true,   type: Object as PropType< IGrupoLineas >  },
    estado:     { required: true,   type: Number as PropType< ESTADO_CTZ >    },
  })
  const { grupo, estado       } = toRefs( props )

  const lineaSelect             = ref< ILineaAcuerdo    >( new LineaAcuerdo() )
  const seleccion               = ref< ILineaAcuerdo[]  >([])
  const ventanaLinea            = ref< boolean >( false )
  const ventanaImagen           = ref< boolean >( false )
  const ventanaEditarVarios     = ref< boolean >( false )
  type  TImagenBig              = { src : string, titulo: string }
  const imagenBig               = ref< TImagenBig >( { titulo: "", src: "" } )
  const limpiarSeleccion        = ()=> seleccion.value = []

  const columnas: IColumna[]    = [
    new Columna           ({ name: "ref",           label: "Productos", sortable: false }),
    //new Columna           ({ name: "orden",                             sortable: false }),
    new Columna           ({ name: "qtyUnd",        label: "Cant",      sortable: false,  align: "right"}),
    Columna.ColumnaPrecio ({ name: "precioBase",    label: "Precio",    sortable: false,  clase: "text-grey-7"  }),
    Columna.ColumnaX100   ({ name: "descuentoX100", label: "Descu",     sortable: false  }),
    Columna.ColumnaPrecio ({ name: "precioFinal",   label: "$ Final",   sortable: false  }),
    Columna.ColumnaPrecio ({ name: "totalConDescu", label: "Total",     sortable: false,  clase: "text-bold"    }),
  ]
  //columnas.forEach( c =>  { c.sortable = false } )

  function mostrarVentana( linea : ILineaAcuerdo, index : number )
  {
    ventanaLinea.value          = true
    lineaSelect.value           = linea
    linea.destacar( "seleccionar" )
  }

  function cerrarVentana()
  {
    lineaSelect.value.destacar( "no-destacar" )
    ventanaLinea.value          = false
  }

  function lineaEditada( lineaModificada : ILineaAcuerdo )
  {
    let i                       = grupo.value.productos.findIndex( p => p.orden == lineaModificada.orden )
    grupo.value.productos[i]    = lineaModificada
    emitir()
  }

  

  function borrarLinea( lineaModificada : ILineaAcuerdo )
  {
    let i                       = grupo.value.productos.findIndex( p => p.orden == lineaModificada.orden )
    setTimeout( ()=>
      {
        grupo.value.productos.splice(i, 1)
        emitir()
        seleccion.value         =[]
      }, 1200 ) 
  }

  function editarVariosOk()
  {
    ventanaEditarVarios.value   = false
    emitir()
  }

  function emitir()
  {
    emit("update:grupo", grupo.value)
  }


  async function editarCantidad( linea : ILineaAcuerdo )
  {
    if(estado.value             === ESTADO_CTZ.NO_GUARDADO){
      emitir()
      return
    }

    
    const objecto               = { qty: linea.qty, id: linea.lineaId }
    let {ok}                    = await apiDolibarr("editar", "lineaCotizacion", objecto, linea.padreId )
    if(ok)
    {
      emitir()
      aviso("positive", "Cantidad cambiada")
    }
  }

  async function editarDescuento( linea : ILineaAcuerdo )
  {
    if(estado.value             === ESTADO_CTZ.NO_GUARDADO){
      emitir()
      return
    }

    const objecto               = { remise_percent: linea.descuentoX100, id: linea.lineaId }
    let {ok}                    = await apiDolibarr("editar", "lineaCotizacion", objecto, linea.padreId )
    if(ok)
    {
      emitir()
      aviso("positive", "Descuento cambiado")
    }
  }

  function clickImagen( linea : ILineaAcuerdo ){
    imagenBig.value             = { titulo: linea.nombre, src: linea.imagenFull }
    ventanaImagen.value         = true
  }


  //(e: 'cambio',         value: "editarSubTotales" | "moverGrupo" ): void

  async function editarSubTotales( conSubTotal :boolean , grupo : IGrupoLineas )
  {
    grupo.conTotal              = conSubTotal
    if(conSubTotal)
    {
      emit("editarSubTotales")
    }
    else if(!!grupo.lineaIdSubtotal) // quiere decir que si hay una fila en DB y debe ser eliminada 
    {
      let {ok, data}            = await apiDolibarr("borrar", "lineaCotizacion", grupo.lineaIdSubtotal, grupo.padreId )
      if(ok)
      {
        grupo.lineaIdSubtotal   = 0
      }
    }
  }


</script>
<style>
.w-600px{
  width: 600px;
}
</style>