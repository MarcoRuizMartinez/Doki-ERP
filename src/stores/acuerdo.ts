import { defineStore } from 'pinia';
import { Acuerdo,     IAcuerdo,     } from "src/areas/acuerdos/models/Acuerdo"


export interface iAcuerdoState {
  acuerdo: IAcuerdo,
}

export const useStoreAcuerdo = defineStore('acuerdo', {


  state: () : iAcuerdoState => ({
    acuerdo: new Acuerdo(),
  }),


  getters: {

  },

  actions: {

  }
});
