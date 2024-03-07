<template>
  <div>
    <q-select                 dense options-dense hide-bottom-space borderless
      v-model                 ="modelo"
      :error                  ="error"
      :error-message          ="errorMessage"
      options-selected-class  ="text-weight-bold"
      class                   ="text-caption selector"
      popup-content-class     ="panel-blur"
      lazy-rules              ="ondemand"
      :rules                  ="[ ...rules, regla ]"
      :label                  ="label"
      :label-color            ="!!modelo && !!modelo.label ? 'primary' : 'grey-6'"
      :class                  ="{ 'campo-hundido' : hundido }"
      :filled                 ="!hundido && !noFilled"
      :options                ="opciones"
      :clearable              ="clearable && !!modelValue && !!modelo && !!modelo.label"
      :loading                ="(options.length == 0 || loading) && !noLoading"
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
        <q-icon
          :name               ="icon"
          :color              ="!!modelo && !!modelo.label ? 'primary' : 'grey-6'"
        />
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
            watch,
            PropType,
            onMounted,
                            } from 'vue'
  import {  Tool,
            ToolArray,
            ToolType     } from "src/composables/useTools"                            
  import {  ILabelValue,
            labelValueNulo  } from "src/models/TiposVarios"
  import {  ValidationRule  } from "quasar"

  
  const emit                  = defineEmits(["update:modelValue", "clear", "select"])
  
  /* const emit                  = defineEmits<{
    (e: 'update:modelValue',  value: ILabelValue | undefined ): void
    (e: 'select',             value: ILabelValue             ): void
    (e: 'clear',              value: void                    ): void
  }>() */
  
  
  
  const props                 = defineProps(
  {
    modelValue:   { default: labelValueNulo,  type: Object   as PropType<ILabelValue>   },
    alerta:       { default:  false,          type: [Boolean, String  ]                 },
    label:        { default: undefined,              type: String,                             },
    readonly:     { default: false,           type: Boolean                             },
    useInput:     { default: false,           type: Boolean                             },
    hundido:      { default: false,           type: Boolean                             },
    error:        { default: false,           type: Boolean                             },
    errorMessage: { default: "Valor invalido",type: String                              },    
    icon:         { default: "",              type: String                              },
    options:      { required: true,           type: Array   as PropType<ILabelValue[]>  },
    clearable:    { default: false,           type: Boolean                             },
    loading:      { default: false,           type: Boolean                             },
    noLoading:    { default: false,           type: Boolean                             },
    defecto:      { default: "",              type: String,                             },
    optionsSort:  { default: "",              type: String                              },
    noFilled:     { default: false,           type: Boolean                             },
    behavior:     { default: "default",       type: String  as PropType< "default" | "menu" | "dialog" > },
    rules:        { default:  [],             type: Array  as PropType< ValidationRule[] > },
    //noInmediato:  { default: false,     type: Boolean                             },
  })
  const { modelValue,
          readonly,
          options,
          //noInmediato,
          defecto,
          optionsSort,
          alerta,
          label
                              } = toRefs( props )
  const opciones                = ref< ILabelValue[] > ( options.value )
  const modelo                  = ref< ILabelValue >( )
  if(!!modelValue.value.label){
    modelo.value = modelValue.value
  }
  //let   esVirgen                = true

  watch( options,   (n, o)=>
  {
    if(!!n.length && n.length === o.length) return
    copiarOptionsToOpciones()
    setDefecto()
  })

  onMounted(()=>{
    if(!!defecto.value)  setDefecto()
  })

  watch( modelValue, ( newValue )  =>
  {
    if(modeloYvModelSonIguales()) return
      
    if(!!newValue && ToolType.valorValido( newValue.value )){
      if(!!opciones.value.length){
        modelo.value            = seleccionarEntreOpciones( newValue.value )//newValue as ILabelValue
      }
      else {
        modelo.value            = newValue
      }
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
    if(!!newValue && ToolType.valorValido( newValue.value ) ){
      emit("update:modelValue", newValue)

    }
    else
      emit("update:modelValue", { value: null, label: ""  })
  })

  
  const modeloYvModelSonIguales = () :boolean => !!modelo.value && modelValue.value.value === modelo.value.value && modelValue.value.label === modelo.value.label

  function seleccionar()
  {
    if( ToolType.valorValido(modelo.value) )
      emit("select", modelo.value) 
    else
      emit("select", labelValueNulo)     
  }

  async function setDefecto()
  {
    await Tool.pausa(100)

    if(!options.value.length || !defecto.value || (!!modelValue.value && !!modelValue.value.value )) 
      return
    
    const opcionDefecto   = options.value.find( i => i.label == defecto.value)
    if(!!opcionDefecto){
      modelo.value        = opcionDefecto
    }
  }

  function seleccionarEntreOpciones( value : any ) : ILabelValue {
    const item = options.value.find( i => i.value == value) ?? { value: null, label : "" }
    return item
  }
      
  function copiarOptionsToOpciones()
  {
    opciones.value        = options.value

    if(!!optionsSort.value)
      opciones.value      = ToolArray.ordenar(opciones.value, optionsSort.value)

    if(!!modelValue.value.label && !!modelValue.value.value){
      modelo.value        = seleccionarEntreOpciones( modelValue.value.value )//newValue as ILabelValue

    }
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

  function regla( item : ILabelValue | undefined ) : boolean | string {    
    return  ( !!item || !alerta.value)
            ||
            ( typeof alerta.value == "string" ? alerta.value : `El campo '${label?.value ?? ""}' no puede estar vació` )
  }  
</script>
<style>
.selector span{
  min-width: max-content;
}
</style>