<template>
  <ventana                      minimizar
    titulo                      ="Entregas"
    icono                       ="mdi-truck-delivery"
    iconoSinResultados          ="mdi-truck-outline"
    size-icon-carga             ="10em"
    class-contenido             ="row"
    padding-contenido           ="0"
    mensaje-sin-resultados      ="Sin entregas"
    :modo                       ="modo"
    >
    <!-- //* /////////////////  Botones barra -->
    <template                   #barra>
      <!-- //* ///////////////////////////////////////////////////////////// Boton nuevo grupo   -->
      <q-btn
        v-bind                  ="style.btnBaseSm"
        label                   ="Nueva entrega"
        color                   ="positive"
        icon                    ="mdi-truck-fast"
        :disable                ="!acuerdo.puedeCrearNuevoGrupo"
        @click                  ="emit('clickNuevaEntrega')"
      />
      <q-btn                    round dense flat
        icon                    ="mdi-refresh"
        class                   ="op60 op100-hover"
        @click                  ="buscarAcuerdoEnlazados( true )"
        >
        <Tooltip label          ="Recargar entregas"/>
      </q-btn>   
    </template>
    <q-list class               ="fit">
      <!-- //* ///////////////////////////////////////////////////////////////  For expansion item -->
      <q-expansion-item         expand-separator default-opened dense expand-icon-toggle dense-toggle
        v-for                   ="(entrega, index) of acuerdo.entregas"
        :index                  ="entrega.id"
        header-class            ="bg-gris-dark text-white"
        expand-icon-class       ="q-pr-none text-white"
        >
        <!-- //* ///////////////////////////////////////////////////////////// Slot cabezote expansion item-->
        <template               #header>
          <q-item-section       avatar class="hidden"></q-item-section>
          <q-item-section>
            <div class=         "row items-center h-40px full-width">
              <ref-acuerdo      ref-larga white
                class           ="col-auto"
                :acuerdo        ="entrega"
              />
              <span class       ="col text-center">{{ entrega.metodoEntrega.label }}</span>
            </div>
          </q-item-section>
          <q-item-section       side>
            <div class          ="row items-center">
              <span class       ="q-mr-sm text-grey-5">
                {{ entrega.contactoEntrega.municipio.label }}
              </span>
              <!-- //* /////////////////////////////////////////////////////// Boton agregar producto  -->
              <estado :acuerdo  ="entrega" con-icono/>
            </div>
          </q-item-section>
        </template>
        <!-- //* ///////////////////////////////////////////////////////////// Contenido   -->
        <div    class           ="row">
          <!-- //* /////////////////////////////////////////////////////////// Lado Izquierdo   -->
          <div  class           ="col-6">
            <!-- //* ///////////////////////////////////////////////////////// Tabla productos  -->
            <q-table            bordered dense flat hide-bottom
              class             ="fit tabla-maco"
              row-key           ="lineaId"
              :rows             ="entrega.productos"
              :columns          ="columnas"
              >
              <!-- //* ///////////////  Columna ref  -->
              <template #body-cell-ref="props">
                <q-td   :props  ="props" class="text-0_8em q-ma-none q-pa-none">
                  <imagen-producto    float mini
                    class       ="col-shrink q-mr-sm"
                    :linea      ="props.row"
                  />
                  <div class="row q-ma-none q-pa-none">
                    <div class="col-8 q-ma-none q-pa-none">
                      <span class   ="fuente-mono">{{props.row.qtyDeTotal}}</span> 
                      <span class   ="text-bold q-ml-sm">{{props.row.ref}}</span>
                    </div>
                    <div class="col-4 text-grey-7 text-0_8em text-right q-ma-none q-pa-none">
                      {{props.row.bodega.label}}
                      <q-icon name  ="mdi-home-city"/>
                      <Tooltip :label="'Bodega: ' + props.row.bodega.label"/>
                    </div>
                  </div>
                  <div>{{props.row.nombre}}</div>
                </q-td>
              </template>
            </q-table>
          </div>
          <!-- //* /////////////////////////////////////////////////////////// Lado derecho   -->
          <div  class             ="col-6 side-left">
            <div class            ="row justify-center full-width">
              <!-- //* ////////////////////////////////////////////////////////// Boton Remision -->            
              <q-btn              dense
                v-if              ="!!entrega.contactoEntrega.id"
                v-bind            ="style.btnFlatMd"
                color             ="grey-4"
                icon              ="mdi-pdf-box"
                label             ="Remisión"
                :loading          ="loading.editar"
                @click            ="emit('clickRemision', entrega)"
              />
              <!-- //* ////////////////////////////////////////////////////////// Boton Rotulo -->
              <q-btn              dense
                v-if              ="!!entrega.contactoEntrega.id"
                v-bind            ="style.btnFlatMd"
                color             ="grey-4"
                icon              ="mdi-pdf-box"
                label             ="Rotulo"
                :loading          ="loading.editar"                
              />
            </div>
            <!-- //* ////////////////////////////////////////////////////////// Info de envio -->
            <tabla-envio        dark
              :acuerdo          ="entrega"
            />
          </div>
        </div>
      </q-expansion-item>
    </q-list>
  </ventana>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  computed              } from "vue"
  //* ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'  
  //* /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  ModosVentana          } from "src/models/TiposVarios"
  import {  IColumna,
            Columna               } from "src/models/Tabla"
  import {  IAcuerdo              } from "../models/Acuerdo"  
  //* ///////////////////////////////////////////////////////////////////////////// Componibles  
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  style                 } from "src/useSimpleOk/useEstilos"
  //* ///////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    refAcuerdo              from "./Busqueda/Columnas/RefAcuerdo.vue"
  import    estado                  from "./Busqueda/Columnas/Estado.vue"
  import    imagenProducto          from "./TablaProductos/Columnas/ImagenProducto.vue"
  import    tablaEnvio              from "src/areas/acuerdos/components/tools/TablaEnvio.vue" 

  const emit                  = defineEmits<{
    (e: "clickNuevaEntrega",        ): void
    (e: "clickRemision",    value: IAcuerdo   ): void
    (e: "clickRotulo",      value: IAcuerdo[] ): void
  }>()

  const { acuerdo, loading        } = storeToRefs( useStoreAcuerdo() )  
  const { buscarAcuerdoEnlazados  } = useControlAcuerdo()

  const modo = computed(()=> {
    if(loading.value.enlaces)
      return "buscando"

    if(!!acuerdo.value.entregas.length)
      return "normal"

    return "sin-resultados"
  })

  const columnas: IColumna[]  = [
    new Columna({ name: "ref",        label: "Producto"  })
  ]
</script>
<style>
.side-left{
  background-color: #484848;
  color: white;
  padding: 10px;
  box-shadow: inset 0px 1px 3px 3px #363636;
}
</style>