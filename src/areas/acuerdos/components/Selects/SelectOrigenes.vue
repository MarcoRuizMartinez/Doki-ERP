<template>
  <multi-label-value
    v-model               ="modelo"
    label                 ="Origen"
    icon                  ="mdi-source-branch"
    :options              ="lista"
  />
</template>
<script lang="ts" setup>
  import {  
            onMounted,
            toRefs,
            computed,
            PropType,       
                                  } from "vue"
  import    multiLabelValue         from "components/utilidades/select/SelectLabelValueMulti.vue"  
  import {  dexieOrigenesContacto } from "src/services/useDexie"
  import {  ILabelValue           } from "src/models/TiposVarios"  
            
  const props                 = defineProps({
    modelValue: { required: true,   type: Object as PropType< ILabelValue[] > },
  })

  const emit                  = defineEmits<{
    (e: "update:modelValue",  value:  ILabelValue[] ): void
  }>()

  onMounted(()=> console.log("asdfasdfsdf"))
  const { modelValue }        = toRefs( props )
  const lista                 = dexieOrigenesContacto()
  const listaOk               = computed(()=> !!lista.value.length )
  const modelo                = computed({
    get()       { return modelValue.value },
    set(value)  { emit("update:modelValue", value)},
  });

  defineExpose({  lista, listaOk })
</script>