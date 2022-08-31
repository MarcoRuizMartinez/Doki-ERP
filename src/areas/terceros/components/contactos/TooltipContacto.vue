<template>
  <q-tooltip  class ="bg-black text-caption">
    <div>
      <span class="text-bold">{{contacto.nombreCompleto }}</span>
      <span v-if="!contacto.activo"> - Inactivo</span>
      <table class="tabla-tooltip">
        <tr v-if="!!contacto.empresa" >   <td>Empresa</td>    <td>{{contacto.empresa}}         </td></tr>
        <tr v-if="!!contacto.cargo" >     <td>Cargo</td>      <td>{{contacto.cargo}}           </td></tr>
        <tr v-if="!!contacto.telefono">   <td>Teléfono</td>   <td>{{contacto.telefono}}         </td></tr>
        <tr v-if="!!contacto.telefono_2"> <td>Teléfono</td>   <td>{{contacto.telefono_2}}       </td></tr>
        <tr v-if="!!contacto.extension">  <td>Extensión</td>  <td>{{contacto.extension}}        </td></tr>
        <tr v-if="!!contacto.correo">     <td>Correo</td>     <td>{{contacto.correo}}           </td></tr>
        <tr v-if="!!contacto.municipioId"><td>Municipio</td>  <td>{{contacto.municipio.label}}  </td></tr>
        <tr v-if="!!contacto.direccion">  <td>Dirección</td>  <td>{{contacto.direccion}}        </td></tr>
        <tr v-if="!!contacto.nota">       <td>Nota</td>       <td>{{contacto.nota}}             </td></tr>
        <tr> <td>Creado</td>              <td>{{contacto.fechaCreadoCorta    }}                 </td> </tr>
        <tr> <td>Modificado</td>          <td>{{contacto.fechaModificadoCorta}}                 </td> </tr>
      </table>      
    </div>
  </q-tooltip>
</template>
<script setup lang="ts">
  import {  PropType } from "vue"
  import {  IContacto } from "src/areas/terceros/models/Contacto"
                              
  const props = defineProps({
    contacto:  { required: true, type: Object as PropType<IContacto> }
  })
</script>