<template>
  <q-select                 dense options-dense use-input
                            hide-selected fill-input hide-bottom-space borderless 
    v-model                 ="model"
    label                   ="Ciudad"
    input-debounce          ="0"
    class                   ="text-caption"
    
    display-value           =""
    :filled                 ="!hundido"
    options-selected-class  ="text-weight-bold"
    :class                  ="{ 'campo-hundido' : hundido }"
    :rules                  ="[ regla ]"
    :options                ="municipios"
    :loading                ="lista.length == 0"
    :readonly               ="readonly"
    :clearable              ="!!model.value"
    @filter                 ="filterFn"
    @update:model-value     ="cambiarMunicipio"
    @clear                  ="limpiar"
    >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          No existe esa ciudad :(
        </q-item-section>
      </q-item>
    </template>
    <template #prepend>
      <q-icon name          ="mdi-map-marker" @click.stop />
    </template>
  </q-select>
</template>

<script setup lang="ts">
  //lazy-rules              ="ondemand"
  import {  ref,
            toRefs,
            watch,
            PropType
                            } from 'vue'
  import {  IMunicipio,
            Municipio
                            } from "src/models/Municipio"
  
  import { useDexie, TABLAS } from "src/services/useDexie"

  const model                 = ref< IMunicipio >( new Municipio() )
  const { lista }             = useDexie( TABLAS.MUNICIPIOS )
  const  municipios           = ref< IMunicipio [] > ( lista.value as IMunicipio[] )

  const emit                  = defineEmits(["update:modelValue", "clear"])
  const props                 = defineProps({
    modelValue: { required: true,   type: Object as PropType < IMunicipio > },
    readonly:   { default:  false,  type: Boolean                           },
    hundido:    { default:  false,  type: Boolean                           },
    requerido:  { default:  false,  type: Boolean                           },
  })
  const { modelValue,
          requerido         } = toRefs( props )

  watch(
    modelValue,
    (newModel, oldModel) => {
      model.value             = newModel as any
    },
    { immediate: true}
  )

  function cambiarMunicipio( municipio : IMunicipio )
  {
    emit("update:modelValue", municipio)
  }

  function limpiar( cosa : any )
  {
    cambiarMunicipio( new Municipio() ) 
    emit('clear')
  }

  function regla( municipio : IMunicipio )
  {
    return  ( (!!municipio && !!municipio.id) || !requerido.value )
            ||
            (  `El campo no puede estar vació` )
  }

  function filterFn ( busqueda : any, update : Function, abort : Function  )
  {    
    if (busqueda              === '')
    {
      update(() => {
        municipios.value      = lista.value
      })
      return
    }
    else
    if (busqueda.length       < 3)
    {
      abort()
      return
    }
    update(() => {
      const ciudadMin         = busqueda.toLowerCase()
      municipios.value        = lista.value.filter( v => v.label.toLowerCase().indexOf(ciudadMin) > -1)
    })
  }
    


</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  inheritAttrs: true,
})
</script>