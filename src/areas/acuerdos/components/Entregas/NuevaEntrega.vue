<template>
  <ventana                      cerrar
    titulo                      ="Nueva entrega"
    icono                       ="mdi-truck-delivery"      
    size-icon-carga             ="10em"
    class-contenido             ="row"
    padding-contenido           ="0"
    style                       ="width: 800px !important;"     
    >
    <template                   #menu>
      <div class                ="row fit q-col-gutter-sm">
        <!-- //* ///////////////////////////////////////////////// Contacto entrega -->
        <div class              ="col-6">
          <select-contacto      tipo-entrega hundido
            v-model:contacto    ="acuerdo.contactoEntrega"
            label               ="Contacto entrega"
            icon                ="mdi-truck-delivery"
            :quitar-contacto    ="!acuerdo.esEntrega"
            :tercero            ="acuerdo.tercero"
            :disable            ="!acuerdo.tercero.id"
          />
        </div>
        <!-- //* ///////////////////////////////////////////////// Metodo entrega -->
        <div class              ="col-6">
          <select-label-value   hundido
            v-model             ="acuerdo.metodoEntrega"
            label               ="Método de entrega"
            icon                ="mdi-truck-delivery"
            error-message       ="Indique un método de entrega"
            :options            ="metodosEntrega"
            :loading            ="loading.metodoEntrega"
          />
        </div>
      </div>
    </template>
    <q-table                    dense flat square hide-bottom wrap-cells
      table-header-class        ="bg-gris text-grey-10"
      class                     ="fit"            
      row-key                   ="lineaId"
      :rows                     ="acuerdo.productos.filter( p => p.esProducto )"
      :rows-per-page-options    ="[200, 400]"
      :columns                  ="columnas"
      >
      <!-- //* ////////////////////////////////////////////////////////////// Imagen y Nombre -->
      <template #body-cell-ref  ="props">
        <q-td 
          :props                ="props"
          :class                ="props.row.class"
          >
          <div class            ="row">
            <!-- //* //////////////////////////////////////////////////////// Imagen -->
            <imagen-producto
              size              ="sm"
              class             ="col-shrink q-mr-sm"
              :class            ="!!props.row.qtyAEntregar ? 'op100' : 'op40'"
              :imagen           ="props.row.img"
              :nombre           ="props.row.nombre"
            />
            <!-- //* //////////////////////////////////////////////////////// Nombre-->
            <div
              class             ="width300 lh_1_3"
              :class            ="!!props.row.qtyAEntregar ? 'text-black' : 'text-grey-4'"
              >
              <span class       ="text-bold q-mr-xs">
                {{ props.row.ref }}
              </span>
              <span>
                {{ props.row.nombre }} {{props.row.qty}}
              </span>
            </div>
          </div>
        </q-td>
      </template>
      <!-- //* ////////////////////////////////////////////////////////////// Cantidad a enviar -->
      <template #body-cell-qtyAEntregar="props">
        <q-td :props            ="props">
          <div class            ="row justify-center items-center width200">
            <div>
              <q-btn
                v-bind          ="style.btnRedondoFlatSm"
                icon            ="mdi-close"
                :color          ="!!props.row.qtyAEntregar ? 'grey-6' : 'red'"
                @click          ="props.row.qtyAEntregar = 0"
                >
                <Tooltip label  ="No entregar"/>
              </q-btn>
            </div>
            <numero-paso
              v-model           ="props.row.qtyAEntregar"            
              modo              ="right"
              class             ="width120"
              :minimo           ="0"
              :maximo           ="props.row.qtyMaximoEntregar"
            />
            <div>
              <q-btn
                v-bind          ="style.btnRedondoFlatSm"
                icon            ="mdi-check"
                :color          ="props.row.qtyAEntregar === props.row.qtyPendiente ? 'green' : 'grey-6'"
                @click          ="props.row.qtyAEntregar = props.row.qtyMaximoEntregar"
                >
                <Tooltip label  ="Entregar completo"/>
              </q-btn>
            </div>          
          </div>
        </q-td>
      </template>      
    </q-table>
  </ventana>
</template>
<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////// Core
  import {  onMounted             } from "vue"
  //* ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'      
  import {  useStoreAcuerdo       } from 'stores/acuerdo'
  import {  useStoreDexie         } from 'stores/dexieStore'
  //* /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IColumna,
            Columna               } from "src/models/Tabla"
  //* ///////////////////////////////////////////////////////////////////////////// Componibles  
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  style                 } from "src/composables/useEstilos"
  import {  dexieMetodosEntrega   } from "src/composables/useDexie"

  //* ///////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    imagenProducto          from "src/areas/productos/components/Tools/ImagenProducto.vue"
  import    numeroPaso              from "components/utilidades/input/InputNumeroPaso.vue"
  import    selectContacto          from "src/areas/terceros/components/contactos/SelectContacto.vue"
  import    selectLabelValue        from "components/utilidades/select/SelectLabelValue.vue"
  
  const { acuerdo, loading        } = storeToRefs( useStoreAcuerdo() )
  dexieMetodosEntrega()
  const { metodosEntrega          } = storeToRefs( useStoreDexie() )
  const columnas: IColumna[]  = [
    new Columna({ name: "ref",            label: "Producto",    sortable: false }),
    new Columna({ name: "qty",            label: "Total",       sortable: false, align: "center"  }),
    new Columna({ name: "qtyEnEntregas",  label: "En entregas", sortable: false, align: "center"  }),
    new Columna({ name: "qtyAEntregar",   label: "A entregar",  sortable: false, align: "center"  }),
  ]

  onMounted( () => {
    acuerdo.value.calcularEntregado()
  })

</script>