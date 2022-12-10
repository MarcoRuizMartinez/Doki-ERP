<template>
  <ventana                    minimizar
    icono                     ="mdi-account-group"
    class-contenido           ="q-col-gutter-sm"
    titulo                    ="Contactos"
    >    
    <!-- //* ///////////////////////////////////////////////// Contacto comercial -->
    <select-contacto
      class                   ="col-md-4 col-12"
      v-model:contacto        ="acuerdo.contactoComercial"
      label                   ="Contacto comercial"
      icon                    ="mdi-account-cash"
      :tercero                ="acuerdo.tercero"
      :disable                ="!acuerdo.tercero.id || (!acuerdo.tercero.esEmpresa && !acuerdo.esTerceroCtz)"
      :readonly               ="acuerdo.esEstadoValidado"
      @contacto-nuevo         =" c => vincularContactoAcuerdo           ( c,        TIPOS_CONTACTO.COMERCIAL )"
      @contacto-cambio        =" ( c, idOld ) => cambiarContactoAcuerdo ( c, idOld, TIPOS_CONTACTO.COMERCIAL )"
    />
    <!-- //* ///////////////////////////////////////////////// Contacto entrega -->
    <select-contacto          quitar-contacto
      class                   ="col-md-4 col-12"
      v-model:contacto        ="acuerdo.contactoEntrega"
      label                   ="Contacto entrega"
      icon                    ="mdi-truck-delivery"
      :tercero                ="acuerdo.tercero"
      :disable                ="!acuerdo.tercero.id || (!acuerdo.tercero.esEmpresa && !acuerdo.esTerceroCtz)"
      :readonly               ="acuerdo.esEstadoValidado"
      @contacto-nuevo         =" c => vincularContactoAcuerdo           ( c,        TIPOS_CONTACTO.ENTREGA  )"
      @quitar-contacto        =" c => desvincular                       ( c.id,     TIPOS_CONTACTO.ENTREGA  )"
      @contacto-cambio        =" ( c, idOld ) => cambiarContactoAcuerdo ( c, idOld, TIPOS_CONTACTO.ENTREGA  )"
    />
    <!-- //* ///////////////////////////////////////////////// Contacto contable -->
    <select-contacto          quitar-contacto
      class                   ="col-md-4 col-12"
      v-model:contacto        ="acuerdo.contactoContable"
      label                   ="Contacto contable"
      icon                    ="mdi-file-table"
      :tercero                ="acuerdo.tercero"
      :disable                ="!acuerdo.tercero.id || (!acuerdo.tercero.esEmpresa && !acuerdo.esTerceroCtz )"
      :readonly               ="acuerdo.esEstadoValidado"
      @contacto-nuevo         =" c => vincularContactoAcuerdo           ( c,        TIPOS_CONTACTO.CONTABLE )"
      @quitar-contacto        =" c => desvincular                       ( c.id,     TIPOS_CONTACTO.CONTABLE )"
      @contacto-cambio        =" ( c, idOld ) => cambiarContactoAcuerdo ( c, idOld, TIPOS_CONTACTO.CONTABLE )"
    />   
  </ventana>
</template>
<script setup lang="ts">
  //:cargando                 ="!acuerdo.tercero.id && !acuerdo.esNuevo"
  //* ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'stores/acuerdo'  
  //* ///////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  Contacto,
            TIPOS_CONTACTO, 
            TTipoContacto         } from "src/areas/terceros/models/Contacto"  
  //* ///////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    selectContacto          from "src/areas/terceros/components/contactos/SelectContacto.vue"

  const { acuerdo, loading        } = storeToRefs( useStoreAcuerdo() )  
  const { 
          cambiarContactoAcuerdo,
          vincularContactoAcuerdo,
          desvincularContactoAcuerdo,
                                  } = useControlAcuerdo()
                                  
  async function desvincular( id : number, tipo : TTipoContacto)
  {
    await desvincularContactoAcuerdo( id, tipo, true  )
    if(tipo === TIPOS_CONTACTO.ENTREGA  ) acuerdo.value.contactoEntrega   = new Contacto()
    if(tipo === TIPOS_CONTACTO.CONTABLE ) acuerdo.value.contactoContable  = new Contacto()
  }
</script>