import {  ICategoriaProducto,
          CategoriaProducto   } from "src/areas/productos/models/CategoriaProducto"
import {  IUsuario,
          Usuario             } from "src/areas/usuarios/models/Usuario"
import {  ToolDate            } from "src/composables/useTools"
import {  IImagenProducto,
          ImagenProducto      } from "./ImagenProducto"
import {  ILabelValue,  
          labelValueNulo      } from "src/models/TiposVarios"

            
export interface IProducto {
  id                  : number
  ref                 : string
  ref_n               : string                //* ///////////////////////////////// _n
  nombre              : string
  nombre_n            : string                //* ///////////////////////////////// _n
  precio              : number                // Precio guardado en llx_product en columna price. Precio final, el menor entre publico y promocion  
  precio_n            : number                //* ///////////////////////////////// _n

  categoria           : ICategoriaProducto
  img                 : IImagenProducto
  costoExtra          : number
  descripcion         : string
  nota                : string
  documento           : string
  familia             : string
  garantia            : string
  garantiaMeses       : ILabelValue

  creador             : IUsuario
  edito               : IUsuario  
  fechaCreacion       : Date
  fechaCreacionCorta  : string
  fechaEdicion        : Date
  fechaEdicionCorta   : string

  editable            : boolean     // Para trabajar en AG Grid
  esNuevo             : boolean     // Para trabajar en AG Grid

  okRef               : boolean     // Para validar que la referencia no exista
  okNombre            : boolean
  okTipo              : boolean
  okProveedor         : boolean
  okCategoria         : boolean
  okHechoEn           : boolean
  okPrecio            : boolean  
  //okGarantiaMeses     : boolean
}

export class Producto implements IProducto
{
  id                  : number              = 0
  ref                 : string              = ""
  ref_n               : string              = ""
  nombre              : string              = ""
  nombre_n            : string              = ""
  precio              : number              = 0
  precio_n            : number              = 0
  categoria           : ICategoriaProducto  = new CategoriaProducto()
  img                 : IImagenProducto     = new ImagenProducto()
  descripcion         : string              = ""
  nota                : string              = ""
  documento           : string              = ""
  familia             : string              = ""
  garantia            : string              = ""
  garantiaMeses       : ILabelValue         = labelValueNulo

  creador             : IUsuario            = new Usuario()
  edito               : IUsuario            = new Usuario()  
  fechaCreacion       : Date                = new Date(0)
  fechaEdicion        : Date                = new Date(0)  

  costoExtra          : number              = 0

  editable            : boolean             = true
  esNuevo             : boolean             = false

  okRef               : boolean             = false
  okNombre            : boolean             = false
  okTipo              : boolean             = true
  okProveedor         : boolean             = false
  okCategoria         : boolean             = false
  okHechoEn           : boolean             = false
  okPrecio            : boolean             = false  
  //okGarantiaMeses     : boolean             = false

  get fechaCreacionCorta()  : string { return ToolDate.fechaCorta( this.fechaCreacion    ) }
  get fechaEdicionCorta()   : string { return ToolDate.fechaCorta( this.fechaEdicion     ) }
}









