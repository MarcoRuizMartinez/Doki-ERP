<template>
  <q-input          dense hide-bottom-space
    v-model         ="modelo"
    lazy-rules      ="ondemand"
    class           ="transi"
    debounce        ="1200"
    :class          ="{'campo-hundido' : hundido}"
    :filled         ="!hundido"
    :borderless     ="!hundido"
    :type           ="type"
    :label          =" !!alerta && !readonly ? label + ' *' : label"
    :rules          ="[ regla, reglaEmail, reglaTelefono, ...rules ]"
    :autofocus      ="autofocus"
    :clearable      ="clearable"
    :disable        ="disable"
    :maxlength      ="maxlength"
    :mask           ="mask"
    :readonly       ="readonly"
    :loading        ="(!campoEnfocado && estadoCheck == 'verificando') || loading"
    @blur           ="onBlur"
    @focus          ="onFocus" 
    @clear          ="emit('clear')"
    @keydown.enter.prevent ="emit('enter')"
    >
    <template #prepend v-if="!!icon">
      <q-icon :name ="icon" />
    </template>
    <template       #after>
      <q-btn        dense flat 
        v-if        ="estadoCheck == 'check' || estadoCheck == 'alert' && !readonly && !campoEnfocado"
        class       ="transi"
        padding     ="2px"
        :class      ="{'cursor-inherit' : !(estadoCheck == 'alert')}"
        :color      ="estadoCheck == 'check' ? 'positive'           : 'warning'"
        :icon       ="estadoCheck == 'check' ? 'mdi-check-circle'   : 'mdi-alert'"
        @click      ="()=>{if(estadoCheck == 'alert') emit('alert')}"
      />
      <q-btn        round dense flat
        v-else-if   ="readonly && copy"
        class       ="transi"
        icon        ="mdi-content-copy"
        @click      ="copiar"
      />
      <slot></slot>
    </template>
  </q-input>
</template>

<script setup lang="ts">
  import {  computed,
            ref,
            toRefs,
            watch,
            PropType
                                  } from 'vue'
  import {  Notify,
            copyToClipboard,
            ValidationRule        } from 'quasar'
  import {  EstadoVerificar       } from "src/models/TiposVarios"

  const props           = defineProps(
    {
      modelValue: { required: true,   type: String              },
      label:      { default:  "",     type: String              },
      icon:       { default:  "",     type: String              },
      readonly:   { default:  false,  type: Boolean             },
      disable:    { default:  false,  type: Boolean             },
      autofocus:  { default:  false,  type: Boolean             },
      clearable:  { default:  false,  type: Boolean             },
      hundido:    { default:  false,  type: Boolean             },
      uppercase:  { default:  false,  type: Boolean             },
      sinEspacios:{ default:  false,  type: Boolean             },
      copy:       { default:  false,  type: Boolean             },
      alerta:     { default:  false,  type: [Boolean, String]   },
      fnAlert:    { default:  ()=>{}, type: Function            },
      AZ09:       { default:  false,  type: Boolean             },
      AZ:         { default:  false,  type: Boolean             },
      loading:    { default:  false,  type: Boolean             },
      maxlength:  {                   type: [String, Number]    },
      rules:      { default:  [],     type: Array  as PropType< ValidationRule[] > },
      estadoCheck:{ default:  "off",  type: String as PropType< EstadoVerificar > },
      type:       { default:  "text", type: String as PropType < "text" | "email" | "tel" >},
    }
  )

  const emit            = defineEmits(["update:modelValue", "blur", "clear", "alert", "enter"])

  const {
          modelValue,
          label,
          alerta,
          uppercase,
          sinEspacios,
          AZ09,
          AZ,
          type
        }               = toRefs( props )

  const modelo          = computed({
                            get: ()     => modelValue.value,
                            set: valor  =>
                            {
                              valor         = valor ?? ""
                              valor         = type.value === "tel" ? parseInt( valor.replace(/[ ]+/g, "") ).toString() : valor
                              valor         = valor == "NaN" ? "" : valor
                              emit("update:modelValue", formatear(valor))
                            }
                          })

  let copiaModelo       = ""
  const mask            = ref< string >( type.value == "tel" ? "### ### ####" : "" )
  const campoEnfocado   = ref< boolean >(false)
  
  watch( modelValue, ( nuevoModelo ) =>
    {
      modelo.value        = nuevoModelo
    }
  )

  function regla( texto : string )
  {
    return  (
              (
                !!texto
                &&
                texto.length > 0
              )
              ||
              !alerta.value
            )
            ||
            ( typeof alerta.value == "string" ? alerta.value : `El campo '${label.value}' no puede estar vació` )
  }

  function onFocus()
  {
    copiaModelo         = modelo.value
    campoEnfocado.value = true
  }

  function reglaEmail( texto : string )
  {
    if(type.value               != "email") return true
    if(!alerta.value            && !texto ) return true
    
    return validarEmail(texto)  || "El correo esta mal escrito"
  }

  function reglaTelefono( texto : string )
  {
    if(type.value               != "tel"  ) return true
    if(!alerta.value            && ( !texto.length || texto == "NaN"  ) ) return true

    let numero                  = parseInt( texto.replace(/[ ]+/g, "") )
    let tresIniciales           = parseInt( texto.slice(0,3).replace(/[ ]+/g, "") )
    let inicial                 = parseInt( texto.slice(0,1).replace(/[ ]+/g, "") )

    let mensaje                 = ""
    let todoOk                  = true

    if(numero.toString().length != 10) {
      mensaje                   = "El teléfono debe tener 10 dígitos"
      todoOk                    = false
    }
    else
    if
    (
      inicial                   == 6
      &&
      (
        tresIniciales           < 601
        ||
        tresIniciales           > 608
      )
    )
    {
      mensaje                   = "Los indicativos de ciudad van de 601 a 608"
      todoOk                    = false
    }
    else
    if
    (
      inicial                   == 3
      &&
      tresIniciales             > 351
    )
    {
      mensaje                   = "El prefijo del celular no deben ser mayor a 351"
      todoOk                    = false
    }
    else
    if(inicial != 3 && inicial  != 6)
    {
      mensaje                   = "El prefijo no es correcto"
      todoOk                    = false
    }

    return todoOk || mensaje
  }

  async function copiar()
  {
    await copyToClipboard( modelo.value ) 
    Notify.create({ type: "positive", message: label.value +  " copiado", position: "bottom" })
  }

  function formatear( txt : string)
  {
    let texto               = txt
        texto               = uppercase.value               ? texto.toUpperCase()                         : texto
        texto               = uppercase.value && AZ09.value ? texto.replace(/[^A-Z ÑÁÉÍÓÚ&./0-9]+/g, "")  : texto
        texto               = uppercase.value && AZ.value   ? texto.replace(/[^A-Z ÑÁÉÍÓÚ]+/g, "")        : texto
        texto               = sinEspacios.value             ? texto.replace(/[ ]+/g, "")                  : texto
        texto               = texto == "NaN" ? "" : texto
        
        texto               = texto.replace(/\s+/g,' ')
        texto               = texto.trim()
    return(texto)    
  }

  function validarEmail( email : string ) : boolean
  {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
  }

  function onBlur()
  {
    modelo.value            = formatear(modelo.value)
    campoEnfocado.value     = false
    if(copiaModelo          !== modelo.value)
      emit('blur', modelo.value)
  }

  // :class          ="{ 'text-uppercase': uppercase }"
</script>