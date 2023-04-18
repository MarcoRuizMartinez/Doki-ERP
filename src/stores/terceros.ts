import {  defineStore       } from 'pinia';
import {  ITercero,
          Tercero           } from "src/areas/terceros/models/Tercero"
import {  ILoading,
          LoadingDefault,
          IModales,
          ModalesDefault    } from "src/models/TiposVarios"
import {  Busqueda,
          IBusqueda         } from "src/models/Busqueda"

interface ITerceroState {
  tercero             : ITercero,
  terceros            : ITercero[],
  loading             : ILoading,
  modales             : IModales,
  busqueda            : IBusqueda,
}

export const useStoreTercero = defineStore('tercero', {
  state: () : ITerceroState => ({
    tercero           : new Tercero(),
    terceros          : [],
    loading           : LoadingDefault,
    modales           : ModalesDefault,
    busqueda          : new Busqueda(),
  }),
});
