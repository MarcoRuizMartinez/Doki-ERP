<template>
  <ventana                          minimizar
    titulo                          ="Entregas"
    icono                           ="mdi-truck-delivery"
    iconoSinResultados              ="mdi-truck-outline"
    size-icon-carga                 ="10em"
    class-contenido                 ="row"
    padding-contenido               ="0"
    mensaje-sin-resultados          ="Sin entregas"
    :height-card-min                ="expandido ? '240px' : ''"
    :modo                           ="modo"
    :cargando                       ="loading.entregas"
    >
    <!-- //* /////////////////  Botones barra -->
    <template                       #barra>
      <!-- //* ///////////////////////////////////////////////////////////// Boton nueva entrega -->
      <q-btn
        v-bind                      ="style.btnBaseSm"
        label                       ="Nueva entrega"
        color                       ="positive"
        icon                        ="mdi-truck-fast"
        :disable                    ="!acuerdo.puedeCrearNuevoGrupo || acuerdo.esEstadoEdicion"
        @click                      ="emit('clickNuevaEntrega')"
      /> 
      <!-- //* ///////////////////////////////////////////////////////////// Boton expandir -->
      <btn-toggle
        v-model                     ="expandido"
        icon-true                   ="mdi-arrow-collapse"
        icon-false                  ="mdi-arrow-expand"
        msj-true                    ="Colapsar"
        msj-false                   ="Expandir"
        size                        ="sm"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Boton recargar -->
      <q-btn                        
        v-bind                      ="style.btnRedondoFlat2Sm"
        icon                        ="mdi-refresh"
        @click                      ="buscarAcuerdoEnlazados()"
        >
        <Tooltip label              ="Recargar entregas"/>
      </q-btn>   
    </template>
    <q-list class                   ="fit">
      <!-- //* ///////////////////////////////////////////////////////////////  For expansion item -->
      <q-expansion-item             expand-separator default-opened dense expand-icon-toggle dense-toggle
        v-for                       ="(entrega) of acuerdo.entregas"
        v-model                     ="expandido"
        :index                      ="entrega.id"
        header-class                ="bg-gris-dark text-white"
        expand-icon-class           ="q-pr-none text-white"
        >
        <!-- //* ///////////////////////////////////////////////////////////// Slot cabezote expansion item-->
        <template                   #header>
          <botonera
            :entrega                ="entrega"
            @solicitar-recarga      ="buscarAcuerdoEnlazados()"
            @entrega-cerrada        ="emit('entregaCerrada')"
            @click-remision         ="emit('clickRemision', entrega)"
            @click-rotulo           ="emit('clickRotulo',   [entrega])"
          />
        </template>
        <!-- //* ///////////////////////////////////////////////////////////// Contenido   -->
        <div    class               ="row">
          <!-- //* /////////////////////////////////////////////////////////// Lado Productos   -->          
          <div  class               ="col-md-5 col-12 order-1">
            <productos :entrega     ="entrega"/>
          </div>
          <!-- //* /////////////////////////////////////////////////////////// Lado Datos  row justify-center full-width -->
          <div  class               ="col-md-7 col-12 row lado-gris-oscuro order-2">
            <div class              ="col-md-7 col-12 column">
              <!-- //* ////////////////////////////////////////////////////////// Info de envio -->
              <tabla-envio          dark
                :acuerdo            ="entrega"
              />
            </div>
            <!-- //* /////////////////////////////////////////////////////////// Lado Inputs   -->
            <div  class             ="col-md-5 col-12 lado-gris-claro">
              <div class            ="row justify-center q-mb-sm">
                <comentarios
                  :entrega          ="entrega"
                />
                <!-- //* ////////////////////////////////////////////////////////// Boton Remision -->
                <q-btn
                  v-if              ="!!entrega.contactoEntrega.id"
                  v-bind            ="style.btnFlatMd"
                  color             ="grey-4"
                  icon              ="mdi-signature-freehand"
                  label             ="Remisión"
                  :loading          ="loading.editar"
                  @click            ="emit('clickRemision', entrega)"
                />
                <!-- //* ////////////////////////////////////////////////////////// Boton Rotulo -->
                <q-btn 
                  v-if              ="!!entrega.contactoEntrega.id"
                  v-bind            ="style.btnFlatMd"
                  color             ="grey-4"
                  icon              ="mdi-barcode-scan"
                  label             ="Rotulo"
                  :loading          ="loading.editar"                
                  @click            ="emit('clickRotulo', [entrega])"
                />
              </div>
              <div class            ="invertir column gap-sm">
                <inputs-entrega
                  :entrega          ="entrega"
                />
              </div>
            </div>
          </div>
        </div>
      </q-expansion-item>
    </q-list>
  </ventana>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref, computed, provide} from "vue"  

  //* ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'         
  import {  useStoreUser          } from 'stores/user'                   
  import {  useStoreAcuerdo       } from 'stores/acuerdo'

  //* /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAcuerdo              } from "../../models/Acuerdo"
  import {  IAccion, Accion       } from "src/areas/comunicacion/models/Accion"  

  //* ///////////////////////////////////////////////////////////////////////////// Componibles  
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  style                 } from "src/composables/useEstilos"
  import {  dexieTransportadoras,
            dexieMetodosEntrega   } from "src/composables/useDexie"

  //* ///////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"  
  import    btnToggle               from "components/utilidades/BtnToggle.vue"
  import    tablaEnvio              from "src/areas/acuerdos/components/Tools/TablaEnvio.vue"   
  import    botonera                from "./../Entregas/BotoneraExpansionItem.vue"
  import    productos               from "./../Entregas/ProductosAEnviar.vue"
  import    inputsEntrega           from "./../Entregas/InputDeEntrega.vue"
  import    comentarios             from "./../Entregas/ComentariosEntrega.vue"

  type TEmit                  = {
    clickNuevaEntrega : [ value : void        ]
    clickRemision     : [ value : IAcuerdo    ]
    clickRotulo       : [ value : IAcuerdo[]  ]
    entregaCerrada    : [ value : void        ]
  }  

  const emit                  = defineEmits<TEmit>()

  const { acuerdo, loading        } = storeToRefs( useStoreAcuerdo() )
  const { usuario                 } = storeToRefs( useStoreUser() )
  const { buscarAcuerdoEnlazados  } = useControlAcuerdo()

  const expandido                   = ref<boolean>(true)    

  dexieTransportadoras()
  dexieMetodosEntrega()

  const accion : IAccion            = new Accion( usuario.value.id )
        accion.asignado             = usuario.value
        accion.terceroId            = acuerdo.value.tercero.id
        accion.tipo                 = "shipping"
        accion.codigo               = "AC_OTH_AUTO"

  provide("accion", accion)

  const modo = computed(()=> {
    if(loading.value.enlaces)
      return "buscando"

    if(!!acuerdo.value.entregas.length)
      return "normal"

    return "sin-resultados"
  })
</script>

<style scoped>
.lado-gris-claro{
  padding: 6px 16px;
  border-left: 1px solid #525252;
}

.lado-gris-oscuro{
  background-color: #484848;
  color: white;
  padding: 10px;
  box-shadow: inset 0px 1px 3px 3px #363636;
}
.invertir{
  filter: invert(82%);
}    
</style>