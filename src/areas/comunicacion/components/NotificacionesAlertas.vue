<template> 
  <div
    v-if                  ="!!enlaces.length"
    :class                ="$attrs.class"
    class                 ="q-pa-md"     
    >
    <div class            ="fuente-delicada text-1_4em q-mb-md row justify-between">
      <span>Alertas</span>
      <q-btn              flat round dense
        icon              ="mdi-refresh"
        class             ="op60 op100-hover "
        @click            ="buscar"
      />      
    </div>
    <div  class           ="column gap-sm">  
      <div v-for          ="link of enlaces">
        <q-btn            rounded
          v-bind          ="style.btnFlatMd"
          color           ="white"
          class           ="full-width"
          :style          ="'background-color:' + link.color +';' "
          :key            ="link.ref"
          :icon           ="link.icono"
          :label          ="link.label"
          @click          ="clickBoton( link )"
          >
          <q-badge        rounded floating
            :color        ="!!link.cuenta ? 'red' : 'green'"
            :label        ="link.cuenta"
          />        
        </q-btn>
        
      </div>      
    </div>
  </div>
  <inner-loading :cargando="loading"/>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            onMounted,
            onUnmounted             } from 'vue'
  import {  useRouter               } from 'vue-router'
  import {  usePageLeave            } from '@vueuse/core'
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs             } from 'pinia'
  import {  useStoreUser            } from 'src/stores/user'
  import {  useStoreApp             } from 'src/stores/app'
  import {  useStoreAcuerdo         } from 'src/stores/acuerdo'  

  // * /////////////////////////////////////////////////////////////////////////////////// Componibles

  import {  style                   } from "src/composables/useEstilos"
  import {  useApiDolibarr          } from "src/composables/useApiDolibarr"      
  import {  servicesAcuerdos        } from "src/areas/acuerdos/controllers/servicesAcuerdos"
  import {  Tool,
            ToolType,
            ToolArray               } from "src/composables/useTools"
            
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IItemMenu, ItemMenu     } from "src/models/ItemMenu"
  import {  TIPO_ACUERDO            } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  import {  IQuery                  } from 'src/models/Busqueda'

  // * /////////////////////////////////////////////////////////////////////////////////// Componentes

  import    innerLoading              from "components/utilidades/InnerLoading.vue"

  const loading                 = ref<boolean>(false)
  const enlaces                 = ref<IItemMenu[]>([])
  const router                  = useRouter()
  const { apiDolibarr         } = useApiDolibarr()
  const { getCountAcuerdos    } = servicesAcuerdos()
  const { busqueda            } = storeToRefs( useStoreAcuerdo() )
  const { tabs, alertas       } = storeToRefs( useStoreApp() )
  const { usuario             } = storeToRefs( useStoreUser() )  
  const usuarioAfuera           = usePageLeave()

  onMounted(iniciar)
  onUnmounted(()=> enlaces.value = [])

  async function iniciar()
  {
    await Tool.pausa( 6_000 )
    buscar()
  }

  async function buscar()
  {    
    await cargarEnlaces()
    await hacerConsultasDeEnlaces()
  }

  async function cargarEnlaces()
  {
    const gruposUsuario       = ToolArray.getArrayNumDeStr( usuario.value.gruposIds )
    if(!gruposUsuario.length) return

    loading.value             = true
    enlaces.value             = []
    const { ok, data }        = await apiDolibarr( "buscar", "saber" )
    if(ok)
    {
      if(Array.isArray(data))
      {
        for (const itemMenu of data)
        {
          const item          = new ItemMenu( itemMenu )
          if(!item.alerta || !item.url.includes("?")) continue
          const itemEsParaGrupoUsuario = gruposUsuario.some( gu => item.gruposUsuarios.some( gi => gu === gi ) )

          if(!itemEsParaGrupoUsuario) continue
          
          item.enlace         = item.url.replace(process.env.URL_DOLIBARR + "/ok", "")          
          const urlStr        = item.url[0] == "h" ? item.url : process.env.URL_DOLIBARR + item.url // Para cuando es https:// o / pedido
          const url           = new URL( urlStr )

          for (const param of url.searchParams)
            item.urlParams.push( param )

          item.tipoAcuerdo    =   item.enlace.includes( "pedidos/proveedor" ) ? TIPO_ACUERDO.PEDIDO_PRO
                                : item.enlace.includes( "pedidos/cliente"   ) ? TIPO_ACUERDO.PEDIDO_CLI
                                : ""

          enlaces.value.push( item )
        }
 
        enlaces.value         = ToolArray.ordenar( enlaces.value, 'orden', "<")
      }
    }
    loading.value             = false
  }
  
  async function hacerConsultasDeEnlaces()
  {
    if(!usuarioAfuera.value)
    {
      loading.value             = true
      alertas.value             = 0
      for (const item of enlaces.value)
      {
        const preQuery : any    = { acuerdo: item.tipoAcuerdo, tipo: "busqueda" } 

        if(usuario.value.esComercial && item.tipoAcuerdo === TIPO_ACUERDO.PEDIDO_CLI) 
          preQuery.usuario      = usuario.value.id
        
        const query             = item.urlParams.reduce((acc, tupla) => ({ ...acc, ...ToolType.convertirTuplaAObjeto(tupla) }), preQuery) as IQuery
        item.cuenta             = await getCountAcuerdos( query )
        alertas.value           += item.cuenta
      }
      loading.value             = false
    }

    await Tool.pausa( 130_000 )
    hacerConsultasDeEnlaces()
  }

  async function clickBoton( link : IItemMenu)
  {
    router.push( link.enlace )
    await Tool.pausa(10)
    busqueda.value.copiarQueryACampos()
    busqueda.value.label = link.label
    busqueda.value.color = link.color
    tabs.value.activa ="tab_1"
  }

</script>
<style>
</style>