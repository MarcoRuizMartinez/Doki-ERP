
import {  UtilPDF,
          IUtilPDF,
          IInicioPDF,
          crearImageHTML,
          GRISES            } from 'src/useSimpleOk/UtilPDF';
import {  Acuerdo, IAcuerdo } from "src/areas/acuerdos/models/Acuerdo"
import {  ILineaLite        } from "src/areas/acuerdos/models/LineaAcuerdo"
import {  TIPO_ACUERDO      } from "src/areas/acuerdos/models/ConstantesAcuerdos"

import {  fechaLarga,
          limpiarHTML,
          formatoPrecio,
                            } from "src/useSimpleOk/useTools"
import {  jsPDF             } from "jspdf"
import    autoTable           from 'jspdf-autotable'

//* /////////////////////////////////////////////////////////////////////////////////// Store
import {  storeToRefs       } from 'pinia'                            
import {  useStoreAcuerdo   } from 'stores/acuerdo'
import {  useStoreUser      } from 'src/stores/user'  

export function useRemisionPDF()
{
  const { usuario           } = storeToRefs( useStoreUser() )  
  const pdf     : jsPDF       = new jsPDF('p','px')
  const setup   : IInicioPDF  = { ancho:      447,
                                  alto:       631,
                                  margenIzq:  10,
                                  margenDer:  10,
                                  pie:        8,
                                  path:       "images/pdf/",
                                  pdf:        pdf
                                }
  const doc     : IUtilPDF    = new UtilPDF( setup )
  let acuerdo   : IAcuerdo    = new Acuerdo()

  async function getRemisionPDF( acuerdoEntrega : IAcuerdo, lineas : ILineaLite[] ) : Promise<string>
  {
    acuerdo                   = acuerdoEntrega
    doc.limpiarPDF()
    await configurarPDF()
    for(let copia = 1; copia <= 2; copia++)
    {
      doc.y = copia === 1 ? 0 : doc.altoMitad
      generarCabezote()
      generarCuerpo()
      generarPie()
    }
    
    const pdf_blob  = pdf.output('bloburi')
    const pdf_final = pdf_blob.toString()
    return pdf_final
  }

  function saveRemisionPDF()
  {    
    const nombre  = `Remisión ${acuerdo.ref}.pdf`
    pdf.save( nombre );
  }

  async function configurarPDF() : Promise<void>
  {
    return new Promise(async (resolver) =>{

      const { Candara }     = await import("src/assets/fonts/Candara.js")

      doc.area              = acuerdo.tercero.area 
      doc.fontBase          = "Candara"
      pdf.addFileToVFS      ("Candara.ttf",      Candara) // "Identity-H"
      pdf.addFont           ("Candara.ttf",      doc.fontBase,  "normal" )
      pdf.setFont           (doc.fontBase,      "normal")

      resolver() 
    })
  }


  function  generarCabezote()
  {
    pdf.addImage        ( doc.imgLogo,   "PNG", 10, doc.y + 8, 110, 24)
    doc.y               += 20
     //*                 ////////////////////////////////////////////////////////////////////// Logo
    //pdf.addImage       (LOGO, 'GIF', MARGEN_LEFT, doc.y - 6)
    //*                 ////////////////////////////////////////////////////////////////////// Textos Cabezote 
    doc.setFont         ( 12, 20 )
    pdf.text            ("Grupo Escom SAS", doc.anchoMitad - 28,  doc.y,  doc.negrita("center") )
    pdf.text            ("900.419.912-7",   doc.anchoMitad + 12,  doc.y)
    //pdf.text          ("|",               doc.anchoMitad,       doc.y,  { align: "center"})
    pdf.text            ("REMISIÓN #",      doc.margenDerX - 8,   doc.y,  doc.negrita("right"))
    doc.y               += 10
    doc.setFont         ( 10, 30 )
    pdf.text            ("CRR 49A # 85 - 05 - Bogotá – PBX 601 813 7505", doc.anchoMitad, doc.y, { align: "center"} )
    pdf.text            (acuerdo.ref, doc.margenDerX - 3,   doc.y,  { align: "right"})

    //*                 ////////////////////////////////////////////////////////////////////// Rectangulo 
    doc.y               += 8
    const altoRect      = 150
    pdf.roundedRect     (doc.margenIzq, doc.y, doc.posXMargenDerecha, altoRect, 2, 2 )


    //*                 ////////////////////////////////////////////////////////////////////// Cliente 
    doc.margen1         = doc.margenIzq + 6
    doc.margen2         = doc.margenIzq + 60
    doc.y               += 12
    doc.setFont         ( 10, 0 )
    pdf.text            ("CLIENTE:", doc.margen1, doc.y, { align: "left", renderingMode: 'fillThenStroke' } )

    const cliente       = "Cliente con nombre muy 1 largo very largo vergo 5 la sadf adsf sds ds d dsf sdf fsdf sd dsfsdf ds asdf sd dfdsf "//acuerdo.tercero.nombre
    const clienteSplit  = pdf.splitTextToSize(cliente, 360)
    pdf.setFontSize    ( SIZE_FONT(cliente) ) 
    pdf.text           ( clienteSplit, doc.margen2, doc.y, { align: "left", renderingMode: 'fillThenStroke' } )

    //*                 ////////////////////////////////////////////////////////////////////// DIRECCIÓN 
    doc.y               += getEspaciado( clienteSplit )
    pdf.setFontSize     (10)
    pdf.text            ("DIRECCIÓN:", doc.margen1, doc.y, { align: "left", renderingMode: 'fillThenStroke' })

    
    const direccion     = acuerdo.contactoEntrega.municipio.label + " " + acuerdo.contactoEntrega.direccion + " asdf sdf asdf sd adsf sdfd fsdf ds  asdfasdf asdf sadf asdf sdf dfsdf  safd asdf asdff"
    const dirSplit      = pdf.splitTextToSize(direccion, 360 )
    pdf.setFontSize     ( SIZE_FONT(direccion) ) 
    pdf.text            ( dirSplit, doc.margen2, doc.y )

    //*                 ////////////////////////////////////////////////////////////////////// INDICACIONES
    doc.y               += getEspaciado( dirSplit )
    
    pdf.setFontSize     (10)
    pdf.text            ("INDICACIONES:", doc.margen1, doc.y, { align: "left", renderingMode: 'fillThenStroke' })
      
    const indicacion    = acuerdo.contactoEntrega.nota
    const indicaSplit   = pdf.splitTextToSize(indicacion, WIDTH_BOX_FONT( indicacion ) )
    pdf.setFontSize     ( SIZE_FONT( indicacion ) ) 
    pdf.text            ( indicaSplit, doc.margen2, doc.y )

    doc.y               += getEspaciado( indicaSplit )

    //*                 ////////////////////////////////////////////////////////////////////// Cliente 
/*     doc.y               += 12
    doc.setFont         ( 11, 0 )
    let dato            = "CLIENTE:\nDIRECCIÓN:" + " ".repeat(130) + "ELABORADO POR: " + usuario.value.nombreCompleto
    pdf.text            (dato, doc.margenIzq + 8, doc.y, doc.negrita("left", 1.8))

    dato                = `${acuerdo.tercero.nombre}\n${acuerdo.tercero.municipio.label} - ${acuerdo.tercero.direccion}`
    pdf.text            ( dato, doc.margenIzq + 70, doc.y, { lineHeightFactor: 1.8 } ) */

    //*                 ////////////////////////////////////////////////////////////////////// Linea
    /*
    doc.y               += 20
    pdf.line            (doc.margenIzq, doc.y, doc.posXMargenDerecha + 10, doc.y)
    
    //*                 ////////////////////////////////////////////////////////////////////// Otros datos
    doc.y               += 10
    doc.setFont         ( 11, 0 )
    pdf.text            ("TELÉFONO",  doc.anchoMitad - 180, doc.y, doc.negrita("center") )
    dato                = acuerdo.tercero.documento.tipo.label
    pdf.text            (dato,        doc.anchoMitad - 90,  doc.y, doc.negrita("center") )
    pdf.text            ("ASESOR",    doc.anchoMitad,       doc.y, doc.negrita("center") )
    pdf.text            ("FECHA",     doc.anchoMitad + 90,  doc.y, doc.negrita("center") )
    pdf.text            ("# ORDEN",   doc.anchoMitad + 180, doc.y, doc.negrita("center") )

    doc.y               += 10
    dato                = acuerdo.tercero.telefono
    pdf.text            (dato,  doc.anchoMitad - 180, doc.y, { align: "center" } )
    dato                = acuerdo.tercero.numeroDocumento
    pdf.text            (dato,  doc.anchoMitad - 90,  doc.y, { align: "center" } )
    dato                = acuerdo.comercial.nombre
    pdf.text            (dato,  doc.anchoMitad,       doc.y, { align: "center" } )
    dato                = anticipo.value.fechaPagoString
    pdf.text            (dato,  doc.anchoMitad + 90,  doc.y, { align: "center" } )
    dato                = acuerdo.refCliente
    pdf.text            (dato,  doc.anchoMitad + 180, doc.y, { align: "center" } )
    */
  }


  function generarCuerpo()
  {
    doc.y               += 10
    const valor         = 0 //formatoPrecio( anticipo.value.valor, 'decimales-no')
    // * //////////////////////////////////////////////// Tabla
    autoTable(pdf, {
      head: [['Cuenta', 'Descripción', 'Tercero', 'Debito', 'Crédito' ]],
      startY: doc.y,
      theme: "grid",
      margin: { left: doc.margenIzq, right: doc.margenDer, bottom: 0 },
      headStyles: { lineWidth: 0.5, lineColor: 100, fillColor: [255, 255, 255], textColor: [20,20,20], fontStyle: 'bold', halign: 'center' },
      columnStyles: {
          0: { halign:    'center', fontStyle: 'bold'  },
          1: { halign:    'left'    },
          2: { halign:    'center'  },
          3: { halign:    'center'  },
          4: { halign:    'center'  },
          5: { halign:    'center'  },
      },
      body: [
        [ '11050501',
          "asdfasdfasdfasd",
          acuerdo.tercero.numeroDocumento,
          valor,
          '$ 0'
        ],
        [ '13050501',
          'Pago total a documento Factura ' + acuerdo.ref,
          acuerdo.tercero.numeroDocumento,
          '$ 0',
          valor,
        ],
        [ '',
          '',
          'TOTAL:',
          valor,
          valor,
        ],
      ],
    })
  }

  //* /////////////////////////////////////////////////////////////////////////////////////// Generar pie de pagina
  function generarPie()
  {
    doc.setFont        ( 11, 0 )
    doc.y               += 78
    pdf.text           ("Observaciones:", doc.margenIzq + 10, doc.y, doc.negrita('left'))
    doc.y               += 70
    pdf.line           (doc.margenIzq + 10, doc.y, doc.anchoMitad - 16, doc.y)
    pdf.line           (doc.anchoMitad, doc.y, doc.posXMargenDerecha - 20, doc.y)
    doc.y               += 10
    pdf.text           ("FIRMA AUTORIZADA\nGrupo Escom SAS",  doc.anchoMitad - 110, doc.y, { align: "center" })
    pdf.text           ("NOMBRE Y FIRMA DE QUIEN RECIBE\nCC Y CARGO",     doc.anchoMitad + 90, doc.y, { align: "center" })
  }

  function getEspaciado( arreglo : any[] ) : number {
    return 12 + ( arreglo.length * 3 )
  }
  
  function WIDTH_BOX_FONT(texto : string) : number
  {
    let largo           = texto.length
    let size            = 0

    if(largo            <= 45)
      size              = 180
    else if(largo       <= 60)
      size              = 360
    else if(largo       <= 80)
      size              = 360
    else if(largo       <= 110)
      size              = 360
    else
      size              = 390

    return size
  }

  function SIZE_FONT(texto : string) : number
  {
    let largo           = texto.length
    let size            = 0
  
    if(largo            <= 45)
      size              = 14
    else if(largo       <= 60)
      size              = 13
    else if(largo       <= 80)
      size              = 12
    else if(largo       <= 150)
      size              = 10
    else
      size              = 9
  
    return size  
  }
    
  return {
    getRemisionPDF,
    saveRemisionPDF
  }
}