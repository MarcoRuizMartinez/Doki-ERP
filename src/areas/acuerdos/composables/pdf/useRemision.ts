
import {  UtilPDF,
          IUtilPDF,
          IInicioPDF        } from 'src/composables/UtilPDF';
import {  Acuerdo, IAcuerdo } from "src/areas/acuerdos/models/Acuerdo"
import {  ILineaLite        } from "src/areas/acuerdos/models/LineaAcuerdo"
import {  ToolDate          } from "src/composables/useTools"
import {  jsPDF             } from "jspdf"
import    autoTable           from 'jspdf-autotable'

//* /////////////////////////////////////////////////////////////////////////////////// Store
import {  storeToRefs       } from 'pinia'                            
import {  useStoreUser      } from 'stores/user'  

export interface IParams  {
  lineas                  : ILineaLite[]
  direccion               : string
  indicaciones            : string
  fechaEntrega            : Date
  conDescripcion          : boolean
  dosHojas                : boolean
  metodo                  : string
  paquetes                : number
  paraTransportadora      : boolean
  transportadora          : string
  sinDatosNuestros        : boolean
}

export function useRemisionPDF()
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
  let acuerdo       : IAcuerdo    = new Acuerdo()
  let datos         : IParams     = {
    lineas                  : [],
    direccion               : "",
    indicaciones            : "",
    fechaEntrega            : new Date(),
    conDescripcion          : false,
    dosHojas                : false,
    metodo                  : "",
    paquetes                : 0,
    paraTransportadora      : false,
    transportadora          : "",
    sinDatosNuestros        : false,
  }  
  
  
  async function getRemisionPDF( acuerdoEntrega : IAcuerdo, parametros : IParams ) : Promise<string>
  {
    acuerdo                   = acuerdoEntrega
    datos                     = Object.assign( {}, parametros )

    if(!!acuerdoEntrega.contactoEntrega.id)
      datos.indicaciones      = `${acuerdoEntrega.contactoEntrega.nombreCompleto} ${acuerdoEntrega.contactoEntrega.telefono}` 

    if(!!parametros.indicaciones)
      datos.indicaciones      += ` - ${parametros.indicaciones}`

    doc.limpiarPDF()
    await configurarPDF()
    for(let copia = 1; copia <= 2; copia++)
    {
      if(datos.dosHojas && copia == 2){
        doc.setNewPage()
        doc.y = 0
      }
      else
        doc.y                   = copia === 1 ? 0 : doc.altoMitad

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
    //*                 ////////////////////////////////////////////////////////////////////// Logo
    if(!datos.sinDatosNuestros)
      pdf.addImage        ( doc.imgLogo,   "PNG", 10, doc.y + 8, 110, 24)
    doc.y               += 20

    //*                 ////////////////////////////////////////////////////////////////////// Textos Cabezote 
    doc.setFont         ( 12, 20 )
    if(!datos.sinDatosNuestros)
    {
      pdf.text          ("Grupo Escom SAS", doc.anchoMitad - 28,  doc.y,  doc.negrita("center") )
      pdf.text          ("900.419.912-7",   doc.anchoMitad + 12,  doc.y)

    }

    pdf.text            ("REMISIÓN #",      doc.margenDerX - 12,   doc.y-4,  doc.negrita("right"))
    doc.y               += 10
    if(!datos.sinDatosNuestros){
      doc.setFont       ( 10, 30 )
      pdf.text          ("CRR 49A # 85 - 05 - Bogotá – PBX 601 813 7505", doc.anchoMitad, doc.y, { align: "center"} )

    }
    
    const refSplit      = pdf.splitTextToSize(`${acuerdo.refPedido}\n${acuerdo.ref}` , 360)
    pdf.text            (refSplit,       doc.margenDerX - 40,   doc.y-6,  { align: "center"})    

    //*                 ////////////////////////////////////////////////////////////////////// Rectangulo 
    doc.y               += 8
    const altoRect      = 86
    pdf.roundedRect     (doc.margenIzq, doc.y, doc.posXMargenDerecha, altoRect, 2, 2 )

    //*                 ////////////////////////////////////////////////////////////////////// Cliente
    doc.margen1         = doc.margenIzq + 6
    doc.margen2         = doc.margenIzq + 60
    doc.y               += 12
    doc.setFont         ( 10, 0 )
    const titulo        = datos.paraTransportadora ? "RECIBE:" : "CLIENTE:"
    pdf.text            (titulo, doc.margen1, doc.y, { align: "left", renderingMode: 'fillThenStroke' } )

    const recibe       = datos.paraTransportadora ? datos.transportadora : acuerdo.tercero.nombre
    const recibeSplit  = pdf.splitTextToSize(recibe, 360)
    pdf.setFontSize    ( SIZE_FONT(recibe) ) 
    pdf.text           ( recibeSplit, doc.margen2, doc.y, { align: "left", renderingMode: 'fillThenStroke' } )

    //*                 ////////////////////////////////////////////////////////////////////// DIRECCIÓN 
    doc.y               += getEspaciado( recibeSplit )
    pdf.setFontSize     (10)
    pdf.text            ("DIRECCIÓN:", doc.margen1, doc.y, { align: "left", renderingMode: 'fillThenStroke' })

    
    const direccion     = acuerdo.contactoEntrega.municipio.label + " " + datos.direccion
    const dirSplit      = pdf.splitTextToSize(direccion, 360 )
    pdf.setFontSize     ( SIZE_FONT(direccion) ) 
    pdf.text            ( dirSplit, doc.margen2, doc.y )

    //*                 ////////////////////////////////////////////////////////////////////// INDICACIONES
    doc.y               += getEspaciado( dirSplit )
    
    pdf.setFontSize     (10)
    pdf.text            ("INDICACIONES:", doc.margen1, doc.y, { align: "left", renderingMode: 'fillThenStroke' })
      
    
    const indicaSplit   = pdf.splitTextToSize( datos.indicaciones, WIDTH_BOX_FONT( datos.indicaciones ) )
    pdf.setFontSize     ( SIZE_FONT( datos.indicaciones ) ) 
    pdf.text            ( indicaSplit, doc.margen2, doc.y )

    doc.y               += getEspaciado( indicaSplit ) 

    //*                 ////////////////////////////////////////////////////////////////////// Tabla datos
    //['TELÉFONO', acuerdo.tercero.documento.tipo.label, 'ASESOR', "ELABORO", 'ORDEN', 'MÉTODO', 'FECHA' ] 
    // o, 
    const head          = ['TELÉFONO', 'ORDEN', 'MÉTODO', 'FECHA' ] 
    const body          = [ acuerdo.tercero.telefono, acuerdo.refCliente, datos.metodo, ToolDate.fechaCorta( datos.fechaEntrega ) ]
    if(!datos.sinDatosNuestros)
    {
      head.splice(1, 0, 'ASESOR', "ELABORO")
      body.splice(1, 0, acuerdo.comercial.nombreCompleto, usuario.value.nombreCompleto)
    }

    if(!datos.paraTransportadora)
    {
      head.splice(1, 0, acuerdo.tercero.documento.tipo.sigla)
      body.splice(1, 0, acuerdo.tercero.numeroDocumento )
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
      styles:     { halign: 'center',  cellPadding: { left: 0, top: 0, bottom: 3, right: 0 }, lineWidth: 0,  lineColor: 255, fillColor: 255, textColor: 20, fontSize: 9 },
      margin:     { left: doc.margenIzq, right: doc.margenDer, bottom: 0 },
      headStyles: { fontStyle: 'bold', cellPadding: { top: 4, bottom: 3 } },
      head:       [ ["PRODUCTO", 'CANT', 'ESTADO' ]],
      body:       [ ...datos.lineas.map( l => [
                                          `${l.ref} - ${l.nombre}` + ( l.descripcionOn && datos.conDescripcion && !!l.descripcion ? " ~ " + l.descripcion : '' ),
                                          `${l.qty} de ${l.qtyTotal}`,
                                          l.estado
                                        ]
                                  )
                  ],
      columnStyles: { 0: { halign: 'left', cellPadding: { left: 4 } }, 1: { cellWidth: 38 }, 2: { cellWidth: 38 } },
    })        
  }

  //* /////////////////////////////////////////////////////////////////////////////////////// Generar pie de pagina
  function generarPie()
  {
    if( datos.dosHojas )    
      doc.y             = doc.alto - 60
    else
      doc.y             += 140
    doc.setFont         ( 11, 0 )    
    pdf.line            ( doc.margenIzq + 10, doc.y, doc.anchoMitad - 16, doc.y)
    pdf.line            ( doc.anchoMitad, doc.y, doc.posXMargenDerecha - 20, doc.y)    
    doc.y               += 10
    let firmaNuestra    = "FIRMA AUTORIZADA"
        firmaNuestra    += datos.sinDatosNuestros ? "" : "\nGrupo Escom SAS"
    pdf.text            ( firmaNuestra,  doc.anchoMitad - 110, doc.y, { align: "center" })
    pdf.text            ( "NOMBRE Y FIRMA DE QUIEN RECIBE\nCC Y CARGO",     doc.anchoMitad + 90, doc.y, { align: "center" })
    doc.y               += 22
    let obser           = "NOTA: DECLARO QUE HE RECIBIDO LA MERCANCÍA AQUÍ DESCRITA EN PERFECTAS CONDICIONES"
    if(!!datos.paquetes)
      obser             += ` EN ${datos.paquetes} PAQUETES`
    doc.setFont         ( 11, 80 )
    pdf.text            ( obser, doc.anchoMitad, doc.y, doc.negrita('center'))    
  }

  function getEspaciado( arreglo : any[] ) : number {
    return 12 + ( arreglo.length * 2.5 )
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
      size              = 400

    return size
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
    getRemisionPDF,
    saveRemisionPDF
  }
}