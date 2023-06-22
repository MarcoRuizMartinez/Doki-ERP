<template>
  <ventana                  minimizar
    titulo                  ="Notas"
    icono                   ="mdi-file-document-multiple"
    class-contenido         ="row"
    padding-contenido       ="0"
    > 
    <q-input                filled dense
      v-model               ="acuerdo.notaPublica"      
      label                 ="Nota publica"
      placeholder           ="Esta nota aparecerá en los PDF"
      type                  ="textarea"      
      class                 ="col-12"
      debounce              ="800"
      :loading              ="loading.notaPrivada"
      :disable              ="loading.notaPrivada"      
      @update:model-value   ="( n : string | number | null )=>editarNotaPublica( n?.toString() ?? '' )"
    />
    <q-input                filled dense
      v-model               ="acuerdo.notaPrivada"
      label                 ="Nota privada"
      type                  ="textarea"
      class                 ="col-12"
      debounce              ="800"
      :loading              ="loading.notaPrivada"
      :disable              ="loading.notaPrivada"
      @update:model-value   ="( n : string | number | null )=>editarNotaPrivada( n?.toString() ?? '' )"      
    />
  </ventana>
</template>
<script setup lang="ts">
  //* ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'  
  //* ///////////////////////////////////////////////////////////////////////////// Componibles  
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  //* ///////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  
  const { acuerdo, loading    } = storeToRefs( useStoreAcuerdo() )  
  const { editarNotaPrivada,
          editarNotaPublica,
                              } = useControlAcuerdo()
</script>