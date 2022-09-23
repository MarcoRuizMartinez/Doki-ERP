<template>
  <q-tooltip  class ="bg-black text-caption">
    <div>
      <table class="tabla-tooltip">
        <tr>
          <td>Ref</td>
          <td>{{ cotizacion.ref }}</td>
        </tr>
        <tr v-if="!!cotizacion.contacto.empresa">
          <td>Empresa</td>
          <td> {{cotizacion.contacto.empresa}}</td>
        </tr>
        <tr>
            <td>Contacto</td>
            <td>{{ cotizacion.contacto.nombreCompleto }}</td>
        </tr>
        <tr>
          <td>Comercial</td>
          <td>
            <q-chip               dense
              color               ="primary"
              text-color          ="white"
              >
              <q-avatar text-color="white" >
                <img :src         ="cotizacion.comercial.fotoPerfilMini">
              </q-avatar>
              {{cotizacion.comercial.nombre}} 
            </q-chip>
          </td>
        </tr>
        <tr> <td>Estado</td> <td>
          <span
            class   ="q-px-xs"
            style   ="border-radius: 6px;"
            :style  ="'background-color: ' + cotizacion.estadoColor"
            >
            {{ cotizacion.estadoLabel }}
          </span>
        </td></tr>
        <tr> <td>Subtotal</td> <td>{{ formatoPrecio( cotizacion.totalConDescu ) }}</td> </tr>
        <tr v-if="!!cotizacion.contacto.correo"       ><td>Correo</td>    <td><div class="ellipsis"> {{cotizacion.contacto.correo}} </div> </td></tr>
        <tr v-if="!!cotizacion.contacto.telefono"     ><td>Teléfono</td>  <td>{{cotizacion.contacto.telefono}}</td></tr>
        <tr v-if="!!cotizacion.contacto.municipioId"  ><td>Municipio</td> <td>{{cotizacion.contacto.municipio.label}}</td></tr>
        <tr v-if="!!cotizacion.titulo"                ><td>Titulo</td>    <td>{{cotizacion.titulo}}</td></tr>
        <tr> <td>Creación</td> <td>{{ fechaLarga( cotizacion.fechaCreacion )    }}</td> </tr>
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
    cotizacion:  { required: true, type: Object as PropType<IAcuerdo> }
  })
</script>