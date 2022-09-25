<template>
  <q-select                     dense options-dense hide-bottom-space borderless
                                multiple 
    v-model                     ="modelo"
    class                       ="campo-hundido"
    popup-content-class         ="panel-blur"    
    :display-value              ="label"
    :options                    ="options"
    @popup-show                 ="abrir" 
    @popup-hide                 ="cerrar"
    
    >
    <!-- 
    @update:model-value         ="cambio"
      emit-value  map-options 
    :class                      ="{ 'width60' : !label }"      
    option-value                ="name"
    :display-value              ="label"
    
    -->
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
      <Tooltip label            ="Seleccionar xxx"/>
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

  const emit                  = defineEmits(["update:modelValue"])
  const props                 = defineProps(
  {
    modelValue:   { required: true,   type: Array   as PropType< ILabelValue[] >  },
    options:      { required: true,   type: Array                                 },
    label:        { required: true,   type: String,                               },
    icon:         { default:  "",     type: String                                },
  })
  const { modelValue        } = toRefs( props )

  watch(modelValue, ()=>{
    modelo.value              = modelValue.value
  })

  const modelo                = ref< ILabelValue[] > ( [] )
  let   copiaModelo : string  = ""
  //onMounted() 

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