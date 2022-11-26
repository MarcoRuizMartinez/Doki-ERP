<template>
  <ventana                      cerrar
    class-contenido             ="column items-center"
    titulo                      ="Anticipo"
    icono                       ="mdi-cash"
    :cargando                   ="cargando"
    >
    <template                   #barra>
      <efecto efecto            ="Down">
        <q-btn
          v-if                  ="!modelo.esNuevo"
          v-bind                ="btnBaseSm"
          color                 ="grey-10"
          icon                  ="mdi-close"
          label                 ="Borrar"
          >
          <confirmar  @ok       ="borrarAnticipo"/>
        </q-btn>
      </efecto>       
      <q-btn
        v-bind                  ="btnBaseSm"
        color                   ="positive"
        icon                    ="mdi-cash-plus"
        :label                  ="modelo.esNuevo ? 'Crear' : 'Guardar'"
        :disable                ="btnDisable"
        @click                  ="validar"
      />        
    </template>
    <!-- //* ///////////////////////////////////////////////////////////////   FORMULARIO  -->
    <q-form
      ref                       ="formulario"
      @submit                   ="onSubmit"
      class                     ="row q-col-gutter-md"
      >
      <!-- //* ///////////////////////////////////////////////////////////// Cuenta -->
      <select-label-value       alerta
        v-model                 ="modelo.cuenta"
        label                   ="Cuenta"
        icon                    ="mdi-wallet"
        class                   ="col-12"
        :options                ="cuentas"
        :loading                ="!cuentas.length"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Valor -->
      <input-number             no-undefined alerta solo-positivo no-cero
        v-model                 ="modelo.valor"
        label                   ="Valor"
        tipo                    ="precio"
        class                   ="col-md-5 col-11"
        icon                    ="mdi-cash-usd"
        debounce                ="2500"
        :rules                  ="[]"
        :minimo                 ="0"
      />
      <div class                ="col-1">
        <q-btn
          v-bind                ="btnRedondoFlat"
          icon                  ="mdi-account-cash"
          class                 ="q-mt-sm"
          @click                ="modelo.valor = acuerdo.saldo"
        />
      </div>
      <!-- //* ///////////////////////////////////////////////////////////// Fecha pago -->
      <input-fecha              no-futuro clearable alerta
        v-model                 ="modelo.fechaPago"
        label                   ="Fecha"
        class                   ="col-md-6 col-12"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Estado -->
      <select-label-value       alerta
        v-model                 ="modelo.estadoSelect"
        label                   ="Estado"
        icon                    ="mdi-cash-check"
        class                   ="col-md-6 col-12"
        :defecto                ="ESTADO_ANTICIPO_LABEL.PENDIENTE"
        :options                ="Anticipo.estados"
        @update:model-value     ="modelo.estado = modelo.estadoSelect.value"
      />    
      <!-- //* ///////////////////////////////////////////////////////////// Tipo -->
      <select-label-value       alerta
        v-model                 ="modelo.tipoSelect"
        label                   ="Tipo"
        icon                    ="mdi-cash-refund"
        class                   ="col-md-6 col-12"
        :defecto                ="TIPO_ANTICIPO_LABEL.PAGO"
        :options                ="Anticipo.tipos"
        @update:model-value     ="modelo.tipo = modelo.tipoSelect.value"
      />  
      <!-- //* ///////////////////////////////////////////////////////////// Nota -->
      <input-text               
        v-model                 ="modelo.nota"
        label                   ="Nota"
        icon                    ="mdi-comment-quote"
        class                   ="col-12"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Comprobante interno -->
      <select-label-value       clearable
        v-model                 ="modelo.fileInterno"
        label                   ="Comprobante pago"
        icon                    ="mdi-bank"
        class                   ="col-12"
        :options                ="acuerdo.archivos"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Comprobante Cliente -->
      <select-label-value       clearable
        v-model                 ="modelo.fileCliente"
        label                   ="Recibo de cliente"
        icon                    ="mdi-account-cash"
        class                   ="col-12"
        :options                ="acuerdo.archivos"
      />
      <q-btn
        v-show                  ="false"
        type                    ="submit"
      />
    </q-form>
  </ventana>
</template>
<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            toRefs,
            watch,
            computed,
            PropType,
                                } from "vue"
  // * ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAnticipo, Anticipo,
            TIPO_ANTICIPO_LABEL,
            ESTADO_ANTICIPO_LABEL
                                } from "src/areas/acuerdos/models/Anticipo"
  //* /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'stores/acuerdo'
  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useTools            } from "src/useSimpleOk/useTools"  
  import {  useFetch            } from "src/useSimpleOk/useFetch"
  import {  btnBaseSm,
            btnRedondoFlat      } from "src/useSimpleOk/useEstilos"
  import {  dexieCuentasDinero  } from "src/services/useDexie"  
  import {  getURL, getFormData } from "src/services/APIMaco"  
  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"
  import    inputText             from "src/components/utilidades/input/InputFormText.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    inputFecha            from "src/components/utilidades/input/InputFecha.vue"
  import    efecto                from "components/utilidades/Efecto.vue"
  import    confirmar             from "components/utilidades/MenuConfirmar.vue"

  const { acuerdo           } = storeToRefs( useStoreAcuerdo() )
  const { aviso             } = useTools()
  const { miFetch           } = useFetch()
  const cuentas               = dexieCuentasDinero()
  const modelo                = ref< IAnticipo  >( new Anticipo() )
  const cargando              = ref< boolean    >( false )
  const formulario            = ref< any >()
  const endPoint              = getURL("servicios", "pagos")
  let   copiaAnticipo         = ""

  const props                 = defineProps({      
    modelValue:   { required: true,  type: Object as PropType< IAnticipo >  },
  })
  const { modelValue }        = toRefs( props )

  const emit                  = defineEmits<{
    (e: "update:modelValue",  value: IAnticipo ): void
    (e: "creado",             value: IAnticipo ): void
    (e: "borrado",            value: IAnticipo ): void
  }>()

  const modificado            = computed( ()=>  copiaAnticipo !== JSON.stringify( modelo.value ) ) 
  const btnDisable            = computed( ()=> !modelo.value.esNuevo && !modificado.value)
  const objetoToFetch         = computed( ()=> { return {
                                                    body: getFormData( modelo.value.esNuevo ? "nuevoAnticipo" : "editarAnticipo", modelo.value.anticipoToApi ),
                                                    method: "POST"
                                                  }
                                                }
                                        )
  
  watch(modelValue, (newAnticipo) =>
    {
      modelo.value            = Object.assign( new Anticipo(), newAnticipo )
      if(!!newAnticipo.id)
      {
        copiaAnticipo         = JSON.stringify( modelo.value )
      }
    },
    { immediate: true }
  )

  //* ////////////////////////////////////////////////////////////////////////////////////// Validar
  async function validar() {
    const  validacionOk        = await formulario.value.validate()
    if(validacionOk)          onSubmit()  
  }

  //* ////////////////////////////////////////////////////////////////////////////////////// Submit
  async function onSubmit()
  {
    cargando.value            = true
    const { data, ok  }       = await miFetch( endPoint, objetoToFetch.value, { mensaje: "guardar anticipo" } )

    if(ok)
    {
      aviso( "positive", "Anticipo guardaro exitosamente" )

      if(modelo.value.esNuevo){
        modelo.value.id     = parseInt( data as string )
        emit("creado", modelo.value)
      }
      else{
        emit("update:modelValue", modelo.value)
      }
    }
    else
      aviso( "negative", "Error al guardar anticipo. Por favor vuelve a intentarlo" )

    cargando.value            = false
  }

  async function borrarAnticipo()
  {
    cargando.value            = true
    const { data, ok  }       = await miFetch( endPoint, { body: getFormData( "borrarAnticipo", { id: modelo.value.id } ), method: "POST" }, { mensaje: "borrar anticipo" } )

    if(ok){
      aviso( "positive", "Anticipo borrado exitosamente",)
      emit("borrado", modelo.value)

    }
    else
      aviso( "negative", "Error al borrado el anticipo", "account" )

    cargando.value            = false
  }
</script>