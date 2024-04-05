<template>
  <div>
    <q-btn            dense flat round
      icon            ="mdi-comment-text-multiple"
      size            ="md"
      @click          ="copiarComentarios"
      >
      <q-badge        floating rounded
        color         ="red"
        >
        {{ entrega.comentarios.length }}
      </q-badge>
      <Tooltip>{{entrega.comentarios}}</Tooltip>
    </q-btn>    
  </div>
</template> 

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  onMounted             } from "vue"  

  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'stores/acuerdo'

  //* /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAcuerdo              } from "../../models/Acuerdo"  

  //* ///////////////////////////////////////////////////////////////////////////// Componibles  
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"

  //* ///////////////////////////////////////////////////////////////////////////// Componentes
  type TProps                       = { entrega : IAcuerdo}
  const { entrega }                 = defineProps<TProps>()
  const { acuerdo }                 = storeToRefs( useStoreAcuerdo() )
  const { buscarComentarios       } = useControlAcuerdo()


  onMounted(buscarComentariosEntrega)

  async function buscarComentariosEntrega()
  {
    await buscarComentarios( entrega )     
  }

  function copiarComentarios()
  {
    acuerdo.value.comentarios = entrega.comentarios
  }
   
</script>