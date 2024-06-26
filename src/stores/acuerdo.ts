import {  defineStore         } from 'pinia';
import {  Acuerdo, IAcuerdo   } from "src/areas/acuerdos/models/Acuerdo"
import {  TIPO_ACUERDO        } from "src/areas/acuerdos/models/ConstantesAcuerdos"
import {  ILoading,
          LoadingDefault,
          IModales,
          ModalesDefault      } from "src/models/TiposVarios"
import {  GrupoLineas,
          IGrupoLineas        } from "src/areas/acuerdos/models/GrupoLineasAcuerdo"
import {  ILineaAcuerdo,
          LineaAcuerdo        } from "src/areas/acuerdos/models/LineaAcuerdo"
import {  Busqueda,
          IBusqueda           } from "src/models/Busqueda"
import {  Anticipo,
          IAnticipo           } from "src/areas/acuerdos/models/Anticipo"
import {  NivelesComision,
          INivelesComision    } from "src/areas/acuerdos/models/Comisiones/NivelesComision"
import {  CONSTANTES          } from "src/models/Diccionarios/Constante"
import {  getConstanteDBLocal } from "src/composables/useDexie"

interface IAcuerdoState {
  acuerdo             : IAcuerdo,
  loading             : ILoading,
  grupoElegido        : IGrupoLineas,
  lineaElegida        : ILineaAcuerdo,
  modales             : IModales,
  acuerdos            : IAcuerdo[],
  seleccion           : IAcuerdo[],
  busqueda            : IBusqueda,
  anticipo            : IAnticipo,
  nivelesComision     : INivelesComision,
  mostrarDescripcion  : boolean
}

export const useStoreAcuerdo = defineStore('acuerdo', {
  state: () : IAcuerdoState => ({
    acuerdo           : new Acuerdo( TIPO_ACUERDO.NULO ),
    loading           : LoadingDefault,
    grupoElegido      : new GrupoLineas(),
    lineaElegida      : new LineaAcuerdo(),
    modales           : ModalesDefault,
    acuerdos          : [],
    seleccion         : [],
    busqueda          : new Busqueda(),
    anticipo          : new Anticipo(),
    nivelesComision   : new NivelesComision(),
    mostrarDescripcion: true,
  }),
  actions: {
    async cargarNivelesComision()
    {
      const nivelesGrudo  = await getConstanteDBLocal( CONSTANTES.NIVELES_COMISIONES )
      let niveles         = nivelesGrudo.value.split(",").map( i => +i).sort()
      if(niveles.length   === 6) // Debe 6 niveles, si no hay un error
      {
        this.nivelesComision.alfa = niveles[5]
        this.nivelesComision.a    = niveles[4]
        this.nivelesComision.b    = niveles[3]
        this.nivelesComision.c    = niveles[2]
        this.nivelesComision.d    = niveles[1]
        this.nivelesComision.e    = niveles[0]
      }
      else{
        console.warn("Error con niveles de comisión")
        niveles           = [55, 40, 35, 30, 26, 20]
      }
    }
  },
});
