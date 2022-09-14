
export interface IConstante
{
  id:                 number  
  label:              string
  value:              string
}

export const enum CONSTANTES {
  CTZ_DIAS_VALIDEZ      = "PROPALE_VALIDITY_DURATION",
  TERCERO_CATALOGOS_ID  = "TERCERO_CATALOGOS_ID",
}

export class Constante implements IConstante
{
  id:                 number  
  label:              string
  value:              string

  constructor()
  {
    this.id           = 0  
    this.label        = ""
    this.value        = ""
  }
}

import {  ref, watch        } from "vue"
import {  dexieConstantes   } from "src/services/useDexie"
import {  ID_URL_Ok         } from "src/useSimpleOk/useTools"

export function useConstantes( constanteBuscada : CONSTANTES )
{
  const constantes              = dexieConstantes( { cargarSiempre : true } ) // Para buscar de Dolibarr los valores y cargarlos a la DB local
  const constante               = ref<number>(0)

  watch(constantes, (newValue) =>
  {
    if(!newValue.length) return
    
    let constanteTem            = newValue.find( c => c.label === constanteBuscada )

    if(!!constanteTem && constanteTem.hasOwnProperty('value'))
    {
      let valor   : string      = typeof constanteTem.value === "string" ? constanteTem.value : "0"
      constante.value           = ID_URL_Ok( valor )
    }
  })

  return constante

}