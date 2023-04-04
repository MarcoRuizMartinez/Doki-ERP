<template>
  <q-page padding         class ="row items-stretch content-start justify-start q-col-gutter-md">
    <vista-acuerdo-crear v-bind ="props"/>
  </q-page>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {
            //toRefs,
            PropType,
            onMounted,
                                  } from "vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  //import {  Acuerdo               } from "src/areas/acuerdos/models/Acuerdo"
  import {  TTipoAcuerdo          } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    vistaAcuerdoCrear       from "./views/VistaAcuerdoCrear.vue"
  //const {   acuerdo         } = storeToRefs( useStoreAcuerdo() )
  //* /////////////////////////////////////////////////////////////// Props
  const props                 = defineProps({
    terceroId:  { default: 0, type: [String, Number] },
    tipo:       { required: true, type: String as PropType< TTipoAcuerdo > },
  })
  //const { tipo              } = toRefs( props )
  const storeAcuerdo          = useStoreAcuerdo()


  onMounted(()=>{
    storeAcuerdo.cargarNivelesComision()
    //console.log("onUnmounted Page crear")
    //if(acuerdoCreado) return
    //acuerdo.value             = new Acuerdo( tipo.value )
  })

</script>
