import {  defineStore         } from 'pinia';
import {  ILoading,
          LoadingDefault,
          IModales,
          ModalesDefault      } from "src/models/TiposVarios"
import {  Busqueda,
          IBusqueda         } from "src/models/Busqueda"
import {  IIncentivo        } from "src/areas/nomina/models/Incentivo"

interface INominaState {
  loading               : ILoading,
  modales               : IModales,
  incentivosSearch      : IBusqueda,
  incentivos            : IIncentivo[]
}

export const useStoreNomina = defineStore('nomina', {
  state: () : INominaState => ({
    loading             : LoadingDefault,
    modales             : ModalesDefault,
    incentivosSearch    : new Busqueda(),
    incentivos          : [],
  }),
});
