<template>
  <ventana                            cerrar full-screen scroll
    titulo                            ="Rótulos"
    icono                             ="mdi-barcode-scan"
    class-contenido                   ="row justify-start"
    padding-contenido                 ="0"        
    >
    <template                         #barra>
      <q-btn
        v-if                          ="!!srcPDF"
        v-bind                        ="style.btnBaseSm"
        icon                          ="mdi-download"
        label                         ="Descargar"
        @click                        ="saveRotulosPDF"
      />
    </template>    
    <!-- //?* //////////////////////////////////////////////////////////// Lado izquierdo -->
    <div  class                       ="col-5 full-height">
      <q-scroll-area
        style                         ="height: 91vh; max-width : 100%;"
        >
        <div
          :index                      ="index"
          v-for                       ="(entrega, index) of entregas"
          class                       ="column box-pedido bg-grey-4 q-mx-md q-my-sm q-pa-sm"
          >
          <!-- //?* //////////////////////////////////////////////////////// Valores de entrega -->
          <table  class               ="fit tabla">
            <tr>
              <th>Datos de entrega</th>
              <th></th>
              <th></th>
            </tr>
            <td-edit
              v-model                 ="entrega.ref"
              titulo                  ="Ref"
            />          
            <td-edit                  editar
              v-model                 ="entrega.tercero.nombre"
              titulo                  ="Nombre"
              @save                   ="generarPDF"
            />
            <td-edit
              v-model                 ="entrega.metodoEntrega.label"
              titulo                  ="Método"
            />
            <td-edit                  precio
              v-model                 ="entrega.totalConIva"
              titulo                  ="Total"
            />
            <td-edit                  editar
              v-model                 ="entrega.contactoEntrega.municipio.municipio"
              titulo                  ="Municipio"
              @save                   ="generarPDF"
            />
            <td-edit                  editar
              v-model                 ="entrega.contactoEntrega.direccion"
              titulo                  ="Dirección"
              @save                   ="generarPDF"
            />
            <td-edit                  editar
              v-model                 ="entrega.contactoEntrega.nota"
              titulo                  ="Indicaciones"
              @save                   ="generarPDF"
            />
            <td-edit
              v-model                 ="entrega.contactoEntrega.nombres"
              titulo                  ="Contacto"
              @save                   ="generarPDF"
            />
            <td-edit                  editar
              v-model                 ="entrega.contactoEntrega.telefono"
              titulo                  ="Teléfono contacto"
              @save                   ="generarPDF"
            />          
          </table>
          <!-- //?* //////////////////////////////////////////////////////// Productos -->
          <div
            v-for                     ="(producto, index) of entrega.productos"      
            :index                    ="index"
            class                     ="column"
            >
            <div
              class                   ="box-producto q-my-sm q-pa-sm bg-grey-3"
              :class                  ="{ 'op30' : !producto.visible}"
              >
              <div class              ="row no-wrap items-center q-mb-sm">
                <!-- //?* //////////////////////////////////////////////////////// Imagen -->
                <imagen               float
                  class               ="col-shrink q-mr-sm"
                  size                ="xs"
                  :imagen             ="producto.img"
                  :nombre             ="producto.nombre"
                />
                <!-- //?* //////////////////////////////////////////////////////// Ref, Nombre y Cantidad -->
                <div class            ="col text-bold text-grey-8">
                  <div class          ="width360 ellipsis">
                    {{producto.qty}} X {{producto.ref}} {{producto.nombre}}
                    <Tooltip :label   ="producto.nombre"/>
                  </div>
                  <q-popup-edit       auto-save
                    v-model           ="producto.nombre"
                    v-slot            ="scope"
                    @save             ="generarPDF"
                    >
                    <q-input          dense autofocus
                      v-model         ="producto.nombre"  
                      @keyup.enter    ="scope.set"
                    />
                  </q-popup-edit>
                </div>
                <!-- //?* //////////////////////////////////////////////////////// Total producto -->
                <div class            ="col-shrink fuente-mono text-right text-bold">
                  {{Format.precio(producto.precioBase, "decimales-no") }}
                  <q-popup-edit       auto-save
                    v-model           ="producto.precioBase"
                    v-slot            ="scope"
                    @save             ="generarPDF"
                    >
                    <!-- //* ///////////////////////////////////////////////////////////// Valor -->
                    <input-number     no-undefined alerta solo-positivo 
                      v-model         ="producto.precioBase"
                      label           ="Valor"
                      tipo            ="precio"                    
                      icon            ="mdi-cash-usd"
                      debounce        ="2500"
                      :minimo         ="0"
                      @keyup.enter    ="scope.set"
                    />
                  </q-popup-edit>                
                  <Tooltip label      ="Editar Valor unitario sin IVA"/>
                </div>
                <!-- //* ///////////////////////////////////////////////////////////// Boton producto visible en PDF -->
                <btn-toggle
                  v-model             ="producto.visible"
                  icon-true           ="mdi-eye-check"
                  icon-false          ="mdi-eye-off"
                  msj-true            ="Ocultar producto"
                  msj-false           ="Mostrar producto"
                  color-true          ="green-10"
                  color-false         ="grey-6"
                  size                ="sm"
                  @click              ="generarPDF"
                />
              </div>
              <!-- //?* ///////////////////////////////////////////////////////////// ROTULOS segun cantidad de productos -->
              <div class              ="row q-col-gutter-sm">
                <div
                  v-for               ="i in producto.qty"
                  :index              ="i"
                  class               ="col-3"
                  >
                  <div class          ="box-rotulo row justify-between bg-grey-2 q-pa-sm">
                    <q-icon name      ="mdi-tag-text" />
                    <!-- //?* ///////////////////////////////////////////////////// Seguro -->
                    <span class       ="text-0_8em text-right">
                      {{ Format.precio( producto.precioBaseConIVA, 'decimales-no' ) }}
                    </span>
                  </div>
                </div>
                <div class            ="col-auto">
                  <q-btn
                    v-bind            ="style.btnRedondoFlat2Md"
                    icon              ="mdi-tag-plus"
                    @click            ="()=>{ producto.qty++;generarPDF();}"
                    >
                    <Tooltip label    ="Agregar rotulo"/>
                  </q-btn>
                </div>
              </div>            
            </div>
          </div>        
        </div>
      </q-scroll-area>
    </div>
    <div  class                       ="col-7 full-height bg-grey-9 text-white">
      <q-pdfviewer
        :type                         ="esMobil ? 'pdfjs' : 'html5'"
        :src                          ="srcPDF"
      />
    </div>           
  </ventana>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            onMounted           } from "vue"

  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAcuerdo, Acuerdo   } from "../../models/Acuerdo";
  import {  LineaAcuerdo        } from "src/areas/acuerdos/models/LineaAcuerdo"  
  import {  Contacto            } from "src/areas/terceros/models/Contacto"  
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useRotulosPDF       } from "src/areas/acuerdos/composables/pdf/useRotulos"
  import {  style               } from "src/composables/useEstilos"
  import {  useTools, Format    } from "src/composables/useTools"

  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"
  import    tdEdit                from "components/utilidades/TrTdEdit.vue"
  import    imagen                from "src/areas/productos/components/Tools/ImagenProducto.vue"
  import    btnToggle             from "components/utilidades/BtnToggle.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"

  const { getRotulosPDF,
          saveRotulosPDF    } = useRotulosPDF()
  const {  esMobil          } = useTools()
  
  type TProps                 = {
    acuerdos                  : IAcuerdo[]
  }

  const { acuerdos}           = defineProps<TProps>()
  const entregas              = ref< IAcuerdo[] >( [] )

  onMounted(()=>{
    copiarListado()
    generarPDF()
  })

  function copiarListado()
  {
    for (const e of acuerdos)
    {
      const entrega                 = new Acuerdo()
      entrega.ref                   = e.ref
      entrega.tercero.nombre        = e.tercero.nombre
      entrega.metodoEntrega.label   = e.metodoEntrega.label
      entrega.tercero.documento     = e.tercero.documento

      const contacto                = new Contacto()
      contacto.nombres              = e.contactoEntrega.nombreCompleto
      contacto.telefono             = e.contactoEntrega.telefonos
      contacto.direccion            = e.contactoEntrega.direccion
      contacto.nota                 = e.contactoEntrega.nota
      contacto.municipio.municipio  = e.contactoEntrega.municipio.label
      entrega.contactoEntrega       = contacto

      for (const p of e.productos)
      {
        const linea                 = new LineaAcuerdo()
        linea.precioBase            = p.precioBase
        linea.descuentoX100         = p.descuentoX100
        linea.iva                   = p.iva
        linea.nombre                = p.nombre
        linea.qty                   = p.qty
        linea.ref                   = p.ref
        linea.img                   = p.img

        entrega.productos.push( linea )
      }

      entregas.value.push( entrega )
    }
  }

  const srcPDF                = ref< string >( "" )

  function prosesarRotulos( origen_ : string = "")
  {
  }


  async function generarPDF() {
    srcPDF.value              = await getRotulosPDF( entregas.value  )
  }
</script>


<style scoped>

  table th:first-child {
    width: 120px;
  }

  table th{
    text-align: left;
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
</style>

