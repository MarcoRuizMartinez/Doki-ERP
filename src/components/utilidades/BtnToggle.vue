<template>
  <q-btn                  no-caps
    v-bind                ="estilo"
    :icon                 ="toogle ? iconTrue   : iconFalse"
    :color                ="toogle ? colorTrue  : colorFalse"
    @click                ="()=> { if(!conConfirmar) click() }"
    > 
    <template v-if="hayLabel">
      {{ toogle ? labelTrue : labelFalse }}
    </template>
    <Tooltip v-html       ="toogle ? msjTrue : msjFalse"/>
    <confirmar
      v-if                ="conConfirmar"
      @ok                 ="click"
    />
  </q-btn>
</template>
<script lang="ts" setup>
  import {  computed        } from "vue";
  import {  style           } from "src/composables/useEstilos"
  import    confirmar       from "components/utilidades/MenuConfirmar.vue"

  type TProps = {
    iconTrue       : string
    iconFalse      : string
    msjTrue        : string
    msjFalse       : string
    labelTrue     ?: string
    labelFalse    ?: string
    colorTrue     ?: string
    colorFalse    ?: string
    conConfirmar  ?: boolean
    size          ?: "sm" | "md"
  }
  const { size          = "sm",
          colorTrue     = "",
          colorFalse    = "",
          labelFalse    = "",
          labelTrue     = "",
          conConfirmar  = false,
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