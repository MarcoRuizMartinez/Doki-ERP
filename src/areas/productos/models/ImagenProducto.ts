export const IMAGEN_DEFAULT  :string  = "https://dolibarr.mublex.com/_maco/img/box.jpg"

type TTipo        =  "woo" | "doli"
const urlDolibarr = process.env.URL_DOLIBARR ?? ""


export interface IImagenProducto {
  url         : string
  img_full    : string
  img_100px   : string
  img_300px   : string
  img_Xpx     : ( px ?: number ) => string
  tipo        : TTipo
}

export class ImagenProducto implements IImagenProducto
{
  url             : string = IMAGEN_DEFAULT
  get img_full()  : string { return this.tipo === "doli" ? this.img_Xpx( 800 ) : this.url }
  get img_100px() : string { return this.img_Xpx( 100 ) }
  get img_300px() : string { return this.img_Xpx( 300 ) }
  get tipo()      : TTipo  { return this.url.includes( urlDolibarr ) ? "doli" : "woo" }

  constructor( url : string = "" ){
    this.url            = !!url ? url : IMAGEN_DEFAULT
  }

  img_Xpx( px : number = 100 ) : string
  {
    let urlImagen       = ""    
    if( !!this.url )
    {
      if( this.tipo     === "doli" )
      {
        const url       = this.url.replace( urlDolibarr, '' )
        urlImagen       = `${urlDolibarr}/resizer/resizer.php?file=..${url}&width=${px}&height=${px}&action=resize&crop_pos=center&quality=90`
      }
      else // La imagen viene de Woocommerce
      {
        if( this.url.includes( ".jpg" ) || this.url.includes( ".jpeg" )){
          urlImagen     = this.url.replace(".j", `-${px}x${px}.j`)
        }

        if( this.url.includes( ".webp" ) ){
          urlImagen     = this.url.replace(".webp", `-${px}x${px}.webp`)
        }

        urlImagen       = urlImagen.replace("http:", "https:")
      }
    }

    return  urlImagen
  }  
}

