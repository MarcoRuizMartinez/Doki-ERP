<template>
  <q-page                     padding
    class                     ="row justify-center"
    >
    <ventana-iframe           show-menu copiar
      icono                   ="mdi-map-marker-path"
      titulo                  ="Consultar guías de transportadoras"
      :src                    ="src"
      :link                   ="src"
      :modo                   ="modo"
      >
      <fieldset-filtro
        titulo                ="Búsqueda"
        class-conenido        ="row q-gutter-xs full-width"
        >
      <!-- //* ///////////////////////////////////////////////// Transportadora -->
        <select-label-value   use-input hundido clearable flat bordered
          v-model             ="tra"
          label               ="Transportadora"
          icon                ="mdi-truck"
          class               ="width200"
          :options            ="tras"
          @update:model-value ="cargarIframe"
        /> 
        <!-- //* ///////////////////////////////////////////////// Numero Guia -->
        <input-buscar         clearable hundido        
          v-model             ="guia"
          label               ="Guía"
          icon                ="mdi-barcode-scan"
          class               ="width200"
          debounce            ="800"
          :disable            ="!transtTieneGet"
          @update:model-value ="cargarIframe"
          @keydown.enter.prevent  ="cargarIframe"

        />
        <q-btn
          v-bind              ="style.btnBaseSm"
          color               ="primary"
          icon                ="mdi-magnify"
          label               ="Buscar"
          :disable            ="!datosOk"
          @click              ="cargarIframe"
        />      
        <div class            ="q-mt-sm">
          <btn-copiar         hide-label
            size              ="md"
            :dato             ="src"
            :disable          ="!datosOk"
          />
        </div>
        
    </fieldset-filtro>      
    </ventana-iframe>
  </q-page>
</template>
<script setup lang="ts">
  import {  ref, computed   } from 'vue'
  import {  useTitle        } from "@vueuse/core"
  import    ventanaIframe     from "components/navegacion/VentanaIframe.vue"
  import    inputBuscar       from "components/utilidades/input/InputSimple.vue"
  import    selectLabelValue  from "components/utilidades/select/SelectLabelValue.vue"
  import    fieldsetFiltro    from "components/utilidades/Fieldset.vue"
  import    btnCopiar         from "components/utilidades/CampoCopiar.vue" 
  import {  style               } from "src/useSimpleOk/useEstilos"
  import {  labelValueNulo,
            ILabelValue,    } from "src/models/TiposVarios"

  useTitle("📍 Guías de transportadora")

  const src                 = ref<string>("")
  const guia                = ref<string>("")  
  const tra                 = ref<ILabelValue>(labelValueNulo)
  const transtTieneGet      = computed(()=> !!tra.value.label && tra.value.value.toString().includes("=") )
  const datosOk             = computed(()=>   transtTieneGet.value
                                            ? !!tra.value.label && guia.value.length > 4
                                            : !!tra.value.label
                                      )
  const modo                = computed(()=> datosOk.value ? "normal" : "esperando-busqueda" )
  const tras:ILabelValue[]  = [
    { label: "Exxe",            value: "https://solex.blulogistics.net/SolexRC/g?Numero=" },
    { label: "Interrapidisimo", value: "https://www.interrapidisimo.com/sigue-tu-envio/?guia=" },
    { label: "Servientrega",    value: "https://mobile.servientrega.com/WebSitePortal/RastreoEnvioDetalle.html?Guia=" },
    { label: "Transcarga",      value: "https://siscov.net/zonacliente/Transcarga/web/Modulos/Public/RastreoGuias.aspx" },
  ]

  function cargarIframe()
  {
    if(!transtTieneGet.value)
      guia.value                = ""

    if(datosOk.value) 
      src.value                 = tra.value.value + guia.value
  }

</script>