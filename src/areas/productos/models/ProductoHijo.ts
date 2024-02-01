import {  TCodigosSiigo,      CodigosSiigo      } from 'src/areas/productos/models/Siigo';     
import {  IUnidad,            Unidad            } from '../../../models/Diccionarios/Unidad';
import {  IImagenProducto,    ImagenProducto    } from './ImagenProducto';
import {  IProductoProveedor, ProductoProveedor } from './ProductoProveedor';
import { INaturalezaProducto, NaturalezaProducto } from 'src/models/Diccionarios/NaturalezaProducto';


export interface IProductoHijo
{
  ref                 : string
  nombre              : string
  relacion_id         : number
  id                  : number
  padre_id            : number
  hijo_id             : number
  qty                 : number
  orden               : number
  precio              : number
  precioTotal         : number
  costo               : number
  costoTotal          : number
  unidad              : IUnidad
  img                 : IImagenProducto
  naturaleza          : INaturalezaProducto
  siigo               : TCodigosSiigo
  siigoPadre          : TCodigosSiigo
  productosPro        : IProductoProveedor[]
  hayProductosPro     : boolean
}

export class ProductoHijo implements IProductoHijo
{
  ref                 : string          = ""
  nombre              : string          = ""
  relacion_id         : number          = 0
  id                  : number          = 0
  padre_id            : number          = 0
  hijo_id             : number          = 0
  qty                 : number          = 0
  orden               : number          = 0
  precio              : number          = 0
  costo               : number          = 0
  
  unidad              : IUnidad               = new Unidad()
  img                 : IImagenProducto       = new ImagenProducto()
  naturaleza          : INaturalezaProducto   = new NaturalezaProducto()
  siigo               : TCodigosSiigo         = new CodigosSiigo()
  siigoPadre          : TCodigosSiigo         = new CodigosSiigo()
  productosPro        : IProductoProveedor[]  = []

  get precioTotal(): number { return this.qty * this.precio }
  get costoTotal (): number { return this.qty * this.costo }
  get hayProductosPro():  boolean { return !(this.productosPro.length === 1 && this.productosPro[0].id == 0) }
}