<template>
  <q-select                     dense options-dense hide-bottom-space borderless
                                multiple emit-value map-options 
    v-model                     ="modelo"
    option-value                ="name"
    class                       ="campo-hundido"
    popup-content-class         ="panel-blur"
    :class                      ="{ 'width60' : !label }"
    :display-value              ="label"
    :options                    ="options"
    @update:model-value          ="update"
    >
    <template #option     ="{ itemProps, opt, selected, toggleOption }">
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
    <template #prepend>
      <q-icon name              ="mdi-table-column-plus-after" />
      <Tooltip label            ="Seleccionar columnas"/>
    </template>        
  </q-select>
</template>

<script setup lang="ts">
  import {  LocalStorage    } from 'quasar'
  import {  ref,
            toRefs,
            PropType,
            onMounted
                            } from 'vue'

  const pre                   = process.env.PREFIJO
  const emit                  = defineEmits(["update:modelValue"])
  const props                 = defineProps(
  {
    modelValue:   { required: true,   type: Array   as PropType< string[] >       },
    options:      { required: true,   type: Array     },
    label:        { default:  "",     type: String                                },
    almacen:      { required: true,   type: String                                },
  })
  const { modelValue,
          almacen         }   = toRefs( props )

  const modelo                = ref< string[] > ( modelValue.value )

  onMounted( cargarColumnasLocal ) 

  function cargarColumnasLocal()
  {
    let  columnas             = LocalStorage.getItem( pre + almacen.value) as string[]
    
    if(!!columnas)
    {
      modelo.value            = columnas
      emit("update:modelValue", modelo.value)
    }
  }

  function update()
  {
    LocalStorage.set(pre + almacen.value,  modelo.value)
    emit("update:modelValue", modelo.value)
  }
</script>