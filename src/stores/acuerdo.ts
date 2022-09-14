import {  defineStore     } from 'pinia';
import {  Acuerdo,
          IAcuerdo,       } from "src/areas/acuerdos/models/Acuerdo"
import {  ILoading,
          LoadingDefault,
          IModales,
          ModalesDefault
                          } from "src/models/TiposVarios"
import {  GrupoLineas,
          IGrupoLineas    } from "src/areas/acuerdos/models/GrupoLineasAcuerdo"
import {  ILineaAcuerdo,
          LineaAcuerdo    } from "src/areas/acuerdos/models/LineaAcuerdo"

export interface iAcuerdoState {
  acuerdo         : IAcuerdo,
  loading         : ILoading,  
  grupoElegido    : IGrupoLineas,
  lineaElegida    : ILineaAcuerdo,
  modales         : IModales
}

export const useStoreAcuerdo = defineStore('acuerdo', {


  state: () : iAcuerdoState => ({
    acuerdo       : new Acuerdo(),
    loading       : LoadingDefault,
    grupoElegido  : new GrupoLineas(),
    lineaElegida  : new LineaAcuerdo(),
    modales       : ModalesDefault
  }),


  getters: {

  },

  actions: {

  }
});
