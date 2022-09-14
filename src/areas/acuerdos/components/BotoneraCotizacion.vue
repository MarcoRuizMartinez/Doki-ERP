<template>
  <barra  class             ="row justify-end gap-sm">
    <efecto-grupo efecto    ="Down">
      <!-- //* //////////////////////////////////////////////////////////  Boton PDF -->
      <q-btn
        v-if                ="acuerdo.estado !== ESTADO_CTZ.BORRADOR"
        v-bind              ="btnBaseMd"
        color               ="primary"
        icon                ="mdi-pdf-box"
        :label              ="esMobil ? '' : 'PDF'"
        :disable            ="cargandoAlgo"
        :loading            ="loading.pdf"
        @click              ="emit('clickPDF')"
        >
        <Tooltip label      ="Generar PDF" :hide="loading.pdf"/>
      </q-btn>
    </efecto-grupo>
    <!-- <efecto efecto          ="Down"> -->
      <q-btn-group  v-if    ="acuerdo.estado === ESTADO_CTZ.COTIZADO">
        <!-- //* //////////////////////////////////////////////////////////  Boton Aprobar -->
        <q-btn 
          v-if              ="!acuerdo.esTerceroCtz"
          v-bind            ="btnBaseMd"
          color             ="positive"
          icon              ="mdi-handshake"
          :label            ="esMobil ? '' : 'Aprobar'"
          :disable          ="cargandoAlgo"
          :loading          ="loading.aprobar"
          @click            ="emit('clickAprobar')"
          >
          <Tooltip label    ="Aprobar cotización"/>
        </q-btn>
        <!-- //* //////////////////////////////////////////////////////////  Boton Anular -->
        <q-btn 
          v-bind            ="btnBaseMd"
          color             ="deep-purple-10"
          icon              ="mdi-snowflake"
          :label            ="esMobil ? '' : 'Anular'"
          :disable          ="cargandoAlgo"
          :loading          ="loading.anular"
          >
          <confirmar  @ok   ="emit('clickAnular')" :con-label="!esMobil"/>
          <Tooltip label    ="Anular cotización"/>
        </q-btn>
      </q-btn-group>
    <!-- </efecto> -->
    <!-- //* ////////////////////////////////////////////////////////// Boton Validar -->
    <q-btn
      v-if                  ="acuerdo.estado === ESTADO_CTZ.BORRADOR"
      v-bind                ="btnBaseMd"
      color                 ="positive"
      icon                  ="mdi-check-circle-outline"
      :label                ="esMobil ? '' : 'Validar'"
      :disable              ="cargandoAlgo
                              || !acuerdo.proGrupos.length
                              || !acuerdo.proGrupos[0].productos.length
                              || (!acuerdo.contacto.id && (acuerdo.tercero.esEmpresa || acuerdo.esTerceroCtz))
                            "
      :loading              ="loading.validar"
      @click                ="emit('clickValidar')"
      >
      <Tooltip label        ="Validar"/>
    </q-btn>
    <!-- //* ////////////////////////////////////////////////////////// Boton Editar -->
    <q-btn
      v-if                  ="acuerdo.estado !== ESTADO_CTZ.BORRADOR && acuerdo.estado !== ESTADO_CTZ.FACTURADO"
      v-bind                ="btnBaseMd"
      color                 ="positive"
      icon                  ="mdi-square-edit-outline"
      :label                ="esMobil ? '' : 'Editar'"
      :disable              ="cargandoAlgo"
      :loading              ="loading.editar"
      @click                ="emit('clickEditar')"
      >
      <Tooltip label        ="Editar"/>
    </q-btn>
    <!-- //* ////////////////////////////////////////////////////////// Boton borrar -->
    <q-btn
      v-bind                ="btnBaseMd"
      color                 ="negative"
      icon                  ="mdi-trash-can"
      :label                ="esMobil ? '' : 'Borrar'"
      :disable              ="cargandoAlgo || acuerdo.vinculado"
      :loading              ="loading.borrar"
      >
      <confirmar  @ok       ="emit('clickBorrar')" :con-label="!esMobil"/>
      <Tooltip label        ="Borrar"/>
    </q-btn>
  </barra>    
</template>
<script lang="ts" setup>
  import {  toRefs, PropType, computed } from "vue"
  import    efecto            from "components/utilidades/Efecto.vue"
  import    efectoGrupo       from "components/utilidades/EfectoGrupo.vue"
  import    barra             from "components/utilidades/Barra.vue"
  import    confirmar         from "components/utilidades/MenuConfirmar.vue"
  import {  useTools        } from "src/useSimpleOk/useTools"
  import {  btnBaseMd       } from "src/useSimpleOk/useEstilos"
  import {  ESTADO_CTZ      } from "src/areas/acuerdos/cotizaciones/models/Cotizacion"
  import {  ILoading        } from "src/models/TiposVarios"
  import {  ICotizacion     } from "src/areas/acuerdos/cotizaciones/models/Cotizacion"
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'  

  const storeAcuerdo          = useStoreAcuerdo()
  const { acuerdo,
          loading           } = storeToRefs(storeAcuerdo)  

  const {  esMobil    } = useTools()
  const emit            = defineEmits(["clickPDF","clickAprobar", "clickAnular", "clickValidar", "clickEditar", "clickBorrar"])
  const cargandoAlgo    = computed(()=> Object.values(loading.value).some( ( estado : boolean )=> !!estado ) )

</script>