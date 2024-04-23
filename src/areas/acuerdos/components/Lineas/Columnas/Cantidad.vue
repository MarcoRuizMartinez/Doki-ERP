<template>
  <div
    class                   ="text-right"
    :class                  ="[$attrs.class, clase]"
    >
    {{ linea.qtyUnd }}
  </div>
  <q-popup-edit             buttons
    v-if                    ="!readonly && !acuerdo.facturado"
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
  <!-- //* ///////////////////////////////////////////////////////////////////// ENTREGAS -->
  <div class                ="text-center lh_1_2">
    <template v-if          ="!!linea.qtyEntregado || !!linea.qtyProgramado || !!linea.qtyBorrador">
      <!-- //* ///////////////////////////////////////////////////////////////// Entregado -->
      <div class            ="text-green">
        <q-icon :name       ="linea.entregaTotalOk ? 'mdi-check-all' : 'mdi-check'"/>
        {{ linea.qtyEntregado }}
      </div>
      <!-- //* ///////////////////////////////////////////////////////////////// Programado -->
      <div
        v-if                ="!!linea.qtyProgramado && !linea.entregaTotalOk "
        class               ="text-orange"
        >
        <q-icon :name       ="linea.entregaProgramadoTodo ? 'mdi-check-all' : 'mdi-calendar-clock'"/>
        {{ linea.qtyProgramado }}
      </div>
      <!-- //* ///////////////////////////////////////////////////////////////// Borrador -->
      <div
        v-if                ="!!linea.qtyBorrador && !linea.entregaTotalOk "
        class               ="text-grey-8"
        >
        <q-icon name        ="mdi-eraser-variant"/>
        {{ linea.qtyBorrador }}
      </div>
      <!-- //* ///////////////////////////////////////////////////////////////// Borrador -->
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
            computed,
            toRefs,
            PropType              } from "vue"    
  import {  ILineaAcuerdo         } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"            
  import    numeroPaso              from "components/utilidades/input/InputNumeroPaso.vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreAcuerdo     } from 'stores/acuerdo'

  const { acuerdo         } = storeToRefs( useStoreAcuerdo() )
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

  const clase               = computed(()=>{
    let clase               = ""
    if( linea.value.esProducto
        &&
        ( acuerdo.value.esEntrega
          ||
          (
            acuerdo.value.esPedido
            &&
            (
                  acuerdo.value.esEstadoEntregando
              ||  acuerdo.value.esEstadoValidado
              //||  acuerdo.value.esEstadoEntregado
            )
          )
        )
      )
    {
      clase                 = linea.value.entregaTotalOk ? "text-green text-bold" : "text-orange-14"
    }
    
    return clase
  })

  function actualizar()
  {
    emit("update:modelValue", linea.value )
    editarLinea( linea.value )
  }
</script>