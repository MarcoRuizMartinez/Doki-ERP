<script setup lang="ts">
  import  { computed,
            onMounted           } from "vue"
  import  { storeToRefs         } from 'pinia'                                            
  import  { useStoreApp         } from 'src/stores/app'
  import  { useStoreAcuerdo     } from 'src/stores/acuerdo'  
  import  { ToolDate            } from "src/composables/useTools"  
  const   { tabs                } = storeToRefs( useStoreApp() )
  const   { busqueda : b        } = storeToRefs( useStoreAcuerdo() )

  onMounted(()=> tabs.value = { activa : "tab_1", alerts: [ false, true ]} )
  //watch(b, ()=> { if(b.value.puedeBuscar) checkAlertTabs() }, { deep: true } )
  //watch(()=>b.value.acuerdo, ()=>{ })



  const alertTab1 = computed(()=>   !!b.value.f.buscar            || !!b.value.f.contacto           || ToolDate.fechaValida( b.value.f.desde ) || !!b.value.f.facturado.label   || !!b.value.f.municipioContacto.id ||
                                    !!b.value.f.estados.length    || !!b.value.f.condiciones.length || ToolDate.fechaValida( b.value.f.hasta ) || !!b.value.f.usuario?.nombre   || !!b.value.f.creador?.nombre      ||
                                  ( !!b.value.f.entrega.length    && b.value.esEntrega )
                            )
                            
  const alertTab2 = computed(()=>   !!b.value.f.formaPago.length
                                    || !!b.value.f.origenes.length
                                    || !!b.value.f.conIva.label
                                    || !!b.value.f.area.label
                                    || !!b.value.f.municipio.id
                                    || !!b.value.f.totalizado.label
                                    || !!b.value.f.estadoAnticipo.length
                                    || !!b.value.f.tipoAnticipo.length
                                    || !!b.value.f.listoDespacho.label
                                    || !!b.value.f.tipoTercero.label 
                                    || !!b.value.f.conOrdenes.label
                                    || !!b.value.f.valorMin
                                    || !!b.value.f.valorMax
                                    || !!b.value.f.incPago.label
                                    ||  ( !!b.value.f.entrega.length  && !b.value.esEntrega )
                            )                            
  function checkAlertTabs()
  {
    // tabs.value.alerts[0]  = alertTab1.value
    // tabs.value.alerts[1]  = alertTab2.value               
  }
</script>

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
      @mouseenter     ="tabs.activa = 'tab_1'"
      >
    </q-tab>
    <q-tab
      label           ="Otros"
      name            ="tab_2"
      icon            ="mdi-toolbox"
      :alert          ="alertTab2 ? 'red' : false"
      @mouseenter     ="tabs.activa = 'tab_2'"
      >
      <Tooltip label  ="Mas opciones"/>
    </q-tab>
    <q-tab
      label           ="Busquedas"
      name            ="tab_3"
      icon            ="mdi-magnify-scan"
      @mouseenter     ="tabs.activa = 'tab_3'"
      >
      <Tooltip label  ="Búsquedas rápidas"/>
    </q-tab>
  </q-tabs>
</template>