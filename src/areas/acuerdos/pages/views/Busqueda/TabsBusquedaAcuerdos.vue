<template>
  <q-tabs             dense no-caps inline-label
    v-model           ="tabs.activa"
    class             ="q-ma-none"
    >
    <!-- @mouseenter     ="tabs.activa = 'tab_1'"
    @mouseenter     ="tabs.activa = 'tab_2'"
    @mouseenter     ="tabs.activa = 'tab_3'"
    @mouseenter     ="tabs.activa = 'tab_4'" -->

    <q-tab
      label           ="Busqueda"
      name            ="tab_1"
      icon            ="mdi-magnify"
      :alert          ="alertTab1 ? 'red' : false"
      
      >
    </q-tab>
    <q-tab
      label           ="Fechas"
      name            ="tab_2"
      icon            ="mdi-calendar-month"
      :alert          ="alertTab2 ? 'red' : false"
      
      >
    </q-tab>
    <q-tab
      label           ="Otros"
      name            ="tab_3"
      icon            ="mdi-toolbox"
      :alert          ="alertTab3 ? 'red' : false"
      
      >
      <Tooltip label  ="Mas opciones"/>
    </q-tab>
    <q-tab
      label           ="Busquedas"
      name            ="tab_4"
      icon            ="mdi-magnify-scan"
      
      >
      <Tooltip label  ="Búsquedas rápidas"/>
    </q-tab>
  </q-tabs>
</template>


<script setup lang="ts">
  import  { computed,
            onMounted           } from "vue"
  import  { storeToRefs         } from 'pinia'                                            
  import  { useStoreApp         } from 'stores/app'
  import  { useStoreAcuerdo     } from 'stores/acuerdo'  
  import  { ToolDate, ToolType  } from "src/composables/useTools"  
  const   { tabs                } = storeToRefs( useStoreApp() )
  const   { busqueda : b        } = storeToRefs( useStoreAcuerdo() )

  onMounted(()=> tabs.value = { activa : "tab_1", alerts: [ false, false, true, false ]} )

  const alertTab1 = computed(()=>       !!b.value.f.buscar
                                    ||  !!b.value.f.contacto
                                    ||  !!b.value.f.facturado.label
                                    ||  !!b.value.f.municipioContacto.id
                                    ||  !!b.value.f.estados.length
                                    ||  !!b.value.f.condiciones.length
                                    ||  !!b.value.f.usuario?.nombre
                                    ||  !!b.value.f.creador?.nombre
                                    ||  ( !!b.value.f.entrega.length && b.value.esEntrega )
                            )

  const alertTab2 = computed(()=>       ToolDate.fechaValidaStrODate( b.value.f.desde )
                                    ||  ToolDate.fechaValidaStrODate( b.value.f.hasta )
                                    ||  ToolType.valorValido( b.value.f.diasDesde     )
                                    ||  ToolType.valorValido( b.value.f.diasHasta     )
                                    ||  ToolType.valorValido( b.value.f.aproHastaDia  )
                                    ||  ToolType.valorValido( b.value.f.aproDesdeDia  )
                                    ||  ToolType.valorValido( b.value.f.enviaDesdeDia )
                                    ||  ToolType.valorValido( b.value.f.enviaHastaDia )
                            )
                            
  const alertTab3 = computed(()=>       !!b.value.f.formaPago.length
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
                                    ||  ( !!b.value.f.entrega.length  && !b.value.esEntrega )
                            )
</script>