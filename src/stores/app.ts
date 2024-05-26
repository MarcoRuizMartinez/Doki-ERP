import {  defineStore       } from 'pinia';
import {  iItemMenu         } from "components/navegacion/menus/iItemMenu"
import {  IVistaAG,
          VistaAG               } from "components/utilidades/AgGrid/VistaAG"
          
export interface ITab {
  activa      : string
  alerts      : boolean[]
}

export interface iApp {
  online      : boolean
  menu        : Array < iItemMenu >
  tabs        : ITab                    // Se usa para compartir el estado de algunos componentes que necesitan comunicar el estado de sus tabs
  alertas     : number
  toggle      : string    // Para guardar en los toggle generales
  vista       : IVistaAG,
}

export const useStoreApp = defineStore('app', {
  state: () :iApp  => ({
    online        : navigator.onLine,
    menu          : [],
    tabs          : { activa : '', alerts : [] },
    alertas       : 0,
    toggle        : "",
    vista         : new VistaAG(),
  }),
});