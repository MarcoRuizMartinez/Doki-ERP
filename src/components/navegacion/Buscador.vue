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
    OC_PROVEEDOR    = "Ordenes proveedores",
    PRODUCTOS       = "Productos",
  }

  const router      = useRouter()
  const busquedas   = [ BUSQUEDAS.PEDIDOS, BUSQUEDAS.COTIZACIONES, BUSQUEDAS.OC_PROVEEDOR, BUSQUEDAS.PRODUCTOS ]
  const modelo      = ref<string>("")
  let busqueda      = ""

  function input( text : string ){
    busqueda        = !!text ? text : busqueda
  }

  function buscar( tipo : string )
  {
    let patch       =   tipo  === BUSQUEDAS.PEDIDOS       ? "/pedidos?tercero="
                      : tipo  === BUSQUEDAS.COTIZACIONES  ? "/cotizaciones?tercero="
                      : tipo  === BUSQUEDAS.OC_PROVEEDOR  ? "/pedidos-proveedor?tercero="
                      : tipo  === BUSQUEDAS.PRODUCTOS     ? "/productos?busqueda="
                      : ""
    if(!patch) return

    patch           += busqueda
    router.push(patch)
    modelo.value    = ""
    busqueda        = ""
  }
</script>