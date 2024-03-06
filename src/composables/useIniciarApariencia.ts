import {  onMounted             } from 'vue';
import {  setCssVar,
          useQuasar             } from 'quasar'
import {  useStoreUser          } from 'stores/user'
import {  ALMACEN_LOCAL         } from "src/models/TiposVarios"

export function useInciarApariencia() : void
{
    const storeUser                 = useStoreUser()
    const { addressbarColor     }   = useQuasar()
    const pre                       = process.env.PREFIJO

    onMounted(() =>
    {
        const colorLocal :string    = localStorage.getItem( pre + ALMACEN_LOCAL.COLOR ) ?? ""
        if(!!colorLocal){
            setCssVar('primary', colorLocal)
            addressbarColor.set(colorLocal)
        }

        const fondoLocal :string    = localStorage.getItem( pre + ALMACEN_LOCAL.FONDO ) ?? "Dream.webp"

        if(!!fondoLocal)          
          storeUser.setFondo(fondoLocal)

        let  patronLocal :string    = localStorage.getItem( pre + ALMACEN_LOCAL.PATRON ) ?? ""
        if(!!patronLocal)
          storeUser.patron          = patronLocal
    })
}