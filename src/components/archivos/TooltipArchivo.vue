<template>
  <q-tooltip  class ="bg-black text-caption">
    <div class="text-subtitle2">
      <div class="ellipsis text-bold">
        <q-icon
          size              ="sm"
          :name             ="archivo.icono"
        />
        {{ archivo.name }}</div>
      <table class="tabla-tooltip">
        <tr> <td>Tipo</td> <td>{{archivo.tipo}}</td> </tr>
        <tr> <td>Tamaño</td> <td>{{archivo.sizeFile}}</td> </tr>
        <tr> <td>Subido</td> <td>{{archivo.fechaCorta}}</td> </tr>
      </table>      
    </div>
  </q-tooltip>
</template>
<script setup lang="ts">
  import {  PropType } from "vue"
  import {  IArchivo } from "src/models/Archivo"
                              
  const props = defineProps({
    archivo:  { required: true, type: Object as PropType<IArchivo> }
  })
</script>