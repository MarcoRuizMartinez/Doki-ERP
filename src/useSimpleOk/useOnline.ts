import {  onMounted       }                           from 'vue'
import {  useStoreApp     } from 'src/stores/app' 
import {  useQuasar       } from 'quasar'


export function useOnline() 
{
  const storeApp                = useStoreApp()
  const $q                      = useQuasar()

  //* ///////////////////////////////////////////////////////////////////////// On Mounted
  onMounted(() =>
  {
    window.addEventListener("online",   manejarConexion)
    window.addEventListener("offline",  manejarConexion)
  })

  function manejarConexion( e : Event )
  {
    switch (e.type)
    {
      case "online":
        storeApp.online = true
        $q.notify({
          color:      'positive',
          textColor:  'white',
          icon:       'mdi-wifi',
          message:    'Conexión establecida',
          position:   'top',
        })       
        break
      case "offline":
        storeApp.online = false
        $q.notify({
          color:      'negative',
          textColor:  'white',
          icon:       'mdi-wifi-off',
          message:    'Conexión perdida',
          position:   'top',
        })                     
        break        
      default:
        break;
    }
  }
}