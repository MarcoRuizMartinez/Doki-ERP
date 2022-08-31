<template>
  <router-view />
</template>
<script setup lang="ts">
  import {  useInciarApariencia     }   from "src/useSimpleOk/useIniciarApariencia"
  import {  useLogin                }   from "src/services/useLogin"
  import {  useOnline               }   from "src/useSimpleOk/useOnline"
  import {  ORIGEN                  }   from "src/models/TiposVarios"
  import {  Permisos                }   from "src/areas/usuarios/models/Permisos"

  useLogin( ORIGEN.APP )
  useOnline()
  useInciarApariencia()
  console.log("Hola")
</script>
