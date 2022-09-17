<template>
  <ventana                      minimizar
    :titulo                     ="acuerdo.esEstadoBoceto ? 'Consultar productos - No se guardan en cotizacion... por ahora. enserio🙏😱😩🤯' : 'Productos'"
    icono                       ="mdi-package-variant-closed"
    padding-contenido           ="0"
    :cargando                   ="loading.carga || loading.borrarLote || loading.editarLote"
    >
    <template                   #barra
      v-if                      ="acuerdo.esEstadoNoValidado"
      >
      <!-- //* ///////////////////////////////////////////////////////////// Boton nuevo grupo   -->
      <q-btn
        v-bind                  ="btnBaseSm"
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
        :index                  ="grupo.index"
        header-class            ="bg-gris-dark text-white"
        expand-icon-class       ="text-white q-pr-none"
        >
        <!-- //* ///////////////////////////////////////////////////////////// Slot cabezote expansion item-->
        <template               #header>
          <q-item-section       avatar class="hidden"></q-item-section>
          <q-item-section class ="q-my-sm">
            <editar-grupo :grupo="grupo"/>
          </q-item-section>
          {{grupo.tituloCreado}}
          <q-item-section       side
            v-if                ="acuerdo.esEstadoNoValidado"
            >
            <div class          ="row items-center">
              <!-- //* /////////////////////////////////////////////////////// Boton agregar producto  -->
              <q-btn
                v-bind          ="btnBaseSm"
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
      :persistent               ="loading.añadir || loading.borrarLote"
      transition-show           ="slide-up"
      transition-hide           ="slide-down"
      @hide                     ="grupoElegido.noDestacarProductos()"
      >
      <buscar-productos />
    </q-dialog>
    <!-- //* ///////////////////////////////////////////////////////////// Modal formulario edicion Linea   -->
    <q-dialog
      v-model                   ="modales.formulario"
      :persistent               ="loading.editarLinea || loading.borrarLinea"
      >
      <formulario-linea />
    </q-dialog>
    <!-- //* ///////////////////////////////////////////////////////////// Modal editar en lote -->
    <q-dialog
      v-model                   ="modales.editarEnLote"
      :persistent               ="loading.editarLote"
      >
      <editar-en-lote />
    </q-dialog>
  </ventana>
</template>
<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////// Core
  import {  watch                 } from "vue"
  // * ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
  // * ///////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  import {  btnBaseSm             } from "src/useSimpleOk/useEstilos"
  // * ///////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    editarGrupo             from "src/areas/acuerdos/components/Grupos/EditarGrupo.vue"
  import    tablaProductos          from "./TablaProductos/TablaProductos.vue"
  import    buscarProductos         from "./Modals/BuscarAgregarProductos.vue"
  import    formularioLinea         from "./Modals/FormularioLinea.vue"
  import    editarEnLote            from "./Modals/EditarEnLoteQtyDesc.vue"

  const { destacarLineaElegida,
          mostrarBuscarProductos
                              } = useControlProductos()
  const { acuerdo,
          grupoElegido,
          loading,
          modales             } = storeToRefs( useStoreAcuerdo() )
  const { crearNuevoGrupo     } = useControlProductos()

  watch( () => modales.value.formulario, (mostrarForm) => destacarLineaElegida(mostrarForm) )
</script>
