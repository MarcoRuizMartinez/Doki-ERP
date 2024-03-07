<template>
  <ventana                          minimizar
    titulo                          ="Entregas"
    icono                           ="mdi-truck-delivery"
    iconoSinResultados              ="mdi-truck-outline"
    size-icon-carga                 ="10em"
    class-contenido                 ="row"
    padding-contenido               ="0"
    mensaje-sin-resultados          ="Sin entregas"
    :modo                           ="modo"
    >
    <!-- //* /////////////////  Botones barra -->
    <template                       #barra>
      <!-- //* ///////////////////////////////////////////////////////////// Boton nuevo grupo   -->
      <q-btn
        v-bind                      ="style.btnBaseSm"
        label                       ="Nueva entrega"
        color                       ="positive"
        icon                        ="mdi-truck-fast"
        :disable                    ="!acuerdo.puedeCrearNuevoGrupo"
        @click                      ="emit('clickNuevaEntrega')"
      /> 
      <btn-toggle
        v-model                     ="expandido"
        icon-true                   ="mdi-arrow-collapse"
        icon-false                  ="mdi-arrow-expand"
        msj-true                    ="Colapsar"
        msj-false                   ="Expandir"
        size                        ="sm"
        @click  ="console.log('hdhd')"
      />
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
        v-for                       ="(entrega, index) of acuerdo.entregas"
        v-model                     ="expandido"
        :index                      ="entrega.id"
        header-class                ="bg-gris-dark text-white"
        expand-icon-class           ="q-pr-none text-white"
        >
        <!-- //* ///////////////////////////////////////////////////////////// Slot cabezote expansion item-->
        <template                   #header>          
          <q-item-section class     ="col">
            <div class              ="row items-center justify-between h-40px full-width">
              <ref-acuerdo          ref-larga white
                class               ="col-2"
                :acuerdo            ="entrega"
              />
              <span class           ="col-2 text-center">{{ entrega.metodoEntrega.label }}</span>
              <span class           ="col-2 q-mr-sm text-grey-5">
                {{ entrega.contactoEntrega.municipio.label }}
              </span>
              <!-- //* /////////////////////////////////////////////////////// Boton agregar producto  -->
              <div class            ="col-shrink">
                <estado             con-icono                  
                  :acuerdo          ="entrega"
                />
              </div>
            </div>
          </q-item-section>
          <q-item-section           side>
          </q-item-section>
        </template>
        <!-- //* ///////////////////////////////////////////////////////////// Contenido   -->
        <div    class               ="row">
          <!-- //* /////////////////////////////////////////////////////////// Lado Productos   -->
          <div  class               ="col-md-5 col-12 order-1">
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
                  <imagen-producto    float
                    class       ="col-shrink q-mr-sm"
                    size        ="xs"
                    :imagen     ="props.row.img"
                    :nombre     ="props.row.nombre"
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
          <!-- //* /////////////////////////////////////////////////////////// Lado Datos  row justify-center full-width -->
          <div  class               ="col-md-7 col-12 row lado-gris-oscuro order-2">
            <!-- //* ////////////////////////////////////////////////////////// Info de envio -->
            <tabla-envio            dark
              class                 ="col-md-7 col-12"
              :acuerdo              ="entrega"
            />
            <!-- //* /////////////////////////////////////////////////////////// Lado Inputs   -->
            <div  class             ="col-md-5 col-12 lado-gris-claro"> 
              <!-- //* ////////////////////////////////////////////////////////// Boton Remision -->            
              <q-btn
                v-if                ="!!entrega.contactoEntrega.id"
                v-bind              ="style.btnFlatMd"
                color               ="grey-4"
                icon                ="mdi-pdf-box"
                label               ="Remisión"
                :loading            ="loading.editar"
                @click              ="emit('clickRemision', entrega)"
              />
              <!-- //* ////////////////////////////////////////////////////////// Boton Rotulo -->
              <q-btn 
                v-if                ="!!entrega.contactoEntrega.id"
                v-bind              ="style.btnFlatMd"
                color               ="grey-4"
                icon                ="mdi-pdf-box"
                label               ="Rotulo"
                :loading            ="loading.editar"                
              />
              <div class            ="invertir column gap-sm">
                <select-contacto    tipo-entrega hundido
                  v-model:contacto  ="entrega.contactoEntrega"
                  label             ="Contacto entregas"
                  icon              ="mdi-account"
                  :quitar-contacto  ="!acuerdo.esEntrega"
                  :tercero          ="acuerdo.tercero"
                  :disable          ="!acuerdo.tercero.id"
                />
                <select-label-value hundido
                  v-model           ="entrega.metodoEntrega"
                  label             ="Método de entrega"
                  icon              ="mdi-truck-delivery"
                  error-message     ="Indique un método de entrega"
                  :options          ="metodosEntrega"
                  :loading          ="loading.metodoEntrega"
                />                
                <select-label-value alerta hundido
                  v-model           ="entrega.transportadora"
                  label             ="Transportadora"
                  icon              ="mdi-truck"
                  class             ="col-md-6 col-12"
                  :options          ="transportadoras"
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
  import {  ref,
            computed              } from "vue"
  import {  QExpansionItem        } from "quasar"            
  //* ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'stores/acuerdo'
  import {  useStoreDexie         } from 'stores/dexieStore'  
  //* /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IColumna,
            Columna               } from "src/models/Tabla"
  import {  IAcuerdo              } from "../../models/Acuerdo"  
  //* ///////////////////////////////////////////////////////////////////////////// Componibles  
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  style                 } from "src/composables/useEstilos"
  import {  dexieTransportadoras,
            dexieMetodosEntrega   } from "src/composables/useDexie"
  //* ///////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    refAcuerdo              from "src/areas/acuerdos/components/Tools/RefAcuerdo.vue"
  import    estado                  from "src/areas/acuerdos/components/Tools/Estado.vue"
  import    imagenProducto          from "src/areas/productos/components/Tools/ImagenProducto.vue"
  import    tablaEnvio              from "src/areas/acuerdos/components/Tools/TablaEnvio.vue" 
  import    selectContacto          from "src/areas/terceros/components/contactos/SelectContacto.vue"
  import    selectLabelValue        from "components/utilidades/select/SelectLabelValue.vue"
  import    btnToggle               from "components/utilidades/BtnToggle.vue"


  const emit                  = defineEmits<{
    (e: "clickNuevaEntrega",                  ): void
    (e: "clickRemision",    value: IAcuerdo   ): void
    (e: "clickRotulo",      value: IAcuerdo[] ): void
  }>()

  const { acuerdo, loading        } = storeToRefs( useStoreAcuerdo() )
  const { transportadoras,
          metodosEntrega          } = storeToRefs( useStoreDexie() )  
  const { buscarAcuerdoEnlazados  } = useControlAcuerdo()
  const expandido                   = ref<boolean>(true)

  dexieTransportadoras()
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

  /*
{
  "user_author_id": "1",  
  "socid": "7",  
  "origin_type": "commande",
  "origin": "commande",
  "origin_id": "12327",
  "lines": [
    {
      "origin_line_id": "24874",
      "qty": "1"
    }
  ], 
  "array_options": {
    "options_comercial_id": "14"
  }  
}
  */
</script>
<style scoped>
.lado-gris-claro{
  padding: 16px;
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