<template>
  <q-select                 map-options emit-value dense options-dense hide-bottom-space borderless
    v-model                 ="modelo"
    ref                     ="miSelect"
    input-debounce          ="0"
    class                   ="text-caption"
    options-selected-class  ="text-weight-bold"
    :autofocus              ="autofocus"
    :bg-color               ="bgColor"
    :disable                ="disable"
    :display-value          ="displayValueModelo"
    :filled                 ="filled"
    :fill-input             ="fillInput"
    :label                  ="label"
    :multiple               ="multiple"
    :options                ="lista"
    :option-label           ="optionLabel" 
    :option-value           ="optionValue"
    :outlined               ="outlined"
    :rounded                ="rounded"
    :readonly               ="readonly"
    :use-input              ="useInput"
    @add                    ="agregar"
    @input-value            ="input"
    @filter                 ="filterFn"
    @update:model-value     ="update"
    @remove                 ="remover"
    >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          No existe esa opción
        </q-item-section>
      </q-item>
    </template>
    <template #prepend v-if="icon != ''">
      <q-icon :name="icon" @click.stop />
    </template>
    <template #append
      v-if                  ="modelo != '' && ( clearable || filtro )">
      <q-icon 
        v-if                ="filtro"
        name                ="mdi-filter"
      />
      <q-icon
        name                ="mdi-close"
        class               ="cursor-pointer"
        @click.stop         ="limpiarSeleccion"
      />
    </template>
    <slot></slot>
  </q-select>
</template>

<script setup lang="ts" inherit-attrs="true">
  import {  computed,
            ref,
            toRefs,
            watch
                            } from 'vue'

  const props               = defineProps(
    {
      modelValue:   { required: true,       type: [Number, String, Array] }, // null, undefined
      autofocus:    { default:  false,      type: Boolean                 },
      bgColor:      { default:  undefined,  type: String                  },
      clearable:    { default:  false,      type: Boolean                 },
      disable:      { default:  false,      type: Boolean                 },
      displayValue: { default:  undefined,  type: String                  },  // Texto que remplaza al espacio donde va la seleccion
      filled:       { default:  false,      type: Boolean                 },  // Estilo con fondo redondeado
      fillInput:    { default:  false,      type: Boolean                 },  // Llena el input con el valor de la seleccion.
      filtro:       { default:  false,      type: Boolean                 },  
      icon:         { default:  undefined,  type: String                  },
      label:        { default:  undefined,  type: String                  },  // Texto que aparece arriba de la seleccion
      readonly:     { default:  false,      type: Boolean                 },
      multiple:     { default:  false,      type: Boolean                 },  // Permite varias opciones de seleccion
      optionLabel:  { default:  undefined,  type: String                  },
      optionValue:  { default:  undefined,  type: String                  },
      options:      { required: true,       type: Array                   },
      outlined:     { default:  false,      type: Boolean                 },  // Estilo que muestra un borde
      rounded:      { default:  false,      type: Boolean                 },
      useInput:     { default:  false,      type: Boolean                 },
    }
  )

  const emit                    = defineEmits(["update:modelValue", "remove", "add", "input", "clear"])

  const {
          displayValue,
          fillInput,
          modelValue,
          multiple,
          options,
          optionValue,
          optionLabel,
        }                       = toRefs( props )

  const modelo                  = ref< string | any[] > ("")
  const lista                   = ref< any[]  > ( options.value )
  const displayValueModelo      = ref< string | undefined > ( !!displayValue ? displayValue.value : undefined )
  let   largo                   = 0
  let   multidimencional        = false

  watch
  (
    modelValue,
    (modeloNew, modeloOld) =>
    {
      //console.log('%c⧭', 'color: #8c0038', "modelValue", modelValue.value)
      checkMultimedimencional()

      if(multiple.value)
      {

        largo                   = typeof modeloNew == "number" ?  modeloNew.toString().length : modeloNew.length 
        modelo.value            = []

        for(let opcion of options.value as any)
        {
          //console.log(opcion[optionValue], modeloNew[optionValue])
          if
          (
            optionValue         == undefined
            ||
            optionValue.value   == undefined
            ||
            !Array.isArray(modeloNew)
          )
            continue


          let indice            = optionValue.value 

          if( modeloNew.some( m => m == opcion[ indice ] ) ) 
          {
            modelo.value.push(opcion.value)
            
          }
        }
        //console.log("modelo final", modelo)
      }
      else  // si no es selección multiple
      {
        for(let opcion of options.value as any)
        {

          if
          (
            optionValue         == undefined
            ||
            optionValue.value   == undefined
          ) continue
          
          if
          (
            (
              multidimencional
              &&
              modelValue.value  == opcion[optionValue.value]
            )
            ||
            (
              !multidimencional
              &&
              opcion            == modelValue.value
            )
          )
          {                
            modelo.value        = opcion
            break;
          }
          else if
          (
            !modeloNew
            /*
            modeloNew           == ""
            ||
            modeloNew           == null
            ||
            modeloNew           == undefined
            */
          )
          {
            modelo.value        = ""
          }
        }
      }
    },
    {
      immediate:  true
    }
  )

  watch(
    options,
    (nuevo, viejo) =>
    {
      //console.log('%c⧭', 'color: #364cd9', "options", options.value)
      //console.log('%c⧭', 'color: #364cd9', "lista", lista.value)
      checkMultimedimencional()
    },
    {
      immediate:  true
    }
  )

  watch(
    fillInput,
    (isfillInput_new, viejo) =>
    {
      if(!!displayValue)
      {
        displayValueModelo.value  = isfillInput_new ? "" : displayValue.value
        //console.log('%c⧭', 'color: #00736b', "displayValue", displayValue.value)
        //console.log('%c⧭', 'color: #364cd9', "fillInput", displayValueModelo.value, fillInput.value)
      }
    },
    {
      immediate:  true
    }
  )

/*   watch(
    displayValue,
    (nuevo, viejo) =>
    {
      //console.log('%c⧭', 'color: #364cd9', "displayValue", nuevo)

      displayValueModelo.value  = !!nuevo ? nuevo : ""
    },
    {
      immediate:  false
    }
  ) */

  function update( valor : any)
  {
    //console.log('%c⧭', 'color: #99614d', "update", valor, modelo.value)

  }

  function remover( item : any )
  {  
    emit("remove", item)
  }

  function agregar( item : any )
  {
    emit("add", item)
  }
  
  function checkMultimedimencional()
  {
    multidimencional            = typeof options.value[0] == "object"  ? true : false //|| typeof options.value[0] == Object
    //console.log('%c⧭', 'color: #ffa280', "multidimencional", multidimencional)
  }

  function input( v : any     = "")
  {
    //console.log('%c⧭', 'color: #eeff00', "input", v)
    if
    (
      modelo.value              != null
      &&
      optionValue               != undefined
      &&
      optionValue.value         != undefined
    )
    {
      var indice                = optionValue.value 
      if(multiple.value)
      {
        if(v.length             > largo) // Se selecciono una nueva opcion 
        {
          let nuevaOpcion       = v[v.length-1]

          if(Array.isArray(modelo.value))
          {
            modelo.value.pop()
            modelo.value.push( options.value.find( ( o: any )  => o[ indice ]  == nuevaOpcion ) )
          }

        }

        let enviar : any          = ""

        if(Array.isArray( modelo.value ))
        {
          enviar = modelo.value.map( m => m[ indice ] )
        }
        //console.log("enviar", enviar)

        emit("update:modelValue", enviar)
      }
      else
      {
        emit("update:modelValue", modelo.value)
      }
    }  
  }

  function filterFn (busqueda : any, update :any, abort : any)
  {
    //console.log('%c⧭', 'color: #73998c', "filterFn")

    if (busqueda                === '')
    {
      update( () => { lista.value = options.value } )
      return
    }
    else
    if (busqueda.length         < 3)
    {
      abort()
      return
    }

    update(() => 
    {
      const itemMinusculas        = busqueda.toLowerCase()
      var indice                  = ""
      if
      (
        !!optionLabel
        &&
        !!optionLabel.value
      )
        indice                  = optionLabel.value
      if
      (
        multidimencional
        &&
        Array.isArray( options.value )
      )
        lista.value            = options.value.filter( ( o : any) => o[ indice ].toLowerCase().indexOf(itemMinusculas) > -1)
      else
        lista.value            = options.value.filter( ( o : any) => o.toLowerCase().indexOf(itemMinusculas) > -1)
    })   
      
  }


  function limpiarSeleccion()
  {
    //console.log('%c⧭', 'color: #514080', "limpiarSeleccion")

    modelo.value              = multiple.value ? [] : ""
    input()
    emit("clear")
  }

</script>