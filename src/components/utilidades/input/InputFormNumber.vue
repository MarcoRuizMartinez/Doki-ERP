<template>
  <div>
    <!-- v-bind              ="$attrs" -->
    <q-input              dense hide-bottom-space      
      v-model             ="modelo"
      class               ="transi input-numero"
      input-class         ="fuente-mono"
      lazy-rules          ="ondemand"
      type                ="text"
      :debounce           ="debounce"    
      :class              ="{'campo-hundido' : hundido}"
      :filled             ="!hundido"
      :borderless         ="!hundido"
      :label              =" !!alerta && !readonly ? label + ' *' : label"
      :rules              ="[ ...rules, regla, reglaCero ]"
      :error              ="error"
      :error-message      ="errorMessage"
      :autofocus          ="autofocus"
      :readonly           ="readonly"
      :clearable          ="clearable"
      :prefix             ="tipo == 'precio'      ? '$' : ''"
      :suffix             ="tipo == 'porcentaje'  ? '%' : ''"
      :maxlength          ="maxlength"
      :disable            ="disable"
      :loading            ="!campoEnfocado && estadoCheck == 'verificando'"
      @blur               ="campoEnfocado = false; emit('blur')" 
      @focus              ="campoEnfocado = true" 
      @clear              ="limpiar"
      @update:model-value ="inputEvent"
      @keyup.enter        ="emit('enter')"
      >
      <template           #prepend v-if="!!icon">
        <q-icon :name     ="icon" />
      </template>
      <template           #append  v-if="btnClick">
        <q-btn
          icon            ="mdi-chevron-right"
          color           ="primary"
          padding         ="6px 6px"
          style           ="margin-right: -12px;"
          @click          ="emit('click')"
        />
      </template>
      <template           #after
        style             ="font-size: 14px; padding-left: 0px;"
        >
        <q-icon
          v-if            ="estadoCheck == 'check' || estadoCheck == 'alert' && !readonly && !campoEnfocado"
          class           ="transi"
          :name           ="estadoCheck == 'check' ? 'mdi-check-circle'   : 'mdi-alert' "
          :color          ="estadoCheck == 'check' ? 'positive'           : 'warning'"
        />
        <q-btn            round dense flat
          v-else-if       ="readonly && copy"
          icon            ="mdi-content-copy"
          class           ="transi"
          @click          ="copiar"
        />
        <div
          v-if            ="!!paso"
          class           ="column"
          style           ="font-size: 14px; padding-left: 0px;"
          :class          ="{'ma--3px' : hundido}"
          >
          <q-btn
            v-bind        ="estiloBotones('arriba')"
            v-touch-repeat:0:100.mouse  ="sumar"
            :disable      ="btnSumarDisable"
          />
          <q-btn
            v-bind        ="estiloBotones('abajo')"
            v-touch-repeat:0:100.mouse  ="restar"
            :disable      ="btnRestarDisable"
          />
        </div>
      </template>
    </q-input>
  </div>
  
</template>
<script setup lang="ts">
// // !(tercero.documento == null || tercero.documento == '' || lectura || enfocado || verificando)
  import {  
            ref,
            toRefs,
            computed,
            PropType,
            onMounted,
            watch
                                  } from 'vue'
  import {  Notify,
            copyToClipboard       } from 'quasar'
  import {  EstadoVerificar       } from "src/models/TiposVarios"
  import {  btnNumeroPaso         } from "src/useSimpleOk/useEstilos"
  import {  ValidationRule        } from "quasar"
  import {  valorValido,  
            strOrNumToNum         } from "src/useSimpleOk/useTools"

  const NUM_MAX           = 9_999_999_999
  const props             = defineProps(
    {
      modelValue:   { required: true,             type: [Number,  String  ],  default: ""  },
      alerta:       { default:  false,            type: [Boolean, String  ] },
      autofocus:    { default:  false,            type: Boolean             },
      conDecimales: { default:  false,            type: Boolean             },
      copy:         { default:  false,            type: Boolean             },
      disable:      { default:  false,            type: Boolean             },
      hundido:      { default:  false,            type: Boolean             },
      icon:         { default:  "",               type: String              },
      label:        { default:  "",               type: String              },
      clearable:    { default:  false,            type: Boolean             },
      noUndefined:  { default:  false,            type: Boolean             },
      readonly:     { default:  false,            type: Boolean             },
      soloPositivo: { default:  false,            type: Boolean             },
      noCero:       { default:  false,            type: Boolean             },
      btnClick:     { default:  false,            type: Boolean             },
      paso:         { default:  0,                type: Number              },
      error:        { default:  false,            type: Boolean             },      
      errorMessage: { default:  "Error en valor", type: String              },
      debounce:     { default:  1200,             type: [String, Number]    },
      maximo:       { default:   9_999_999_999,   type: [String, Number]    },
      minimo:       { default:  -9_999_999_999,   type: [String, Number]    },
      maxEnteros:   { default:  0,                type: [String, Number]    },
      estadoCheck:  { default:  "off",            type: String as PropType< EstadoVerificar > },
      retorno:      { default:  "Number",         type: String as PropType< "Number"  | "String" | "StringFormat" > },
      rules:        { default:  [],               type: Array  as PropType< ValidationRule[] > },
      separadorMil: { default:  "coma",           type: String as PropType< "coma"    | "punto" > },
      tipo:         { default:  "numero",         type: String as PropType< "precio"  | "porcentaje" | "numero" > },
      colores:      { default:  "gris-flat",      type: String as PropType< "gris"  | "verde-rojo" | "gris-flat" >  },
      iconos:       { default:  "flecha",         type: String as PropType< "suma"  | "flecha" >            },
    } 
  )

  const emit              = defineEmits(["update:modelValue", "blur", "clear", "click", "enter"])

  const {
          modelValue,
          label,
          alerta,
          conDecimales,
          tipo,
          soloPositivo,
          noCero,
          separadorMil,
          maxEnteros,
          retorno,
          readonly,
          maximo,
          minimo,
          paso,
          colores,
          iconos,
          noUndefined,
        }                 = toRefs( props )

  const formato           = new Intl.NumberFormat(separadorMil.value == "coma" ? "en-US" : "es-CO",
                            {
                              minimumFractionDigits: conDecimales.value ? 0 : 0
                            }
                          );

  const numero            = ref< number | undefined>() // useClamp(1, minimo.value, maximo.value) // 
  const campoEnfocado     = ref< boolean >(false)

  const modelo            = ref< string >( "" ) // typeof modelValue.value == "string" ? modelValue.value : modelValue.value.toString()
  const maxlength         = ref< number >( -1 )

  const valorMaxModelo    = ref< number >( NUM_MAX )
  watch(maximo, (newMax)=>{ valorMaxModelo.value  = strOrNumToNum( newMax, NUM_MAX ) } )

  const valorMinModelo    = ref< number >( -NUM_MAX )
  watch(minimo, (newMin)=>{ valorMinModelo.value  = strOrNumToNum( newMin, -NUM_MAX ) } )


  const btnSumarDisable   = computed( ()=> ( numero.value ?? 0 ) + paso.value > valorMaxModelo.value || readonly.value )
  const btnRestarDisable  = computed( ()=> ( numero.value ?? 0 ) - paso.value < ( +minimo.value ?? -NUM_MAX )  || readonly.value )

  let   regex             = new RegExp("",  "")

  onMounted ( ()=> {
    definirLargoMax()
    crearRegExp()
    procesarNumero( modelo.value ) 
  })

  watch(modelValue, (nuevoModelo)=>{
    if(!nuevoModelo)
      modelo.value = ""
  })

  if(!!modelValue)
  {
    watch
    (
      modelValue,
      (nuevoModelo, viejoModelo) =>
      {
        if
        (
          (
            noUndefined.value
            &&
            valorValido(nuevoModelo)
          )
          ||
          (
            !noUndefined.value
            &&
            !!nuevoModelo
          )
        )
        {
          modelo.value    = typeof nuevoModelo == "string" ? nuevoModelo : nuevoModelo.toString()
        }

        procesarNumero( modelo.value, false )
      },
      {
        deep: true,
        immediate: true
      }
    )
  }

  function sumar() {
    
    if(!numero.value) 
      numero.value        = 0

    numero.value          = +Number( numero.value + paso.value ).toFixed(2)
    formatear()
  }

  function restar() {
    if(!numero.value) 
      numero.value        = 0

    numero.value          = +Number( numero.value - paso.value ).toFixed(2)    
    formatear()
  }  

  function crearRegExp()
  {
    let negativo          = soloPositivo.value            ? ""  : "-"
    let separadorDecimales= separadorMil.value == "coma"  ? "." : ","
    let regExpCadena      = "[^" + negativo + separadorDecimales + "/0-9]"
    regex                 = new RegExp(regExpCadena, 'g') // Ejemplo [^,/0-9]+/g 
  }

  function inputEvent( valor :  string | number | null)
  {
    if( valor != null ){
      
      procesarNumero( valor )
    }
  }

  function limpiar(){
    modelo.value          = ''
    emit('clear')
    emit('update:modelValue', undefined)
    
  }

  function procesarNumero( valor : string | number, emitir : boolean = true  )
  {
    
    valor                 = typeof valor == "string" ? valor.replace(regex, "") : valor
    
    if(!!valor && typeof valor == "string")
    {
      if(valor            === "-" && !soloPositivo.value)
      {
        numero.value      = 0
        modelo.value      = valor
      }
      else
      if(valor.slice(-1)  == "."  && separadorMil.value == "coma" && conDecimales.value)
      {
        numero.value      = parseFloat( valor )
        modelo.value      = valor
      }
      else
      if(valor.slice(-1)  == ","  && separadorMil.value == "punto" && conDecimales.value)
      {
        numero.value      = parseFloat( valor )
        modelo.value      = valor
      }
      else
      {
        numero.value      = parseFloat( valor.replace(",", ".") )
        valor             = numero.value.toString()
        formatear( emitir )
      }
    }
    else
    {
      modelo.value        = ""
      numero.value        = undefined
      
      formatear()
    }
  }

  function formatear( emitir : boolean = true  )
  {
    
    if(!!numero.value)
    {
      if(!conDecimales.value)
      {
        numero.value      = parseInt ( numero.value.toString() )        
      }

      numero.value        =+( numero.value > valorMaxModelo.value ? valorMaxModelo.value
                            : numero.value < valorMinModelo.value ? valorMinModelo.value
                            : numero.value )

      modelo.value        = formato.format( numero.value )
    }
    
    
    if( emitir ) retornar()
  }

  function retornar()
  {
    //
    if(numero.value === undefined)
    {
      if(!!modelValue){
        //const valor = typeof modelValue.value == "string" ? "" : undefined
        const valor = retorno.value === "Number" ? undefined : ""
        emit("update:modelValue", valor )        
      }

      return
    }

    let retorno_ : string | number  = ""

    if(retorno.value      == "Number")
      retorno_            = numero.value
    else
    if(retorno.value      == "String")
      retorno_            = numero.value.toString()
    else
    if(retorno.value      == "StringFormat")
      retorno_            = modelo.value

    emit("update:modelValue", retorno_ )
  }

  function regla( valor : string | number ) : boolean | string
  {
    let largo             = typeof valor == "string" ? valor.length : valor.toString().length

    return  (
              (
                !!valor
                &&
                largo     > 0
              )
              ||
              !alerta.value
            )
            ||
            ( typeof alerta.value == "string" ? alerta.value : `El campo '${label.value}' no puede estar vació` )
  }

  function reglaCero( valor : string | number ) : boolean | string {
    return  ( Number(valor) !== 0 || !noCero.value || !alerta.value ) || "Valor no puede ser cero"
  }  

  async function copiar()
  {
    await copyToClipboard( modelo.value ) 
    Notify.create({ type: "positive", message: label.value +  " copiado", position: "bottom" })
  }


  function definirLargoMax()
  {
    /*
      No funciona bien si es negativo o cuando hay decimales. Toca depurarlo
    */
    if(!maxEnteros.value) return

    if(typeof maxEnteros.value == "string")
      maxlength.value     = parseInt( maxEnteros.value )
    else
      maxlength.value     = maxEnteros.value

    const puntosMillares  = Math.floor( ( maxlength.value - 1 ) / 3 )
    const puntosNegativo  = soloPositivo.value ? 0 : 1
    const puntosDecimal   = conDecimales.value ? 3 : 0

    maxlength.value       += puntosMillares + puntosNegativo + puntosDecimal
    /*
      let expre = new RegExp("[/0-9]", 'g')
      let cadena = "-233.232,33";

      let hallado = cadena.match(expre);
    */
  }

  function estiloBotones( tipo : "arriba" | "abajo" ) : Object{
    return btnNumeroPaso( tipo, colores.value,  iconos.value, "right", 6,  )
  }

</script>

<style>
.input-numero .q-field__after {
  padding-left: 0px;
}
.ma--3px{
  margin: -3px;
}
</style>