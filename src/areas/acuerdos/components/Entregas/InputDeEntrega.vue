<template>
  <select-contacto    tipo-entrega hundido quitar-contacto
    v-model:contacto  ="entrega.contactoEntrega"
    label             ="Contacto entregas"
    icon              ="mdi-account"
    :tercero          ="entrega.tercero"
    :disable          ="!entrega.tercero.id"
    :readonly         ="entrega.esEstadoEntregado"
    @quitar-contacto  ="( c : IContacto ) => cambiarContacto( entrega, c, 'borrar' )"
    @contacto-nuevo   ="( c : IContacto ) => cambiarContacto( entrega, c )"
    @contacto-cambio  ="( c : IContacto ) => cambiarContacto( entrega, c )"
  />
  <select-label-value hundido
    v-model           ="entrega.metodoEntrega"
    label             ="Método de entrega"
    icon              ="mdi-truck-delivery"
    error-message     ="Indique un método de entrega"
    :options          ="metodosEntrega"
    :loading          ="!metodosEntrega.length"
    :readonly         ="entrega.esEstadoEntregado"
    @select           ="( metodo )=> cambiarMetodo( entrega, metodo )"
  />                
  <select-label-value alerta hundido clearable
    v-model           ="entrega.transportadora"
    label             ="Transportadora"
    icon              ="mdi-truck"
    class             ="col-md-6 col-12"
    :options          ="transportadoras"
    :loading          ="!transportadoras.length"
    :readonly         ="entrega.esEstadoEntregado"
    @select           ="( trans )=> cambiarEmpresaTransportadora( entrega, trans )"
  />
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

  //* ///////////////////////////////////////////////////////////////////////////// Componibles  
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  useApiDolibarr        } from "src/composables/useApiDolibarr"
  import {  useTools              } from "src/composables/useTools"

  //* ///////////////////////////////////////////////////////////////////////////// Componentes
  import    selectContacto          from "./../../../terceros/components/contactos/SelectContacto.vue"
  import    selectLabelValue        from "components/utilidades/select/SelectLabelValue.vue"

  type TProps                       = { entrega : IAcuerdo}
  const { entrega }                 = defineProps<TProps>()

  const { apiDolibarr             } = useApiDolibarr()
  const { cambiarTransportadora, 
          cambiarContactoEntrega
                                  } = useControlAcuerdo()  
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
</script>