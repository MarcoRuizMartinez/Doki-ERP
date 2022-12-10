<template>
  <q-tooltip  class ="bg-black text-caption">
    <div>
      <table class="tabla-tooltip">
        <tr>
          <td>Ref</td>
          <td>{{ acuerdo.ref }}</td>
        </tr>
        <tr v-if="!!acuerdo.contactoComercial.empresa">
          <td>Empresa</td>
          <td> {{acuerdo.contactoComercial.empresa}}</td>
        </tr>
        <tr v-if="!!acuerdo.contactoComercial.id">
            <td>Contacto</td>
            <td>{{ acuerdo.contactoComercial.nombreCompleto }}</td>
        </tr>
        <tr v-if="acuerdo.esOCProveedor">
            <td>Creador</td>
            <td>
            <chip-usuario
              :usuario            ="acuerdo.creador"
            />
          </td>
        </tr>        
        <tr v-if="!acuerdo.esOCProveedor">
          <td>Comercial</td>
          <td>
            <chip-usuario
              :usuario            ="acuerdo.comercial"
            />
          </td>
        </tr>
        <tr> <td>Estado</td> <td>
          <span
            class   ="q-px-xs"
            style   ="border-radius: 6px;"
            :style  ="'background-color: ' + acuerdo.estadoColor"
            >
            {{ acuerdo.estadoLabel }}
          </span>
        </td></tr>
        <tr> <td>Subtotal</td> <td>{{ formatoPrecio( acuerdo.totalConDescu ) }}</td> </tr>
        <tr v-if="!!acuerdo.contactoComercial.correo"       ><td>Correo</td>    <td><div class="ellipsis"> {{acuerdo.contactoComercial.correo}} </div> </td></tr>
        <tr v-if="!!acuerdo.contactoComercial.telefono"     ><td>Teléfono</td>  <td>{{acuerdo.contactoComercial.telefono}}</td></tr>
        <tr v-if="!!acuerdo.contactoComercial.municipioId"  ><td>Municipio</td> <td>{{acuerdo.contactoComercial.municipio.label}}</td></tr>
        <tr v-if="!!acuerdo.titulo"                ><td>Titulo</td>    <td>{{acuerdo.titulo}}</td></tr>
        <tr> <td>Creación</td> <td>{{ fechaLarga( acuerdo.fechaCreacion )    }}</td> </tr>
      </table>      
    </div>
  </q-tooltip>
</template>
<script setup lang="ts">
  import {  PropType      } from "vue"  
  import {  fechaLarga,
            formatoPrecio } from "src/useSimpleOk/useTools"
  import {  IAcuerdo      } from "src/areas/acuerdos/models/Acuerdo"  
  import    chipUsuario     from "src/areas/usuarios/components/ChipUsuario.vue";    
  const props = defineProps({
    acuerdo:  { required: true, type: Object as PropType<IAcuerdo> }
  })
</script>