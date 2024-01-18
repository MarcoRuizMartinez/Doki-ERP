import {  ISerie,
          Serie,
          PERIODO             } from "src/models/TiposInformes"
import {  EstadosAcuerdos,
          TIPO_ACUERDO        } from "src/areas/acuerdos/models/ConstantesAcuerdos"
import {  ToolArray, ToolNum  } from "src/composables/useTools"
import {  getUsuarioDB,
          getMunicipioDB,
          getOrigenContactoDB,
          getCondicionDePagoDB,
                              } from "src/composables/useDexie"
import {  IQuery              } from "src/models/Busqueda"  
import {  getArea             } from "src/models/TiposVarios"

export const enum DIMENSIONES { 
  ASESORES            = "asesores",
  ORIGEN              = "origenes",
  NIVELES             = "niveles",
  CONDICIONES         = "condiciones",
  ESTADOS             = "estados",
  REGION              = "ciudad",
  UNIDAD_N            = "area",
}

export interface ISerieAcu extends ISerie
{
  nombre              : string
  dimension           : DIMENSIONES | ""
  cuenta              : number
  total               : number
  xSerie              : string

  //* /////////////// Dimensiones

  //comercial           : IUsuario
  //origen              : IOrigenContacto
}

export class SerieAcu extends Serie implements ISerieAcu
{
  nombre              : string
  dimension           : DIMENSIONES | ""
  cuenta              : number  
  total               : number  
  estadoId            : number

  constructor()
  {
    super()

    this.nombre             = ""
    this.dimension          = ""
    this.cuenta             = 0
    this.total              = 0
    this.estadoId           = 0
    this.color              = ""
  }


  get xSerie()      : string {
    let x           = ""
    switch (this.periodo) {
      case PERIODO.AÑO:       x = `${this.año}`;                      break;
      case PERIODO.TRIMESTRE: x = `${this.año} T${this.trimestre}`;   break;
      case PERIODO.MES:       x = `${this.año}-${ ToolNum.agregarZeroANumero1Digito( this.mes )}`;          break;
      case PERIODO.SEMANA:    x = `${this.año}-${ ToolNum.agregarZeroANumero1Digito( this.semana )}`;       break;    
      default:                                                        break;
    }

    return x
  }

  static async getSerieFromApi( data : any, q : IQuery ) : Promise <ISerieAcu[]>
  {
    let seriesRaw           = []
    if(!!data && Array.isArray(data) && data.length > 0){
      seriesRaw             = ToolArray.valuesObjectArrayToNumber(data)
    }
    else 
      return []
      
    const series:ISerieAcu[]= []

    for (const serieRaw of seriesRaw)
    {
      const serie           = Object.assign( new SerieAcu(), serieRaw ) as ISerieAcu
      const d               = parseInt( serie.dimension )
      if(q.dimension        == DIMENSIONES.ASESORES){
        const asesor        = await getUsuarioDB( d )
        serie.nombre        = asesor.nombre
        serie.color         = asesor.color
      }
      else
      if(q.dimension        == DIMENSIONES.ESTADOS){
        serie.nombre        = EstadosAcuerdos.estadoToName ( q?.acuerdo ?? TIPO_ACUERDO.NULO, d )
        serie.color         = EstadosAcuerdos.estadoToColor( q?.acuerdo ?? TIPO_ACUERDO.NULO, d )
      }      
      else 
      if(q.dimension        == DIMENSIONES.ORIGEN){
        serie.nombre        = ( await getOrigenContactoDB( d ) ).label
      }
      else 
      if(q.dimension        == DIMENSIONES.CONDICIONES){
        serie.nombre        = ( await getCondicionDePagoDB( d ) ).label
      }
      if(q.dimension        == DIMENSIONES.REGION){
        serie.nombre        = ( await getMunicipioDB( d ) ).municipio
      }         
      else 
      if(q.dimension        == DIMENSIONES.UNIDAD_N){
        serie.nombre        = getArea( d.toString() )
      }
      else 
      if(q.dimension        == DIMENSIONES.NIVELES){
        serie.nombre        = "Nivel " + serie.dimension
      }
      
      serie.periodo         = q.periodo
      series.push( serie )
    }

    
    return series
    
    //if(periodo              === PERIODO.SEMANA) corregirDiasSemana()
    /* function corregirDiasSemana()
    {
      const YMWs            = [ ...new Set(
                                  series.map((s) =>
                                      s.año.toString()
                                    + (s.semana < 10 ? "0" + s.semana.toString()  : s.semana.toString())
                                    + (s.mes    < 10 ? "0" + s.mes.toString()     : s.mes.toString())
                                  )
                                )
                              ].sort()

      for (const ymw of YMWs)
      {
        const año           = parseInt( ymw.slice(0,4) )
        const semana        = parseInt( ymw.slice(4,6) )
        const mes           = parseInt( ymw.slice(6,8) )

        const seriesSemana  = series.filter( s=> s.semana === semana)
        const listaDias     = seriesSemana.map( s => s.dia)
        const menorDia      = Math.min(...listaDias)
        const mayorDia      = Math.max(...listaDias)
        const diferencia    = mayorDia - menorDia
        if(diferencia       >= 7){
        }
        else
        if(diferencia       > 0){
          for (const s of seriesSemana)
            s.dia           = menorDia
        }
      }
    } */
  }
}