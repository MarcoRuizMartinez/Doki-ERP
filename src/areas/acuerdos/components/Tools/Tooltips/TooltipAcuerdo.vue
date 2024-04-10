<template>
  <q-tooltip 
    class           ="bg-black text-caption">
    <div>
      <table class  ="tabla-tooltip">
        <tr>
          <td class="text-capitalize">
            {{ acuerdo.tipo }}
            {{ acuerdo.emoji }}            
          </td>
          <td>{{ acuerdo.ref }}</td>
        </tr>
        <tr v-if="!!acuerdo.contactoSmart.empresa">
          <td>Empresa</td>
          <td> {{acuerdo.contactoSmart.empresa}}</td>
        </tr>
        <tr v-if="verDatosContacto && !!acuerdo.contactoSmart.id">
            <td>Contacto</td>
            <td>{{ acuerdo.contactoSmart.nombreCompleto }}</td>
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
        <tr v-if="verDatosContacto">                                         <td>Subtotal</td>  <td>{{ Format.precio( acuerdo.totalConDescu ) }}</td> </tr>
        <tr v-if="verDatosContacto && !!acuerdo.contactoSmart.correo"       ><td>Correo</td>    <td><div class="ellipsis"> {{acuerdo.contactoSmart.correo}} </div> </td></tr>
        <tr v-if="verDatosContacto && !!acuerdo.contactoSmart.telefono"     ><td>Teléfono</td>  <td>{{acuerdo.contactoSmart.telefono}}</td></tr>
        <tr v-if="verDatosContacto && !!acuerdo.contactoSmart.municipioId"  ><td>Municipio</td> <td>{{acuerdo.contactoSmart.municipio.label}}</td></tr>
        <tr v-if="!!acuerdo.titulo"                ><td>Titulo</td>    <td>{{acuerdo.titulo}}</td></tr>
        <tr> <td>Creación</td> <td>{{ ToolDate.fechaLarga( acuerdo.fechaCreacion )    }}</td> </tr>
      </table>      
    </div>
  </q-tooltip>
</template>

<script setup lang="ts">
  import {  computed,
            toRefs,
            PropType      } from "vue"  
  import {  ToolDate,
            Format        } from "src/composables/useTools"
  import {  IAcuerdo      } from "src/areas/acuerdos/models/Acuerdo"  
  import    chipUsuario     from "src/areas/usuarios/components/ChipUsuario.vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs   } from 'pinia'
  import {  useStoreUser  } from 'stores/user'

  const { usuario         } = storeToRefs( useStoreUser() )

  const props = defineProps({
    acuerdo:  { required: true, type: Object as PropType<IAcuerdo> }
  })

  const { acuerdo }         = toRefs( props )

  const verDatosContacto    = computed(()=> !(acuerdo.value.esCotizacion && usuario.value.esProduccion) )
</script>