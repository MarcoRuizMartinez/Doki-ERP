<template>
  <TransitionGroup
    mode                  ="out-in"
    :enter-active-class   ="'animated fadeIn'   + fxIn"
    :leave-active-class   ="'animated fadeOut'  + fxOut"
    >  
    <slot></slot>
  </TransitionGroup>
</template>
<script lang="ts" setup>
  import { ref, toRefs, PropType, onMounted } from "vue"

  type tipoFx           = "" | "Left" | "Up" | "Right" | "Down"
  type efectMix         = tipoFx | "UpDown" | "DownUp"
  
  const fxIn            = ref<string>("")
  const fxOut           = ref<string>("")
  const props           = defineProps({
    efecto:             { default: "", type: String as PropType<efectMix> },
    entrada:            { default: "", type: String as PropType<tipoFx>   },
    salida:             { default: "", type: String as PropType<tipoFx>   }
  })
  const { efecto,
          entrada,
          salida  }     = toRefs(props)

  onMounted(()=>{
    if(!!efecto.value)
    {
      if(efecto.value   === "UpDown")
      {
        fxIn.value      = "Up"
        fxOut.value     = "Down"
      }
      else
      if(efecto.value   === "DownUp")
      {
        fxIn.value      = "Down"
        fxOut.value     = "Up"
      }
      else
      {
        fxIn.value      = efecto.value
        fxOut.value     = efecto.value
      }
    }
    else
    {
      fxIn.value    = entrada.value
      fxOut.value   = salida.value
    }
  })
  /*

      animations: [ 'fadeIn',   'fadeInUp',   'fadeInLeft',   'fadeInRight',  'fadeInDown',   'backInUp',
                  'fadeOut',  'fadeOutUp',  'fadeOutLeft',  'fadeOutRight', 'fadeOutDown',  'backInDown',
                ],

  */
</script>