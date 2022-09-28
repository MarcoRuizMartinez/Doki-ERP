<template>
  <div class      ="ellipsis box-link">
    <router-link
      :class      ="{ 'link-tercero-color' : !tercero.color.includes( '#FFF' ) && !!tercero.color }"
      :to         ="'/tercero/' + tercero.id "
      >      
        {{ tercero.nombre }}
        <tooltip-tercero :tercero="tercero"/>
    </router-link>
  </div>
</template>
<script setup lang="ts">
  import {  PropType,
            toRefs,
                                  } from "vue"
  import {  ITercero              } from "src/areas/terceros/models/Tercero"
  import    tooltipTercero          from "src/areas/terceros/components/TooltipTerceros.vue"
  import {  getColorTextFromHexa  } from "src/useSimpleOk/useTools"

  const props           = defineProps({
    tercero:  { required: true, type: Object as PropType< ITercero > }
  })
  const { tercero     } = toRefs( props )
  const colorFondo      = tercero.value.color
  const { color,
          promedio    } = getColorTextFromHexa( tercero.value.color )
  const colorSombra     = promedio > 190 ? "white" : "black"

</script>
<style>
  .link-tercero-color{
    padding:          2px 6px;
    border-radius:    10px;
    text-shadow:      1px 1px 2px v-bind( colorSombra );
    color:            v-bind( color ) !important;
    background-color: v-bind( colorFondo );
  }

  .box-link{
    max-width: 200px;
    width: 100%;
  }
</style>