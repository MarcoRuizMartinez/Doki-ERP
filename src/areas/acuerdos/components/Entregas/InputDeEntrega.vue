<template>
  <select-contacto          tipo-entrega hundido quitar-contacto
    v-model:contacto        ="entrega.contactoEntrega"
    label                   ="Contacto entregas"
    icon                    ="mdi-account"
    :tercero                ="entrega.tercero"
    :disable                ="!entrega.tercero.id"
    :readonly               ="entrega.esEstadoEntregado"
    @quitar-contacto        ="( c : IContacto ) => cambiarContacto( entrega, c, 'borrar' )"
    @contacto-nuevo         ="( c : IContacto ) => cambiarContacto( entrega, c )"
    @contacto-cambio        ="( c : IContacto ) => cambiarContacto( entrega, c )"
  />
  <select-label-value       hundido
    v-model                 ="entrega.metodoEntrega"
    label                   ="Método de entrega"
    icon                    ="mdi-truck-delivery"
    error-message           ="Indique un método de entrega"
    :options                ="metodosEntrega"
    :loading                ="!metodosEntrega.length"
    :readonly               ="entrega.esEstadoEntregado"
    @select                 ="( metodo )=> cambiarMetodo( entrega, metodo )"
  />                
  <select-label-value       alerta hundido clearable
    v-model                 ="entrega.transportadora"
    label                   ="Transportadora"
    icon                    ="mdi-truck"
    class                   ="col-md-6 col-12"
    :options                ="transportadoras"
    :loading                ="!transportadoras.length"
    :readonly               ="entrega.esEstadoEntregado"
    @select                 ="( trans )=> cambiarEmpresaTransportadora( entrega, trans )"
  />
  <div class                ="col-12 row q-col-gutter-sm">
    <!-- //* ///////////////////////////////////////////////// Fecha compromiso -->
    <div  class             ="col-md-6 col-12">
      <input-fecha          alerta hundido    
        v-model             ="entrega.fechaEntrega"
        label               ="Fecha compromiso"
        titulo              ="Fecha compromiso entrega"       
        error-message       ="Es necesaria una fecha de entrega"
        @update:model-value ="editarFechaCompromiso"
      />
    </div>
    <!-- //* ///////////////////////////////////////////////// Fecha a despachar -->
    <div  class             ="col-md-6 col-12">
      <input-fecha          alerta hundido no-pasado
        v-model             ="entrega.fechaADespachar"
        label               ="Fecha a despachar"
        titulo              ="Fecha tentativa de despacho"
        error-message       ="Es necesaria una fecha tentativa de despacho"
        @update:model-value ="editarFechaADespachar"
      />  
    </div>
    <!-- //* ///////////////////////////////////////////////// Costo Envio -->
    <div  class             ="col-md-6 col-12">
      <input-number         hundido
        v-model             ="entrega.costoEnvio"
        label               ="Costo cotizado"
        icon                ="mdi-cash-usd"
        tipo                ="precio"
        @update:model-value ="editarCosto"
      />
    </div>
    <!-- //* ///////////////////////////////////////////////// Costo Envio Aprobado -->
    <div  class             ="col-md-6 col-12">
      <q-checkbox
        v-model             ="entrega.costoEnvioAprobado" 
        label               ="Costo aprobado"
        class               ="text-black"
        @update:model-value ="editarCostoAprobado"
      />
    </div>
    <!-- //* ///////////////////////////////////////////////// Extra tiempo -->
    <div  class             ="col-md-6 col-12">
      <q-checkbox
        v-model             ="entrega.extraTiempo" 
        label               ="Extra tiempo"
        class               ="text-black"
        :disable            ="!usuario.esComercial"
        @update:model-value ="editarExtra('solicitud')"
      />
    </div>   
    <!-- //* ///////////////////////////////////////////////// Extra tiempo Aprobado -->
    <div  class             ="col-md-6 col-12">
      <q-checkbox
        v-model             ="entrega.extraTiempoOk" 
        label               ="Extra tiempo ok"
        class               ="text-black"
        :disable            ="!usuario.esProduccion"
        @update:model-value ="editarExtra('aprobacion')"
      />
    </div>           
  </div>
</template> 

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  inject                } from "vue"  

  //* ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreUser          } from 'stores/user'
  import {  useStoreDexie         } from 'stores/dexieStore'

  //* /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAcuerdo              } from "../../models/Acuerdo"  
  import {  IContacto, Contacto   } from "src/areas/terceros/models/Contacto"
  import {  ILabelValue           } from "src/models/TiposVarios"
  import {  Accion                } from "src/areas/comunicacion/models/Accion"
  import {  TIPO_ACUERDO          } from "../../models/ConstantesAcuerdos"

  //* ///////////////////////////////////////////////////////////////////////////// Componibles  
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  servicesAcuerdos      } from "src/areas/acuerdos/controllers/servicesAcuerdos"
  import {  useApiDolibarr        } from "src/composables/useApiDolibarr"
  import {  ToolDate, useTools    } from "src/composables/useTools"

  //* ///////////////////////////////////////////////////////////////////////////// Componentes
  import    selectContacto          from "./../../../terceros/components/contactos/SelectContacto.vue"
  import    selectLabelValue        from "components/utilidades/select/SelectLabelValue.vue"
  import    inputFecha              from "components/utilidades/input/InputFecha.vue"
  import    inputNumber             from "components/utilidades/input/InputFormNumber.vue"


  type TProps                       = { entrega : IAcuerdo}
  const { entrega }                 = defineProps<TProps>()

  const { apiDolibarr             } = useApiDolibarr()
  const { cambiarTransportadora, 
          cambiarContactoEntrega
                                  } = useControlAcuerdo()
  const { setFechaEntrega,
          setFechaADespachar,
          setCostoEnvio,
          setCostoEnvioAprovado,
          setExtraTiempo,
                                  } = servicesAcuerdos()

  const { aviso                   } = useTools()
  const { transportadoras,
          metodosEntrega          } = storeToRefs( useStoreDexie() )  
  const { usuario                 } = storeToRefs( useStoreUser() )

  const accion                      = inject('accion', new Accion( usuario.value.id ))

  async function cambiarContacto( entrega : IAcuerdo, contac : IContacto, tipoAccion : "cambiar" | "borrar" = "cambiar" )
  {
    const id            = tipoAccion == 'cambiar' ? contac.id : 0
    const edicionOk     = await cambiarContactoEntrega( id, entrega.id )
    if(!edicionOk) return

    let porQuien        = contac.nombreCompleto
    if(tipoAccion       == 'borrar'){
      entrega.contactoEntrega = new Contacto()    
      porQuien          = "ninguno"
    }

    accion.titulo       = usuario.value.nombre + " modifico el contacto entrega por " + porQuien
    accion.elementoId   = entrega.id

    const { ok }        = await apiDolibarr("crear", "accion", accion.accionToApiDolibarr )
  } 


  async function cambiarMetodo( entrega : IAcuerdo, metodo : ILabelValue )
  {
    const { ok }              = await apiDolibarr("editar", "entrega", { shipping_method_id: metodo.value }, entrega.id )
    if(!ok) return

    accion.titulo             = usuario.value.nombre + " modifico el método entrega a " + metodo.label
    accion.elementoId         = entrega.id
    
    const { ok : ok2 }        = await apiDolibarr("crear", "accion", accion.accionToApiDolibarr )
    
    if(ok2)
      aviso( "positive", "Método de entrega modificado" )
  } 

  async function cambiarEmpresaTransportadora( entrega : IAcuerdo, trans : ILabelValue )
  {
    const edicionOk     = await cambiarTransportadora( trans.value, entrega.id )
    if(!edicionOk) return

    accion.titulo       = usuario.value.nombre + " modifico la transportadora a " + trans.label
    accion.elementoId   = entrega.id

    const { ok  }       = await apiDolibarr("crear", "accion", accion.accionToApiDolibarr )
    if(ok)
      aviso( "positive", "Transportadora modificada" )
  } 

  //* /////////////////////////////////////////////////////////////// Editar fecha a despachar
  async function editarFechaADespachar()
  { 
    if( !ToolDate.fechaValida( entrega.fechaADespachar ) ) {
      aviso("negative", "Fecha de despacho invalida", "clock" )
      return
    }
    const ok            = await setFechaADespachar( entrega.id, entrega.fechaADespachar, entrega.tipo )
    if (ok) aviso("positive", "Fecha de despacho cambiada", "clock" )
    
  }    

  async function editarFechaCompromiso()
  { 
    if( !ToolDate.fechaValida( entrega.fechaEntrega ) ) {
      aviso("negative", "Fecha de compromiso invalida", "clock" )
      return
    }
    const ok            = await setFechaEntrega( entrega.id, entrega.fechaEntrega, entrega.tipo )
    if (ok) aviso("positive", "Fecha de compromiso cambiada", "clock" )
    
  }    

  async function editarCosto(){ 
    await setCostoEnvio( entrega.id, entrega.costoEnvio, entrega.tipo )
  }    

  async function editarCostoAprobado()
  {
    await setCostoEnvioAprovado( entrega.id, entrega.costoEnvioAprobado, entrega.tipo )
    await setCostoEnvioAprovado( entrega.pedidoId, entrega.costoEnvioAprobado, TIPO_ACUERDO.PEDIDO_CLI )
  }    

  async function editarExtra( tipoExtra : "aprobacion" | "solicitud" ){
    await setExtraTiempo( entrega.id,       entrega.extraTiempo, entrega.tipo,            tipoExtra )
    await setExtraTiempo( entrega.pedidoId, entrega.extraTiempo, TIPO_ACUERDO.PEDIDO_CLI, tipoExtra )
  }    
   



</script>