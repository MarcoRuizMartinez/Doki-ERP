<script setup lang="ts">
  import {  servicesAcuerdos      } from "src/areas/acuerdos/controllers/servicesAcuerdos"
  import {  useTools              } from "src/composables/useTools"
  import    titulo                  from "components/utilidades/Titulo.vue"
  import    efecto                  from "components/utilidades/Efecto.vue"
  import {  TTipoPDF              } from "src/areas/acuerdos/composables/pdf/useCotizacion"
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'  

  const { acuerdo,
          loading,
          modales           } = storeToRefs( useStoreAcuerdo() )  
  const { esMobil, aviso    } = useTools()
  const { setTitulo         } = servicesAcuerdos()

  const emit = defineEmits<{
    (e: 'click',    value: TTipoPDF ): void
    (e: 'recargar',                 ): void
  }>()


  async function editarTitulo( titulo : string ){
    let ok                    = await setTitulo( acuerdo.value.id, titulo, acuerdo.value.tipo )
    aviso("positive", "Titulo editado", "comment")
  }
  
  function clickBtn(){
    emit('click', acuerdo.value.esCotizacion ? 'quote' : 'cuentaCobro')
  }
</script>

<template>
  <titulo
    :color-left               ="acuerdo.estadoColor"
    :color-right              ="acuerdo.estadoColor"  
    >
    <!-- //* ///////////////////////////////////////////////////////// SLOT LEFT -->
    <template                 #left>
      <!-- //* /////////////////////////////////////////////////// Icono Boton Cotizacion -->
      <q-btn                  push dense
        class                 ="q-mr-sm"
        padding               ="0"
        @click                ="clickBtn"
        >
        <!--         
        <q-img
          position            ="0"
          fit                 ="contain"
          spinner-color       ="white"
          width               ="51px"
          height              ="63px"
          
        />
        -->        
        <img
          v-if                ="!!acuerdo.imagen"
          :src                ="`/images/iconos/${acuerdo.imagen}`" />
        <Tooltip
          v-if                ="!acuerdo.esNuevo"
          label               ="Generar PDF"
        />
      </q-btn>
    </template>
    <!-- //* ///////////////////////////////////////////////////////// SLOT CENTER -->
    <template               #center>
      <!-- <fx-out-down-group> -->
      <div
        v-if                ="!!acuerdo.id || acuerdo.esNuevo"
        key                 ="key1"
        class               ="row items-center justify-between q-mr-sm"
        >
        <!-- //* ////////////////////////////////////////////////////// Boton 3D -->
        <q-btn              push no-caps
          padding           ="0"
          @click            ="clickBtn"
          >
          <span class       ="titulo-xl sombra-3d fuente-gruesa text-capitalize">
            {{acuerdo.labelEspecial}}
          </span>
          <Tooltip class="text-capitalize">{{ acuerdo.label }}</Tooltip>
        </q-btn>
        <!-- //* ///////////////////////////////////////////////// Boton listo para despacho -->
        <div
          v-if              ="acuerdo.esPedido && acuerdo.esEstadoValidado"
          class             ="row justify-center items-center gap-sm dense">
          <q-icon
            size            ="lg"            
            :color          ="acuerdo.estadoDespachoColor"
            :name           ="acuerdo.estadoDespachoIcono"
          />
          <span class       =" q-ml-sm text-white text-1_3em">{{ acuerdo.estadoDespachoLabel }}</span>
        </div>
        <!-- //* ////////////////////////////////////////////////////// Titulo  -->
        <div
          v-else-if         ="!acuerdo.esNuevo && !acuerdo.esOCProveedor"
          :style            ="esMobil ? 'order: 3;' : ''"
          >
          <span class       ="q-ma-none q-pa-none op20 titulo-lg">
            {{ !!acuerdo.titulo ? acuerdo.titulo : '. . . .'}}
            <Tooltip :label ="`Titulo de ${acuerdo.label}`"/>
          </span>
          <q-popup-edit     auto-save fit
            v-model         ="acuerdo.titulo"
            v-slot          ="scope"
            class           ="row panel-blur-70 q-col-gutter-xs"
            max-width       ="500px"
            @update:model-value ="editarTitulo"
            >
            <!-- //* ////////////////////////////////////////////////// Editar Titulo -->
            <q-input        dense filled
              v-model       ="scope.value"
              class         ="col-12"
              :label        ="`Titulo de ${acuerdo.tipo}`"
              @keyup.enter  ="scope.set"
            />
          </q-popup-edit> 
        </div>
        <div>
        <!-- //* ////////////////////////////////////////////////////// Ref  -->
        <span
          v-if              ="!acuerdo.esNuevo"
          class             ="fuente-delicada"
          :class            ="[ esMobil ? 'q-ma-none q-pa-none' : 'q-mt-sm', acuerdo.facturado ? 'titulo-md' : 'titulo-lg' ]"
          >
          <a
            :href           ="acuerdo.urlDolibarr"
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
        <div
          v-if              ="acuerdo.facturado"
          class             ="text-1_2em text-right text-uppercase">
          <q-icon name      ="mdi-shield-check" size="sm"/>
          Facturado
        </div>
      </div>
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
          <q-btn            flat dense
            :icon           ="acuerdo.estadoIcono"
            size            ="lg"
            class           ="op90 cursor-pointer"
            padding         ="0"
            @click          ="emit('recargar')"
            >
            <Tooltip label  ="Recargar"/>
          </q-btn>
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