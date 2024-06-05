<template>
  <ventana                      minimizar
    titulo                      ="Productos"
    icono                       ="mdi-package-variant-closed"
    padding-contenido           ="0"
    :cargando                   ="loading.carga || loading.borrarLote || loading.editarLote"
    >
    <template                   #titulo>      
      {{ acuerdo.esEstadoNoValidado ? 'Editando productos' : 'Productos' }}
      <!-- //* ///////////////////////////////////////////////////////////// Boton producto visible en PDF -->
      <btn-toggle
        v-model                 ="mostrarDescripcion"
        icon-true               ="mdi-table-eye"
        icon-false              ="mdi-table-eye-off"
        msj-true                ="Ocultar descripción"
        msj-false               ="Mostrar descripción"
        color-true              ="white"
        color-false             ="white"
        size                    ="md"
      />      
    </template>    
    <template                   #barra
      v-if                      ="acuerdo.esEstadoNoValidado"
      >
      <!-- //* ///////////////////////////////////////////////////////////// Boton nuevo grupo   -->
      <q-btn
        v-if                    ="(acuerdo.esCotizacion || acuerdo.esPedido) && acuerdo.esEstadoEdicion && !acuerdo.facturado"
        v-bind                  ="style.btnBaseSm"
        label                   ="Actualizar precios"
        color                   ="positive"
        icon                    ="mdi-refresh"
        >
        <q-menu                 
          v-bind                ="menuDefault"
          class                 ="column transparent panel-blur-70" 
          >
          <q-btn
            v-bind              ="style.btnSimple"
            label               ="Precios"
            >
            <confirmar  @ok     ="actualizarPreciosAcuerdo( 0 )"/>
          </q-btn>
          <q-btn
            v-bind              ="style.btnSimple"
            label               ="Solo comisiones"            
            >
              <confirmar  @ok   ="actualizarPreciosAcuerdo( 1 )"/>
            </q-btn>     
        </q-menu>
      </q-btn> 
      <!-- //* ///////////////////////////////////////////////////////////// Boton nuevo grupo   -->
      <q-btn
        v-bind                  ="style.btnBaseSm"
        label                   ="Ordenar productos"
        color                   ="positive"
        icon                    ="mdi-sort-alphabetical-ascending"        
        @click                  ="modales.ordenar = true"
      />      
      <!-- //* ///////////////////////////////////////////////////////////// Boton nuevo grupo   -->
      <q-btn
        v-if                    ="!acuerdo.facturado"
        v-bind                  ="style.btnBaseSm"
        label                   ="Nuevo grupo"
        color                   ="positive"
        icon                    ="mdi-tab-plus"
        :disable                ="!acuerdo.puedeCrearNuevoGrupo"
        @click                  ="crearNuevoGrupo"
      />
    </template>
    <q-list
      class                     ="fit"
      >
      <!-- //* ///////////////////////////////////////////////////////////////  For expansion item -->
      <q-expansion-item         expand-separator default-opened dense expand-icon-toggle dense-toggle
        v-for                   ="(grupo, index) of acuerdo.proGrupos"
        :key                    ="grupo.index"
        header-class            ="bg-gris-dark text-white"
        expand-icon-class       ="text-white q-pr-none"
        >
        <!-- //* ///////////////////////////////////////////////////////////// Slot cabezote expansion item-->
        <template               #header>
          <q-item-section       avatar class="hidden"></q-item-section>
          <q-item-section class ="q-my-sm">
            <editar-grupo :grupo="grupo"/>
          </q-item-section>
          <q-item-section       side
            v-if                ="acuerdo.esEstadoNoValidado"
            >
            <div
              v-if              ="!acuerdo.facturado"
              class             ="row items-center"
              >
              <!-- //* /////////////////////////////////////////////////////// Boton agregar producto  -->
              <q-btn
                v-bind          ="style.btnBaseSm"
                class           ="text-black"
                color           ="grey-1"
                label           ="Producto"
                icon            ="mdi-plus"
                @click          ="mostrarBuscarProductos(grupo)"
                >
                <Tooltip label  ="Agregar productos"/>
              </q-btn>
            </div>
          </q-item-section>
        </template>
        <!-- //* ///////////////////////////////////////////////////////////// Tabla productos  -->
        <tabla-productos :grupo ="grupo"/>
      </q-expansion-item>
    </q-list>
    <!-- //* ///////////////////////////////////////////////////////////// Modal Buscar productos -->
    <q-dialog                   maximized
      v-model                   ="modales.añadirProductos"
      v-bind                    ="style.dialogo"
      :persistent               ="loading.añadir || loading.borrarLote"
      @hide                     ="grupoElegido.noDestacarProductos()"
      >
      <buscar-productos />
    </q-dialog> 
    <!-- //* ///////////////////////////////////////////////////////////// Modal formulario edicion Linea   -->
    <q-dialog
      v-model                   ="modales.formulario"
      v-bind                    ="style.dialogo"
      :persistent               ="loading.editarLinea || loading.borrarLinea"
      >
      <formulario-linea />
    </q-dialog>
    <!-- //* ///////////////////////////////////////////////////////////// Modal editar en lote -->
    <q-dialog
      v-model                   ="modales.editarEnLote"
      v-bind                    ="style.dialogo"
      :persistent               ="loading.editarLote"
      >
      <editar-en-lote />
    </q-dialog>
    <!-- //* ///////////////////////////////////////////////////////////// Modal ordenar lineas -->
    <q-dialog                   full-width
      v-model                   ="modales.ordenar"
      v-bind                    ="style.dialogo"
      :persistent               ="loading.ordenando"
      @hide                     ="grupoElegido.noDestacarProductos()"
      >
      <ordenar
      />
    </q-dialog>
  </ventana>
</template>
<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////// Core
  import {  watch                 } from "vue"
  // * ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'stores/acuerdo'
  // * ///////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  style, 
            menuDefault           } from "src/composables/useEstilos"
            
  // * ///////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    editarGrupo             from "../Lineas/EditarGrupo.vue"
  import    tablaProductos          from "../Lineas/TablaLineas.vue"
  import    formularioLinea         from "../Lineas/FormularioLinea/FormularioLinea.vue"
  import    editarEnLote            from "../Lineas/EditarEnLoteQtyDesc.vue"
  import    ordenar                 from "../Lineas/OrdenarLineas.vue"
  import    buscarProductos         from "../Lineas/BuscarAgregarProductos.vue"
  import    confirmar               from "components/utilidades/MenuConfirmar.vue"
  import    btnToggle               from "components/utilidades/BtnToggle.vue"
  
  const { destacarLineaElegida,
          mostrarBuscarProductos    } = useControlProductos()
  const { actualizarPreciosAcuerdo  } = useControlAcuerdo()  
                              
  const { acuerdo,
          grupoElegido,
          mostrarDescripcion,
          loading,
          modales             } = storeToRefs( useStoreAcuerdo() )
  const { crearNuevoGrupo     } = useControlProductos()

  watch( () => modales.value.formulario, (mostrarForm) => destacarLineaElegida( mostrarForm ?? false ) )
</script>