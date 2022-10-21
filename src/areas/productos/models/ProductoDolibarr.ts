import {  IUnidad,
          Unidad            } from "src/models/Diccionarios/Unidad"
import {  getUnidadDB       } from "src/services/useDexie"
import {  roundInt,
          X100_Aumento,
          X100_Calcular     } from "src/useSimpleOk/useTools"

export const imagenDefault  :string  = "https://dolibarr.mublex.com/_maco/img/box.jpg"
const ivaX100                 = parseInt( process.env.IVA ?? "0" )

export interface IProductoDoli {
  id:                       number
  ref:                      string
  nombre:                   string
  urlDolibarr:              string
  sigla:                    string
  descripcion:              string
  iva:                      number
  unidadId:                 number
  unidad:                   IUnidad
  tipo:                     0 | 1 | 9     // 0 producto 1 servicio 9 subtotal
  tipoProducto:             string
  imagen:                   string
  imagenFull:               string
  imagen100px:              string
  imagen300px:              string
  activo_proveedor:         boolean       // Activo proveedor
  aumento:                  number
  aumento_escom:            number
  aumento_descuento:        number
  aumento_loco:             number
  precio_aumento:           number
  precio_aumento_escom:     number
  precio_aumento_descuento: number
  precio_aumento_loco:      number
  precio_escom:             number
  descuentoCalculado:       number
  costo_adicional:          number
  creador_id:               number
  disponible:               boolean       // Disponible proveedor
  en_compra:                boolean
  en_venta:                 boolean
  fecha_creacion:           string
  fecha_llegada:            string        // Fecha llegada proveedor
  garantia:                 string        // "1_year"
  hecho_en:                 string        // "colombia"
  id_extra:                 number        // ID extra field 
  id_producto_pro:          number        // ID producto proveedor 
  id_proveedor:             number
  costo:                    number        // precio que viene de la tabla llx_product > cost_price
  precio_proveedor:         number        // precio que es el minimo de la tabla productos_proveedor > precio
  precio_publico:           number
  precio_promocion:         number
  precioPublicoConIVA:      number
  precioPromocionConIVA:    number
  precio:                   number        // Precio final, el menor entre publico y promocion 
  codigo:                   number
  competencia:              number

  elegido:                  boolean       // Se utiliza para indicar que el producto a sido agregado a lista
  esRefEspecial:            boolean
  activo:                   boolean
}

export class ProductoDoli implements IProductoDoli
{
  id:                       number
  ref:                      string
  nombre:                   string
  sigla:                    string
  descripcion:              string
  iva:                      number
  unidadId:                 number
  unidad:                   IUnidad
  tipo:                     0 | 1 | 9  
  imagen:                   string
  activo_proveedor:         boolean       
  aumento:                  number
  aumento_escom:            number
  aumento_descuento:        number
  aumento_loco:             number
  costo_adicional:          number
  creador_id:               number
  disponible:               boolean        
  en_compra:                boolean
  en_venta:                 boolean
  fecha_creacion:           string
  fecha_llegada:            string        
  garantia:                 string        
  hecho_en:                 string        
  id_extra:                 number        
  id_producto_pro:          number        
  id_proveedor:             number
  costo:                    number        
  precio_proveedor:         number        
  precio_publico:           number
  precio_promocion:         number
  precio:                   number
  codigo:                   number
  competencia:              number  
  elegido:                  boolean

  constructor()
  {
    this.id                 = 0
    this.ref                = ""
    this.sigla              = ""
    this.nombre             = ""
    this.descripcion        = ""
    this.iva                = 0
    this.unidadId           = 0
    this.unidad             = new Unidad()
    this.tipo               = 0
    this.imagen             = imagenDefault
    this.activo_proveedor   = true       
    this.disponible         = true
    this.aumento            = 0
    this.aumento_escom      = 0  
    this.aumento_descuento  = 0  
    this.aumento_loco       = 0  
    this.costo_adicional    = 0
    this.creador_id         = 0
    this.en_compra          = true
    this.en_venta           = true
    this.fecha_creacion     = ""
    this.fecha_llegada      = ""        
    this.garantia           = ""        
    this.hecho_en           = ""        
    this.id_extra           = 0        
    this.id_producto_pro    = 0        
    this.id_proveedor       = 0
    this.costo              = 0        
    this.precio_proveedor   = 0        
    this.precio_publico     = 0
    this.precio_promocion   = 0
    this.precio             = 0
    this.codigo             = 0
    this.competencia        = 0
    this.elegido            = false
  }

  get precio_aumento()          :number { return this.calcularPrecioConAumento( this.aumento            ) } 
  get precio_aumento_escom()    :number { return this.calcularPrecioConAumento( this.aumento_escom      ) } 
  get precio_aumento_descuento():number { return this.calcularPrecioConAumento( this.aumento_descuento  ) } 
  get precio_aumento_loco()     :number { return this.calcularPrecioConAumento( this.aumento_loco       ) } 

  calcularPrecioConAumento( aumento : number) : number {
    if(!this.costo || !aumento) return 0
    else                        return roundInt( X100_Aumento( this.costo, aumento), 3 )    
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

  get imagenFull() : string
  {
    return this.imagen
  }

  get imagen100px() : string
  {
    let urlImagen           = ""
    if( !!this.imagen )
    {
      if( this.imagen.includes( process.env.URL_DOLIBARR ))
      {
        const url = this.imagen.replace( process.env.URL_DOLIBARR, '' )
        urlImagen = `${process.env.URL_DOLIBARR}/resizer/resizer.php?file=..${url}&width=100&height=100&action=resize&crop_pos=center&quality=90`
      }
      else
      {        
        if( this.imagen.includes( ".jpg" ) || this.imagen.includes( ".jpeg" ))
          urlImagen       = this.imagen.replace(".j", "-100x100.j")
        if( this.imagen.includes( ".webp" ) )
          urlImagen       = this.imagen.replace(".webp", "-100x100.webp")

        urlImagen           = this.imagen.replace("http:", "https:")        
      }

    }

    return  urlImagen
  }

  get imagen300px() : string
  {
    let urlImagen           = ""
    if( !!this.imagen )
    {
      if( this.imagen.includes( process.env.URL_DOLIBARR ))
      {
        const url = this.imagen.replace( process.env.URL_DOLIBARR, '' )
        urlImagen = `${process.env.URL_DOLIBARR}/resizer/resizer.php?file=..${url}&width=300&height=300&action=resize&crop_pos=center&quality=90`
      }
      else
      {      
        if( this.imagen.includes( ".jpg" ) || this.imagen.includes( ".jpeg" ))
            urlImagen         = this.imagen.replace(".j", "-300x300.j")
        if( this.imagen.includes( ".webp" ) )
            urlImagen         = this.imagen.replace(".webp", "-300x300.webp")                

        urlImagen             = this.imagen.replace("http:", "https:")
      }
    }

    return  urlImagen
  }

  get tipoProducto() :string {
    return  this.tipo == 0 ?  "producto"
          : this.tipo == 1 ?  "servicio"
          : this.tipo == 9 ?  "especial"
          :                   "desconocido"
  }

  get precioPublicoConIVA(): number {
    return X100_Aumento( this.precio_publico, ivaX100 )
  }
  get precioPromocionConIVA(): number {
    return X100_Aumento( this.precio_promocion, ivaX100 )
  }
  get descuentoCalculado() : number {
    let diferencia  = this.precio_publico - this.precio_promocion
    if(diferencia == 0) return 0

    let descuento = +X100_Calcular( this.precio_publico, diferencia ).toFixed(1)

    if(descuento == 100)  
      descuento   = 0
    return descuento
  }

  get activo() :boolean {
    return  (
              this.activo_proveedor && this.disponible && this.en_venta
            )
            || this.esRefEspecial
  }


  get esRefEspecial() : boolean {
    return  this.ref.includes("-ITEM") ||
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
  }  

  static async productoAPItoProducto( productoApi : any ) : Promise<IProductoDoli>
  {
    if(!productoApi)                return new ProductoDoli()
    let producto                    = Object.assign( new ProductoDoli(), productoApi ) as IProductoDoli

    producto.id                     = +productoApi.id
    producto.id_extra               = +productoApi.id_extra
    producto.id_producto_pro        = +productoApi.id_producto_pro
    producto.id_proveedor           = +productoApi.id_proveedor
    producto.unidadId               = +productoApi.unidadId
    producto.creador_id             = +productoApi.creador_id
    producto.codigo                 = +productoApi.codigo
    producto.iva                    = +productoApi.iva
    producto.tipo                   =   productoApi.tipo == 1 ? 1
                                      : productoApi.tipo == 9 ? 9
                                      : 0

    producto.activo_proveedor       = Boolean( +productoApi.activo_proveedor      )
    producto.disponible             = Boolean( +productoApi.disponible            )
    producto.en_compra              = Boolean( +productoApi.en_compra             )
    producto.en_venta               = Boolean( +productoApi.en_venta              )
    
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
    producto.imagen                 = !!producto.imagen ? producto.imagen : imagenDefault
    
    producto.unidad                 = await getUnidadDB( producto.unidadId      )
    return producto
  }
}