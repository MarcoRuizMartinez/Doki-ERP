<template>
  <tr>
    <td>
      <template v-if="!!titulo">
        {{titulo}}:
      </template>
    </td>
    <td :class="[ $attrs.class, classLabel ]" :style="[ $attrs.style, styleLabel ]">
      <campo-copiar
        v-if    ="copiar"
        :dato   ="label"
      />
      <template v-else>
        {{ label }}
      </template>
    </td>
  </tr>
</template>
<script lang="ts" setup>
  import    campoCopiar       from "components/utilidades/CampoCopiar.vue" 

  const props               = defineProps({
    titulo:     { default:  "",     type: String },
    label:      { required: true,   type: [String, Number] },
    copiar:     { default:  false,  type: Boolean },
    classLabel: { default:  "",     type: String },
    styleLabel: { default:  "",     type: String },
  })
</script>