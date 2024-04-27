<template>
  <div
    @click                      ="()=> {if(!acuerdo.facturado) emit('click')}"
    v-bind                      ="$attrs"    
    >
    <div class                  ="text-1_1em lh_1_3 q-mb-xs">
      <span class               ="text-bold q-mr-sm">{{linea.ref}}</span> 
      <span class               ="">{{linea.nombre}}</span>{{ !!linea.nombreExtra ? ' ' + linea.nombreExtra : '' }}   
    </div>
    <!--
    <br/> <span class         ="text-subtitle1">Modificador: {{linea.categoria.modificadorComision}}</span>
    <br/> <span class         ="text-subtitle1">Costo: {{linea.costo}}</span>
    <br/> <span class         ="text-subtitle1">Aumento: {{linea.aumentoFromCosto}}</span>
    <br/> <span class         ="text-subtitle1">Division: {{linea.comsionX100Division}}</span>
    -->
    <div
      v-if                      ="acuerdo.esOCProveedor"
      class                     ="text-bold text-grey-6"
      >
      {{linea.refProv}}
    </div>
    <div v-if="linea.naturaleza.esCompuesto_o_Kit">
      <q-icon
        name                    ="mdi-focus-field"
        size                    ="1.6em"
        class                   ="op40 op100-hover q-mr-xs"
      />
      <span class               ="text-bold text-uppercase text-grey-6 text-0_8em">{{ linea.naturaleza.label }}</span>      
    </div>
    <table
      v-if                      ="linea.requiereAcabado || linea.requiereEntregado || linea.requiereMedida || !!linea.acabado || !!linea.seEntrega  || !!linea.medida"
      class                     ="tabla-info"
      @click.stop
      >
      <!-- //* ////////////////////////////////////////////////// Editar acabado -->
      <tr
        v-if                    ="linea.requiereAcabado || !!linea.acabado ">
        <td>Acabado</td>
        <td>        
          <span v-if            ="!!linea.acabado">
            {{ linea.acabado }}
          </span>
          <span v-else>⚠️</span>
        </td>
        <q-popup-edit           auto-save
          v-if                  ="acuerdo.esEstadoEdicion"
          v-model               ="linea.acabado"
          v-slot                ="scope"
          class                 ="panel-blur-70"
          anchor                ="center left"          
          @update:model-value   ="editarLinea(linea)"
          >          
          <q-input              dense filled
            v-model             ="scope.value"
            label               ="Color y/o Material"
            class               ="width360"
            @keyup.enter        ="scope.set"
          />
        </q-popup-edit>              
      </tr>
      <!-- //* ////////////////////////////////////////////////// Editar entregado -->
      <tr v-if                  ="linea.requiereEntregado || !!linea.seEntrega">
        <td>Se entrega</td>
        <td>
          <span v-if            ="!!linea.seEntrega">
            {{ linea.seEntrega }}
          </span>
          <span v-else>⚠️</span>
        </td>
        <q-popup-edit           auto-save
          v-if                  ="acuerdo.esEstadoEdicion"
          v-model               ="linea.seEntrega"
          v-slot                ="scope"
          class                 ="panel-blur-70"
          anchor                ="center left"          
          @update:model-value   ="editarLinea(linea)"
          >
          <q-select             dense filled  
            v-model             ="scope.value"
            label               ="Se entrega"
            class               ="width360"
            :options            ="['En caja', 'Embalado', 'Armado', 'Instalado', 'Según entrega']"
            @update:model-value ="scope.set"
          />
        </q-popup-edit>           
      </tr>
      <!-- //* ////////////////////////////////////////////////// Editar Medida -->
      <tr v-if                  ="linea.requiereMedida || !!linea.medida">
        <td>Medida</td>
        <td>
          <span v-if            ="!!linea.medida">
            {{ linea.medida }}
          </span>
          <span v-else>⚠️</span>
        </td>
        <q-popup-edit           auto-save 
          v-if                  ="acuerdo.esEstadoEdicion"
          v-model               ="linea.medida"
          v-slot                ="scope"
          class                 ="panel-blur-70"
          anchor                ="center left"
          @update:model-value   ="editarLinea(linea)"
          >          
          <q-input              dense filled
            v-model             ="scope.value"
            label               ="Medida"
            class               ="width360"
            @keyup.enter        ="scope.set"
          />
        </q-popup-edit>           
      </tr>      
    </table>
    <efecto>
      <div  v-if                ="!!linea.descripcion && mostrarDescripcion">
        <div 
          v-html                ="linea.descripcion"
          class                 ="text-0_8em"
          >
        </div>
        <div v-if               ="(acuerdo.esPedido || acuerdo.esCotizacion) && !!linea.productosProveedor.length">
          <q-badge              rounded
            v-for               ="(pro, index) of linea.productosProveedor.filter( p => p.disponible )"
            :key                ="index"
            class               ="q-mr-xs text-0_7em"
            color               ="grey-5"
            >
            {{pro.proveedor}}
          </q-badge>
        </div>
      </div>
    </efecto>
    <!-- <Tooltip v-if       ="false">
      <table  class     ="tabla-info text-1em rounded-borders q-px-sm min-w-x100">
        <tbody>
          <tr>
            <td>Costo</td>
            <td>
              {{ Format.precio( linea.costo ) }}
            </td>
          </tr>
          <tr>
            <td>Venta</td>
            <td>
              {{ Format.precio( linea.precioFinal ) }}
            </td>
          </tr>
          <tr>
            <td>Aumento</td>
            <td>
              {{ linea.aumentoFromCosto.toFixed( 2 ) }}%
            </td>
          </tr>
          <tr>
            <td>Nivel de precios</td>
            <td>
              
            </td>
          </tr>
        </tbody>
      </table>
    </Tooltip> -->
  </div>
  <q-menu                       touch-position context-menu
    v-if                        ="!acuerdo.facturado"
    >
    <div  class                 ="column items-start">
      <q-btn                    v-close-popup flat dense no-caps
        icon                    ="mdi-content-duplicate"
        class                   ="full-width"
        type                    ="a"
        label                   ="Duplicar"
        align                   ="left"    
        @click                  ="emit('duplicar', linea)"
      />      
      <q-btn                    v-close-popup flat dense no-caps
        icon                    ="mdi-open-in-new"
        class                   ="full-width"
        type                    ="a"
        label                   ="Ver producto"
        align                   ="left"
        target                  ="_blank"
        :to                     ="`/productos/${linea.id}`"
      />
      <q-btn                    flat dense no-caps
        v-if                    ="!esValidado"
        icon                    ="mdi-trash-can"
        label                   ="Borrar línea"
        class                   ="full-width"
        align                   ="left"
        >
        <confirmar              @ok="emit('borrarLinea', linea)"/>
      </q-btn>
      <!-- //* ////////////////////////////////////////////////// Editar Titulo -->
      <q-btn                    flat dense no-caps
        v-if                    ="usuario.esProduccion || usuario.esGerencia"
        label                   ="Editar costo"
        icon                    ="mdi-cash-usd-outline"
        class                   ="full-width"
        align                   ="left"
        >
        <popup-costo
          v-model               ="linea"
        />
      </q-btn>    
    </div>
  </q-menu>
</template>

<script lang="ts" setup>
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref, watch, computed} from "vue"  
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreUser        } from 'stores/user'
  import {  useStoreAcuerdo     } from 'stores/acuerdo'  
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  ILineaAcuerdo       } from "src/areas/acuerdos/models/LineaAcuerdo"

  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"

  // * /////////////////////////////////////////////////////////////////////////////////// Componentes  
  import    confirmar             from "components/utilidades/MenuConfirmar.vue"
  import    popupCosto            from "./EditarCosto.vue"
  import    efecto                from "components/utilidades/Efecto.vue"
  
  const { editarLinea  }          = useControlProductos()
  const { usuario               } = storeToRefs( useStoreUser() )
  const { mostrarDescripcion,
          acuerdo               } = storeToRefs( useStoreAcuerdo() )

  const modelValue                = defineModel<ILineaAcuerdo>( { required: true })
  
  type TProps = { esValidado : boolean }
  const { esValidado }            = defineProps<TProps>()  
  const linea                     = ref< ILineaAcuerdo >( modelValue.value )  
  watch( modelValue, (newLinea)=> linea.value = newLinea )

  const emit = defineEmits<{
    (e: 'click',        value: void           ): void
    (e: 'borrarLinea',  value: ILineaAcuerdo  ): void
    (e: 'duplicar',     value: ILineaAcuerdo  ): void
  }>()  

</script>


<style scoped>
  .tabla-info td, th {
    border: none;
    padding: 0px !important;
  }

  tr, td {
    height: 8px !important;
    line-height: 1.6;
  }  

  .tabla-info td:nth-child(odd){    
    text-transform: uppercase;
    background: unset !important;
    color: rgb(60%, 60%, 60%);    
    padding-right: 8px !important;
  }  
</style>