<template>
  <efecto efecto          ="Left">
    <div v-if             ="!largo">Productos</div>
    <div v-else>
      <q-btn                dense no-caps
        icon                ="mdi-playlist-edit"
        color               ="positive"
        size                ="14px"
        label               ="Editar"
        :loading            ="loading.editarLote"
        @click              ="emit('clickEditar')"
        >
      </q-btn>
      <q-btn                dense no-caps
        class               ="q-ml-sm"
        icon                ="mdi-trash-can"
        color               ="negative"
        size                ="14px"
        label               ="Borrar"
        :loading            ="loading.borrarLote"
        >
        <confirmar  @ok     ="emit('clickBorrar')" />
      </q-btn>
    </div>
  </efecto>
</template>
<script lang="ts" setup>
  // * //////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs     } from 'pinia'  
  import {  useStoreAcuerdo } from 'src/stores/acuerdo'  
  // * //////////////////////////////////////////////////////////////////////////////// Componentes
  import    efecto            from "components/utilidades/Efecto.vue"
  import    confirmar         from "components/utilidades/MenuConfirmar.vue"

  const storeAcuerdo          = useStoreAcuerdo()
  const { loading           } = storeToRefs(storeAcuerdo)    
  const props                 = defineProps({
    largo: { required: true,   type: Number  },
  })
  const emit = defineEmits<{
    (e: 'clickEditar',    value: void ): void
    (e: 'clickBorrar',    value: void ): void
  }>()
</script>