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
      v-if            ="!usuario.esComercial"
      label           ="Crear y Editar"
      name            ="tab_3"
      icon            ="mdi-clipboard-edit"
      >
      <Tooltip label  ="Opciones de edición"/>
    </q-tab>    
    <q-tab
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
  //const   { busquedaPro : b     } = storeToRefs( useStoreProducto() )

  onMounted(()=> tabs.value = { activa : "tab_1", alerts: [ false, false, false, false ]} )

  const alertTab1 = computed(()=>   false 
                                    /* !!b.value.f.buscar
                                    ||  !!b.value.f.contacto
                                    ||  !!b.value.f.facturado.label
                                    ||  !!b.value.f.municipioContacto.id
                                    ||  !!b.value.f.estados.length
                                    ||  !!b.value.f.condiciones.length
                                    ||  !!b.value.f.usuario?.nombre
                                    ||  !!b.value.f.creador?.nombre
                                    ||  ( !!b.value.f.entrega.length && b.value.esEntrega )*/
                            )

  const alertTab2 = computed(()=>   false
                                    /*    ToolDate.fechaValidaStrODate( b.value.f.desde )
                                    ||  ToolDate.fechaValidaStrODate( b.value.f.hasta )
                                    ||  ToolType.valorValido( b.value.f.diasDesde     )
                                    ||  ToolType.valorValido( b.value.f.diasHasta     )
                                    ||  ToolType.valorValido( b.value.f.aproHastaDia  )
                                    ||  ToolType.valorValido( b.value.f.aproDesdeDia  )
                                    ||  ToolType.valorValido( b.value.f.enviaDesdeDia )
                                    ||  ToolType.valorValido( b.value.f.enviaHastaDia )*/
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