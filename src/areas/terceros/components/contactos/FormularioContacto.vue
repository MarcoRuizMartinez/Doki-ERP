<template>
  <ventana                      cerrar
    class-contenido             ="column items-center"
    icono                       ="mdi-account-box"
    :titulo                     ="titulo"
    :cargando                   ="cargando"
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
          :disable              ="btnDisable"
          @click                ="validar"
        />    
      <!-- </TransitionGroup> -->
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
        @update:model-value     ="(txt : string )=> contacto.nombres = ToolStr.mayusculasPrimeraLetraAll(txt)"
      />
      <!-- //* //////////////   Apellidos  -->
      <input-text               AZ alerta
        label                   ="Apellidos"
        v-model                 ="contacto.apellidos"
        class                   ="col-md-6 col-12"
        icon                    ="mdi-account"
        :readonly               ="readonly"
        @update:model-value     ="( txt : string )=> contacto.apellidos = ToolStr.mayusculasPrimeraLetraAll(txt)"
      />
      <!-- //* //////////////   Empresa -->
      <input-text               AZ
        v-if                    ="esTerceroCtz"
        label                   ="Empresa"
        v-model                 ="contacto.empresa"
        class                   ="col-md-8 col-12"
        icon                    ="mdi-office-building"
        :rules                  ="[ validarExisteEmpresa ]"
        :estadoCheck            ="estaCheckEmpresa"
        :readonly               ="readonly"
        @alert                  ="mostrarClientesExistentes"
        @blur                   ="vericarExisteEmpresa"
      />
      <!-- //* //////////////   Documento  -->
      <input-number
        v-if                    ="esTerceroCtz"
        v-model                 ="contacto.documento"
        label                   ="Documento"
        icon                    ="mdi-card-account-details"
        class                   ="col-md-4 col-12"
        separador-mil           ="punto"
        max-enteros             ="18"
        retorno                 ="String"
        :readonly               ="readonly"
        :estadoCheck            ="estaCheckDocumento"
        :rules                  ="[ reglaExisteNumero ]"
        @blur                   ="verificarDocumentoExiste"
      />
      <!-- //* //////////////   Cargo  -->
      <input-text               AZ
        label                   ="Cargo"
        v-model                 ="contacto.cargo"
        class                   ="col-md-4 col-12"
        icon                    ="mdi-account-cowboy-hat"
        :alerta                 ="!esTerceroCtz && !tipoEntrega"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Correo  -->
      <input-text               sin-espacios copy
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
      />
      <!-- //* //////////////   Telefono 1  -->
      <input-text               copy
        v-model                 ="contacto.telefono"
        label                   ="Celular"
        type                    ="tel"
        class                   ="col-md-4 col-12"
        :rules                  ="[ validarExisteCel ]"
        :estadoCheck            ="estaCheckCel"
        :readonly               ="readonly"
        @alert                  ="mostrarClientesExistentes"
        @blur                   ="vericarExisteCel"        
      />
      <!-- //* //////////////   Telefono 2  -->
      <input-text               copy
        v-model                 ="contacto.telefono_2"
        label                   ="Teléfono"
        type                    ="tel"
        class                   ="col-md-4 col-7"
        :rules                  ="[ validarExisteTel ]"
        :estadoCheck            ="estaCheckTel"
        :readonly               ="readonly"
        @alert                  ="mostrarClientesExistentes"
        @blur                   ="vericarExisteTel"                
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
        :requerido              ="tipoEntrega"
        :readonly               ="readonly"
      />
      <div class                ="col-12 row items-center">
      <!-- //* //////////////   Dirección  -->
        <input-text             alerta
          v-if                  ="tipoEntrega"
          v-model               ="contacto.direccion"
          label                 ="Dirección"         
          icon                  ="mdi-map-marker-radius"
          :class                ="readonly ? 'col-12' : 'col-11'"
          :readonly             ="readonly"
        />
        <div v-if               ="!readonly">
          <q-btn
            v-bind              ="style.btnRedondoFlat2Sm"
            class               ="col-1"
            icon                ="mdi-content-duplicate"
            @click              ="contacto.direccion = direccion"
          />
          <Tooltip label        ="Copiar dirección de tercero"/>
        </div>
      </div>
      <!-- //* //////////////   Notas  -->
      <q-input                  filled autogrow 
        v-model                 ="contacto.nota"
        :placeholder            ="tipoEntrega ? 'Indicaciones' : 'Notas sobre el contacto...'"
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
      <div                      v-else>
        <!-- //* /////////////  Copiar  -->
        <q-btn                  dense flat no-caps
          label                 ="Copiar datos de..."
          icon                  ="mdi-content-duplicate"
          >
          <q-menu
            anchor              ="bottom middle"
            self                ="top middle"
            >
            <div  class         ="column items-start ">
              <q-btn            v-close-popup
                v-bind          ="style.btnFlatSm"
                icon            ="mdi-content-duplicate"
                label           ="Copiar de tercero"
                @click          ="copiarDatosTercero"
              />
              <q-btn            v-close-popup
                v-bind          ="style.btnFlatSm"
                icon            ="mdi-content-duplicate"
                label           ="Copiar de otros contactos"
                @click          ="ventanaCopiarContacto = true"
              />
            </div> 
          </q-menu>            
        </q-btn>
      </div>
      <!-- //* //////////////   Botones Sumit  -->
      <!-- <TransitionGroup          enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown"> -->
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
      <!-- </TransitionGroup> -->
      <!-- //* ///////////////  Boton sumit -->
      <q-btn
        v-show                  ="false"
        type                    ="submit"
      />
    </q-form>
    <!-- //* ///////////////////////////////////////////////////////////// Modal consentimiento -->
    <q-dialog
      v-model                   ="ventanaClienteExiste"      
      v-bind                    ="style.dialogo"
      >
      <ventana                  cerrar scroll
        titulo                  ="Terceros registrados"
        icono                   ="mdi-account-remove"
        padding-contenido       ="0"
        width                   ="440px"
        >
        <template               #barra>
          <q-btn
            v-if                ="esTerceroInternoDeCoti"
            v-bind              ="style.btnBaseSm"
            color               ="positive"
            :label              ="consentimientoAsesor ? 'Firmado' : 'Firmar'"
            :icon               ="consentimientoAsesor ? 'mdi-check' : 'mdi-signature'"
            @click              ="mostrarAvisoConsentimiento"
          />
        </template>
        <q-table                bordered dense flat
          class                 ="fit tabla-maco"
          row-key               ="id"
          :rows                 ="clientesExistentes"
          :columns              ="[ { name: 'nombre', label: 'Tercero', field: 'nombre', align: 'left' }, { name: 'vendedores', label: 'Asesores', field: 'vendedores'}]"
        />
      </ventana>    
    </q-dialog>
    <q-dialog
      v-model                   ="ventanaCopiarContacto"      
      v-bind                    ="style.dialogo"
      >
      <contactos                cerrar solo-emitir
        :tercero-id             ="acuerdo.tercero.id"
        @clik-contacto          ="copiarContacto"
      />
    </q-dialog>
  </ventana>
</template>


<script setup lang="ts">
//class-contenido         ="row items-start content-start justify-start q-col-gutter-md q-mt-none"
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            Ref,
            toRefs,
            computed,
            PropType,
            watch
                            } from "vue"
  import {  useQuasar,
            extend          } from 'quasar'
  //* ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs     } from 'pinia'
  import {  useStoreUser    } from 'stores/user'
  import {  useStoreAcuerdo } from 'stores/acuerdo'
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IMunicipio,
            Municipio       } from "src/models/Municipio"
  import {  IContacto,
            Contacto        } from "src/areas/terceros/models/Contacto"
  import {  EstadoVerificar } from "src/models/TiposVarios"
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useApiDolibarr  } from "src/composables/useApiDolibarr"
  import {  servicesTerceros} from "src/areas/terceros/services/servicesTerceros"  
  import {  useTools,
            Tool,
            ToolStr         } from "src/composables/useTools"
  import {  useFetch        } from "src/composables/useFetch"
  import {  getURL,
            getFormData     } from "src/composables/APIMaco"
  import {  style           } from "src/composables/useEstilos"
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana           from "components/utilidades/Ventana.vue"
  import    municipios        from "components/utilidades/select/SelectMunicipios.vue"
  import    inputText         from "components/utilidades/input/InputFormText.vue"
  import    inputNumber       from "components/utilidades/input/InputFormNumber.vue"
  import    contactos         from "src/areas/terceros/components/contactos/ModuloContactos.vue"  

  const { vericarDocumentoEnDolibarr
                            } = servicesTerceros()  
  const { dialog            } = useQuasar()
  const { apiDolibarr       } = useApiDolibarr()
  const { permisos          } = storeToRefs( useStoreUser() )
  const { acuerdo           } = storeToRefs( useStoreAcuerdo() )
  const { aviso             } = useTools()
  const { miFetch           } = useFetch()
  const contacto              = ref<IContacto>(new Contacto())
  const cargando              = ref< boolean >(false)
  const ventanaClienteExiste  = ref< boolean >(false)
  const ventanaCopiarContacto = ref< boolean >(false)
  const formulario            = ref< any >()
  const clientesExistentes    = ref< any[] >([])
  const urlDolibarr           = process.env.URL_DOLIBARR
  const consentimientoAsesor  = ref< boolean >(false)
  let   copiaContacto         = ""

  //* ////////////////////////////////////////////////////////////////////////////////////// Props
  const props                 = defineProps(
  {
    modelValue:   { default:  new Contacto(),   type: Object as PropType< IContacto >   },
    puedeEditar:  { default:  false,            type: Boolean                           },
    municipio:    { required: true,             type: Object as PropType< IMunicipio >  },
    direccion:    { required: true,             type: String                            },
    esTerceroCtz: { default:  false,            type: Boolean                           },
    borrable:     { default:  false,            type: Boolean                           },
    editando:     { default:  false,            type: Boolean                           },
    tipoEntrega:  { default:  false,            type: Boolean                           },
  })

  const emit                  = defineEmits<{
    (e: "update:modelValue",  value: IContacto  ): void
    (e: "crear",              value: IContacto  ): void
    (e: "borrar",             value: number     ): void
  }>()
    
  const { modelValue,
          municipio,
          editando,
          esTerceroCtz      } = toRefs( props )
  const tipo                  = ref< "crear" | "ver" > ("ver")
  const readonly              = ref< boolean >( tipo.value == "ver" && !editando.value ? true : false )  
  const esTerceroInternoDeCoti= computed(()=> !!clientesExistentes.value && clientesExistentes.value.length === 1 /* && clientesExistentes.value[0].nombre.indexOf('COTIZACIONES ', 0) != -1 */)
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



  const estaCheckEmpresa      = ref<EstadoVerificar>("off")
  const estaCheckEmail        = ref<EstadoVerificar>("off")  
  const estaCheckCel          = ref<EstadoVerificar>("off")
  const estaCheckTel          = ref<EstadoVerificar>("off")
  const estaCheckDocumento    = ref<EstadoVerificar>("off")

  const validarExisteEmpresa  = () => validarExiste(estaCheckEmpresa)
  const validarExisteEmail    = () => validarExiste(estaCheckEmail)
  const validarExisteCel      = () => validarExiste(estaCheckCel)
  const validarExisteTel      = () => validarExiste(estaCheckTel)

  function validarExiste( estado : Ref< EstadoVerificar >) : boolean | string
  {
    if(!esTerceroCtz.value) return true
    let valido                  = true
    let mensaje                 = ""

    if(estado.value             == "alert"){
      valido                    = false
      mensaje                   = "El empresa ya existe"
    }
    else
    if(estado.value             == "verificando"){
      valido                    = false
      mensaje                   = "Verificando si empresa ya existe"
    }

    return  valido || mensaje
  }

  async function vericarExisteEmpresa(){
    let existe    = await vericarExiste("nombreTerceroExiste",        contacto.value.empresa, estaCheckEmpresa)
    if(existe)    return
    existe        = await vericarExiste("empresaExisteEnContacto",    contacto.value.empresa, estaCheckEmpresa)
  }

  async function vericarExisteCel(){
    let existe    = await vericarExiste("telefonoTerceroExiste",      contacto.value.telefono, estaCheckCel)
    if(existe)    return
    existe        = await vericarExiste("telefonoContactoExiste",     contacto.value.telefono, estaCheckCel)
  }

  async function vericarExisteTel(){
    let existe    = await vericarExiste("telefonoTerceroExiste",      contacto.value.telefono_2, estaCheckTel)
    if(existe)    return
    existe        = await vericarExiste("telefonoContactoExiste",     contacto.value.telefono_2, estaCheckTel)
  }

  async function vericarExisteCorreo(){
    contacto.value.correo = contacto.value.correo.toLowerCase()
    let existe      = await vericarExiste("emailTerceroExiste",       contacto.value.correo,  estaCheckEmail)
    if(existe)      return
    existe          = await vericarExiste("emailContactoExiste",      contacto.value.correo,  estaCheckEmail)
    if(existe)      return
    const esFamoso  = Tool.esCorreoFamoso(contacto.value.correo)
    if(esFamoso)    return
    const dominio   = contacto.value.correo.split('@').pop() ?? "" //.match(/(?<=@)[^.]+(?=\.)/)[0]
    existe          = await vericarExiste("emailTerceroExiste",       dominio,  estaCheckEmail)
    if(existe)      return
    existe          = await vericarExiste("emailContactoExiste",      dominio,  estaCheckEmail)
  }

  async function vericarExiste( consulta : string, valor : string, estado : Ref<EstadoVerificar> ) : Promise<boolean>
  {
    if(!esTerceroCtz.value || !valor || consentimientoAsesor.value ){
      estado.value              = "off"
      return false
    }     

    estado.value                = "verificando"
    clientesExistentes.value    = []
    let { ok : existe, data}    = await miFetch(  getURL( "listas", "varios"),
                                                  {
                                                    method: "POST",
                                                    body:   getFormData( consulta, { valor } )
                                                  },
                                                    { mensaje: "buscar si existe este cliente", dataEsArray: true }
                                                )

    const resultado : any[]     = Array.isArray(data) ? data : []     
    if(existe && !!resultado.length && "id" in resultado[0] && !!resultado[0].id)
    {
      estado.value              = "alert"
      const msj =   resultado.length === 1
                  ? "Hay un cliente con estos datos"
                  : `Hay ${resultado.length} clientes con estos datos`
      
      aviso( "negative", msj, "account", 3000, [ { label: 'Ver detalles', color: 'white', handler:  mostrarClientesExistentes } ] )
      
      for (const cliente of resultado) {
        if("vendedor" in cliente)
        {
          cliente.vendedores = JSON.parse(cliente.vendedor).map( (v : any)=> v.name ).join(", ")
          clientesExistentes.value.push(cliente)
        }
      }
    }
    else
      estado.value              = "check"

    return existe
  }

  function mostrarClientesExistentes()
  {
    if( !!clientesExistentes.value && !clientesExistentes.value.length) return
    ventanaClienteExiste.value  = true    
  }

  function mostrarAvisoConsentimiento()
  {
    dialog({
      title:    'Pedir consentimiento',
      message:  'Eres consiente que ya hay un contacto con estos datos?',
      cancel:   true,
      class:    "text-center",
      html:     true,
    }).onOk(() => {
      consentimientoAsesor.value  = true
      estaCheckEmpresa.value      = "off"
      estaCheckEmail.value        = "off" 
      estaCheckCel.value          = "off"
      estaCheckTel.value          = "off"     
    })
  }

  function copiarContacto( c : IContacto )
  {
    ventanaCopiarContacto.value   = false
    contacto.value.correo         = c.correo    
    contacto.value.telefono       = c.telefono  
    contacto.value.telefono_2     = c.telefono_2
    contacto.value.extension      = c.extension 
    contacto.value.municipio      = c.municipio
    contacto.value.municipioId    = c.municipioId
    contacto.value.direccion      = c.direccion 
    contacto.value.nota           = c.nota
    contacto.value.cargo          = c.cargo
  }

  function copiarDatosTercero()
  {
    contacto.value.correo         = acuerdo.value.tercero.correo
    contacto.value.telefono       = acuerdo.value.tercero.telefono
    contacto.value.municipio      = acuerdo.value.tercero.municipio
    contacto.value.municipioId    = acuerdo.value.tercero.municipioId
    contacto.value.direccion      = acuerdo.value.tercero.direccion

    if(!acuerdo.value.tercero.esEmpresa)
      contacto.value.apellidos    = acuerdo.value.tercero.nombre
  }

  async function verificarDocumentoExiste() :Promise< boolean >
  {
    const doc                     = contacto.value.documento.toString()

    if( !doc
        ||
        doc.length                < 5
        ||
        estaCheckDocumento.value  == "alert"
      )
      return false

      estaCheckDocumento.value    = "verificando"

    const id                      = await vericarDocumentoEnDolibarr( doc )
    estaCheckDocumento.value      = !!id ? "alert" : "check" 

    return !!id
  }    
  
  function reglaExisteNumero( numeroTxt : string ) : boolean | string
  {
    let valido                  = true
    let mensaje                 = ""

    if(estaCheckDocumento.value == "alert")
    {
      valido                    = false
      mensaje                   = "El tercero ya existe"
    }
    else
    if(estaCheckDocumento.value == "verificando" )
    {
      valido                    = false
      mensaje                   = "Verificando si tercero ya existe"
    }

    return  valido || mensaje
  }


  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* /////////////////////////////////////////////////////////////////////////////////////////////////// FUNCTION VARIAS
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const titulo                = computed(()=>  tipo.value == "crear" ? "Crear contacto" : contacto.value.nombreCompleto)
  const modificado            = computed(()=>  copiaContacto !== JSON.stringify( contacto.value ) ) 
</script>