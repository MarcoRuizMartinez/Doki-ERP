<template>
  <ventana                          cerrar full-screen scroll
    titulo                          ="Remisión"
    icono                           ="mdi-signature-freehand"
    class-contenido                 ="row justify-start"
    padding-contenido               ="0"        
    >
    <template                       #barra>
      <q-btn
        v-if                        ="!!srcPDF"
        v-bind                      ="style.btnBaseSm"
        icon                        ="mdi-download"
        label                       ="Descargar"
        @click                      ="saveRemisionPDF"
      />
    </template>
    <!-- //?* //////////////////////////////////////////////////////////// Lado izquierdo -->
    <div  class                     ="col-5 full-height">
      <div    class                 ="row q-pa-lg q-col-gutter-sm datos-remision">
        <div class                  ="col-12 text-h5 text-center text-uppercase">Datos de remisión</div>
        <!-- //* ///////////////////////////////////////////////// Dirección -->
        <input-text
          v-model                   ="datos.direccion"
          label                     ="Dirección"
          icon                      ="mdi-office-building-marker"
          class                     ="col-12"
          @update:model-value       ="generarPDF"
        />
        <!-- //* ///////////////////////////////////////////////// Indicaciones -->
        <input-text
          v-model                   ="datos.indicaciones"
          label                     ="Indicaciones"
          icon                      ="mdi-sign-direction"
          class                     ="col-12"
          @update:model-value       ="generarPDF"
        />
        <!-- //* ///////////////////////////////////////////////// Fecha Creacion -->
        <input-fecha                
          v-model                   ="datos.fechaEntrega"
          label                     ="Fecha entrega"
          class                     ="col-6"
          @update:model-value       ="generarPDF"
        />
        <!-- //* ///////////////////////////////////////////////// Paquetes -->
        <input-number               no-undefined alerta solo-positivo 
          v-model                   ="datos.paquetes"
          label                     ="Paquetes"
          class                     ="col-6"
          icon                      ="mdi-package-variant-closed"
          debounce                  ="1400"
          :paso                     ="1"
          :minimo                   ="0"
          @update:model-value       ="generarPDF"
        />
        <!-- //?* ////////////////////////////////////////////////////////////// Mostrar Descripciones--> 
        <div class                  ="col-3 q-pt-md">
          <q-toggle                   
            label                   ="Con descripción"
            v-model                 ="datos.conDescripcion"
            @update:model-value     ="toggleMostrarDescripciones"
          />
        </div>
        <div class                  ="col-3 q-pt-md">
          <q-toggle                   
            label                   ="Hoja completa"
            v-model                 ="datos.dosHojas"
            @update:model-value     ="generarPDF"
          />
        </div>
        <div class                  ="col-3 q-pt-md">
          <q-toggle                   
            v-model                 ="datos.sinDatosNuestros"
            label                   ="Sin datos nuestros"
            @update:model-value     ="generarPDF"
          />
        </div>
        <div class                  ="col-3 q-pt-md">
          <q-toggle                   
            v-model                 ="datos.paraTransportadora"
            label                   ="Para transportadora"
            :disable                ="!acuerdo.transportadora.id"
            @update:model-value     ="cambiarParaTransportadora"
          />
        </div>
      </div>
      <!-- //?* ///////////////////////////////////////////////////////// Items remisión -->
      <div class                    ="row col-12 q-px-lg">
        <div
          v-for                     ="(linea, index) of datos.lineas"
          :index                    ="index"
          class                     ="row col-12 bg-grey-2 q-mb-xs"
          >
          <!-- //?* ///////////////////////////////////////////////////// Ref nombre y nota -->
          <div class                ="col-10 q-mt-xs row q-col-gutter-sm">
            <div class              ="col-3 text-weight-bold"> {{linea.ref}} </div>
            <div  class             ="col-9"> {{linea.qty}} x {{linea.nombre}} </div>            
          </div>
          <!-- //?* ///////////////////////////////////////////////////// Estado -->
          <div>
            <q-btn                  flat round dense
              color                 ="grey-10"
              icon                  ="mdi-gift"
              >
              <Tooltip :label       ="'Estado: ' + linea.estado"/>
            </q-btn>
            <q-popup-edit           auto-save buttons
              v-model               ="linea.estado" 
              v-slot                ="scope"
              @update:model-value ="generarPDF"
              >
              <q-input              dense autofocus
                v-model             ="scope.value"
                @keyup.enter        ="scope.set"
              />
            </q-popup-edit>            
          </div>
          <!-- //?* ///////////////////////////////////////////////////// Descripcion -->
          <div>
            <q-btn                  flat round dense
              :color                ="linea.descripcionOn ? 'grey-10' : 'grey-6'"
              icon                  ="mdi-clipboard-list"
              >
              <Tooltip  label       ="Editar descripción"/>
            </q-btn>
            <q-popup-edit           auto-save buttons
              v-model               ="linea.descripcion" 
              v-slot                ="scope"
              @update:model-value   ="generarPDF"
              >
              <q-input              dense autofocus
                v-model             ="scope.value"
                style               ="width: 300px"
                type                ="textarea"
              />
              <q-toggle
                label               ="Mostrar descripción"
                v-model             ="linea.descripcionOn"
                @update:model-value ="generarPDF"
              />              
            </q-popup-edit>
          </div>
        </div>
      </div>      
    </div>
    <div  class                     ="col-7 full-height bg-grey-9 text-white">
      <q-pdfviewer
        :type                       ="esMobil ? 'pdfjs' : 'html5'"
        :src                        ="srcPDF"
      />
    </div>           
  </ventana>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            toRefs,
            watch,
            onMounted,
            PropType            } from "vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAcuerdo            } from "../../models/Acuerdo";
  import {  ITercero, Tercero   } from "src/areas/terceros/models/Tercero";
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  IParams,
            useRemisionPDF      } from "src/areas/acuerdos/composables/pdf/useRemision"
  import {  style               } from "src/composables/useEstilos"
  import {  useTools            } from "src/composables/useTools"
  import {  servicesTerceros    } from "src/areas/terceros/services/servicesTerceros"
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"
  import    inputFecha            from "components/utilidades/input/InputFecha.vue"
  import    inputText             from "components/utilidades/input/InputFormText.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"

  const { getRemisionPDF,
          saveRemisionPDF   } = useRemisionPDF()
  const {  esMobil          } = useTools()
  const { buscarTercero     } = servicesTerceros()
  const props                 = defineProps({
    acuerdo:  { required: true, type: Object as PropType< IAcuerdo >  },
  })

  const { acuerdo }           = toRefs( props )
  const srcPDF                = ref< string   >( "" )
  const transportadora        = ref< ITercero >( new Tercero() )
  const datos                 = ref< IParams  >( {
    lineas                    : [],
    direccion                 : "",
    indicaciones              : "",
    fechaEntrega              : new Date(),
    conDescripcion            : false,
    dosHojas                  : false,
    metodo                    : "",
    paquetes                  : 0,
    paraTransportadora        : false,
    transportadora            : "",
    sinDatosNuestros          : false,
  } )
  

  onMounted(()=>{
    if(acuerdo.value.productos.length > 8){
      datos.value.dosHojas    = true
      generarPDF()
    }
  })

  watch(()=> acuerdo.value.ref, ()=>
    {
      datos.value.direccion   = acuerdo.value.contactoEntrega.direccion
      datos.value.indicaciones= acuerdo.value.contactoEntrega.nota
      copiarLineas()
    },
    { immediate: true }
  )

  async function generarPDF() {
    datos.value.metodo        = acuerdo.value.metodoEntrega.label
    srcPDF.value              = await getRemisionPDF( acuerdo.value, datos.value  )
  }

  function toggleMostrarDescripciones( on : boolean ) {
    datos.value.lineas.forEach( l => l.descripcionOn = on )
    generarPDF()
  }

  function copiarLineas()
  {
    datos.value.lineas  = []

    for (const linea of acuerdo.value.productos)
    {
      if(linea.esTituloOsubTotal) continue

      datos.value.lineas.push( { 
        id            : linea.lineaId,
        ref           : linea.ref,
        nombre        : linea.nombre,
        estado        : "Nuevo",
        descripcion   : linea.descripcion,
        descripcionOn : true,
        qty           : linea.qty,
        qtyTotal      : linea.qtyTotal,
      } )
    }

    generarPDF()
  }

  async function cambiarParaTransportadora()
  {
    if(datos.value.paraTransportadora){
      transportadora.value        = await buscarTercero( acuerdo.value.transportadora.id )
      datos.value.transportadora  = transportadora.value.nombre + " " + transportadora.value.documento.label
    }
    generarPDF()
  }
</script>