<template>
  <q-select                 dense options-dense use-input lazy-rules
                            hide-selected fill-input hide-bottom-space borderless 
    v-model                 ="model"
    input-debounce          ="0"
    class                   ="text-caption"
    :label                  =" !!alerta && !readonly ? label + ' *' : label"
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
      <q-icon               @click.stop
        name                ="mdi-map-marker"
        :color              ="!!model.id ? 'primary' : 'grey-6'"
      />
    </template>
    <Tooltip
      v-if                  ="!!tooltip"
      :label                ="tooltip"
    />
  </q-select>
</template>

<script setup lang="ts" inherit-attrs="true">
  //lazy-rules              ="ondemand"
  import {  ref,
            toRefs,
            watch,
            PropType
                            } from 'vue'
  import {  IMunicipio,
            Municipio
                            } from "src/models/Municipio"
  
  import { dexieMunicipios  } from "src/composables/useDexie"
  import {  storeToRefs     } from 'pinia'      
  import {  useStoreDexie   } from 'stores/dexieStore'
  const model                 = ref< IMunicipio >( new Municipio() )
  dexieMunicipios()
  const { municipios : lista }= storeToRefs( useStoreDexie() )
  const municipios            = ref< IMunicipio [] > ( lista.value as IMunicipio[] )

  const emit                  = defineEmits(["update:modelValue", "clear"])
  const props                 = defineProps({
    modelValue: { required: true,     type: Object as PropType < IMunicipio > },
    readonly:   { default:  false,    type: Boolean                           },
    hundido:    { default:  false,    type: Boolean                           },
    requerido:  { default:  false,    type: Boolean                           },
    tooltip:    { default:  "",       type: String                            },
    label:      { default:  "Ciudad", type: String                            },
    alerta:     { default:  false,    type: Boolean                           },
  })
  const { modelValue,
          requerido         } = toRefs( props )

  watch(modelValue, (newModel) => {
      model.value             = newModel as any
    },
    { immediate: true }
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

  function regla( municipio : IMunicipio ) : boolean | string
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