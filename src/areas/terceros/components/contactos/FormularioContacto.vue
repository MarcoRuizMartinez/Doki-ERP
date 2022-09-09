<template>
  <ventana                      cerrar
    class-contenido             ="column items-center"
    icono                       ="mdi-account-box"
    :titulo                     ="titulo"
    :cargando                   ="cargando"
    >
    <template                   #barra>
      <transition               enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown" mode="out-in">
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
      </transition>
      <q-btn                    flat round dense
        v-if                    ="readonly"
        color                   ="white"
        icon                    ="mdi-open-in-new"
        type                    ="a"
        class                   ="op40 op100-hover q-ml-xs"
        target                  ="_blank"
        :href                   ="urlDolibarr + '/contact/card.php?id=' + contacto.id"
        >
        <Tooltip label          ="Ir a Dolibarr"/>        
      </q-btn>          
    </template>
    <!-- //* ////////////////   FORMULARIO  -->
    <q-form
      ref                       ="formulario"
      @submit                   ="onSubmit"
      class                     ="row q-col-gutter-md fit"
      >
      <!-- //* //////////////   Nombres -->
      <input-text               AZ
        label                   ="Nombres"
        v-model                 ="contacto.nombres"
        class                   ="col-md-6 col-12"
        icon                    ="mdi-account"
        :readonly               ="readonly"
        @update:model-value     ="(txt)=> contacto.nombres = mayusculasPrimeraLetraAll(txt)"
      />
      <!-- //* //////////////   Apellidos  -->
      <input-text               AZ alerta
        label                   ="Apellidos"
        v-model                 ="contacto.apellidos"
        class                   ="col-md-6 col-12"
        icon                    ="mdi-account"
        :readonly               ="readonly"
        @update:model-value     ="(txt)=> contacto.apellidos = mayusculasPrimeraLetraAll(txt)"
      />
      <!-- //* //////////////   Empresa -->
      <input-text               AZ
        v-if                    ="esTerceroCtz"
        label                   ="Empresa"
        v-model                 ="contacto.empresa"
        class                   ="col-12"
        icon                    ="mdi-office-building"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Cargo  -->
      <input-text               AZ 
        label                   ="Cargo"
        v-model                 ="contacto.cargo"
        class                   ="col-md-4 col-12"
        icon                    ="mdi-account-cowboy-hat"
        :alerta                 ="!esTerceroCtz"
        :readonly               ="readonly"
      />               
      <!-- //* //////////////   Correo  -->
      <input-text               sin-espacios copy
        v-model                 ="contacto.correo"
        label                   ="Correo"
        type                    ="email"
        icon                    ="mdi-at"
        class                   ="col-md-8 col-12"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Telefono 1  -->
      <input-text               copy
        v-model                 ="contacto.telefono"
        label                   ="Celular"
        type                    ="tel"
        class                   ="col-md-4 col-12"
        :readonly               ="readonly"
      />      
      <!-- //* //////////////   Telefono 2  -->
      <input-text               copy
        v-model                 ="contacto.telefono_2"
        label                   ="Teléfono"
        type                    ="tel"
        class                   ="col-md-4 col-7"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Extensión  -->
      <input-text
        v-model                 ="contacto.extension"
        label                   ="Extensión"
        class                   ="col-md-4 col-5"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Municipio o Ciudad  -->
      <municipios
        v-model                 ="contacto.municipio"
        class                   ="col-12"
        :readonly               ="readonly"
      />      
      <!-- //* //////////////   Notas  -->
      <q-input                  filled autogrow 
        v-model                 ="contacto.nota"
        placeholder             ="Notas sobre el contactco..."
        class                   ="col-12"
        type                    ="textarea"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Activo  -->
      <q-toggle 
        v-model                 ="contacto.activo"
        label                   ="Activo"
        class                   ="col-auto"
        :disable                ="readonly"
      />
      <q-space/>
      <div
        v-if                    ="tipo == 'ver'"
        class                   ="col-auto"
        >
        <!-- //* /////////////  Borrar  -->
        <q-btn                  flat
          v-if                  ="readonly && permisos.contactos_borrar && borrable"
          label                 ="Borrar"
          color                 ="negative"
          @click                ="confirmarBorrar"
        />
        <!-- //* /////////////  Editar  -->
        <q-btn                  flat
          v-if                  ="readonly && permisos.contactos_crear"
          label                 ="Editar"
          @click                ="readonly = false"
        />
        <!-- //* /////////////  Cancelar  -->
        <q-btn                  flat
          v-else-if             ="permisos.contactos_crear"
          label                 ="Cancelar"
          @click                ="readonly = true"
        />
      </div>      
      <!-- //* //////////////   Botones Sumit  -->
      <transition               enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown">
        <div
          class                 ="col-12 column mobile-only"
          v-show                ="!readonly"
          >
          <!-- //* ///////////  Guardar Crear  -->
          <q-btn                dark push
            type                ="submit"
            color               ="positive"
            icon                ="mdi-account-check"  
            :label              ="tipo == 'ver' ? 'Guardar' : 'Crear'" 
          />
        </div>
      </transition>
      <!-- //* ///////////////  Boton sumit -->
      <q-btn
        v-show                  ="false"
        type                    ="submit"
      />
    </q-form>
  </ventana>
</template>

<script setup lang="ts">
  import {  ref,
            toRefs,
            computed,
            PropType,
            watch
                            } from "vue"
  import {  useQuasar,
            extend          } from 'quasar'
  import {  storeToRefs     } from 'pinia'            
  import {  useApiDolibarr  } from "src/services/useApiDolibarr"
  import {  useStoreUser    } from 'src/stores/user'
  import {  useTools,
            mayusculasPrimeraLetraAll
                            } from "src/useSimpleOk/useTools"
  import {  IMunicipio,
            Municipio       } from "src/models/Municipio"
  import {  IContacto,
            Contacto
                            } from "src/areas/terceros/models/Contacto"
  import    ventana           from "components/utilidades/Ventana.vue"
  import    municipios        from "components/utilidades/select/SelectMunicipios.vue"
  import    inputText         from "src/components/utilidades/input/InputFormText.vue"

  const { dialog            } = useQuasar()
  const { apiDolibarr       } = useApiDolibarr()
  const storeUser             = useStoreUser()
  const { permisos          } = storeToRefs(storeUser)
  const { aviso             } = useTools()
  const contacto              = ref<IContacto>(new Contacto())
  const cargando              = ref< boolean >(false)
  const formulario            = ref< any >()
  const urlDolibarr           = process.env.URL_DOLIBARR
  let   copiaContacto         = ""

  //* ////////////////////////////////////////////////////////////////////////////////////// Props
  const props                 = defineProps(
  {
    modelValue:   { default:  new Contacto(),   type: Object as PropType< IContacto >   },
    puedeEditar:  { default:  false,            type: Boolean                           },
    municipio:    { required: true,             type: Object as PropType< IMunicipio >  },
    esTerceroCtz: { default:  false,            type: Boolean                           },
    borrable:     { default:  false,            type: Boolean                           },
    editando:     { default:  false,            type: Boolean                           },
  })
  const emit                  = defineEmits(["update:modelValue", "crear", "borrar"])

  const { modelValue,
          municipio,
          editando,
          esTerceroCtz      } = toRefs( props )
  const tipo                  = ref< "crear" | "ver" > ("ver")
  const readonly              = ref< boolean >( tipo.value == "ver" && !editando.value ? true : false )  
  const btnDisable            = computed(()=>{
    return  (
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
              !contacto.value.telefono
              &&
              !contacto.value.correo
            )
  })
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* /////////////////////////////////////////////////////////////////////////////////// FUNCIONES DEL FORMULARIO
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //* ////////////////////////////////////////////////////////////////////////////////////// Validar
  async function validar()
  {
    let validacionOk          = await formulario.value.validate()
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
  async function crearContacto ()
  {
    cargando.value            = true
  
    let { ok, data }          = await apiDolibarr( "crear", "contacto", contacto.value.getContactoToAPIDolibarr() )

    if(ok)
    {
      aviso( "positive", "Contacto creado exitosamente", "account" )
      let id                  = data as string
      contacto.value.id       = parseInt( id )
      emit("crear", contacto.value)      
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
    cargando.value            = true
    let { ok, data }          = await apiDolibarr( "editar", "contacto", contacto.value.getContactoToAPIDolibarr(), contacto.value.id )

    if(ok)
    {
      emit("update:modelValue", contacto.value)
      aviso( "positive", "Contacto modificado exitosamente", "account" )
    }
    else
      aviso( "negative", "Error al modificar el contacto", "account" )

    cargando.value            = false
  }

  function confirmarBorrar()
  {
    dialog({
      title:    'Confirmar',
      message:  'Realmente deseas eliminar este contacto?',
      cancel:   true,
      class:    "text-center",
      html:     true,
    }).onOk(() => {
      borrarContacto()
    })
  }


  async function borrarContacto()
  {
    cargando.value            = true
    let { ok }                = await apiDolibarr( "borrar", "contacto", contacto.value.id )

    if(ok)
    {
      aviso( "positive", "Contacto borrado exitosamente", "account" )
      emit("borrar", contacto.value.id)
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
    },
    { immediate: true }
  ) 

  
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* /////////////////////////////////////////////////////////////////////////////////////////////////// FUNCTION VARIAS
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const titulo                = computed(()=>  tipo.value == "crear" ? "Crear contacto" : contacto.value.nombreCompleto)
  const modificado            = computed(()=>  copiaContacto !== JSON.stringify( contacto.value ) ) 
</script>