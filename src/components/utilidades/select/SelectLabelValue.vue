<template>
  <div>
    <q-select                 dense options-dense hide-bottom-space borderless
      v-model                 ="modelo"
      options-selected-class  ="text-weight-bold"
      class                   ="text-caption"
      :label                  ="label"
      :class                  ="{ 'campo-hundido' : hundido }"
      :filled                 ="!hundido"
      :options                ="opciones"
      :clearable              ="clearable && !!modelValue && !!modelo && !!modelo.label"
      :loading                ="options.length == 0 || loading"
      :readonly               ="readonly"
      :use-input              ="useInput"
      :behavior               ="behavior"
      :fill-input             ="useInput"
      :hide-selected          ="useInput"
      @filter                 ="filterFn"
      @clear                  ="limpiar"
      @update:model-value     ="seleccionar"
      >
      <template v-if          ="!!icon" #prepend>
        <q-icon :name         ="icon" />
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
/*
    input-debounce          ="0"
    lazy-rules              ="ondemand"
    display-value           =""
    option-label            ="nombreCompleto"
    @update:model-value     ="cambiarUsuario"
*/
  import {  ref,
            toRefs,
            PropType,
            watch
                            } from 'vue'
  import {  sortArray,
            valorValido     } from "src/useSimpleOk/useTools"                            
  import {  ILabelValue,
            labelValueNulo  } from "src/models/TiposVarios"
  

  
  const emit                  = defineEmits(["update:modelValue", "clear", "select"])
  
  /* defineEmits<{
    (e: 'update:modelValue',  value: ILabelValue | undefined ): void
    (e: 'select',             value: ILabelValue             ): void
    (e: 'clear',              value: void                    ): void
  }>() */
  
  
  
  const props                 = defineProps(
  {
    modelValue:   { required: true,     type: Object   as PropType<ILabelValue>   },
    label:        { required: true,     type: String,                             },
    readonly:     { default: false,     type: Boolean                             },
    useInput:     { default: false,     type: Boolean                             },
    hundido:      { default: false,     type: Boolean                             },
    icon:         { default: "",        type: String                              },
    options:      { required: true,     type: Array   as PropType<ILabelValue[]>  },
    clearable:    { default: false,     type: Boolean                             },
    loading:      { default: false,     type: Boolean                             },
    defecto:      { default: "",        type: String,                             },
    //noInmediato:  { default: false,     type: Boolean                             },
    optionsSort:  { default: "",        type: String                              },
    behavior:     { default: "default", type: String  as PropType< "default" | "menu" | "dialog" > },
  })
  const { modelValue,
          readonly,
          options,
          //noInmediato,
          defecto,
          optionsSort,
                              } = toRefs( props )
  const opciones                = ref< ILabelValue[] > ( options.value )
  const modelo                  = ref< ILabelValue >( )
  if(!!modelValue.value.label)
    modelo.value = modelValue.value
  //let   esVirgen                = true

  watch( options,   ()=>
  {
    copiarOptionsToOpciones()
    setDefecto()
  })

  watch( modelValue, ( newValue )  =>
  {
    if(modeloYvModelSonIguales()) return
      
    if(!!newValue && valorValido( newValue.value )){
      modelo.value              = seleccionarEntreOpciones( newValue.value )//newValue as ILabelValue
    }
    else{  
      modelo.value              = labelValueNulo
    }
  },
  //{ immediate: true }
  )

  watch( modelo,    ( newValue )  => 
  {
    if(modeloYvModelSonIguales()) return
    //if(esVirgen)// && noInmediato.value)
    //  esVirgen                  = false
    //else
    if(!!newValue && valorValido( newValue.value ) )
      emit("update:modelValue", newValue)
    else
      emit("update:modelValue", { value: null, label: ""  })
  })

  
  const modeloYvModelSonIguales = () :boolean => !!modelo.value && modelValue.value.value === modelo.value.value && modelValue.value.label === modelo.value.label

  function seleccionar()
  {
    if( valorValido(modelo.value) )
      emit("select", modelo.value)    
  }

  function setDefecto()
  {
    if(!defecto.value) return
    const opcionDefecto   = options.value.find( i => i.label == defecto.value)
    if(!!opcionDefecto)
      modelo.value        = opcionDefecto
  }

  function seleccionarEntreOpciones( value : any ) : ILabelValue {
    return options.value.find( i => i.value == value) ?? { value: null, label : "" }
  }
      
  function copiarOptionsToOpciones()
  {
    opciones.value        = options.value

    if(!!optionsSort.value)
      opciones.value      = sortArray(opciones.value, optionsSort.value)

    if(!!modelValue.value.label && !!modelValue.value.value)
      modelo.value        = seleccionarEntreOpciones( modelValue.value.value )//newValue as ILabelValue
  }

  function limpiar( cosa :any )
  {
    modelo.value          = { value: null, label: ""  }
    emit('clear')
  }

  function filterFn ( busqueda : any, update : Function, abort : Function  )
  {    
    if (busqueda              === "")
    {
      update(copiarOptionsToOpciones)
      return
    }
    else
    if (busqueda.length       < 3)
    {
      abort()
      return
    }
    update(() => {
      const labelMin          = busqueda.toLowerCase()
      opciones.value          = options.value.filter( v => v.label.toLowerCase().indexOf( labelMin ) > -1)
    })
  }



</script>