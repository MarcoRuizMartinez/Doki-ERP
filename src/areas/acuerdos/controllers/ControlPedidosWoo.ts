//* ////////////////////////////////////////////////////////////////// Core
import {  useRouter             } from 'vue-router'
//* ////////////////////////////////////////////////////////////////// Store
import {  storeToRefs           } from 'pinia'
import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
import {  useStoreUser          } from 'src/stores/user'
//* ////////////////////////////////////////////////////////////////// Componibles
import {  useFetch              } from "src/useSimpleOk/useFetch"
import {  getURL, getFormData   } from "src/services/APIMaco"
import {  useTools,
          getArrayFromAny,
          getArrayInObject,
          existeYEsValido,
          getNumberValido,
          ID_URL_Ok,
          confeti               } from "src/useSimpleOk/useTools"

//* ////////////////////////////////////////////////////////////////// Modelos
import {  IPedidoWoo, PedidoWoo } from "src/areas/acuerdos/models/PedidoWoo"
import {  IQuery                } from "src/models/Busqueda" 
import {  IMercadoPago,
          MercadoPago           } from "src/areas/acuerdos/models/PagoMercadoPago"

export function useControlPedidosWoo()
{
  const { aviso               } = useTools()
  const { miFetch             } = useFetch()
  //const { usuario             } = storeToRefs( useStoreUser() )
 
  //const endPoint                = ( tipo : "servicios" | "listas" ) => getURL(tipo, "acuerdos")
  //usuario.value.wooToken
  
  //* ////////////////////////////////////////////////////////////////////// Buscar Acuerdo
  async function buscarOrdenesWoo( q : IQuery ) : Promise<IPedidoWoo[]>
  {
    const pedidosRaw = await getOrdenesWoo( q )    
    if(!pedidosRaw.length) return []

    const pedidos : IPedidoWoo[] = []

    for (const p of pedidosRaw)
    {
      p.id          = parseInt( p?.id ?? "0" )
      p.total       = parseInt( p?.total ?? "0" )
      p.total_tax   = parseInt( p?.total_tax ?? "0" )

      
      const items   = getArrayInObject( p, "line_items")
      for (const i of items)
      {
        i.quantity  = parseInt( i?.quantity ?? "0" )
        i.total     = parseInt( i?.total ?? "0" ) 
        i.price     = parseInt( i?.price ?? "0" )
      }

      const newP    = Object.assign( new PedidoWoo(), p ) as IPedidoWoo
      pedidos.push( newP )
    }

    return pedidos
  }

  async function getOrdenesWoo( q : IQuery ) : Promise<any[]>
  {
    const objetoForData       = { body: getFormData("", q ), method: "POST"}
    const { ok, data  }       = await miFetch( getURL("listas", "pedidos-woo"), objetoForData, { mensaje: "pedido tienda", dataEsArray: true } )
    if(ok)
      return getArrayFromAny( data )
    else{
      //aviso("negative", "Error al acceder a la tienda")
      return []
    }
  }

  interface IPaging  {
    limit   : number
    offset  : number
    total   : number
  }

  async function buscarPagosMercadoPago( q : IQuery ) : Promise<{ pagos: IMercadoPago[], paging: IPaging }>
  {
    const pagos:IMercadoPago[]= []
    const objetoForData       = { body: getFormData("", q ), method: "POST"}
    const { ok, data  }       = await miFetch( getURL("listas", "mercado-pago"), objetoForData, { mensaje: "pago MercadoPago" } )
    let paging : IPaging      = { limit: 0, offset: 0, total: 0 }    
    if(ok)
    {
      const results           = getArrayInObject( data, "results")
      const p                 = typeof data == "object" && "paging" in data ? data.paging : {}
      paging                  = { limit: getNumberValido(p, "limit" ), offset: getNumberValido(p, "offset" ), total: getNumberValido(p, "total" ) }
      if(!!results.length)
      {
        for (const p of results){
          const pago          = new MercadoPago( p )
          pagos.push( pago )
        }
      }
    }
    else{
      //aviso("negative", "Error al consultar pago en MercadoPago")
    }

    return { pagos,  paging } 
  }
      

  interface IRefId { ref : number, id: number }
  async function buscarPedidosDolibarr( ids : string ) : Promise< IRefId[] >
  {
    const objetoForData       = { body: getFormData("ePaycoRefDolibarr", { ids } ), method: "POST"}
    const { ok, data  }       = await miFetch( getURL("listas", "pedidos"), objetoForData, { mensaje: "pedidos en sistema", dataEsArray: true } )
    if(!ok) return []

    const refIdsRaw           = getArrayFromAny( data )
    const refIds  :IRefId[]   = []
    for (const i of refIdsRaw)
    {
      if(typeof i == "object" && "ref" in i && "id" in i)
        refIds.push( { id: parseInt( i.id.toString() ), ref: parseInt( i.ref.toString() ) } )
    }    
    return refIds
  }

  //* /////////////////////////////////////////////////////////////// Return
  return {
    buscarOrdenesWoo,
    buscarPedidosDolibarr,
    buscarPagosMercadoPago
  }
}
