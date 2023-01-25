<template>
  <router-view />
</template>
<script setup lang="ts">

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  ORIGEN                } from "src/models/TiposVarios"
  import {  Permisos              } from "src/areas/usuarios/models/Permisos"
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useLogin              } from "src/services/useLogin"
  import {  useOnline             } from "src/useSimpleOk/useOnline"
  import {  useInciarApariencia   } from "src/useSimpleOk/useIniciarApariencia"
  //const { logueado }              = storeToRefs( useStoreUser() )
  useLogin( ORIGEN.APP )
  useOnline()
  useInciarApariencia()
</script>
