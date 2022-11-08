import {    
          onMounted,
          computed,
          watch
                        } from 'vue'
import {  useStoreUser  } from 'src/stores/user'
import {  useStoreApp   } from 'src/stores/app'
import {  ItemMenu      } from 'components/navegacion/menus/iItemMenu'

export function useMenu() 
{
  const storeUser                 = useStoreUser()
  const storeApp                  = useStoreApp()
  const permisos                  = computed(() => storeUser.permisos )
  const menu                      = computed( () =>
  [
    {
      ...new ItemMenu({ label:    "Inicio", icon: "mdi-home-circle", to: "/" }),
      /* submenu:
      [
        { ...new ItemMenu({
            label:      "Hoja de ruta",
            icon:       "mdi-timeline-check",
            to:         "/empresa/hoja-de-ruta",
            visible:    true
          }),
        },
      ] */                     
    },
    {
      ...new ItemMenu({ label: "Terceros", icon: "mdi-account-group", to: "/terceros" }),
      submenu:
      [
        { ...new ItemMenu({
                            label:      "Buscar terceros",
                            icon:       "mdi-account-search",
                            to:         "/terceros",
                            visible:    permisos.value.terceros_ver
                          }),
        },    
        { ...new ItemMenu({
                            label:      "Crear cliente",
                            icon:       "mdi-account-plus",
                            to:         "/crear-cliente",
                            visible:    permisos.value.terceros_crear
                          }),
        },
        { ...new ItemMenu({
                            label:      "Crear proveedor",
                            icon:       "mdi-domain-plus",
                            to:         "/crear-proveedor",
                            visible:    permisos.value.terceros_crear_proveedor
                          }), 
        },
      ]
    },
    {
      ...new ItemMenu({ label: "Comercial", icon: "mdi-rocket-launch", to: "/cotizaciones" }),
      submenu:
      [
        { ...new ItemMenu({
                            label:      "Cotizaciones",
                            icon:       "mdi-table-search",
                            to:         "/cotizaciones",
                            visible:    permisos.value.terceros_ver
                          }),
        },
        { ...new ItemMenu({
                            label:      "Crear cotización",
                            icon:       "mdi-format-list-checks",
                            to:         "/cotizaciones/crear",
                            visible:    permisos.value.terceros_ver
                          }),
        },                            
        { ...new ItemMenu({
                            label:      "Informes",
                            icon:       "mdi-chart-areaspline",
                            to:         "/cotizaciones/informes",
                            visible:    permisos.value.terceros_ver
                          }),
        },
        { ...new ItemMenu({ separator: true }), },
        { ...new ItemMenu({
                            label:      "Políticas entre comerciales",
                            icon:       "mdi-book-open-variant",
                            to:         "/politicas/politicas-entre-comerciales",
                            visible:    permisos.value.terceros_ver
                          }),                                              
        },
        { ...new ItemMenu({
                            label:      "Políticas de entrega",
                            icon:       "mdi-book-open-variant",
                            to:         "/politicas/politicas-entrega",
                            visible:    permisos.value.terceros_ver
                        }),
        },
      ]
    },
    {
      ...new ItemMenu({ label: "Logistica", icon: "mdi-truck-fast", to: "/pedidos" }),
      submenu:
      [
        { ...new ItemMenu({
                            label:      "Pedidos",
                            icon:       "mdi-cart",
                            to:         "/pedidos",
                            visible:    permisos.value.terceros_ver
                          }),
        }, 
        { ...new ItemMenu({
                            label:      "Crear pedido",
                            icon:       "mdi-cart-plus",
                            to:         "/pedidos/crear",
                            visible:    permisos.value.terceros_ver
                          }),
        },
        { ...new ItemMenu({ separator: true }), },
        { ...new ItemMenu({
                            label:      "Pedidos proveedor",
                            icon:       "mdi-water-well",
                            to:         "/pedidos-proveedor",
                            visible:    permisos.value.terceros_ver
                          }),
        },                
      ]
    },
    {
      ...new ItemMenu({ label: "Productos", icon: "mdi-package-variant-closed" }),
      submenu:
      [
        { ...new ItemMenu({
                              label:    "Productos",
                              icon:     "mdi-layers-triple",
                              to:       "/productos",
                              visible:  permisos.value.terceros_ver
                          } ),
        },        
        { ...new ItemMenu({
                              label:    "Crear producto",
                              icon:     "mdi-layers-plus",
                              to:       "/productos/crear",
                              visible:  permisos.value.terceros_ver
                          } ),
        },
      ]
    },
  ]
  )
    
  //* ///////////////////////////////////////////////////////////////////////// On Mounted
  onMounted(() =>
  {
    storeApp.menu = menu.value
  })

  //* ///////////////////////////////////////////////////////////////////////// Watch menu
  watch(menu, (menuNow, menuOld) =>
  {
    storeApp.menu = menuNow
  },
  { deep: true }
  )

  return { menu}
}