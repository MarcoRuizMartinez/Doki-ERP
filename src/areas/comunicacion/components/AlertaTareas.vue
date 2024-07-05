<template>
  <ventana                cerrar
    :titulo               ="`Alertas de tareas (${alertas.length})`"
    icono                 ="mdi-alarm-light"
    class-contenido       ="column items-center"
    padding-contenido     ="0"
    min-width             ="390px"
    >
    <template             #barra>
      <q-btn
        v-bind            ="style.btnBaseSm"
        color             ="accent"
        label             ="Posponer"
        icon              ="mdi-alarm"
        >
        <confirmar  @ok   ="posponer" />
      </q-btn>

      <q-btn
        v-bind            ="style.btnBaseSm"
        color             ="positive"
        label             ="Ver en tareas"
        icon              ="mdi-alert-decagram"
        :to               ="`/tareas?usuario=${usuario.id}&cuando=1_2_3_4_5&progreso=0&l1=1&limite=50&offset=0`"
      />
    </template>
    <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
    <lista-tareas
      v-model             ="alertas"
      :columnas              
      :columnas-visibles
    />
  </ventana>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            onMounted               } from 'vue'

  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs             } from 'pinia'
  import {  useStoreAcciones        } from 'stores/acciones'
  import {  useStoreUser            } from 'stores/user'

  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IColumna, Columna       } from "src/models/Tabla"
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  style                 } from "src/composables/useEstilos"

  // * /////////////////////////////////////////////////////////////////////////////////// Componentes 
  import    ventana                   from "components/utilidades/Ventana.vue"
  import    listaTareas               from "../components/ListaTareas.vue"
  import    confirmar                 from "components/utilidades/MenuConfirmar.vue"

  
  const { alertas                   } = storeToRefs( useStoreAcciones() )  
  const { usuario                   } = storeToRefs( useStoreUser() )
  const columnas                      = ref< IColumna[] >( [] )
  const columnasVisibles              = ref< string[]   >( [] )

  type TEmit = {
    posponer  : [ value : void]
  }

  const emit                        = defineEmits<TEmit>()

  onMounted( ()=>{
    crearColumnas()
  } )

   //* ///////////////////////////////////////////////////////////// Crear Columnas
   function crearColumnas()
  {
    columnas.value            = [
      new Columna({ name: "titulo",             label: "tarea"      }),
      new Columna({ name: "tipoLabel",          label: "origen"     }),
      new Columna({ name: "creadorLabel",       label: "Creado por" }),  
      new Columna({ name: "fechaCreacionCorta", label: "creación"   }),  
    ]
    columnasVisibles.value    = columnas.value.filter(c => c.visible ).map( c => c.name )
  }


  function posponer(){
    emit("posponer")
  }




</script>