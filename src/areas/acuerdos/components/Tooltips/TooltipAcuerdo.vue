<template>
  <q-tooltip  class ="bg-black text-caption">
    <div>
      <table class="tabla-tooltip">
        <tr>
          <td>Ref</td>
          <td>{{ acuerdo.ref }}</td>
        </tr>
        <tr v-if="!!acuerdo.contacto.empresa">
          <td>Empresa</td>
          <td> {{acuerdo.contacto.empresa}}</td>
        </tr>
        <tr>
            <td>Contacto</td>
            <td>{{ acuerdo.contacto.nombreCompleto }}</td>
        </tr>
        <tr>
          <td>Comercial</td>
          <td>
            <q-chip               dense
              color               ="primary"
              text-color          ="white"
              >
              <q-avatar text-color="white" >
                <img :src         ="acuerdo.comercial.fotoPerfilMini">
              </q-avatar>
              {{acuerdo.comercial.nombre}} 
            </q-chip>
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
        <tr v-if="!!acuerdo.contacto.correo"       ><td>Correo</td>    <td><div class="ellipsis"> {{acuerdo.contacto.correo}} </div> </td></tr>
        <tr v-if="!!acuerdo.contacto.telefono"     ><td>Teléfono</td>  <td>{{acuerdo.contacto.telefono}}</td></tr>
        <tr v-if="!!acuerdo.contacto.municipioId"  ><td>Municipio</td> <td>{{acuerdo.contacto.municipio.label}}</td></tr>
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

  const props = defineProps({
    acuerdo:  { required: true, type: Object as PropType<IAcuerdo> }
  })
</script>