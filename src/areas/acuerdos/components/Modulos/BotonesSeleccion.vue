<template>
  <efecto efecto              ="UpDown">
    <q-page-sticky
      v-if                    ="!!seleccion.length" 
      v-bind                  ="$attrs"
      position                ="bottom-right"
      :offset                 ="[18, 18]"
      >
      <!-- //* ///////////////////////////////////////////////////////// Boton Flotante -->
      <q-fab
        v-model               ="isOpen"
        direction             ="up"
        padding               ="sm"
        :color                ="isOpen ? 'red' : 'positive'"
        >
        <template             #icon>
          <q-icon
            name              ="mdi-chevron-up"
          />
        </template>
        <!-- //* /////////////////////////////////////////////////////// Boton nueva Tarea -->
        <q-btn                round unelevated
          color               ="positive"
          icon                ="mdi-barcode-scan"
          @click              ="clickRotulos"
          >
          <Tooltip label      ="Generar rótulos"/>
        </q-btn>
        <template             #tooltip>
          <!-- //* ///////////////////////////////////////////////////// Cantidad de mensajes -->
          <q-badge            floating
            color             ="red"
            :label            ="seleccion.length"
          />
        </template>
      </q-fab>
    </q-page-sticky>
  </efecto>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref                   } from 'vue'

  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'  
  import {  useStoreAcuerdo       } from 'stores/acuerdo'  

  // * /////////////////////////////////////////////////////////////////////////////////// Componibles

  // * /////////////////////////////////////////////////////////////////////////////////// Componentes

  import    efecto                  from "components/utilidades/Efecto.vue"
  
  const { seleccion           } = storeToRefs( useStoreAcuerdo() )      


  const isOpen                  = ref<boolean>(false)  

  type TEmit                    = {
    clickRotulos : [ value : void        ]
  }  

  const emit                  = defineEmits<TEmit>()

  function clickRotulos()
  {
    emit("clickRotulos")
    isOpen.value              = false
  }

</script>