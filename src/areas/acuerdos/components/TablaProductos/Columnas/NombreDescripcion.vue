<template>
  <div
    @click              ="emit('click')"
    v-bind              ="$attrs"
    >
    <q-icon :name="`mdi-alpha-${linea.nivelPrecios}-circle`" color="grey-6" size="xs"/>
    <span class         ="text-bold q-mr-sm">{{linea.ref}}</span>
    <span class         ="text-subtitle1">{{linea.nombre}}</span>
    <br/>
    <span
      v-if              ="!!linea.descripcion"
      v-html            ="linea.descripcion"
      class             ="text-0_8em"
      >
    </span>
    <Tooltip v-if       ="false">
      <table  class     ="tabla-info text-1em rounded-borders q-px-sm min-w-100">
        <tbody>
          <tr>
            <td>Costo</td>
            <td>
              {{formatoPrecio( linea.costo )}}
            </td>
          </tr>
          <tr>
            <td>Venta</td>
            <td>
              {{formatoPrecio( linea.precioFinal )}}
            </td>
          </tr>
          <tr>
            <td>Aumento</td>
            <td>
              {{ linea.aumentoFromCosto.toFixed( 2 ) }}%
            </td>
          </tr>
          <tr>
            <td>Nivel de precios</td>
            <td>
              {{ linea.nivelPrecios }}
            </td>
          </tr>          
        </tbody>
      </table>
    </Tooltip>
  </div>  
  <q-menu               touch-position context-menu>
    <div  class         ="column items-start ">
      <q-btn            v-close-popup flat dense no-caps
        icon            ="mdi-open-in-new"
        type            ="a"
        label           ="Ver producto"
        target          ="_blank"
        :to             ="`/productos/${linea.id}`"
      />
      <q-btn            flat dense no-caps
        v-if            ="!esValidado"
        icon            ="mdi-trash-can"
        label           ="Borrar línea"
        >
        <confirmar      @ok="emit('borrarLinea', linea)"/>
      </q-btn>
    </div>
  </q-menu>
</template>
<script lang="ts" setup>
//      style             ="min-width: 100px">
  import {  PropType      } from "vue"
  import {  ILineaAcuerdo } from "src/areas/acuerdos/models/LineaAcuerdo"
  import    confirmar       from "components/utilidades/MenuConfirmar.vue"
  import {  formatoPrecio         } from "src/useSimpleOk/useTools" 

  const props               = defineProps({
    linea:      { required: true, type: Object as PropType< ILineaAcuerdo > },
    esValidado: { required: true, type: Boolean },
  })

  const emit = defineEmits<{
    (e: 'click',        value: void           ): void
    (e: 'borrarLinea',  value: ILineaAcuerdo  ): void
  }>()
</script>
