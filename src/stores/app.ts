import { defineStore } from 'pinia';
import { iItemMenu } from "src/components/navegacion/menus/iItemMenu"

export interface iApp {
  online: boolean
  menu:   Array < iItemMenu >
  tabs:   string                    // Se usa para compartir el estado de algunos componentes que necesitan comunicar el estado de sus tabs
}

export const useStoreApp = defineStore('app', {
  state: () :iApp  => ({
    online: navigator.onLine,
    menu:   [],
    tabs:   ""
  }),
});