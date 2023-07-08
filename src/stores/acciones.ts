import {  defineStore           } from 'pinia';
import {  IAccion,    Accion    } from "src/areas/comunicacion/models/Accion"
import {  IBusqueda,  Busqueda  } from "src/models/Busqueda"
import {  ILoading,
          LoadingDefault,
          IModales,
          ModalesDefault        } from "src/models/TiposVarios"  

export interface IAccionStore {
  tareas          : IAccion[]
  tarea           : IAccion
  yaBusco         : boolean
  menuTareasOn    : boolean  
  loading         : ILoading,
  modales         : IModales,
  busqueda        : IBusqueda,
}

export const useStoreAcciones = defineStore('acciones', {
  state: () : IAccionStore  => ({
    tareas        : [],
    tarea         : new Accion( 0 ),
    yaBusco       : false,
    menuTareasOn  : false,
    loading       : LoadingDefault,    
    modales       : ModalesDefault,
    busqueda      : new Busqueda(),
  }),
});