
import {  UtilPDF,
          IUtilPDF,
          IInicioPDF        } from 'src/useSimpleOk/UtilPDF';
import {  useQuasar,
          QSpinnerGears     } from "quasar"
import {  formatoPrecio     } from "src/useSimpleOk/useTools"
import {  jsPDF             } from "jspdf"
import    autoTable           from 'jspdf-autotable'
//* /////////////////////////////////////////////////////////////////////////////////// Store
import {  storeToRefs       } from 'pinia'                            
import {  useStoreAcuerdo   } from 'stores/acuerdo'
import {  useStoreUser      } from 'src/stores/user'  

export function useReciboCajaPDF()
{
  const { notify            } = useQuasar()
  const { acuerdo, anticipo } = storeToRefs( useStoreAcuerdo() )
  const { usuario           } = storeToRefs( useStoreUser() )  
  let aviso     : Function
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

  async function getReciboCajaPDF() : Promise<string>
  {
          limpiar()
          mostrarAviso()
          //verificarDatosCorrectos()
    await configurarPDF()
    for(let copia = 1; copia <= 2; copia++)
    {
      doc.y = copia === 1 ? 0 : doc.altoMitad
      generarCabezote()
      generarCuerpo()
      generarPie()
      //this.generarCuerpo()
      //this.generarPie(copia)
    }
/* 
          generarCabezotePortada()
          generarTitulo()
    await generarCuerpo()
          generarSubTotales()
          generarTotales()
          generarNota()
    await generarCondiciones()
     */
          ocultarAviso()
    
    const pdf_blob  = pdf.output('bloburi')
    const pdf_final = pdf_blob.toString()//.replace("dolibarr.mublex.com/", "dolibarr.mublex.com/ok/")
    return pdf_final
  }

  function limpiar()
  {
    doc.limpiarPDF()
    //autoTable(pdf,  { head: [['']] })
  }

  function saveReciboCajaPDF()
  {    
    const nombre  = `Recibo de caja ${acuerdo.value.ref}.pdf`
    pdf.save( nombre );
  }

  async function configurarPDF() : Promise<void>
  {
    return new Promise(async (resolver) =>{

      const { Candara }     = await import("src/assets/fonts/Candara.js")

      doc.area              = acuerdo.value.tercero.area 
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
    pdf.text            ("RECIBO CAJA #",   doc.margenDerX - 8,   doc.y,  doc.negrita("right"))
    doc.y               += 10
    doc.setFont         ( 10, 30 )
    pdf.text            ("CRR 49A # 85 - 05 - Bogotá – PBX 601 813 7505", doc.anchoMitad, doc.y, { align: "center"} )
    pdf.text            (acuerdo.value.ref, doc.margenDerX - 3,   doc.y,  { align: "right"})

    //*                 ////////////////////////////////////////////////////////////////////// Rectangulo 
    doc.y               += 8
    const altoRect      = 150
    pdf.roundedRect     (doc.margenIzq, doc.y, doc.posXMargenDerecha, altoRect, 2, 2 )

    //*                 ////////////////////////////////////////////////////////////////////// Cliente 
    doc.y               += 12
    doc.setFont         ( 11, 0 )
    let dato            = "RECIBIMOS DE:\nDIRECCIÓN:" + " ".repeat(130) + "ELABORADO POR: " + usuario.value.nombreCompleto
    pdf.text            (dato, doc.margenIzq + 8, doc.y, doc.negrita("left", 1.8))

    dato                = `${acuerdo.value.tercero.nombre}\n${acuerdo.value.tercero.municipio.label} - ${acuerdo.value.tercero.direccion}`
    pdf.text            ( dato, doc.margenIzq + 70, doc.y, { lineHeightFactor: 1.8 } )

    //*                 ////////////////////////////////////////////////////////////////////// Linea
    doc.y               += 20
    pdf.line            (doc.margenIzq, doc.y, doc.posXMargenDerecha + 10, doc.y)
    
    //*                 ////////////////////////////////////////////////////////////////////// Otros datos
    doc.y               += 10
    doc.setFont         ( 11, 0 )
    pdf.text            ("TELÉFONO",  doc.anchoMitad - 180, doc.y, doc.negrita("center") )
    dato                = acuerdo.value.tercero.documento.tipo.label
    pdf.text            (dato,        doc.anchoMitad - 90,  doc.y, doc.negrita("center") )
    pdf.text            ("ASESOR",    doc.anchoMitad,       doc.y, doc.negrita("center") )
    pdf.text            ("FECHA",     doc.anchoMitad + 90,  doc.y, doc.negrita("center") )
    pdf.text            ("# ORDEN",   doc.anchoMitad + 180, doc.y, doc.negrita("center") )

    doc.y               += 10
    dato                = acuerdo.value.tercero.telefono
    pdf.text            (dato,  doc.anchoMitad - 180, doc.y, { align: "center" } )
    dato                = acuerdo.value.tercero.numeroDocumento
    pdf.text            (dato,  doc.anchoMitad - 90,  doc.y, { align: "center" } )
    dato                = acuerdo.value.comercial.nombre
    pdf.text            (dato,  doc.anchoMitad,       doc.y, { align: "center" } )
    dato                = anticipo.value.fechaPagoString
    pdf.text            (dato,  doc.anchoMitad + 90,  doc.y, { align: "center" } )
    dato                = acuerdo.value.refCliente
    pdf.text            (dato,  doc.anchoMitad + 180, doc.y, { align: "center" } )
  }


  function generarCuerpo()
  {
    doc.y               += 10
    const valor         = formatoPrecio( anticipo.value.valor, 'decimales-no')
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
          anticipo.value.cuenta.label,
          acuerdo.value.tercero.numeroDocumento,
          valor,
          '$ 0'
        ],
        [ '13050501',
          'Pago total a documento Factura ' + acuerdo.value.ref,
          acuerdo.value.tercero.numeroDocumento,
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

  function mostrarAviso()
  {
    aviso     = notify({
      group:    false, // required to be updatable
      timeout:  0,   // we want to be in control when it gets dismissed
      spinner:  QSpinnerGears,
      message:  'Generando PDF...',
    })
  }

  function ocultarAviso()
  {
    setTimeout(() => {
      aviso({
        icon:    'mdi-check', // we add an icon
        spinner: false, // we reset the spinner setting so the icon can be displayed
        message: 'PDF generado!',
        timeout: 2000 // we will timeout it in 2.5s
      })
    }, 800);
  }

  return {
    getReciboCajaPDF,
    saveReciboCajaPDF
  }
}