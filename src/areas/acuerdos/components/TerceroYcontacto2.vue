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
      v-model:tercero         ="acuerdo.tercero"
      :readonly               ="acuerdo.estado > ESTADO_CTZ.BORRADOR || acuerdo.vinculado"
      @update:tercero         ="actualizarTercero"
    />
    <!-- //* ///////////////////////////////////////////////// Contacto -->
    <!-- Es disable cuando no tiene tercero asignado o no es empresa y no es el tercero del comercial -->
    <select-contacto
      class                   ="col-12"
      v-model:contacto        ="acuerdo.contacto"
      :tercero                ="acuerdo.tercero"
      :disable                ="!acuerdo.tercero.id || (!acuerdo.tercero.esEmpresa && !acuerdo.esTerceroCtz)"
      :readonly               ="acuerdo.estado > ESTADO_CTZ.BORRADOR"
    />
    <!-- //* ///////////////////////////////////////////////// Comercial -->
    <comercial
      class                   ="col-12"
      label                   ="Comercial"
      v-model                 ="acuerdo.comercial"
      :autoselect             ="acuerdo.esNuevo"
      :loading                ="cargarComercial"
      @select                 ="editarComercial"
    /> 
    <!-- //* ///////////////////////////////////////////////// Origen -->
    <select-label-value
      v-model                 ="acuerdo.origenContacto"
      label                   ="Origen contacto"
      icon                    ="mdi-source-branch"
      class                   ="col-md-6 col-12"
      :options                ="origenNego"
      :loading                ="cargarOrigen"
      @select                 ="editarOrigen"
    />
    <!-- //* ///////////////////////////////////////////////// Ref Cliente -->
    <input-text               sin-espacios uppercase
      v-model                 ="acuerdo.refCliente"
      label                   ="REF cliente"
      icon                    ="mdi-signature-text"
      class                   ="col-md-6 col-12"
      :loading                ="cargarRefCliente"
      @blur                   ="editarRefCliente"
    />
  </ventana>
</template>
<script setup lang="ts">
  import {  ref,
            watch                 } from "vue"
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    selectTercero           from "src/areas/terceros/components/SelectTercero.vue"
  import    selectContacto          from "src/areas/terceros/components/contactos/SelectContacto.vue"
  import    tooltipTercero          from "src/areas/terceros/components/TooltipTerceros.vue"
  import    comercial               from "src/areas/usuarios/components/SelectUsuario.vue"
  import    selectLabelValue        from "components/utilidades/select/SelectLabelValue.vue"  
  import    inputText               from "src/components/utilidades/input/InputFormText.vue"  
  import {  Contacto,
            TIPOS_CONTACTO
                                  } from "../../../areas/terceros/models/Contacto"
  import {  servicesCotizaciones  } from "../../../areas/acuerdos/cotizaciones/services/servicesCotizaciones"              
  import {  useDexie, TABLAS      } from "../../../services/useDexie"
  import {  useTools              } from "../../../useSimpleOk/useTools"
  import {  useApiDolibarr        } from "../../../services/useApiDolibarr" 
  import {  ITercero              } from "../../../areas/terceros/models/Tercero"
  import {  IAcuerdo, ESTADO_CTZ  } from "../../../areas/acuerdos/models/Acuerdo"
  import {  IOrigenContacto       } from "../../../models/Diccionarios/OrigenContacto"            
  import {  IContacto             } from "../../../areas/terceros/models/Contacto"
  import {  useFetch              } from "../../../useSimpleOk/useFetch"
  import {  IUsuario              } from "../../../areas/usuarios/models/Usuario"
  import {  servicesTerceros      } from "../../../areas/terceros/services/servicesTerceros"  
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from '../../../stores/acuerdo'  

  const storeAcuerdo          = useStoreAcuerdo()
  const { acuerdo           } = storeToRefs(storeAcuerdo)  

  const { setOrigenContacto,
          setRefCliente,
          getIdEnlaceContacto,
          setComercial,
          setTerceroId,
                            } = servicesCotizaciones()  

  const { moverContactoAOtroTercero 
                            } = servicesTerceros()                              
  const { lista : origenNego} = useDexie( TABLAS.ORIGEN_CONTACTO)
  const { aviso             } = useTools()
  const { apiDolibarr       } = useApiDolibarr()
  const terceros              = ref< ITercero[] > ([])

  //* /////////////////////////////////////////////////////////////// Emits
  const emit                  = defineEmits<{
    (e: 'update:cotizacion',  value: IAcuerdo ): void
  }>()
  

  //* /////////////////////////////////////////////////////////////// Cargadores  
  const cargarOrigen          = ref< boolean >( false )
  const cargarRefCliente      = ref< boolean >( false )
  const cargarComercial       = ref< boolean >( false )

  //* /////////////////////////////////////////////////////////////// Actualizar tercero
  async function actualizarTercero( terceroNew : ITercero )
  {
    if(acuerdo.value.esNuevo) return

    const contactoNow         = acuerdo.value.contacto
    console.log("terceroNew: ", terceroNew);
    console.log("contactoNow: ", contactoNow);
    //const terceroOld          = cotizacion.value.tercero    
    //const esTerceroCtz        = cotizacion.value.esTerceroCtz
    

    const idEditado           = await setTerceroId( acuerdo.value.id, terceroNew.id )
    console.log("idEditado: ", idEditado);
    if   (idEditado){
      acuerdo.value.tercero= terceroNew
      aviso("positive", "Tercero de cotizacion cambiado" )
    }
      
    if(idEditado && !!contactoNow.id)
    {
      if(terceroNew.esEmpresa){
        const contactoMovido    = await moverContactoAOtroTercero( contactoNow.id, terceroNew.id )      
        aviso("positive", "Contacto movido a nuevo tercero" )
      }
      else
      {
        const { ok, data }      = await apiDolibarr("contacto-desvincular",  "cotizacion", contactoNow.idRelacion, acuerdo.value.id)
        if(ok)
        acuerdo.value.contacto = new Contacto( terceroNew.id )
        else
          aviso("negative", "error al desvincular contacto", "account")
      }
    }
    

    //
    //
    emit('update:cotizacion', acuerdo.value)
  }

  //* /////////////////////////////////////////////////////////////// Editar comercial
  async function editarComercial( usuario : IUsuario )
  {
    if(acuerdo.value.esNuevo) return

    cargarComercial.value     = true
    const idUsuario           = !!usuario ? usuario.id : 0
    const ok                  = await setComercial( acuerdo.value.id, idUsuario )
    if   (ok) aviso("positive", "Comercial asignado", "account" )
    cargarComercial.value     = false
  }

  //* /////////////////////////////////////////////////////////////// Editar origen
  async function editarOrigen( origen : IOrigenContacto )
  {
    if(acuerdo.value.esNuevo) return

    cargarOrigen.value          = true
    const ok                    = await setOrigenContacto( acuerdo.value.id, origen.id )
    if   (ok) aviso("positive", "Origen de contacto cambiado" )
    cargarOrigen.value          = false
  }

  //* /////////////////////////////////////////////////////////////// Editar Ref Cliente
  async function editarRefCliente( ref : string )
  {
    if(acuerdo.value.esNuevo) return 

    cargarRefCliente.value      = true
    const ok                    = await setRefCliente( acuerdo.value.id, ref )
    if   (ok) aviso("positive", "Referencia cliente cambiada" )
    cargarRefCliente.value      = false
  }

  //* /////////////////////////////////////////////////////////////// Watch contacto
  watch( ()=> acuerdo.value.contacto, async (newContacto, oldContacto)=>
  {
    console.log("newContacto: ", newContacto);
    console.log("oldContacto: ", oldContacto);
    //* ///////////////////////////////// Restricciones 
    if(acuerdo.value.esNuevo) return

    if(newContacto.id === oldContacto.id) {
      acuerdo.value.contacto.idRelacion = oldContacto.idRelacion
      console.log("A")
      return
    }

    //* ///////////////////////////////// Desvincular contacto
    if(!!oldContacto.idRelacion) 
    {
      console.log("B")
      const { ok : desvinculado } = await apiDolibarr("contacto-desvincular",  "cotizacion", oldContacto.idRelacion, acuerdo.value.id)
      if(!desvinculado){
        aviso("negative", "error al desvincular contacto", "account")
        console.log("C")
        return
      }
    }

    //* ///////////////////////////////// Vincular contacto
    if(!oldContacto.id) return
    console.log("B1")
    const { ok : vinculado      } = await apiDolibarr("contacto-vincular",     "cotizacion", {id: newContacto.id, tipo: TIPOS_CONTACTO.CTZ_CUSTOMER }, acuerdo.value.id)
    console.log("B2")
    if(vinculado){
      const id                    = await getIdEnlaceContacto( acuerdo.value.id, newContacto.id )
      acuerdo.value.contacto.idRelacion  = id
      aviso("positive", "Contacto asignado", "account")
    }
  })
</script>