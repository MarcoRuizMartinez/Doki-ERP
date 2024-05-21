<template>
  <div>
    <q-field        filled
      
      label         ="Price with v-money directive"
      hint          ="Mask: $ #,###.00 #"
      >
      <template #control="{ id, floatingLabel, modelValue, emitValue }">
        <input
          
          v-show    ="floatingLabel"
          :id       ="id"
          class     ="q-field__input text-right"
          :value    ="modelValue"
            
        >
      </template>
    </q-field>
  </div>
</template>


<script setup lang="ts">
// // !(tercero.documento == null || tercero.documento == '' || lectura || enfocado || verificando)
  import {  
            ref,
            toRefs,
            PropType,
            onMounted,
            watch
                                  } from 'vue'
  import {  Notify,
            copyToClipboard       } from 'quasar'
  import {  EstadoVerificar       } from "src/models/TiposVarios"
  import {  btnNumeroPaso         } from "src/composables/useEstilos"
  import {  ValidationRule        } from "quasar"
  import {  ToolType              } from "src/composables/useTools"

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
      bgColor:      { default:  undefined,        type: String              },
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
  watch(maximo, (newMax)=>{ valorMaxModelo.value  = ToolType.strOrNumToNum( newMax, NUM_MAX ) } )

  const valorMinModelo    = ref< number >( -NUM_MAX )
  watch(minimo, (newMin)=>{ valorMinModelo.value  = ToolType.strOrNumToNum( newMin, -NUM_MAX ) } )

  let   regex             = new RegExp("",  "")

  onMounted ( ()=> {
    definirLargoMax()
    crearRegExp()
    procesarNumero( modelo.value )
  })

  watch(modelValue, (nuevoModelo)=>
  {
    if(!ToolType.valorValido(nuevoModelo))
      modelo.value = ""
  })

  if(!!modelValue)
  {
    watch
    (
      modelValue,
      (nuevoModelo) =>
      {
        if( ToolType.valorValido(nuevoModelo) && ( noUndefined.value || !noUndefined.value ) )
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

  function sumar()
  {
    numero.value          = ToolType.anyToNum( numero.value )
    const suma            = +Number( numero.value + paso.value ).toFixed(2)
    if(suma               <= +(maximo.value)){
      numero.value        = suma
      formatear()
    }
  }

  function restar()
  {
    numero.value          = ToolType.anyToNum( numero.value )

    const resta           = +Number( numero.value - paso.value ).toFixed(2) 
    if(resta              >= +(minimo.value)){
      numero.value        = resta
      formatear()
    }
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
    if( ToolType.valorValido( numero.value ) )
    {
      numero.value        = ToolType.anyToNum( numero.value )

      if(!conDecimales.value)
        numero.value      = parseInt ( numero.value.toString() )      

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

