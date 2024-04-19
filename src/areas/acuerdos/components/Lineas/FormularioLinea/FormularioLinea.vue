<template>
  <ventana                    cerrar scroll
    :titulo                   ="`${linea.ref} - ${linea.nombre}`"
    icono                     ="mdi-package-variant-closed"
    class-contenido           ="ancho-ventana"
    height-card-max           ="75vh"
    :cargando                 ="loading.editarLinea || loading.borrarLinea"
    >
    <q-form
      ref                       ="formulario"
      @submit                   ="onSubmit"
      class                     ="row q-col-gutter-sm justify-start"
      >
      <!-- //* ///////////////////////////////////////////////////////////// Referencia y nombre -->
      <div class="text-1_2em col-12">
        <span class="text-bold">{{linea.ref}}</span> - {{linea.nombre}} {{ !!linea.nombreExtra ? ' ' + linea.nombreExtra : '' }}
        <q-popup-edit           auto-save
          v-model               ="linea.nombreExtra"
          v-slot                ="scope"
          class                 ="panel-blur-70"
          anchor                ="center left"
          >          
          <q-input              dense filled
            v-model             ="scope.value"
            :label              ="linea.nombre"
            @keyup.enter        ="scope.set"
          />
        </q-popup-edit>          
        <Tooltip label          ="Agregar un texto adicional al nombre"/>
      </div>
      <!-- //* ///////////////////////////////////////////////////////////// Cantidad -->
      <numero-paso
        v-model                 ="linea.qty"
        class                   ="col-5 col-md-6"
        label                   ="Cantidad"
        modo                    ="right"
        :minimo                 ="0.1"
        :readonly               ="acuerdo.esEstadoValido"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Precio Base -->
      <input-number             no-undefined
        v-model                 ="linea.precioBase"
        label                   ="Precio base"
        tipo                    ="precio"
        class                   ="col-7 col-md-6"
        colores                 ="verde-rojo"
        iconos                  ="suma"
        debounce                ="2500"
        :minimo                 ="linea.precioMinimo"
        :alerta                 ="false"
        :con-decimales          ="conDecimales"
        :paso                   ="conDecimales ? 0.01 : 100"
        :readonly               ="acuerdo.esEstadoValido"
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
        :readonly               ="acuerdo.esEstadoValido"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Precio final -->
      <input-number
        v-model                 ="linea.precioFinal"
        label                   ="Precio final"
        class                   ="col-7 col-md-6"
        tipo                    ="precio"
        colores                 ="verde-rojo"
        iconos                  ="suma"
        debounce                ="2500"
        :maximo                 ="linea.precioBase"
        :minimo                 ="linea.precioMinimo"
        :alerta                 ="false"
        :con-decimales          ="conDecimales"
        :paso                   ="conDecimales ? 0.01 : 50"
        :readonly               ="acuerdo.esEstadoValido"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Slider Descuento  -->
      <slider-descuento
        v-model                 ="linea"
        class                   ="col-12"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Descuento valor -->
      <div class                ="col-5 col-md-6">
        <div
          class                 ="text-center bg-grey-3 fit column items-center justify-center"
          style                 ="min-height: 40px; max-height: 40px;"
          >
          <span class="h-20px">Descuento:</span>
          <span class           ="fuente-mono text-grey-8 h-20px">
            {{ Format.precio( linea.descuentoValor ) }}
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
        :readonly               ="acuerdo.esEstadoValido"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Tabla totales -->
      <div        class         ="col-12">
        <div      class         ="row justify-center bg-grey-3 rounded-borders">
          <table  class         ="tabla-totales">
            <tr>
              <td>Subtotal bruto:</td>
              <td>{{ Format.precio( aTotalSinDescu )}}</td>
            </tr>
            <tr>
              <td>Descuento {{ linea.nivelPrecios.toString().toUpperCase()}}:</td>
              <td>{{ Format.precio( aDescuento )}}</td>
            </tr>
            <tr>
              <td>Subtotal neto:</td>
              <td>{{ Format.precio( aTotalConDescu )}}</td>
            </tr>
            <tr>
              <td>IVA:</td>
              <td>{{ Format.precio(  aIVA )}}</td>
            </tr>
            <tr>
              <td>Total:</td>
              <td>{{ Format.precio(  aTotal )}}</td>
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
        defecto                 ="UND - Unidad"
        :options                ="unidades"
        :readonly               ="acuerdo.esEstadoValido"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Descripcion -->
      <div class                ="col-12">
        <q-editor
          v-model               ="linea.descripcion"
          v-bind                ="WYSIWYG_Limpio"
          :readonly             ="acuerdo.esEstadoValido"        
          @update:model-value   ="limpiarDescripcion"        
        />
      </div>
      <div class                ="col-12">
        <!-- //* ///////////////////////////////////////////////////////////// Nota -->
        <input-text
          v-model               ="linea.urlImagen"
          label                 ="Link de imagen"
          icon                  ="mdi-image"
          :rules                ="[ reglaURLImagen ]"
        />
      </div>
    </q-form>
    <template #acciones>
      <!-- //* ///////////////////////////////////////////////////////////// Boton Borrar -->
      <!-- v-if                    ="acuerdo.esEstadoNoValidado" -->
      <div
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
      <!-- v-if                    ="acuerdo.estado <= ESTADO_CTZ.BORRADOR" -->
      <div
        class                   ="col-6"
        >
        <q-btn                  flat
          label                 ="Guardar"
          class                 ="full-width"
          color                 ="positive"
          icon                  ="mdi-content-save"
          :disable              ="lineaVirgen"
          @click                ="validar"
        />
      </div>
    </template>
    
  </ventana>
</template>

<script setup lang="ts">
  //* ////////////////////////////////////////////////////////////////////////// Core
  import {  ref, 
            computed
                                } from "vue"
  import {  useTransition       } from '@vueuse/core'
  import {  useQuasar, QForm    } from 'quasar'
  //* ////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreAcuerdo     } from 'stores/acuerdo'
  import {  useStoreDexie       } from 'stores/dexieStore'
  //* ////////////////////////////////////////////////////////////////////////// Modelos
  import {  ILineaAcuerdo,
            LineaAcuerdo        } from "src/areas/acuerdos/models/LineaAcuerdo"
  //* ////////////////////////////////////////////////////////////////////////// Componibles
  import {  WYSIWYG_Limpio      } from "src/composables/useEstilos"
  import {  dexieUnidades       } from "src/composables/useDexie"  
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  import {  Format, ToolType    } from "src/composables/useTools"
  import {  useApiDolibarr      } from "src/composables/useApiDolibarr"
  //* ////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    numeroPaso            from "components/utilidades/input/InputNumeroPaso.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    inputText             from "components/utilidades/input/InputFormText.vue"
  import    sliderDescuento       from "./SliderDescuento.vue"

  const { dialog              } = useQuasar()
  dexieUnidades()
  const { unidades            } = storeToRefs( useStoreDexie() )
  /* const emit                    = defineEmits<{
    (e: 'update:model-value',   value: ILineaAcuerdo        ): void
    (e: 'cerrar',               value: void ): void
    (e: 'borrar',               value: void ): void
  }>() */
  const { acuerdo,
          loading,          
          lineaElegida        } = storeToRefs( useStoreAcuerdo() )

  const linea                   = ref< ILineaAcuerdo >( Object.assign( new LineaAcuerdo(), lineaElegida.value ) )
  const copiaLinea              = JSON.stringify(linea.value)
  const formulario              = ref< InstanceType<typeof QForm> | null>(null)
  let conDecimales              = Boolean(!!process.env.CON_DECIMALES)
  const { editarLinea,
          borrarLinea
                              } = useControlProductos()
  const { apiDolibarr         } = useApiDolibarr()
  const duracion                = { duration: 300 }
  const aTotalConDescu          = useTransition( computed(()=> linea.value.totalConDescu  ),   )
  const aTotalSinDescu          = useTransition( computed(()=> linea.value.totalSinDescu  ),  duracion )
  const aDescuento              = useTransition( computed(()=> linea.value.totalDescuento ),  duracion )
  const aIVA                    = useTransition( computed(()=> linea.value.ivaValorTotal  ),  duracion )
  const aTotal                  = useTransition( computed(()=> linea.value.totalConIva    ),  duracion )

  //* ////////////////////////////////////////////////////////////////////////////////////// Validar
  async function validar() {
    if(!formulario.value) return
    const validacionOk          = await formulario.value.validate()
    if(validacionOk)
    onSubmit()  
  }

  async function onSubmit()
  {
    editarLinea( linea.value )
  }

  function confirmarBorrar()
  {
    dialog({
      title:    'Confirmar',
      message:  'Realmente deseas eliminar esta linea?',
      cancel:   true,
      class:    "text-center",
      html:     true,
    }).onOk( borrarConfirmado )
  }

  async function borrarConfirmado()
  {
    const ok = await borrarLinea( lineaElegida.value )
    //if(ok){
      //emit("update:model-value", linea.value)
      //emit("cerrar")
      //emit("borrar", linea.value)
    //}
  }

  /* async function guardarDescripcion()
  {
    limpiarDescripcion()
    if(linea.value.descripcion.length < 10 ) return
    const { ok, data }        = await apiDolibarr("editar", "producto", { description: linea.value.descripcion }, linea.value.id )
    if(ok)  aviso( "positive", "Descripción de producto modificada" )
  } */

  const lineaVirgen             = computed(() : boolean =>{
    let lineaActual             = JSON.stringify( linea.value )
    return lineaActual === copiaLinea
  })

  function limpiarDescripcion()
  {    
    linea.value.descripcion     = linea.value.descripcion .replaceAll('"', "")
                                                          .replaceAll("'", "")
                                                          .replaceAll("&nbsp;&nbsp;", " ")
                                                          .replaceAll("  ", " ")
                                                          .replaceAll("&nbsp; ", " ")                                                          
                                                          .trim()
  }

  function reglaURLImagen() : boolean | string
  {
    if(!linea.value.urlImagen) return true
    
    const esURL = ToolType.esURLValida( linea.value.urlImagen )
    return esURL  || "Dirección de imagen invalida"
  }

  /*
:definitions          ="{
          save: {
            tip:              'Guardar descripción',
            icon:             'mdi-content-save',
            label:            'Guardar descripción en base de datos',
            handler:          guardarDescripcion
          }
        }"  
  */
</script>