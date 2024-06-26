import { AREA   } from 'src/models/TiposVarios'
import { jsPDF  } from "jspdf"

export interface IInicioPDF {
  ancho                 : number
  alto                  : number
  path                  : string
  margenIzq             : number
  margenDer             : number
  pie                   : number
  pdf                   : jsPDF
}

type TAlinacion = "center" | "left" | "right"
export interface    INegrita {
  align:            TAlinacion
  renderingMode:    "fillThenStroke"
  lineHeightFactor: number
}

export interface IUtilPDF extends IInicioPDF {
  pdf                 : jsPDF
  x                   : number
  y                   : number
  hojaNow             : number
  hojas               : number
  color               : string
  area                : AREA
  imgLogo             : string
  imgFondo            : string
  imgBar              : string
  areaNombre          : string
  headText            : string
  pieText             : string
  headAlto            : number
  fontBase            : string
  fontBold            : string
  anchoMitad          : number
  altoMitad           : number
  margenDerX          : number
  margen1             : number
  margen2             : number
  posXMargenDerecha   : number
  empresa             : string
  nit                 : string
  empresaNit          : string
  direccion           : string
  direccionCorta      : string
  telefono            : string
  urlPoliticas        : string
  addY                : ( aumento : number ) => void
  seNecesitaNuevaHoja : ( posY  : number, altura : number ) => boolean
  setFont             : ( size  : number, color  : number ) => void
  negrita             : ( align : TAlinacion, espaciado?: number  ) => INegrita
  setColor            : ( color: number )=> void
  setNewPage          : ()=>void
  limpiarPDF          : ()=>void
}


export const enum GRISES {
  GRIS_1            = "#ECECEC",
  GRIS_2            = "#E0E0E0",
  GRIS_3            = "#D2D2D2",
  GRIS_4            = "#B4B4B4",
  GRIS_5            = "#969696",
  GRIS_6            = "#7D7D7D",
  GRIS_7            = "#646464",
  GRIS_8            = "#464646",
  GRIS_9            = "#323232",
  GRIS_10           = "#141414",
}

const EMPRESA       = "Grupo Escom SAS"
const NIT           = "NIT: 900.419.912-7"
const DIR           = "Crr 49 A # 85-05 Bogotá Colombia"
const DIR_CORTA     = "Kr 49A 85-05 Btg"
const TEL_ESCOM     = "PBX 601 813 7505"
const TEL_MUBLEX    = "PBX 601 722 7881"

export class UtilPDF implements IUtilPDF {
  x                 : number  = 0
  y                 : number  = 0
  hojaNow           : number  = 1
  hojas             : number  = 1
  area              : AREA    = AREA.NULO
  fontBase          : string  = ""
  fontBold          : string  = ""
  headAlto          : number  = 0
  margen1           : number  = 0
  margen2           : number  = 0  
  ancho             : number
  alto              : number
  path              : string
  margenIzq         : number
  margenDer         : number
  pie               : number  
  pdf               : jsPDF

  constructor( inicio : IInicioPDF )
  {
    this.ancho      = inicio.ancho
    this.alto       = inicio.alto
    this.path       = inicio.path
    this.margenIzq  = inicio.margenIzq
    this.margenDer  = inicio.margenDer
    this.pie        = inicio.pie
    this.pdf        = inicio.pdf
  }

  get anchoMitad        (){ return this.ancho / 2 }
  get altoMitad         (){ return this.alto  / 2 }
  get color             (){ return this.area === AREA.MUBLEX ? "red"    : "orange" } //
  get areaNombre        (){ return this.area === AREA.MUBLEX ? "Mublex" : "Escom" }
  get imgLogo           (){ return this.path + "logo" + this.areaNombre + ".png" }
  get imgFondo          (){ return this.path + "fondoGris.png" }
  get imgBar            (){ return this.path + "bar_" + this.color + ".png" }
  get margenDerX        (){ return this.ancho - this.margenDer }
  get posXMargenDerecha (){ return this.ancho - this.margenDer - this.margenIzq }
  get empresa           (){ return EMPRESA }
  get nit               (){ return NIT }
  get direccion         (){ return DIR }
  get direccionCorta    (){ return DIR_CORTA }
  get empresaNit        (){ return EMPRESA + " " + NIT}
  get telefono          (){ return this.area === AREA.MUBLEX ? TEL_MUBLEX : TEL_ESCOM }
  get headText          (){
    return EMPRESA + " " + NIT + "\n" + DIR + "\n" + (this.area === AREA.MUBLEX ? TEL_MUBLEX : TEL_ESCOM) 
  }
  get pieText     (){
    return EMPRESA + " " + NIT + " - " + DIR + " - " + (this.area === AREA.MUBLEX ? TEL_MUBLEX : TEL_ESCOM) 
  }

  get urlPoliticas(){
    return  this.area === AREA.MUBLEX
          ? "https://www.mublex.com/documentos/Politica_para_el_tratamiento_de_datos_personales.pdf" 
          : "https://www.escoming.com/documentos/Politica_Proteccion_de_Datos_Personales_Escom.pdf"
  }

  addY( aumento : number ) { this.y += aumento }
  setFont( size : number, color : number )
  {
    this.setColor       ( color )
    this.pdf.setFontSize( size )
  }

  negrita( alinacion : TAlinacion, espaciado : number = 1 ) : INegrita {
    return { align: alinacion, renderingMode: 'fillThenStroke', lineHeightFactor :  espaciado}
  }

  setColor( color : number )
  {
    this.pdf.setTextColor( color )
    this.pdf.setDrawColor( color )
  }

  setNewPage()
  {
    this.pdf.addPage()
    this.hojas++
    this.hojaNow          = this.hojas
    this.pdf.setPage( this.hojaNow )
  }

  limpiarPDF()
  {
    if(!!this.hojas)
    {
      for (let pageIndex  = this.hojas; pageIndex >= 1; pageIndex--)
      {
        this.pdf.deletePage(pageIndex)
        this.hojas        = pageIndex-1
      }
      this.setNewPage()
    } 
  }

  seNecesitaNuevaHoja(posY : number, altura : number ) : boolean
  {
    return posY + altura >= this.alto - ( this.pie + 2 )  ? true : false
  }  
}


export class ImagenPDF extends Image
{
  posY: number
  hoja: number

  constructor( src : string,  posY : number, hoja : number )
  {
    super()

    this.posY = posY
    this.hoja = hoja
    this.src  = src
    this.setAttribute('crossOrigin', 'anonymous')
  }
}

export async function crearImageHTML( src : string ) : Promise<HTMLImageElement>
{
  return new Promise((resolve, reject) => {
    const img       = new Image()
    img.onload      = () => resolve(img)
    img.onerror     = reject
    img.src         = src
  })
}