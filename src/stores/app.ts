import { defineStore } from 'pinia';
import { iItemMenu } from "src/components/navegacion/menus/iItemMenu"

export interface ITab {
  activa:  string
  alerts:   boolean[]
}

export interface iApp {
  online: boolean
  menu:   Array < iItemMenu >
  tabs:   ITab                    // Se usa para compartir el estado de algunos componentes que necesitan comunicar el estado de sus tabs
}

export const useStoreApp = defineStore('app', {
  state: () :iApp  => ({
    online: navigator.onLine,
    menu:   [],
    tabs:   { activa : '', alerts : [] },
  }),
});
