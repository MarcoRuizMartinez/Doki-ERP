<template>
  <q-btn                  no-caps
    v-bind                ="estilo"
    :icon                 ="toogle ? iconTrue   : iconFalse"
    :color                ="toogle ? colorTrue  : colorFalse"
    @click                ="click"
    > 
    <template v-if="hayLabel">
      {{ toogle ? labelTrue : labelFalse }}
    </template>
    <Tooltip :label       ="toogle ? msjTrue : msjFalse"/>
  </q-btn>  
</template>
<script lang="ts" setup>
  import {  computed        } from "vue";
  import {  style           } from "src/composables/useEstilos"

  type TProps = {
    iconTrue    : string
    iconFalse   : string
    msjTrue     : string
    msjFalse    : string
    labelTrue  ?: string
    labelFalse ?: string
    colorTrue  ?: string
    colorFalse ?: string    
    size       ?: "sm" | "md"
  }
  const { size        = "sm",
          colorTrue   = "",
          colorFalse  = "",
          labelFalse  = "",
          labelTrue   = "",
                      } = defineProps<TProps>()
  const toogle          = defineModel<boolean>( { required: true } )
  const hayLabel        = computed(()=> !!labelTrue && !!labelFalse)
  const estilo          = computed(()=>   hayLabel.value
                                        ? size == 'sm'
                                            ? style.btnBaseSm
                                            : style.btnBaseMd
                                        : size == 'sm'
                                          ? style.btnRedondoFlat2Sm
                                          : style.btnRedondoFlat2Md
                                  )

  type TEmits = {
    click : [ value : boolean ]
  }
  const emit            = defineEmits<TEmits>()

  function click()
  {
    toogle.value        = !toogle.value
    emit('click', toogle.value)
  }
</script>