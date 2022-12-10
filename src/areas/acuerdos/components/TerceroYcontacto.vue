<template>
  <ventana                    minimizar
    icono                     ="mdi-account-supervisor-circle"
    :cargando                 ="!acuerdo.tercero.id && !acuerdo.esNuevo"
    class-contenido           ="q-col-gutter-sm"
    titulo                    ="Información de tercero"
    >
    <!-- //* ///////////////////////////////////////////////////////// SLOT TITULO -->
    <!--  Si es un acuerdo existente, genera un link para ver el tercero, 
          si no, muestra el titulo asignado al componente ventana
    -->
    <!--  Solo se muestra si es un acuerdo en edicion -->    
    <template                 #titulo
      v-if                    ="!acuerdo.esNuevo"
      >
      <!-- //* /////////////////////////////////////////////////////// Link a tercero -->
      <router-link
        class                 ="link-limpio text-white"
        :to                   ="'/tercero/' + acuerdo.tercero.id"
        >
        {{ acuerdo.tercero.nombre }}
      </router-link>
      <tooltip-tercero
        v-if                  ="!!acuerdo.tercero.id"
        :tercero              ="acuerdo.tercero"
      />          
    </template>
    <!-- //* ///////////////////////////////////////////////////////// SLOT DEFAULT -->
    <!-- //* ///////////////////////////////////////////////// Tercero -->
    <!-- No deja editar el tercero, si ya esta vinculado con otro objeto o no es un borrador -->
    <select-tercero
      class                   ="col-12"
      :con-tercero-especial   ="acuerdo.esCotizacion"
      v-model:tercero         ="acuerdo.tercero"
      :readonly               ="acuerdo.esEstadoValidado || acuerdo.vinculado"
      @update:tercero         ="actualizarTercero"
    />
    <!-- //* ///////////////////////////////////////////////// Contacto -->
    <!-- Es disable cuando no tiene tercero asignado o no es empresa y no es el tercero del comercial -->
    <select-contacto
      v-if                    ="acuerdo.esCotizacion"
      class                   ="col-12"
      v-model:contacto        ="acuerdo.contactoComercial"
      :tercero                ="acuerdo.tercero"
      :disable                ="!acuerdo.tercero.id || (!acuerdo.tercero.esEmpresa && !acuerdo.esTerceroCtz)"
      :readonly               ="acuerdo.esEstadoValidado"
      @contacto-nuevo         ="vincularContactoAcuerdo"
      @contacto-cambio        ="cambiarContactoAcuerdo"
    />
    <!-- //* ///////////////////////////////////////////////// Proyecto -->
    <select-proyecto
      v-if                    ="!acuerdo.esNuevo"
      class                   ="col-12"
      v-model:proyecto        ="acuerdo.proyecto"
      :tercero                ="acuerdo.tercero"
      :loading                ="loading.proyecto"
      :readonly               ="loading.proyecto"
      @update:proyecto        ="cambiarProyecto"
    /> 
    <!-- //* ///////////////////////////////////////////////// Comercial -->
    <comercial
      class                   ="col-12"
      label                   ="Comercial"
      v-model                 ="acuerdo.comercial"
      :grupos                 ="[GRUPO_USUARIO.COMERCIALES]"
      :autoselect             ="acuerdo.esNuevo"
      :loading                ="loading.comercial"
      @select                 ="editarComercial"
    /> 
    <!-- //* ///////////////////////////////////////////////// Origen -->
    <select-label-value
      v-model                 ="acuerdo.origenContacto"
      label                   ="Origen contacto"
      icon                    ="mdi-source-branch"
      class                   ="col-md-6 col-12"
      :options                ="origenNego"
      :loading                ="loading.origen"
      @select                 ="editarOrigen"
    />
    <!-- //* ///////////////////////////////////////////////// Ref Cliente -->
    <input-text               sin-espacios uppercase
      v-model                 ="acuerdo.refCliente"
      label                   ="REF cliente"
      icon                    ="mdi-signature-text"
      class                   ="col-md-6 col-12"
      :loading                ="loading.ref"
      @blur                   ="editarRefCliente"
    />
  </ventana>
</template>
<script setup lang="ts">
  //* ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'stores/acuerdo'  
  //* ///////////////////////////////////////////////////////////////////////////// Componibles
  import {  dexieOrigenesContacto } from "src/services/useDexie"
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  GRUPO_USUARIO         } from "src/models/TiposVarios"
  //* ///////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    inputText               from "components/utilidades/input/InputFormText.vue"
  import    selectLabelValue        from "components/utilidades/select/SelectLabelValue.vue"  
  import    selectTercero           from "src/areas/terceros/components/SelectTercero.vue"
  import    comercial               from "src/areas/usuarios/components/SelectUsuario.vue"
  import    tooltipTercero          from "src/areas/terceros/components/TooltipTerceros.vue"
  import    selectContacto          from "src/areas/terceros/components/contactos/SelectContacto.vue"
  import    selectProyecto          from "src/areas/proyectos/components/SelectProyecto.vue"

  const { acuerdo, loading        } = storeToRefs( useStoreAcuerdo() )  
  const { actualizarTercero,
          cambiarProyecto,
          editarOrigen,
          editarRefCliente,
          editarComercial,
          cambiarContactoAcuerdo,
          vincularContactoAcuerdo,
                                  } = useControlAcuerdo()
                    
  const origenNego                  = dexieOrigenesContacto() 
</script>