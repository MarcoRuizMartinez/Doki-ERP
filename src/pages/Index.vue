<template>
  <q-page                 padding
    class                 ="row item-stretch content-start justify-left q-col-gutter-lg">
    <buscar-terceros
      v-if                ="storeUser.permisos.terceros_ver"
      class               ="col-md-4 col-12"
      height-card         ="202px"
      size-icon-carga     ="8em"
    />
    <terceros-favoritos
      class               ="col-md-4 col-12"
      height-card         ="260px"
      size-icon-carga     ="12em"
      />
    <mis-terceros
      class               ="col-md-4 col-12"
      height-card         ="260px"
      size-icon-carga     ="12em"
      />
    <modulo-usuarios
      v-if                ="storeUser.usuario.esDev"
      class               ="col-md-4 col-12"
      height-card         ="260px"
      :usuarios           ="usuarios"
    />
  </q-page>
</template>

<script setup lang="ts">
  import    buscarTerceros        from "src/areas/terceros/components/modules/ModuloBuscarTercerosMini.vue"
  import    tercerosFavoritos     from "src/areas/terceros/components/modules/ModuloTercerosFavoritos.vue"
  import    misTerceros           from "src/areas/terceros/components/modules/ModuloMisTerceros.vue"
  import {  useTitle            } from "@vueuse/core"
  import    moduloUsuarios        from "src/areas/usuarios/components/ModuloUsuarios.vue"
  import {  useDexie,
            TABLAS,
            checkListasVencidas } from "src/services/useDexie"
  import {  useStoreUser        } from 'src/stores/user'  
  import {  ref,  
            provide
                                } from 'vue'
  
  const storeUser                 = useStoreUser()
  const minimizadoTodo            = ref< boolean >(false)
  const title                     = useTitle("🏠 Inicio Grupo Escom")
  

  provide('superminimizado', minimizadoTodo)

  const { lista : usuarios      } = useDexie( TABLAS.USUARIOS,    { cargarSiempre : true } )
  const { lista : constantes    } = useDexie( TABLAS.CONSTANTE,   { cargarSiempre : true } )

  let check = checkListasVencidas()
  //console.log("check", check)
  if(check)
  {
    let param                     = { demora: 5_000, cargarSiempre : true }
    useDexie( TABLAS.CONDICION_PAGO,    param )
    useDexie( TABLAS.FORMA_PAGO,        param )
    useDexie( TABLAS.METODO_ENTREGA,    param )
    useDexie( TABLAS.ORIGEN_CONTACTO,   param )
    useDexie( TABLAS.UNIDAD,            param )
    useDexie( TABLAS.TIPOS_DOCUMENTOS,  param )
    useDexie( TABLAS.MUNICIPIOS,        param )
    useDexie( TABLAS.TIEMPO_ENTREGA,    param )
    useDexie( TABLAS.TIPO_CONTACTO,     param )
  }

</script>