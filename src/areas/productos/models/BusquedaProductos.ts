import {  ILabelValue,
          labelValueNulo      } from "src/models/TiposVarios"
import {  IUsuario            } from "src/areas/usuarios/models/Usuario"
import {  valorValido         } from "src/useSimpleOk/useTools"
import {  IProductoCategoria,
          ProductoCategoria   } from "src/areas/productos/models/ProductoCategoria"
/* import {  FiltroProductos,
  IFiltroProductos      } from "src/areas/productos/models/FiltrosProductos" */

export interface IBusquedaProducto {
  c                     : ICamposBusqueda
  f                     : IFiltroProductos
  query                 : IQueryProducto
  creador              ?: IUsuario
  resultadosXPage       : number
  pagina                : number
  busquedaVacia         : boolean
  tipoVista             : "grilla" | "lista"
}

export interface ICamposBusqueda {
  nombre                : string
  precioMinimo          : number | undefined
  precioMaximo          : number | undefined
  categoria             : IProductoCategoria
}

export interface IFiltroProductos {
  filtroTexto           : string
  precioMinimo          : number | undefined
  precioMaximo          : number | undefined
  preciosMaxOrMinValidos: boolean
}

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

export class BusquedaProducto implements IBusquedaProducto
{
  c                     : ICamposBusqueda
  f                     : IFiltroProductos
  creador              ?: IUsuario
  resultadosXPage       : number
  pagina                : number
  busquedaVacia         : boolean
  tipoVista             : "grilla" | "lista"

  constructor()
  {
    this.c                = // c de Campos
    {
      nombre              : "",
      categoria           : new ProductoCategoria(),
      precioMinimo        : undefined,
      precioMaximo        : undefined,
    }

    this.f                = // f de Filtros
    {
      filtroTexto         : "",
      precioMinimo        : undefined,
      precioMaximo        : undefined,
      get preciosMaxOrMinValidos() { return valorValido( this.precioMinimo ) || valorValido( this.precioMaximo ) }
    }

    this.resultadosXPage  = 25
    this.pagina           = 1
    this.busquedaVacia    = true
    this.tipoVista        = "lista"
  }

  get query() : IQueryProducto
  {
    const q : IQueryProducto       = {}

    if(this.c.nombre.length  > 3)   q.busqueda   = this.c.nombre
    if(!!this.c.categoria.value)    q.sigla      = this.c.categoria.sigla
    if(!!this.c.precioMinimo)       q.minimo     = this.c.precioMinimo
    if(!!this.c.precioMaximo)       q.maximo     = this.c.precioMaximo

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
    }
    return q
  }
} 