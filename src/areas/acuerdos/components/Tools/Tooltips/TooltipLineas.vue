<script setup lang="ts">
  import {  PropType      } from "vue"
  import {  ILineaAcuerdo } from "src/areas/acuerdos/models/LineaAcuerdo"
  const props = defineProps({
    lineas:  { required: true, type: Object as PropType<ILineaAcuerdo[]> }
  })
</script>

<template>
  <q-tooltip  class="bg-black text-caption">
    <div class="tool-terc text-subtitle2">
      <table>
        <tr>
          <th></th>
          <th>Productos</th>
        </tr>
        <tr
          v-for   ="(linea, index) of lineas.filter(( l )=> l.tipo !== 9)"
          :index  ="index"
          >
          <td>
            <div class="qty" >
              {{linea.qty}}
              <template v-if="linea.qtyTotal >= 1">
              de {{ linea.qtyTotal }}
              </template>
            </div>
          </td>
          <td><div class="ellipsis linea">x {{linea.nombre}}</div></td>
        </tr>
        <!--<tr> <td><b>Subtotal :  </b> </td> <td>{{ Format.precio( cotizacion.totalConDescu ) }}</td> </tr>
        <tr v-if="!!cotizacion.contacto.correo"       ><td><b>Correo :    </b></td> <td> {{cotizacion.contacto.correo}}  </td></tr>
        <tr> <td><b>Creación :</b> </td> <td>{{ fechaLarga( cotizacion.fechaCreacion )    }}</td> </tr> -->
      </table>
    </div>
  </q-tooltip>
</template>

<style>

.qty{
  text-align: right;
  min-width: max-content;
}

.linea{
  max-width: 260px;
}

.tool-terc{
  max-width: 320px;
}
/* min-width: 40px; */
</style>