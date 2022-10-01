<template>
  <q-select                     dense options-dense hide-bottom-space borderless
                                multiple 
    v-model                     ="modelo"
    class                       ="campo-hundido"
    popup-content-class         ="panel-blur"
    :options                    ="options"
    @popup-show                 ="abrir" 
    @popup-hide                 ="cerrar"
    >
    <template                   #selected>
      <span
        :class                  ="!!modelo.length ? 'text-primary' : 'text-grey-6'"
      >
        {{label}}
      </span>
      <Tooltip
        v-if                    ="!!modelo.length"
        :label                  ="modelo.map( (i) => i.label ).join(', ')"
      />
    </template>
    <template                   #option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind            ="itemProps">
        <q-item-section>
          <q-item-label v-html  ="opt.label" />
        </q-item-section>
        <q-item-section         side>
          <q-toggle             dense
            :model-value        ="selected"
            @update:model-value ="toggleOption(opt)"
          />
        </q-item-section>
      </q-item>
    </template>
    <template                   #prepend>
      <q-icon
        :name                   ="icon"
        :color                  ="!!modelo.length ? 'primary' : 'grey-6'"
      />
    </template>        
  </q-select>
</template>

<script setup lang="ts">
  import {  ref,
            watch,
            toRefs,
            PropType,
            onMounted
                            } from 'vue'
  import {  ILabelValue     } from "src/models/TiposVarios"

  const modelo                = ref< ILabelValue[] > ( [] )
  let   copiaModelo : string  = ""

  const emit                  = defineEmits(["update:modelValue"])
  const props                 = defineProps(
  {
    modelValue:   { required: true,   type: Array   as PropType< ILabelValue[] >  },
    options:      { required: true,   type: Array                                 },
    label:        { required: true,   type: String,                               },
    icon:         { default:  "",     type: String                                },
  })
  const { modelValue        } = toRefs( props )

  watch(modelValue, ()=>
    {
      modelo.value            = !!modelValue.value ? modelValue.value : []
    }
    ,{ immediate: true }
  )

  
  
  onMounted(()=>{

  })

  function abrir(){
    copiaModelo               = JSON.stringify(modelo.value)
  }

  function cerrar(){
    if( copiaModelo !== JSON.stringify(modelo.value) )
      update()
  }

  function update(){
    emit("update:modelValue", modelo.value)
  }
</script>