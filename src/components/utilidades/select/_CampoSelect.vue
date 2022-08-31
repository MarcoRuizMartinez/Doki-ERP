<template>
  <q-select                 map-options emit-value dense options-dense hide-bottom-space borderless
    ref                     ="miSelect"
    input-debounce          ="0" 
    :filled                 ="filled"
    :rounded                ="rounded"
    :outlined               ="outlined"
    :bg-color               ="bgColor"
    class                   ="text-caption"
    options-selected-class  ="text-weight-bold"
    v-model                 ="modelo"
    :autofocus              ="autofocus"
    :label                  ="label"
    :readonly               ="lectura"
    :disable                ="disable"
    :options                ="lista"
    :display-value          ="displayValueModelo"
    :option-label           ="optionLabel" 
    :option-value           ="optionValue"
    :multiple               ="multiple"
    :use-input              ="useInput"
    :fill-input             ="fillInput"
    @input                  ="cambiar"
    @filter                 ="filterFn"
    @remove                 ="remover"
    @add                    ="agregar"
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
      <q-icon name="mdi-filter" v-if="filtro"
      />
      <q-icon name="mdi-close" @click.stop="limpiarSeleccion" class="cursor-pointer"/>
    </template>
    <slot></slot>
  </q-select>
</template>

<script>
//     popup-content-class     ="text-capitalize"
export default {
  // lazy-rules        ="ondemand"
  //:rules            ="[ val => val !== null || 'Por favor seleccione una ciudad' ]"
  props: {
    value:        {                 required: true        },
    opciones:     { type: Array,    required: true        },
    lectura:      { type: Boolean,  default:  false       },
    disable:      { type: Boolean,  default:  false       },
    icon:         { type: String,   default:  ""          },
    label:        { type: String,   default:  undefined   },
    optionLabel:  { type: String,   default:  undefined   },
    optionValue:  { type: String,   default:  undefined   },
    multiple:     { type: Boolean,  default:  false       },
    filtro:       { type: Boolean,  default:  false       },  
    autofocus:    { type: Boolean,  default:  false       },
    rounded:      { type: Boolean,  default:  false       },
    outlined:     { type: Boolean,  default:  false       },
    filled:       { type: Boolean,  default:  false       },
    useInput:     { type: Boolean,  default:  false       },
    bgColor:      { type: String,   default:  undefined   },
    clearable:    { type: Boolean,  default:  false       },
    fillInput:    { type: Boolean,  default:  false       },
    displayValue: {                 default:  undefined   },
  },
  data () {
    return {
      modelo:             "",
      lista:              this.opciones,
      largo:              0,
      multidimencional:   false,
      displayValueModelo: this.displayValue
    }
  },
  watch:
  {
    value:
    {
      immediate: true,
      handler (modeloNew, modeloOld)
      {
        this.checkMultimedimencional()
        //console.log("modeloNew", this.label, modeloNew, "multiple", this.multiple, "multidimencional", this.multidimencional)

        if(this.multiple)
        {
          /*
          if(this.$refs.miSelect != undefined)
          {
            //this.$refs.miSelect._props.displayValue = this.label            
          }*/

          this.largo = modeloNew.length 
          //console.log("largo", this.largo)
          /*
          if(this.largo == 0)
          {
            
            
          }*/

          this.modelo = []

          for(let opcion of this.opciones)
          {
            //console.log(opcion[this.optionValue], modeloNew[this.optionValue])

            if( modeloNew.some( m => m == opcion[this.optionValue] ) ) 
            {
              //this.modelo     = opcion
              //console.log("opcion", opcion)
              this.modelo.push(opcion)
              
            }
          }
          //console.log("modelo final", this.modelo)
        }
        else  // si no es selección multiple
        {
          for(let opcion of this.opciones)
          {
            if
            (
              (
                this.multidimencional
                &&
                opcion[this.optionValue] == this.value
              )
              ||
              (
                !this.multidimencional
                &&
                opcion        == this.value
              )
            )
            {                
              this.modelo     = opcion
              break;
            }
            else if
            (
              modeloNew       == ""
              ||
              modeloNew       == null
              ||
              modeloNew       == undefined              
            )
            {
              this.modelo     = ""
            }
          }
        }
      },
    },
    opciones: {
      handler (nuevo, viejo)
      {
        this.checkMultimedimencional()
      },
      immediate: true
    },
    fillInput:{
      handler (nuevo, viejo)
      {
        this.displayValueModelo = nuevo ? "" : this.displayValue
        //console.log('%c⧭', 'color: #ffa280', "fillInput", nuevo, this.displayValueModelo)
      },
      immediate: true
    },
    displayValue: {
      handler (nuevo, viejo)
      {
        this.displayValueModelo = !!nuevo ? nuevo : ""
      },
      immediate: false
    },
  },
  methods:
  {
    remover( item )
    {  
      this.$emit('remove', item)
    },
    agregar( item )
    {
      this.$emit('add', item)
    },
    checkMultimedimencional()
    {
      this.multidimencional = typeof this.opciones[0] == "object" || typeof this.opciones[0] == Object ? true : false
      //console.log('%c⧭', 'color: #006dcc', "multidimencional", this.label, this.multidimencional)
    },

    cambiar(v)
    {
      //console.log("cambiar", v)
      //console.log("cambiar modelo", this.modelo)
      if(this.modelo     !== null)
      {
        if(this.multiple)
        {
          //console.log("largos", v.length, this.largo)
          if(v.length > this.largo) // Se selecciono una nueva opcion 
          {
            let nuevaOpcion = v[v.length-1]
            //console.log("nuevaOpcion", nuevaOpcion)
            this.modelo.pop()
            //console.log("pop", this.modelo)

            this.modelo.push( this.opciones.find( o => o[this.optionValue]  == nuevaOpcion ) )
            //console.log("push", this.modelo)

          }

          let enviar = this.modelo.map( m => m[this.optionValue] )
          //console.log("enviar", enviar)

          this.$emit('input', enviar)
        }
        else
        {
          this.$emit('input', this.modelo)
        }
      }  
    },

    filterFn (busqueda, update, abort)
    {
      if (busqueda === '')
      {
        update( () => { this.lista = this.opciones } )
        return
      }
      else
      if (busqueda.length < 3)
      {
        abort()
        return
      }

      update(() => 
      {
        const itemMinusculas  = busqueda.toLowerCase()
        if(this.multidimencional)
          this.lista            = this.opciones.filter(o => o[this.optionLabel].toLowerCase().indexOf(itemMinusculas) > -1)
        else
          this.lista            = this.opciones.filter(o => o.toLowerCase().indexOf(itemMinusculas) > -1)
      })   
        
    },


    limpiarSeleccion()
    {
      this.modelo    = this.multiple ? [] : ""
      this.cambiar()
      this.$emit("clear")
    }
  }

}
</script>