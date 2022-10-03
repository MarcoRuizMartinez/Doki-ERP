import {  exportFile              } from "quasar"
import {  IColumna                } from "src/models/Tabla"
import {  siNo                    } from "src/useSimpleOk/useTools"

export type TModulosDolibarr  =   "thirdparty" | "project"  | "proposal"  | "order" | "shipment"  | "invoice" | "supplier_proposal" | "supplier_order"  | "supplier_invoice"

export function File_B64_ToBlob( file64 : string, typeFile : string = "application/pdf" ) :string 
{
  //console.log("typeFile: ", typeFile);
  let base64str           = file64.replace("UTF-8", "")
  let binary              = atob(base64str.replace(/\s/g, ''))
  let len                 = binary.length
  let buffer              = new ArrayBuffer (len)
  let view                = new Uint8Array  (buffer)
  for (let i = 0; i < len; i++) 
    view[i] = binary.charCodeAt(i)
  
  let blob                = new Blob( [view], { type: typeFile })
  let url                 = URL.createObjectURL(blob)
  return url
}

export function generarCSVDesdeTabla( nombre :string = "", columnsTabla : IColumna[], tabla : any[] ) : boolean
{
  let arrayCSV              = []
      arrayCSV.push( columnsTabla.map( c => c.label )  )

  for (const item of tabla)
  {
    let arrayFila           = []
    for (const columna of columnsTabla)
    {
      const fila            = item as any
      let   celda : string  = ""
      const tipo            = typeof fila[columna.name]

            if(tipo === "string") 
        celda               = fila[columna.name]
      else  if(tipo === "boolean") 
        celda               = siNo( fila[columna.name], false )
      else  if(tipo === "number") 
        celda               = fila[columna.name].toString().replace(".", ",")
      else  if(tipo === "object")
      {
              if(fila[columna.name].hasOwnProperty("nombre") && !!fila[columna.name].nombre )
          celda             = fila[columna.name].nombre
        else  if(fila[columna.name].hasOwnProperty("nombreCompleto") && !!fila[columna.name].nombreCompleto )
          celda             = fila[columna.name].nombreCompleto
        else  if(fila[columna.name].hasOwnProperty("nombreCompleto") && !!fila[columna.name].nombreCompleto )
          celda             = fila[columna.name].nombreCompleto
      }
        
      
      arrayFila.push( celda )
    }
    arrayCSV.push( arrayFila )
  }

  let csv                   = arrayCSV.map(e => e.join(";")).join("\n");
  const status              = exportFile( nombre + ".csv", "\ufeff"+csv, "text/csv" )

  return !!status 
}


export function DownloadFile_B64( file64 : string, name : string,  contentType : string ) 
{
  let contenBase64        = file64.replace("UTF-8", "")
  const linkSource        = `data:${contentType};base64,${contenBase64}`
  const downloadLink      = document.createElement("a")
  downloadLink.href       = linkSource
  downloadLink.download   = name
  downloadLink.click()
  downloadLink.remove()
  setTimeout(() => URL.revokeObjectURL(downloadLink.href), 7000)
}

export function DownloadFile_Blob( blobStr : string, name : string,  contentType : string ) 
{
  const blob = new Blob([blobStr], {type: contentType})
  const downloadLink      = document.createElement("a")
  downloadLink.href       = URL.createObjectURL(blob)
  downloadLink.download   = name
  
  downloadLink.click()
  downloadLink.remove()
  setTimeout(() => URL.revokeObjectURL(downloadLink.href), 7000)
}

export function FileToBase64(file : File) : Promise <string>
{
  return new Promise( async ( resolver, rechazar)=>{
    let lector              = new FileReader()
    
    lector.onload           = () => {
      //console.log("AAAAA", lector.result );
      //console.log('iamge as blob: ', new Blob([lector.result ]))      
      //console.log("lector: ", lector);
      resolver(lector.result as string)
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
    //https://stackoverflow.com/questions/51841946/filereader-how-to-change-the-character-encoding-from-utf-8-to-ansi
    //https://stackoverflow.com/questions/18839916/character-encoding-when-reading-writing-a-file-with-javascript
    //https://stackoverflow.com/questions/70595446/why-binary-string-data-not-show-as-pdf-in-iframe

    const encodings = ["ISO-8859-1",  "ISO-8859-2", "ISO-8859-3",  "ISO-8859-4", "ISO-8859-5", "ISO-8859-6", "ISO-8859-7",  "ISO-8859-8", "ISO-8859-8-I", "ISO-8859-10", "ISO-8859-13", "ISO-8859-14", "ISO-8859-15", "ISO-8859-16", "KOI8-R",  "KOI8-U", "UTF-16", "ANSI", "windows-1252",  "windows-1250",  "windows-1251",  "windows-1253", "windows-1254", "windows-1255", "windows-1256",  "windows-1257", "windows-1258", "windows-874", "UTF-16LE", "UTF-16BE" , "CP1251" , "latin1", "IBM866"]

    const enco      =  encodings[ 5 ]
    console.log("enco: ", enco);

    //lector.readAsArrayBuffer(file);
    //lector.readAsBinaryString(file);
    lector.readAsText(file, enco);
    //lector.readAsDataURL(file)

    lector.onerror          = error => rechazar(error);
  })
}