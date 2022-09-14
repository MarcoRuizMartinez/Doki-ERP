<template>
  <ventana                    cerrar
    :titulo                   ="linea.ref + ' - ' + linea.nombre"
    icono                     ="mdi-package-variant-closed"
    class-contenido           ="row ancho-ventana q-col-gutter-sm justify-left"
    :cargando                 ="loading.editarLinea || loading.borrarLinea"
    >
    <!-- //* ///////////////////////////////////////////////////////////// Referencia y nombre -->
    <div class="text-1_2em col-12"><span class="text-bold">{{linea.ref}}</span> - {{linea.nombre}}</div>
    <!-- //* ///////////////////////////////////////////////////////////// Cantidad -->
    <numero-paso
      v-model                 ="linea.qty"
      class                   ="col-5 col-md-6"
      label                   ="Cantidad"
      modo                    ="right"
      :minimo                 ="0.1"
      :readonly               ="acuerdo.estado > ESTADO_CTZ.BORRADOR"
    />
    <!-- //* ///////////////////////////////////////////////////////////// Precio Base -->
    <input-number             no-undefined
      v-model                 ="linea.precioBase"
      label                   ="Precio base"
      tipo                    ="precio"
      class                   ="col-7 col-md-6"
      colores                 ="verde-rojo"
      iconos                  ="suma"
      :minimo                 ="linea.precioMinimo"
      :alerta                 ="false"
      :con-decimales          ="conDecimales"
      :paso                   ="conDecimales ? 0.01 : 100"
      :readonly               ="acuerdo.estado > ESTADO_CTZ.BORRADOR"
    />
    <!-- //* ///////////////////////////////////////////////////////////// Descuento -->
    <numero-paso              porcentaje
      v-model                 ="linea.descuentoX100"
      label                   ="Descuento"
      modo                    ="right"
      class                   ="col-5 col-md-6"
      :paso                   ="0.1"
      :maximo                 ="linea.x100Maximo"
      :minimo                 ="0"
      :readonly               ="acuerdo.estado > ESTADO_CTZ.BORRADOR"
    />
    <!-- //* ///////////////////////////////////////////////////////////// Precio final -->
    <input-number
      v-model                 ="linea.precioFinal"
      label                   ="Precio final"
      class                   ="col-7 col-md-6"
      tipo                    ="precio"
      colores                 ="verde-rojo"
      iconos                  ="suma"
      :maximo                 ="linea.precioBase"
      :minimo                 ="linea.precioMinimo"
      :alerta                 ="false"
      :con-decimales          ="conDecimales"
      :paso                   ="conDecimales ? 0.01 : 50"
      :readonly               ="acuerdo.estado > ESTADO_CTZ.BORRADOR"
    />
    <!-- //* ///////////////////////////////////////////////////////////// Descuento valor -->
    <div class                ="col-5 col-md-6">
      <div
        class                 ="text-center bg-grey-3 fit column items-center justify-center"
        style                 ="min-height: 40px; max-height: 40px;"
        >
        <span class="h-20px">Descuento:</span>
        <span class           ="fuente-mono text-grey-8 h-20px">
          {{ formatoPrecio( linea.descuentoValor ) }}
        </span>
      </div>    
    </div>
    <!-- //* ///////////////////////////////////////////////////////////// Precio con IVA -->
    <input-number             con-decimales
      v-model                 ="linea.precioFinalConIVA"
      label                   ="Precio con IVA"
      class                   ="col-7 col-md-6"
      tipo                    ="precio"
      colores                 ="verde-rojo"
      iconos                  ="suma"
      :alerta                 ="false"
      :minimo                 ="linea.precioMinimoConIVA"
      :paso                   ="conDecimales ? 0.01 : 50"
      :readonly               ="acuerdo.estado > ESTADO_CTZ.BORRADOR"
    />
    <!-- //* ///////////////////////////////////////////////////////////// Tabla totales -->
    <div        class         ="col-12">
      <div      class         ="row justify-center bg-grey-3 rounded-borders">
        <table  class         ="tabla-totales text_12px">
          <tr>
            <td>Subtotal bruto:</td>
            <td>{{ formatoPrecio( aTotalSinDescu )}}</td>
          </tr>
          <tr>
            <td>Descuento:</td>
            <td>{{ formatoPrecio( aDescuento )}}</td>
          </tr>
          <tr>
            <td>Subtotal neto:</td>
            <td>{{ formatoPrecio( aTotalConDescu )}}</td>
          </tr>
          <tr>
            <td>IVA:</td>
            <td>{{ formatoPrecio(  aIVA )}}</td>
          </tr>        
          <tr>
            <td>Total:</td>
            <td>{{ formatoPrecio(  aTotal )}}</td>
          </tr>       
        </table>
      </div>
    </div>
    <!-- //* ///////////////////////////////////////////////////////////// Unidad -->
    <select-label-value       no-inmediato use-input
      v-model                 ="linea.unidad"
      label                   ="Tipo de unidad"
      icon                    ="mdi-tape-measure"
      class                   ="col-12"
      behavior                ="dialog"
      options-sort            ="orden"
      :options                ="unidades"
      :readonly               ="acuerdo.estado > ESTADO_CTZ.BORRADOR"
    />
    <!-- //* ///////////////////////////////////////////////////////////// Descripcion -->
    <div class                ="col-12">
      <q-editor                 
        v-model               ="linea.descripcion"
        v-bind                ="WYSIWYG_Limpio"
        :readonly             ="acuerdo.estado > ESTADO_CTZ.BORRADOR"
      />
    </div>
    <!-- //* ///////////////////////////////////////////////////////////// Boton Borrar -->
    <div
      v-if                    ="acuerdo.estado <= ESTADO_CTZ.BORRADOR"
      class                   ="col-6"
      >
      <q-btn                  flat 
        label                 ="Borrar"        
        class                 ="full-width"
        color                 ="negative"
        icon                  ="mdi-trash-can"
        @click                ="confirmarBorrar"
      />
    </div>
    <!-- //* ///////////////////////////////////////////////////////////// Boton Guardar -->
    <div
      v-if                    ="acuerdo.estado <= ESTADO_CTZ.BORRADOR"
      class                   ="col-6"
      >
      <q-btn                  flat
        label                 ="Guardar"        
        class                 ="full-width"
        color                 ="positive"
        icon                  ="mdi-content-save"
        :disable              ="lineaVirgen"
        @click                ="guardar"
      />
    </div>    
  </ventana>
</template>
<script setup lang="ts">
  import    ventana             from "components/utilidades/Ventana.vue"
  import    numeroPaso          from "src/components/utilidades/input/InputNumeroPaso.vue"
  import    inputNumber         from "src/components/utilidades/input/InputFormNumber.vue"
  import {  storeToRefs       } from 'pinia'  
  import {  ILineaAcuerdo,
            LineaAcuerdo      } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  useApiDolibarr    } from "src/services/useApiDolibarr"
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"            
  import    selectLabelValue    from "components/utilidades/select/SelectLabelValue.vue"            
  import {  WYSIWYG_Limpio    } from "src/useSimpleOk/useEstilos"
  import {  dexieUnidades     } from "src/services/useDexie"
  import {  ESTADO_CTZ        } from "src/areas/acuerdos/cotizaciones/models/Cotizacion"
  import {  formatoPrecio,
            useTools          } from "src/useSimpleOk/useTools"
  import {  useTransition     } from '@vueuse/core'
  import {  useQuasar         } from 'quasar'
  import {  useStoreAcuerdo   } from 'src/stores/acuerdo'
  import {  ref,
            PropType,
            toRefs,
            computed
                              } from "vue"
  
  const { dialog              } = useQuasar()
  const { apiDolibarr         } = useApiDolibarr()
  const { aviso               } = useTools()
  const unidades                = dexieUnidades()
  const emit                    = defineEmits<{
    (e: 'update:model-value',   value: ILineaAcuerdo        ): void
    (e: 'cerrar',               value: void ): void
    (e: 'borrar',               value: void ): void
  }>()  
  const storeAcuerdo            = useStoreAcuerdo()
  const { acuerdo,
          loading,
          grupoElegido,
          lineaElegida        } = storeToRefs(storeAcuerdo)  


  const linea                   = ref< ILineaAcuerdo >( Object.assign( new LineaAcuerdo(), lineaElegida.value ) )
  const copiaLinea              = JSON.stringify(linea.value)
  let conDecimales              = Boolean(!!process.env.CON_DECIMALES)
  const { borrarLinea   
                              } = useControlProductos()

  const duracion                = 300
  const aTotalConDescu          = useTransition( computed(()=> linea.value.totalConDescu  ),  { duration: duracion } )
  const aTotalSinDescu          = useTransition( computed(()=> linea.value.totalSinDescu  ),  { duration: duracion } )
  const aDescuento              = useTransition( computed(()=> linea.value.totalDescuento ),  { duration: duracion } )
  const aIVA                    = useTransition( computed(()=> linea.value.ivaValorTotal  ),  { duration: duracion } )
  const aTotal                  = useTransition( computed(()=> linea.value.totalConIva    ),  { duration: duracion } )



  async function guardar()
  {
    loading.value.editar        = true    
    let lineaAPI                = LineaAcuerdo.lineaToLineaApi( linea.value )
    const estadoBoceto          = acuerdo.value.estado === ESTADO_CTZ.NO_GUARDADO
    let seguir                  = true
    if(!estadoBoceto){
      let {ok, data}            = await apiDolibarr("editar-linea", "cotizacion", lineaAPI, linea.value.padreId )
      seguir                    = ok
    }

    loading.value.editar        = false
    if(seguir || estadoBoceto)
    {
      linea.value.destacar( "guardar", "ocultar" )
      aviso("positive", "Producto editado")
      emit("update:model-value", linea.value)
      emit("cerrar")
    }
  }

  function confirmarBorrar()
  {
    dialog({
      title:    'Confirmar',
      message:  'Realmente deseas eliminar esta linea?',
      cancel:   true,
      class:    "text-center",
      html:     true,
    }).onOk( borrarLineasDesdeControl )
  }

  async function borrarLineasDesdeControl()
  {
    const ok = await borrarLinea( lineaElegida.value )
    if(ok){
    //emit("update:model-value", linea.value)
    emit("cerrar")
    //emit("borrar", linea.value)
    }
  }



  const lineaVirgen             = computed(() : boolean =>{
    let lineaActual             = JSON.stringify( linea.value )
    return lineaActual === copiaLinea
  })

</script>
