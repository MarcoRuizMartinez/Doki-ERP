<template>
  <q-page                 padding
    class                 ="row item-stretch content-start justify-start q-col-gutter-lg">
    <titulo
      label               ="Gestión Comercial"
      color               ="#114000"
      img                 ="iconoCotizacion.webp"
      icono               ="mdi-account-supervisor-circle-outline"
    />
    <menu-enlaces palabra =""
    />
  </q-page>
</template>

<script setup lang="ts">
  import {  useTitle                } from "@vueuse/core"
  import    titulo                    from "components/navegacion/PortadasTitulo.vue"
  import    menuEnlaces               from "components/navegacion/PortadasMenu.vue"
  useTitle("🧑🏽‍💻 Comercial")
</script>
A facturar
Anticipos a verificar
Comisiones Johana
Comisiones Ximena
Comisiones Luisa
Comisiones Valentina
Comisiones Gilberto

Pedidos Mublex sin OC a proveedor
Pedidos Escom sin OC a proveedor
Pedidos solicitando autorización
Pedidos Mublex Pendientes
Pedidos Escom pendientes