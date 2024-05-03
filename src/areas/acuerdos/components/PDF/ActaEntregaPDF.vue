<template>
  <ventana                          cerrar full-screen scroll
    titulo                          ="Acta de entrega"
    icono                           ="mdi-book-check"
    class-contenido                 ="row justify-start"
    padding-contenido               ="0"        
    >
    <template                       #barra>
      <q-btn
        v-if                        ="!!srcPDF"
        v-bind                      ="style.btnBaseSm"
        icon                        ="mdi-download"
        label                       ="Descargar"
        @click                      ="saveActaPDF"
      />
    </template>
    <!-- //?* //////////////////////////////////////////////////////////// Lado izquierdo -->
    <div  class                     ="col-5 full-height">
      <q-scroll-area style          ="height: 91vh; max-width : 100%;">
        <div    class               ="row q-pa-lg q-col-gutter-sm datos-remision">
          <div class                ="col-12 text-h5 text-center text-uppercase">Datos de acta</div>
          <!-- //* ///////////////////////////////////////////////// Dirección -->
          <input-text
            v-model                 ="datos.direccion"
            label                   ="Dirección"
            icon                    ="mdi-office-building-marker"
            class                   ="col-12"
            @update:model-value     ="generarPDF"
          />
          <!-- //* ///////////////////////////////////////////////// Fecha Creacion -->
          <input-fecha              alerta
            v-model                 ="datos.fechaInicio"
            label                   ="Fecha Inicio"
            class                   ="col-6"
            :hasta                  ="datos.fechaEntrega"
            @update:model-value     ="generarPDF"
          />
          <input-fecha              alerta
            v-model                 ="datos.fechaEntrega"
            label                   ="Fecha entrega"
            class                   ="col-6"
            :desde                  ="datos.fechaInicio"
            @update:model-value     ="generarPDF"
          />        
          <!-- //?* ////////////////////////////////////////////////////////////// Mostrar Descripciones--> 
          <div class                ="col-6 q-pt-md">
            <q-toggle                   
              label                 ="Con total"
              v-model               ="datos.conTotal"
              @update:model-value   ="generarPDF"
            />
          </div>
        </div>
        <!-- //?* ///////////////////////////////////////////////////////// Items remisión -->
        <div class                  ="row col-12 q-px-lg">
          <div
            v-for                   ="(linea, index) of datos.lineas"
            :index                  ="index"
            class                   ="row col-12 bg-grey-2 q-mb-xs"
            >
            <!-- //?* ///////////////////////////////////////////////////// Ref nombre y nota -->
            <div class              ="col-12 q-mt-xs row q-col-gutter-sm">
              <div class            ="col-3 text-weight-bold"> {{linea.ref}} </div>
              <div class            ="col-9"> {{linea.qty}} x {{linea.nombre}}</div>
            </div>
          </div>
        </div>              
      </q-scroll-area>
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
            PropType            } from "vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAcuerdo            } from "../../models/Acuerdo"
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  IParams,
            useActaPDF          } from "src/areas/acuerdos/composables/pdf/useActaEntrega"
  import {  style               } from "src/composables/useEstilos"
  import {  useTools            } from "src/composables/useTools"
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"
  import    inputFecha            from "components/utilidades/input/InputFecha.vue"
  import    inputText             from "components/utilidades/input/InputFormText.vue"

  const { getActaPDF,
          saveActaPDF       } = useActaPDF()
  const { esMobil           } = useTools()
  const props                 = defineProps({
    acuerdo:  { required: true, type: Object as PropType< IAcuerdo >  },
  })

  const { acuerdo }           = toRefs( props )
  const srcPDF                = ref< string   >( "" )
  const datos                 = ref< IParams  >( {
    lineas                    : [],
    direccion                 : "",
    fechaInicio               : acuerdo.value.fechaCreacion,
    fechaEntrega              : new Date(),
    conTotal                  : true,
    dosHojas                  : false,
  } )
  

  watch(()=> acuerdo.value.ref, ()=>
  {
      datos.value.direccion   = !!acuerdo.value.entregas.length && !!acuerdo.value.entregas[0].contactoEntrega.direccion
                                ? acuerdo.value.entregas[0].contactoEntrega.direccion
                                : acuerdo.value.tercero.direccion

      copiarLineas()
    },
    { immediate: true }
  )

  async function generarPDF() {        
    srcPDF.value              = await getActaPDF( acuerdo.value, datos.value  )
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
        nombre        : linea.nombreConExtra,
        estado        : "Nuevo",
        descripcion   : linea.descripcion,
        descripcionOn : true,
        qty           : linea.qty,
        qtyTotal      : linea.qtyTotal,
        unidad        : linea.unidad.sigla,
      } )
    }

    generarPDF()
  }
</script>