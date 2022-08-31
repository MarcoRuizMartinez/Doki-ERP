<template>
  <ventana                  minimizar
    titulo                  ="Totales"
    icono                   ="mdi-counter"
    class-contenido         ="q-col-gutter-sm"
    >
    <div
      v-if                  ="!!cotizacion.id"
      class                 ="col-12 row">
      <!-- //* /////////////////////////////////////////////////////////////  Con Total -->
      <q-toggle             dense
        v-model             ="cotizacion.conTotal"
        label               ="Con Total"
        class               ="col-4"
        @update:model-value ="editarConTotal"
      />
      <!-- //* /////////////////////////////////////////////////////////////  Con IVA -->
      <q-toggle             dense
        v-model             ="cotizacion.conIVA"
        label               ="Con IVA"
        class               ="col-4"
        :icon               ="cargandoConIVA ? 'mdi-loading mdi-spin' : ''"
        :disable            ="cotizacion.tercero.aplicaIVA || cargandoConIVA" 
        @update:model-value ="editarConIVA"
      />
      <!-- //* /////////////////////////////////////////////////////////////  Con AIU -->
      <q-toggle             dense
        v-model             ="cotizacion.aiuOn"
        label               ="Con AIU"
        class               ="col-4"
        @update:model-value ="editarAIU"
      />
    </div>
    <!-- //* /////////////////////////////////////////////////////////////  Nombre cotizacion -->
    <transition             enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown" mode="out-in">
      <div
        v-if                ="cotizacion.aiuOn"
        class               ="col-12 row q-col-gutter-sm"
        >
        <div class          ="col-4">
          <input-number     conDecimales
            v-model         ="cotizacion.aiuAdmin"
            label           ="Administración"
            :paso           ="0.1"
            @update:model-value="(valor)=> editarValorAIU(valor, 'aiuAdmin')"
          />
          <div  class       ="fuente-mono text-grey-8 text-center"
            >
            {{ formatoPrecio( cotizacion.aiuAdminValor ) }}
          </div>
        </div>
        <div class          ="col-4">
          <input-number     conDecimales
            v-model         ="cotizacion.aiuImpre"
            label           ="Imprevistos"
            :paso           ="0.1"
            @update:model-value="(valor)=> editarValorAIU(valor, 'aiuImpre')"
          />
          <div  class       ="fuente-mono text-grey-8 text-center"
            >
            {{ formatoPrecio( cotizacion.aiuImpreValor ) }}
          </div>
        </div>
        <div class          ="col-4">
          <input-number     conDecimales
            v-model         ="cotizacion.aiuUtili"
            label           ="Utilidad"
            :paso           ="0.1"
            @update:model-value="(valor)=> editarValorAIU(valor, 'aiuUtili')"
          />
          <div  class       ="fuente-mono text-grey-8 text-center"
            >
            {{ formatoPrecio( cotizacion.aiuUtiliValor ) }}
          </div>          
        </div>
      </div>
    </transition>
     <!-- //* ///////////////////////////////////////////////////////////// Tabla totales -->
    <div        class       ="col-12">
      <div      class       ="row justify-center bg-grey-3 rounded-borders transi"
                :class      ="{ 'op40' : !cotizacion.conTotal } ">
        <table  class       ="tabla-totales">
          <tr>
            <td>Subtotal bruto:</td>
            <td>{{ formatoPrecio( cotizacion.totalSinDescu )}}</td>
          </tr>
          <tr>
            <td>Descuento:</td>
            <td>{{ formatoPrecio( cotizacion.descuentoValor )}}</td>
          </tr>
          <tr>
            <td>Subtotal neto:</td>
            <td>{{ formatoPrecio( cotizacion.totalConDescu )}}</td>
          </tr>
          <tr v-if="cotizacion.aiuOn">
            <td>AIU:</td>
            <td>{{ formatoPrecio( cotizacion.aiuTotal )}}</td>
          </tr>          
          <tr>
            <td>IVA:</td>
            <td>{{ formatoPrecio( cotizacion.ivaValor )}}</td>
          </tr>        
          <tr>
            <td>TOTAL:</td>
            <td>{{ formatoPrecio( cotizacion.totalConIva )}}</td>
          </tr>       
        </table>
      </div>
    </div>      
  </ventana>
</template>
<script setup lang="ts">
  import    ventana             from "components/utilidades/Ventana.vue"
  import    inputNumber         from "src/components/utilidades/input/InputFormNumber.vue"
  import    fechaVencimiento    from "src/areas/acuerdos/cotizaciones/components/FechaValidezCtz.vue"
  import    selectLabelValue    from "components/utilidades/select/SelectLabelValue.vue"
  import {  formatoPrecio     } from "src/useSimpleOk/useTools" 

  import {  ref,
            toRefs,
            PropType,
                              } from "vue"
  import {  ICotizacion,
            Cotizacion        } from "src/areas/acuerdos/cotizaciones/models/Cotizacion"    
  import {  ITercero,
            Tercero           } from "src/areas/terceros/models/Tercero"
  import {  servicesCotizaciones   } from "src/areas/acuerdos/cotizaciones/services/servicesCotizaciones"
  import {  useTools          } from "src/useSimpleOk/useTools"
  import {  useApiDolibarr    } from "src/services/useApiDolibarr"

  const terceros                = ref< ITercero[] > ([])
  const { aviso               } = useTools()
  const { setAiu,
          setTotal,
          setConIVA           } = servicesCotizaciones()
  const { apiDolibarr         } = useApiDolibarr()
  const emit                    = defineEmits(["update:cotizacion"])
  const cargandoConIVA          = ref<boolean>(false)
  const props                   = defineProps({
    cotizacion: { required: true, type: Object as PropType< ICotizacion > },
  })
  const { cotizacion }          = toRefs( props )
  

  async function editarAIU( on : boolean )
  {
    let ok                      = await setAiu( cotizacion.value.id, +on, "aiu" )
    if(ok) aviso("positive", "AIU " + ( on ? "activado" : "desactivado" ))
  }

  async function editarValorAIU( valor : number, tipo : "aiuAdmin" | "aiuImpre" | "aiuUtili" )
  {
    let ok                      = await setAiu( cotizacion.value.id, valor, tipo )
    //if(!ok) aviso("positive", "AIU modificado")
  }
  
  async function editarConTotal( on : boolean )
  {
    let ok                      = await setTotal( cotizacion.value.id, on )
    if(ok) aviso("positive", "Total " + ( on ? "activado" : "desactivado" ))
  }

  async function editarConIVA( on : boolean )
  {
    cargandoConIVA.value        = true
    let conIVAEditado           = await setConIVA( cotizacion.value.id, on )
    
    for (const linea of cotizacion.value.productos)
    {
      const iva                 = parseInt( process.env.IVA ?? "0" )
      linea.iva                 =  on ? iva : 0
      let lineaEdit             = { id: linea.lineaId, tva_tx: linea.iva }
      let {ok}                  = await apiDolibarr("editar", "lineaCotizacion", lineaEdit, cotizacion.value.id )
      if (!ok){ 
        const error             = "Error al cambiar el IVA del producto"
        console.trace()
        console.error(error)
        aviso("negative", error)
      }
    }
    
    if(conIVAEditado) aviso("positive", "IVA " + ( on ? "activado" : "desactivado" ))
    cargandoConIVA.value        = false
  }


</script>