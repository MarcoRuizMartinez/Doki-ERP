<template>
  <ventana                      cerrar
    class-contenido             ="column items-center"
    titulo                      ="Anticipo"
    icono                       ="mdi-cash"
    :cargando                   ="cargando"
    width                       ="520px"
    >
    <template                   #barra>
<!--       <transition               enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown" mode="out-in">
        <q-btn                  dark push dense glossy
          v-if                  ="!readonly"
          class                 ="desktop-only"
          color                 ="positive"  
          icon                  ="mdi-account-check"
          size                  ="md"
          padding               ="2px 8px"
          :label                ="tipo == 'ver' ? 'Guardar' : 'Crear'"
          :disable              ="btnDisable"
          @click                ="validar"
        />    
      </transition> -->
<!--       <q-btn                    flat round dense
        v-if                    ="readonly"
        color                   ="white"
        icon                    ="mdi-open-in-new"
        type                    ="a"
        class                   ="op40 op100-hover q-ml-xs"
        target                  ="_blank"
        :href                   ="urlDolibarr + '/contact/card.php?id=' + contacto.id"
        >
        <Tooltip label          ="Ir a Dolibarr"/>        
      </q-btn>          --> 
    </template>
    <!-- //* ////////////////   FORMULARIO  -->
    <q-form
      ref                       ="formulario"
      @submit                   ="onSubmit"
      class                     ="row q-col-gutter-md"
      >
      <!-- //* ///////////////////////////////////////////////// Cuenta -->
      <select-label-value       clearable alerta
        v-model                 ="anticipo.cuenta"
        label                   ="Cuenta"
        icon                    ="mdi-wallet"
        class                   ="col-12"
        :options                ="cuentas"
        :loading                ="!cuentas.length || cargando"
      />

      <!-- //* ///////////////////////////////////////////////////////////// Valor -->
      <input-number             no-undefined mdi-cash-usd alerta
        v-model                 ="anticipo.valor"
        label                   ="Valor"
        tipo                    ="precio"
        class                   ="col-6"
        colores                 ="verde-rojo"
        icon                    ="mdi-cash-usd"
        iconos                  ="suma"
        debounce                ="2500"
        :minimo                 ="0"
        :con-decimales          ="false"
        :paso                   ="1000"
        
      />
      <!-- //* ///////////////////////////////////////////////// Fecha desde -->
      <input-fecha              no-futuro clearable
        v-model                 ="anticipo.fechaPago"
        label                   ="Fecha"
        class                   ="col-6"
      />

      <select-label-value       clearable alerta
        v-model                 ="anticipo.tipoSelect"
        label                   ="Tipo"
        icon                    ="mdi-arrow-left-right-bold"
        class                   ="col-6"
        :options="[
          {label: 'Pago',       value: 1},
          {label: 'Devolución', value: 2},
        ]"
      />
      <select-label-value       clearable alerta
        v-model                 ="anticipo.estadoSelect"
        label                   ="Estado"
        icon                    ="mdi-cash-check"
        class                   ="col-6"
        :options="[
          {label: 'Pendiente',  value: 1},
          {label: 'Verificado', value: 2},
          {label: 'Anulado',    value: 0},
        ]"
      />

      <!-- <q-editor
        v-model               ="linea.descripcion"
        v-bind                ="WYSIWYG_Limpio"
        :readonly             ="acuerdo.esEstadoValidado"
        :definitions          ="{
          save: {
            tip:              'Guardar descripción',
            icon:             'mdi-content-save',
            label:            'Guardar',
            handler:          guardarDescripcion
          }
        }"
        @update:model-value   ="limpiarDescripcion"        
      />
 -->
      <!-- //* //////////////   Nombres -->
<!--  
  :readonly               ="acuerdo.esEstadoValidado"
@select                 ="editarMetodoEntrega"         
      <input-text               AZ
        label                   ="Nombres"
        v-model                 ="contacto.nombres"
        class                   ="col-md-6 col-12"
        icon                    ="mdi-account"
        :readonly               ="readonly"
        @update:model-value     ="(txt : string )=> contacto.nombres = mayusculasPrimeraLetraAll(txt)"
      /> -->
      <!-- //* //////////////   Apellidos  -->
<!--       <input-text               AZ alerta
        label                   ="Apellidos"
        v-model                 ="contacto.apellidos"
        class                   ="col-md-6 col-12"
        icon                    ="mdi-account"
        :readonly               ="readonly"
        @update:model-value     ="( txt : string )=> contacto.apellidos = mayusculasPrimeraLetraAll(txt)"
      /> -->
      <!-- //* //////////////   Empresa -->
<!--       <input-text               AZ
        v-if                    ="esTerceroCtz"
        label                   ="Empresa"
        v-model                 ="contacto.empresa"
        class                   ="col-12"
        icon                    ="mdi-office-building"
        :rules                  ="[ validarExisteEmpresa ]"
        :estadoCheck            ="estaCheckEmpresa"
        :readonly               ="readonly"
        @alert                  ="mostrarClientesExistentes"
        @blur                   ="vericarExisteEmpresa"
      /> -->
      <!-- //* //////////////   Cargo  -->
<!--       <input-text               AZ 
        label                   ="Cargo"
        v-model                 ="contacto.cargo"
        class                   ="col-md-4 col-12"
        icon                    ="mdi-account-cowboy-hat"
        :alerta                 ="!esTerceroCtz"
        :readonly               ="readonly"
      />   -->             
      <!-- //* //////////////   Correo  -->
<!--       <input-text               sin-espacios copy
        v-model                 ="contacto.correo"
        label                   ="Correo"
        type                    ="email"
        icon                    ="mdi-at"
        class                   ="col-md-8 col-12"
        :rules                  ="[ validarExisteEmail ]"
        :estadoCheck            ="estaCheckEmail"
        :readonly               ="readonly"
        @alert                  ="mostrarClientesExistentes"
        @blur                   ="vericarExisteCorreo"
      /> -->
      <!-- //* //////////////   Telefono 1  -->
<!--       <input-text               copy
        v-model                 ="contacto.telefono"
        label                   ="Celular"
        type                    ="tel"
        class                   ="col-md-4 col-12"
        :rules                  ="[ validarExisteCel ]"
        :estadoCheck            ="estaCheckCel"
        :readonly               ="readonly"
        @alert                  ="mostrarClientesExistentes"
        @blur                   ="vericarExisteCel"        
      />    -->   
      <!-- //* //////////////   Telefono 2  -->
<!--       <input-text               copy
        v-model                 ="contacto.telefono_2"
        label                   ="Teléfono"
        type                    ="tel"
        class                   ="col-md-4 col-7"
        :rules                  ="[ validarExisteTel ]"
        :estadoCheck            ="estaCheckTel"
        :readonly               ="readonly"
        @alert                  ="mostrarClientesExistentes"
        @blur                   ="vericarExisteTel"                
      /> -->
      <!-- //* //////////////   Extensión  -->
<!--       <input-text
        v-model                 ="contacto.extension"
        label                   ="Extensión"
        class                   ="col-md-4 col-5"
        :readonly               ="readonly"
      /> -->
      <!-- //* //////////////   Notas  -->
<!--       <q-input                  filled autogrow 
        v-model                 ="contacto.nota"
        placeholder             ="Notas sobre el contactco..."
        class                   ="col-12"
        type                    ="textarea"
        :readonly               ="readonly"
      /> -->
      <!-- //* //////////////   Activo  -->
<!--       <q-toggle 
        v-model                 ="contacto.activo"
        label                   ="Activo"
        class                   ="col-auto"
        :disable                ="readonly"
      /> -->
      <q-space/>
      <div
        v-if                    ="tipo == 'ver'"
        class                   ="col-auto"
        >
        <!-- //* /////////////  Borrar  -->
<!--         <q-btn                  flat
          v-if                  ="readonly && permisos.contactos_borrar && borrable"
          label                 ="Borrar"
          color                 ="negative"
          @click                ="confirmarBorrar"
        /> -->
        <!-- //* /////////////  Editar  -->
<!--         <q-btn                  flat
          v-if                  ="readonly && permisos.contactos_crear"
          label                 ="Editar"
          @click                ="readonly = false"
        /> -->
        <!-- //* /////////////  Cancelar  -->
<!--         <q-btn                  flat
          v-else-if             ="permisos.contactos_crear"
          label                 ="Cancelar"
          @click                ="readonly = true"
        /> -->
      </div>      
      <!-- //* //////////////   Botones Sumit  -->
      <transition               enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown">
        <div
          class                 ="col-12 column mobile-only"
          v-show                ="!readonly"
          >
          <!-- //* ///////////  Guardar Crear  -->
<!--           <q-btn                dark push
            type                ="submit"
            color               ="positive"
            icon                ="mdi-account-check"  
            :label              ="tipo == 'ver' ? 'Guardar' : 'Crear'" 
          /> -->
        </div>
      </transition>
      <!-- //* ///////////////  Boton sumit -->
<!--       <q-btn
        v-show                  ="false"
        type                    ="submit"
      /> -->
    </q-form>
  </ventana>
</template>
<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            Ref,
            toRefs,
            computed,
            PropType,
            watch
                                } from "vue"
  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from "pinia"
  import {  useStoreUser        } from "src/stores/user"
  // * ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAnticipo,
            Anticipo            } from "src/areas/acuerdos/models/Anticipo"
  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useApiDolibarr      } from "src/services/useApiDolibarr"
  import {  useTools            } from "src/useSimpleOk/useTools"  
  import {  useFetch            } from "src/useSimpleOk/useFetch"
  import {  btnBaseSm           } from "src/useSimpleOk/useEstilos"
  import {  dexieCuentasDinero  } from "src/services/useDexie"  
  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"
  import    inputText             from "src/components/utilidades/input/InputFormText.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    inputFecha            from "src/components/utilidades/input/InputFecha.vue"

  const { apiDolibarr       } = useApiDolibarr()
  const { aviso             } = useTools()
  const { miFetch           } = useFetch()
  const cuentas               = dexieCuentasDinero()
  const anticipo              = ref<IAnticipo>(new Anticipo())
  const cargando              = ref< boolean >(false)
  const ventanaClienteExiste  = ref< boolean >(false)
  const formulario            = ref< any >()
  const clientesExistentes    = ref< any[] >()
  const urlDolibarr           = process.env.URL_DOLIBARR
  const consentimientoAsesor  = ref< boolean >(false)
  let   copiaContacto         = ""

  //* ////////////////////////////////////////////////////////////////////////////////////// Props
  const props                 = defineProps(
  {
    modelValue:   { default:  new Anticipo(),   type: Object as PropType< IAnticipo >   },
    puedeEditar:  { default:  false,            type: Boolean                           },
    editando:     { default:  false,            type: Boolean                           },
  })
  const emit                  = defineEmits(["update:modelValue", "crear", "borrar"])

  const { modelValue,
          editando,         } = toRefs( props )
  const tipo                  = ref< "crear" | "ver" > ("ver")
  const readonly              = ref< boolean >( tipo.value == "ver" && !editando.value ? true : false )  
  const esTerceroInternoDeCoti= computed(()=> clientesExistentes.value.length === 1 /* && clientesExistentes.value[0].nombre.indexOf('COTIZACIONES ', 0) != -1 */)
  const btnDisable            = computed(()=>{
    return  false /* (
              tipo.value      == 'ver'
              &&
              !readonly.value
              &&
              !modificado.value
            )
            ||
            (
              tipo.value      == 'crear'
              &&
              !anticipo.value.telefono
              &&
              !contacto.value.correo
            ) */
  })
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* /////////////////////////////////////////////////////////////////////////////////// FUNCIONES DEL FORMULARIO
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //* ////////////////////////////////////////////////////////////////////////////////////// Validar
  async function validar()
  {
    const  validacionOk        = await formulario.value.validate()
    if(validacionOk)          onSubmit()  
  }

  //* ////////////////////////////////////////////////////////////////////////////////////// Submit
  function onSubmit()
  {
    if(tipo.value             == "ver")
      modificarContacto()
    else
      crearContacto()
  }

  //* ////////////////////////////////////////////////////////////////////////////////////// Crear Contacto
  async function crearContacto()
  {
    cargando.value            = true
  
    let { ok, data }          = await apiDolibarr( "crear", "contacto", {}/* anticipo.value.getContactoToAPIDolibarr() */ )

    if(ok)
    {
      aviso( "positive", "Contacto creado exitosamente", "account" )
      let id                  = data as string
      anticipo.value.id       = parseInt( id )
      emit("crear", anticipo.value)      
    }
    else
    {
      aviso( "negative", "Error al crear el contacto. Por favor vuelve a intentarlo", "account" )
    }

    cargando.value            = false
  }
  //* ////////////////////////////////////////////////////////////////////////////////////// Modificar Contacto 
  async function modificarContacto()
  {
   /*  cargando.value            = true
    let { ok, data }          = await apiDolibarr( "editar", "contacto", contacto.value.getContactoToAPIDolibarr(), contacto.value.id )

    if(ok)
    {
      emit("update:modelValue", contacto.value)
      aviso( "positive", "Contacto modificado exitosamente", "account" )
    }
    else
      aviso( "negative", "Error al modificar el contacto", "account" )

    cargando.value            = false */
  }


  async function borrarContacto()
  {
    cargando.value            = true
    let { ok }                = await apiDolibarr( "borrar", "contacto", 0 /* contacto.value.id */ )

    if(ok)
    {
      aviso( "positive", "Contacto borrado exitosamente", "account" )
      //emit("borrar", contacto.value.id)
    }
    else
      aviso( "negative", "Error al borrado el contacto", "account" )

    cargando.value            = false
  }

  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* /////////////////////////////////////////////////////////////////////////////////// FUNCTION DE CARGAR DE TERCERO
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  watch(modelValue, (newContacto) =>
    {
/* 
      extend(true, contacto.value, newContacto )

      if(!!newContacto.id)
      {
        copiaContacto             = JSON.stringify( newContacto )
        cargando.value            = false
        readonly.value            = !editando.value
        tipo.value                = "ver"
      }
      else
      {
        tipo.value                = "crear"
        readonly.value            = false
        contacto.value.municipio  = (!esTerceroCtz.value && !!municipio.value.id) ? municipio.value : new Municipio()
      }
       */
    },
    { immediate: true }
  ) 



  
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* /////////////////////////////////////////////////////////////////////////////////////////////////// FUNCTION VARIAS
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const modificado            = computed(()=>  copiaContacto !== JSON.stringify( anticipo.value ) ) 
</script>