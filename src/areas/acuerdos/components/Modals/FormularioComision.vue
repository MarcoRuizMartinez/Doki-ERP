<template>
  <ventana                      cerrar
    class-contenido             ="column items-center"
    titulo                      ="Revisar comisión"
    icono                       ="mdi-cash"
    width                       ="360px"
    :cargando                   ="cargando"
    >
    <template                   #barra>
      <q-btn
        v-bind                  ="style.btnBaseSm"
        color                   ="positive"
        label                   ="Guardar"
        :disable                ="btnDisable"
        >
        <confirmar  @ok         ="validar"/>
      </q-btn>
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
        @update:model-value     ="revisarValor"
      />
      <!-- //* /////////////////////////////////////////////////////////////  Nota  -->
      <q-input                  filled dense
        v-model                 ="modelo.nota"
        label                   ="Nota"
        type                    ="textarea"
        class                   ="col-12"
        debounce                ="400"
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
            INCENTIVO_ESTADO,
            INCENTIVO_ORIGEN,
            INCENTIVO_RAZON,
                                  } from "src/areas/usuarios/models/Incentivo"
  import {  IAcuerdo              } from "../../models/Acuerdo";

  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useTools              } from "src/useSimpleOk/useTools"  
  import {  useFetch              } from "src/useSimpleOk/useFetch"
  import {  style                 } from "src/useSimpleOk/useEstilos"
  import {  getURL, getFormData   } from "src/services/APIMaco"
  
  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    inputNumber             from "components/utilidades/input/InputFormNumber.vue"
  import    confirmar               from "components/utilidades/MenuConfirmar.vue"

  const { aviso             } = useTools()
  const { miFetch           } = useFetch()
  const { usuario           } = storeToRefs( useStoreUser() )

  const cargando              = ref< boolean    >( false )
  const formulario            = ref< any >()
  const endPoint              = getURL("servicios", "rrhh")
  const modelo                = ref< IIncentivo >( new Incentivo() )
  //let   copiaAnticipo         = ""


  const props                 = defineProps({
    acuerdo:  { required: true, type: Object as PropType< IAcuerdo >  },
  })

  const { acuerdo }           = toRefs( props ) 
  const cosa = new Incentivo()
/*   
  const emit                  = defineEmits<{
    (e: "update:modelValue",  value: IAnticipo ): void
    (e: "creado",             value: IAnticipo ): void
    (e: "borrado",            value: IAnticipo ): void
  }>()
 */
  //const modificado            = computed( ()=>  copiaAnticipo !== JSON.stringify( modelo.value ) ) 
  const btnDisable            = computed( ()=> !modelo.value.estado )

  
  watch(()=>acuerdo.value.comision.comercial_1, (valor) =>
    {
      modelo.value.valor      = valor
    },
    { immediate: true }
  )

  const objetoToFetch         = computed( ()=>
    { 
      const objeto            = {
        owner               : usuario.value.id,
        modified_by         : usuario.value.id,
        origen_id           : acuerdo.value.id,
        origen_ref          : acuerdo.value.ref,
        valor               : modelo.value.valor,
        pagado              : 0,
        usuario_id          : acuerdo.value.comercial.id,
        estado              : modelo.value.estado,
        razon               : INCENTIVO_RAZON.COMISION,
        origen_tipo         : INCENTIVO_ORIGEN.PEDIDO_CLI,
        nota                : modelo.value.nota,
      }
      
      return {
        body:   getFormData( "nuevoIncentivo", objeto ),
        method: "POST"
      }
    }
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
    
    const { data, ok  }       = await miFetch( endPoint, objetoToFetch.value, { mensaje: "guardar comisión" } )
    if(ok)
    {
      aviso( "positive", "Comisión guardada" )

      if(modelo.value.esNuevo){
        modelo.value.id     = parseInt( data as string )
        //emit("creado", modelo.value)
      }
      else{
        //emit("update:modelValue", modelo.value)
      }
    }
    else
      aviso( "negative", "Error al guardar comisión. Por favor vuelve a intentarlo" )
 
    cargando.value            = false
  }

/*   async function borrarAnticipo()
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
  } */


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