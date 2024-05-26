<template>
  <ventana                      cerrar
    class-contenido             ="column items-center"
    titulo                      ="Anticipo o Autorización"
    icono                       ="mdi-cash"
    :cargando                   ="cargando"
    >
    <template                   #barra>
      <efecto efecto            ="Down">
        <q-btn
          v-if                  ="!modelo.esNuevo"
          v-bind                ="style.btnBaseSm"
          color                 ="grey-10"
          icon                  ="mdi-close"
          label                 ="Borrar"
          >
          <confirmar  @ok       ="borrarAnticipo"/>
        </q-btn>
      </efecto>       
      <q-btn
        v-bind                  ="style.btnBaseSm"
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
      <select-label-value
        v-model                 ="modelo.cuenta"
        label                   ="Cuenta"
        icon                    ="mdi-wallet"
        class                   ="col-12"
        :rules                  ="[ reglaCuenta ]"
        :options                ="cuentasDinero"
        :loading                ="!cuentasDinero.length"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Valor -->
      <input-number             no-undefined alerta solo-positivo 
        v-model                 ="modelo.valor"
        label                   ="Valor"
        tipo                    ="precio"
        class                   ="col-md-5 col-11"
        icon                    ="mdi-cash-usd"
        debounce                ="2500"
        :rules                  ="[ reglaValor ]"
        :minimo                 ="0"
      />
      <div class                ="col-1">
        <q-btn
          v-bind                ="style.btnRedondoFlatMd"
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
        :rules                  ="[ reglaNota ]"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Comprobante interno -->
      <select-label-value       clearable no-loading
        v-model                 ="modelo.fileInterno"
        :label                  ="'Comprobante ' + (esAutorizacion ? 'autorización' : 'pago')"
        icon                    ="mdi-bank"
        class                   ="col-12"
        :alerta                 ="modelo.estadoSelect.label === ESTADO_ANTICIPO_LABEL.VERIFICADO"
        :options                ="acuerdo.archivos"
        @update:model-value     ="modelo.estadoSelect = {label: ESTADO_ANTICIPO_LABEL.VERIFICADO, value: ESTADO_ANTICIPO.VERIFICADO } "
      />
      <!-- //* ///////////////////////////////////////////////////////////// Comprobante Cliente -->
      <select-label-value       clearable no-loading
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
            onMounted,
                                } from "vue"
  // * ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAnticipo, Anticipo,
            TIPO_ANTICIPO,
            TIPO_ANTICIPO_LABEL,
            ESTADO_ANTICIPO_LABEL,
            ESTADO_ANTICIPO
                                } from "src/areas/acuerdos/models/Anticipo"
  //* /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                            
  import {  useStoreAcuerdo     } from 'stores/acuerdo'
  import {  useStoreDexie       } from 'stores/dexieStore'
  
  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useTools, ToolType  } from "src/composables/useTools"
  import {  useFetch            } from "src/composables/useFetch"
  import {  style               } from "src/composables/useEstilos"
  import {  dexieCuentasDinero  } from "src/composables/useDexie"  
  import {  getURL, getFormData } from "src/composables/APIMaco"

  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"
  import    inputText             from "components/utilidades/input/InputFormText.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    inputFecha            from "components/utilidades/input/InputFecha.vue"
  import    efecto                from "components/utilidades/Efecto.vue"
  import    confirmar             from "components/utilidades/MenuConfirmar.vue"

  const { acuerdo           } = storeToRefs( useStoreAcuerdo() )
  const { aviso             } = useTools()
  const { miFetch           } = useFetch()
  dexieCuentasDinero()
  const { cuentasDinero     } = storeToRefs( useStoreDexie() )
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
  const esAutorizacion        = computed( ()=> modelo.value.tipoSelect.value === TIPO_ANTICIPO.AUTORIZACION  )
  const objetoToFetch         = computed( ()=>
    { 
      modelo.value.index      =   modelo.value.esNuevo
                                ? acuerdo.value.anticipos.length + 1
                                : acuerdo.value.anticipos.findIndex( a => a.id == modelo.value.id ) + 1
      console.log("modelo.value.index: objetoToFetch ", modelo.value.index);
      console.log("modelo.value.anticipoToApi: ", modelo.value.anticipoToApi);
      return {
        body:   getFormData( modelo.value.esNuevo ? "nuevoAnticipo" : "editarAnticipo", modelo.value.anticipoToApi ),
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
    console.log("objetoToFetch.value: ", objetoToFetch.value);
    const id                  = ToolType.anyToNum(data)
    if(ok && modelo.value.esNuevo && id > 3500)
    {
      aviso( "positive", "Anticipo creado exitosamente con ID: " + id, "file", 6000 )
      modelo.value.id       = id
      emit("creado", modelo.value)
    }
    else if(ok && !modelo.value.esNuevo){
      aviso( "positive", "Anticipo guardado")
      emit( "update:modelValue", modelo.value )
    }
    else {
      // Por favor vuelve a intentarlo
      aviso( "negative", "Error al guardar anticipo. INFORMAR A MARCO. ID: " + id, "file", 20000 )
    }

    modelo.value.estado       = modelo.value.estadoSelect.value
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

  function reglaCuenta() : boolean | string {
    const cuentaSeleccionada  = !!modelo.value.cuenta.value
    
    return (cuentaSeleccionada || esAutorizacion.value )  || "Se debe seleccionar una cuenta"
  }  

  function reglaValor() : boolean | string {
    const valorOk             = modelo.value.valor >  0    
    return (valorOk || esAutorizacion.value )  || "Se debe indicar un valor valido"
  }

  function reglaNota() : boolean | string {
    const notaOk              = modelo.value.nota.length >= 7
    return (notaOk || !esAutorizacion.value )  || "Se debe indicar una razón para la autorización"
  }
</script>