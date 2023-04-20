<template>
  <div class                        ="row">    
    <div v-if                       ="modo === 'center'">
      <q-btn
        v-bind                      ="estiloBotones('abajo')"
        v-touch-repeat:0:200.mouse  ="restar"
        :disable                    ="disableResta || readonly"
      />
    </div>
    <q-input                        dense hide-bottom-space
      v-model.number                ="model"
      style                         ="order: 2; min-width: 50px;"
      type                          ="number"
      class                         ="text-1_2em text-center col transi"
      input-class                   ="fuente-mono"
      :debounce                     ="debounce"
      :class                        ="{ 'campo-hundido' : hundido }"
      :filled                       ="!hundido"
      :borderless                   ="!hundido"
      :label                        =" !!alerta && !readonly ? label + ' *' : label"
      :suffix                       ="porcentaje ? '%' : undefined"
      :readonly                     ="readonly"
      @keyup.enter                  ="emit('enter')"
    />
    <div
      v-if                          ="modo !== 'center'"
      class                         ="column"
      :class                        ="{'ml--6' : hundido}"
      :style                        ="'order: ' + (modo == 'left' ? 1 : 3 ) + ';'"
      >
      <q-btn
        v-bind                      ="estiloBotones('arriba')"
        v-touch-repeat:0:200.mouse  ="sumar"
        :disable                    ="disableSuma || readonly"
      />
      <q-btn
        v-bind                      ="estiloBotones('abajo')"
        v-touch-repeat:0:200.mouse  ="restar"
        :disable                    ="disableResta  || readonly"
      />
    </div>
    <div
      v-if                          ="modo === 'center'"
      style                         ="order: 3;"
      >
      <q-btn
        v-bind                      ="estiloBotones('arriba')"
        v-touch-repeat:0:200.mouse  ="sumar"
        :disable                    ="disableSuma || readonly"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
/*
conDecimales
*/
  import {  PropType,
            toRefs,
            watch,
            computed
                              } from "vue"
  import {  useClamp          } from "@vueuse/math"
  import {  btnNumeroPaso     } from "src/useSimpleOk/useEstilos"
  

  const emit                  = defineEmits(["update:model-value", "enter"])
  const props                 = defineProps({
    modelValue: { required: true,         type: Number },
    label:      { default:  undefined,    type: String },
    maximo:     { default:  1000000,      type: Number },
    minimo:     { default:  1,            type: Number },
    paso:       { default:  1,            type: Number },
    porcentaje: { default:  false,        type: Boolean},
    hundido:    { default:  false,        type: Boolean},
    readonly:   { default:  false,        type: Boolean},
    alerta:     { default:  false,        type: Boolean},
    debounce:   { default:  100,          type: [String, Number]    },
    iconos:     { default:  "suma",       type: String as PropType< "suma"  | "flecha" >            },
    colores:    { default:  "verde-rojo", type: String as PropType< "gris"  | "verde-rojo" >        },
    modo:       { default:  "center",     type: String as PropType< "right" | "left" | "center" >   },
  })

  const { modelValue,
          iconos,
          colores,
          modo,
          maximo,
          minimo,
          paso
                            } = toRefs( props )
  const model                 = useClamp(modelValue.value, minimo.value, maximo.value)

  watch( modelValue, (newValor)=>{
    if( isNaN(newValor) )
      newValor                = 0
    model.value               = newValor
  })

  const disableSuma           = computed(()=> model.value + paso.value > maximo.value )
  const disableResta          = computed(()=> model.value - paso.value < minimo.value )

  function sumar() {
    model.value               = +Number( model.value + paso.value ).toFixed(2)    
  }

  function restar() {
    model.value               = +Number( model.value - paso.value ).toFixed(2)    
  }

  watch( model, ( newModel )=>{
    emit("update:model-value", newModel)
  })


  function estiloBotones( tipo : "arriba" | "abajo" ) : Object{
    return btnNumeroPaso( tipo, colores.value, iconos.value, modo.value )
  }
</script>
<style>
.text-center input{
  text-align: center;
}
</style>
<style>

.ml--6{
  margin-left: -6px;
}
</style>