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
      <Tooltip label  ="Mas opciones"/>
    </q-tab>    
    <q-tab
      v-if            ="!usuario.esComercial && !usuario.externo"
      label           ="Crear y Editar"
      name            ="tab_3"
      icon            ="mdi-clipboard-edit"
      >
      <Tooltip label  ="Opciones de edición"/>
    </q-tab>
    <q-tab
      v-if            ="!usuario.externo"
      label           ="Vistas"
      name            ="tab_4"
      icon            ="mdi-table-headers-eye"
      >
      <Tooltip label  ="Vistas de columnas"/>
    </q-tab>
<!--
    <q-tab
      label           ="Fechas"
      name            ="tab_2"
      icon            ="mdi-calendar-month"
      :alert          ="alertTab2 ? 'red' : false"      
      >
    </q-tab>
 -->
<!--
    <q-tab
      label           ="Busquedas"
      name            ="tab_4"
      icon            ="mdi-magnify-scan"      
      >
      <Tooltip label  ="Búsquedas rápidas"/>
    </q-tab>
-->
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
                                    ||  !!b.value.f.proveedores.label
                                    ||  !!b.value.f.categorias.label
                                    ||  !!b.value.f.activo.label
                                    ||  !!b.value.f.disponible.label
                                    ||  !!b.value.f.tiposProProve.length
                                    ||  !!b.value.f.l1.label
                                    ||  !!b.value.f.buscar1
                                    ||  !!b.value.f.buscar2
                                    ||  !!b.value.f.buscar3
                                    ||  !!b.value.f.actualizado.label
                            )

  const alertTab2 = computed(()=>       !!b.value.f.buscar4
                                    ||  !!b.value.f.l5.label
                                    ||  !!b.value.f.l6.label
                                    ||  !!b.value.f.l2.label
                                    ||  b.value.f.valorMin != undefined
                                    ||  b.value.f.valorMax != undefined
                                    ||  !!b.value.f.l4.label
                                    ||  !!b.value.f.l3.label
                                    ||  !!b.value.f.l7.label
                                    ||  !!b.value.f.l8.label
                                    ||  !!b.value.f.desde
                                    ||  !!b.value.f.hasta
                                    ||  !!b.value.f.creador?.nombre
                                    ||  !!b.value.f.usuario?.nombre
                            )
                            
  const alertTab3 = computed(()=>   false
                                    /*    !!b.value.f.formaPago.length
                                    ||  !!b.value.f.origenes.length
                                    ||  !!b.value.f.conIva.label
                                    ||  !!b.value.f.area.label
                                    ||  !!b.value.f.municipio.id
                                    ||  !!b.value.f.totalizado.label
                                    ||  !!b.value.f.estadoAnticipo.length
                                    ||  !!b.value.f.tipoAnticipo.length
                                    ||  !!b.value.f.listoDespacho.label
                                    ||  !!b.value.f.tipoTercero.label 
                                    ||  !!b.value.f.conOrdenes.label
                                    ||  !!b.value.f.valorMin
                                    ||  !!b.value.f.valorMax
                                    ||  !!b.value.f.incPago.label
                                    ||  ( !!b.value.f.entrega.length  && !b.value.esEntrega )*/
                            )
</script>