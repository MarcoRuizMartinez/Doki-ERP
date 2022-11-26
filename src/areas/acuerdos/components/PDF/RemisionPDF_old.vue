<template>
  <ventana                      cerrar
    icono                       ="mdi-pdf-box"
    :titulo                     ="'Remisión - ' + pedido.pedido"
    classMain                   ="q-pa-none"
    @cerrar                     ="$emit('cerrar')"
    >
    <!-- //?* //////////////////////////////////////////////////////////// Lado izquierdo -->
    <div      class             ="col-5">
      <!-- //?* ////////////////////////////////////////////////////////// Datos remisión -->
      <div    class             ="datosRemision q-pa-lg">
        <span class             ="nombre text-weight-bold"  >{{ pedido.cliente }}</span>
        <span class             ="text-weight-bold"         >Dirección:</span>
        <span class             ="celdaFull"                >{{ pedido.direccion  }}</span>
        <span class             ="text-weight-bold"         >Indicaciones:</span>
        <span class             ="celdaFull">
          {{ pedido.indicaciones }}
          <q-popup-edit         v-model="pedido.indicaciones" auto-save @save="generarPDF">
            <q-input            v-model="pedido.indicaciones" dense autofocus/>
          </q-popup-edit>
        </span>
        <span class             ="text-weight-bold">Fecha:</span>
        <!-- //?* ////////////////////////////////////////////////////////////// Campo Fecha llegada --> 
        <q-input                dense filled hide-bottom-space
          type                  ="date"
          v-model               ="fechaEntrega"
          @input                ="generarPDF"
        />
        <div>
          <q-toggle
            label               ="Mostrar descripción"
            v-model             ="mostrarDescripciones"
            style               ="width: 200px"
            @input              ="toggleMostrarDescripciones"
          />
        </div>
      </div>
      <!-- //?* ///////////////////////////////////////////////////////// Items remisión -->
      <div class                ="row col-12 q-px-lg">
        <div
          :index                ="index"
          v-for                 ="(producto, index) of pedido.productos"
          class                 ="row col-12 bg-grey-2 q-mb-xs"
          >
          <!-- //?* ///////////////////////////////////////////////////// Ref nombre y nota -->
          <div class            ="col-8 q-mt-xs">
            <span class         ="text-weight-bold q-pl-sm">
              {{producto.ref}}
            </span> -
            {{producto.nombre}}{{ " " }}
            {{producto.nota}} 
            <q-popup-edit       v-model="producto.nota" auto-save @save="generarPDF">
              <q-input          v-model="producto.nota" dense autofocus/>
            </q-popup-edit>
          </div>
          <!-- //?* ///////////////////////////////////////////////////// Cantidad -->
          <div class            ="col-1 text-center q-mt-xs">
            {{producto.cantidad}}
            <q-popup-edit       v-model.number="producto.cantidad" auto-save>
              <q-input          v-model.number="producto.cantidad" dense autofocus type="number" @input="checkEntregaCompleta"/>
            </q-popup-edit>
          </div>
          <!-- //?* ///////////////////////////////////////////////////// Estado -->
          <div>
            <q-btn              flat round dense
              :color            ="producto.visible ? 'grey-10'        : 'grey-6'"
              icon              ="mdi-gift"
              >
              <q-tooltip content-class="bg-black text-body2" :offset="[10, 10]">
                Estado: {{producto.estado}}
              </q-tooltip>
            </q-btn>            
            <q-popup-edit       v-model="producto.estado" auto-save>
              <q-input          v-model="producto.estado" dense autofocus @input="generarPDF"/>
            </q-popup-edit>
          </div>
          <!-- //?* ///////////////////////////////////////////////////// Descripcion -->
          <div>
            <q-btn              flat round dense
              :color            ="producto.descripcionVisible ? 'grey-10'        : 'grey-6'"
              icon              ="mdi-clipboard-list"
              >
              <q-tooltip content-class="bg-black text-body2" :offset="[10, 10]">
                {{producto.descripcion}}
              </q-tooltip>
            </q-btn>
            <q-popup-edit       v-model="producto.descripcion" auto-save>
              <q-input          dense autofocus
                v-model         ="producto.descripcion"
                style           ="width: 300px"
                type            ="textarea"
                @input          ="generarPDF"
              />
              <q-toggle
                label           ="Mostrar descripción"
                v-model         ="producto.descripcionVisible"
                @input          ="generarPDF"
              />
            </q-popup-edit>
          </div>   
          <!-- //?* ///////////////////////////////////////////////////// Visibilidad -->
          <div>
            <q-btn              flat round dense
              @click            ="producto.visible = !producto.visible;checkEntregaCompleta()"
              :color            ="producto.visible ? 'grey-10'        : 'grey-6'"
              :icon             ="producto.visible ? 'mdi-eye-check'  : 'mdi-eye-off'"
            />
          </div>                  
        </div>
      </div>
    </div>
    <!-- //?* ////////////////////////////////////////////////////////// Lado derecho -->
    <div
      class                     ="col-7"
      style                     ="height: 92vh;"
      >
      <q-pdfviewer
        v-model                 ="mostrarPDF"
        :src                    ="src"
        type                    ="pdfjs"
      />
    </div>
  </ventana>
</template>
<script>
import    ventana                 from "components/utilidades/Ventana"
import  { jsPDF }                 from "jspdf"
import  {
          CenturyGothic,
          CenturyGothicBold
        }                         from 'assets/js/pdf/fuentes.js'

var _pdf              = new jsPDF()
var HOJA_ALTO_TOTAL   = 301
var HOJA_ALTO_MITAD   = (HOJA_ALTO_TOTAL / 2) - 4
var HOJA_ANCHO_TOTAL  = 209
var HOJA_ANCHO_MITAD  = HOJA_ANCHO_TOTAL / 2
var MARGEN_TOP        = 12
var MARGEN_LEFT       = 6
var MARGEN_RIGHT      = HOJA_ANCHO_TOTAL - MARGEN_LEFT
var LOGO              = "data:image/gif;base64,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"
var _posY             = 0

function SIZE_FONT(texto)
{
  let largo           = texto.length
  let size            = 0

  if(largo            <= 45)
    size              = 14
  else if(largo       <= 60)
    size              = 12
  else if(largo       <= 80)
    size              = 10
  else if(largo       <= 150)
    size              = 10
  else
    size              = 9

  return size  
}

function WIDTH_BOX_FONT(texto)
{
  let largo           = texto.length
  let size            = 0

  if(largo            <= 45)
    size              = 180
  else if(largo       <= 60)
    size              = 180
  else if(largo       <= 80)
    size              = 180
  else if(largo       <= 110)
    size              = 168
  else
    size              = 178

  return size
}


export default {
  props:{
    value:    {  type: Object, required: true}
  },
  components: { ventana },
  data()
  {
    return {
      pedido:               {},
      mostrarPDF:           true,
      fechaEntrega:         "",
      entregaCompleta:      true,
      mostrarDescripciones: true,
      src:              '',
      //* ///////// Datos PDF
    }
  },
  //* //////////////////////////////////////////////////////////////////////////////////////////////////
  //* ////////////////////////////////////////////////////////////////////////////////////////////////// METHODS
  //* ////////////////////////////////////////////////////////////////////////////////////////////////// 
  methods:
  {
    //* /////////////////////////////////////////////////////////////////////////////////////// Abrir ventana
    configurar_pdf()
    {
      this.configurarFuentes()
    },

    //* /////////////////////////////////////////////////////////////////////////////////////// Generar PDF
    generarPDF()
    {
      //console.log(this.pedido)
      /* 
      let texto1 = "Hola como estas estan trabajando mucho yo me alegro muchoÑñá"
      let texto2 = "012345678901234567890123456789012345678901234567890123456"
        _pdf.setFontSize(20)
        _pdf.text     (texto1, 10, _posY);  _posY      += 10
        _pdf.setFontSize(15)
        _pdf.text     (texto1, 10, _posY);  _posY      += 10
        _pdf.setFontSize(10)
        _pdf.text     (texto2, 10, _posY);  _posY      += 10

         */
      for(let copia = 1; copia <= 2; copia++)
      {
        if(copia == 1)
        {
          _posY   = 0
        }
        else
        {
          _posY   = HOJA_ALTO_MITAD
        }

        this.generarCabezote()
        this.generarCuerpo()
        this.generarPie(copia)
      }

      this.src  = _pdf.output('bloburi')
      _pdf.deletePage(1)
      _pdf.addPage()
    },
    //* /////////////////////////////////////////////////////////////////////////////////////// Generar cabezote
    generarCabezote()
    {
      _posY               += MARGEN_TOP
      //*                 ////////////////////////////////////////////////////////////////////// Logo
      _pdf.addImage       (LOGO, 'GIF', MARGEN_LEFT, _posY - 6)
      //*                 ////////////////////////////////////////////////////////////////////// Textos Cabezote 
      _pdf.setFontSize    (12)

      _pdf.setFont        ('CenturyGothicBold')
      _pdf.text           ("Grupo Escom SAS", HOJA_ANCHO_MITAD - 33, _posY)
      _pdf.text           ("REMISION #", HOJA_ANCHO_TOTAL - 40, _posY)

      _pdf.setFont        ('CenturyGothic')
      _pdf.text           ("900.419.912-7", HOJA_ANCHO_MITAD + 6, _posY)

      _posY               += 5
      _pdf.setFontSize    (10)
      _pdf.text           ("CRR 49A # 85 - 05 - Bogotá – PBX 8137505", HOJA_ANCHO_MITAD - 35, _posY)
      _pdf.text           (this.pedido.pedido, HOJA_ANCHO_TOTAL - 47, _posY)


      //*                 ////////////////////////////////////////////////////////////////////// Rectangulo 
      _posY               += 4
      _pdf.roundedRect    (MARGEN_LEFT,_posY, MARGEN_RIGHT-MARGEN_LEFT, 40, 2, 2 )

      //*                 ////////////////////////////////////////////////////////////////////// Cliente 
      _posY               += 6
      _pdf.setFont        ('CenturyGothicBold')
      _pdf.setFontSize    (10)
      _pdf.text           ("CLIENTE:", MARGEN_LEFT + 2, _posY)

      let cliente         = this.pedido.cliente
      let clienteSplit    = _pdf.splitTextToSize(cliente, 170)
      _pdf.setFontSize    ( SIZE_FONT(cliente) ) 
      _pdf.text           (clienteSplit, MARGEN_LEFT + 30, _posY)

      //*                 ////////////////////////////////////////////////////////////////////// DIRECCIÓN 
      _posY               += 9
      _pdf.setFontSize    (10)
      _pdf.text           ("DIRECCIÓN:", MARGEN_LEFT + 2, _posY)

      _pdf.setFont        ('CenturyGothic')
      let direccion       = this.pedido.ciudad + " " + this.pedido.direccion
      let direccionSplit  = _pdf.splitTextToSize(direccion, WIDTH_BOX_FONT(direccion) )
      _pdf.setFontSize    ( SIZE_FONT(direccion) ) 
      _pdf.text           (direccionSplit, MARGEN_LEFT + 30, _posY)

      //*                 ////////////////////////////////////////////////////////////////////// INDICACIONES
      _posY               += 9
      _pdf.setFont        ('CenturyGothicBold')
      _pdf.setFontSize    (10)
      _pdf.text           ("INDICACIONES:", MARGEN_LEFT + 2, _posY)
      
      _pdf.setFont        ('CenturyGothic')
      let indicacion      = this.pedido.indicaciones
      let indicacionSplit = _pdf.splitTextToSize(indicacion, WIDTH_BOX_FONT(indicacion) )
      _pdf.setFontSize    ( SIZE_FONT(indicacion) ) 
      _pdf.text           (indicacionSplit, MARGEN_LEFT + 30, _posY)

      //*                 ////////////////////////////////////////////////////////////////////// Linea
      _posY               += 6
      _pdf.line           (MARGEN_LEFT, _posY, MARGEN_RIGHT, _posY)
      
      //*                 ////////////////////////////////////////////////////////////////////// Otros datos
      _posY               += 4
      _pdf.setFont        ('CenturyGothicBold')
      _pdf.setFontSize    (10)      
      _pdf.text           ("TELÉFONO", MARGEN_LEFT + 8, _posY)
      _pdf.text           ("NIT", MARGEN_LEFT + 50, _posY)
      _pdf.text           ("VENDEDOR", MARGEN_LEFT + 84, _posY)
      _pdf.text           ("FECHA", MARGEN_LEFT + 128, _posY)
      _pdf.text           ("ORDEN", MARGEN_LEFT + 164, _posY)
    
      _posY               += 4
      _pdf.setFont        ('CenturyGothic')

      _pdf.text           (this.pedido.telefono, MARGEN_LEFT + 8, _posY)
      _pdf.text           (this.pedido.documento, MARGEN_LEFT + 44, _posY)
      _pdf.text           (this.pedido.vendedor, MARGEN_LEFT + 79, _posY)
      _pdf.text           (this.fechaEntrega, MARGEN_LEFT + 124, _posY)
      _pdf.text           (this.pedido.codigoOrden, MARGEN_LEFT + 162, _posY)
    },

    //* /////////////////////////////////////////////////////////////////////////////////////// Generar cuerpo
    generarCuerpo()
    {
      //*                 ////////////////////////////////////////////////////////////////////// Rectangulo 
      _posY               += 4
      let altoRect        = 48
      let posXNota        = _posY + altoRect + 5
      _pdf.roundedRect    (MARGEN_LEFT,_posY, MARGEN_RIGHT-MARGEN_LEFT, altoRect, 2, 2 )
      _posY               += 4

      _pdf.setFontSize    (8)
      _pdf.setFont        ('CenturyGothicBold')
      _pdf.text           ("DESCRIPCIÓN", HOJA_ANCHO_MITAD - 25, _posY)
      _pdf.text           ("CANT", MARGEN_RIGHT - 31, _posY)
      _pdf.text           ("ESTADO", MARGEN_RIGHT - 15, _posY)

      _posY               += 2
      _pdf.line           (MARGEN_LEFT, _posY, MARGEN_RIGHT, _posY)
      
      if(!this.entregaCompleta)
      {
        _pdf.setDrawColor(100, 100, 100);
        _pdf.line         (MARGEN_LEFT+2, _posY + altoRect - 6, MARGEN_RIGHT-35, _posY )
        _pdf.setDrawColor(0, 0, 0);
      }      

      let posXLineCant    = MARGEN_RIGHT - 34
      _pdf.line           (posXLineCant, _posY, posXLineCant, _posY + altoRect - 6)
      let posXLineEstado  = MARGEN_RIGHT - 19
      _pdf.line           (posXLineEstado, _posY, posXLineEstado, _posY + altoRect - 6)

      _posY               += 4
      _pdf.setFont        ('CenturyGothic')
      for (const producto of this.pedido.productos)
      {
        if
        (
          !producto.visible
          ||
          producto.cantidad < 1
        )
        continue

        let nombre        = producto.ref + " - " + producto.nombre +
                          ( producto.nota.length > 1
                            ? " " + producto.nota
                            : ""
                          ) +
                          ( producto.descripcion.length > 1 && producto.descripcionVisible
                            ? ": " + producto.descripcion
                            : ""
                          )
        let nombreSplit   = _pdf.splitTextToSize(nombre, 162 )
        let cantidad      = producto.cantidad + " de " + producto.cantOriginal
        _pdf.text         (nombreSplit, MARGEN_LEFT + 2, _posY)
        _pdf.text         (cantidad, MARGEN_RIGHT - 33, _posY)
        _pdf.text         (producto.estado, MARGEN_RIGHT - 17, _posY)
        _posY             += ( ( nombreSplit.length > 1 ? nombreSplit.length : 0 ) * 2 ) + 5
      }


      _pdf.setFontSize    (9)
      _pdf.setFont        ('CenturyGothicBold')
      _pdf.text           ("NOTA: DECLARO QUE HE RECIBIDO LA MERCANCÍA AQUÍ DESCRITA EN PERFECTAS CONDICIONES", HOJA_ANCHO_MITAD - 73, posXNota)
    },

    //* /////////////////////////////////////////////////////////////////////////////////////// Generar pie de pagina
    generarPie(copia)
    {
      _posY               = copia == 1 ? 0 : HOJA_ALTO_MITAD
      _posY               += 132
      _pdf.line           (MARGEN_LEFT + 10, _posY, HOJA_ANCHO_MITAD - 16, _posY)
      _pdf.line           (HOJA_ANCHO_MITAD, _posY, MARGEN_RIGHT - 26, _posY)
      _posY               += 5
      _pdf.setFontSize    (10)
      _pdf.setFont        ('CenturyGothic')
      _pdf.text           ("FIRMA AUTORIZADA\n  Grupo Escom SAS", MARGEN_LEFT + 30, _posY)
      _pdf.text           ("NOMBRE Y FIRMA DE QUIEN RECIBE", HOJA_ANCHO_MITAD + 5, _posY)
      _posY               += 6
      _pdf.text           ("CC Y CARGO:", HOJA_ANCHO_MITAD + 5, _posY)
    },

    //* /////////////////////////////////////////////////////////////////////////////////////// Verificar entrega completa
    checkEntregaCompleta()
    {
      this.entregaCompleta = this.pedido.productos.every( p => p.cantidad == p.cantOriginal && p.visible)
      
      this.generarPDF()
    },

    //* /////////////////////////////////////////////////////////////////////////////////////// Configurar fuentes
    configurarFuentes()
    {      
      _pdf.addFileToVFS             ('CenturyGothic.ttf',     CenturyGothic)
      _pdf.addFont                  ('CenturyGothic.ttf',     'CenturyGothic',      'normal')
      _pdf.addFileToVFS             ('CenturyGothicBold.ttf', CenturyGothicBold)
      _pdf.addFont                  ('CenturyGothicBold.ttf', 'CenturyGothicBold',  'normal')
    },

    toggleMostrarDescripciones( on )
    {
      this.pedido.productos.forEach( p => p.descripcionVisible = on )
      this.generarPDF()
    }
  },
  //* //////////////////////////////////////////////////////////////////////////////////////////////////
  //* ////////////////////////////////////////////////////////////////////////////////////////////////// WATCH
  //* ////////////////////////////////////////////////////////////////////////////////////////////////// 
  watch:
  {
    //* /////////////////////////////////////////////////////////////////////////////////////// Cammbio en Modelo
    value:
    {
      immediate:  true,
      deep:       false,
      handler (nuevo, old)
      {
        this.pedido             = Object.assign( {}, nuevo )
        this.fechaEntrega       = new Date().toLocaleDateString("en-CA")
        this.pedido.productos.forEach(p => p.cantOriginal = p.cantidad) // Se crea la propiedad cantOriginal
        this.configurar_pdf()
        this.generarPDF()
      },
    },
  },
}
</script>
<style scoped>
.datosRemision{
  display: grid;
  gap: 0.7rem;
  grid-template-rows: auto;
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
}
.datosRemision > span{
  padding: 5px 10px;
  background-color: rgb(240, 240, 240);
}
.nombre{
  font-size: 18px;
  grid-column: 1 / span 5;
}

.celdaFull{
  grid-column: 2 / 6;
}

</style>