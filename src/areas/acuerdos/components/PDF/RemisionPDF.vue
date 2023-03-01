<template>
  <ventana                    cerrar full-screen scroll
    titulo                    ="Remisión"
    icono                     ="mdi-pdf-box"
    class-contenido           ="row justify-start"
    padding-contenido         ="0"        
    >
    <template                 #barra>
      <q-btn
        v-if                  ="!!srcPDF"
        v-bind                ="btnBaseSm"
        icon                  ="mdi-download"
        label                 ="Descargar"
        @click                ="saveRemisionPDF"
      />
    </template>    
    <!-- //?* //////////////////////////////////////////////////////////// Lado izquierdo -->
    <div  class               ="col-5 full-height">
      <!-- //?* ////////////////////////////////////////////////////////// Datos remisión -->
      <div    class           ="datos-remision q-pa-lg">
        <div class             ="nombre text-weight-bold">{{ acuerdo.tercero.nombre }}</div>

        <div class             ="text-weight-bold">Dirección:</div>
        <div class             ="celda-full">
          {{ acuerdo.contactoEntrega.municipio.label  }}: {{ acuerdo.contactoEntrega.direccion  }}
        </div>

        <div class             ="text-weight-bold">Contacto:</div>
        <div class             ="celda-full">
          {{ acuerdo.contactoEntrega.nombreCompleto }} - {{ acuerdo.contactoEntrega.telefono  }}
        </div>
                
        <div class             ="text-weight-bold">Indicaciones:</div>
        <div class             ="celda-full">
          {{ indicaciones }}
          <q-popup-edit         v-model="indicaciones" auto-save @save="generarPDF">
            <q-input            v-model="indicaciones" dense autofocus/>
          </q-popup-edit>
        </div>
        <div class             ="text-weight-bold">Fecha:</div>
        <!-- //?* ////////////////////////////////////////////////////////////// Campo Fecha llegada --> 
        <q-input                dense filled hide-bottom-space
          type                  ="date"
          v-model               ="fechaEntrega"
          @input                ="generarPDF"
        />
        <div>
          <q-toggle             dense
            label               ="Mostrar descripción"
            v-model             ="mostrarDescripciones"
            style               ="width: 200px"
            @update:model-value ="toggleMostrarDescripciones"
          />
        </div>
      </div>
      <!-- //?* ///////////////////////////////////////////////////////// Items remisión -->
      <div class                ="row col-12 q-px-lg">
        <div
          v-for                 ="(linea, index) of lineas"
          :index                ="index"
          class                 ="row col-12 bg-grey-2 q-mb-xs"
          >
          <!-- //?* ///////////////////////////////////////////////////// Ref nombre y nota -->
          <div class            ="col-10 q-mt-xs">
            <span class         ="text-weight-bold q-pl-sm q-mr-md">
              {{linea.ref}}
            </span>
            {{linea.qty}} x {{linea.nombre}}
          </div>
          <!-- //?* ///////////////////////////////////////////////////// Estado -->
          <div>
            <q-btn              flat round dense
              color             ="grey-10"
              icon              ="mdi-gift"
              >
              <Tooltip :label   ="'Estado: ' + linea.estado"/>
            </q-btn>
            <q-popup-edit       v-model="linea.estado" auto-save>
              <q-input          v-model="linea.estado" dense autofocus @input="generarPDF"/>
            </q-popup-edit>
          </div>
          <!-- //?* ///////////////////////////////////////////////////// Descripcion -->
          <div>
            <q-btn              flat round dense
              :color            ="linea.descripcionOn ? 'grey-10' : 'grey-6'"
              icon              ="mdi-clipboard-list"
              >
              <Tooltip  label   ="Editar descripción"/>
            </q-btn>
            <q-popup-edit       v-model="linea.descripcion" auto-save>
              <q-input          dense autofocus
                v-model         ="linea.descripcion"
                style           ="width: 300px"
                type            ="textarea"
                @input          ="generarPDF"
              />
              <q-toggle
                label           ="Mostrar descripción"
                v-model         ="linea.descripcionOn"
                @input          ="generarPDF"
              />
            </q-popup-edit>
          </div>
        </div>
      </div>      
    </div>
    <div  class               ="col-7 full-height bg-grey-9 text-white">
      <q-pdfviewer
        type                  ="html5"
        :src                  ="srcPDF"
      />
    </div>           
  </ventana>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref, toRefs, watch,
            PropType            } from "vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAcuerdo            } from "../../models/Acuerdo";
  import {  ILineaLite          } from "../../models/LineaAcuerdo"
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useRemisionPDF      } from "src/areas/acuerdos/composables/useRemision"
  import {  btnBaseSm           } from "src/useSimpleOk/useEstilos"
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"

  const { getRemisionPDF,
          saveRemisionPDF   } = useRemisionPDF()        
  const props                 = defineProps({
    acuerdo:  { required: true, type: Object as PropType< IAcuerdo >  },
  })

  const { acuerdo }           = toRefs( props )
  const fechaEntrega          = ref< string   >( "" )
  const indicaciones          = ref< string   >( "" )
  const srcPDF                = ref< string   >( "" )
  const mostrarDescripciones  = ref< boolean  >( false )
  const lineas                = ref< ILineaLite[] >( [] )


  watch(()=> acuerdo.value.ref, ()=>
    {
      indicaciones.value      = acuerdo.value.contactoEntrega.nota      
      copiarLineas()
    },
    { immediate: true }
  )
  

  async function generarPDF()
  {
    console.log("generarPDF: ");
    srcPDF.value              = await getRemisionPDF( acuerdo.value, lineas.value )
  }

  function toggleMostrarDescripciones( on : boolean )
  {
    lineas.value.forEach( l => l.descripcionOn = on )
    generarPDF()
  }

  function copiarLineas()
  {
    lineas.value            = []

    for (const linea of acuerdo.value.productos)
    {
      if(linea.esTituloOsubTotal) continue

      lineas.value.push( { 
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

</script>


<style scoped>
.datos-remision{
  display: grid;
  gap: 0.7rem;
  grid-template-rows: auto;
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
}
.datos-remision > div{
  padding: 5px 10px;
  background-color: rgb(240, 240, 240);
}
.nombre{
  font-size: 18px;
  grid-column: 1 / span 5;
}

.celda-full{
  grid-column: 2 / 6;
}

</style>