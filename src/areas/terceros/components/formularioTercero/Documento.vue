<template>
  <q-select                 filled dense options-dense hide-bottom-space borderless
    v-model                 ="modelTipo"
    label                   ="Tipo documento*"
    class                   ="col-md-4 col-12 text-caption"
    options-selected-class  ="text-weight-bold"
    :options                ="tiposDocumento"
    :readonly               ="readonly"
    :rules                  ="[ validarTipoDocumento ]"
    @update:model-value     ="cambiarTipo"
    >
    <template #prepend > <q-icon name="mdi-card-account-details" /> </template>
  </q-select>
  <input-number             solo-positivo alerta copy
    v-if                    ="esNumero"
    v-model                 ="modelo.numero"
    label                   ="Numero"
    icon                    ="mdi-card-account-details"
    class                   ="col-md-5 col-12"
    separador-mil           ="punto"
    max-enteros             ="18"
    retorno                 ="String"
    :estadoCheck            ="estadoVerificar"
    :rules                  ="[ validarNumero, validarExisteNumero ]"
    :disable                ="modelTipo.length == 0"
    :readonly               ="readonly"
    @blur                   ="vericarNumero"
    @update:model-value     ="inputNumero"
  />
  <input-text               clearable copy uppercase sinEspacios alerta
    v-else
    v-model                 ="modelo.numero"
    label                   ="Numero"
    icon                    ="mdi-card-account-details"
    class                   ="col-md-5 col-12"
    :estadoCheck            ="estadoVerificar"
    :rules                  ="[ validarExisteNumero ]"
    :disable                ="modelTipo.length == 0"
    :readonly               ="readonly"
    @blur                   ="vericarNumero"
  />
  <input-number             solo-positivo alerta
    v-model                 ="modelo.digito"
    label                   ="Dígito"
    icon                    ="mdi-card-account-details"
    class                   ="col-md-3 col-12"
    max-enteros             ="1"
    retorno                 ="String"
    :rules                  ="[ validarDigito ]"
    :disable                ="modelo.tipo.label !== 'NIT'"
    :readonly               ="readonly"
  />
</template>

<script setup lang="ts" inherit-attrs="false">
  import {  computed,
            ref,
            toRefs,
            PropType,
            watch,
            onMounted
                              } from 'vue'
  //* ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs       } from 'pinia'      
  import {  useStoreDexie     } from 'stores/dexieStore'

  import {  IDocumento        } from "src/areas/terceros/models/DocumentoId"

  import {  ITipoDocumento,
            TIPOS_DOCUMENTO
                              } from "src/areas/terceros/models/TiposDocumento"
  import {  EstadoVerificar   } from "src/models/TiposVarios"
  import {  useTools          } from "src/composables/useTools"
  
  import {  dexieTiposDocumentos
                              } from "src/composables/useDexie"
  import {  useFetch          } from "src/composables/useFetch"
  import {  getURL,
            getFormData       } from "src/composables/APIMaco"
  import    inputNumber         from "components/utilidades/input/InputFormNumber.vue"
  import    inputText           from "components/utilidades/input/InputFormText.vue"
  import {  servicesTerceros  } from "src/areas/terceros/services/servicesTerceros"

  const { aviso               } = useTools()
  const { miFetch             } = useFetch()  
  dexieTiposDocumentos()
  const { tiposDocumento      } = storeToRefs( useStoreDexie() )
  
  const { vericarDocumentoEnDolibarr
                              } = servicesTerceros()

  const props                   = defineProps(
    {
      modelValue: { required: true,   type: Object as PropType<IDocumento>  },
      lectura:    { default:  false,  type: Boolean                         },
      readonly:   { default:  false,  type: Boolean                         },
    }
  )

  const emit                    = defineEmits<{
    (e: 'update:modelValue',  value: IDocumento   ): void
    (e: 'verifikOk',          value: string       ): void
  }>()


  const { modelValue }          = toRefs( props )
  const modelo                  = ref<IDocumento>( modelValue.value )


  const esNumero                = computed( () => modelo.value.tipo.codigo == TIPOS_DOCUMENTO.CEDULA_CIUDADANIA ||
                                                  modelo.value.tipo.codigo == TIPOS_DOCUMENTO.NIT               ||
                                                  modelo.value.tipo.codigo == TIPOS_DOCUMENTO.TARJETA_IDENTIDAD )
  const estadoVerificar         = ref<EstadoVerificar>("off")

  const modelTipo               = ref< ITipoDocumento[] >( [  ] )
  let   copiaNumero             : string

  onMounted ( iniciar )

  function iniciar()
  {
    /* if( tipo.value.value > 0 )
      cambiarTipo(  getIDTipoDocumento( tipo.value.value ?? 0 ) ) */
  }

  watch(
    modelValue,
    (newModel, oldModel) =>
    {
      modelo.value              = newModel
      modelTipo.value           = newModel.tipo as any

      if(!!newModel.numero && !oldModel.numero) // se da solo al inicio
      {
        copiaNumero             = newModel.numero
      }
    }
  )

  watch(
    tiposDocumento,
    (newTipos, oldTipos) =>
    {
      if(newTipos.length > 0 && oldTipos.length == 0 )
      {
        modelTipo.value         = newTipos[0] as any
        cambiarTipo( newTipos[0] )
      }
    }
  )

  watch(
    modelo,
    (newDoc, oldDoc) => 
    {
      emit("update:modelValue", newDoc)
    },
    { deep: true }
  )

  function inputNumero( numero : string ) // Cambia a tipo cedula o nit segun el numero
  {
    if(esNumero.value)
    {
      let numeroDoc           = parseInt( numero )
      let tipoDoc

      if( numeroDoc           >= 1_000_000_000 )
        tipoDoc               = tiposDocumento.value[1] // Cedula
      else
      if( numeroDoc           >= 800_000_000 )
        tipoDoc               = tiposDocumento.value[0] // Nit

      if(tipoDoc              != undefined)
      {
        modelTipo.value       = tipoDoc as any
        cambiarTipo( tipoDoc ) 
      }
    }

    estadoVerificar.value     = estadoVerificar.value  == "alert" ? "off" : estadoVerificar.value
  }


  async function verificarDocumentoExiste() :Promise< boolean | null>
  {

    if( !modelo.value.numero
        ||
        modelo.value.numero.length  < 5
        ||
        estadoVerificar.value       == "alert"
        ||
        modelo.value.numero         == copiaNumero
      )
      return null

    estadoVerificar.value       = "verificando"

    const id                    = await vericarDocumentoEnDolibarr( modelo.value.numero )
    estadoVerificar.value       = !!id ? "alert" : "check" 

    return !!id
  }  

  
  function cambiarTipo( tipoDocumento : ITipoDocumento )
  {
    modelo.value.tipo           = tipoDocumento 

    if(modelo.value.tipo.codigo != TIPOS_DOCUMENTO.NIT)
    {
      modelo.value.digito       = ""
    }
  }

  function validarTipoDocumento( tipoDocumento : ITipoDocumento ){
    return  !!tipoDocumento.value || "Por favor seleccione el tipo de documento"
  }

  function validarNumero( numeroTxt : string ) : boolean | string
  {
    let numero                  = parseInt( numeroTxt.replace(/[^/0-9]+/g, "") )
    let valido                  = true
    let mensaje                 = ""

    if(modelo.value.tipo.codigo == TIPOS_DOCUMENTO.NIT)
    {
      if(numero                 < 100_000)
      {
        valido                  = false
        mensaje                 = "El NIT no puede ser inferior a 100 mil"
      }
      else if(numero            > 100_000_000 && numero < 699_999_999)
      {
        valido                  = false
        mensaje                 = "El NIT no puede estar en el rango de 100 a 699 millones"
      }
      else if(numero            > 1_999_999_999)
      {
        valido                  = false
        mensaje                 = "El Nit no puede ser superior a 2000 millones"
      }
    }
    else
    if(modelo.value.tipo.codigo == TIPOS_DOCUMENTO.CEDULA_CIUDADANIA)
    {
      if(numero                 < 100_000)
      {
        valido                  = false
        mensaje                 = "La cedula no puede ser inferior a 100 mil"
      }
      else if(numero            > 100_000_000 && numero < 999_999_999)
      {
        valido                  = false
        mensaje                 = "La cedula no puede estar en el rango de 100 a 999 millones"
      }
      else if(numero            > 1_999_999_999)
      {
        valido                  = false
        mensaje                 = "La cedula no puede ser mayor a 2000 millones"
      }
    }
    else
    if(modelo.value.tipo.codigo == TIPOS_DOCUMENTO.TARJETA_IDENTIDAD)
    {
      if(numero                 < 1_000_000_000)
      {
        valido                  = false
        mensaje                 = "La tarjeta de identidad no puede ser inferior a 1000 millones"
      }
      else if(numero            > 2_000_000_000)
      {
        valido                  = false
        mensaje                 = "La tarjeta de identidad no puede ser mayor a 2000 millones"
      }
    }

    return  valido || mensaje
  }

  function validarExisteNumero( numeroTxt : string ) : boolean | string
  {
    let valido                  = true
    let mensaje                 = ""

    if(estadoVerificar.value    == "alert")
    {
      valido                    = false
      mensaje                   = "El tercero ya existe"
    }
    else
    if(estadoVerificar.value    == "verificando" )
    {
      valido                    = false
      mensaje                   = "Verificando si tercero ya existe"
    }

    return  valido || mensaje
  }

  async function vericarNumero()
  {
    const existe = await verificarDocumentoExiste()

    if(!existe && existe !== null ){
      await vericarNumeroVerifik()
    }
  }

  async function vericarNumeroVerifik() :Promise< boolean >
  {
    if((!modelo.value.tipo.esCedula && !modelo.value.tipo.esNIT) || !modelo.value.numero)
      return false

    const numero        = parseInt( modelo.value.numero )  
    const tipoDoc       = numero >= 800_000_000 && numero <= 999_999_999 ? "NIT" : "CC" //modelo.value.tipo.esCedula ? "CC" : "NIT"

    const { ok, data }  = await miFetch(  getURL( "listas", "verifik"),
                                                  {
                                                    method: "POST",
                                                    body:   getFormData( tipoDoc, { numero: modelo.value.numero } )
                                                  },
                                                  { mensaje: "buscar si existe numero de documento" }
                                                )
    //console.log(tipoDoc, "data Verifik: ", data);

    if(!ok){
      aviso("negative", `Error al consultar datos en Verifik`)
      return false
    }

    if(typeof data !== "object" && !Array.isArray(data)) return false

    if( "code" in data && typeof data.code === "string" && data.code == "NotFound")
    {
       aviso("negative", `No se encontro ${tipoDoc} en base de datos`, "shield", 7000)
    }
    else
    if( "data" in data && typeof data.data === "object"){

      if( modelo.value.tipo.esCedula
          &&
          "fullName" in data.data && typeof data.data.fullName === "string"
      )
      {
        emit("verifikOk", data.data.fullName)
        aviso("positive", "Se encontro documento en la base de datos", "shield", 7000)
      }
      else
      if( modelo.value.tipo.esNIT
          &&
          "mensaje_error" in data.data && !data.data.mensaje_error // cuando > mensaje_error: ""
          &&
          "rows"          in data.data && Array.isArray( data.data.rows ) && !!data.data.rows.length
      )
      {
        const largo = data.data.rows.length
        if(largo === 1)
        {
          const empresa = data.data.rows[0]
          if
          (
            typeof empresa === "object"
            &&  "estadoRM"      in empresa && typeof empresa.estadoRM     === "string"
            &&  "municipio"     in empresa && typeof empresa.municipio    === "string"
            &&  "razon_social"  in empresa && typeof empresa.razon_social === "string"
          )
          {            
            emit("verifikOk", empresa.razon_social)
            aviso("positive", `Se encontró la empresa ${empresa.razon_social} en la DIAN. Estado: ${empresa.estadoRM} - Municipio: ${empresa.municipio}`,  "shield", 7000)
          }
        }
        else
        {
          aviso("negative", "Hay varios NIT que concuerdan con esta busqueda. Verificar en la DIAN", "shield", 7000)
        }
      }
    }
    return ok
  }

  function validarDigito( numeroTxt : string ) : boolean | string
  {
    let valido                  = true
    let mensaje                 = ""

    if(!modelo.value.tipo.esNIT) return valido

    
    if(numeroTxt.length         != 1)
    {
      valido                    = false
      mensaje                   = "Error en digito de verificación"
    }

    return  valido || mensaje
  }
  
</script>