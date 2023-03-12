import {  defineStore         } from 'pinia';
import {  ILoading,
          LoadingDefault,
          IModales,
          ModalesDefault      } from "src/models/TiposVarios"
import {  BusquedaIncentivo,
          IBusquedaIncentivo  } from "src/areas/nomina/models/BusquedaIncentivos"
import {  IIncentivo,
          Incentivo,
          INCENTIVO_ESTADO    } from "src/areas/nomina/models/Incentivo"

interface INominaState {
  loading             : ILoading,
  modales             : IModales,
  busqueda            : IBusquedaIncentivo,
  incentivos          : IIncentivo[]
}

export const useStoreNomina = defineStore('nomina', {
  state: () : INominaState => ({
    loading           : LoadingDefault,
    modales           : ModalesDefault,
    busqueda          : new BusquedaIncentivo(),
    incentivos        : [],
  }),
});
