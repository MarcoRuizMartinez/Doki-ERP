import {  defineStore       } from 'pinia';
import {  iItemMenu         } from "components/navegacion/menus/iItemMenu"
import {  IVistaAG,
          VistaAG               } from "components/utilidades/AgGrid/VistaAG"
          
export interface ITab
{
  activa      : string
  alerts      : boolean[]
}

export enum EVENTOS
{
  NULO,
  LIMPIAR_FILTROS,
  COPIAR_DATOS,
  ACTUALIZAR_PRECIOS,
  NUEVAS_FILAS,
}


export interface iApp
{
  online      : boolean
  menu        : Array < iItemMenu >
  tabs        : ITab                    // Se usa para compartir el estado de algunos componentes que necesitan comunicar el estado de sus tabs
  alertas     : number
  toggle      : string    // Para guardar en los toggle generales
  vista       : IVistaAG,
  filtro      : string,
  evento      : EVENTOS,
  campo_1     : string | number,
  numero_1    : number,
}

export const useStoreApp = defineStore('app', {
  state: () :iApp  => ({
    online        : navigator.onLine,
    menu          : [],
    tabs          : { activa : '', alerts : [] },
    alertas       : 0,
    toggle        : "",
    vista         : new VistaAG(),
    filtro        : "",
    evento        : EVENTOS.NULO,
    campo_1       : "",
    numero_1      : 0,
  }),
});