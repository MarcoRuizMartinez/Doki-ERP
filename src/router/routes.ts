import {  RouteRecordRaw  } from 'vue-router'

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
      }
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
      {
        path: '',
        name: 'cotizaciones',
        component: () => import('src/areas/acuerdos/pages/cotizaciones/PageCotizacionesBuscar.vue'),
      },
      {
        path: '/cotizaciones/:id',
        name: 'cotizacion',
        props: true,
        component: () => import('src/areas/acuerdos/pages/cotizaciones/PageCotizacionVer.vue')
      },
      {
        path: '/cotizaciones/crear',
        name: 'crearCotizacion',
        props:  true,
        component: () => import('src/areas/acuerdos/pages/cotizaciones/PageCotizacionCrear.vue'),
      },
      {
        path: '/cotizaciones/informes',
        name: 'cotizacionInformes',
        props:  true,
        component: () => import('src/areas/acuerdos/pages/cotizaciones/PageCotizacionesInformes.vue'),
      },
    ],
  },
  {
    path: '/pedidos',
    component: () => import('layouts/LayoutPrincipal.vue'),
    children:
    [
      {
        path: '',
        name: 'pedidos',
        component: () => import('src/areas/acuerdos/pedidos/pages/PagePedidosBuscar.vue'),
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
  {
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
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;