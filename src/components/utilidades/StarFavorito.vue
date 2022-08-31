<template>
  <div  style           ="display: inline-flex; align-items: center;">
    <q-rating           no-dimming
      v-model           ="modelo"
      size              ="2em"
      color             ="brown-3"
      color-selected    ="amber-6"
      max               ="1"
      :readonly         ="readonly"
      >
      <template         #tip-1>
        <Tooltip
          v-if          ="tooltip.length > 1" 
          :label        ="tooltip"
        />        
      </template>
    </q-rating>
    <span>
      {{label}}
    </span>
  </div>    
</template>

<script setup lang="ts">  
  import {  computed,
            toRefs,
            watch
                        } from 'vue'
  const modelo          = computed({
                            get: ()     => +modelValue.value,
                            set: valor  =>
                            {
                              emit("update:modelValue", Boolean( valor ) )
                            }
                          })

  const emit            = defineEmits(["update:modelValue"])
  const props           = defineProps(
  {
    modelValue: { required: true,   type: Boolean },
    readonly:   { default:  false,  type: Boolean },
    tooltip:    { default:  "",     type: String  },
    label:      { default:  "",     type: String  },
  })

  const { modelValue,
          readonly }    = toRefs( props )
 
  watch(
    modelo,
    ( newValue, oldValue ) =>
    {
      emit("update:modelValue", newValue)
    }
  )

  watch(
    modelValue,
    ( newValue, oldValue ) =>
    {
      modelo.value      = +newValue
    }
  )
</script>