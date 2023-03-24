import {  IProductoDoli,
          ProductoDoli,
          imagenDefault     } from "src/areas/productos/models/ProductoDolibarr"
import {  X100_Descuento,
          X100_Aumento,
          X100_Reduccion,
          X100,
          roundInt          } from "src/useSimpleOk/useTools"
import {  getUnidadDB,
          getCategoriaDB,
          getBodegaDB       } from "src/services/useDexie"
import {  storeToRefs       } from 'pinia'
import {  useStoreAcuerdo   } from 'src/stores/acuerdo'
import {  NivelesComision,
          INivelesComision,
          TNivelesComision,
          NIVELES_COMISION  } from "src/areas/acuerdos/models/Comisiones/NivelesComision"
import {  ComisionLinea,
          IComisionLinea    } from "src/areas/acuerdos/models/Comisiones/ComisionLinea"
import {  Bodega,
          IBodega           } from "src/models/Diccionarios/Bodega"

export type TipoLinea       = "producto" | "servicio" | "titulo" | "subtotal" | "descripcion"

type TAccionDestacar        = "seleccionar" | "guardar" | "borrar" | "no-destacar"
type TAccionesSobreLinea    = "editar" | "borrar" | "crear" | ""

export interface  ILineaApi {
  id                        ?: number
  rang                      ?: number
  product_type              ?: number
  fk_product                ?: number
  qty                       ?: number
  tva_tx                    ?: number
  subprice                  ?: number
  remise_percent            ?: number
  desc                      ?: string
  fk_unit                   ?: number | string
  label                     ?: string
  special_code              ?: number
  array_options             ?: any
}

export interface ILineaLite
{
  id            : number
  ref           : string
  nombre        : string
  estado        : string
  descripcion   : string
  descripcionOn : boolean
  qty           : number
  qtyTotal      : number
}

export interface ILineaAcuerdo extends IProductoDoli {
  padreId                   : number      // Id de cotizacion, orden o factura
  lineaId                   : number
  qty                       : number
  x100Maximo                : number
  orden                     : number
  codeX                     : number
  tipoLinea                 : TipoLinea
  esTitulo                  : boolean
  esSubTotal                : boolean
  esTituloOsubTotal         : boolean
  fixed                     : boolean
  precioBase                : number
  precioBaseConIVA          : number
  precioFinal               : number
  precioFinalConIVA         : number
  precioMinimo              : number
  precioMinimoConIVA        : number
  descuentoX100             : number      // Descuento bruto
  descuentoValor            : number      // Descuento valor
  totalSinDescu             : number      // Subtotal sin descuento
  totalConDescu             : number      // Subtotal con descuento
  totalDescuento            : number
  ivaValorLinea             : number
  ivaValorTotal             : number
  totalConIva               : number
  hayDescuento              : boolean
  class                     : string
  qtyUnd                    : string
  borrar                    : boolean
  destacar                  : ( accion? : TAccionDestacar , mostrar? : "mostrar" | "ocultar" ) => void
  accion                    : TAccionesSobreLinea
  aumentoFromCosto          : number  
  //descuX100Round:           number      // Descuento redondeado

  utilidad                  : number

  // */ /////////////////// Comisiones
  comsionX100Division       : number  /*  Si hay 2 comerciales, esto determina cuando le corresponde a cada comercial
                                          Si es 60, entonces al comercial principal le corresponde el 60% y al comercial 2 el 40%  
                                      */
  nivelPrecios              : TNivelesComision  // GET: A partir de aumentoFromCosto calcula si es String "a", "b", etc...
  iconoNivel                : string            // GET: mdi-alpha-a-box, etc...
  x100DescuentoNiveles      : INivelesComision  // GET: 100% de descuento minimo para vender en cada nivel
  comision_c1               : IComisionLinea
  comision_c2               : IComisionLinea

  // */ /////////////////// Entrega
  qtyTotal                  : number
  bodegaId                  : number
  bodega                    : IBodega
  qtyDeTotal                : string  // 2 de 4
  bodegaLabel               : string
  lineaIdPedido             : number
  // */ /////////////////// Para pedido pero se calcula con las entregas
  qtyProgramado             : number
  qtyEntregado              : number
  entregaTotalOk            : boolean
  entregaProgramadoOk       : boolean
}


export class LineaAcuerdo extends ProductoDoli implements ILineaAcuerdo
{
  padreId                   : number
  lineaId                   : number
  qty                       : number
  descuentoX100             : number
  orden                     : number
  codeX                     : number
  fixed                     : boolean
  class                     : string
  precioBase                : number
  borrar                    : boolean
  accion                    : TAccionesSobreLinea  
  // */ /////////////////// Entrega
  qtyTotal                  : number
  bodegaId                  : number
  bodega                    : IBodega
  lineaIdPedido             : number
  qtyProgramado             : number
  qtyEntregado              : number

  // */ /////////////////// Comisiones
  comsionX100Division       : number
  comision_c1               : IComisionLinea
  comision_c2               : IComisionLinea

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
    this.accion             = ""
    this.comsionX100Division= 100
    this.comision_c1        = new ComisionLinea( "comercial 1" )
    this.comision_c2        = new ComisionLinea( "comercial 2" )
    this.qtyTotal           = 0
    this.bodegaId           = 0
    this.bodega             = new Bodega()
    this.lineaIdPedido      = 0
    this.qtyProgramado      = 0
    this.qtyEntregado       = 0
  }

  get entregaTotalOk()      : boolean { return !!this.qty && this.qty === this.qtyEntregado }
  get entregaProgramadoOk() : boolean { return !!this.qty && this.qty === this.qtyProgramado }

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

  get esTitulo()          : boolean { return this.tipo === 9 && this.codeX === 104777 && this.qty === 1 }
  get esSubTotal()        : boolean { return this.tipo === 9 && this.codeX === 104777 && this.qty === 99 }
  get esTituloOsubTotal() : boolean { return this.tipo === 9 && this.codeX === 104777 && ( this.qty === 99 || this.qty === 1 )}

  get aumentoFromCosto()  : number { 
    return ( ( this.precioFinal / this.costo ) - 1 )  * 100    
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

  get utilidad() : number {
    return ( this.precioFinal - this.costo ) * this.qty
  }

  // * /////////////////////////////////////////////////////////////////////////////////// COMISIONES
  // * /////////////////////////////////////////////////////////////////////////////// Nivel Precios comision
  get nivelPrecios()      : TNivelesComision {
    const { nivelesComision } = storeToRefs( useStoreAcuerdo() )
    
    const nivel   =   this.aumentoFromCosto >= nivelesComision.value.alfa ? NIVELES_COMISION.ALFA
                    : this.aumentoFromCosto >= nivelesComision.value.a    ? NIVELES_COMISION.A
                    : this.aumentoFromCosto >= nivelesComision.value.b    ? NIVELES_COMISION.B
                    : this.aumentoFromCosto >= nivelesComision.value.c    ? NIVELES_COMISION.C
                    : this.aumentoFromCosto >= nivelesComision.value.d    ? NIVELES_COMISION.D
                    : this.aumentoFromCosto >= nivelesComision.value.e    ? NIVELES_COMISION.E
                    :                                                       NIVELES_COMISION.X

    return nivel
  }

  // * /////////////////////////////////////////////////////////////////////////////// Icono nivel comision 
  get iconoNivel(): string {
    let icon        = "mdi-"
        icon        += this.nivelPrecios === NIVELES_COMISION.ALFA
                        ? "alpha"
                        : `alpha-${ this.nivelPrecios }-box` // -circle-outline -box-outline
    return icon
  }

  get x100DescuentoNiveles(): INivelesComision
  {
    const x100s               = new NivelesComision()
    const { nivelesComision } = storeToRefs( useStoreAcuerdo() )
    for(const [key, value] of Object.entries( nivelesComision.value ))
    {
      const aumentar          = value / 100 + 1  // Convierte 35 en 1.35 para luego multiplicar 
      const precioVenta       = this.costo * aumentar
      const precioDescu       = this.precioBase - precioVenta
      const x100Descuento     = precioDescu * 100 / this.precioBase
      const keyItem           = key == "alfa" || key == "a" || key == "b" || key == "c" || key == "d" || key == "e" ? key : "alfa"
      x100s[keyItem]          = roundInt(x100Descuento, 0)
    }
    return x100s
  }

  get qtyDeTotal () : string{
    return `${this.qty} de ${this.qtyTotal}`
  }
  get bodegaLabel() : string{
    return this.bodega.label
  }

  // * /////////////////////////////////////////////////////////////////////////////// Destacar con clase
  destacar( accion  : TAccionDestacar = "seleccionar",
            mostrar : "mostrar" | "ocultar"             = "mostrar"
          )
  {
    //console.log({accion}, {mostrar})
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
        clase               = "bg-light-green-11"
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
        linea.precioBase    = parseFloat( linea?.precioBase     ?? 0 )
        linea.costo         = parseFloat( linea?.costo          ?? 0 )
        linea.iva           = parseFloat( linea?.iva            ?? 0 )
        linea.descuentoX100 = parseFloat( linea?.descuentoX100  ?? 0 )

        linea.tipo          = +linea.tipo
        linea.lineaId       = +linea.lineaId
        linea.qty           = +linea.qty
        linea.orden         = +linea.orden
        linea.codeX         = +linea.codeX
        linea.unidadId      = +linea.unidadId
        linea.unidad        = await getUnidadDB( linea.unidadId )    
        if(!!linea.sigla)
          linea.categoria   = await getCategoriaDB( linea.sigla  )
        linea.imagen        = !!linea.imagen ? linea.imagen : imagenDefault
        linea.bodegaId      = linea?.bodegaId       ?? 0
        linea.qtyTotal      = linea?.qtyTotal       ?? 0
        linea.lineaIdPedido = linea?.lineaIdPedido  ?? 0

        const lineaFinal    = Object.assign( new LineaAcuerdo(), linea ) as ILineaAcuerdo
        lineaFinal.comsionX100Division = +(linea?.divisionComision ?? 100)

        if(!!lineaFinal.bodegaId)
        {
          lineaFinal.bodega = await getBodegaDB( lineaFinal.bodegaId )
          //console.log("lineaFinal.bodega: ", lineaFinal.bodega);
        }

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

  static getTitulo( nombre : string ) : ILineaAcuerdo
  {
    let linea               = new LineaAcuerdo()
        linea.codeX         = 104777
        linea.qty           = 1
        linea.tipo          = 9
        linea.nombre        = nombre
    return linea
  }

  static getSubTotal() : ILineaAcuerdo
  {
    const linea               = new LineaAcuerdo()
          linea.codeX         = 104777
          linea.qty           = 99
          linea.tipo          = 9
    return linea
  }

  static lineaDeProducto( producto : IProductoDoli ) : ILineaAcuerdo
  {
    const linea : ILineaAcuerdo = Object.assign( new LineaAcuerdo(), producto )
          // linea.lineaId      = 0
          // linea.orden        = 0
          linea.qty             = 1
          linea.descuentoX100   = !!producto.descuentoCalculado ? producto.descuentoCalculado : 0
          linea.precioBase      = producto.precio_publico

    return linea
  }

  static lineasDeProductos( productos : IProductoDoli[],
                            qty       : number  | undefined = undefined,
                            iva_      : boolean | undefined = undefined

                          ) : ILineaAcuerdo[]
  {
    const lineas  : ILineaAcuerdo[] = []
    const iva     : number          = !!iva_ ? parseInt( process.env.IVA ?? "0" ) : 0
    if( !productos.length ) return []

    for (const producto of productos)
    {
      let linea               = LineaAcuerdo.lineaDeProducto(producto)
          linea.qty           = !qty || (typeof qty === "number" && qty < 0 ) ? 1 : qty
          linea.iva           = iva
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
      fk_unit:        linea.unidad.id,
      special_code:   linea.codeX,
      label:          linea.nombre.length > 2 ? linea.nombre : undefined,
      array_options:
      {
        options_division_comision_x100: linea.comsionX100Division,
      },
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
