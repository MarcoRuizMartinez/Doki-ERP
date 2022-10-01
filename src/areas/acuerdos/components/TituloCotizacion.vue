<template>
  <titulo
    :color-left               ="acuerdo.estadoColor"
    :color-right              ="acuerdo.estadoColor"  
    >
    <!-- //* ///////////////////////////////////////////////////////// SLOT LEFT -->
    <template #left>
      <!-- //* /////////////////////////////////////////////////// Icono Boton Cotizacion -->
      <q-btn                  push dense
        class                 ="q-mr-sm"
        padding               ="0"
        @click                ="emit('click')"
        >
        <q-img
          position            ="0"
          fit                 ="contain"
          spinner-color       ="white"
          width               ="51px"
          height              ="63px"
          src                 ="images/iconos/iconoCotizacion.webp"
        />
        <Tooltip
          v-if                ="!acuerdo.esNuevo"
          label               ="Generar PDF"
        />
      </q-btn>
    </template>
    <!-- //* ///////////////////////////////////////////////////////// SLOT CENTER -->
    <template                 #center>
      <!-- <fx-out-down-group> -->
      <div
        v-if                ="!!acuerdo.id || acuerdo.esNuevo"
        key                 ="key1"
        class               ="row items-center justify-between q-mr-sm"
        >
        <!-- //* ////////////////////////////////////////////////////// Boton 3D Cotizacion -->
        <q-btn              push no-caps
          padding           ="0"
          @click            ="emit('click')"
          >
          <span class       ="titulo-xl sombra-3d fuente-gruesa">
            Cotizacíon
          </span>
        </q-btn>
        <!-- //* ////////////////////////////////////////////////////// Titulo Cotizacion -->
        <div
          v-if              ="!acuerdo.esNuevo"
          :style            ="esMobil ? 'order: 3;' : ''"
          >
          <span class       ="q-ma-none q-pa-none op20 titulo-lg">
            {{ !!acuerdo.titulo ? acuerdo.titulo : '. . . .'}}
            <Tooltip label  ="Titulo cotizacion"/>
          </span>
          <q-popup-edit     auto-save fit
            v-model         ="acuerdo.titulo"
            v-slot          ="scope"
            class           ="row panel-blur70 q-col-gutter-xs"
            max-width       ="500px"
            @update:model-value ="editarTitulo"
            >
            <!-- //* ////////////////////////////////////////////////// Editar Titulo Cotizacion -->
            <q-input        dense filled
              v-model       ="scope.value"
              label         ="Títulos de cotizacion"
              class         ="col-12"
              @keyup.enter  ="scope.set"
            />
          </q-popup-edit> 
        </div>
        <!-- //* ////////////////////////////////////////////////////// Ref Cotizacion -->
        <span
          v-if              ="!acuerdo.esNuevo"
          class             ="fuente-delicada titulo-lg"
          :class            ="esMobil ? 'q-ma-none q-pa-none' : 'q-mt-sm'"
          >
          <a
            :href           ="urlDolibarr + '/comm/propal/card.php?id=' + acuerdo.id"
            target          ="_blank"
            >
            {{acuerdo.ref}}
            <Tooltip label  ="Ir a Dolibarr" />
          </a>
          <!--
          <q-btn                  round flat
            icon                  ="mdi-refresh"
            padding               ="0"
            class                 ="op40 op100-hover"
            :disable              ="loading.carga"              
            :loading              ="loading.carga"
            @click                ="emit('recargar')"
            >
            <Tooltip label        ="Recargar"/>
          </q-btn>
          -->
        </span>
      </div>
      <!-- //* ///////////////////////////////////////////////////////// Spiner cargando -->
      <div
        v-else
        class               ="row justify-center"
        key                 ="spiner"
        >
        <q-spinner-dots
          color             ="white"
          class             ="spinner"
          size              ="6em"
        />
      </div>
      <!-- </fx-out-down-group> -->
    </template>
    <!-- //* ///////////////////////////////////////////////////////// SLOT RIGHT estado -->
    <template               #right>
      <efecto efecto        ="UpDown">
        <div
          v-if              ="!!acuerdo.id || acuerdo.esNuevo"
          class             ="column items-center q-pt-sm q-pl-sm"
          >
          <!-- //* ///////////////////////////////////////////////////// Icono Estado -->
          <q-icon
            size            ="lg"
            class           ="op90"
            :name           ="acuerdo.estadoIcono"
          />
          <!-- //* ///////////////////////////////////////////////////// Label Estado -->
          <span
            class           ="text-sombra-suave"
            :class          ="esMobil ? 'text-14px' : 'text-20px'"
            >
            {{acuerdo.estadoLabel}}
          </span>
        </div>
      </efecto>
    </template>
  </titulo>
</template>
<script setup lang="ts">
  import {  servicesCotizaciones  } from "src/areas/acuerdos/cotizaciones/services/servicesCotizaciones"
  import {  useTools              } from "src/useSimpleOk/useTools"
  import    titulo                  from "components/utilidades/Titulo.vue"
  import    efecto                  from "components/utilidades/Efecto.vue"
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'  

  const { acuerdo           } = storeToRefs( useStoreAcuerdo() )  
  const { esMobil, aviso    } = useTools()
  const { setTitulo         } = servicesCotizaciones()
  const   urlDolibarr         = process.env.URL_DOLIBARR

  const emit                  = defineEmits(["click", "recargar"])

  async function editarTitulo( titulo : string )
  {
    let ok                    = await setTitulo( acuerdo.value.id, titulo )
    aviso("positive", "Titulo editado", "comment")
  }
</script>
<style>

</style>
