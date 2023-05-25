<template>
  <q-page                 padding
    class                 ="row item-stretch content-start justify-start q-col-gutter-lg">
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
    <!-- <modulo-enlaces
      class               ="col-md-4 col-12"
    /> -->
    <template v-if        ="storeUser.usuario.esDev">
      <modulo-usuarios            class="col-md-4 col-12" height-card="260px"/>      
      <modulo-bodegas             class="col-md-4 col-12" height-card="260px"/>
      <modulo-reglas-comision     class="col-md-4 col-12" height-card="260px"/>
      <modulo-proveedores         class="col-md-4 col-12" height-card="260px"/>
      <modulo-municipios          class="col-md-4 col-12" height-card="260px"/>
      <modulo-condiciones         class="col-md-4 col-12" height-card="260px"/>
      <modulo-formas-pago         class="col-md-4 col-12" height-card="260px"/>
      <modulo-metodos-entrega     class="col-md-4 col-12" height-card="260px"/>
      <modulo-tiempos-entrega     class="col-md-4 col-12" height-card="260px"/>
      <modulo-tipos-contacto      class="col-md-4 col-12" height-card="260px"/>
      <modulo-origenes-contacto   class="col-md-4 col-12" height-card="260px"/>
      <modulo-tipos-documentos    class="col-md-4 col-12" height-card="260px"/>
      <modulo-unidades            class="col-md-4 col-12" height-card="260px"/>
      <modulo-categorias-producto class="col-md-4 col-12" height-card="260px"/>
      <modulo-constantes          class="col-md-4 col-12" height-card="260px"/>
      <modulo-cuentas-dinero      class="col-md-4 col-12" height-card="260px"/>
    </template>
  </q-page>
</template>

<script setup lang="ts">
  import {  ref,  provide           } from 'vue'
  import {  useStoreUser            } from 'src/stores/user'
  import    buscarTerceros            from "src/areas/terceros/components/modules/ModuloBuscarTercerosMini.vue"
  import    tercerosFavoritos         from "src/areas/terceros/components/modules/ModuloTercerosFavoritos.vue"
  import    misTerceros               from "src/areas/terceros/components/modules/ModuloMisTerceros.vue"
  import {  useTitle                } from "@vueuse/core"

  //import    moduloEnlaces             from "src/areas/sistemas/components/ModuloLinks.vue"
  import    moduloUsuarios            from "src/areas/sistemas/components/ModuloUsuarios.vue"
  import    moduloProveedores         from "src/areas/sistemas/components/ModuloProveedores.vue"
  import    moduloMunicipios          from "src/areas/sistemas/components/ModuloMunicipios.vue"
  import    moduloCondiciones         from "src/areas/sistemas/components/ModuloCondicionesPago.vue"
  import    moduloFormasPago          from "src/areas/sistemas/components/ModuloFormasPago.vue"
  import    moduloMetodosEntrega      from "src/areas/sistemas/components/ModuloMetodosEntrega.vue"
  import    moduloTiemposEntrega      from "src/areas/sistemas/components/ModuloTiemposEntrega.vue"
  import    moduloTiposContacto       from "src/areas/sistemas/components/ModuloTiposContacto.vue"
  import    moduloOrigenesContacto    from "src/areas/sistemas/components/ModuloOrigenesContacto.vue"
  import    moduloTiposDocumentos     from "src/areas/sistemas/components/ModuloTiposDocumentos.vue"
  import    moduloUnidades            from "src/areas/sistemas/components/ModuloUnidades.vue"
  import    moduloCategoriasProducto  from "src/areas/sistemas/components/ModuloCategoriasProducto.vue"
  import    moduloConstantes          from "src/areas/sistemas/components/ModuloConstantes.vue"
  import    moduloCuentasDinero       from "src/areas/sistemas/components/ModuloCuentasDinero.vue"
  import    moduloReglasComision      from "src/areas/sistemas/components/ModuloReglasComision.vue"
  import    moduloBodegas             from "src/areas/sistemas/components/ModuloBodegas.vue"

  import {  cargarListasIndex       } from "src/services/useDexie"

  const storeUser                 = useStoreUser()
  const minimizadoTodo            = ref< boolean >(false)
  useTitle("🏠 Inicio Grupo Escom")
  provide('superminimizado', minimizadoTodo)
  cargarListasIndex()
</script>
