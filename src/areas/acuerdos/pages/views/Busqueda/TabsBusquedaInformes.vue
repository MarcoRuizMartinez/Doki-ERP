<template>
  <q-tabs             dense no-caps inline-label
    v-model           ="tabs.activa"
    class             ="q-ma-none"
    >
    <q-tab
      label           ="Busqueda"
      name            ="tab_1"
      icon            ="mdi-magnify"
      :alert          ="!!tabs.alerts[0] ? 'red' : false"
      >
    </q-tab>
    <q-tab
      label           ="Otros"
      name            ="tab_2"
      icon            ="mdi-toolbox"
      :alert          ="!!tabs.alerts[1] ? 'red' : false"      
      >
      <Tooltip label  ="Mas opciones"/>
    </q-tab>
  </q-tabs>  
</template>

<script setup lang="ts">
  import  { watch               } from "vue"
  import  { storeToRefs         } from 'pinia'                                            
  import  { useStoreApp         } from 'stores/app'
  import  { useStoreAcuerdo     } from 'stores/acuerdo'  
  import  { ToolDate            } from "src/composables/useTools"  
  const   { tabs                } = storeToRefs( useStoreApp() )
  const   { busqueda : b        } = storeToRefs( useStoreAcuerdo() )

  watch(b, ()=> { if(b.value.puedeBuscar) checkAlertTabs() }, { deep: true } )
  watch(()=>b.value.acuerdo, ()=>{ tabs.value = { activa : "tab_1", alerts: [ false, true ]} })

  function checkAlertTabs()
  {
    tabs.value.alerts[0]  = (     !!b.value.f.buscar
                              || ToolDate.fechaValidaStrODate( b.value.f.desde ) 
                              || ToolDate.fechaValidaStrODate( b.value.f.hasta ) 
                              || !!b.value.f.estados.length
                              || !!b.value.f.origenes.length
                              || !!b.value.f.totalizado.label
                              || !!b.value.f.municipio.id
                              || !!b.value.f.area.label    
                              || !!b.value.f.condiciones.length                               
                              || !!b.value.f.valorMin
                              || !!b.value.f.valorMax                              
                              || !!b.value.f.usuario
                              || !!b.value.f.facturado.label
                            )
    tabs.value.alerts[1]  = (    !!b.value.f.conIva.label
                              || !!b.value.f.entrega.length
                              || !!b.value.f.formaPago.length
                              || !!b.value.f.terceroInterno.label
                            )
  }
</script>