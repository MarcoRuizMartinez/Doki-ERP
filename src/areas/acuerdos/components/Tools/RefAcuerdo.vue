<template>
  <div class            ="row items-center min-w-max">
    <div class          ="relative-position">
      <q-icon
        name            ="mdi-tooltip"
        size            ="xs"
        class           ="op50 op100-hover"
        >     
        <tooltip-lineas
          :lineas       ="acuerdo.productos"
        />
      </q-icon>
      <q-badge          rounded floating transparent 
        color           ="transparent"
        text-color      ="white"
        class           ="text-0_8em absolute lago non-selectable no-pointer-events"
        :label          ="acuerdo.largo"
      />  
    </div>
    <!-- //* //////// Vista Rapida -->
    <q-btn            flat dense round
      v-if            ="vistaRapida"
      icon            ="mdi-eye"
      class           ="op40 op100-hover q-ml-sm"
      padding         ="none"
      size            ="md"
      @click          ="emit('vistaRapida')"
      >
      <Tooltip  label ="Vista rápida"/>
    </q-btn>
    <!-- //* //////// Generar OC a proveedor -->
    <q-btn            flat dense round
      v-if            ="acuerdo.esPedido && vistaRapida && usuario.esProduccion"
      icon            ="mdi-tools"
      class           ="op40 op100-hover q-ml-sm"
      padding         ="none"
      size            ="md"
      target          ="_blank"
      :disable        ="!acuerdo.esEstadoAbierto"
      :href           ="acuerdo.urlDolibarrOC"
      >
      <Tooltip  label ="Generar OC a proveedor"/>
    </q-btn>
    <!-- //* //////// Link a Dolibarr -->
    <q-btn            flat dense round
      icon            ="mdi-alpha-d-circle"
      class           ="op40 op100-hover q-ml-sm"
      padding         ="none"
      size            ="md"
      target          ="_blank"
      :href           ="acuerdo.urlDolibarr"
      >
      <Tooltip  label ="Ver en Dolibarr"/>
    </q-btn>
    <!-- //* //////// Link REF -->
    <div>
      <router-link
        class           ="fuente-mono q-ml-sm"
        :class          ="{ 'text-white' : white }"
        :to             ="`/${acuerdo.ruta}/${acuerdo.id}`"
        @click          ="clickLink"
        >
        {{ refLarga ? acuerdo.ref : acuerdo.refCorta }}
      </router-link>
      <tooltip-acuerdo    :acuerdo="acuerdo"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import {  PropType, toRefs} from "vue"    
  import {  IAcuerdo        } from "src/areas/acuerdos/models/Acuerdo"
  import    tooltipLineas     from "src/areas/acuerdos/components/Tools/Tooltips/TooltipLineas.vue"
  import    tooltipAcuerdo    from "src/areas/acuerdos/components/Tools/Tooltips/TooltipAcuerdo.vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs   } from 'pinia'
  import {  useStoreUser  } from 'src/stores/user'

  const { usuario         } = storeToRefs( useStoreUser() ) 

  const props               = defineProps({
    acuerdo:        { required: true,   type: Object as PropType< IAcuerdo > },
    vistaRapida:    { default:  false,  type: Boolean },
    refLarga:       { default:  false,  type: Boolean },
    conSubTotal:    { default:  false,  type: Boolean },
    white:          { default:  false,  type: Boolean },
  })
  const emit                  = defineEmits<{
    (e: "vistaRapida",  value: void     ): void
    (e: "clickAcuerdo", value: IAcuerdo ): void
  }>()  
  const { acuerdo        }   = toRefs( props )

  function clickLink(){    
    emit("clickAcuerdo", acuerdo.value)
  }
</script>
<style scoped>
.lago{
    left: 1px;
    top: 1px;
}
</style>