<template>
  <ventana
    class-contenido             ="column items-center"
    :titulo                     ="titulo"
    :cargando                   ="cargando"
    :menu-visible               ="!!tercero.ulrFoto"
    >
    <template                   #barra>
      <!-- mode="out-in" -->
      <!-- <TransitionGroup          enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown"> -->
        <q-btn                  dark push dense glossy
          v-if                  ="!readonly"
          class                 ="desktop-only"
          color                 ="positive"  
          icon                  ="mdi-account-check"
          size                  ="md"
          padding               ="2px 8px"          
          :label                ="tipo == 'ver' ? 'Guardar' : 'Crear'" 
          @click                ="validar"
        />
        <span                   v-else>       
          <q-btn                flat round dense
            v-if                ="!cargando"
            color               ="white"
            icon                ="mdi-open-in-new"
            type                ="a"
            class               ="op40 op100-hover q-ml-xs"
            target              ="_blank"
            :href               ="urlDolibarr + '/societe/card.php?socid=' + tercero.id"
            >
            <Tooltip label      ="Ir a Dolibarr"/>
          </q-btn>
          <q-btn                flat round dense
            icon                ="mdi-refresh"
            class               ="op60 op100-hover"
            @click              ="emit('recargar')"
            >
            <Tooltip label      ="Recargar"/>
          </q-btn>
        </span>
      <!-- </TransitionGroup> -->
    </template>
    <template                   #menu
      v-if                      ="!!tercero.ulrFoto">
      <div class                ="col-12 row items-center">
        <q-img
          class                 ="col-6"
          spinner-color         ="white"
          position              ="0"
          fit                   ="contain" 
          style                 ="max-height: 60px; max-width: 300px;"
          :src                  ="tercero.ulrFoto"
        />
        <q-separator inset vertical  />
        <q-space/>
        <!-- //* //////////////   Favorito  -->
        <favorito
          v-if                  ="tercero.favorito || !readonly"
          v-model               ="tercero.favorito"
          tooltip               ="Favorito"
          :readonly             ="readonly"
        />
        <span
          v-if                  ="!!tercero.color || !readonly"
          class                 ="q-ml-md"          
          >
          <q-btn                push dense round
            :disable            ="readonly"
            :style              ="'background-color: ' + tercero.color + ';'">
            <q-popup-proxy
              v-if              ="!readonly">
              <q-color v-model  ="tercero.color" no-header no-footer />
            </q-popup-proxy>
          </q-btn>
          <Tooltip label        ="Color"/>          
        </span>
      </div>
    </template>
    <!-- //* ////////////////   FORMULARIO  -->
    <q-form
      ref                       ="formulario"
      @submit                   ="onSubmit"
      class                     ="row q-col-gutter-md fit"
      >
      <!-- //* //////////////   Razon Social cuando es NIT  -->
      <input-text               clearable uppercase AZ09 copy alerta autofocus
        v-model                 ="tercero.nombre"
        class                   ="col-12"
        :class                  ="tercero.esEmpresa ? 'col-md-9' : 'col-md-8'"
        :icon                   ="tercero.esEmpresa ? 'mdi-office-building-outline' : 'mdi-account'"
        :label                  ="tercero.esEmpresa ? 'Razón social' : 'Nombre completo'"
        :readonly               ="readonly"        
      />
      <!-- //* //////////////   ALIAS -->
      <input-text               clearable
        v-model                 ="tercero.alias"
        icon                    ="mdi-badge-account"
        class                   ="col-12"
        :class                  ="tercero.esEmpresa ? 'col-md-3' : 'col-md-4'"
        :label                  ="tercero.esEmpresa ? 'Alias' : 'Nombre de pila'"
        :readonly               ="readonly"
        :alerta                 ="!tercero.esEmpresa"
        :rules                  ="[ validarNomprePila ]"
      />
      <!-- //* //////////////   Documento  -->
      <documento
        v-model                 ="tercero.documento"
        :readonly               ="readonly"
        @verifik-ok             ="cargarNombreToVerifik"
      />
      <!-- //* //////////////   Municipio o Ciudad  -->
      <municipios               requerido
        v-model                 ="tercero.municipio"
        class                   ="col-12"
        :readonly               ="readonly"
        @update:modelValue      ="cambiarMunicipio"
      />
      <div
        v-if                    ="storeUser.usuario.esContable"
        class                   ="col-12 row justify-center"
        >
        <campo-copiar :label    ="tercero.municipio.codigoDian">
          <span class           ="fuente-delicada">Codigo Dian:</span> {{ tercero.municipio.codigoDian }}
        </campo-copiar>
      </div>
      <!-- //* //////////////   Direccion  -->
      <direccion
        v-model                 ="tercero.direccion"
        class                   ="col-12"
        :readonly               ="readonly"
        :municipio              ="tercero.municipio"
      />        
      <!-- //* //////////////   Correo contacto -->
      <input-text               clearable copy alerta sin-espacios
        v-model                 ="tercero.correo"
        type                    ="email"
        label                   ="Correo contacto"
        icon                    ="mdi-at"
        class                   ="col-md-6 col-12"
        :bg-color               ="correosIguales ? 'green-1' : ''"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Correo facturacion  -->
      <div class                ="col-md-6 col-12 row items-center">
        <input-text             clearable copy alerta sin-espacios
          v-model               ="tercero.correoFacturas"
          type                  ="email"
          label                 ="Correo facturación"
          icon                  ="mdi-at"          
          :bg-color             ="correosIguales ? 'green-1' : ( !!tercero.correoFacturas ? 'blue-1' : '' )"
          :class                ="readonly ? 'col-12' : 'col'"
          :readonly             ="readonly"
        />
        <div v-if               ="!readonly">
          <q-btn
            v-bind              ="style.btnRedondoFlat2Sm"
            class               ="col"
            icon                ="mdi-content-duplicate"
            :disable            ="!tercero.correo"
            @click              ="tercero.correoFacturas = tercero.correo"
          />
          <Tooltip label        ="Copiar mismo correo de contacto "/>
        </div>        
      </div>
      <!-- //* //////////////   Telefono  -->
      <input-text               clearable copy alerta
        v-model                 ="tercero.telefono"
        type                    ="tel"
        label                   ="Teléfono"
        icon                    ="mdi-phone"
        class                   ="col-md-6 col-12"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Area o Departamento  -->
      <div class                ="col-md-6 col-12">
        <q-btn-toggle           push unelevated spread glossy dense
          v-model               ="tercero.area"
          :readonly             ="readonly"
          :options              ="Areas"
        />
      </div>
      <!-- //* //////////////   Responsable o comercial  -->
      <comerciales              autoselect use-input
        v-model                 ="tercero.responsables"
        class                   ="col-12"
        :readonly               ="readonly || !storeUser.permisos.acceso_total"
      />      
      <!-- //* //////////////   Código proveedor  -->
      <!-- <TransitionGroup          enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" > -->
        <input-text             clearable alerta uppercase AZ09 sin-espacios
          v-if                  ="tercero.esProveedor && !readonly"
          v-model               ="tercero.codigoProveedor"
          label                 ="Código proveedor"
          icon                  ="mdi-office-building-outline"
          class                 ="col-md-4 col-5"
          maxlength             ="4"
          :readonly             ="readonly"
        />
      <!-- </TransitionGroup> -->
      <!-- //* //////////////   Sujeto a IVA  -->
      <q-checkbox               
        v-if                    ="tercero.esCliente"
        v-model                 ="tercero.aplicaIVA"
        label                   ="Sujeto a IVA"
        :disable                ="readonly"
      />
      <!-- //* //////////////   Sujeto a IVA  -->
      <q-checkbox               
        v-if                    ="tercero.esCliente"
        v-model                 ="tercero.esFamoso"
        label                   ="Es famoso"
        :disable                ="readonly"
      />      
      <q-space/>
      <!-- //* //////////////   Color   :disabled="displayVideoInline"> -->
      <span v-if                ="!tercero.ulrFoto && ( !!tercero.color || !readonly )">
        <q-btn                  push dense round
          :disable              ="readonly"
          :style                ="'background-color: ' + tercero.color + ';'">
          <q-popup-proxy
            v-if                ="!readonly">
            <q-color v-model    ="tercero.color" no-header no-footer />
          </q-popup-proxy>
        </q-btn>
        <Tooltip label          ="Color"/>
      </span>
      <!-- //* //////////////   Favorito  -->
      <favorito
        v-if                    ="!tercero.ulrFoto && (tercero.favorito || !readonly)"
        v-model                 ="tercero.favorito"
        tooltip                 ="Favorito"
        :readonly               ="readonly"
      />
      <q-space/>
      <div
        v-if                    ="tipo == 'ver' && puedeEditar"
        >
        <q-btn                  flat
          v-if                  ="readonly"
          label                 ="Modificar"
          @click                ="readonly = false"
        />
        <q-btn                  flat
          v-else
          label                 ="Cancelar"
          @click                ="readonly = true"
        />
      </div>
      <!-- //* //////////////   Botones Sumit  -->
      <!-- <TransitionGroup          enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown"> -->
        <div
          class                 ="col-12 column mobile-only"
          v-show                ="!readonly"
          >
          <q-btn                dark push
            type                ="submit"
            color               ="positive"
            icon                ="mdi-account-check"  
            :label              ="tipo == 'ver' ? 'Guardar' : 'Crear'" 
          />
        </div>
      <!-- </TransitionGroup> -->
    </q-form>
    <!-- //* /////////////////  Carita triste -->
<!--     <div v-else class           ="column justify-center items-center" >
      <q-icon                     
        class                   ="text-grey-5 "
        style                   ="font-size: 20em;"
        name                    ="mdi-emoticon-sad-outline"
      />
      <span class               ="text-center text-h6 text-grey-8">
        {{ codigoError == CODES_FETCH.errorConsulta    ? "Algo anda mal con la URL" : "" }}
        {{ codigoError == CODES_FETCH.AbortError       ? "Hay un problema consultando al tercero" : "" }}
        {{ codigoError == CODES_FETCH.errorDesconocido ? "Hay un error desconocido" : "" }}
      </span>
      <q-btn
        v-if                    ="CODES_FETCH.AbortError"
        style                   ="width: 120px;"
        color                   ="primary"
        label                   ="Reintentar"
        @click                  ="iniciarMotorCargarTerceroDolibarr(id) "
      />        
    </div> -->
  </ventana>
</template>

<script setup lang="ts">
  import {  ref,
            toRefs,
            computed,
            PropType,
            onMounted,
            watch
                            } from "vue"
  import {  useQuasar       } from 'quasar'  
  import {  useApiDolibarr  } from "src/composables/useApiDolibarr"
  import {  getURL,
            getFormData     } from "src/composables/APIMaco"
  import {  useStoreUser    } from "stores/user"
  import {  useFetch        } from "src/composables/useFetch"
  import {  ITercero,
            Tercero
                            } from "src/areas/terceros/models/Tercero"
  import {  Areas           } from "src/models/TiposVarios"
  import    ventana           from "components/utilidades/Ventana.vue"
  import    comerciales       from "src/areas/usuarios/components/SelectUsuarios.vue"
  import    municipios        from "components/utilidades/select/SelectMunicipios.vue"
  import    inputText         from "components/utilidades/input/InputFormText.vue"
  import    favorito          from "components/utilidades/StarFavorito.vue"
  import    documento         from "./Documento.vue"
  import    direccion         from "./DireccionDian.vue"
  import {  IMunicipio      } from "src/models/Municipio"
  import {  style           } from "src/composables/useEstilos"
  import    campoCopiar       from "components/utilidades/CampoCopiar.vue" 

  const { notify }            = useQuasar()
  const { apiDolibarr       } = useApiDolibarr()
  const { miFetch           } = useFetch()
  const storeUser             = useStoreUser()
  const tercero               = ref<ITercero>(new Tercero())  
  const cargando              = ref< boolean >(false)
  //const codigoError           = ref< CODES_FETCH >( CODES_FETCH.OK )
  const formulario            = ref< any >()
  let   copiaResponsables     : string
  const urlDolibarr           = process.env.URL_DOLIBARR

  //* ////////////////////////////////////////////////////////////////////////////////////// Props
  const props                 = defineProps(
  {
    tipo:         { default: "ver",         type: String as PropType< "crear-cliente" | "crear-proveedor" | "ver" > },
    terceroCarga: { default: new Tercero(), type: Object as PropType< ITercero >                                    },
    puedeEditar:  { default: false,         type: Boolean                                                           },
  })

  const emit                  = defineEmits<{
    (e: 'terceroCreado',  value: number ): void
    (e: 'recargar',       value: void ): void
  }>()

  const { tipo,
          terceroCarga      } = toRefs( props )

  const readonly              = ref< boolean >( tipo.value == "ver" ? true : false )

  //* ////////////////////////////////////////////////////////////////////////////////////// onMounted
  onMounted( iniciar )

  //* ///////////////////////////////////////////////////////////////////////////////// Ver cambios en tipo para iniciar
  watch(tipo, (newTipo, oldTipo) => iniciar())

  //* ////////////////////////////////////////////////////////////////////////////////////// Inicio
  function iniciar()
  {
    if(tipo.value             == "ver"){
      cargando.value          = true
      return
    }

    tercero.value             = new Tercero()    
    tercero.value.esCliente   = tipo.value == "crear-cliente"
    tercero.value.esProveedor = tipo.value == "crear-proveedor"
    tercero.value.area        = storeUser.usuario.area
  }
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
    if(tipo.value == "ver")
      modificarTercero()
    else
      crearTercero ()
  }

  //* ////////////////////////////////////////////////////////////////////////////////////// Crear Tercero
  async function crearTercero ()
  {
    cargando.value            = true
    let { data  : newID,
          ok    : terceroOk } = await apiDolibarr( "crear", "tercero", tercero.value.getTerceroToAPIDolibarr() )

    if(terceroOk)
    {
      const id                = parseInt( newID?.toString() ?? "0" )
      if(storeUser.permisos.acceso_total) // Cuando se tiene acceso total, o ver otros terceros de los otros no asigna usuario a tercero cuando se crea, por eso toca asignarlo                                      
      {
        
        const objeto            = { id, responsables: tercero.value.responsablesIDS } 
        let { ok : okUser }     = await miFetch(  getURL( "servicios", "terceros"),
                                                  {
                                                    method: "POST",
                                                    body:   getFormData( "asignarResponsables", objeto )
                                                  },
                                                  { mensaje: "asignar usuarios a tercero" }
                                                )
        if(!okUser)
          aviso( "negative", "Error al asignar el responsable del tercero" )
      }

      aviso( "positive", "Tercero creado exitosamente" )
      emit('terceroCreado', id)
    }
    else
    {
      aviso( "negative", "Error al crear el tercero. Por favor vuelve a intentarlo" )
    }

    cargando.value            = false
  }
  //* ////////////////////////////////////////////////////////////////////////////////////// Modificar Tercero 
  async function modificarTercero()
  {
    cargando.value            = true
    let responsables          = JSON.stringify( tercero.value.responsables ) 
    let cambioEnResponsables  = responsables != copiaResponsables
    const terceroApi          = tercero.value.getTerceroToAPIDolibarr()
    let { ok, data }                = await apiDolibarr( "editar", "tercero", terceroApi, tercero.value.id )

    if(cambioEnResponsables)
    {
      copiaResponsables       = responsables
      let url                 = getURL( "servicios", "terceros")
      let { ok : borrado, data : data1   } = await miFetch( url, { method: "POST", body: getFormData( "borrarResponsables",  { id: tercero.value.id } ) },                                               { mensaje: "borrar responsables de tercero" } )
      let { ok : okUsuarios, data : data2  } = await miFetch( url, { method: "POST", body: getFormData( "asignarResponsables", { id: tercero.value.id , responsables: tercero.value.responsablesIDS } ) }, { mensaje: "asignar usuarios a tercero"     } )
      if(!borrado || !okUsuarios )
        aviso( "negative", "Error al asignar el responsable del tercero" )
    }

    if(ok)  aviso( "positive", "Tercero modificado exitosamente" )

    cargando.value            = false
    readonly.value            = true
  }

  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* /////////////////////////////////////////////////////////////////////////////////// FUNCTION DE CARGAR DE TERCERO
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  watch(terceroCarga, (newTercero, oldTercero) =>
    {
      if(!!newTercero.id || tipo.value == "crear-cliente")
      {        
        tercero.value           = Object.assign( new Tercero(), newTercero) 
        copiaResponsables       = JSON.stringify( tercero.value.responsables ) // Para luego ver si cambiaron
        cargando.value          = false
      }
    },
    { deep: true, immediate: true }
  )
  
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* /////////////////////////////////////////////////////////////////////////////////////////////////// FUNCTION VARIAS
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const titulo                = computed(()=>
  {
    let title                 = ""

    if(tipo.value             == "crear-cliente")
      title                   = "Crear cliente"
    else
    if(tipo.value             == "crear-proveedor")
      title                   = "Crear proveedor"
    else
    if(tipo.value             == "ver")
    {
      if(tercero.value.nombre.length > 1)
        title                 = "Datos de tercero"
      else
        title                 = "Cargando..."
    }

    return  title
  })

  const correosIguales        = computed(()=> tercero.value.correo === tercero.value.correoFacturas && !!tercero.value.correo )
        
                                  
  //* ////////////////////////////////////////////////////////////////////////////////////// Aviso Nofity
  function aviso( tipo : "positive" | "negative", mensaje : string )
  {
      notify({
        color:      tipo,
        textColor:  "white",
        icon:       tipo == "negative" ? "mdi-account-alert" : "mdi-account-check",
        position:   "top",
        timeout:    2800,
        message:    mensaje,
      })
  }

  //* ////////////////////////////////////////////////////////////////////////////////////// Validad nombre de pila
  function validarNomprePila( nombrePila : string )
  {
    let valido                = true
    let mensaje               = "Nombre de pila no esta en el nombre completo"

    if
    (
      !tercero.value.esEmpresa
      &&
      !tercero.value.nombre.toLowerCase().includes( nombrePila.toLowerCase() )
    )
    {
      valido                  = false
    }

    return  valido || mensaje
  }

  function cambiarMunicipio( municipio : IMunicipio ){
    if(!tercero.value || tercero.value.telefono.length <= 3) 
      tercero.value.telefono  = municipio.indicativo
  }

  function cargarNombreToVerifik( nombre : string ){
    tercero.value.nombre = nombre
  }
</script>
