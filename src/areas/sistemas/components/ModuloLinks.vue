<template>
    <ventana                      minimizar
      class-contenido             ="column items-center"
      titulo                      ="Enlaces internos"
      icono                       ="mdi-link"
      size-icon-carga             ="14em"
      padding-contenido           ="0"
      :cargando                   ="!enlaces.length"
      >
      <q-table                    borbordered dense flat
        class                     ="fit tabla-maco"
        row-key                   ="id"
        :rows                     ="enlaces"
        :columns                  ="columnas"
        >
      </q-table>
    </ventana>
  </template>
  
  <script setup lang="ts">
    import {  ref, onMounted          } from "vue"
    import {  IColumna,
              Columna                 } from "src/models/Tabla"
    import    ventana                   from "components/utilidades/Ventana.vue"
    import {  useApiDolibarr        } from "src/services/useApiDolibarr"      

    const { apiDolibarr       } = useApiDolibarr()
    const enlaces               = ref<any[]>([])

    onMounted(cargarEnlaces)

    async function cargarEnlaces(){
      const { ok, data }        = await apiDolibarr( "buscar", "saber" )
      if(ok){
        if(Array.isArray(data))
          enlaces.value = data
          console.log("enlaces.value: ", enlaces.value);
      }
    }



    const columnas: IColumna[]  = [
                                    new Columna({ name: "ref"}),
                                    new Columna({ name: "question"}),
                                    new Columna({ name: "sigla"}),
                                    new Columna({ name: "grupo"}),
                                  ]
  </script>