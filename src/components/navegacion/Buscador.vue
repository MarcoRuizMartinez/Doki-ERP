<template>
  <q-select             use-input dense options-dense hide-dropdown-icon hide-selected
    v-model             ="modelo"
    class               ="campo-hundido"
    label               ="Buscar"
    style               ="width: 250px"
    :options            ="busquedas"
    @input-value        ="input"
    @update:model-value ="buscar"
    >
    <template           #prepend>
      <q-icon
        name            ="mdi-magnify"
        color           ="grey-6"
      />
    </template>
  </q-select>
</template>
<script setup lang="ts">
  import {  ref       } from "vue"
  import {  useRouter } from "vue-router"
  enum BUSQUEDAS
  {
    TERCEROS        = "Terceros",
    PEDIDOS         = "Pedidos",
    COTIZACIONES    = "Cotizaciones",
    PEDIDO_PRO      = "Ordenes proveedores",
    PRODUCTOS       = "Productos",
  }

  const router      = useRouter()
  const busquedas   = [ BUSQUEDAS.TERCEROS, BUSQUEDAS.PEDIDOS, BUSQUEDAS.COTIZACIONES, BUSQUEDAS.PEDIDO_PRO, BUSQUEDAS.PRODUCTOS ]
  const modelo      = ref<string>("")
  let busqueda      = ""

  function input( text : string ){
    busqueda        = !!text ? text : busqueda
  }

  function buscar( tipo : string )
  {
    let patch       =   tipo  === BUSQUEDAS.TERCEROS      ? "/terceros?buscar=" 
                      : tipo  === BUSQUEDAS.PEDIDOS       ? "/pedidos?buscar=" 
                      : tipo  === BUSQUEDAS.COTIZACIONES  ? "/cotizaciones?buscar="
                      : tipo  === BUSQUEDAS.PEDIDO_PRO    ? "/pedidos-proveedor?buscar="
                      : tipo  === BUSQUEDAS.PRODUCTOS     ? "/productos?busqueda="
                      : ""
    if(!patch) return

    patch           += busqueda
    router.push(patch)
    modelo.value    = ""
    busqueda        = ""
  }
</script>