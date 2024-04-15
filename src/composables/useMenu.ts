import {    
          onMounted,
          computed,
          watch
                        } from 'vue'
import {  storeToRefs   } from 'pinia'
import {  useStoreUser  } from 'stores/user'
import {  useStoreApp   } from 'stores/app'
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
                              label:    "Procesos y Politicas",
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
                              label:    "Registro de fallas",
                              icon:     "mdi-clipboard-text",
                              to:       "/fallas",
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
      ...new ItemMenu({ label: "Comercial", icon: "mdi-rocket-launch", to: "/comercial" }),
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
        { ...new ItemMenu({ separator: true }), },
        { ...new ItemMenu({
                            label:      "Comisiones",
                            icon:       "mdi-account-details",
                            to:         "/comisiones",
                            visible:    permisos.value.terceros_ver
                          }),
        },
        { ...new ItemMenu({
                            label:      "Pagos de comisiones",
                            icon:       "mdi-cash-check",
                            to:         "/comisiones/pagos",
                            visible:    false //permisos.value.terceros_ver
                          }),
        },
        { ...new ItemMenu({
                            label:      "Informes cotizaciones",
                            icon:       "mdi-chart-areaspline",
                            to:         "/cotizaciones/cliente/informes",
                            visible:    permisos.value.terceros_ver
                          }),
        },
        { ...new ItemMenu({
                            label:      "Calendario Mublex",
                            icon:       "mdi-calendar-month",
                            to:         "/calendario-mublex",
                            visible:    permisos.value.terceros_ver
                          }),
        },        
/*        
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
      ...new ItemMenu({ label: "Logistica", icon: "mdi-truck-fast", to: "/logistica" }),
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
                            label:      "Pedidos Tienda",
                            icon:       "mdi-store",
                            to:         "/pedidos/tienda",
                            visible:    !(usuario.value.areaEsEscom && usuario.value.esComercial)
                          }),
        },         
        { ...new ItemMenu({
                            label:      "Entregas",
                            icon:       "mdi-truck-delivery",
                            to:         "/entregas/cliente",
                            visible:    permisos.value.terceros_ver
                          }),
        },
        { ...new ItemMenu({
                            label:      "Cotizar envío",
                            icon:       "mdi-truck-check",
                            to:         "/entregas/cotizar",
                            visible:    permisos.value.terceros_ver
                          }),
        },
        /*{ ...new ItemMenu({
                            label:      "Crear pedido",
                            icon:       "mdi-cart-plus",
                            to:         "/pedidos/cliente/crear",
                            visible:    false,
                          }),
        }, */
        { ...new ItemMenu({
                            label:      "Informes pedidos",
                            icon:       "mdi-chart-areaspline",
                            to:         "/pedidos/cliente/informes",
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
        { ...new ItemMenu({
                            label:      "Guías",
                            icon:       "mdi-map-marker-path",
                            to:         "/guias",
                            visible:    true
                          }),
        },
        { ...new ItemMenu({
                            label:      "MercadoPago",
                            icon:       "mdi-credit-card-check",
                            to:         "/pedidos/mercado-pago",
                            visible:    true
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
        { ...new ItemMenu({
                              label:    "Propiedades",
                              icon:     "mdi-format-list-bulleted-type",
                              to:       "/productos/propiedades",
                              visible:  usuario.value.esProduccion || usuario.value.esGerencia || usuario.value.esProducto
                          } ),
        },        
        { ...new ItemMenu({
                              label:    "Categorías",
                              icon:     "mdi-group",
                              to:       "/productos/categorias",
                              visible:  false//usuario.value.esProduccion || usuario.value.esGerencia
                          } ),
        },        
      ]
    },
  ]
  )

  //* ///////////////////////////////////////////////////////////////////////// Watch menu
  watch(menu, ()=> menu.value = menu_.value,  { deep: true, immediate: true }  )  
}