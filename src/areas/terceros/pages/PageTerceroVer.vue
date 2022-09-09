<template>
  <q-page                     padding
    class                     ="row justify-between items-start q-col-gutter-md"
    >
    <transition               appear
      enter-active-class      ="animated fadeInDown"
      >
      <div class              ="col-md-6 col-12 row q-col-gutter-sm">
        <formulario-tercero
          class               ="col-12"
          :tercero-carga      ="tercero"
          :puede-editar       ="puedeModificar"
        />
      </div>
    </transition>
    <div class                ="col-md-6 col-12 row q-col-gutter-sm">
      <contactos
        v-if                  ="storeUser.permisos.contactos_ver"
        class                 ="col-12"
        height-card           ="210px"
        :tercero-id           ="tercero.id ?? 0"
        :puede-editar         ="puedeModificar"
      />
      <efecto efecto          ="Down">
        <cotizaciones
          v-if                ="storeUser.permisos.cotizar_ver && tercero.esCliente"
          class               ="col-12"
          height-card         ="210px"
          :tercero-id         ="tercero.id ?? 0"
        />
      </efecto>
      <efecto>
        <documentos
          v-show              ="!!tercero.id"
          class               ="col-12 col-md-7"
          modulo              ="thirdparty"
          height-card         ="180px"
          :ref-modulo         ="tercero.id ?? 0"
          :puede-editar       ="puedeModificar"
        />
      </efecto>
      <efecto>
        <notas
          v-show              ="!!tercero.id"
          class               ="col-12 col-md-5"
          height-card         ="180px"
          :tercero-id         ="tercero.id ?? 0"
          :nota               ="tercero.notaPrivada"
          :puede-editar       ="puedeModificar"
        />
      </efecto>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import {  ref,
            toRefs,
            provide,
            computed,
            onMounted,
                            } from "vue"
  import {  useRouter       } from 'vue-router'
  import  formularioTercero   from "src/areas/terceros/components/formularioTercero/FormularioTercero.vue"
  import  contactos           from "src/areas/terceros/components/contactos/ModuloContactos.vue"
  import  notas               from "src/areas/terceros/components/helper/ModuloNotasTercero.vue"
  import  documentos          from "src/components/archivos/ModuloArchivos.vue"
  import  cotizaciones        from "src/areas/acuerdos/cotizaciones/components/modules/ModuloCotizacionesTercero.vue"
  import {  servicesTerceros     } from "src/areas/terceros/services/servicesTerceros"
  import {  useStoreUser    } from 'src/stores/user'
  import {  useTools,
            ID_URL_Ok       } from "src/useSimpleOk/useTools"
  import {  ITercero,
            Tercero,
                            } from "src/areas/terceros/models/Tercero"
  import    efecto            from "components/utilidades/Efecto.vue"
  import {  useTitle        } from '@vueuse/core'

  const storeUser             = useStoreUser()

  const router                = useRouter()
  const { aviso             } = useTools()
  const tercero               = ref<ITercero>(new Tercero())
  const props                 = defineProps({
    id: { required: true, type: String }
  })

  const { buscarTercero    }  = servicesTerceros()
  const { id }                = toRefs( props )
  const cargando              = ref< boolean >(false)
  const title                 = useTitle( "🏪 Cargando..." )
  const usuarioEsDueño        = computed( () =>{ return tercero.value.responsables.some( r => r.id == storeUser.usuario.id ) })
  const puedeModificar        = computed( () =>{
                                  if
                                  (
                                    storeUser.permisos.terceros_crear
                                    &&
                                    ( usuarioEsDueño.value || storeUser.permisos.acceso_total )
                                  )
                                    return true
                                  else
                                    return false
                                })

  onMounted( evaluarID_y_buscar )
  provide("tercero",  tercero )

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

    if(!!tercero.value.id)
    {
      title.value             = "🏪 " + tercero.value.nombre
      verificarPermisosLectura()
    }
    else
    {
      aviso("negative", "Error con la URL. Por favor verifique que este bien.", "account", 3000)
      router.push("/error")
    }
    cargando.value            = false
  }

  //* ////////////////////////////////////////////////////////////////////////////////////// Verificar permisos de lectura
  function verificarPermisosLectura()
  {
    if
    (
      ( tercero.value.esProveedor   && !storeUser.permisos.terceros_ver_proveedor )
      ||
      ( !usuarioEsDueño.value       && !storeUser.permisos.acceso_total && tercero.value.esCliente && !tercero.value.esProveedor )
    )
    {
      router.push("/error")
    }
  }





</script>
