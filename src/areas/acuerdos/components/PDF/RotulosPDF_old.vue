<template>
  <ventana                    cerrar
    icono                     ="mdi-pdf-box"
    :titulo                   ="'Rótulos para ' + value.length + ' pedidos'"
    classMain                 ="q-pa-none items-stretch"
    @cerrar                   ="$emit('cerrar')"
    >
    <!-- //?* //////////////////////////////////////////////////////////// Lado izquierdo -->
    <div  class               ="col-5">
      <div
        :index                ="index"
        v-for                 ="(pedido, index) of pedidos"
        class                 ="q-mx-md q-my-sm q-pa-sm bg-grey-4 box-pedido"
        >
        <!-- //?* /////////////////////////////////////////////////////// Cliente -->
        <div>
          <span class         ="text-weight-bold">{{pedido.cliente}}</span>
          <q-popup-edit       v-model="pedido.cliente" auto-save @save="prosesarRotulos">
            <q-input          v-model="pedido.cliente" dense autofocus/>
          </q-popup-edit>
        </div>
        <!-- //?* /////////////////////////////////////////////////////// Metrodo y Total-->
        <div class            ="row">
          <span class         ="col-9">{{pedido.metodoEntrega}}</span>
          <span class         ="col-3 text-weight-bold">
            Total: {{ formatoPrecio( pedido.total )}}
            <q-tooltip        content-class="bg-black">Total pedido</q-tooltip>
          </span>
        </div>
        <!-- //?* /////////////////////////////////////////////////////// Ciudad -->
        <div    class         ="row">
          <span class         ="col-2 text-weight-bold">Ciudad:</span>
          <span class         ="col-10">
            {{pedido.ciudad}}
            <q-popup-edit       v-model="pedido.ciudad" auto-save @save="prosesarRotulos">
              <q-input          v-model="pedido.ciudad" dense autofocus/>
            </q-popup-edit>
          </span>
        </div>
        <!-- //?* /////////////////////////////////////////////////////// Direccion -->
        <div    class         ="row">
          <span class         ="col-2 text-weight-bold">Dirección:</span>
          <span class         ="col-10">
            {{pedido.direccion}}
            <q-popup-edit     v-model="pedido.direccion" auto-save @save="prosesarRotulos">
              <q-input        v-model="pedido.direccion" dense autofocus/>
            </q-popup-edit>
          </span>
        </div>
        <!-- //?* /////////////////////////////////////////////////////// Indicaciones -->
        <div    class         ="row">
          <span class         ="col-2 text-weight-bold">Indicaciones:</span>
          <span class         ="col-10">
            {{pedido.indicaciones}}
            <q-popup-edit     v-model="pedido.indicaciones" auto-save @save="prosesarRotulos">
              <q-input        v-model="pedido.indicaciones" dense autofocus/>
            </q-popup-edit>
          </span>
        </div>
        <!-- //?* /////////////////////////////////////////////////////// Productos -->
        <div
          :index              ="index"
          v-for               ="(producto, index) of pedido.productos"
          >
          <div  class         ="q-my-sm q-pa-sm box-producto bg-grey-3">
            <div class        ="row">
              <div class      ="col-9">
                {{producto.cantidad}} X {{producto.nombre}}
                <q-popup-edit v-model="producto.nombre" auto-save @save="prosesarRotulos">
                  <q-input    v-model="producto.nombre" dense autofocus/>
                </q-popup-edit>
              </div>

              <div class      ="col-2">
                {{formatoPrecio(producto.total) }}
                <q-tooltip    content-class="bg-black">Total productos</q-tooltip>                
              </div>
              <!-- //?* ///////////////////////////////////////////////////// Imagen -->
              <div class      ="col">
                <q-spinner-rings 
                  v-if        ="producto.imagen == 'cargando'"
                  size        ="sm"
                  color       ="grey-10"
                />
                <q-btn        flat round dense
                  v-else-if   ="!!producto.imagen"
                  size        ="sm"
                  color       ="grey-10"
                  icon        ="mdi-image"
                  >
                  <q-tooltip  content-class="bg-black">
                    <q-img    spinner-color ="white"
                      :src    ="producto.imagen"
                      style   ="width: 250px"
                    />
                  </q-tooltip>
                </q-btn>
              </div>
              <!-- //?* ///////////////////////////////////////////////////// Visibilidad producto-->
              <div  class     ="col">
                <q-btn        flat round dense
                  size        ="sm"
                  @click      ="producto.visible = !producto.visible;prosesarRotulos('visible')"
                  :color      ="producto.visible ? 'grey-10'        : 'grey-6'"
                  :icon       ="producto.visible ? 'mdi-eye-check'  : 'mdi-eye-off'"
                />
              </div>
              <!-- //?* ///////////////////////////////////////////////////// Ref proveedor -->
              <div class      ="col-12">Ref Proveedor: {{producto.ref_pro}}</div>
            </div>
            <div class        ="row">
              <!-- //?* //////////////////////////////////////////////////////// ROTULO -->
              <div
                class         ="col-4 box-rotulo bg-grey-2 q-my-sm q-pa-sm"
                :class        ="rotulo.visible ? 'text-grey-10' : 'text-grey-5'" 
                :index        ="index"
                v-for         ="(rotulo, index) of producto.rotulos"
                >
                <q-icon name  ="mdi-tag-text" />
                <!-- //?* ///////////////////////////////////////////////////// Seguro -->
                <span class="txt-rotulo">
                  {{ formatoPrecio(rotulo.seguro) }}
                <q-popup-edit v-model="rotulo.seguro" auto-save @save="prosesarRotulos">
                  <q-input    v-model="rotulo.seguro" dense autofocus/>
                </q-popup-edit>
                </span>
                <!-- //?* ///////////////////////////////////////////////////// Visibilidad rotulo -->
                <q-btn        flat round dense
                  size        ="sm"
                  @click      ="rotulo.visible = !rotulo.visible;prosesarRotulos()"
                  :color      ="rotulo.visible ? 'grey-10'        : 'grey-6'"
                  :icon       ="rotulo.visible ? 'mdi-eye-check'  : 'mdi-eye-off'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- //?* ////////////////////////////////////////////////////////// Lado derecho -->
    <div
      class                   ="col-7"
      v-if                    ="mostrarPDF"
      >
      <q-pdfviewer
        class                 ="box-pdf"
        v-model               ="mostrarPDF"
        :src                  ="src"
        type                  ="pdfjs"
      />
    </div>
  </ventana>
</template>
<script>
/*
      
      this.documento
      this.digito
      this.codigoOrden
      this.pedido
      this.idCliente
      this.idPedido
      
      
      this.nota
      
      this.productos
      this.telefono
      this.vendedor
  */
import  { mapActions  }           from "vuex";
import    ventana                 from "components/utilidades/Ventana"
import    redondear               from 'assets/js/RedondearEnteros.js'
import  { formatoPrecio }         from 'assets/js/Tools.js'
import  { jsPDF }                 from "jspdf"
import  {
          Futura
        }                         from 'assets/js/pdf/fuentes.js'

var _pdf              = new jsPDF()
const HOJA_ALTO_TOTAL   = 301
const HOJA_ANCHO_TOTAL  = 209
const HOJA_ANCHO_MITAD  = HOJA_ANCHO_TOTAL / 2
const MARGEN_TOP        = 7
const MARGEN_LEFT       = 6
const ESPACIADO         = 9
const SEPARACION_BOX    = 3
const MARGEN_RIGHT      = HOJA_ANCHO_TOTAL - MARGEN_LEFT
var _hoja               = 1
var _posY               = 0

export default {
  props:{
    value:    {  type: Array, required: true}
  },
  components: { ventana },
  data()
  {
    return {
      ventanaOk:        false,
      mostrarPDF:       false,
      pedidos:          [],
      rotulos:          [],
      src:              '',
    }
  },
  //* //////////////////////////////////////////////////////////////////////////////////////////////////
  //* ////////////////////////////////////////////////////////////////////////////////////////////////// METHODS
  //* ////////////////////////////////////////////////////////////////////////////////////////////////// 
  methods:
  {
    formatoPrecio,
    ...mapActions("productos", ["consultarImagenYRefPro"]),


    //* /////////////////////////////////////////////////////////////////////////////////////// Generar PDF
    generarPDF()
    {
      this.mostrarPDF       = false
      _posY                 = MARGEN_TOP
      _hoja                 = 1
      _pdf.setPage          (_hoja)
      let margen            = MARGEN_LEFT + 2

      for (const rotulo of this.rotulos)
      {
        if(!rotulo.visible) continue

        //* /////////////////////////////////////////////////////////////////////////////////// Salto de hoja
        if(_posY            >= HOJA_ALTO_TOTAL - 50)
        {
          _pdf.addPage() 
          _posY             = MARGEN_TOP
          _hoja++
        }

        let inicioY         = _posY
        _posY               += 7
        //* /////////////////////////////////////////////////////////////////////////////////// Envia Grupo Escom
        _pdf.setFontSize    (16)
        _pdf.text           ("Envía:  Grupo Escom SAS", margen, _posY, {renderingMode: 'fillThenStroke'}) 
        _pdf.text           ("NIT: 900419912-7 Bogotá CRR 49A # 85 - 05 Tel: 8137505 ventas@mublex.com", 55, _posY)
        _posY               += ESPACIADO
        //* /////////////////////////////////////////////////////////////////////////////////// Nombre cliente
        _pdf.setFontSize    (19)
        _pdf.text           ("Recibe: ", margen, _posY, {renderingMode: 'fillThenStroke'})
        let nombreLargo     = rotulo.cliente.length > 27
        let recibe          = rotulo.cliente +
                              (nombreLargo ? "\n" : " • ") +
                              "NIT o CC: " +
                              rotulo.documento.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
                              " • TEL: " +
                              rotulo.telefono.slice(0,3) + " " + rotulo.telefono.slice(3)
        let recibeSplit     = _pdf.splitTextToSize(recibe, 180)
        _pdf.text           (recibeSplit, 24, _posY)
        _posY               += ESPACIADO * recibeSplit.length 
        //* /////////////////////////////////////////////////////////////////////////////////// Ciudad, direcciones e indicaciones
        _pdf.setFontSize    (24)
        //* /////////////////////////////////////////////////////////////////////////////////// Ciudad 
        _pdf.text           (rotulo.ciudad, margen, _posY, {renderingMode: 'fillThenStroke'}) 
        _pdf.setFontSize    (19)
        //* /////////////////////////////////////////////////////////////////////////////////// Indicaciones
        let largoCiudad     = rotulo.ciudad.length
        let direccion       = rotulo.direccion
        let posXDireccion   = margen + (largoCiudad * 3.4)
        let direccionSplit  = _pdf.splitTextToSize(direccion, 195 - posXDireccion)
        _pdf.text           (direccionSplit, posXDireccion, _posY)
        _posY               += ESPACIADO * direccionSplit.length
        //* /////////////////////////////////////////////////////////////////////////////////// Indicaciones
        if(!!rotulo.indicaciones)
        {
          _pdf.text         ("Indicaciones:", margen, _posY, {renderingMode: 'fillThenStroke'})
          let indicaSplit   = _pdf.splitTextToSize(rotulo.indicaciones, 165)
          _pdf.text         (indicaSplit, margen + 28, _posY)
          _posY             += ESPACIADO * indicaSplit.length
        }
        //* /////////////////////////////////////////////////////////////////////////////////// Metodo envio
        _pdf.setFontSize    (24)
        _pdf.text           (rotulo.metodo, margen, _posY, {renderingMode: 'stroke'})
        //* /////////////////////////////////////////////////////////////////////////////////// Seguro y producto
        _pdf.setFontSize    (17)
        let producto        = "Seguro: $ " + rotulo.seguro.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " • "
                              + ( rotulo.cantidad > 1 ? rotulo.index + "/" + rotulo.cantidad + " " : "")
                              + rotulo.producto
        let productoSplit   = _pdf.splitTextToSize(producto, 142)
        _pdf.text           (productoSplit, 132, _posY, {align: "center"})
  
        _posY               += 5 * productoSplit.length
        //* /////////////////////////////////////////////////////////////////////////////////// Caja que rodea
        let altoCaja        = _posY - inicioY - 2
        _pdf.roundedRect    (MARGEN_LEFT, inicioY, MARGEN_RIGHT-MARGEN_LEFT, altoCaja, 2, 2 )
        _posY               += SEPARACION_BOX
      }
      this.src              = _pdf.output('bloburi')
      for (let hoja = 1; hoja <= _hoja; hoja++)
      {
        _pdf.deletePage(1)
      }
      _pdf.addPage()
      this.mostrarPDF       = true
    },

    //* /////////////////////////////////////////////////////////////////////////////////////// Configurar fuentes
    configurarFuentes()
    {      
      _pdf.addFileToVFS   ('Futura.ttf',     Futura)
      _pdf.addFont        ('Futura.ttf',     'Futura',      'normal')
      _pdf.setFont        ('Futura')
    },

    //* /////////////////////////////////////////////////////////////////////////////////////// Procesar rotulos
    prosesarRotulos( origen_ = "")
    {
      this.rotulos        = []
      for (const pedido of this.pedidos)
      {
        //console.log('%c⧭', 'color: #00a936', pedido)

        pedido.productos.forEach(p => 
        {
          p.total               = (p.precio * p.cantidad) * 1.19
          
          if(!p.rotulos)
          {
            this.$set(p, "rotulos", [])
            this.$set(p, "imagen",  "cargando")
            this.$set(p, "ref_pro", "Cargando...")

            for (let i = 1; i <= p.cantidad; i++)
            {
              p.rotulos.        push(
              {
                cantidad:       p.cantidad,
                visible:        true,
                seguro:         Math.ceil10(p.precio * 1.19, 4),
                index:          i,
              })
            }
          }
          else
          {
            if(origen_          == "visible")
              p.rotulos.forEach( r => r.visible = p.visible)
          }
          
          for(let rotulo of p.rotulos)
          {
              this.rotulos.     push(
              {
                cliente:        pedido.cliente,
                telefono:       pedido.telefono,
                ciudad:         pedido.ciudad,
                documento:      pedido.documento,
                direccion:      pedido.direccion,
                indicaciones:   pedido.indicaciones,
                metodo:         pedido.metodoEntrega,
                producto:       p.nombre,
                ref:            p.ref,
                seguro:         rotulo.seguro,
                cantidad:       rotulo.cantidad,
                visible:        rotulo.visible,
                index:          rotulo.index
              }
            )
            
          }
        });
      }
      if(origen_                == "inicio")
        this.consultarProductos()

      this.generarPDF()
    },
    //* /////////////////////////////////////////////////////////////////////////////////////// Consultar Ref proveedor y imagen
    async consultarProductos()
    {
      for(let pedido of this.pedidos)
      {
        for(let producto of pedido.productos)
        {
          let respuesta         = await this.consultarImagenYRefPro( producto.ref )

          if(!!respuesta)
          {
            producto.imagen     = respuesta[0].imagen
            producto.ref_pro    = respuesta[0].ref_pro ?? ""
          }

        }
      }
    },
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
        this.configurarFuentes()
        this.pedidos = JSON.parse( JSON.stringify(nuevo) )
        this.prosesarRotulos( "inicio" )

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

.box-pedido{
  border-left: #0e4378 groove 6px;
  border-radius: 7px;
}
.box-producto{
  border-left: #50c243 groove 6px;
  border-radius: 7px;
}
.box-rotulo{
  border-left: #3084d7 groove 6px;
  border-radius: 7px;
}
.txt-rotulo{
  font-size:  0.8em;
}
.box-pdf{
  position: sticky;
  top: 0px;
  height: 100vh;
}
</style>