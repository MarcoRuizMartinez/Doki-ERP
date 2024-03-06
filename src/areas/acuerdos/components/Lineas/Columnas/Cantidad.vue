<template>
  <div
    class                   ="text-right"
    :class                  ="$attrs.class"
    >
    {{ linea.qtyUnd }}
  </div>
  <q-popup-edit             buttons
    v-if                    ="!readonly"
    v-model                 ="linea.qty"
    v-slot                  ="scope"
    class                   ="alto-min-100"
    label-set               ="Editar"
    @update:model-value     ="actualizar"
    >
    <numero-paso
      v-model               ="scope.value"
      class                 =""
      label                 ="Cantidad"
      modo                  ="right"
      :minimo               ="0.1"
      @enter                ="scope.set"
    />
  </q-popup-edit>
  <div class                ="text-center lh_1_2">
    <template
      v-if                  ="!!linea.qtyEntregado || !!linea.qtyProgramado || !!linea.qtyBorrador"
      >
      <div
        class               ="text-green"
        >
        <q-icon :name       ="linea.entregaTotalOk ? 'mdi-check-all' : 'mdi-check'"/>
        {{ linea.qtyEntregado }}
      </div>
      <div
        v-if                ="!!linea.qtyProgramado"
        class               ="text-orange"
        >
        <q-icon :name       ="linea.entregaProgramadoTodo ? 'mdi-check-all' : 'mdi-calendar-clock'"/>
        {{ linea.qtyProgramado }}
      </div>
      <div
        v-if                ="!!linea.qtyBorrador"
        class               ="text-grey-8"
        >
        <q-icon name        ="mdi-eraser-variant"/>
        {{ linea.qtyBorrador }}
      </div>    
      <Tooltip>
        <table  class       ="tabla-tooltip">
          <tr>
            <td>Total:</td>
            <td>{{linea.qty}}</td>
          </tr>
          <tr>
            <td>Entregado:</td>
            <td>{{ linea.qtyEntregado }}</td>
          </tr>          
          <template v-if    ="!!linea.qtyProgramado">
            <tr>
              <td>Programado:</td>
              <td>{{ linea.qtyProgramado }}</td>
            </tr>
          </template>
          <tr>
            <td>Edición:</td>
            <td>{{ linea.qtyBorrador }}</td>
          </tr>        
        </table>    
      </Tooltip>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import {  ref,
            watch,
            toRefs,
            PropType              } from "vue"    
  import {  ILineaAcuerdo         } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"            
  import    numeroPaso              from "components/utilidades/input/InputNumeroPaso.vue"

  const { editarLinea  }    = useControlProductos()  

  const props               = defineProps({
    modelValue: { required: true,   type: Object as PropType< ILineaAcuerdo > },
    readonly:   { default:  false,  type: Boolean                             }
  })
  const { modelValue }      = toRefs(props)
  const linea               = ref<ILineaAcuerdo>(modelValue.value)  
  const emit                = defineEmits<{
    (e: 'update:modelValue',  value: ILineaAcuerdo ): void
  }>()  

  watch( modelValue, (newLinea)=> linea.value = newLinea )

  function actualizar()
  {
    emit("update:modelValue", linea.value )
    editarLinea( linea.value )
  }
</script>