import { route                  } from 'quasar/wrappers';
import {
          createMemoryHistory,
          createRouter,
          createWebHashHistory,
          createWebHistory,
                                } from 'vue-router';
import    routes                  from './routes';
import {  useStoreUser          } from 'src/stores/user'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ( { /*store, ssrContext*/ } ) {  
  const createHistory = process.env.SERVER
                        ? createMemoryHistory
                        : ( process.env.VUE_ROUTER_MODE === 'history'
                            ? createWebHistory
                            : createWebHashHistory
                          );

  const Router        = createRouter({
                          scrollBehavior: () => ({ left: 0, top: 0 }),
                          routes,

                          // Leave this as is and make changes in quasar.conf.js instead!
                          // quasar.conf.js -> build -> vueRouterMode
                          // quasar.conf.js -> build -> publicPath
                          history: createHistory(process.env.VUE_ROUTER_BASE),
                        });

  Router.beforeResolve((to, from, next) =>
    {
      const storeUser = useStoreUser()

      if(to.name      !== 'login'                 && !storeUser.logueado)
        next({ name:  'login' })
      else
      if(to.name      === 'login'                 && storeUser.logueado)
        next({ name:  'index' })
      
      if
      (
        ( to.name     === 'crearCliente'          && !storeUser.permisos.terceros_crear )
        ||        
        ( to.name     === 'crearProveedor'        && ( !storeUser.permisos.terceros_crear  || !storeUser.permisos.prove_pedido_crear))
        ||
        ( to.name     === 'buscarTerceros'        && !storeUser.permisos.terceros_ver   )
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
