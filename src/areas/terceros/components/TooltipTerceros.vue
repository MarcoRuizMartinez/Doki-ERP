<template>
  <q-tooltip  class ="bg-black text-caption">
    <div>
      <div class="text-bold text-1_2em">{{tercero.nombre}}</div>
      <q-chip               dense
        v-if                ="!!tercero.responsables.length"
        v-for               ="resposable of tercero.responsables"
        color               ="primary"
        text-color          ="white"
        :key                ="resposable.id"
        :tabindex           ="resposable.id"
        >
        <q-avatar text-color="white" >
          <img :src         ="resposable.fotoPerfilMini">
        </q-avatar>
        <b>{{resposable.nombre}}</b> 
      </q-chip>

      <table class="tabla-tooltip">
        <tr>
          <td>Es</td>
          <td>{{ tercero.esProveedor ? "Proveedor" : ""}} {{ tercero.esCliente ? "Cliente" : "" }} {{tercero.areaNombre}}</td>
        </tr>
        <tr v-if="!!tercero.documento.numero">
          <td>{{tercero.documento.tipo.nombre}}</td>
          <td>{{tercero.documento.numero}} {{tercero.documento.digito}}</td>
        </tr>
        <tr v-if="verDatosContacto && !!tercero.telefono">
          <td>Teléfono</td>
          <td>{{tercero.telefono}}</td>
        </tr>
        <tr v-if="verDatosContacto && !!tercero.correo">
          <td>Correo</td>
          <td>{{tercero.correo}}</td>
        </tr>
        <tr v-if="!!tercero.municipio.id">
          <td>Municipio</td>
          <td>{{tercero.municipio.label}}</td>
        </tr>
        <tr v-if="verDatosContacto && !!tercero.direccion">
          <td>Dirección</td>
          <td>{{tercero.direccion}}</td>
        </tr>
        <tr v-if="!!tercero.fechaCreado">
          <td>Creación</td>
          <td>{{tercero.fechaCreadoCorta}}</td>
        </tr>
        <!-- <tr v-if="!!contacto.empresa" >   <td>Empresa</td>    <td>{{contacto.empresa}}         </td></tr> -->
      </table>
    </div>
  </q-tooltip>
</template>
<script setup lang="ts">
  
  import {  computed,
            PropType      } from "vue"  
  import {  ITercero } from "src/areas/terceros/models/Tercero"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs   } from 'pinia'
  import {  useStoreUser  } from 'stores/user'

  const { usuario         } = storeToRefs( useStoreUser() )
  
  const props = defineProps({
    tercero:  { required: true, type: Object as PropType<ITercero> }
  })

  const verDatosContacto    = computed(()=> !usuario.value.esProduccion )
</script>