<template>
  <div class    ="row items-center justify-center full-height alto-40">
    <div
      v-text    ="proveedor.alias"
      class     ="text-white text-center radius-10 op90 width90 badge-pro"
      :style    ="estilo"
      >
    </div>
  </div>
</template>
<script setup lang="ts">
  import {  ref,
            onMounted,
            computed        } from "vue"
  import {  IProveedor,
            Proveedor       } from "src/models/Diccionarios/Proveedor"            


  const proveedor   = ref< IProveedor >( new Proveedor() )            
  type TProps       = { params : any }
  const { params }  = defineProps<TProps>()
  
  onMounted(()=>{
    proveedor.value = Object.assign( new Proveedor(), params.value )
  })

  const estilo      = computed(()=>
  {
    const color     =   !proveedor.value.color || proveedor.value.color == "#FFF"
                      ? "#5c5c5c"
                      : proveedor.value.color
    const e         = `background-color: ${color};`
    return e
  })

</script>
<style>
.badge-pro{
  height: 20px;
  line-height: 1.6;
  font-size: 12px;
  font-weight: bold;
}
.alto-40{ 
  min-height: 40px !important;
}
</style>