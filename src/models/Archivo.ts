import { format   } from 'quasar'
import { ToolDate } from "src/composables/useTools"          

const { humanStorageSize } = format

export type TFamiliaArchivos   = "PDF" | "Excel" | "Word" | "Texto" | "Calculo" | "PowerP" | "Imagen" | "Video"

export interface IArchivo
{
  date:                     number
  fecha:                    Date
  fechaCorta:               string
  fullname:                 string
  name:                     string
  //level1name:               string
  path:                     string
  relativename:             string
  size:                     number 
  //type:                     string
  sizeFile:                 string
  extension:                string
  tipo:                     TFamiliaArchivos
  icono:                    string
  iconoColor:               string
  modulepart:               string 
  original_file:            string
  endPoint:                 string
  loading:                  boolean
  esVisualizable:           boolean
  fileType:                 string
  nombreCorto:              string
  url:                      string
  label:                    string
  value:                    string
}

export class Archivo implements IArchivo
{
  date          : number    = 0
  fullname      : string    = ""
  name          : string    = ""  
  path          : string    = ""
  relativename  : string    = ""
  size          : number    = 0
  loading       : boolean   = false
  label         : string    = ""

  constructor()
  {
    //this.label = this.name
  }

  //get label() : string { return this.name }
  get value() : string { return this.name }

  get url() : string {
    const url = this.fullname.replace("/home/mublexco/_dolibarr", process.env.URL_DOLIBARR ?? "")
    return url 
    // "/home/mublexco/_dolibarr/documents/societe/4/RUT Ergo ACTUALIZADO 2015.pdf"
  }

  get sizeFile() : string {
    return humanStorageSize(this.size) 
  }

  get extension() : string {
    return this.relativename.slice( this.relativename.lastIndexOf('.') ).replace(".", "").toLowerCase()
  }

  get modulepart() : string {
    const doc = "/documents/"
    const i1 = this.path.indexOf(doc)
    const i2 = this.path.lastIndexOf("/")
    const arrayPath           = this.path.slice(i1 + doc.length, i2).split( "/" )
    return arrayPath[0]
  }

  get original_file() : string {
    let arrayPath = this.path.split( "/" )
    const file = arrayPath[arrayPath.length - 1] + "/" + this.relativename
    return file
  }

  get tipo() : TFamiliaArchivos {
    let tipo : TFamiliaArchivos = "PDF"

    switch (this.extension) {
      case "pdf":   tipo  = "PDF";      break;
      case "xlsx":  tipo  = "Excel";    break;
      case "xls":   tipo  = "Excel";    break;
      case "csv":   tipo  = "Excel";    break;
      case "docx":  tipo  = "Word";     break;
      case "doc":   tipo  = "Word";     break;
      case "txt":   tipo  = "Texto";    break;
      case "odt":   tipo  = "Texto";    break;
      case "ods":   tipo  = "Calculo";  break;
      case "ppt":   tipo  = "PowerP";   break;
      case "pptx":  tipo  = "PowerP";   break;
      case "jpg":   tipo  = "Imagen";   break;
      case "jpeg":  tipo  = "Imagen";   break;
      case "png":   tipo  = "Imagen";   break;
      case "gif":   tipo  = "Imagen";   break;
      case "webp":  tipo  = "Imagen";   break;
      case "mp4":   tipo  = "Video";    break;
      case "avi":   tipo  = "Video";    break;
      case "mov":   tipo  = "Video";    break;
      case "mkv":   tipo  = "Video";    break;
      case "mpeg":  tipo  = "Video";    break;     
      case "ogv":   tipo  = "Video";    break;  
      default: break;
    }
    return tipo
  }

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

  get fileType() : string {
    let tipo  =  ""

    switch (this.extension) {
      case "pdf":   tipo  = "application/pdf";  break;
      case "jpg":   tipo  = "image/jpeg";       break;
      case "jpeg":  tipo  = "image/jpeg";       break;
      case "png":   tipo  = "image/png";        break;
      case "gif":   tipo  = "image/gif";        break;
      case "webp":  tipo  = "image/webp";       break;
      case "txt":   tipo  = "text/plain";       break;
      case "zip":   tipo  = "application/zip";  break;
      case "mp4":   tipo  = "video/mp4";        break;
      case "mpeg":  tipo  = "video/mpeg";       break;
      case "ogv":   tipo  = "video/ogg";        break;  
      case "avi":   tipo  = "video/x-msvideo";  break;
      default: break;
    }
    return tipo
  }

  get icono() : string {
    let icono = "mdi-file-download"

    switch (this.tipo) {
      case "PDF":     icono = "mdi-pdf-box";                break;
      case "Calculo": icono = "mdi-google-spreadsheet";     break;
      case "Excel":   icono = "mdi-microsoft-excel";        break;
      case "Texto":   icono = "mdi-file-document";          break;
      case "Word":    icono = "mdi-microsoft-word";         break;
      case "PowerP":  icono = "mdi-microsoft-powerpoint";   break;
      case "Imagen":  icono = "mdi-file-image";             break;
      case "Video":   icono = "mdi-video";                  break;
      default: break;
    }
    return icono
  }

  get iconoColor() : string {
    let color = "black"

    switch (this.tipo) {
      case "PDF":     color = "red";          break;
      case "Calculo": color = "green";        break;
      case "Excel":   color = "green";        break;
      case "Texto":   color = "indigo-10";    break;
      case "Word":    color = "indigo-10";    break;
      case "PowerP":  color = "deep-orange";  break;
      case "Imagen":  color = "light-blue-9"; break;
      case "Video":   color = "pink-8";       break;
      default: break;
    }
    return color
  }

  get endPoint() :string  {
    return "modulepart=" + this.modulepart + "&original_file=" + encodeURIComponent( this.original_file )
  }

  get fecha() : Date {
    return ToolDate.getDateToApiDolibarr( this.date )
  }
  get fechaCorta() : string {
    return this.fecha.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit", minute: "2-digit" }) 
  }
  get esVisualizable() : boolean { 
    return this.tipo === "PDF" || this.tipo === "Imagen"
  }

  get nombreCorto() : string {
    const i = this.name.indexOf("-") + 1
    const l = this.name.length
    const n = this.name.slice(i, l)
    return n
  }
/* 
date: 1638982064
fullname: "/home/187873.cloudwaysapps.com/zmuvwspjgp/public_html/documents/societe/1/Precio Espana Corregido PAGINA #22.pdf"
level1name: "1"
name: "Precio Espana Corregido PAGINA #22.pdf"
path: "/home/187873.cloudwaysapps.com/zmuvwspjgp/public_html/documents/societe/1"
relativename: "Precio Espana Corregido PAGINA #22.pdf"
size: 224110
type: "file"
 */
}
/*

{
	"filename": "mynewfile.txt",
	"modulepart": "invoice",
	"ref": "FA1701-001",
	"subdir": "",
	"filecontent": "content text",
	"fileencoding": "",
	"overwriteifexists": "0" 
}, 
{
	"filename": "mynewfile.txt",
	"modulepart": "supplier_invoice",
	"ref": "FA1701-001",
	"subdir": "",
	"filecontent": "content text",
	"fileencoding": "",
	"overwriteifexists": "0"
},
{
	"filename": "mynewfile.txt", 
	"modulepart": "medias", 
	"ref": "", 
	"subdir": "image/mywebsite", 
	"filecontent": "Y29udGVudCB0ZXh0Cg==", 
	"fileencoding": "base64", 
	"overwriteifexists": "0"
}

{
  "filename": "REF0001-IMG.png",
  "modulepart": "produit",
  "ref": "REF0001",
  "subdir": "",
  "filecontent": "string avec mom code base64",
  "fileencoding": "base64",
  "overwriteifexists": 0
}

{
  "filename": "mynewfile.txt",
  "modulepart": "facture",
  "ref": "FA1701-001", 
  "subdir": "", 
  "filecontent": "content text", 
  "fileencoding": "", 
  "overwriteifexists": "0"
}

  filename = "test.pdf",
  modulepart = "facture",
  ref = "FA1701-001",
  subdir = "",
  filecontent = base64_enc(readBin(file, what = "raw", file.info(file)[1,"size"])),
  fileencoding = "base64",
  overwriteifexists = "1"
)
*/