import {  defineStore       } from 'pinia';
import {  iItemMenu         } from "components/navegacion/menus/iItemMenu"
//import { IUsuario     } from "src/areas/usuarios/models/Usuario"

export interface ITab {
  activa      : string
  alerts      : boolean[]
}

export interface iApp {
  online      : boolean
  menu        : Array < iItemMenu >
  tabs        : ITab                    // Se usa para compartir el estado de algunos componentes que necesitan comunicar el estado de sus tabs
  //usuarios    : IUsuario[]
}

export const useStoreApp = defineStore('app', {
  state: () :iApp  => ({
    online    : navigator.onLine,
    menu      : [],
    tabs      : { activa : '', alerts : [] },
    //usuarios  : [],
  }),
});