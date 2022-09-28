<template>
  <q-chip             dense
    color             ="primary"
    text-color        ="white"
    >
    <q-avatar
      text-color      ="white">
    <img :src         ="usuario.fotoPerfilMini">
    </q-avatar>
    {{usuario.nombre}} 
  </q-chip>
</template>
<script setup lang="ts">
  import {  PropType      } from "vue"  
  import {  IUsuario      } from "src/areas/usuarios/models/Usuario"

  const props = defineProps({
    usuario:  { required: true, type: Object as PropType<IUsuario> }
  })
</script>