import {    
          onMounted,
          computed,
          watch
                        } from 'vue'
import {  storeToRefs   } from 'pinia'
import {  useStoreUser  } from 'src/stores/user'
import {  useStoreApp   } from 'src/stores/app'
import {  ItemMenu      } from 'components/navegacion/menus/iItemMenu'

export function useMenu() 
{
  const { usuario, permisos } = storeToRefs( useStoreUser() ) 
  const { menu              } = storeToRefs( useStoreApp()  )

  const menu_                 = computed( () =>
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
      ...new ItemMenu({ label: "📖", icon: "mdi-book-open-variant" }),
      submenu:
      [
        { ...new ItemMenu({
                              label:    "Politicas",
                              icon:     "mdi-shield-star",
                              to:       "/politicas",
                              visible:  true
                          } ),
        },
        { ...new ItemMenu({
                              label:    "Ayudas",
                              icon:     "mdi-help-circle",
                              to:       "/ayudas",
                              visible:  true
                          } ),
        },
        { ...new ItemMenu({
                              label:    "Mejora continua",
                              icon:     "mdi-rocket-launch",
                              to:       "/ideas",
                              visible:  true
                          } ),
        },
      ]
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
                            to:         "/cotizaciones/cliente",
                            visible:    permisos.value.terceros_ver
                          }),
        },
        { ...new ItemMenu({
                            label:      "Crear cotización",
                            icon:       "mdi-format-list-checks",
                            to:         "/cotizaciones/cliente/crear",
                            visible:    permisos.value.terceros_ver
                          }),
        },
/*         
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
        */
      ]
    },
    {
      ...new ItemMenu({ label: "Logistica", icon: "mdi-truck-fast", to: "/pedidos/cliente" }),
      submenu:
      [
        { ...new ItemMenu({
                            label:      "Pedidos",
                            icon:       "mdi-cart",
                            to:         "/pedidos/cliente",
                            visible:    permisos.value.terceros_ver
                          }),
        }, 
        { ...new ItemMenu({
                            label:      "Crear pedido",
                            icon:       "mdi-cart-plus",
                            to:         "/pedidos/cliente/crear",
                            visible:    permisos.value.terceros_ver
                          }),
        },
        { ...new ItemMenu({
                              label:    "Garantías",
                              icon:     "mdi-lifebuoy",
                              to:       "/garantias",
                              visible:  true
                          } ),
        },        
        { ...new ItemMenu({ separator: true }), },
        { ...new ItemMenu({
                            label:      "Pedidos proveedor",
                            icon:       "mdi-domain",
                            to:         "/pedidos/proveedor",
                            visible:    permisos.value.terceros_ver
                          }),
        },                
      ]
    },
/*     
    {
      ...new ItemMenu({ label: "Cuentas", icon: "mdi-book-open-variant", to: "/facturas/cliente" }),
      submenu:
      [
        { ...new ItemMenu({
                            label:      "Facturas clientes",
                            icon:       "mdi-inbox-full",
                            to:         "/facturas/cliente",
                            visible:    permisos.value.terceros_ver
                          }),
        }, 
        { ...new ItemMenu({
                            label:      "Facturas proveedor",
                            icon:       "mdi-inbox-full",
                            to:         "/facturas/proveedor",
                            visible:    permisos.value.terceros_ver
                          }),
        },
      ]
    },
 */
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
                              visible:  usuario.value.esProduccion || usuario.value.esGerencia
                          } ),
        },
      ]
    },
  ]
  )

  //* ///////////////////////////////////////////////////////////////////////// Watch menu
  watch(menu, ()=> menu.value = menu_.value,  { deep: true, immediate: true }  )  
}