import {  computed      } from 'vue'
import {  useStoreUser  } from 'stores/user'

export function useUsuario() 
{
  const storeUser             = useStoreUser()
  //const permisos              = computed( () => storeUser.usuario.permisos  )
  //const usuario               = computed( () => storeUser.usuario.usuario   )

  return {
    //permisos,
    //usuario
  }
}