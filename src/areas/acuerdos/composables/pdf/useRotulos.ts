
import {  UtilPDF,
          IUtilPDF,
          IInicioPDF        } from 'src/composables/UtilPDF';
import {  IAcuerdo          } from "src/areas/acuerdos/models/Acuerdo"
import {  jsPDF             } from "jspdf"
import {  Format            } from "src/composables/useTools" 

export function useRotulosPDF()
{
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
  doc.margen1       = doc.margenIzq + 5
  doc.margen2       = doc.ancho - doc.margenDer - 12
  
  async function getRotulosPDF( entregas : IAcuerdo[] ) : Promise<string>
  {
    doc.limpiarPDF()
    await configurarPDF()

    doc.y = 7

    for (const entrega of entregas)
    {
      doc.area              = entrega.tercero.area
      for (const producto of entrega.productos)
      {
        if(!producto.visible) continue

        for (let i = 0; i < producto.qty; i++)
        {
          //* /////////////////////////////////////////////////////////////////////////////////// Salto de hoja
          if(doc.y            >= doc.alto - 110)
          {
            doc.setNewPage()
            doc.y             = 7
          }
                    
          let inicioY         = doc.y
          doc.addY(14)
          //* /////////////////////////////////////////////////////////////////////////////////// Envia Grupo Escom
          pdf.setFontSize     (16)
          pdf.text            (`Envía:  ${doc.empresa}`, doc.margen1, doc.y, { renderingMode: 'fillThenStroke' })
          pdf.text            (`${doc.nit} ${doc.direccionCorta} ${doc.telefono} - REF: ${entrega.refPedido}`, doc.margen1 + 100, doc.y)
          doc.addY            (15)
          //* /////////////////////////////////////////////////////////////////////////////////// Nombre cliente
          pdf.setFontSize(19)
          
          pdf.text            ("Recibe: ", doc.margen1, doc.y, {renderingMode: 'fillThenStroke'})
          
          const recibe        = `${entrega.tercero.nombre} • ${entrega.tercero.documento.label} • TEL ${entrega.contactoEntrega.telefonos}`
          const recibeSplit   = pdf.splitTextToSize(recibe, doc.ancho - 55) as Array<string>
          pdf.text            ( recibeSplit, doc.margen1 + 36, doc.y, { align: "left" })
          doc.addY            ( 15 * recibeSplit.length )
          doc.addY            ( 4 )

          //* /////////////////////////////////////////////////////////////////////////////////// Ciudad, direcciones e indicaciones
          pdf.setFontSize     ( 24 )
          //* /////////////////////////////////////////////////////////////////////////////////// Ciudad 
          const ciudad        = entrega.contactoEntrega.municipio.municipio
          pdf.text            ( ciudad, doc.margen1, doc.y, {renderingMode: 'fillThenStroke'}) 
          pdf.setFontSize     ( 19 )

          //* /////////////////////////////////////////////////////////////////////////////////// Direccion
          const direccion     = entrega.contactoEntrega.direccion
          const largoCiudad   = ciudad.length
          const posXDireccion = doc.margen1 + ( largoCiudad * 6 ) + 20
          const direccionSplit= pdf.splitTextToSize( direccion, doc.ancho - posXDireccion - 20 ) as Array<string>
          pdf.text            ( direccionSplit, posXDireccion, doc.y )
          doc.addY            ( 15 * direccionSplit.length )
          doc.addY            ( 3 )

          //* /////////////////////////////////////////////////////////////////////////////////// Indicaciones
          const indicaciones  = entrega.contactoEntrega.nota
          if(indicaciones.length > 6) 
          {
            const anchoIndica = 60
            pdf.text          ("Indicaciones:", doc.margen1, doc.y, { renderingMode: 'fillThenStroke' })
            const indicaSplit = pdf.splitTextToSize( indicaciones, doc.ancho - anchoIndica - 25) as Array<string>
            pdf.text          ( indicaSplit, doc.margen1 + anchoIndica, doc.y )
            doc.addY          ( 16 * indicaSplit.length )
            doc.addY          ( 2 )
          }

          //* /////////////////////////////////////////////////////////////////////////////////// Metodo envio
          pdf.setFontSize     ( 24 )
          pdf.text            ( entrega.metodoEntrega.label, doc.margen1, doc.y, { renderingMode: 'stroke' })

          //* /////////////////////////////////////////////////////////////////////////////////// Seguro y producto
          pdf.setFontSize     ( 17 )
          const qty           = producto.qty
          const qtyTxt        = qty == 1 ? "" :  `${i+1}/${qty}`
          let productoTxt     = `Seguro: ${Format.precio( producto.precioBaseConIVA )}`
              productoTxt    += !!qtyTxt          ? ` - ${qtyTxt}` : ""
              productoTxt    += !!producto.nombre ? ` - ${producto.nombre}` : ""
          const productoSplit = pdf.splitTextToSize(productoTxt, doc.ancho - 145)
          pdf.text            ( productoSplit, 132, doc.y, {align: "left"} )
          doc.addY            ( 12 * productoSplit.length )

          //* /////////////////////////////////////////////////////////////////////////////////// Caja que rodea
          const altoCaja      = doc.y - inicioY - 6
          pdf.roundedRect     (doc.margenIzq, inicioY, doc.margen2, altoCaja, 5, 5 )

          //* /////////////////////////////////////////////////////////////////////////////////// Final
          doc.addY            ( 3 )
        }        
      }      
    }
    const pdf_blob  = pdf.output('bloburi')
    const pdf_final = pdf_blob.toString()
    return pdf_final
  }

  async function configurarPDF() : Promise<void>
  {
    return new Promise(async (resolver) =>{

      const { Futura }     = await import("src/assets/fonts/Futura.js")
      
      doc.fontBase          = "Futura"
      pdf.addFileToVFS      ("Futura.ttf",      Futura) 
      pdf.addFont           ("Futura.ttf",      doc.fontBase,  "normal" )
      pdf.setFont           (doc.fontBase,      "normal")

      resolver() 
    })
  }

  function saveRotulosPDF()
  {    
    const nombre  = `Rótulos.pdf`
    pdf.save( nombre );
  }
    
  return {
    getRotulosPDF,
    saveRotulosPDF
  }
}