<template>
  <ventana                    minimizar
    icono                     ="mdi-account-supervisor-circle"
    :cargando                 ="!cotizacion.tercero.id && !nuevo"
    class-contenido           ="q-col-gutter-sm"
    titulo                    ="Información de tercero"
    > 
    <!-- //* ///////////////////////////////////////////////////////// SLOT TITULO -->
    <template                 #titulo
      v-if                    ="!nuevo"
      >
      <router-link
        class                 ="link-limpio text-white"
        :to                   ="'/tercero/' + cotizacion.tercero.id"
        >
        {{ cotizacion.tercero.nombre }}
      </router-link>
      <tooltip-tercero
        v-if                  ="!!cotizacion.tercero.id"
        :tercero              ="cotizacion.tercero"
      />          
    </template>
    <!-- //* ///////////////////////////////////////////////////////// SLOT DEFAULT -->
    <!-- //* ///////////////////////////////////////////////// Tercero -->
    <select-tercero
      class                   ="col-12"
      v-model:tercero         ="cotizacion.tercero"
      :readonly               ="cotizacion.estado > ESTADO_CTZ.BORRADOR || cotizacion.vinculado"
      @update:tercero         ="actualizarTercero"
    />
    <!-- //* ///////////////////////////////////////////////// Contacto -->
    <select-contacto
      class                   ="col-12"
      v-model:contacto        ="cotizacion.contacto"
      :tercero                ="cotizacion.tercero"
      :disable                ="!cotizacion.tercero.id || (!cotizacion.tercero.esEmpresa && !cotizacion.esTerceroCtz)"
      :readonly               ="cotizacion.estado > ESTADO_CTZ.BORRADOR"
    />
    <!-- //* ///////////////////////////////////////////////// Comercial -->
    <comercial
      class                   ="col-12"
      label                   ="Comercial"
      v-model                 ="cotizacion.comercial"
      :autoselect             ="nuevo"
      :loading                ="cargarComercial"
      @select                 ="editarComercial"
    /> 
    <!-- //* ///////////////////////////////////////////////// Origen -->
    <select-label-value
      v-model                 ="cotizacion.origenContacto"
      label                   ="Origen contacto"
      icon                    ="mdi-source-branch"
      class                   ="col-md-6 col-12"
      :options                ="origenNego"
      :loading                ="cargarOrigen"
      @select                 ="editarOrigen"
    />
    <!-- //* ///////////////////////////////////////////////// Ref Cliente -->
    <input-text               sin-espacios uppercase
      v-model                 ="cotizacion.refCliente"
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
            PropType,
            computed,
            toRefs,
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
                                  } from "src/areas/terceros/models/Contacto"
  import {  servicesCotizaciones  } from "src/areas/acuerdos/cotizaciones/services/servicesCotizaciones"              
  import {  dexieOrigenesContacto } from "src/services/useDexie"
  import {  useTools              } from "src/useSimpleOk/useTools"
  import {  useApiDolibarr        } from "src/services/useApiDolibarr"

  import {  ICotizacion,
            ESTADO_CTZ            } from "src/areas/acuerdos/cotizaciones/models/Cotizacion"    
  import {  ITercero              } from "src/areas/terceros/models/Tercero"
  import {  IOrigenContacto       } from "src/models/Diccionarios/OrigenContacto"            
  import {  IContacto             } from "src/areas/terceros/models/Contacto"
  import {  useFetch              } from "src/useSimpleOk/useFetch"
  import {  IUsuario              } from "src/areas/usuarios/models/Usuario"
  import {  servicesTerceros      } from "src/areas/terceros/services/servicesTerceros"  

  const { setOrigenContacto,
          setRefCliente,
          getIdEnlaceContacto,
          setComercial,
          setTerceroId,
                            } = servicesCotizaciones()  

  const { moverContactoAOtroTercero 
                            } = servicesTerceros()                              
  const origenNego            = dexieOrigenesContacto()
  const { aviso             } = useTools()
  const { apiDolibarr       } = useApiDolibarr()
  const terceros              = ref< ITercero[] > ([])

  //* /////////////////////////////////////////////////////////////// Emits
  const emit                  = defineEmits<{
    (e: 'update:cotizacion',  value: ICotizacion ): void
  }>()
  
  //* /////////////////////////////////////////////////////////////// Props
  const props                 = defineProps({
    nuevo:      { default:  false,  type: Boolean                         },
    cotizacion: { required: true,   type: Object as PropType< ICotizacion > },
  })

  const { cotizacion,
          nuevo             } = toRefs( props )

  //* /////////////////////////////////////////////////////////////// Cargadores  
  const cargarOrigen          = ref< boolean >( false )
  const cargarRefCliente      = ref< boolean >( false )
  const cargarComercial       = ref< boolean >( false )

  //* /////////////////////////////////////////////////////////////// Actualizar tercero
  async function actualizarTercero( terceroNew : ITercero )
  {
    const contactoNow         = cotizacion.value.contacto
    //const terceroOld          = cotizacion.value.tercero    
    //const esTerceroCtz        = cotizacion.value.esTerceroCtz
    

    const idEditado           = await setTerceroId( cotizacion.value.id, terceroNew.id )
    if   (idEditado){
      cotizacion.value.tercero= terceroNew
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
        const { ok, data }      = await apiDolibarr("contacto-desvincular",  "cotizacion", contactoNow.idRelacion, cotizacion.value.id)
        if(ok)
          cotizacion.value.contacto = new Contacto( terceroNew.id )
        else
          aviso("negative", "error al desvincular contacto", "account")
      }
    }
    

    //
    //
    emit('update:cotizacion', cotizacion.value)
  }

  //* /////////////////////////////////////////////////////////////// Editar comercial
  async function editarComercial( usuario : IUsuario )
  {
    if(nuevo.value) return

    cargarComercial.value     = true
    const idUsuario           = !!usuario ? usuario.id : 0
    const ok                  = await setComercial( cotizacion.value.id, idUsuario )
    if   (ok) aviso("positive", "Comercial asignado", "account" )
    cargarComercial.value     = false
  }

  //* /////////////////////////////////////////////////////////////// Editar origen
  async function editarOrigen( origen : IOrigenContacto )
  {
    if(nuevo.value) return

    cargarOrigen.value          = true
    const ok                    = await setOrigenContacto( cotizacion.value.id, origen.id )
    if   (ok) aviso("positive", "Origen de contacto cambiado" )
    cargarOrigen.value          = false
  }

  //* /////////////////////////////////////////////////////////////// Editar Ref Cliente
  async function editarRefCliente( ref : string )
  {
    if(nuevo.value) return 

    cargarRefCliente.value      = true
    const ok                    = await setRefCliente( cotizacion.value.id, ref )
    if   (ok) aviso("positive", "Referencia cliente cambiada" )
    cargarRefCliente.value      = false
  }

  //* /////////////////////////////////////////////////////////////// Watch contacto
  watch( ()=> cotizacion.value.contacto, async (newContacto, oldContacto)=>
  {
    console.log("newContacto: ", newContacto);
    console.log("oldContacto: ", oldContacto);
    //* ///////////////////////////////// Restricciones 
    if( nuevo.value ) return

    if(newContacto.id === oldContacto.id) {
      cotizacion.value.contacto.idRelacion = oldContacto.idRelacion
      console.log("A")
      return
    }

    //* ///////////////////////////////// Desvincular contacto
    if(!!oldContacto.idRelacion) 
    {
      console.log("B")
      const { ok : desvinculado } = await apiDolibarr("contacto-desvincular",  "cotizacion", oldContacto.idRelacion, cotizacion.value.id)
      if(!desvinculado){
        aviso("negative", "error al desvincular contacto", "account")
        console.log("C")
        return
      }
    }

    //* ///////////////////////////////// Vincular contacto
    if(!oldContacto.id) return
    console.log("B1")
    const { ok : vinculado      } = await apiDolibarr("contacto-vincular",     "cotizacion", {id: newContacto.id, tipo: TIPOS_CONTACTO.CTZ_CUSTOMER }, cotizacion.value.id)
    console.log("B2")
    if(vinculado){
      const id                    = await getIdEnlaceContacto( cotizacion.value.id, newContacto.id )
      cotizacion.value.contacto.idRelacion  = id
      aviso("positive", "Contacto asignado", "account")
    }
  })
</script>