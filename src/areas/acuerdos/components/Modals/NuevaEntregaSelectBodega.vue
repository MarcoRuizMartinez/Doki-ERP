<template>
  <ventana                    cerrar
    titulo                    ="Nueva entrega"
    icono                     ="mdi-truck-delivery"
    class-contenido           ="row ancho-ventana"
    >
    <!-- //* ///////////////////////////////////////////////////////////// Bodega -->
    <select-label-value       use-input
      v-model                 ="modelo"
      label                   ="Seleccionar bodega"
      icon                    ="mdi-package-variant-closed"
      options-sort            ="label"
      class                   ="col-10"
      :options                ="bodegas.filter( (b)=> !!(+b.padre_id) )"
    />
    <!-- //* ///////////////////////////////////////////////////////////// Boton ir-->
    <q-btn                    flat
      label                   ="Ir" 
      class                   ="col q-ml-sm"
      :disable                ="!modelo.value"
      @click                  ="irANewEntrega"
    />
  </ventana>
</template>
<script setup lang="ts">
  //* ////////////////////////////////////////////////////////////////////////// Core
  import {  ref                 } from "vue"
  //* ////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'
  //* ////////////////////////////////////////////////////////////////////////// Modelos
  import {  ILineaAcuerdo,
            LineaAcuerdo        } from "src/areas/acuerdos/models/LineaAcuerdo"
  //* ////////////////////////////////////////////////////////////////////////// Componibles
  import {  dexieBodegas        } from "src/services/useDexie"  

  //* ////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  //* //////////////////////////////////////////////////////////////////////////////// Componibles

  import {  ILabelValue,
            labelValueNulo        } from "src/models/TiposVarios"


  const bodegas                 = dexieBodegas()

  const { acuerdo,
          lineaElegida        } = storeToRefs( useStoreAcuerdo() )

  const linea                   = ref< ILineaAcuerdo >( Object.assign( new LineaAcuerdo(), lineaElegida.value ) )


  const modelo                  = ref< ILabelValue >( labelValueNulo )

  function irANewEntrega()
  {
    window.open( acuerdo.value.urlDolibarrNuevoEnvio + "&entrepot_id=" + modelo.value.value, '_blank')
  }
  


</script>