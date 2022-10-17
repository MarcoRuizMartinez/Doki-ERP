import {  ILabelValue,
          labelValueNulo  } from "src/models/TiposVarios"
import {  IUsuario        } from "src/areas/usuarios/models/Usuario"


export interface IQueryProducto {
  tipo                  ?: string
  id                    ?: number
  completa              ?: number
  recientes             ?: number
  busqueda              ?: string
  sigla                 ?: string
  proveedor             ?: number
  creador               ?: number
  minimo                ?: number
  maximo                ?: number
  soloConImg            ?: number
  limite                ?: number
  offset                ?: number
  orden                 ?: "ASC" | "DESC"
}

export interface IBusquedaProducto {
  query                 : IQueryProducto
  nombre                : string
  precioMinimo          : number | undefined
  precioMaximo          : number | undefined
  creador              ?: IUsuario
  resultadosXPage       : number
  pagina                : number
  busquedaVacia         : boolean
}
export class BusquedaProducto implements IBusquedaProducto
{
  nombre                : string  
  precioMinimo          : number | undefined
  precioMaximo          : number | undefined 
  creador              ?: IUsuario
  resultadosXPage       : number
  pagina                : number
  busquedaVacia         : boolean

  constructor()
  {
    this.nombre           = ""    
    this.precioMinimo     = undefined
    this.precioMaximo     = undefined
    this.resultadosXPage  = 25
    this.pagina           = 1
    this.busquedaVacia    = true
  }

  get query() : IQueryProducto
  {
    const q : IQueryProducto       = {}

    if(this.nombre.length  > 3)  q.busqueda       = this.nombre
    
    if(!!this.precioMinimo)       q.minimo   = this.precioMinimo
    if(!!this.precioMaximo)       q.maximo   = this.precioMaximo

    //if(!!this.area.label)         q.area          = this.area.value
    //if(!!this.facturado.label)    q.facturado     = this.facturado.value
    //if(!!this.conIva.label)       q.conIva        = this.conIva.value
    //if(!!this.totalizado.label)   q.conTotal      = this.totalizado.value
    //if(!!this.municipio.id)       q.municipio     = this.municipio.id
    //if(!!this.conOrdenes.label)   q.conOrdenes    = this.conOrdenes.value

    //if(!!this.comercial)          q.comercial     = this.comercial.id
    if(!!this.creador)            q.creador       = this.creador.id

    //if(this.desde instanceof Date && !isNaN(this.desde.valueOf()))  q.fechaDesde  = this.desde.toLocaleDateString('sv-SE')
    //if(this.hasta instanceof Date && !isNaN(this.hasta.valueOf()))  q.fechaHasta  = this.hasta.toLocaleDateString('sv-SE')

    this.busquedaVacia            = !Object.keys(q).length

    if(!this.busquedaVacia){
    //  q.limite                    = this.resultadosXPage
    //  q.offset                    = q.limite * (this.pagina - 1)
      q.tipo      = 'busqueda'
      q.completa  = 1
    }
    return q
  }
} 