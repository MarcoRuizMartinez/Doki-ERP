<template>
  <router-view />
</template>
<script setup lang="ts">

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  ORIGEN                } from "src/models/TiposVarios"
  import {  Permisos              } from "src/areas/usuarios/models/Permisos"
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useLogin              } from "src/composables/useLogin"
  import {  useOnline             } from "src/composables/useOnline"
  import {  useInciarApariencia   } from "src/composables/useIniciarApariencia"
  //const { logueado }              = storeToRefs( useStoreUser() )
  useLogin( ORIGEN.APP )
  useOnline()
  useInciarApariencia()
</script>
