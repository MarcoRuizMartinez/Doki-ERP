<template>
  <q-page                     padding
    class                     ="row items-stretch content-start justify-start q-col-gutter-md"
    >
    <vista-acuerdo-crear  
      v-bind                  ="props"
    />
  </q-page>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  
            toRefs,
            PropType,
            onUnmounted,
                                  } from "vue"  
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  Acuerdo               } from "src/areas/acuerdos/models/Acuerdo"
  import {  TTipoAcuerdo          } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    vistaAcuerdoCrear       from "src/areas/acuerdos/components/Views/VistaAcuerdoCrear.vue"
  const {   acuerdo         } = storeToRefs( useStoreAcuerdo() )
  //* /////////////////////////////////////////////////////////////// Props
  const props                 = defineProps({
    terceroId:  { default: 0, type: [String, Number] },
    tipo:       { required: true, type: String as PropType< TTipoAcuerdo > },
  })
  const { tipo              } = toRefs( props )
  onUnmounted(()=>{
    console.log("onUnmounted Page crear")
    //if(acuerdoCreado) return
    console.log("F")
    acuerdo.value             = new Acuerdo( tipo.value )
  })

</script>