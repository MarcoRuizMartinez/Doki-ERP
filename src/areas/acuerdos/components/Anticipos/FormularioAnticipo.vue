<template>
  <ventana                      cerrar
    class-contenido             ="column items-center"
    titulo                      ="Anticipo"
    icono                       ="mdi-cash"
    :cargando                   ="cargando"
    width                       ="520px"
    >
    <template                   #barra>
      <q-btn
        v-bind                  ="btnBaseSm"
        color                   ="positive"
        icon                    ="mdi-cash-plus"
        :label                  ="esNuevo ? 'Crear' : 'Guardar'"
        :disable                ="btnDisable"
        @click                  ="validar"
      />
      <efecto efecto            ="Down">
        <q-btn
          v-if                  ="!esNuevo"
          v-bind                ="btnBaseSm"
          color                 ="grey-10"
          icon                  ="mdi-close"
          label                 ="Borrar"
          >
          <confirmar  @ok       ="borrarAnticipo"/>
        </q-btn>
      </efecto>         
    </template>
    <!-- //* ///////////////////////////////////////////////////////////////   FORMULARIO  -->
    <q-form
      ref                       ="formulario"
      @submit                   ="onSubmit"
      class                     ="row q-col-gutter-md"
      >
      <!-- //* ///////////////////////////////////////////////////////////// Cuenta -->
      <select-label-value       alerta
        v-model                 ="anticipo.cuenta"
        label                   ="Cuenta"
        icon                    ="mdi-wallet"
        class                   ="col-12"
        :options                ="cuentas"
        :loading                ="!cuentas.length || cargando"
      />

      <!-- //* ///////////////////////////////////////////////////////////// Valor -->
      <input-number             no-undefined alerta solo-positivo no-cero
        v-model                 ="anticipo.valor"
        label                   ="Valor"
        tipo                    ="precio"
        class                   ="col-6"
        icon                    ="mdi-cash-usd"
        debounce                ="2500"
        :rules                  ="[]"
        :minimo                 ="0"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Fecha pago -->
      <input-fecha              no-futuro clearable alerta
        v-model                 ="anticipo.fechaPago"
        label                   ="Fecha"
        class                   ="col-6"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Estado -->
      <select-label-value       alerta
        v-model                 ="anticipo.estadoSelect"
        label                   ="Estado"
        icon                    ="mdi-cash-check"
        class                   ="col-6"
        :defecto                ="ESTADO_ANTICIPO_LABEL.PENDIENTE"
        :options                ="Anticipo.estados"
      />    
      <!-- //* ///////////////////////////////////////////////////////////// Tipo -->
      <select-label-value       alerta
        v-model                 ="anticipo.tipoSelect"
        label                   ="Tipo"
        icon                    ="mdi-cash-refund"
        class                   ="col-6"
        :defecto                ="TIPO_ANTICIPO_LABEL.PAGO"
        :options                ="Anticipo.tipos"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Nota -->
      <input-text               
        v-model                 ="anticipo.nota"
        label                   ="Nota"
        icon                    ="mdi-comment-quote"
        class                   ="col-12"
        :readonly               ="cargando"
      />
<!--       <q-editor        
        v-bind                  ="WYSIWYG_Imagen"
        v-model                 ="anticipo.nota"
        class                   ="col-6"
        :disable                ="false"
      /> -->

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
            computed,
            PropType,
            watch
                                } from "vue"
  // * ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAnticipo, Anticipo,
            TIPO_ANTICIPO_LABEL,
            ESTADO_ANTICIPO_LABEL
                                } from "src/areas/acuerdos/models/Anticipo"
  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useApiDolibarr      } from "src/services/useApiDolibarr"
  import {  useTools            } from "src/useSimpleOk/useTools"  
  import {  useFetch            } from "src/useSimpleOk/useFetch"
  import {  btnBaseSm           } from "src/useSimpleOk/useEstilos"
  import {  dexieCuentasDinero  } from "src/services/useDexie"  
  import {  getURL, getFormData } from "src/services/APIMaco"  
  import {  WYSIWYG_Imagen      } from "src/useSimpleOk/useEstilos"
  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"
  import    inputText             from "src/components/utilidades/input/InputFormText.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    inputFecha            from "src/components/utilidades/input/InputFecha.vue"
  import    efecto                from "components/utilidades/Efecto.vue"
  import    confirmar             from "components/utilidades/MenuConfirmar.vue"

  const { aviso             } = useTools()
  const { miFetch           } = useFetch()
  const cuentas               = dexieCuentasDinero()
  const anticipo              = ref<IAnticipo>(new Anticipo())
  const cargando              = ref< boolean >(false)
  const formulario            = ref< any >()
  const endPoint              = getURL("servicios", "pagos")
  let   copiaAnticipo         = ""

  //* ////////////////////////////////////////////////////////////////////////////////////// Props
  const props                 = defineProps(
  {
    modelValue:   { default:  new Anticipo(),   type: Object as PropType< IAnticipo >   },
    //puedeEditar:  { default:  false,            type: Boolean                           },
  })
  
  const emit                  = defineEmits<{
    (e: "update:modelValue",  value: IAnticipo ): void
    (e: "creado",             value: IAnticipo ): void
    (e: "borrado",            value: IAnticipo ): void
  }>()


  const { modelValue        } = toRefs( props )
  const esNuevo               = computed( ()=> !modelValue.value.id )
  const modificado            = computed( ()=>  copiaAnticipo !== JSON.stringify( anticipo.value ) ) 
  const btnDisable            = computed( ()=> !esNuevo.value && !modificado.value)
  const objetoToFetch         = computed( ()=> { return {
                                                    body: getFormData( esNuevo.value ? "nuevoAnticipo" : "editarAnticipo", anticipo.value.anticipoToApi ),
                                                    method: "POST"
                                                  }
                                                }
                                        )

  
  watch(modelValue, (newAnticipo) =>
    {
      anticipo.value              = Object.assign( new Anticipo(), newAnticipo)

      if(!!newAnticipo.id)
      {
        copiaAnticipo             = JSON.stringify( anticipo.value )
        cargando.value            = false
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
    console.log("data", data);

    if(ok)
    {
      aviso( "positive", "Anticipo guardaro exitosamente" )

      if(esNuevo.value){
        anticipo.value.id     = parseInt( data as string )
        emit("creado", anticipo.value)
      }
      else{
        emit("update:modelValue", anticipo.value)
      }
    }
    else
      aviso( "negative", "Error al guardar anticipo. Por favor vuelve a intentarlo" )

    cargando.value            = false
  }

  async function borrarAnticipo()
  {
    cargando.value            = true
    const { data, ok  }       = await miFetch( endPoint, { body: getFormData( "borrarAnticipo", { id: anticipo.value.id } ), method: "POST" }, { mensaje: "borrar anticipo" } )

    if(ok){
      aviso( "positive", "Anticipo borrado exitosamente",)
      emit("borrado", anticipo.value)

    }
    else
      aviso( "negative", "Error al borrado el anticipo", "account" )

    cargando.value            = false
  }
</script>