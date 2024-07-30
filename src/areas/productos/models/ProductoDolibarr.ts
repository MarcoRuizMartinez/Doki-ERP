import {  IUnidad,
          Unidad              } from "src/models/Diccionarios/Unidad"
import {  getUnidadDB,
          getCategoriaDB,
          getNaturalezaDB     } from "src/composables/useDexie"
import {  ToolNum, ToolType   } from "src/composables/useTools"
import {  ICategoriaProducto,
          CategoriaProducto   } from "src/areas/productos/models/CategoriaProducto"
import {  INaturalezaProducto,
          NaturalezaProducto  } from "src/models/Diccionarios/NaturalezaProducto"
import {  ILabelValue,
          labelValueNulo      } from "src/models/TiposVarios"
import {  IAccion             } from "src/areas/comunicacion/models/Accion"
import {  TCodigosSiigo,
          CodigosSiigo        } from 'src/areas/productos/models/Siigo';          
import {  IProductoProveedor,
          ProductoProveedor   } from './ProductoProveedor';          
import {  IImagenProducto,
          IMAGEN_DEFAULT,
          ImagenProducto      } from "./ImagenProducto"
import {  IProductoHijo,
          ProductoHijo        } from "./ProductoHijo"


const ivaX100                 = parseInt( process.env.IVA ?? "0" )

export type TTipoPDF          = "quote" | "cuentaCobro"

export interface IProductoDoli {
  id                        : number
  ref                       : string
  refProv                   : string
  categoria                 : ICategoriaProducto
  nombre                    : string
  urlDolibarr               : string
  sigla                     : string
  descripcion               : string
  iva                       : number
  unidadId                  : number
  unidad                    : IUnidad
  tipo                      : 0 | 1 | 9     // 0 producto 1 servicio 9 subtotal
  tipoLabelValue            : ILabelValue
  tipoProducto              : string
  naturaleza                : INaturalezaProducto
  img                       : IImagenProducto
  productosProveedor        : IProductoProveedor[]
  activo_proveedor          : boolean       // Activo proveedor
  aumento                   : number
  aumento_escom             : number
  aumento_descuento         : number
  aumento_loco              : number
  precio_aumento            : number        // get
  precio_aumento_escom      : number        // get
  precio_aumento_descuento  : number        // get
  precio_aumento_loco       : number        // get
  precio_publico_final      : number        // get
  precio_escom              : number        // get
  descuentoCalculado        : number
  costo                     : number        // precio que viene de la tabla llx_product > cost_price
  costo_adicional           : number
  costoTotal                : number
  creador_id                : number
  disponible                : boolean       // Disponible proveedor
  activoEnCompra            : boolean
  activoEnVenta             : boolean
  sin_proveedor             : boolean
  fecha_creacion            : string
  fecha_llegada             : string        // Fecha llegada proveedor
  garantia                  : string        // "1_year"
  hecho_en                  : string        // "colombia"
  id_extra                  : number        // ID extra field
  id_producto_pro           : number        // ID producto proveedor
  id_proveedor              : number
  precio_proveedor          : number        // precio que es el minimo de la tabla productos_proveedor > precio
  precio_publico            : number
  precio_promocion          : number
  precioPublicoConIVA       : number        // get
  precioPromocionConIVA     : number        // get
  precio                    : number        // Precio final, el menor entre publico y promocion  
  competencia               : number
  esProducto                : boolean
  esServicio                : boolean
  elegido                   : boolean       // Se utiliza para indicar que el producto a sido agregado a lista
  esRefEspecial             : boolean
  activo                    : boolean
  comentarios               : IAccion[]
  productoForApi            : any
  productoForApiPrecios     : any
  getComoProductoHijo       : IProductoHijo
  siigo                     : TCodigosSiigo  // Codigo siigo que se utiliza en los productos
  requiereAcabado           : boolean
  requiereMedida            : boolean
  requiereEntregado         : boolean
  urlTienda                 : string
  stockGestionado           : boolean
  stockProveedor            : number

}

export class ProductoDoli implements IProductoDoli
{
  id                        : number              = 0
  ref                       : string              = ""
  refProv                   : string              = ""
  categoria                 : ICategoriaProducto  = new CategoriaProducto()
  nombre                    : string              = ""
  sigla                     : string              = ""
  descripcion               : string              = ""
  iva                       : number              = parseInt( process.env.IVA ?? "0" )
  unidadId                  : number              = 0
  unidad                    : IUnidad             = new Unidad()
  tipo                      : 0 | 1 | 9           = 0
  tipoLabelValue            : ILabelValue         = labelValueNulo
  naturaleza                : INaturalezaProducto = new NaturalezaProducto()
  img                       : IImagenProducto     = new ImagenProducto()
  productosProveedor        : IProductoProveedor[]=[]
  aumento                   : number              = 0
  aumento_escom             : number              = 0
  aumento_descuento         : number              = 0
  aumento_loco              : number              = 0
  costo                     : number              = 0
  costo_adicional           : number              = 0
  creador_id                : number              = 0
  activoEnCompra            : boolean             = true
  activoEnVenta             : boolean             = true
  sin_proveedor             : boolean             = false
  fecha_creacion            : string              = ""
  fecha_llegada             : string              = ""
  garantia                  : string              = ""
  hecho_en                  : string              = ""
  id_extra                  : number              = 0
  id_producto_pro           : number              = 0
  id_proveedor              : number              = 0
  precio_proveedor          : number              = 0
  precio_publico            : number              = 0
  precio_promocion          : number              = 0
  precio                    : number              = 0
  siigo                     : TCodigosSiigo       = new CodigosSiigo()
  competencia               : number              = 0
  elegido                   : boolean             = false
  comentarios               : IAccion[]           = []
  requiereAcabado           : boolean             = false
  requiereMedida            : boolean             = false
  requiereEntregado         : boolean             = false
  urlTienda                 : string              = ""
  stockGestionado           : boolean             = false
  stockProveedor            : number              = -1

  get precio_aumento()          :number { return this.calcularPrecioConAumento( this.aumento            ) }
  get precio_aumento_escom()    :number { return this.calcularPrecioConAumento( this.aumento_escom      ) }
  get precio_aumento_descuento():number { return this.calcularPrecioConAumento( this.aumento_descuento  ) }
  get precio_aumento_loco()     :number { return this.calcularPrecioConAumento( this.aumento_loco       ) }

  get precio_publico_final() : number
  {
    let precio = !!this.precio_aumento ? this.precio_aumento : this.precio_aumento_escom
    return precio
  }


  calcularPrecioConAumento( aumento : number) : number {
    if(!this.costo || !aumento) return 0
    else                        return ToolNum.roundInt( ToolNum.X100_Aumento( this.costoTotal, aumento), 2 )
  }

  get costoTotal() : number {
    return ( ToolType.valorValido( this.costo ) ? this.costo : 0 ) + ( ToolType.valorValido( this.costo_adicional ) ? this.costo_adicional : 0 )
  }

  get precio_escom() : number {
    let precio                    = 0
    if( this.precio_aumento_escom < this.precio_aumento &&
        this.precio_aumento       > this.costo          &&
        !this.precio_aumento_descuento
    )
      precio                = this.precio_aumento

    if(this.precio_aumento_escom  < this.precio_aumento_descuento  && this.precio_aumento_descuento  > this.costo)
      precio                = this.precio_aumento_descuento

    if(precio                     < this.precio_aumento_escom)
      precio                = this.precio_aumento_escom

    return precio
  }


  get urlDolibarr() : string { return process.env.URL_DOLIBARR + "/product/card.php?id=" + this.id }

  get tipoProducto() :string {
    return  this.tipo == 0 ?  "producto"
          : this.tipo == 1 ?  "servicio"
          : this.tipo == 9 ?  "especial"
          :                   "desconocido"
  }

  get precioPublicoConIVA(): number {
    return ToolNum.X100_Aumento( this.precio_publico, ivaX100 )
  }
  get precioPromocionConIVA(): number {
    return ToolNum.X100_Aumento( this.precio_promocion, ivaX100 )
  }
  get descuentoCalculado() : number {
    let diferencia  = this.precio_publico - this.precio_promocion
    if(diferencia == 0) return 0

    let descuento = +ToolNum.X100_Calcular( this.precio_publico, diferencia ).toFixed(1)

    if(descuento == 100)
      descuento   = 0
    return descuento
  }

  get activo() :boolean {
    return  (
                  this.activo_proveedor
              &&  this.disponible
              &&  this.activoEnVenta
            )
            ||
            (
                  this.activoEnVenta
              &&  !this.disponible
              &&  !this.aumento
              &&  !this.aumento_descuento
              &&  !this.activo_proveedor
              &&  !!this.aumento_escom
            )
            ||    this.esRefEspecial
  }

  get esProducto() : boolean  { return this.tipo === 0 }
  get esServicio() : boolean  { return this.tipo === 1 }
  get esRefEspecial() : boolean {
    return  ( this.activoEnCompra && this.activoEnVenta )
            &&
            (
              this.sin_proveedor         ||
              this.ref.includes("-ITEM") ||
              this.ref.includes("ARRA-") ||
              this.ref.includes("ARR-")  ||
              this.ref.includes("ARRP-") ||
              this.ref.includes("ADC-")  ||
              this.ref.includes("CABL-") ||
              this.ref.includes("CANT-") ||
              this.ref.includes("CERR-") ||
              this.ref.includes("CIER-") ||
              this.ref.includes("CORT-") ||
              this.ref.includes("DI-")   ||
              this.ref.includes("DIAP-") ||
              this.ref.includes("DID-")  ||
              this.ref.includes("DIMA-") ||
              this.ref.includes("DIMI-") ||
              this.ref.includes("DIMO-") ||
              this.ref.includes("DISÑ-") ||
              this.ref.includes("DIVR-") ||
              this.ref.includes("DUCT-") ||
              this.ref.includes("EMBA-") ||
              this.ref.includes("FINC-") ||
              this.ref.includes("INST-") ||
              this.ref.includes("LUZ-")  ||
              this.ref.includes("MANT-") ||
              this.ref.includes("META-") ||
              this.ref.includes("MURO-") ||
              this.ref.includes("OBRA-") ||
              this.ref.includes("PANE-") ||
              this.ref.includes("PINT-") ||
              this.ref.includes("PISO-") ||
              this.ref.includes("PUER-") ||
              this.ref.includes("RED-")  ||
              this.ref.includes("REPR-") ||
              this.ref.includes("REUB-") ||
              this.ref.includes("SERV-") ||
              this.ref.includes("TAPZ-") ||
              this.ref.includes("TECH-") ||
              this.ref.includes("TELA-") ||
              this.ref.includes("TOOL-") ||
              this.ref.includes("TRAN-") ||
              this.ref.includes("VIAT-")
            )
  }

  get activo_proveedor() : boolean {
    if( !this.productosProveedor.length ) return true
    return this.productosProveedor.some( p => p.activo )
  }

  get disponible() : boolean {
    if( !this.productosProveedor.length ) return true
    return this.productosProveedor.some( p => p.activo && p.disponible )
  }

  get productoForApi() : any
  {
    const proForApi : any = {
      ref:                    this.ref,
      label:                  this.nombre,
      description:            this.descripcion,
      price:                  this.precio_publico_final,
      tva_tx:                 this.iva,
      cost_price:             this.costo,
      status:                 +this.activoEnVenta,
      status_buy:             +this.activoEnCompra,
      fk_unit:                this.unidad.id ?? 28,
      finished:               this.naturaleza.codigo,
      type:                  +this.tipo,
      array_options:
      {
        options_aumento_escom         : this.aumento_escom,
        options_aumento               : this.aumento,
        options_aumento_precio_desc   : this.aumento_descuento,
        options_aumento_precio_loco   : this.aumento_loco,
        options_costo_adicional       : this.costo_adicional,
        options_precio_publico        : this.precio_aumento,
        options_precio_promocion      : this.precio_promocion,
        options_sin_proveedor         : +this.sin_proveedor,
        options_requierecolormaterial : +this.requiereAcabado,
        options_requieremedida        : +this.requiereMedida,
        options_requiereentregado     : +this.requiereEntregado,
      },
    }

    return proForApi
  }

  get productoForApiPrecios() : any
  {
    const proForApi : any = {
      price:                  this.precio_publico_final,
      cost_price:             this.costo,
      array_options:
      {
        options_aumento_escom:        this.aumento_escom,
        options_aumento:              this.aumento,
        options_aumento_precio_desc:  this.aumento_descuento,
        options_aumento_precio_loco:  this.aumento_loco,
        options_costo_adicional:      this.costo_adicional,
        options_precio_publico:       this.precio_aumento,
        options_precio_promocion:     this.precio_promocion,
        options_sin_proveedor:        +this.sin_proveedor,
      },
    }

    return proForApi
  }


  get getComoProductoHijo() : IProductoHijo
  {
    const hijo              = new ProductoHijo()
          hijo.ref          = this.ref
          hijo.nombre       = this.nombre    
          hijo.id           = this.id
          hijo.hijo_id      = this.id
          hijo.precio       = this.precio_publico_final
          hijo.costo        = this.costoTotal
          hijo.unidad       = this.unidad
          hijo.img          = this.img
          hijo.naturaleza   = this.naturaleza
          hijo.siigo        = this.siigo

    return hijo
  }


 // * ////////////////////////////////////////////////////////////////////////// Get new LineaAcuerdo data de API
 static async getProductosFromAPI( dataAPI : any, editable : boolean = false ) : Promise< IProductoDoli[] >
 {
   
    const productos : IProductoDoli[]  = []

    if(typeof dataAPI === "string")
      dataAPI                 = JSON.parse( dataAPI )
    
    if( !Array.isArray( dataAPI ) ) return []
    
    for (const pp of dataAPI)
    {
      const pro               = await ProductoDoli.getProductoFromAPI( pp, editable )
      productos.push( pro )
    }
    return productos
 }  

  static async getProductoFromAPI( productoApi : any, editable : boolean = false ) : Promise<IProductoDoli>
  {
    if(!productoApi)                return new ProductoDoli()
    const producto                  = Object.assign( new ProductoDoli(), productoApi ) as IProductoDoli

    producto.id                     = +productoApi.id
    producto.id_extra               = +productoApi.id_extra
    producto.id_producto_pro        = +productoApi.id_producto_pro
    producto.id_proveedor           = +productoApi.id_proveedor
    producto.unidadId               = +productoApi.unidadId
    producto.creador_id             = +productoApi.creador_id
    producto.siigo.codigo           = +productoApi.codigo
    producto.iva                    = +productoApi.iva
    producto.tipo                   =   productoApi.tipo == 1 ? 1
                                      : productoApi.tipo == 9 ? 9
                                      : 0
    producto.tipoLabelValue         =   producto.tipo == 0 ? { value : 0, label:'Producto'}
                                      : producto.tipo == 1 ? { value : 1, label:'Servicio'}
                                      : labelValueNulo
    producto.activoEnCompra         = ToolType.keyBoolean ( productoApi, 'en_compra'        )
    producto.activoEnVenta          = ToolType.keyBoolean ( productoApi, 'en_venta'         )
    producto.sin_proveedor          = ToolType.keyBoolean ( productoApi, 'sin_proveedor'    )
    producto.siigo.enSiigo          = ToolType.keyBoolean ( productoApi, 'enSiigo'          )
    producto.requiereAcabado        = ToolType.keyBoolean ( productoApi, 'requiereAcabado'  )
    producto.requiereMedida         = ToolType.keyBoolean ( productoApi, 'requiereMedida'   )
    producto.requiereEntregado      = ToolType.keyBoolean ( productoApi, 'requiereEntregado')
    producto.stockGestionado        = ToolType.keyBoolean ( productoApi, 'stockGestionado' )

    producto.stockProveedor         = ToolType.keyNumberValido ( productoApi, 'stockProveedor')    

    producto.aumento                = parseFloat( productoApi.aumento             )
    producto.aumento_escom          = parseFloat( productoApi.aumento_escom       )
    producto.aumento_descuento      = parseFloat( productoApi.aumento_descuento   )
    producto.aumento_loco           = parseFloat( productoApi.aumento_loco        )
    producto.costo                  = parseFloat( productoApi.costo               )
    producto.costo_adicional        = parseFloat( productoApi.costo_adicional     )
    producto.precio                 = parseFloat( productoApi.precio              )
    producto.precio_promocion       = parseFloat( productoApi.precio_promocion    )
    producto.precio_proveedor       = parseFloat( productoApi.precio_proveedor    )
    producto.precio_publico         = parseFloat( productoApi.precio_publico      )
    producto.competencia            = parseFloat( productoApi.competencia         )

    producto.img.url                = productoApi?.imagen ?? IMAGEN_DEFAULT

    if(!producto.precio             && !!producto.aumento_escom ){
      producto.precio               = producto.precio_aumento_escom
    }

    if(!producto.precio_publico     && !!producto.aumento_escom ){
      producto.precio_publico       = producto.precio_aumento_escom
    }

    producto.unidad                 = await getUnidadDB( producto.unidadId )
    producto.categoria              = await getCategoriaDB( producto.sigla )
    producto.naturaleza             = await getNaturalezaDB( productoApi?.naturaleza_id ?? "0" )
    producto.productosProveedor     = await ProductoProveedor.getProductosProveedorFromAPI( productoApi?.productosPro ?? {} )

    return producto
  }
}
