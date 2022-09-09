import {  IProductoDoli,
          ProductoDoli,
          imagenDefault     } from "../../../areas/productos/models/ProductoDolibarr"
import {  X100_Descuento,
          X100_Aumento,
          X100_Reduccion,
          X100,
          roundInt          } from "../../../useSimpleOk/useTools"
import {  getUnidadDB       } from "../../../services/useDexie"

export type TipoLinea       = "producto" | "servicio" | "titulo" | "subtotal" | "descripcion"

type TAccionDestacar = "seleccionar" | "guardar" | "borrar" | "no-destacar"

export interface  ILineaApi {
  id?:                      number
  rang?:                    number
  product_type?:            number
  fk_product?:              number
  qty?:                     number
  tva_tx?:                  number
  subprice?:                number
  remise_percent?:          number
  desc?:                    string
  fk_unit?:                 number
  label?:                   string
  special_code?:            number
}

export interface ILineaAcuerdo extends IProductoDoli {
  padreId:                  number      // Id de cotizacion, orden o factura
  lineaId:                  number
  qty:                      number
  x100Maximo:               number
  orden:                    number
  codeX:                    number
  tipoLinea:                TipoLinea
  fixed:                    boolean
  precioBase:               number
  precioBaseConIVA:         number
  precioFinal:              number
  precioFinalConIVA:        number
  precioMinimo:             number
  precioMinimoConIVA:       number

  descuentoX100:            number      // Descuento bruto
  //descuX100Round:           number      // Descuento redondeado
  descuentoValor:           number      // Descuento valor
  totalSinDescu:            number      // Subtotal sin descuento
  totalConDescu:            number      // Subtotal con descuento
  totalDescuento:           number
  ivaValorLinea:            number      
  ivaValorTotal:            number
  totalConIva:              number
  
  hayDescuento:             boolean
  class:                    string
  qtyUnd:                   string
  borrar:                   boolean
  destacar:                 ( accion? : TAccionDestacar , mostrar? : "mostrar" | "ocultar" )=>void
}

export class LineaAcuerdo extends ProductoDoli implements ILineaAcuerdo
{
  padreId:                  number
  lineaId:                  number
  qty:                      number
  descuentoX100:            number
  orden:                    number
  codeX:                    number
  fixed:                    boolean
  class:                    string
  precioBase:               number
  borrar:                   boolean

  constructor()
  {
    super()
    
    this.padreId            = 0
    this.lineaId            = 0
    this.qty                = 0
    this.descuentoX100      = 0
    this.precioBase         = 0
    this.orden              = 0
    this.codeX              = 0
    this.fixed              = false
    this.class              = ""
    this.borrar             = false
  }

  // * /////////////////////////////////////////////////////////////////////////////// Tipo de linea
  get tipoLinea() : TipoLinea {
    let tipo  : TipoLinea   = "producto"
    if(this.tipo            == 0 )  tipo = "producto"
    else
    if(this.tipo            == 1 )  tipo = "servicio"
    else
    if(this.tipo            == 9  && this.codeX == 104777)
    {
      tipo                  =   this.qty == 1   ? "titulo"
                              : this.qty == 99  ? "subtotal"
                              : this.qty == 50  ? "descripcion"
                              : "producto"
    }

    return tipo
  }

  // * ////////////////////////////////////////////////////////////////////////////////////////////////////
  // * ////////////////////////////////////////////////////////////////////// GET SET Descuento redondeado
/*   get descuX100Round() : number {
    return +Number( this.descuentoX100 ).toFixed(2)
  }

  set descuX100Round( x100 : number ) {
    let descuento           = this.precioBase / 100 * x100
    let preciosConDescuento = roundInt( this.precioBase - descuento, 2 )
    let descuentoNew        = this.precioBase - preciosConDescuento
    this.descuentoX100      = descuentoNew * 100 /this.precioBase
  } */

  // * /////////////////////////////////////////////////////////////////////////////// Precio Minimo
  get precioMinimo() :number {
    return this.costo
  }

  // * /////////////////////////////////////////////////////////////////////////////// Precio Minimo con IVA
  get precioMinimoConIVA() :number {
    return X100_Aumento( this.costo, this.iva )
  }
  

  // * //////////////////////////////////////////////////////////////////////// Descuento maximo permitido
  get x100Maximo() :number {
    let diferencia          = this.precioBase - this.costo
    let x100                = diferencia * 100 / this.precioBase
    if( x100                < 1 || !x100 || isNaN(x100))
        x100                = 999_999_999  
    return x100
  }

  // * //////////////////////////////////////////////////////////////////////// Precio base con IVA
  get precioBaseConIVA() : number{
    return X100_Aumento( this.precioBase, this.iva )
  }
  // * ////////////////////////////////////////////////////////////////////////////////////////////// 
  // * //////////////////////////////////////////////////////////////////////// GET SET Precio final con IVA
  get precioFinalConIVA() : number{
    return +X100_Aumento( this.precioFinal, this.iva ).toFixed(2)
  }

  set precioFinalConIVA( valor : number ){
    let newSubtotal       = X100_Reduccion( valor, this.iva )
    let newDescuentoValor = this.precioBase - newSubtotal
    if(this.precioBase    !== 0)
      this.descuentoX100  = +(newDescuentoValor * 100 / this.precioBase).toFixed(3)
    else
      this.descuentoX100  = 0
  } 

  // * /////////////////////////////////////////////////////////////////////////////// IVA valor unidad
  get ivaValorLinea() :number {
    return X100( this.precioFinal, this.iva )
  }

  // * /////////////////////////////////////////////////////////////////////////////// IVA valor total
  get ivaValorTotal() :number {
    return this.ivaValorLinea * this.qty
  }

  // * /////////////////////////////////////////////////////////////////////////////////////////////////
  // * /////////////////////////////////////////////////////////////////////////////// GET SET Precio Final
  get precioFinal() :number {
    return X100_Descuento( this.precioBase, this.descuentoX100 )
  }  
  
  set precioFinal( valor : number )  {
    if(!process.env.CON_DECIMALES)
      valor                 = roundInt(valor, 2)
    
    let diferencia          = this.precioBase - valor
    if( diferencia          <= 0){
      this.descuentoX100    = 0
            
      return
    } 
    this.descuentoX100      = +( diferencia * 100 / this.precioBase ).toFixed(2)
    
  }

  // * /////////////////////////////////////////////////////////////////////////////// Total sin descuento
  get totalSinDescu() : number {
    return this.precioBase * this.qty
  }  

  // * /////////////////////////////////////////////////////////////////////////////// Total con descuento
  get totalConDescu() : number {
    return this.precioFinal * this.qty
  }
  
  // * /////////////////////////////////////////////////////////////////////////////// Total iva incluido
  get totalConIva() :number {
    return this.totalConDescu + this.ivaValorTotal
  }  

  // * /////////////////////////////////////////////////////////////////////////////// Descuento Valor
  get descuentoValor() : number {
    return this.precioBase - this.precioFinal
  }

  // * /////////////////////////////////////////////////////////////////////////////// Total Descuento
  get totalDescuento() : number {
    return this.descuentoValor * this.qty
  }

  // * /////////////////////////////////////////////////////////////////////////////// Hay descuento
  get hayDescuento() :boolean { return this.descuentoValor > 0 }

  // * /////////////////////////////////////////////////////////////////////////////// Cantidad con unidad
  get qtyUnd() : string {
    return this.qty + " " + this.unidad.codigo
  }

  // * /////////////////////////////////////////////////////////////////////////////// Destacar con clase
  destacar( accion  : TAccionDestacar = "seleccionar",
            mostrar : "mostrar" | "ocultar"             = "mostrar"
          )
  {
    this.class              = getEstilo( accion, this.class )

    setTimeout( () => {
        this.class          = getEstilo( accion, this.class, true)

        if(mostrar          == "ocultar" && accion != "borrar")
          this.class        = ""
        
        if(this.class.includes("op00"))
          this.class        = "op00"
      }
      , 500)

    function getEstilo( accion : TAccionDestacar, claseActual : string, deTimer = false ) : string
    {
      let clase             = claseActual
      if( accion            == "seleccionar" )
        clase               = "bg-yellow-2"
      else
      if( accion            == "guardar" )
        clase               = "bg-green-2"
      else
      if( accion            == "borrar" )
        clase               = "bg-red-9 op00"
      else
      if( accion            == "no-destacar" && deTimer)
        clase               = ""
        
      return clase
    }
  }

  // * ////////////////////////////////////////////////////////////////////////// Get new LineaAcuerdo data de API 
  static async getLineaFromAPIMaco( lineaApi : any, padreId : number ) : Promise< ILineaAcuerdo[] >
  {
    lineaApi                = JSON.parse( lineaApi )
    let lineas              : ILineaAcuerdo[] = []

    if( Array.isArray( lineaApi ) )
    {
      for (const linea of lineaApi) {
        linea.id            = +linea.id
        linea.padreId       = padreId
        linea.precioBase    = parseFloat( linea.precioBase    )
        linea.costo         = parseFloat( linea.costo         )
        linea.iva           = parseFloat( linea.iva           )
        linea.descuentoX100 = parseFloat( linea.descuentoX100 )
        
        linea.tipo          = +linea.tipo
        linea.lineaId       = +linea.lineaId
        linea.qty           = +linea.qty
        linea.orden         = +linea.orden
        linea.codeX         = +linea.codeX
        linea.unidadId      = +linea.unidadId
        linea.unidad        = await getUnidadDB( linea.unidadId )
        linea.imagen        = !!linea.imagen ? linea.imagen : imagenDefault
        const lineaFinal    = Object.assign( new LineaAcuerdo, linea ) as ILineaAcuerdo
        lineas.push( lineaFinal )
      }
    }

    return lineas
  }

  static getLineaEspecial( tipo : "titulo" | "subtotal", lineaId : number, orden : number, nombre : string = "" ) : ILineaAcuerdo
  {
    let linea               = new LineaAcuerdo()
        linea.codeX         = 104777
        linea.qty           = tipo == "titulo" ? 1 : 99
        linea.tipo          = 9
        linea.lineaId       = lineaId
        linea.nombre        = nombre
        linea.orden         = orden
    return linea
  }

  static lineaDeProducto( producto : IProductoDoli ) : ILineaAcuerdo
  {
    let linea : ILineaAcuerdo = Object.assign( new LineaAcuerdo(), producto ) 
        // linea.lineaId      = 0
        // linea.orden        = 0
        linea.qty             = 1
        linea.descuentoX100   = !!producto.descuentoCalculado ? producto.descuentoCalculado : 0
                
        linea.precioBase      = producto.precio_publico
        

    return linea
  }

  static lineasDeProductos( productos : IProductoDoli[],
                            qty       : number | undefined = undefined,
                            descu     : number | undefined = undefined
                          ) : ILineaAcuerdo[]
  {
    let lineas : ILineaAcuerdo[] = []
    if( !productos.length ) return []

    for (const producto of productos)
    {
      let linea               = LineaAcuerdo.lineaDeProducto(producto)
          linea.qty           = qty ?? 1
          linea.destacar( "guardar" )
          //linea.descuentoX100 = descu ?? 0
      lineas.push( linea )
    }
    return lineas
  }

  static lineaToLineaApi ( linea : ILineaAcuerdo ) : ILineaApi
  {
    let lineaApi = {
      id:             linea.lineaId,
      fk_product:     linea.id,
      product_type:   linea.tipo,
      qty:            linea.qty,
      tva_tx:         linea.iva,
      subprice:       linea.precioBase,
      remise_percent: linea.descuentoX100,
      rang:           linea.orden,
      desc:           linea.descripcion,
      fk_unit:        linea.unidadId,
      special_code:   linea.codeX
    }
    return lineaApi
  }

  static getLineaApiEspecial ( tipo : "titulo" | "subtotal" ,titulo : string = "") : ILineaApi
  {
    let lineaApi = {
      product_type:   9,
      qty:            tipo === "titulo" ? 1 : 99,
      tva_tx:         0,
      subprice:       0,
      remise_percent: 0,
      label:          titulo,
    }
    return lineaApi
  }
/*   {
    "product_type": "9",
    "qty": "1",
    "tva_tx": "0.000",
    "subprice": "0.00000000",
    "remise_percent": "0",
    "rang": "12",
    "desc":"hola2",
    "label": "titulo 5"
  } */

}


    /*
      [
        {
          "id" 2024,
          "ref"
          "SIG-3-745",
          "nombre" "",
          "descripcion" "", 
          "precioBase" 326000.00000000,
          "costo" 233175.00000000,
          "iva" 19.000,
          "unidadId" "1",
          "tipo" 0,
          "fotoURL" "http//www.mublex.com/wp-content/uploads/2018/07/silla_dubai.jpg",
          "lineaId" 2271, 
          "qty" 1,
          "descuentoX100" 2.5, 
          "orden" 2, 
          "codeX" 0
        },

          {"id" 0, "ref" "", "descripcion" "", "precioBase" 0.00000000, "costo" 0.00000000, "iva" 0.000, 
          "unidadId" "", "tipo" 9, "fotoURL" "", "lineaId" 2272,  "descuentoX100" 0, "orden" 1, 


          {"id" 0, "ref" "", "descripcion" "", "precioBase" 0.00000000, "costo" 0.00000000, "iva" 0.000, 
          "unidadId" "", "tipo" 9, "fotoURL" "", "lineaId" 2273,  "descuentoX100" 0, "orden" 4, 
          
          
          {"id" 4912, "ref" "SIG-1726", "nombre" "", "descripcion" "", "precioBase" 351000.00000000, "costo" 227105.00000000, 
          "iva" 19.000, "unidadId" "1", "tipo" 0,
          "fotoURL" "https//www.mublex.com/wp-content/uploads/2021/02/silla_shanghai_sin_brazos.jpg", "lineaId" 2274, "qty" 1,
          "descuentoX100" 0, "orden" 3, "codeX" 0},
          
          {"id" 6189, "ref" "BASE-PLEG-75X42", "nombre" "", "descripcion" "", "precioBase" 156000.00000000, "costo" 104000.00000000, 
          "iva" 19.000, "unidadId" "1", "tipo" 0, "fotoURL" "", "lineaId" 2275, "qty" 1, "descuentoX100" 0, "orden" 5, "codeX" 0},
          
          {"id" 0, "ref" "", "nombre" "", "descripcion" "asdfasdfasdfasdfd fasdf asdf", "precioBase" 0.00000000, 
          "costo" 0.00000000, "iva" 0.000, "unidadId" "", "tipo" 9, "fotoURL" "", "lineaId" 2276,  "descuentoX100" 0, "orden" 6, 
          
        ]"    
    */