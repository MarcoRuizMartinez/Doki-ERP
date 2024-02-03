<template>
  <div class        ="row q-col-gutter-sm">
    <q-skeleton v-if="!enlaces.length" v-for="i of 14" type="QChip" class="q-ma-sm" width="180px"/>
    <div v-for      ="link of enlaces">
      <q-btn        rounded        
        v-bind      ="style.btnFlatMd"
        color       ="white"
        :style      ="'background-color:' + link.color +';' "
        :key        ="link.ref"
        :icon       ="link.icono"        
        :label      ="link.label"
        @click      ="clickBoton( link )"
      />
      <Tooltip>{{ link.descripcion }}</Tooltip>
    </div>    
  </div>
</template>


<script lang="ts" setup>
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref, 
            watch,
            onMounted           } from "vue"
  import {  useRouter           } from 'vue-router'

  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp         } from 'src/stores/app'
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'
  import {  useApiDolibarr      } from "src/composables/useApiDolibarr"      
  import {  ToolArray           } from "src/composables/useTools"  
  import {  IItemMenu, ItemMenu } from "src/models/ItemMenu"
  import {  style               } from "src/composables/useEstilos"
  import {  Tool, ToolStr       } from "src/composables/useTools"
  
  const { busqueda            } = storeToRefs( useStoreAcuerdo() )
  const { tabs                } = storeToRefs( useStoreApp() )
  const { apiDolibarr         } = useApiDolibarr()
  const router                  = useRouter()
  const enlaces                 = ref<IItemMenu[]>([])
  const palabrasNega : string []= ['Comisiones'] 

  onMounted( cargarEnlaces )

  watch(()=>busqueda.value.acuerdo, cargarEnlaces )

  async function cargarEnlaces()
  {
    enlaces.value             = []
    busqueda.value.label      = ""
    busqueda.value.color      = ""    
    const { ok, data }        = await apiDolibarr( "buscar", "saber" )
    if(ok)
    {
      if(Array.isArray(data))
      {
        for (const itemMenu of data)
        {
          const item          = new ItemMenu( itemMenu )
          item.enlace         = item.url.replace(process.env.URL_DOLIBARR + "/ok", "")
          if(palabrasNega.some( p => item.titulo.includes( p ) ) ) continue // Para que no agregue los que tienen palabras negativas

          if(busqueda.value.esPedido && item.enlace.includes("/pedidos/cliente?"))
          {
            item.label        = ToolStr.mayusculasPrimeraLetra( item.titulo.replace("Pedidos ", "") )
            enlaces.value.push( item )
          }
          else if(busqueda.value.esOCProveedor && item.enlace.includes("/pedidos/proveedor?"))
          {
            item.label        = ToolStr.mayusculasPrimeraLetra( item.titulo.replace("Pedidos ", "") )
            enlaces.value.push( item )
          }
          else if(busqueda.value.esCotizacion && item.enlace.includes("/cotizaciones/cliente?"))
          {
            enlaces.value.push( item )
          }          
        }
 
        enlaces.value         = ToolArray.ordenar( enlaces.value, 'orden', "<")
      }
    }
  }

  async function clickBoton( link : IItemMenu)
  {
    router.push(link.enlace )
    await Tool.pausa(10)
    busqueda.value.copiarQueryACampos()
    busqueda.value.label = link.label
    busqueda.value.color = link.color
    tabs.value.activa ="tab_1"
  }
  
</script>