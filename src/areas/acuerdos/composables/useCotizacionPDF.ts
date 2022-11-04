
import {  UtilPDF,
          IUtilPDF,
          IInicioPDF,
          crearImageHTML,
          GRISES            } from 'src/useSimpleOk/UtilPDF';
import {  Acuerdo,
          IAcuerdo,
          TIPO_ACUERDO      } from "src/areas/acuerdos/models/Acuerdo"          
import {  useQuasar,
          QSpinnerGears     } from "quasar"
import {  fechaLarga,
          limpiarHTML,
          formatoPrecio,
                            } from "src/useSimpleOk/useTools"
import {  jsPDF             } from "jspdf"
import    autoTable           from 'jspdf-autotable'
//import    html2canvas         from 'html2canvas';

export function useCotizacionPDF()
{
  const { notify          } = useQuasar()
  let aviso   : Function
  let quote   : IAcuerdo    = new Acuerdo( TIPO_ACUERDO.COTIZACION )
  let algunGrupoConSubTotal = false
  const pdf   : jsPDF       = new jsPDF('p','px')
  const setup : IInicioPDF  = { ancho:      447,
                                alto:       631,
                                margenIzq:  80,
                                margenDer:  96,
                                pie:        8,
                                path:       "images/pdf/",
                                pdf:        pdf
                              }
  const doc   : IUtilPDF    = new UtilPDF( setup )

  async function generarPDF( cotizacion : IAcuerdo ) : Promise<string>
  {
          limpiar()
          mostrarAviso()
    quote                   = cotizacion
          //verificarDatosCorrectos()
    await configurarPDF()
          generarCabezotePortada()
          generarTitulo()
    await generarCuerpo()
          generarSubTotales()
          generarTotales()
          generarNota()
    await generarCondiciones()
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

  function guardarPDF()
  {
    const correo  =   !!quote.pdfCorreo
                    ? " " + quote.pdfCorreo
                    : "" 
    const nombre  = `${doc.areaNombre} ${quote.ref}${correo}.pdf`
    pdf.save( nombre );
  }


  function verificarDatosCorrectos()
  {
    
  }

  async function configurarPDF() : Promise<void>
  {
    algunGrupoConSubTotal   = quote.proGrupos.some( g => g.conTotal )   
    doc.area                = !!quote.tercero.area ? quote.tercero.area : quote.comercial.area
  
    return new Promise(async (resolver) =>{

      const { Candara }       = await import("src/assets/fonts/Candara.js")

      doc.fontBase          = "Candara"
      pdf.addFileToVFS      ("Candara.ttf",      Candara) // "Identity-H"
      pdf.addFont           ("Candara.ttf",      doc.fontBase,  "normal" )
      pdf.setFont           (doc.fontBase,      "normal")

      resolver() 
    })
  }

  function generarCabezotePortada()
  {
    generarCabezoteLogo()
    generarCabezoteDatos()
  }


  function generarCabezoteLogo()
  {
    //* ///////////////////////////////////// Barra gris
    doc.x               = 0
    doc.y               = 0
    const altoFondo     = 50
    pdf.addImage        ( doc.imgFondo,  "PNG", doc.x, doc.y, doc.ancho, altoFondo)
    //* ///////////////////////////////////// Barra de color y logo
    doc.y               = altoFondo
    const altoBarra     = 10
    generarBarraColor   ( 0, doc.y, doc.ancho, altoBarra)
    pdf.addImage        ( doc.imgLogo,   "PNG", 10, 8, 135, 33)

    //* ///////////////////////////////////// Textos Arriba derecha
    doc.y               = 17
    doc.setFont         ( 16, 60 )
    const titulo        = quote.esEstadoNoValidado ? "NO VALIDO" : "COTIZACIÓN"
    pdf.text            ( titulo, doc.ancho - 80, doc.y, { align: "center", renderingMode: 'fillThenStroke' } )

    //* ///////////////////////////////////// Datos empresa
    doc.y               += 9
    doc.setFont         ( 10, 100 )
    pdf.text            ( doc.headText, doc.ancho - 80, doc.y, { align: "center" })

    doc.headAlto        = altoFondo + altoBarra
    doc.y++             // por un pixel que falta
  }

  async function generarCuerpo()
  {
          ordenarProductos()
          generarPiePagina()
    await generarProductos()
  }

  function generarTitulo()
  {
    if(!quote.titulo) return

    doc.x               = doc.anchoMitad
    doc.y               += 13
    doc.setFont         ( 16, 50 )
    pdf.text            ( quote.titulo, doc.x, doc.y, { align: "center", renderingMode: 'fillThenStroke' })
  }

  async function generarProductos()
  {
    doc.y                       += 6
    const altoProducto          = 78
    const modoSubTotales        = algunGrupoConSubTotal

    for (const grupo of quote.proGrupos)
    {
      const altoBarra           = quote.proGrupos.length > 1 ? 14 : 10
      if( doc.seNecesitaNuevaHoja(doc.y, altoProducto + altoBarra) )
        doc.y                   = crearNuevaHoja() - 10

      // * //////////////////////////////////////////////// Barra roja      
      
      generarBarraColor( 0, doc.y, doc.ancho, altoBarra)
      
      // * //////////////////////////////////////////////// Si hay grupos agregar titulo
      if(quote.proGrupos.length > 1)
      {
        doc.x                   = doc.anchoMitad // modoSubTotales ? doc.margenIzq : doc.anchoMitad
        //let alinacion           : "left" | "center" | "right" | "justify"
        //    alinacion           = "center" // modoSubTotales ? "left" : "center" 

        doc.setFont             ( 13, 255 )
        pdf.text                ( grupo.titulo, doc.x, doc.y + 10, { align: "center", renderingMode: 'fillThenStroke' })

        /*
        if(grupo.conTotal)
        {
          doc.setFont           ( 10, 240 )
          doc.x                 = doc.margenDerX - 50
          const subtotal        = "Subtotal sin IVA:   " + formatoPrecio(grupo.totalConDescu,  "decimales-no")
          pdf.text              (subtotal, doc.x, doc.y + 10, { align: alinacion })
  
        }*/
      }
      doc.y                     += altoBarra + 1
      
      // * //////////////////////////////////////////////// Bucle Productos
      for (const producto of grupo.productos)
      {
        if( doc.seNecesitaNuevaHoja(doc.y, altoProducto ) )
          doc.y                 = crearNuevaHoja()
        const anchoIzq          = fondosGrisesLinea( altoProducto )
      
        // * //////////////////////////////////////////////// Ref y nombre
        //const anchoRef          = Math.round( pdf.getStringUnitWidth(producto.ref) ) 
        //const espacios          = " ".repeat( anchoRef * 6 ) + " "
        const nombre            = `${producto.ref} - ${producto.nombre}`//espacios + producto.nombre
        const margenIzq         = doc.margenIzq + 4
        doc.setFont             ( 11, 30)
        //pdf.text                ( producto.ref, margenIzq,  doc.y + 10, { align: "left", renderingMode: 'fillThenStroke' })
        const nombreSplit       = pdf.splitTextToSize(nombre, anchoIzq ) as Array<string>
        //doc.setColor            ( 60 )
        pdf.text                ( nombreSplit, margenIzq, doc.y + 10, { align: "left", renderingMode: 'fillThenStroke' })

        // * //////////////////////////////////////////////// Descripcion
        doc.setFont             ( 9, 40 )
        const posYDes           = nombreSplit.length === 1 ? doc.y + 19 : doc.y + 28
        const descSlit          = pdf.splitTextToSize( limpiarHTML(producto.descripcion), anchoIzq - 4 ) as Array<string>
        pdf.text                ( descSlit, margenIzq, posYDes, { align: "left" })

        // * /////////////////////////////////////////////////////////////////
        // * //////////////////////////////////////////////// Totales
        const espaciado         = 9
        
        doc.setColor            ( 20 )
        doc.x                   = doc.margenDerX + ( doc.margenDer / 2 ) - 2

        let nombrePrecio        : string
        let valorPrecio         : string
        let valorPrecioBold     : string
        let posY                = doc.y + 10

        // * //////////////////////////////////////////////// Nombres de precio
        nombrePrecio            = producto.descuentoX100 > 0
                                    ? `PUBLICO SIN IVA:\nOFERTA ${producto.descuentoX100}%:\n`
                                    : "PRECIO SIN IVA:\n"
        nombrePrecio            += "IVA:\nPRECIO CON IVA:\nCANTIDAD:\n" 
        nombrePrecio            += producto.qty > 1 ? "TOTAL CON IVA:" : ""
        doc.setFont             ( 7, 100 )
        pdf.text                (nombrePrecio, doc.x, posY, { align: "right", lineHeightFactor: 2.2, renderingMode: 'fillThenStroke' })

        // * //////////////////////////////////////////////// Valores Publico sin negrita
        valorPrecio             = producto.descuentoX100 > 0  
                                    ? formatoPrecio(producto.precioBase,  "decimales-no") + "\n\n"
                                    : "\n"
        valorPrecio             += formatoPrecio(producto.ivaValorLinea,  "decimales-no") + "\n\n"
        valorPrecio             += producto.qtyUnd

        doc.setFont             ( 9, 90 )
        pdf.text                (valorPrecio,     doc.x + 2, posY, { align: "left", lineHeightFactor: 1.7 })

        // * //////////////////////////////////////////////// Valores Publico con negrita
        if(producto.descuentoX100)
          posY                  += 12
        valorPrecioBold         = formatoPrecio(producto.precioFinal,       "decimales-no") + "\n\n"
        valorPrecioBold         += formatoPrecio(producto.precioFinalConIVA,  "decimales-no") + "\n\n"
        valorPrecioBold         += producto.qty > 1 ? formatoPrecio(producto.totalConIva,  "decimales-no") : ""

        doc.setFont             ( 9, 30 )
        pdf.text                (valorPrecioBold, doc.x + 2, posY, { align: "left", lineHeightFactor: 1.7, renderingMode: 'fillThenStroke'  })
        
        // * //////////////////////////////////////////////// Imagen

        if(!!producto.imagen300px)
        {
          let imagen            = await crearImageHTML( producto.imagen300px )
          const margen          = { left: 6, top: 2 }
          const anchoImg        = doc.margenIzq - margen.left
          pdf.addImage(imagen, 'JPEG', margen.left, doc.y + margen.top, anchoImg, anchoImg)

          if(doc.areaNombre     === "Escom")
            pdf.addImage(doc.path + 'escom.png', 'PNG', margen.left + 3,  doc.y + 68, 68,      7)
            //pdf.addImage(doc.path + 'bandaMarca.png', 'PNG', margen.left,  doc.y + 67, 74,      9)
        }


        // * //////////////////////////////////////////////// Final
        doc.y                   += altoProducto
      }
    }
  }

  function generarSubTotales()
  {
    if (!algunGrupoConSubTotal || quote.proGrupos.length < 2) return
    
    const subtotales            = quote.proGrupos.filter(g => g.conTotal)
    const altoBarra             = 16
    const altoSubTotales        = 16 * (subtotales.length + 1)
    const nuevaPagina           = doc.seNecesitaNuevaHoja( doc.y, altoBarra + altoSubTotales )
    if( nuevaPagina )
      doc.y                     = crearNuevaHoja() + 10

    // * //////////////////////////////////////////////// Titulo
    generarBarraColor( 0, doc.y, doc.ancho, altoBarra )
    doc.setFont                 ( 12, 255 )
    let posY                    = doc.y + 11
    doc.y                       += altoBarra + altoSubTotales

    pdf.text                    ("SUBTOTALES", doc.anchoMitad, posY, { align: "center", renderingMode: 'fillThenStroke' })
    // * //////////////////////////////////////////////// Tabla
    autoTable(pdf, {
      head: [['Subtotal', 'Bruto', 'Descuento', 'Neto', 'IVA', 'Total con IVA' ]],
      startY: posY + 5,
      margin: { left: 0, right: 0, bottom: 0 },
      headStyles: { lineWidth: 0.5, lineColor: 255, fillColor: [200, 200, 200], textColor: [80,80,80], fontStyle: 'bold', halign: 'center' },
      columnStyles: {
          0: { fontStyle: 'bold'  },
          1: { halign:    'right' },
          2: { halign:    'right' },
          3: { halign:    'right' },
          4: { halign:    'right' },
          5: { halign:    'right' },
      },
      body: [
        ...subtotales.map((g)=>[
          g.titulo,
          formatoPrecio(g.totalSinDescu,  "decimales-si"),
          formatoPrecio(g.descuento,      "decimales-si"),
          formatoPrecio(g.totalConDescu,  "decimales-si"),
          formatoPrecio(g.totalIva,       "decimales-si"),
          formatoPrecio(g.totalConIva,    "decimales-si"),
        ])
      ],
    })
  }

  function generarTotales()
  {
    if(!quote.conTotal) return

    const altoBarra             = 16
    const altoTotales           = 66
    const nuevaPagina           = doc.seNecesitaNuevaHoja( doc.y, altoBarra + altoTotales )
    if( nuevaPagina )
      doc.y                     = crearNuevaHoja() + 10

    // * //////////////////////////////////////////////// Titulo y Banda Gris
    generarBarraColor( 0, doc.y, doc.ancho, altoBarra ) //doc.margenIzq   - doc.margenIzq,
    doc.setFont                 ( 12, 255 )
    let posY                    = doc.y + 11
    pdf.text                    ("TOTALES", doc.anchoMitad, posY, { align: "center", renderingMode: 'fillThenStroke' })
    doc.y                       +=altoBarra 
    fondosGrisesLinea           ( altoTotales )
    doc.y                       +=altoTotales 

    // * //////////////////////////////////////////////// Nombre de Valores
    const nombreValores         = "Subtotal bruto:\nDescuento:\nSubtotal neto:\nIVA:\nTotal:"
    doc.setFont                 ( 11, 90 )
    posY                        += 16
    pdf.text                    ( nombreValores, doc.margenDerX - 5, posY, { align: "right", lineHeightFactor: 1.4, renderingMode: 'fillThenStroke' })
    
    // * //////////////////////////////////////////////// Nombre de Valores
    doc.setFont                 ( 8, 70 )
    const nombreCondiciones     = "Condiciones de pago:\n"
                                  + ( !!quote.formaPago.id        ? "Forma de pago:\n"      : "")
                                  + ( !!quote.metodoEntrega.id    ? "Método de entrega:\n"  : "")                                  
                                  + "Precios validos hasta:\n" 
                                  + ( !!quote.tiempoEntrega.id    ? "Tiempo de entrega:"    : "")    
    pdf.text                    ( nombreCondiciones, doc.margenIzq - 4, posY, { align: "right", lineHeightFactor: 1.4, renderingMode: 'fillThenStroke' })

    const condiciones             = quote.condicionPago.descripcion + "\n"
                                    + ( !!quote.formaPago.id      ? `${quote.formaPago.label}\n`      : "")
                                    + ( !!quote.metodoEntrega.id  ? `${quote.metodoEntrega.label}\n`  : "")
                                    + `${quote.fechaFinValidezCorta}. Después de esta fecha deberán re-confirmarse.\n`
                                    + ( !!quote.tiempoEntrega.id
                                        ? `${quote.tiempoEntrega.label} para producción y entrega, proyectados después de recibido y legalizado el anticipo. Condicionado con los horarios a programar con el supervisor designado por el cliente.`
                                        : ''
                                      )
    const condicionesSplit      = pdf.splitTextToSize(condiciones, 210  ) as Array<string>            
    pdf.text                    ( condicionesSplit, doc.margenIzq + 4, posY, { align: "left", lineHeightFactor: 1.4 })


    // * //////////////////////////////////////////////// Valores totales
    let valores                 =  formatoPrecio(quote.totalSinDescu,   "decimales-si") + "\n"
    valores                     += formatoPrecio(quote.descuentoValor,  "decimales-si") + "\n"
    valores                     += formatoPrecio(quote.totalConDescu,   "decimales-si") + "\n"
    valores                     += formatoPrecio(quote.ivaValor,        "decimales-si") + "\n"
    valores                     += formatoPrecio(quote.totalConIva,     "decimales-si")

    doc.setFont                 ( 11, 20 )
    pdf.text                    ( valores, doc.margenDerX + 70, posY, { align: "right", lineHeightFactor: 1.4 })
  }

  async function generarNota() : Promise<boolean>
  {
    if(!quote.notaPublica) return

    const copia = doc.y
    const notaSplit             = pdf.splitTextToSize(quote.notaPublica, doc.ancho - 30  ) as Array<string>    
    const altoNota              = notaSplit.length * 15
    const hayNuevaPagina        = doc.seNecesitaNuevaHoja( doc.y, altoNota )
    if( hayNuevaPagina )
      doc.y                     = crearNuevaHoja() + 10

    // * //////////////////////////////////////////////// OBSERVACIONES y nota
    doc.setFont                 ( 12, 55 )
    doc.y                       += 11
    pdf.text                    ("OBSERVACIONES", doc.anchoMitad, doc.y, { align: "center", renderingMode: 'fillThenStroke' })
    doc.y                       += 10
    doc.setFont                 ( 10, 30)
    pdf.text                    (notaSplit, doc.anchoMitad, doc.y, { align: "center" })
    //const scale = (pdf.internal.pageSize.width - 10) / 600
    //console.log("scale: ", scale);
/*     html2canvas(document.querySelector("#capture")).then(canvas => {

      //document.body.appendChild(canvas)
			canvas.getContext('2d');
			
			
			
			var imgData = canvas.toDataURL("image/jpeg", 1.0);
      //console.log("imgData: ", imgData);
      pdf.addImage(imgData, 'JPG', 300, 300, 50,50);
			
    }); */

    /* pdf.html(, {
        x: doc.anchoMitad,
        y: doc.y,
        //width: 400,
        html2canvas: {
          scale: 1,
          allowTaint: true,
          useCORS: true,          
        },
        callback: (doc) => {
          //console.log("html....!", doc);
        }        

      }) */
    doc.y                       +=10
    return true
  }  

  function fondosGrisesLinea( alto : number ) : number
  {
    const anchoIzq          = doc.ancho - doc.margenIzq - doc.margenDer
    // * //////////////////////////////////////////////// Fondos Grises producto
    pdf.addImage(doc.path + 'degradado.png',      'PNG',  doc.margenIzq,  doc.y, anchoIzq,      alto)
    pdf.addImage(doc.path + 'degradadoOscuro.png','PNG',  doc.margenDerX, doc.y, doc.margenDer, alto)

    return anchoIzq
  }

  async function generarCondiciones()
  {
    const altoImagen          = 440
    const alto                = altoImagen + 20 + 10 + 25
    const ancho               = 360
    const posX                = ( doc.ancho - ancho ) / 2
    if( doc.seNecesitaNuevaHoja( doc.y, alto ) )
      doc.y                   = crearNuevaHoja()
    
    doc.y                     += 20

    doc.setFont               ( 16, 50 )
    pdf.text                  ( "Condiciones comerciales", doc.anchoMitad, doc.y, { align: "center", renderingMode: 'fillThenStroke' })

    doc.y                     += 10

    let imagen                = await crearImageHTML( doc.path + "condiciones" + doc.areaNombre + ".png" )
    pdf.addImage(imagen, 'PNG', posX, doc.y, ancho, altoImagen)
    doc.y                     += altoImagen

    //* ///////////////////////////////////// Cuentas bancarias    
    const cuenta              = doc.areaNombre === "Mublex"
                                ? "Transferencia bancaria: Cuenta ahorros Bancolombia # 18600-000-136"
                                : "Transferencia bancaria: Cuenta corriente Bancolombia # 691-338482-61" 
    const aNombre             = `A nombre de: ${doc.empresaNit}`
    const mensaje3            = "Somos régimen común - No somos autoretenedores"
    const arrayMensajeFinal   = [cuenta, aNombre, mensaje3]
    doc.y                     += 10
    doc.setFont               ( 12, 50 )
    pdf.text                  ( arrayMensajeFinal,   doc.anchoMitad, doc.y, { align: "center" })
    //doc.y                     += 15
    //pdf.text                  ( aNombre,  doc.anchoMitad, doc.y, { align: "center" })
  }


  function ordenarProductos()
  {
    quote.proGrupos.forEach(grupo => {
      grupo.productos         = grupo.productos.sort ( ( a , b ) =>
      {
        let retorno           = 0        
              if( a.esRefEspecial && !b.esRefEspecial ) retorno =  1
        else  if(!a.esRefEspecial &&  b.esRefEspecial ) retorno = -1
        else  if( a.esRefEspecial === b.esRefEspecial ) retorno = a.precioFinal - b.precioFinal
        return retorno 
      })
    })

    
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

  function generarBarraColor( posX: number, posY : number, ancho : number, alto : number ) : number
  {
    //* ///////////////////////////////////// Barra de color
    const altoBarra       = alto
    pdf.addImage        (doc.imgBar,    "PNG", posX, posY, ancho, altoBarra)
    return posY + alto
  }
  function generarCabezoteDatos()
  {
    // * ///////////////////////////////////////////////////// Rectangulos
    // * //////////////////////////////////////////////// Rectangulo 1
    doc.x               = 0
    doc.y               = doc.headAlto
    const altoHeadDatos   = 64
    //pdf.setDrawColor    ( 0)
    pdf.setLineWidth    ( 0)
    pdf.setFillColor    ( GRISES.GRIS_1 )
    pdf.rect            ( doc.x, doc.y, doc.ancho, altoHeadDatos, 'F')
    
    // * //////////////////////////////////////////////// Rectangulo 2
    pdf.setFillColor    ( GRISES.GRIS_2 )
    pdf.rect            ( doc.x, doc.y, 60, altoHeadDatos, 'F')

    // * //////////////////////////////////////////////// Rectangulo 3
    const anchoBoxFin     = 100
    doc.x               = doc.ancho - anchoBoxFin
    pdf.setFillColor    ( GRISES.GRIS_3 )
    pdf.rect            ( doc.x, doc.headAlto, anchoBoxFin, altoHeadDatos, 'F')

    // * //////////////////////////////////////////////// Titulos Izquierda
    doc.x               = 55
    doc.y               = 68
    doc.setFont         ( 9, 50 )
    const textoIzq        = "Nombre:\nContácto:\nCorreo:\nCiudad:\nFecha:\nIVA:"
    pdf.text            (textoIzq, doc.x, doc.y, { align: "right", lineHeightFactor: 1.5, renderingMode: 'fillThenStroke' })

    // * //////////////////////////////////////////////// Titulos Derecha
    let textoDer        = "Asesor:\nTeléfono:\nCorreo:\nCondiciones de pago:\nValidez:\nREF:"
    doc.x               = doc.ancho - anchoBoxFin - 4
    doc.setColor        ( 70 )
    pdf.text            (textoDer, doc.x, doc.y, { align: "right", lineHeightFactor: 1.5 })

    // * //////////////////////////////////////////////// Textos vendedor y condiciones
    textoDer            =  quote.comercial.nombreCompleto + "\n"
    textoDer            += quote.comercial.cel + "\n"
    textoDer            += quote.comercial.correo + "\n"
    textoDer            += quote.condicionPago.label + "\n"
    textoDer            += quote.fechaFinValidezCorta + "\n"
    textoDer            += quote.ref
    doc.x               += 7
    doc.setColor        ( 40 )
    pdf.text            (textoDer, doc.x, doc.y, { align: "left", lineHeightFactor: 1.5 })

    // * //////////////////////////////////////////////// Textos cliente izquierda
    const textoConIVA   = "El 'Total' del producto incluye IVA. El 'Valor' del producto no lo incluye."
    const textoSinIVA   = "Precio en productos no incluye IVA"
    textoDer            =  quote.pdfNombre + "\n"
    textoDer            += quote.pdfContacto + "\n"
    textoDer            += quote.pdfCorreo + "\n"
    textoDer            += quote.pdfCiudad + "\n"
    textoDer            += fechaLarga( new Date() ) + "\n"
    textoDer            += quote.conIVA ? textoConIVA : textoSinIVA
    doc.x               = 63
    doc.setColor        ( 40 )
    pdf.text            (textoDer, doc.x, doc.y, { align: "left", lineHeightFactor: 1.5 })

    doc.y               = doc.headAlto + altoHeadDatos
  }

  function crearNuevaHoja() : number
  {
    doc.setNewPage()
    generarPiePagina()
    generarCabezoteLogo()

    return doc.headAlto
  }

  function generarPiePagina()
  {
    doc.setFont         ( 10, 120)
    pdf.text( doc.pieText, doc.anchoMitad, doc.alto - doc.pie, { align: "center" })
    pdf.setFontSize     ( 12 )
    pdf.text( "Pag " + doc.hojaNow.toString(), doc.ancho - 20, doc.alto - doc.pie, { align: "right" })
  }

  return {
    generarPDF,
    guardarPDF
  }
}