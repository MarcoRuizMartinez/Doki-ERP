<template>
  <barra  class               ="row justify-between">
    <!-- //* ////////////////////////////////////////////////////////////////////  Lado izquierdo -->
    <div class                ="row gap-sm">
      <q-btn
        v-if                  ="(acuerdo.esPedido || acuerdo.esCotizacion) && !acuerdo.esEstadoBoceto && ( acuerdo.usuarioEsDueño || usuario.esGerencia || usuario.esContable )"
        v-bind                ="style.btnBaseMd"
        color                 ="primary"
        icon                  ="mdi-account-details"
        :label                ="esMobil ? '' : 'Comisiones'"
        :disable              ="cargandoAlgo"     
        @click                ="emit('clickComisiones')"   
        >
        <Tooltip label        ="Calculo de comisiones"/>
      </q-btn>
    </div>
    <!-- //* ////////////////////////////////////////////////////////////////////  Lado Derecho -->
    <div class                ="row gap-sm">
      <!-- //* //////////////////////////////////////////////////////////  Notas acuerdo -->
      <efecto efecto          ="Down">      
        <q-btn                dense round flat
          v-if                ="acuerdo.esPedido"
          icon                ="mdi-comment-multiple"
          color               ="white"
          class               ="q-mr-sm"
          @click              ="clickEnNotas"
          >
          <q-badge            floating transparent
            v-if              ="!!totalNotas"
            color             ="red"
            >
            {{ totalNotas }}
          </q-badge>
          <Tooltip>
            <div
              v-if            ="!!totalNotas"
              class           ="text-center"
              style           ="max-width: 300px; min-width: 200px;"
              >
              <div v-if       ="!!acuerdo.notaPrivada">
                <div class    ="text-bold text-uppercase">Nota privada</div>
                {{acuerdo.notaPrivada}}
              </div>
              <div v-if       ="!!acuerdo.notaPublica">
                <div class    ="text-bold text-uppercase">Nota publica</div>
                {{acuerdo.notaPublica}}
              </div>
              <div>
                🔽
              </div>            
            </div>
            <template v-else>
              Agregar una nota 📝
            </template>
          </Tooltip>
        </q-btn>
      </efecto>
      <!-- //* //////////////////////////////////////////////////////////  Boton Orden fabricacion -->
      <efecto efecto          ="Down">      
        <q-btn
          v-if                ="acuerdo.esEstadoAbierto && acuerdo.esPedido"
          v-bind              ="style.btnBaseMd"
          color               ="primary"
          icon                ="mdi-tools"  
          target              ="_blank"
          :href               ="acuerdo.urlDolibarrOC"
          :label              ="esMobil ? '' : 'OC Proveedor'"
          :disable            ="cargandoAlgo"        
          >
          <Tooltip label      ="Generar pedidos a proveedor"/>
        </q-btn>
      </efecto>    
      <!-- //* //////////////////////////////////////////////////////////  Boton PDF -->
      <efecto efecto          ="Down">      
        <q-btn
          v-if                ="acuerdo.esEstadoValido"
          v-bind              ="style.btnBaseMd"
          color               ="primary"
          icon                ="mdi-pdf-box"
          :label              ="esMobil ? '' : acuerdo.esEntrega ? 'Remisión' : 'PDF'"
          :disable            ="cargandoAlgo"
          :loading            ="loading.pdf"          
          >
          <q-menu
            v-bind            ="menuDefault"
            class             ="column transparent panel-blur70 " 
            >
            <q-btn
              v-if            ="!!labelBtnPDFDefault"
              v-bind          ="style.btnSimple"
              :label          ="labelBtnPDFDefault"
              @click          ="pdfDefault"
            />
            <q-btn
              v-if            ="acuerdo.esCotizacion || acuerdo.esPedido"
              v-bind          ="style.btnSimple"
              label           ="Cuenta de cobro"
              @click          ="emit('clickCuentaCobro', 'cuentaCobro')"
            />
          </q-menu>          
        </q-btn>
      </efecto>
        <!-- //* ////////////////////////////////////////////////////////// Botones Instalacion y entrega
          v-if              ="acuerdo.hayServicios"
        -->
        <q-btn-group  v-if    ="acuerdo.esEstadoAbierto && acuerdo.esPedido && !acuerdo.esTerceroCtz">
          <!-- //* //////////////////////////////////////////////////////// Botones Instalacion -->
          <q-btn
            v-bind            ="style.btnBaseMd"
            color             ="positive"
            icon              ="mdi-run-fast"
            :label            ="esMobil ? '' : 'Nueva instalación'"
            :disable          ="cargandoAlgo"
            :loading          ="loading.aprobar"
            target            ="_blank"
            :href             ="acuerdo.urlDolibarrNuevaInsta"
            >
            <Tooltip label    ="Generar nueva instalación"/>
          </q-btn>
          <!-- //* ////////////////////////////////////////////////////////// Boton Entrega  -->
          <q-btn 
            v-bind            ="style.btnBaseMd"
            color             ="positive"
            icon              ="mdi-truck-fast"
            :label            ="esMobil ? '' : 'Nueva entrega'"
            :loading          ="loading.anular"
            @click            ="emit('clickNuevaEntrega')"
            > 
            <Tooltip label    ="Generar nueva entrega"/>
          </q-btn>
        </q-btn-group>    
      <!-- //* //////////////////////////////////////////////////////////  Boton Remision -->
  <!--     <efecto efecto          ="Down">      
        <q-btn
          v-if                ="acuerdo.esPedido && acuerdo.esEstadoValido"
          v-bind              ="style.btnBaseMd"
          color               ="primary"
          icon                ="mdi-format-list-checks"
          :label              ="esMobil ? '' : 'Remisión'"
          :disable            ="cargandoAlgo"
          :loading            ="loading.pdf"
          @click              ="emit('clickRemision')"
          >
          <Tooltip label      ="Generar remisión" :hide="loading.pdf"/>
        </q-btn>
      </efecto>     -->
      <!-- <efecto efecto          ="Down"> -->
        <!-- //* //////////////////////////////////////////////////////////  Boton Aprobar -->
        <q-btn-group  v-if    ="acuerdo.esEstadoValidado">        
          <q-btn 
            v-if              ="!acuerdo.esTerceroCtz && acuerdo.esCotizacion"
            v-bind            ="style.btnBaseMd"
            color             ="positive"
            icon              ="mdi-handshake"
            :label            ="esMobil ? '' : 'Aprobar'"
            :disable          ="cargandoAlgo"
            :loading          ="loading.aprobar"
            @click            ="emit('clickAprobar')"
            >
            <Tooltip :label   ="`Aprobar ${acuerdo.label}`"/>
          </q-btn>
          <!-- //* //////////////////////////////////////////////////////////  Boton Anular -->
          <q-btn 
            v-bind            ="style.btnBaseMd"
            color             ="deep-purple-10"
            icon              ="mdi-close-circle"
            :label            ="esMobil ? '' : (acuerdo.esCotizacion ? 'Cerrar' : 'Anular')"
            :disable          ="cargandoAlgo"
            :loading          ="loading.anular"
            >
            <confirmar  @ok   ="emit('clickAnular')" :con-label="!esMobil"/>
            <Tooltip :label   ="`Cerrar ${acuerdo.label}`"/>
          </q-btn>
        </q-btn-group>
      <!-- </efecto> -->
      <!-- //* ////////////////////////////////////////////////////////// Boton Validar -->
      <q-btn
        v-if                  ="acuerdo.esEstadoNoValidado || ( acuerdo.esPedido && acuerdo.esEstadoEntregado )"
        v-bind                ="style.btnBaseMd"
        color                 ="positive"
        :icon                 ="acuerdo.esEstadoEntregado ? 'mdi-lock-open-variant' : 'mdi-check-circle-outline'"
        :label                ="esMobil ? '' : acuerdo.esEstadoEntregado ? 'Reabrir' : 'Validar'"
        :disable              ="disableBtnValidar"
        :loading              ="loading.validar"
        @click                ="emit('clickValidar')"
        >
        <Tooltip label        ="Clasificar validado"/>
      </q-btn>
      <!-- //* ////////////////////////////////////////////////////////// Boton Cerrar pedido -->
      <q-btn
        v-if                  ="acuerdo.esEstadoValidado"
        v-bind                ="style.btnBaseMd"
        color                 ="blue-7"
        icon                  ="mdi-truck-check"
        :label                ="esMobil ? '' : 'Entrega Ok'"
        :disable              ="cargandoAlgo"
        :loading              ="loading.cerrar"
        @click                ="emit('clickEntregado')"
        >
        <Tooltip label        ="Clasificar entregado"/>
      </q-btn>    
      <!-- //* ////////////////////////////////////////////////////////// Boton Editar -->
      <q-btn                  dense
        v-if                  ="mostrarEditar"
        v-bind                ="style.btnBaseMd"
        color                 ="positive"
        icon                  ="mdi-square-edit-outline"
        :label                ="esMobil ? '' : 'Editar'"
        :disable              ="cargandoAlgo"
        :loading              ="loading.editar"
        @click                ="emit('clickEditar')"
        >
        <Tooltip label        ="Editar"/>
      </q-btn>
      <!-- //* ////////////////////////////////////////////////////////// Boton Reabrir -->
      <q-btn
        v-if                  ="acuerdo.esPedido && acuerdo.esEstadoAnulado"
        v-bind                ="style.btnBaseMd"
        color                 ="positive"
        icon                  ="mdi-lock-open-check"
        :label                ="esMobil ? '' : 'Reabrir'"
        :disable              ="cargandoAlgo"
        :loading              ="loading.editar"
        >
        <confirmar  @ok       ="emit('clickReabrir')" :con-label="!esMobil"/>
        <Tooltip label        ="Reabrir"/>
      </q-btn>    
      <!-- //* ////////////////////////////////////////////////////////// Boton borrar -->
      <div>
        <q-btn
          v-bind              ="style.btnBaseMd"
          color               ="negative"
          class               ="fit"
          icon                ="mdi-trash-can"
          :label              ="esMobil ? '' : 'Borrar'"
          :disable            ="cargandoAlgo || acuerdo.vinculado"
          :loading            ="loading.borrar"
          >
          <confirmar  @ok     ="emit('clickBorrar')" :con-label="!esMobil"/>
        </q-btn>
        <Tooltip :label       ="`${ acuerdo.vinculado ? 'Hay elementos vinculados. No se puede eliminar.' : 'Borrar' }`"/>
      </div>
      <q-btn                  round dense flat
        v-if                  ="!acuerdo.esNuevo"
        icon                  ="mdi-information-outline"
        class                 ="op60 op100-hover"
        color                 ="white"
        >
        <tooltip-acuerdo      :acuerdo="acuerdo"/>
      </q-btn>
      <q-btn                  round dense flat
        v-if                  ="!acuerdo.esNuevo"
        icon                  ="mdi-refresh"
        class                 ="op60 op100-hover"
        color                 ="white"
        @click                ="emit('clickRecargar')"
        >
        <Tooltip :label       ="`Recargar ${acuerdo.label}`"/>
      </q-btn>
    </div>
  </barra>    
</template>
<script lang="ts" setup>
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  computed        } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs     } from 'pinia'
  import {  useStoreUser    } from 'src/stores/user'
  import {  useStoreAcuerdo } from 'src/stores/acuerdo'
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useTools        } from "src/useSimpleOk/useTools"
  import {  menuDefault,
            style           } from "src/useSimpleOk/useEstilos"
  import {  TTipoPDF        } from "src/areas/acuerdos/composables/pdf/useCotizacion"
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    barra             from "components/utilidades/Barra.vue"
  import    efecto            from "components/utilidades/Efecto.vue"
  import    confirmar         from "components/utilidades/MenuConfirmar.vue"
  import    tooltipAcuerdo    from "src/areas/acuerdos/components/Tooltips/TooltipAcuerdo.vue"

  const { acuerdo,
          loading     } = storeToRefs( useStoreAcuerdo() )
  const { usuario     } = storeToRefs( useStoreUser() )          

  const { esMobil     } = useTools()

  const emit = defineEmits<{
    (e: 'clickPdf',           value: TTipoPDF ): void
    (e: 'clickAprobar',       ): void
    (e: 'clickAnular',        ): void  
    (e: 'clickValidar',       ): void
    (e: 'clickEditar',        ): void
    (e: 'clickBorrar',        ): void  
    (e: 'clickRemision',      ): void
    (e: 'clickReabrir',       ): void
    (e: 'clickRecargar',      ): void  
    (e: 'clickEntregado',     ): void
    (e: 'clickComisiones',    ): void
    (e: 'clickNuevaEntrega',  ): void  
    (e: 'clickCuentaCobro',   value: TTipoPDF ): void 
  }>()

  const cargandoAlgo    = computed(()=> Object.values(loading.value).some( ( estado : boolean )=> !!estado ) )
  const totalNotas      = computed(()=> ( !!acuerdo.value.notaPrivada ? 1 : 0 ) + ( !!acuerdo.value.notaPublica ? 1 : 0 )  )
  //const envioInactivo   = computed(()=> cargandoAlgo.value || !acuerdo.value.metodoEntrega.id || !acuerdo.value.fechaEntregaCorta )
  const mostrarEditar   = computed(()=>   !acuerdo.value.esEstadoEdicion
                                          &&
                                          (
                                            (     acuerdo.value.esCotizacion
                                              &&  !acuerdo.value.esEstadoFacturado
                                            )
                                            ||
                                            (     acuerdo.value.esPedido
                                              &&  !acuerdo.value.facturado
                                              &&  !acuerdo.value.esEstadoNoValidado
                                              &&  !acuerdo.value.esEstadoAnulado
                                              &&  !acuerdo.value.esEstadoEntregado
                                            )
                                          )
                                  )

  const disableBtnValidar = computed(()=>
                                    cargandoAlgo.value
                                || !acuerdo.value.proGrupos.length
                                || !acuerdo.value.proGrupos[0].productos.length
                                || (  
                                      ( acuerdo.value.esPedido || acuerdo.value.esCotizacion )
                                      &&
                                      !acuerdo.value.contactoComercial.id
                                      &&
                                      (
                                        acuerdo.value.tercero.esEmpresa
                                        ||
                                        acuerdo.value.esTerceroCtz
                                      )
                                    )
                              )

  const labelBtnPDFDefault  = computed(()=>   acuerdo.value.esCotizacion  ? 'Cotizacion' 
                                            : acuerdo.value.esPedido      ? ""
                                            : acuerdo.value.esEntrega     ? "Remisión"
                                            : acuerdo.value.esOCProveedor ? "Orden de compra"
                                            : ""
                                      )
  
  function pdfDefault()
  {
    const tipo : TTipoPDF = acuerdo.value.esCotizacion ? "quote" : "cuentaCobro"
    emit("clickPdf", tipo)
  }
                                      
  function clickEnNotas()
  {
    window.scrollTo({ top: document.body.scrollHeight,  behavior: 'smooth'})
  }
</script>