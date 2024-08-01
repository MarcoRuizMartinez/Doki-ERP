<template>
  <q-tabs             dense no-caps inline-label
    v-model           ="tabs.activa"
    class             ="q-ma-none"
    >
    <q-tab
      label           ="Busqueda"
      name            ="tab_1"
      icon            ="mdi-magnify"
      :alert          ="alertTab1 ? 'red' : false"      
      >
    </q-tab>
    <q-tab
      label           ="Mas"
      name            ="tab_2"
      icon            ="mdi-magnify"
      :alert          ="alertTab2 ? 'red' : false"
      >
      <Tooltip label  ="Mas opciones búsqueda"/>
    </q-tab> 
    <q-tab
      label           ="Precios"
      name            ="tab_3"
      icon            ="mdi-currency-usd"
      :alert          ="alertTab3 ? 'red' : false"
      >
      <Tooltip label  ="Precios"/>
    </q-tab> 
    <q-tab
      v-if            ="!usuario.esComercial && !usuario.externo"
      label           ="Crear y Editar"
      name            ="tab_4"
      icon            ="mdi-clipboard-edit"
      >
      <Tooltip label  ="Opciones de edición"/>
    </q-tab>
    <q-tab
      v-if            ="!usuario.externo"
      label           ="Vistas"
      name            ="tab_5"
      icon            ="mdi-table-headers-eye"
      >
      <Tooltip label  ="Vistas de columnas"/>
    </q-tab>
  </q-tabs>
</template>


<script setup lang="ts">
  import  { computed,
            onMounted           } from "vue"
  import  { storeToRefs         } from 'pinia'                                            
  import  { useStoreApp         } from 'stores/app'
  import  { useStoreUser        } from 'stores/user'
  import {  useStoreProducto    } from 'stores/producto'  
  //import  { ToolDate, ToolType  } from "src/composables/useTools"  
  const { tabs                  } = storeToRefs( useStoreApp() )
  const { usuario               } = storeToRefs( useStoreUser() )
  const { busquedaPro : b       } = storeToRefs( useStoreProducto() )

  onMounted(()=> tabs.value = { activa : "tab_1", alerts: [ false, false, false, false ]} )

  const alertTab1 = computed(()=>       !!b.value.f.buscar
                                    ||  !!b.value.f.buscar1
                                    ||  !!b.value.f.l16.label
                                    ||  !!b.value.f.categorias.label
                                    ||  !!b.value.f.l1.label
                                    ||  !!b.value.f.l3.label
                                    ||  !!b.value.f.proveedores.label
                                    ||  !!b.value.f.activo.label
                                    ||  !!b.value.f.disponible.label
                                    ||  !!b.value.f.ntz.label
                                    ||  !!b.value.f.l15.label
                            )

  const alertTab2 = computed(()=>       !!b.value.f.und.label
                                    ||  !!b.value.f.l2.label
                                    ||  !!b.value.f.l17.label
                                    ||  !!b.value.f.l4.label
                                    ||  !!b.value.f.l5.label
                                    ||  !!b.value.f.desde
                                    ||  !!b.value.f.hasta
                                    ||  !!b.value.f.desde2
                                    ||  !!b.value.f.hasta2
                                    ||  !!b.value.f.creador?.nombre
                                    ||  !!b.value.f.usuario?.nombre
                                    ||  !!b.value.f.l6.label
                                    ||  !!b.value.f.l7.label
                                    ||  !!b.value.f.l8.label
                            )
                            
  const alertTab3 = computed(()=>       !!b.value.f.valorMax
                                    ||  !!b.value.f.valorMin
                                    ||  !!b.value.f.max1
                                    ||  !!b.value.f.min1
                                    ||  !!b.value.f.max2
                                    ||  !!b.value.f.min2
                                    ||  !!b.value.f.max3
                                    ||  !!b.value.f.min3
                                    ||  !!b.value.f.max4
                                    ||  !!b.value.f.min4
                                    ||  !!b.value.f.max5
                                    ||  !!b.value.f.min5
                                    ||  !!b.value.f.max6
                                    ||  !!b.value.f.min6
                                    ||  !!b.value.f.l11.label
                                    ||  !!b.value.f.l12.label
                                    ||  !!b.value.f.l13.label
                                    ||  !!b.value.f.l14.label
                                    ||  !!b.value.f.l9.label
                            )
</script>