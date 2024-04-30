
import {  UtilPDF,
          IUtilPDF,
          IInicioPDF        } from 'src/composables/UtilPDF';
import {  Acuerdo, IAcuerdo } from "src/areas/acuerdos/models/Acuerdo"
import {  ILineaLite        } from "src/areas/acuerdos/models/LineaAcuerdo"
import {  ToolDate, Format  } from "src/composables/useTools"
import {  jsPDF             } from "jspdf"
import    autoTable           from 'jspdf-autotable'

//* /////////////////////////////////////////////////////////////////////////////////// Store
import {  storeToRefs       } from 'pinia'                            
import {  useStoreUser      } from 'stores/user'  

export interface IParams  {
  lineas                  : ILineaLite[]
  direccion               : string
  fechaInicio             : Date  
  fechaEntrega            : Date
  conTotal                : boolean
  dosHojas                : boolean
}

export function useActaPDF()
{
  const { usuario           } = storeToRefs( useStoreUser() )  
  const pdf         : jsPDF       = new jsPDF('p','px')
  const setup       : IInicioPDF  = { ancho       : 447,
                                      alto        : 631,
                                      margenIzq   : 10,
                                      margenDer   : 10,
                                      pie         : 8,
                                      path        : "/images/pdf/",
                                      pdf         : pdf,
                                    }
  const doc         : IUtilPDF    = new UtilPDF( setup )
  let pedido        : IAcuerdo    = new Acuerdo()
  let datos         : IParams     = {
    lineas                  : [],
    direccion               : "",
    fechaInicio             : new Date(),
    fechaEntrega            : new Date(),
    conTotal                : true,
    dosHojas                : false,
  }  
  


  async function getActaPDF( acuerdoEntrega : IAcuerdo, parametros : IParams ) : Promise<string>
  {
    pedido                    = acuerdoEntrega
    datos                     = Object.assign( {}, parametros )

    doc.limpiarPDF()
    await configurarPDF()
    const copias              = 1
    for(let copia = 1; copia <= copias; copia++)
    {
      if(datos.dosHojas && copia == 2){
        doc.setNewPage()
        doc.y = 0
      }
      else
        doc.y                   = copia === 1 ? 0 : doc.altoMitad

      generarCabezote()
      generarCuerpo()
      generarFirmas()
      generarEncuesta()
    }
    
    const pdf_blob  = pdf.output('bloburi')
    const pdf_final = pdf_blob.toString()
    return pdf_final
  }
  
  
  function saveActaPDF()
  {    
    const nombre  = `Acta de entrega ${pedido.ref}.pdf`
    pdf.save( nombre );
  }

  async function configurarPDF() : Promise<void>
  {
    return new Promise(async (resolver) =>{

      const { Candara }     = await import("src/assets/fonts/Candara.js")

      doc.area              = pedido.tercero.area 
      doc.fontBase          = "Candara"
      pdf.addFileToVFS      ("Candara.ttf",      Candara) // "Identity-H"
      pdf.addFont           ("Candara.ttf",      doc.fontBase,  "normal" )
      pdf.setFont           (doc.fontBase,      "normal")

      resolver() 
    })
  }

  function generarCabezoteLogo()
  {
    //*                 ////////////////////////////////////////////////////////////////////// Logo    
    pdf.addImage        ( doc.imgLogo,   "PNG", 10, doc.y + 8, 110, 24)
    doc.y               += 20

    //*                 ////////////////////////////////////////////////////////////////////// Textos Cabezote 
    doc.setFont         ( 12, 20 )
    
    pdf.text            ("Grupo Escom SAS", doc.anchoMitad - 28,  doc.y,  doc.negrita("center") )
    pdf.text            ("900.419.912-7",   doc.anchoMitad + 12,  doc.y)

    
    pdf.text            ("Acta de entrega",      doc.margenDerX - 12,   doc.y + 4,  doc.negrita("right"))
    doc.y               += 10
    doc.setFont         ( 10, 30 )
    pdf.text            ("CRR 49A # 85 - 05 - Bogotá – PBX 601 813 7505", doc.anchoMitad, doc.y, { align: "center"} )

    const refSplit      = pdf.splitTextToSize(`${pedido.refPedido}\n${pedido.ref}` , 360)
    pdf.text            (refSplit,       doc.margenDerX - 40,   doc.y-6,  { align: "center"})    
    doc.headAlto        = 30
  }


  function generarCabezote()
  {
    generarCabezoteLogo()

    //*                 ////////////////////////////////////////////////////////////////////// Rectangulo 
    doc.y               += 8
    const altoRect      = 48
    pdf.roundedRect     (doc.margenIzq, doc.y, doc.posXMargenDerecha, altoRect, 2, 2 )

    //*                 ////////////////////////////////////////////////////////////////////// Cliente
    doc.margen1         = doc.margenIzq + 6
    doc.margen2         = doc.margenIzq + 60
    doc.y               += 12
    doc.setFont         ( 10, 0 )
    const titulo        = "CONTRATANTE:"
    pdf.text            (titulo, doc.margen1, doc.y, { align: "left", renderingMode: 'fillThenStroke' } )

    const recibe       = pedido.tercero.nombre
    const recibeSplit  = pdf.splitTextToSize(recibe, 360)
    pdf.setFontSize    ( SIZE_FONT(recibe) ) 
    pdf.text           ( recibeSplit, doc.margen2, doc.y, { align: "left", renderingMode: 'fillThenStroke' } )

    //*                 ////////////////////////////////////////////////////////////////////// Documento 
    doc.y               += getEspaciado( recibeSplit )
    pdf.setFontSize     (10)
    pdf.text            (pedido.tercero.documento.tipo.sigla+":   ", doc.margen1, doc.y, { align: "left", renderingMode: 'fillThenStroke' })
    pdf.text            ( pedido.tercero.numeroDocumento, doc.margen2, doc.y )    

    //*                 ////////////////////////////////////////////////////////////////////// DIRECCIÓN 
    doc.y               += 13   
    pdf.setFontSize     (10)
    pdf.text            ("DIRECCIÓN:", doc.margen1, doc.y, { align: "left", renderingMode: 'fillThenStroke' })

    //pdf.html("<b>hola</b>sdsd", {x:20, y:75, jsPDF: pdf});
    
    const direccion     = datos.direccion
    const dirSplit      = pdf.splitTextToSize(direccion, 360 )
    pdf.setFontSize     ( 10 ) 
    pdf.text            ( dirSplit, doc.margen2, doc.y )

   
    //*                 ////////////////////////////////////////////////////////////////////// Tabla datos
      doc.y               += 12
    const head          = [ 'TELÉFONO',                            
                            'ASESOR',
                            'ELABORO',
                            'FECHA INICIO',
                            'FECHA ENTREGA',
                          ] 
    const body          = [ pedido.tercero.telefono,                            
                            pedido.comercial.nombreApellido,
                            usuario.value.nombreApellido, 
                            ToolDate.fechaCorta( datos.fechaInicio ),
                            ToolDate.fechaCorta( datos.fechaEntrega ),
                          ]
    if(!!pedido.refCliente)
    {
      head.splice(head.length, 0, 'ORDEN')
      body.splice(head.length, 0, pedido.refCliente)
    }
                          
    if(datos.conTotal)
    {
      head.splice(head.length, 0, 'TOTAL')
      body.splice(head.length, 0, Format.precio(pedido.totalConDescu, "decimales-si"))
    }
                        
    autoTable(pdf, {      
      startY:     doc.y, tableLineColor:  50, tableLineWidth: 0.5,
      theme:      "plain",
      styles:     { halign: 'center', cellPadding: 1, lineWidth: 0,  lineColor: 255, fillColor: 255, textColor: 20, fontSize: 9 },
      margin:     { left: doc.margenIzq, right: doc.margenDer, bottom: 0 },
      headStyles: { fontStyle: 'bold', cellPadding: { top: 3, bottom: 0 }},
      head:       [ head ],
      body:       [ body ],
    }) 
  }

  function generarCuerpo()
  {
    doc.y         += 20

    autoTable(pdf, {
      startY:     doc.y, tableLineColor:  50, tableLineWidth: 0.5,
      theme:      "plain",      
      styles:     { halign: 'center', 
                    cellPadding: { left: 0, top: 0, bottom: 6, right: 0 }, lineWidth: 0,  lineColor: 255, fillColor: false, textColor: 20, fontSize: 9 },
      margin:     { left: doc.margenIzq, right: doc.margenDer, bottom: 0, top: 40  },
      headStyles: { fontStyle: 'bold', cellPadding: { top: 4, bottom: 8 } },
      head:       [ ["PRODUCTO", 'CANTIDAD', 'RECIBIDO' ]],
      body:       [ ...datos.lineas.map( l => [
                                          `${l.ref} - ${l.nombre}`,                                          
                                          `${l.qty} ${l.unidad}`,
                                          ''
                                        ]
                                  )
                  ],
      columnStyles: {
        0: { halign: 'left', cellPadding: { left: 4 } },  
        1: { cellWidth: 50 },
        2: { cellWidth: 38 }
      },
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 2) {
          doc.setFont       ( 10, 30 )
          const box = 8
          pdf.roundedRect     (doc.margenDerX - 26, data.cell.y, box, box, 2, 2 )
        }
      },
      willDrawPage : (data) => {
        if(data.pageCount == 1) return     
        doc.y = 0
        generarCabezoteLogo()

        doc.hojas   = data.pageCount 
        doc.hojaNow = data.pageNumber
        pdf.setPage( data.pageNumber )
      }
    })
  }

  function generarEncuesta()
  {
    const alto                = 150
    if( doc.seNecesitaNuevaHoja( doc.y, alto ) ){
      doc.y                   = crearNuevaHoja()
    }

    doc.y         += 20
    const obser   = "ENCUESTA DE INSTALACIÓN/ENTREGA"
    doc.setFont   ( 11, 80 )
    pdf.text      ( obser, doc.anchoMitad, doc.y, doc.negrita('center'))        

    const u1A5    = "1      2      3      4      5"
    const ebm     = "EXCELENTE     BUENO     MALO "
    doc.y         += 10

    autoTable(pdf, {
      startY:     doc.y, tableLineColor:  50, tableLineWidth: 0.5,
      theme:      "plain",      
      styles:     { halign: 'center', 
                    cellPadding: { left: 0, top: 0, bottom: 6, right: 0 }, lineWidth: 0,  lineColor: 255, fillColor: false, textColor: 20, fontSize: 9 },
      margin:     { left: doc.margenIzq, right: doc.margenDer, bottom: 0 },
      headStyles: { fontStyle: 'bold', cellPadding: { top: 4, bottom: 8 } },
      head:       [ ["PREGUNTA", 'RESPUESTA']],
      body:       [ ["1. ¿Como calificaría nuestra atención de 1 a 5?", u1A5],
                    ["2. ¿Como calificaría nuestros productos de 1 a 5?", u1A5],
                    ["3. ¿Cómo se sintió atendido por nuestro personal comercial?", ebm],
                    ["4. ¿Cómo se sintió atendido por nuestro personal entrega/instalación?", ebm],
                    ["5. ¿Cómo considera la calidad  del producto/proyecto entregado?", ebm],
                    ["6. Los tiempos de ejecución y entrega del producto/proyecto fueron...", ebm],                      
                  ],
      columnStyles: {
        0: { halign: 'left', cellPadding: { left: 4 } },
      }
    })
  }


  //* /////////////////////////////////////////////////////////////////////////////////////// Generar pie de pagina
  function generarFirmas()
  {
    if( doc.hojaNow     > 1 )
      doc.y             = doc.alto - 250
    else
      doc.y             += ((pedido.productos.filter( p => !p.esTituloOsubTotal).length * 0.7) * 19) + 70
    
    doc.setFont         ( 11, 0 )    
    pdf.line            ( doc.margenIzq + 10, doc.y, doc.anchoMitad - 16, doc.y)    
    doc.y               += 10
    const firmaNuestra  = "FIRMA AUTORIZADA\nGrupo Escom SAS"
    pdf.text            ( firmaNuestra,  doc.anchoMitad - 110, doc.y, { align: "center" })


    doc.y               -= 30
    const espacio       = 18
    doc.y               += espacio
    const xLinea        = doc.anchoMitad + 60
    pdf.line            ( xLinea, doc.y, doc.posXMargenDerecha - 20, doc.y)
    pdf.text            ( "Sello: ", xLinea, doc.y, { align: "right" })
    doc.y               += espacio
    pdf.line            ( xLinea, doc.y, doc.posXMargenDerecha - 20, doc.y)
    pdf.text            ( "Recibida por: ", xLinea, doc.y, { align: "right" })
    doc.y               += espacio
    pdf.line            ( xLinea, doc.y, doc.posXMargenDerecha - 20, doc.y)
    pdf.text            ( "Documento: ", xLinea, doc.y, { align: "right" })
    doc.y               += espacio
    pdf.line            ( xLinea, doc.y, doc.posXMargenDerecha - 20, doc.y)
    pdf.text            ( "Fecha: ", xLinea, doc.y, { align: "right" })
    //pdf.text            ( "NOMBRE Y FIRMA DE QUIEN RECIBE\nCC Y CARGO",     doc.a nchoMitad + 90, doc.y, { align: "center" })
    doc.y               += 22
  }

  function crearNuevaHoja() : number
  {
    doc.setNewPage()
    doc.y         = 0
    generarCabezoteLogo()

    return doc.headAlto
  }

  function getEspaciado( arreglo : any[] ) : number {
    return 12 + ( arreglo.length * 2.5 )
  }

  function SIZE_FONT(texto : string) : number
  {
    let largo           = texto.length
    let size            = 0
  
    if(largo            <= 45)
      size              = 12
    else if(largo       <= 60)
      size              = 12
    else if(largo       <= 80)
      size              = 11
    else if(largo       <= 150)
      size              = 10
    else
      size              = 9
  
    return size  
  }
    
  return {
    getActaPDF,
    saveActaPDF
  }
}