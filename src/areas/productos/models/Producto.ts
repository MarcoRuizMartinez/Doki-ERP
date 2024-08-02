

export interface IProducto {
  ref                 : string
  nombre              : string

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
  ref                 : string              = ""
  nombre              : string              = ""

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


  /* constructor( modo : "nuevo" | "" = "" )
  {
    this.esNuevo      = modo === "nuevo" 
  }   */
}









