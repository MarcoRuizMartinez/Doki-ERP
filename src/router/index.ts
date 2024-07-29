import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import {  storeToRefs           } from 'pinia'
import {  useStoreUser          } from 'stores/user'


/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeResolve((to, from, next) =>
    {
      const { usuario, logueado, permisos } = storeToRefs( useStoreUser() )
      

      if(to.name      !== 'login'                 && !logueado.value)
        next({ name:  'login' })
      else
      if(to.name      === 'login'                 && logueado.value)
        next({ name:  'index' })

      // Redireccion a pedidos de proveedor cuando se es un usuario externo de proveedor 
      if(to.name === "index" && usuario.value.externo){
        next({ name:  'pedidosProveedor' })       
      }
      
      if
      (
        ( to.name     === 'crearCliente'          &&    !permisos.value.terceros_crear )
        ||        
        ( to.name     === 'crearProveedor'        && (  !permisos.value.terceros_crear  || !permisos.value.prove_pedido_crear))
        ||
        ( to.name     === 'buscarTerceros'        &&    !permisos.value.terceros_ver   )
      )
      {
        next({ name:  'error', params: { ruta: to.path  } })
      }

      else
        next()
    }
  )      

  return Router;
});