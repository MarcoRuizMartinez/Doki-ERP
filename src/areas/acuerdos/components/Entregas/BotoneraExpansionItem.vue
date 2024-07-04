<template>
  <q-item-section
    v-bind                  ="$attrs"
    class                   ="col"
    >
    <div class              ="row items-center justify-between h-40px full-width">
      <div class            ="col-3 row items-center">
        <ref-acuerdo        ref-larga white
          class             ="width210"
          :acuerdo          ="entrega"
        />
      </div>
      <div class            ="col-2 text-grey-5 text-right">
          {{ entrega.contactoEntrega.municipio.label }}
      </div>
      <div class            ="col-2 text-left">
        <span class         ="q-ml-md">{{ entrega.metodoEntrega.label }}</span>
      </div>
      <!-- //* /////////////////////////////////////////////////////// Boton agregar producto  -->
      <div class            ="col-5 row gap-sm items-center justify-end">
        <!-- //* ////////////////////////////////////////////////////////// Boton Clasificar entregado -->
        <q-btn
          v-if              ="entrega.esEstadoValidado && !entrega.alertaEntrega"
          v-bind            ="style.btnBaseSm"
          color             ="positive"
          class             ="op80 op100-hover"
          icon              ="mdi-check-circle"
          label             ="Clasificar entregado"
          >          
          <confirmar  @ok   ="clasificarEntregado"/>
        </q-btn>
        <!-- //* ////////////////////////////////////////////////////////// Boton Clasificar validado -->
        <q-btn
          v-if              ="entrega.esEstadoEdicion"
          v-bind            ="style.btnBaseSm"
          class             ="op80 op100-hover"
          color             ="warning"
          icon              ="mdi-alert"
          label             ="Validar"
          @click            ="validarEntrega"
          >
        </q-btn>        
        <!-- //* ////////////////////////////////////////////////////////// Alerta -->
        <alerta :entrega/>
        <!-- //* ////////////////////////////////////////////////////////// Boton borrar-->
        <div>
          <q-btn          
            v-if            ="!entrega.esEstadoEntregado"
            v-bind          ="style.btnRedondoFlat2Sm"            
            icon            ="mdi-trash-can"
            >
            <confirmar  @ok ="borrarEntrega"/>
            <Tooltip label  ="Borrar entrega"/>
          </q-btn>
        </div>
        <!-- //* ////////////////////////////////////////////////////////// Boton Calendario -->
        <div>
          <q-btn
            v-bind          ="style.btnRedondoFlat2Sm"            
            icon            ="mdi-calendar-month"          
            @click          ="calendarioOn = true"
            >
            <Tooltip label  ="Ver eventos de la entrega"/>
          </q-btn>        
        </div>
        <!-- //* ////////////////////////////////////////////////////////// Boton Remision -->
        <div>
          <q-btn
            v-bind          ="style.btnRedondoFlat2Sm"            
            icon            ="mdi-signature-freehand"
            @click          ="emit('clickRemision')"
            >
            <Tooltip label  ="Generar remisión"/> 
          </q-btn>        
        </div>
        <!-- //* ////////////////////////////////////////////////////////// Boton rótulos -->
        <div>
          <q-btn
            v-bind          ="style.btnRedondoFlat2Sm"            
            icon            ="mdi-barcode-scan"
            @click          ="emit('clickRotulo')"
            >
            <Tooltip label  ="Generar rótulos"/>
          </q-btn>        
        </div>
        <!-- //* ////////////////////////////////////////////////////////// Boton rótulos -->
        <div>
          <span class       ="text-1_3em">{{ entrega.estadoAnimoEmoji }}
            <Tooltip :label ="'Entregar en ' + entrega.diasEntregarFormato"/>
          </span>
          <span class       ="text-1_3em">{{ !entrega.costoEnvio ?  '❓' : entrega.costoEnvioAprobado ? '✅' : '⛔' }}
            <Tooltip :label ="'Costo envió : ' + Format.precio( entrega.costoEnvio, 'decimales-no' ) + Format.siNo( entrega.costoEnvioAprobado, 'iconos' )"/>
          </span>
        </div>
        <div class          ="width100 q-ml-md">
          <!-- //* ////////////////////////////////////////////////////////// Estado entrega-->
          <estado           con-icono
            :acuerdo        ="entrega"
          />
        </div>
      </div>
    </div>
    <!-- //* //////////////////////////////// Loading edicion -->
    <q-inner-loading
      :showing              ="cargando"
      >
      <q-spinner-dots
        size                ="2em"
        color               ="white"
      />
    </q-inner-loading>
  </q-item-section>
  <!-- //* ///////////////////////////////////////////////////////////// Modal calendario de enventos de acuerdo -->
  <q-dialog
    v-model                 ="calendarioOn"
    v-bind                  ="style.dialogo"
    >
    <calendario :acuerdo    ="entrega"/>
  </q-dialog>  
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            inject,
            onMounted             } from "vue"
  //* /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreUser          } from 'stores/user'
  
  //* /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  Accion                } from "src/areas/comunicacion/models/Accion"
  import {  IAcuerdo              } from "../../models/Acuerdo"
  import {  ESTADO_ENT            } from "./../../models/ConstantesAcuerdos"
  
  //* /////////////////////////////////////////////////////////////////////////////////// Componibles  
  import {  useApiDolibarr        } from "src/composables/useApiDolibarr"
  import {  style                 } from "src/composables/useEstilos"
  import {  useTools,
            Format,
            confetiClick          } from "src/composables/useTools"

  //* /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    calendario              from "src/areas/acuerdos/components/Modales/CalendarioAcuerdos.vue"
  import    refAcuerdo              from "src/areas/acuerdos/components/Tools/RefAcuerdo.vue"
  import    estado                  from "src/areas/acuerdos/components/Tools/Estado.vue"
  import    confirmar               from "components/utilidades/MenuConfirmar.vue"
  import    alerta                  from "./Alerta.vue"

  type TProps                       = { entrega : IAcuerdo}
  const { entrega }                 = defineProps<TProps>()  
  const calendarioOn                = ref<boolean>(false)

  const { apiDolibarr             } = useApiDolibarr()  
  const { usuario                 } = storeToRefs( useStoreUser() )
  const { aviso                   } = useTools()

  type TEmit = {
    solicitarRecarga  : [ value : void]
    entregaCerrada    : [ value : void]
    clickRemision     : [ value : void]
    clickRotulo       : [ value : void]
  }

  const emit                        = defineEmits<TEmit>()
  const cargando                    = ref<boolean>(false)
  const cargandoOn                  = () => cargando.value = true
  const cargandoOff                 = () => cargando.value = false
  const accion                      = inject('accion', new Accion( usuario.value.id ))

  onMounted(()=>{
    if(entrega.esEstadoEdicion)     // Para que no haya riesgo que al comercial se le olvide validar
      validarEntrega()
  })
   
  async function clasificarEntregado( e : Event )
  {
    cargandoOn()
    confetiClick(e, 20)
    const { ok }              = await apiDolibarr("close", entrega.tipo, {notrigger:0}, entrega.id )

    if(!ok){
      aviso("negative", `Error al cerrar entrega`)
      emit("solicitarRecarga")
      return
    }
    
    entrega.estado            = ESTADO_ENT.ENTREGADO
    aviso("positive", `Entrega cerrada`)
    confetiClick(e, 20)

    accion.titulo             = usuario.value.nombre + " clasifico entregado"
    accion.elementoId         = entrega.id

    const { ok : ok2  }       = await apiDolibarr("crear", "accion", accion.accionToApiDolibarr )
    if(ok2)
      emit("entregaCerrada")
    else
      aviso("negative", `Error cerrando entrega`)

    cargandoOff()
  }

  async function validarEntrega()
  {
    cargandoOn()
    const { ok }              = await apiDolibarr("validate", entrega.tipo, {notrigger:0}, entrega.id )
    if(ok){      
      entrega.estado          = ESTADO_ENT.VALIDADO
    }
    else{
      aviso("negative", `Error al validar entrega`)
    }
    
    emit("solicitarRecarga")
    cargandoOff()
  }



  async function borrarEntrega()
  {
    cargandoOn()
    const { ok }              = await apiDolibarr("borrar", entrega.tipo, entrega.id )
    if(ok){
      aviso("positive", `Entrega eliminada`)
      emit("solicitarRecarga")
      
    }
    else
      aviso("negative", `Error al eliminar entrega`)

    cargandoOff()
  }
</script>