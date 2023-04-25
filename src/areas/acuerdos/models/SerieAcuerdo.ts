import {  ISerie,
          Serie,
          Periodo,
          PERIODO,
          IApexSerie          } from "src/models/TiposInformes"
import {  EstadosAcuerdos,
          TIPO_ACUERDO        } from "src/areas/acuerdos/models/ConstantesAcuerdos"
import {  IUsuario, Usuario   } from "src/areas/usuarios/models/Usuario"
import {  valuesObjectArrayToNumber,
                              } from "src/useSimpleOk/useTools"
import {  getUsuarioDB        } from "src/services/useDexie"

export interface ISerieAcu extends ISerie
{
  nombre              : string
  comercial           : IUsuario
  comercialId         : number
  cuenta              : number
  total               : number
  estadoId            : number
  estado              : string
  estadoColor         : string
}

export class SerieAcu extends Serie implements ISerieAcu
{
  comercial           : IUsuario
  comercialId         : number
  cuenta              : number  
  total               : number  
  estadoId            : number

  constructor()
  {
    super()

    this.comercial          = new Usuario()
    this.comercialId        = 0
    this.cuenta             = 0
    this.total              = 0
    this.estadoId           = 0
  }

  get nombre()      : string { return this.comercial.nombre }
  get estado()      : string { return EstadosAcuerdos.estadoToName ( TIPO_ACUERDO.COTIZACION_CLI, this.estadoId ) }
  get estadoColor() : string { return EstadosAcuerdos.estadoToColor( TIPO_ACUERDO.COTIZACION_CLI, this.estadoId ) }

  static async getSerieFromApi( data : any, periodo : Periodo ) : Promise <ISerieAcu[]>
  {
    let seriesRaw           = []
    if(!!data && Array.isArray(data) && data.length > 0){
      seriesRaw             = valuesObjectArrayToNumber(data)
    }
    else 
      return []
      
    const series:ISerieAcu[]= []

    for (const serieRaw of seriesRaw)
    {
      const serie           = Object.assign( new SerieAcu(), serieRaw ) as ISerieAcu
      serie.comercial       = await getUsuarioDB( serie.comercialId )
      serie.color           = serie.comercial.color
      serie.periodo         = periodo
      series.push( serie )
    }

    if(periodo              === PERIODO.SEMANA) corregirDiasSemana()

    return series

    function corregirDiasSemana()
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
    }
  }
}