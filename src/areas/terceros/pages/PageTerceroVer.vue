<template>
  <q-page                     padding
    class                     ="row justify-start items-start q-col-gutter-md"
    >
    <!-- <TransitionGroup          appear
      enter-active-class      ="animated fadeInDown"
      > -->
      <div class              ="col-md-6 col-12 row q-col-gutter-sm">
        <formulario-tercero
          class               ="col-12"
          :tercero-carga      ="tercero"
          :puede-editar       ="puedeModificar"
        />
      </div>
    <!-- </TransitionGroup> -->
    <div class                ="col-md-6 col-12 row q-col-gutter-sm">
      <contactos              minimizar
        v-if                  ="permisos.contactos_ver"
        class                 ="col-12"
        height-card           ="200px"
        :tercero-id           ="tercero.id ?? 0"
        :puede-editar         ="puedeModificar"
      />
      <!-- <efecto> -->
        <notas
          v-show              ="!!tercero.id"
          class               ="col-12"
          :tercero-id         ="tercero.id ?? 0"
          :nota               ="tercero.notaPrivada"
          :puede-editar       ="puedeModificar"
        />
      <!-- </efecto> -->
    </div>
      <acuerdos
        v-if                  ="permisos.cotizar_ver && tercero.esCliente"
        class                 ="col-12 col-md-4"
        :tipo                 ="TIPO_ACUERDO.COTIZACION_CLI"        
        :tercero              ="tercero"
      />
      <acuerdos
        v-if                  ="permisos.pedido_ver && tercero.esCliente"
        class                 ="col-12 col-md-4"
        :tipo                 ="TIPO_ACUERDO.PEDIDO_CLI"
        :tercero              ="tercero"
      />
      <acuerdos
        v-if                  ="permisos.prove_pedido_ver && tercero.esProveedor"
        class                 ="col-12 col-md-4"
        :tipo                 ="TIPO_ACUERDO.PEDIDO_PRO"        
        :tercero              ="tercero"
      />      
      <!-- <efecto> -->
        <documentos
          v-show              ="!!tercero.id"
          class               ="col-12 col-md-4"
          modulo              ="thirdparty"
          height-card         ="180px"
          :modulo-id          ="tercero.id ?? 0"
          :modulo-ref         ="(tercero.id ?? 0).toString()"
          :puede-editar       ="puedeModificar"
        />
      <!-- </efecto> -->
      <comentarios
        v-model               ="tercero.comentarios"
        :funcion-buscar       ="buscarComentarios"
        :asignado             ="tercero.responsables[0]"        
        :terceroId            ="tercero.id"
        :cargando             ="loadComentarios"
      />
  </q-page>
</template>

<script setup lang="ts">
/*
height-card         ="210px"
*/
  //* ///////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            toRefs,
            watch,
            provide,
            computed,
            onMounted,
                              } from "vue"
  import {  useRouter         } from 'vue-router'
  import {  useTitle          } from '@vueuse/core'

  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs     } from 'pinia'
  import {  useStoreUser    } from 'src/stores/user'
  import {  useStoreAcuerdo } from 'src/stores/acuerdo'    
  //* ///////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  ITercero,
            Tercero,
                              } from "src/areas/terceros/models/Tercero"  
  import {  TIPO_ACUERDO      } from "src/areas/acuerdos/models/ConstantesAcuerdos"                              
  //* ///////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesTerceros  } from "src/areas/terceros/services/servicesTerceros"
  import {  useControlComunicacion
                              } from "src/areas/comunicacion/controllers/ControlComunicacion"  
  import {  useTools,
            ID_URL_Ok         } from "src/useSimpleOk/useTools"  
  //* ///////////////////////////////////////////////////////////////////////////////////// Componentes
  //import  efecto                from "components/utilidades/Efecto.vue"  
  import  documentos            from "components/archivos/ModuloArchivos.vue"
  import  contactos             from "src/areas/terceros/components/contactos/ModuloContactos.vue"
  import  notas                 from "src/areas/terceros/components/helper/ModuloNotasTercero.vue"
  import  formularioTercero     from "src/areas/terceros/components/formularioTercero/FormularioTercero.vue"
  import  acuerdos              from "src/areas/terceros/components/modules/ModuloAcuerdosTercero.vue"
  import  comentarios           from "src/areas/comunicacion/components/ModuloComentarios.vue"

  const { usuario, permisos } = storeToRefs( useStoreUser() )
  const { acuerdo           } = storeToRefs( useStoreAcuerdo() )
  const router                = useRouter()
  const { aviso             } = useTools()
  const tercero               = ref<ITercero>(new Tercero())
  const props                 = defineProps({
    id: { required: true, type: String }
  })

  const { buscarTercero     } = servicesTerceros()
  const { buscarAcciones    } = useControlComunicacion()
  const { id }                = toRefs( props )
  const cargando              = ref< boolean >(false)
  const loadComentarios       = ref< boolean >(false)
  const title                 = useTitle( "🏪 Cargando..." )
  const usuarioEsDueño        = computed( () =>{ return tercero.value.responsables.some( r => r.id == usuario.value.id ) })
  const puedeModificar        = computed( () =>{
                                  if
                                  (
                                    permisos.value.terceros_crear
                                    &&
                                    ( usuarioEsDueño.value || permisos.value.acceso_total )
                                  )
                                    return true
                                  else
                                    return false
                                })

  onMounted( evaluarID_y_buscar )
  provide("tercero",  tercero )

  watch(id, evaluarID_y_buscar)

  //* ////////////////////////////////////////////////////////////////////////////////// Inicio Motor de carga de tercero
  function evaluarID_y_buscar()
  {
    let idOk                  = ID_URL_Ok( id.value )
    if(!!idOk)
      buscarTerceroDolibarr( idOk )
    else
      router.push("/error")
  }


  //* ////////////////////////////////////////////////////////////////////////////////////// Buscar tercero
  async function buscarTerceroDolibarr( id_ : number )
  {
    cargando.value            = true
    tercero.value             = await buscarTercero( id_ )
    acuerdo.value.tercero     = tercero.value

    if(!!tercero.value.id)
    {
      title.value             = "🏪 " + tercero.value.nombre
      verificarPermisosLectura()
      buscarComentarios()
    }
    else
    {
      aviso("negative", "Error con la URL. Por favor verifique que este bien.", "account", 3000)
      router.push("/error")
    }
    cargando.value            = false
  }

  async function buscarComentarios()
  {
    const query     = {
      codigo        : "AC_OTH",
      terceroId     : tercero.value.id,
      tipoElemento  : "null"
    }
    
    loadComentarios.value     = true
    tercero.value.comentarios = await buscarAcciones( query, "comentarios" )
    loadComentarios.value     = false
  }


  //* ////////////////////////////////////////////////////////////////////////////////////// Verificar permisos de lectura
  function verificarPermisosLectura()
  {
    if
    (
      ( tercero.value.esProveedor   && !permisos.value.terceros_ver_proveedor )
      ||
      ( !usuarioEsDueño.value       && !permisos.value.acceso_total && tercero.value.esCliente && !tercero.value.esProveedor )
    )
    {
      router.push("/error")
    }
  }
</script>
