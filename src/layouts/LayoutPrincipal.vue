<template>
  <q-layout
    view                ="hHh LpR fFf"
    class               ="fondo-app"
    >
    <q-header           reveal elevated
      class             ="bg-primary text-white"
      >
      <q-toolbar
        class           ="fondo-barra"
        :style          ="fondoBarra"      
        >
        <q-btn          dense flat round
          icon          ="mdi-menu"
          @click        ="toggleLeftDrawer"
        />
        <q-toolbar-title
          class         ="col-auto"
          >
          <img
          class         ="row"          
          src           ="/images/logos/doki.png"
          >
        </q-toolbar-title>
        <buscador/>
        <menu-top class ="gt-sm desktop-only"/>
        <q-space />
        <!-- <img
          class         ="row q-pr-md op20"
          src           ="/images/logos/logosEscomMublex.png"
          >         -->
        <online />
        <badge-notificaciones/>
        <menu-usuario />
      </q-toolbar>
    </q-header>

    <q-drawer           elevated show-if-above mini-to-overlay
      v-model           ="leftDrawerOpen"
      side              ="left"
      class             ="bg-grey-10 text-white"
      :persistent       ="!esMobil"
      :width            ="220"
      :breakpoint       ="500"
      :mini             ="miniState"
      @mouseover        ="miniState = false"
      @mouseout         ="miniState = true"      
      >
        <q-scroll-area  class="fit">
          <q-list       padding bordered
            class       ="rounded-borders"
            >
            <menu-expandible
              v-for     ="(item, index) in menu"
              :index    ="item.label"
              :label    ="item.label"
              :icon     ="item.icon"
              :to       ="item.to"
              :count    ="item.count"
              :submenu  ="item.submenu"
            />
          </q-list>
        </q-scroll-area>
    </q-drawer>
    <q-drawer           elevated overlay
      v-model           ="menuTareasOn"
      side              ="right"
      :min-width        ="300"
      >      
      <notificaciones/>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template> 
<script setup lang="ts">
  ///////////////////////////////////////////////////////////////////////// Core
  import {
            onMounted,
            ref,
            computed
                              } from 'vue'
  import {  LocalStorage      } from 'quasar'                              
  ///////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs       } from 'pinia'
  import {  useStoreApp       } from 'src/stores/app'
  import {  useStoreAcciones  } from 'src/stores/acciones'
  import {  useStoreUser      } from 'src/stores/user'
  ///////////////////////////////////////////////////////////////////////// Modelos
  import {  ALMACEN_LOCAL     } from "src/models/TiposVarios"
  ///////////////////////////////////////////////////////////////////////// Componibles
  import {  useMenu           } from "src/useSimpleOk/useMenu"  
  import {  useTools          } from "src/useSimpleOk/useTools"
  ///////////////////////////////////////////////////////////////////////// Componentes
  import    online              from "components/navegacion/IconOnline.vue"
  import    menuTop             from "components/navegacion/menus/MenuTop.vue"
  import    menuUsuario         from "components/navegacion/usuario/MenuUsuario.vue"
  import    menuExpandible      from "components/navegacion/menus/MenuLateralLeft.vue"
  import    buscador            from "components/navegacion/Buscador.vue"
  import    notificaciones      from "src/areas/comunicacion/components/NotificacionesTareas.vue"
  import    badgeNotificaciones from "src/areas/comunicacion/components/BadgeNotificaciones.vue"
  
  useMenu()  
  const { patron          } = storeToRefs( useStoreUser() )
  const { menu            } = storeToRefs( useStoreApp() )
  const { menuTareasOn    } = storeToRefs( useStoreAcciones() )

          
  //const { acuerdo }       = storeToRefs( useStoreAcuerdo() ) 

  const { esMobil         } = useTools()
  const leftDrawerOpen      = ref< boolean >(false)
  const rightDrawerOpen     = ref< boolean >(false)
  const miniState           = ref< boolean >(true)  
  const fondoBarra          = computed(() => "background-image: url('/images/patrones/"  + patron.value + "');" )
  const pre                 = process.env.PREFIJO

  //* ///////////////////////////////////////////////////////////////////////// On Mounted
  onMounted(() =>
  {
    let menuAbierto         = LocalStorage.getItem  ( pre + ALMACEN_LOCAL.MENU_IZQUIERDO ) as boolean
    if( menuAbierto === null) LocalStorage.set      ( pre + ALMACEN_LOCAL.MENU_IZQUIERDO, leftDrawerOpen.value)
    else
      leftDrawerOpen.value  =  esMobil ? false : menuAbierto
  })

  function toggleLeftDrawer()
  {
    leftDrawerOpen.value  = !leftDrawerOpen.value      
    LocalStorage.set( pre + ALMACEN_LOCAL.MENU_IZQUIERDO, leftDrawerOpen.value) 
  }
</script>