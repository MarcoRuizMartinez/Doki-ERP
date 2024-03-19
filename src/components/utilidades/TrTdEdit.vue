<template>
  <tr>
    <!-- //?* //////////////////////////////////////////////////////////// Titulo -->
    <td class           ="text-bold">
      {{titulo}}:
    </td>
    <!-- //?* //////////////////////////////////////////////////////////// Icono lapiz -->
    <td
      v-if              ="editar"
      class             ="width20"
      >
      <q-icon
        name            ="mdi-lead-pencil"
        class           ="q-mr-sm"
        color           ="grey-6"
      />
    </td>
    <td v-else></td>
    <!-- //?* //////////////////////////////////////////////////////////// Valor Poput Edit -->
    <td>
      <template v-if    ="precio">
        {{ Format.precio( valor, "decimales-no" ) }}
      </template>
      <template v-else>
        {{valor}}
      </template>
      <q-popup-edit     auto-save
        v-if            ="editar"
        v-model         ="valor"
        v-slot          ="scope"
        label-set       ="Editar"
        @save           ="emit('save', valor)"
        >
        <q-input        dense autofocus
          v-model       ="scope.value"
          @keyup.enter  ="scope.set"
        />
      </q-popup-edit>
    </td>
  </tr>
</template>
<script lang="ts" setup>
  import {  Format          } from "src/composables/useTools" 

  type TProps               = {
    titulo                  : string
    editar                 ?: boolean
    precio                 ?: boolean
  }
  const { editar = false,
          precio = false
                            } = defineProps<TProps>()

  type TEmit                = {
    save                    : [ value: string | number]
  }
  const emit                = defineEmits<TEmit>()
  
  const valor               = defineModel<string | number>( { required: true } )
  

</script>