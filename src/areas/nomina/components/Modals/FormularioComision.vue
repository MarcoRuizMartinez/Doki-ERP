<template>
  <ventana                      cerrar
    class-contenido             ="column items-center"
    :titulo                     ="modelo.razonLabel"
    icono                       ="mdi-cash"
    width                       ="360px"
    :cargando                   ="cargando"
    >
    <template                   #barra>
      <q-btn
        v-if                    ="!readonly"
        v-bind                  ="style.btnBaseMd"
        color                   ="positive"
        label                   ="Guardar"
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
      <!-- //* ///////////////////////////////////////////////////////////// Estado  -->
      <div class                ="col-12">
        <q-btn-toggle           push unelevated spread glossy dense
          v-model               ="modelo.estado"          
          :options              ="Incentivo.estados"
          :readonly             ="readonly"
        />
      </div>
      <!-- //* ///////////////////////////////////////////////////////////// Valor -->
      <input-number             no-undefined solo-positivo 
        v-model                 ="modelo.valor"
        label                   ="Valor"
        tipo                    ="precio"
        class                   ="col-12"
        icon                    ="mdi-cash-usd"
        debounce                ="2500"
        :rules                  ="[ reglaValor ]" 
        :maximo                 ="acuerdo.comision.comercial_1"
        :minimo                 ="0"
        :readonly               ="readonly"
        @update:model-value     ="revisarValor"
      />
      <!-- //* /////////////////////////////////////////////////////////////  Nota  -->
      <q-input                  filled dense
        v-model                 ="modelo.nota"
        label                   ="Nota"
        type                    ="textarea"
        class                   ="col-12"
        debounce                ="400"
        :readonly               ="readonly"
        :rules                  ="[ reglaNota ]" 
        > 
        <template #prepend >
          <q-icon name          ="mdi-comment-quote" />
        </template>
      </q-input>
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
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreUser        } from 'src/stores/user'

  // * ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IIncentivo,
            Incentivo,
            INCENTIVO_ESTADO      } from "src/areas/nomina/models/Incentivo"
  import {  IAcuerdo              } from "src/areas/acuerdos/models/Acuerdo";

  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  style                 } from "src/useSimpleOk/useEstilos"
  import {  useControlIncentivos  } from "src/areas/nomina/controllers/ControlIncentivos"
  
  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    inputNumber             from "components/utilidades/input/InputFormNumber.vue"

  const { usuario           } = storeToRefs( useStoreUser() )
  const { nuevoIncentivo    } = useControlIncentivos()

  const props                 = defineProps({
    acuerdo:    { required: true, type: Object as PropType< IAcuerdo >    },
    incentivo:  { required: true, type: Object as PropType< IIncentivo >  },
  })

  const { acuerdo, incentivo }= toRefs( props ) 
  const cargando              = ref< boolean    >( false )
  const formulario            = ref< any >()
  const modelo                = ref< IIncentivo >( new Incentivo() )
  const readonly              = computed(()=> !!modelo.value.id )
  //let   copiaAnticipo         = ""  
  
  const emit                  = defineEmits<{
    //(e: "update:modelValue",  value: IAnticipo ): void
    (e: "creado",   value: IIncentivo ): void
    //(e: "borrado",            value: IAnticipo ): void
    //(e: "cerrar" ): void
  }>()

  //const modificado            = computed( ()=>  copiaAnticipo !== JSON.stringify( modelo.value ) ) 
  const btnDisable            = computed( ()=> !modelo.value.estado )
  
  watch(()=>acuerdo.value.comision.comercial_1, (valor) =>
    {
      modelo.value.valor      = valor
    },
    { immediate: true }
  )

  watch(incentivo, (incen)=>{
      if(!!incen.id)
        modelo.value  = Object.assign( new Incentivo(), incen ) 
    }
    , { immediate: true }
  )

/*   
  watch(modelValue, (newAnticipo) =>
    {
      modelo.value            = Object.assign( new Anticipo(), newAnticipo )
      if(!!newAnticipo.id)
      {
        copiaAnticipo         = JSON.stringify( modelo.value )
      }
    },
    { immediate: true }
  ) */

  //* ////////////////////////////////////////////////////////////////////////////////////// Validar
  async function validar() {
    const  validacionOk        = await formulario.value.validate()
    if(validacionOk)          onSubmit()  
  }

  //* ////////////////////////////////////////////////////////////////////////////////////// Submit
  async function onSubmit()
  {
    cargando.value            = true
    const objeto              = modelo.value.getIncentivoToApi( usuario.value.id, acuerdo.value )
    const id                  = await nuevoIncentivo( objeto )
    if(!!id){
      modelo.value.id         = +id
      emit("creado", modelo.value )
    }
    cargando.value            = false
  }

  function reglaValor() : boolean | string {    
    const valorOk             = modelo.value.valor > 0 
    return ( valorOk )  || "El valor no puede ser menor o igual a cero  "
  }

  function reglaNota() : boolean | string {
    const notaOk              = modelo.value.nota.length >= 7
    return (notaOk || modelo.value.estado === INCENTIVO_ESTADO.APROBADO )  || "Se debe indicar una razón para la anulación"
  }

  function revisarValor()
  {
    if( modelo.value.valor < 0 )
        modelo.value.valor = 0
    if( modelo.value.valor > acuerdo.value.comision.comercial_1)
        modelo.value.valor = acuerdo.value.comision.comercial_1
  }
</script>