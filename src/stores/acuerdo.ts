import {  defineStore       } from 'pinia';
import {  Acuerdo, IAcuerdo } from "src/areas/acuerdos/models/Acuerdo"
import {  TIPO_ACUERDO      } from "src/areas/acuerdos/models/ConstantesAcuerdos"
import {  ILoading,
          LoadingDefault,
          IModales,
          ModalesDefault
                            } from "src/models/TiposVarios"
import {  GrupoLineas,
          IGrupoLineas      } from "src/areas/acuerdos/models/GrupoLineasAcuerdo"
import {  ILineaAcuerdo,
          LineaAcuerdo      } from "src/areas/acuerdos/models/LineaAcuerdo"
import {  BusquedaAcuerdo,
          IBusquedaAcuerdo  } from "src/areas/acuerdos/models/BusquedaAcuerdos"
import {  Anticipo,
          IAnticipo         } from "src/areas/acuerdos/models/Anticipo"  
interface IAcuerdoState {
  acuerdo             : IAcuerdo,
  loading             : ILoading,  
  grupoElegido        : IGrupoLineas,
  lineaElegida        : ILineaAcuerdo,
  modales             : IModales,
  acuerdos            : IAcuerdo[],
  busqueda            : IBusquedaAcuerdo,
  anticipo            : IAnticipo,
}

export const useStoreAcuerdo = defineStore('acuerdo', {
  state: () : IAcuerdoState => ({
    acuerdo           : new Acuerdo( TIPO_ACUERDO.NULO ),
    loading           : LoadingDefault,
    grupoElegido      : new GrupoLineas(),
    lineaElegida      : new LineaAcuerdo(),
    modales           : ModalesDefault,
    acuerdos          : [],
    busqueda          : new BusquedaAcuerdo( TIPO_ACUERDO.NULO ),
    anticipo          : new Anticipo(),
  }),
});