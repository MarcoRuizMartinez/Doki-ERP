import { axiosWoo }         from 'boot/axios'
import { Notify }           from 'quasar'

export async function getOrdenesWoo({rootState}, parametros)
{    
    let config = {
                    headers:    {Authorization: rootState.usuario.usuario.tokenWoo},
                    params:     parametros
                }
    try
    {
        let respuesta = await axiosWoo.get('orders', config)
        return respuesta.data
    }
    catch(error)
    {
        console.error(error);
        Notify.create({ type: "negative", message: "Error en getOrdenesWoo " + error })
        return -1   
    }
}
