import {  RouteRecordRaw  } from "vue-router"
import {  TIPO_ACUERDO    } from "src/areas/acuerdos/models/ConstantesAcuerdos"

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('layouts/LayoutLogin.vue'),
    children:
    [
      {
        path: '',
        name: 'login',
        component: () => import('pages/PageLogin.vue')
        //component: () => import('pages/ErrorNotFound.vue')
      }, 
    ]
  },
  {
    path: '/',
    component: () => import('layouts/LayoutPrincipal.vue'),
    children:
    [
      {
        path: '',
        name: 'index',
        component: () => import('pages/Index.vue')
      },
      {
        path: 'error',
        name: 'error',
        component: () => import('pages/PageSinPermisos.vue'),
        props: true
      },
      {
        path: 'politicas',
        name: 'politicas',
        props: {
                src:    "https://airtable.com/embed/shr3RyLFc5ujEGFZt?backgroundColor=cyan&viewControls=on",
                titulo: "Procesos y Politicas",
                icono:  "mdi-shield-star",
                link:   "https://airtable.com/embed/shr3RyLFc5ujEGFZt/tblY7nRIsN5bctOwZ?backgroundColor=gray&viewControls=on",
              },
        component: () => import('src/pages/PaginaIframe.vue')
      },
      {
        path: 'ayudas',
        name: 'ayudas',
        props: {
                src:    "https://airtable.com/embed/shrza0g3D4XowxyzR?backgroundColor=cyan&viewControls=on",
                titulo: "Ayudas y guías",
                icono:  "mdi-help-circle",
                link:   "https://airtable.com/shrza0g3D4XowxyzR/tbl0bVTdeiC9ZRJL3?backgroundColor=cyan&viewControls=on",
              },
        component: () => import('src/pages/PaginaIframe.vue')
      },
      {
        path: 'ideas',
        name: 'ideas',
        props: {
                src:            "https://airtable.com/embed/shrD7MAAGTDI2ysVW?backgroundColor=cyan&viewControls=on",
                titulo:         "Mejora continua",
                icono:          "mdi-rocket-launch",
                link:           "https://airtable.com/shrD7MAAGTDI2ysVW",
                srcFormulario:  "https://airtable.com/embed/shrYhHH17wVSAe389?backgroundColor=cyan",
              },
        component: () => import('src/pages/PaginaIframe.vue')
      },
      {
        path: 'garantias',
        name: 'garantias',
        props: {
                src:            "https://airtable.com/embed/shrTomYqJm4HxyHus?backgroundColor=cyan&viewControls=on",
                titulo:         "Garantías",
                icono:          "mdi-lifebuoy",
                link:           "https://airtable.com/appDnXJg9nZ4PGLlL/pagOqbRoGUnw7c5MN?DrUh9=recCAkL0kRxOBylki",
                srcFormulario:  "https://airtable.com/embed/shrLfahiij8C8JhJ3?backgroundColor=cyan",
              },
        component: () => import('src/pages/PaginaIframe.vue')
      },
      {
        path: 'guias',
        name: 'guias',
        component: () => import('src/areas/logistica/pages/PageGuias.vue')
      },         
/*       {
        path: 'test',
        name: 'test',
        component: () => import('pages/PageTest.vue')
      } */
    ],
  },
  {
    path: '/terceros',
    component: () => import('layouts/LayoutPrincipal.vue'),
    children:
    [
      {
        path: '',
        name: 'buscarTerceros',
        component: () => import('src/areas/terceros/pages/PageTerceroBuscar.vue'),
      },
      {
        path: '/crear-cliente',
        name: 'crearCliente',
        component: () => import('src/areas/terceros/pages/PageTerceroCrear.vue'),
        props: { tipo: "crear-cliente" }
      },
      {
        path: '/crear-proveedor',
        name: 'crearProveedor',
        component: () => import('src/areas/terceros/pages/PageTerceroCrear.vue'),
        props: { tipo: "crear-proveedor" }
      },
      {
        path: '/tercero/:id',
        name: 'tercero',
        props: true,
        component: () => import('src/areas/terceros/pages/PageTerceroVer.vue')
      },
    ],
  },
  {
    path: '/cotizaciones',
    component: () => import('layouts/LayoutPrincipal.vue'),
    children:
    [
      //* ////////////////////////////////////////////////////////////////// Cotizacion cliente Buscar
      {
        path:       'cliente',
        name:       'cotizaciones',
        props:      () => ({ tipo: TIPO_ACUERDO.COTIZACION_CLI }),
        component:  () => import('src/areas/acuerdos/pages/PageAcuerdoBuscar.vue'),
      },
      //* ////////////////////////////////////////////////////////////////// Cotizacion cliente Ver
      {
        path:       'cliente/:id',
        name:       'cotizacion',
        props:      route => ({ tipo: TIPO_ACUERDO.COTIZACION_CLI, id: route.params.id }),
        component:  () => import('src/areas/acuerdos/pages/PageAcuerdoVer.vue')
      },
      //* ////////////////////////////////////////////////////////////////// Cotizacion cliente Crear
      {
        path:       'cliente/crear',
        name:       'crearCotizacion', 
        props:      route => ({ tipo: TIPO_ACUERDO.COTIZACION_CLI }), // , terceroId: route.params.terceroId
        component:  () => import('src/areas/acuerdos/pages/PageAcuerdoCrear.vue'),
      }, 
      {
        path:       'cliente/informes',
        name:       'cotizacionesInforme',
        props:      () => ({ tipo: TIPO_ACUERDO.COTIZACION_CLI }),
        component:  () => import('src/areas/acuerdos/pages/PageAcuerdoInformes.vue'),
      },      
      //* ////////////////////////////////////////////////////////////////// Cotizacion cliente informes
/*       {
        path:       'cliente/informes-old',
        name:       'cotizacionesInformeOld',
        props:      true,
        component:  () => import('src/areas/acuerdos/pages/informes/PageInformeCotizaciones.vue.txt'),
      }, */
    ],
  },
  //* //////////////////////////////////////////////////////////////////
  //* ////////////////////////////////////////////////////////// Pedidos 
  {
    path:           '/pedidos',
    component:      () => import('layouts/LayoutPrincipal.vue'),
    children:
    [
      //* ////////////////////////////////////////////////////////////////// Pedido cliente Buscar 
      {
        path:       '',
        name:       'portadaLogistica',
        component:  () => import('src/areas/logistica/pages/PagePortadaLogistica.vue'),
      },      
      //* ////////////////////////////////////////////////////////////////// Pedido cliente Buscar 
      {
        path:       'cliente',
        name:       'pedidos',
        props:      () => ({ tipo: TIPO_ACUERDO.PEDIDO_CLI }),
        component:  () => import('src/areas/acuerdos/pages/PageAcuerdoBuscar.vue'),
      },
      //* ////////////////////////////////////////////////////////////////// Pedido cliente Woocommerce 
      {
        path:       'tienda',
        name:       'pedidosTienda',
        component:  () => import('src/areas/acuerdos/pages/PagePedidosWoo.vue'),
      },      
      //* ////////////////////////////////////////////////////////////////// Pedido cliente Ver 
      {
        path:       'cliente/:id',
        name:       'pedido',
        props:      route => ({ tipo: TIPO_ACUERDO.PEDIDO_CLI, id: route.params.id }),
        component:  () => import('src/areas/acuerdos/pages/PageAcuerdoVer.vue')
      },          
      //* ////////////////////////////////////////////////////////////////// Pedido cliente Crear 
      {
        path:       'cliente/crear',
        name:       'crearPedido',
        props:      route => ({ tipo: TIPO_ACUERDO.PEDIDO_CLI }), // , terceroId: route.params.terceroId
        component:  () => import('src/areas/acuerdos/pages/PageAcuerdoCrear.vue'),
      },
      {
        path:       'cliente/informes',
        name:       'pedidosInforme',
        props:      () => ({ tipo: TIPO_ACUERDO.PEDIDO_CLI }),
        component:  () => import('src/areas/acuerdos/pages/PageAcuerdoInformes.vue'),
      },           
      //* ////////////////////////////////////////////////////////////////// Pedido proveedor Buscar
      {
        path:       'proveedor',
        name:       'pedidosProveedor',
        props:      () => ({ tipo: TIPO_ACUERDO.PEDIDO_PRO }),
        component:  () => import('src/areas/acuerdos/pages/PageAcuerdoBuscar.vue'),
      },
      //* ////////////////////////////////////////////////////////////////// Pedido proveedor Ver
      {
        path:       'proveedor/:id',
        name:       'pedidoProveedor',
        props:      route => ({ tipo: TIPO_ACUERDO.PEDIDO_PRO, id: route.params.id }),
        component:  () => import('src/areas/acuerdos/pages/PageAcuerdoVer.vue')
      },
    ],
  },
  //* //////////////////////////////////////////////////////////////////
  //* ////////////////////////////////////////////////////////// Entregas
  {
    path:           '/entregas',
    component:      () => import('layouts/LayoutPrincipal.vue'),
    children:
    [
      //* ////////////////////////////////////////////////////////////////// Entregas cliente Buscar 
      {
        path:       'cliente',
        name:       'entregas',
        props:      () => ({ tipo: TIPO_ACUERDO.ENTREGA_CLI }),
        component:  () => import('src/areas/acuerdos/pages/PageAcuerdoBuscar.vue'),
      },
      //* ////////////////////////////////////////////////////////////////// Entrega cliente Ver 
      {
        path:       'cliente/:id',
        name:       'entrega',
        props:      route => ({ tipo: TIPO_ACUERDO.ENTREGA_CLI, id: route.params.id }),
        component:  () => import('src/areas/acuerdos/pages/PageAcuerdoVer.vue')
      },
      //* ////////////////////////////////////////////////////////////////// Cotizar Envios
      {
        path:       'cotizar',
        name:       'cotizarEnvio',        
        component:  () => import('src/areas/logistica/pages/PageCotizarEnvio.vue')
      }      
    ]
  },
  //* //////////////////////////////////////////////////////////////////
  //* ////////////////////////////////////////////////////////// Facturas
  {
    path: '/facturas',
    component: () => import('layouts/LayoutPrincipal.vue'),
    children:
    [
      {
        path:       'cliente',
        name:       'facturasCli',
        props:      () => ({ tipo: TIPO_ACUERDO.FACTURA_CLI }),
        component:  () => import('src/areas/acuerdos/pages/PageAcuerdoBuscar.vue'),
      },
      {
        path:       '/cliente/:id',
        name:       'facturaCli',
        props:      route => ({ tipo: TIPO_ACUERDO.FACTURA_CLI, id: route.params.id }),
        component:  () => import('src/areas/acuerdos/pages/PageAcuerdoVer.vue')
      },
      {
        path:       '/cliente/crear',
        name:       'crearFacturaCli', 
        props:      route => ({ tipo: TIPO_ACUERDO.FACTURA_CLI }), // , terceroId: route.params.terceroId
        component:  () => import('src/areas/acuerdos/pages/PageAcuerdoCrear.vue'),
      },
    ],
  },
  {
    path:           '/productos',
    component:      () => import('layouts/LayoutPrincipal.vue'),
    children:
    [
      {
        path:       '',
        name:       'productos',
        component:  () => import('src/areas/productos/pages/PageProductosBuscar.vue'),
      },
      {
        path:       '/productos/:id',
        name:       'producto',
        props:      true,
        component:  () => import('src/areas/productos/pages/PageProductosVer.vue')
      },      
      {
        path:       '/productos/crear',
        name:       'crearProducto',
        component:  () => import('src/areas/productos/pages/PageProductosCrear.vue'),
      },      
    ],
  },
  //* //////////////////////////////////////////////////////////////////////
  //* ////////////////////////////////////////////////////////// Comisiones
  {
    path:           '/comisiones',
    component:      () => import('layouts/LayoutPrincipal.vue'),
    children:
    [
      //* ////////////////////////////////////////////////////////////////// Pedido cliente Buscar 
      {
        path:       '',
        name:       'comisiones',
        component:  () => import('src/areas/nomina/pages/PageBuscarIncentivos.vue'),
      },
      //* ////////////////////////////////////////////////////////////////// Pedido cliente Ver 
      {
        path:       'pagos/',
        name:       'pagosComisiones',
        component:  () => import('src/areas/nomina/pages/PageBuscarIncentivosPagos.vue'),
      },
    ],
  },  
  /*
  {
    path: '/empresa',
    component: () => import('layouts/LayoutPrincipal.vue'),
    children:
    [
      {
        path: 'hoja-de-ruta',
        name: 'hojaDeRuta',
        component: () => import('src/areas/empresa/pages/PageHojaDeRuta.vue')
      },
    ],
  },
  */
 /*  { 
    path: '/politicas',
    component: () => import('layouts/LayoutPrincipal.vue'),
    children:
    [
      {
        path: 'politicas-entre-comerciales',
        name: 'politicasEntreComerciales',
        component: () => import('src/areas/empresa/pages/politicas/PageEntreComerciales.vue')
      },
      {
        path: 'politicas-entrega',
        name: 'politicasEntrega',
        component: () => import('src/areas/empresa/pages/politicas/PageEntrega.vue')
      },      
    ],
  }, */
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;