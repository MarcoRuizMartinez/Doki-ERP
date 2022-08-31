import { defineStore } from 'pinia';
import { iItemMenu } from "src/components/navegacion/menus/iItemMenu"

export interface iApp {
  online: boolean
  menu:   Array < iItemMenu >
}

export const useStoreApp = defineStore('app', {
  state: () :iApp  => ({
    online: navigator.onLine,
    menu:   []
  }),
});