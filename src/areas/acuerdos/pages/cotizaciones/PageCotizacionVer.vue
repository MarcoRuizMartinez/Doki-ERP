<template>
  <q-page                     padding
    class                     ="row items-stretch content-start justify-start q-col-gutter-md"
    >
    <vista-acuerdo/>
  </q-page>
</template>

<script setup lang="ts">
  //* ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,
            toRefs,
            provide,
            onMounted,
                                  } from "vue"  
  import {  useTitle              } from "@vueuse/core"
  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'  
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
  //* ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  TIPO_ACUERDO          } from "../../models/Acuerdo"  
  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    vistaAcuerdo            from "src/areas/acuerdos/components/Views/VistaCotizacion.vue"

  const { acuerdo                 } = storeToRefs( useStoreAcuerdo() )

  const { buscarAcuerdo     } = useControlAcuerdo()
  const { copiarProductos,
          deGruposAProductos }= useControlProductos()
  const minimizadoTodo        = ref< boolean  >(false)
  const tipo                  = ref< TIPO_ACUERDO >( TIPO_ACUERDO.COTIZACION )
  const title                 = useTitle()
  provide('superminimizado', minimizadoTodo)

  const props                 = defineProps({
    id: { required: true, type: String }
  })

  const { id }                = toRefs( props )
  


  watch(acuerdo, ()=>  title.value =  `📜 ${acuerdo.value.title}`,{ deep: true } )

  onMounted   ( iniciar )
  //onUnmounted ( ()=> acuerdo.value = new Acuerdo() )

  async function iniciar()
  {
    const gruposBoceto              = Object.assign( acuerdo.value.proGrupos, {} )
    await buscarAcuerdo( tipo.value, id.value )
    copiarProductosDeBoceto()

    async function copiarProductosDeBoceto()
    {
      if(!!gruposBoceto.length){
        acuerdo.value.proGrupos     = gruposBoceto
        await deGruposAProductos()
        const ok                    = await copiarProductos( acuerdo.value.productos )
        if(ok)
          await buscarAcuerdo( tipo.value, id.value )
      }
    }
  }

  //* ////////////////////////////////////////////////////////////////////// Verificar permisos de lectura
/*   function verificarPermisosLectura()
  {
    if
    (
      ( acuerdo.value.tercero.esProveedor   && !permisos.value.terceros_ver_proveedor )
      ||
      ( !usuarioEsDueño.value       && !permisos.value.acceso_total && acuerdo.value.tercero.esCliente && !acuerdo.value.tercero.esProveedor )
    )
    {
      router.push("/error")
    }
  } */
</script>
