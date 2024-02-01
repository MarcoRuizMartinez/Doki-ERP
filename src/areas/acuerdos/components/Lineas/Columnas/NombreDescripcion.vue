<script lang="ts" setup>
//      style             ="min-width: 100px">
  import {  ref,
            watch,
            toRefs,
            PropType        } from "vue"  
  import {  ILineaAcuerdo   } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  Format          } from "src/composables/useTools"
  import    confirmar         from "components/utilidades/MenuConfirmar.vue"
  import    popupCosto        from "./EditarCosto.vue"
  
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs     } from 'pinia'
  import {  useStoreUser    } from 'src/stores/user'
  import {  useStoreAcuerdo } from 'src/stores/acuerdo'


  const { usuario         } = storeToRefs( useStoreUser() )
  const { acuerdo         } = storeToRefs( useStoreAcuerdo() )
  const props               = defineProps({
    modelValue: { required: true, type: Object as PropType< ILineaAcuerdo > },
    esValidado: { required: true, type: Boolean },
  })
  const { modelValue }      = toRefs(props)
  const linea               = ref< ILineaAcuerdo >( modelValue.value )  
  watch( modelValue, (newLinea)=> linea.value = newLinea )

  const emit = defineEmits<{
    (e: 'click',        value: void           ): void
    (e: 'borrarLinea',  value: ILineaAcuerdo  ): void
  }>()  
</script>

<template>
  <div
    @click              ="emit('click')"
    v-bind              ="$attrs"    
    >
    <div class          ="text-1_1em lh_1_3 q-mb-xs">
      <span class       ="text-bold q-mr-sm">{{linea.ref}}</span>
      <span class       ="">{{linea.nombre}}</span>
    </div>
<!--     <br/> <span class         ="text-subtitle1">Modificador: {{linea.categoria.modificadorComision}}</span>
    <br/> <span class         ="text-subtitle1">Costo: {{linea.costo}}</span>
    <br/> <span class         ="text-subtitle1">Aumento: {{linea.aumentoFromCosto}}</span>
    <br/> <span class         ="text-subtitle1">Division: {{linea.comsionX100Division}}</span> -->
    <div
      v-if              ="acuerdo.esOCProveedor"
      class             ="text-bold text-grey-6"
      >
      {{linea.refProv}}
    </div>
    <div 
      v-if              ="!!linea.descripcion"
      v-html            ="linea.descripcion"
      class             ="text-0_8em"
      >
    </div>
    <Tooltip v-if       ="false">
      <table  class     ="tabla-info text-1em rounded-borders q-px-sm min-w-x100">
        <tbody>
          <tr>
            <td>Costo</td>
            <td>
              {{ Format.precio( linea.costo ) }}
            </td>
          </tr>
          <tr>
            <td>Venta</td>
            <td>
              {{ Format.precio( linea.precioFinal ) }}
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
              
            </td>
          </tr>
        </tbody>
      </table>
    </Tooltip>
  </div>
  <q-menu               touch-position context-menu>
    <div  class         ="column items-start">
      <q-btn            v-close-popup flat dense no-caps
        icon            ="mdi-open-in-new"
        class           ="full-width"
        type            ="a"
        label           ="Ver producto"
        align           ="left"
        target          ="_blank"
        :to             ="`/productos/${linea.id}`"
      />
      <q-btn            flat dense no-caps
        v-if            ="!esValidado"
        icon            ="mdi-trash-can"
        label           ="Borrar línea"
        class           ="full-width"
        align           ="left"
        >
        <confirmar      @ok="emit('borrarLinea', linea)"/>
      </q-btn>
      <!-- //* ////////////////////////////////////////////////// Editar Titulo -->
      <q-btn            flat dense no-caps
        v-if            ="usuario.esProduccion || usuario.esGerencia"
        label           ="Editar costo"
        icon            ="mdi-cash-usd-outline"
        class           ="full-width"
        align           ="left"
        >
        <popup-costo
          v-model       ="linea"
        />
      </q-btn>    
    </div>
  </q-menu>
</template>