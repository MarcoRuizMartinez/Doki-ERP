import {    
          onMounted,
          computed,
          watch           }                           from 'vue'
import {  useStoreUser    } from 'src/stores/user'
import {  useStoreApp     } from 'src/stores/app'
import {  useRouter       } from 'vue-router'
import {  useQuasar,
          LocalStorage    } from 'quasar'
import {  ALMACEN_LOCAL,
          ORIGEN        
                          } from "src/models/TiposVarios"
import {  Usuario,
          IUsuario        } from 'src/areas/usuarios/models/Usuario'

const SESION_EXPIRAR                = 86_400_000 //* Milisegundos sin ingresar en dolibarr para expirar - 4 Dias 345600000 1 Dia 86400000

interface iLogin {
  usuario:        string
  clave:          string
}

export function useLogin( origen_ : string ) 
{
  const storeUser                 = useStoreUser()
  const storeApp                  = useStoreApp()
  const router                    = useRouter()
  const { notify }                = useQuasar()
  let   controller                = new AbortController()
  const usuario                   = computed( () => storeUser.usuario )
  const logueado                  = computed( () => storeUser.logueado )
  const online                    = computed( () => storeApp.online )
  const pre                       = process.env.PREFIJO
    
  //* ///////////////////////////////////////////////////////////////////////// On Mounted
  onMounted(() =>
  {
    if(origen_ == ORIGEN.APP ) {
      loginIniciarApp()
    }
  })

  //* ///////////////////////////////////////////////////////////////////////// Watch Logueado
  watch(
    logueado,
    (logueadoNow, loqueadoOld) =>
    {
      //console.log("me active en watch: logueadoNow igual a ", logueadoNow, loqueadoOld)
      const ultimoIngreso         = LocalStorage.getItem( pre + ALMACEN_LOCAL.FECHA_LOGIN ) as number
      if(!logueadoNow && loqueadoOld ) // Solo ocurre cuando se quiere cerrar Sesion
      {
        cerrarSesion()
        return
      }

      if
      (
        (!logueadoNow && loqueadoOld == undefined ) // loqueadoOld solo es undefined cuando inicia
        &&
        checkLoginExpirado()
        &&
        ultimoIngreso             > 0 // para que cuando es null no cierre sesion
        &&
        origen_                   == ORIGEN.APP
      )
      {
        cerrarSesion()
      }
    },
    {
      immediate:  true
    }
  )

    
  //* ///////////////////////////////////////////////////////////////////////// Loguin false, esto produce que se cierre la sesion
  function loginToFalse()
  {
    console.log('loginToFalse: ', "aca hay un problema");
    //store.commit( '', false ) // activa el Watch que cierra sesion
  }

  //* ///////////////////////////////////////////////////////////////////////// Login a iniciar app
  async function loginIniciarApp()
  {
    const token                 = LocalStorage.getItem( pre + ALMACEN_LOCAL.TOKEN      ) as string
    const usuario               = LocalStorage.getItem( pre + ALMACEN_LOCAL.USUARIO    ) as string
    const permisos              = LocalStorage.getItem( pre + ALMACEN_LOCAL.PERMISOS   ) as string
    
    if( !!token && !!usuario && !!permisos)
    {
      if(checkLoginExpirado())
      {
          loginToFalse() // activa el Watch que cierra sesion
          return
      }

      asignarUsuario( token )
    }
    
    if( logueado.value )
    {
      /*
          Busca el usuario local, para que se muestre la imagen y nombre del usuario inmediatamente.
          puede ser un problema, exponer el ID del usuario y esto se debe solucionar con un backen de mejor calidad.
      */
      let usuarioLocal            = JSON.parse( usuario )
      asignarUsuarioDolibarrLocal( new Usuario( usuarioLocal ) )
      
      if(online.value)
      {
        let usuarioDolibarr       = await getUsuarioDolibarr( { usuario: usuarioLocal.usuario, clave: ""} )
        
        if
        (
          usuarioDolibarr.id      > 0
          &&
          usuarioDolibarr.activo  // estado TRUE es que esta activo 
        )
        {
          asignarUsuarioDolibarrLocal( usuarioDolibarr )
        }
        else
        {
          loginToFalse() // activa el Watch que cierra sesion
        }
      }
    }
  }

  //* ///////////////////////////////////////////////////////////////////////// Iniciar Sesion en Dolibarr
  async function iniciarSesionDolibarr( login : iLogin ) 
  {
    let     miBody              = new FormData()
            miBody.append('login',      login.usuario)
            miBody.append('password',   login.clave)
            miBody.append('entity',     "1")

    const url                   = process.env.URL_DOLIBARR + "/api/index.php/login"

    try{
        const resultado         = await fetch( url, { method: 'POST', body:   miBody, signal: controller.signal })
        const respuesta         = await resultado.json();

        if(respuesta.hasOwnProperty('success'))
        {
            notify({
                color:      'positive',
                textColor:  'white',
                icon:       'mdi-card-account-details-star',
                message:    '👋 Hola <span class="text-capitalize">' + usuario.value.nombre + '</span>',
                position:   'top',
                html:       true
            })                
            asignarUsuario( respuesta.success.token )
            // Cambia logueado y esto activa el watch de logueado
        }
        else if(respuesta.hasOwnProperty('error'))
        {
            notify({
                color:      'negative',
                textColor:  'white',
                icon:       'mdi-account-cancel',
                message:    'Datos incorrectos',
                position:   'top',
            })    
        }

        router.push("/")            
        return respuesta
    } catch(e) {
        console.error(e);
    }
  }

  //* ///////////////////////////////////////////////////////////////////////// Iniciar Sesion en Dolibarr
  async function buscarUsuarioDolibarr( login : iLogin )
  {
    if(login.usuario.length < 3) return    
    
    let usuarioDolibarr = await getUsuarioDolibarr( login )
    if(usuarioDolibarr.id > 0){
      asignarUsuarioDolibarrLocal( usuarioDolibarr )
    }
  }

  //* ///////////////////////////////////////////////////////////////////////// Get Usuario Dolibarr
  async function getUsuarioDolibarr( login : iLogin ) : Promise <IUsuario>
  {
    let     miBody                      = new FormData()
            miBody.append("tipo",       "usuario")
            miBody.append("usuario",    login.usuario)
    const   url                         = process.env.URL_WEBSERVICES + "/listas/usuarios.php"

    try{
        const resultado         = await fetch( url, { method: 'POST', body:   miBody })
        const usuarioJson       = await resultado.json()
        
        if(!usuarioJson)
        {
          return new Usuario()
        }
        else
        {
          storeUser.setPermisos(usuarioJson[0].permisos)
          return  new Usuario( usuarioJson[0] )
        }

    } catch(e) {
        console.error(e);
    }

    return new Usuario()
  }

  //* ///////////////////////////////////////////////////////////////////////// Cerrar Sesion
  function cerrarSesion() : void
  {
    notify({
        color:      'positive',
        textColor:  'white',
        message:    '👋 Nos vemos pronto  <span class="text-capitalize">' + /* usuario.value.nombre + */ '</span>',
        position:   'top',
        html:       true,
    })
    
    LocalStorage.remove( pre + ALMACEN_LOCAL.FECHA_LOGIN   )
    LocalStorage.remove( pre + ALMACEN_LOCAL.TOKEN         )
    LocalStorage.remove( pre + ALMACEN_LOCAL.USUARIO       )
    LocalStorage.remove( pre + ALMACEN_LOCAL.PERMISOS      )
        
    storeUser.token = ""

    router.push({ name: 'login' })
  }

  //* /////////////////////////////////////////////////////////////////////////  Check login expirado
  function checkLoginExpirado() : boolean
  {
    let loginExpiro             = true
    const ultimoIngreso         = LocalStorage.getItem( pre + ALMACEN_LOCAL.FECHA_LOGIN ) as number

    if (!!ultimoIngreso)
    {
        let intervalo           = Date.now() - ultimoIngreso
        if( intervalo           < SESION_EXPIRAR )
            loginExpiro         = false
    }

    return loginExpiro
  }

  //* /////////////////////////////////////////////////////////////////////////  Asignar usuario
  function asignarUsuario( token :string )
  {  
    storeUser.logueado  = true  // Activa el watch de logueado ??? con el cambio a Pinia no se
    storeUser.token     = token    
    LocalStorage.set(pre + ALMACEN_LOCAL.FECHA_LOGIN,  Date.now())
    LocalStorage.set(pre + ALMACEN_LOCAL.TOKEN,        token)
  }

  //* ///////////////////////////////////////////////////////////////////////// Asignar Usuario Dolibarr en State y LocalStorage
  function asignarUsuarioDolibarrLocal( user : IUsuario)
  {
    //console.log('asignar Usuario Dolibarr Local: ', user);
    //store.commit('usuario/setUsuario',  user)
    storeUser.usuario = user
    //store.commit('usuario/setPermisos', user.permisos)
    storeUser.setPermisos(user.permisos)

    // Se guarda el usuario completo, para que no tenga que esperar a
    // verificar los datos del usuario, en la base de datos, 
    // sino pueda mostrar los datos inmediatamente cargada la pagina.
    // luego el verifica que el usuario exista en el momento de cargar la pagina 
    LocalStorage.set(pre + ALMACEN_LOCAL.USUARIO,  JSON.stringify(user) )
    LocalStorage.set(pre + ALMACEN_LOCAL.PERMISOS, user.permisos )
  }


  //* ///////////////////////////////////////////////////////////////////////// Abortar intento conexion
  function abortarIntentoLogin()
  {
    controller.abort();
    controller                = new AbortController()
  }

  return {
    iniciarSesionDolibarr,
    abortarIntentoLogin,
    buscarUsuarioDolibarr
  }
}