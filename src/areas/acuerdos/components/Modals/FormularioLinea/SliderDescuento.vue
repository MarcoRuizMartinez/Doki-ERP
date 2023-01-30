<template>
  <q-slider           label switch-label-side
    v-model           ="linea.descuentoX100"
    color             ="primary"
    class             ="q-px-lg"
    :marker-labels    ="marcas"
    :min              ="0"
    :max              ="linea.x100Maximo"
    :inner-min        ="0"
    :inner-max        ="linea.x100Maximo"    
    :label-value      ="'Nivel ' + linea.nivelPrecios.toString().toUpperCase()"    
  />
</template>
<script lang="ts" setup>
  import {  ref,
            watch,
            computed,
            toRefs,
            PropType              } from "vue"    
  import {  ILineaAcuerdo         } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  import {  roundInt              } from "src/useSimpleOk/useTools"

  const props               = defineProps({
    modelValue: { required: true,   type: Object as PropType< ILineaAcuerdo > },
    readonly:   { default:  false,  type: Boolean                             }
  })
  const { modelValue }      = toRefs(props)
  const linea               = ref<ILineaAcuerdo>(modelValue.value)  
/*   const emit                = defineEmits<{
    (e: 'update:modelValue',  value: ILineaAcuerdo ): void
  }>()  
 */
  const marcas              = computed(()=>{
    const niveles = Object.assign( linea.value.x100DescuentoNiveles, { })
    return {
              0                       : '0%',
              [niveles.alfa]          : 'Alfa',
              [niveles.a]             : 'A',
              [niveles.b]             : 'B',
              [niveles.c]             : 'C',
              [niveles.d]             : 'D',
              [niveles.e]             : 'E',
              [linea.value.x100Maximo]: { label: `${ roundInt(linea.value.x100Maximo, 0) }%` },
            }
  })
</script>