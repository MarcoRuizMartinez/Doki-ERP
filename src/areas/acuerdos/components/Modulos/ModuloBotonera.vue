<template>
  <barra  class               ="row justify-between items-center">
    <!-- //* ////////////////////////////////////////////////////////////////////  Lado izquierdo -->
    <div class                ="row gap-sm">
      <q-btn
        v-if                  ="mostrarComisiones"
        v-bind                ="style.btnBaseMd"
        color                 ="primary"
        icon                  ="mdi-account-details"
        :label                ="!acuerdo.incentivo.id ? 'Comisiones' : acuerdo.incentivo.estadoLabel"
        :disable              ="cargandoAlgo"     
        @click                ="emit('clickComisiones')"   
        >
        <Tooltip label        ="Calculo de comisiones" v-if="esMobil"/>
      </q-btn>
      <q-btn
        v-if                  ="acuerdo.esPedido || acuerdo.esOCProveedor || acuerdo.esEntrega"
        v-bind                ="style.btnBaseMd"
        color                 ="primary"
        icon                  ="mdi-calendar-month"
        label                 ="Calendario"
        :disable              ="cargandoAlgo"
        @click                ="modales.calendario = true"
        >
        <Tooltip label        ="Ver calendario de eventos"/>
      </q-btn>
      <q-btn
        v-if                  ="acuerdo.esPedido && ( usuario.esContable || usuario.esDev || usuario.esGerencia )"
        v-bind                ="style.btnBaseMd"
        color                 ="primary"
        icon                  ="mdi-file-table-box-multiple-outline"
        label                 ="Siigo"
        :disable              ="loading.carga"
        @click                ="modales.siigo = true"
        > 
        <Tooltip label        ="Descargar productos para siigo"/>
        <q-badge              rounded
          v-if                ="!!acuerdo.productosAlertaSiigo"
          color               ="red"
          class               ="q-ml-sm"
          :label              ="acuerdo.productosAlertaSiigo"
        />   
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
          :disable            ="cargandoAlgo"
          @click              ="clickCrearOCProveedor"
          >
          <Tooltip
            class             ="text-center"
            ancho-max         ="240px"
            :label            ="hayAlertaOC  ? '⚠️ Falta información en los productos. No se puede generar ordenes.' : 'Generar pedidos a proveedor'"
          />
        </q-btn>
      </efecto>
      <!-- //* //////////////////////////////////////////////////////////  Boton Listo entregar -->
      <efecto efecto          ="Down">      
        <q-btn
          v-if                ="usuario.esProduccion && acuerdo.esPedido && acuerdo.esEstadoValido && !acuerdo.esEstadoEntregado"
          v-bind              ="style.btnBaseMd"
          color               ="primary"
          :class              ="{ 'no-pointer-events' : !usuario.esProduccion }"
          :icon               ="acuerdo.listoEntregar ? 'mdi-check-circle' : 'mdi-alert'"
          :label              ="acuerdo.listoEntregar ? 'Listo para despacho' : 'No esta listo'"
          :disable            ="cargandoAlgo"
          @click              ="clickListoEntregar"
          >
          <Tooltip :label     ="acuerdo.listoEntregar ? 'Marcar como ❌ No listo para despacho' : 'Marcar como ✅ Listo para despachar'"/>
        </q-btn>
      </efecto>      
      <!-- //* //////////////////////////////////////////////////////////  Boton PDF -->
      <efecto efecto          ="Down">
        <q-btn
          v-if                ="acuerdo.esEstadoValido && !acuerdo.esEntrega && !(acuerdo.esCotizacion && usuario.esProduccion) && !usuario.externo"
          v-bind              ="style.btnBaseMd"
          color               ="primary"
          icon                ="mdi-pdf-box"
          :disable            ="cargandoAlgo"
          :loading            ="loading.pdf"          
          >
          <q-menu             auto-close
            v-bind            ="menuDefault"
            class             ="column transparent panel-blur-70 content-start" 
            >
            <q-btn
              v-if            ="!!labelBtnPDFDefault"
              v-bind          ="style.btnSimple"
              icon            ="mdi-pdf-box"
              align           ="left"
              :label          ="labelBtnPDFDefault"
              @click          ="pdfDefault"
            />
            <q-btn
              v-if            ="acuerdo.esCotizacion || acuerdo.esPedido"
              v-bind          ="style.btnSimple"
              label           ="Cuenta de cobro"
              icon            ="mdi-file-document-outline"
              align           ="left"
              @click          ="emit('clickCuentaCobro', 'cuentaCobro')"
            />
            <q-btn
              v-if            ="acuerdo.esPedido && acuerdo.esEstadoValido"
              v-bind          ="style.btnSimple"
              label           ="Acta de entrega"
              icon            ="mdi-book-check"
              align           ="left"
              @click          ="emit('clickActaEntrega' )"
            />           
            <q-btn
              v-if            ="acuerdo.esPedido"
              v-bind          ="style.btnSimple"
              label           ="Remisión"
              icon            ="mdi-signature-freehand"
              align           ="left"
              :disable        ="!acuerdo.entregas.length"
              @click          ="emit('clickRemision')"
            />
            <q-btn
              v-if            ="acuerdo.esPedido"
              v-bind          ="style.btnSimple"
              label           ="Rótulos"
              icon            ="mdi-barcode-scan"
              align           ="left"
              :disable        ="!acuerdo.entregas.length"
              @click          ="emit('clickRotulos')"
            />
          </q-menu>          
        </q-btn>
      </efecto>
      <!-- //* //////////////////////////////////////////////////////////  Boton PDF Remisión y Rótulos -->
      <q-btn-group              push
        v-if                    ="acuerdo.esEntrega"
        >
        <q-btn
          v-bind                ="style.btnBaseMd"
          label                 ="Remisión"
          color                 ="secondary"
          icon                  ="mdi-signature-freehand"
          @click                ="emit('clickRemision')"
        />
        <q-btn
          v-bind                ="style.btnBaseMd"
          label                 ="Rótulos"
          color                 ="secondary"
          icon                  ="mdi-barcode-scan"
          @click                ="emit('clickRotulos')"
        />
      </q-btn-group>
      <q-btn 
        v-if                  ="acuerdo.esPedido && !acuerdo.soloServicios && ( acuerdo.esEstadoValidado )"
        v-bind                ="style.btnBaseMd"
        color                 ="positive"
        icon                  ="mdi-truck-fast"
        :label                ="esMobil ? '' : 'Programar entrega'"
        :loading              ="loading.anular"
        @click                ="emit('clickNuevaEntrega')"
        > 
        <Tooltip label        ="Generar nueva entrega"/>
      </q-btn>

      <btn-toggle
        v-if                  ="acuerdo.esOCProveedor && acuerdo.esEstadoValido && ( usuario.esProduccion || usuario.externo )"
        v-model               ="acuerdo.recibidaProveedor"
        label-true            ="Marcar no visto"
        label-false           ="Marcar recibido"
        icon-true             ="mdi-eye-off"
        icon-false            ="mdi-eye-check"
        msj-true              ="Marcar como no visto por proveedor"
        msj-false             ="Marcar como recibido por proveedor"
        color-true            ="accent"
        color-false           ="positive"
        size                  ="md"
        :loading              ="loading.recibidoProveedor"
        @click                ="emit('clickRecibirProveedor', acuerdo.recibidaProveedor)"
      /> 

      <btn-toggle
        v-if                  ="acuerdo.esOCProveedor && acuerdo.esEstadoValido && ( usuario.esProduccion || usuario.externo )"
        v-model               ="acuerdo.aceptadaProveedor"
        label-true            ="Marcar sin confirmar"
        label-false           ="Marcar en progreso"
        icon-true             ="mdi-alert"
        icon-false            ="mdi-run"
        msj-true              ="Marcar como no confirmando por proveedor"
        msj-false             ="Marcar como aceptado y en progreso por proveedor"
        color-true            ="accent"
        color-false           ="positive"
        size                  ="md"
        :loading              ="loading.aceptarProveedor"
        @click                ="emit('clickAceptarProveedor', acuerdo.aceptadaProveedor)"
      />    
        <!-- //* ////////////////////////////////////////////////////////// Botones Instalacion y entrega
          v-if              ="acuerdo.hayServicios"
        -->
        <!-- <q-btn-group  v-if    ="acuerdo.esEstadoAbierto && acuerdo.esPedido && !acuerdo.esTerceroCtz && false">          
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
        </q-btn-group> -->
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
        <q-btn-group  v-if    ="acuerdo.esEstadoAbierto && !usuario.externo">
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
            :label            ="esMobil ? '' : (acuerdo.esCotizacion ? 'Cerrar' : 'Cancelar')"
            :disable          ="cargandoAlgo || !!acuerdo.entregas.length"
            :loading          ="loading.anular"
            >
            <confirmar  @ok   ="emit('clickAnular')" :con-label="!esMobil"/>
            <Tooltip>
              <span v-if      ="!acuerdo.entregas.length">
                {{ `Cerrar ${acuerdo.label}` }}
              </span>
              <span v-else>
                No se puede cancelar por que hay entregas
              </span>
            </Tooltip>
          </q-btn>
        </q-btn-group>
      <!-- </efecto> -->
      <!-- //* ////////////////////////////////////////////////////////// Boton Validar -->
      <q-btn
        v-if                  ="acuerdo.esEstadoNoValidado"
        v-bind                ="style.btnBaseMd"
        color                 ="positive"
        icon                  ="mdi-check-circle-outline"
        :label                ="esMobil ? '' : 'Validar'"
        :disable              ="!!alertasValidar.length"
        :loading              ="loading.validar"
        @click                ="emit('clickValidar')"
        >
        <Tooltip
          v-if                ="!!alertasValidar.length"
          class               ="width220"
          >
          <ul>
            <li v-for         ="alerta of alertasValidar">{{ alerta }}</li>  
          </ul>          
        </Tooltip>
        <Tooltip v-else label ="Clasificar validado"/>
      </q-btn>
      <!-- //* ////////////////////////////////////////////////////////// Boton Cerrar pedido -->
      <q-btn
        v-if                  ="(acuerdo.esOCProveedor || acuerdo.esEntrega || ( acuerdo.esPedido && acuerdo.soloServicios ) ) && acuerdo.esEstadoValidado"
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
      <q-btn
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
      <!-- //* ////////////////////////////////////////////////////////// Boton clasificar facturado -->
      <q-btn
        v-if                  ="    ( usuario.esContable      || usuario.esGerencia)
                                &&  ( acuerdo.esEstadoAbierto || acuerdo.esEstadoEntregado)
                                &&  !acuerdo.facturado
                              "
        v-bind                ="style.btnBaseMd"
        color                 ="orange"
        icon                  ="mdi-shield-check"
        :label                ="esMobil ? '' : 'Facturado'"
        :disable              ="cargandoAlgo"
        :loading              ="loading.facturar"
        >
        <confirmar  @ok       ="emit('clickFacturado')" :con-label="!esMobil"/>
        <Tooltip label        ="Clasificar facturado"/>
      </q-btn>      
      <!-- //* ////////////////////////////////////////////////////////// Boton Reabrir -->
      <q-btn
        v-if                  ="acuerdo.esPedido && ( acuerdo.esEstadoAnulado || acuerdo.esEstadoEntregado || acuerdo.esEstadoEntregando )"
        v-bind                ="style.btnBaseMd"
        color                 ="positive"
        icon                  ="mdi-lock-open-check"
        :label                ="esMobil ? '' : 'Reabrir'"
        :disable              ="cargandoAlgo || !!acuerdo.entregas.length"
        :loading              ="loading.editar"
        >
        <confirmar  @ok       ="emit('clickReabrir')" :con-label="!esMobil"/>
        <Tooltip label        ="Reabrir"/>
      </q-btn>    
      <!-- //* ////////////////////////////////////////////////////////// Boton borrar -->
      <div>
        <q-btn
          v-if                ="!acuerdo.facturado && !acuerdo.esEstadoEntregado && !usuario.externo"
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
  //#region Cosa
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref, computed   } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs     } from 'pinia'
  import {  useStoreUser    } from 'stores/user'
  import {  useStoreAcuerdo } from 'stores/acuerdo'

  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useTools        } from "src/composables/useTools"
  import {  menuDefault,
            style           } from "src/composables/useEstilos"
  import {  TTipoPDF        } from "src/areas/acuerdos/composables/pdf/useCotizacion"
  
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    barra             from "components/utilidades/Barra.vue"
  import    efecto            from "components/utilidades/Efecto.vue"
  import    confirmar         from "components/utilidades/MenuConfirmar.vue"
  import    tooltipAcuerdo    from "src/areas/acuerdos/components/Tools/Tooltips/TooltipAcuerdo.vue"
  import    btnToggle         from "components/utilidades/BtnToggle.vue"

  const { acuerdo,
          modales,
          loading     } = storeToRefs( useStoreAcuerdo() )
  const { usuario     } = storeToRefs( useStoreUser() )
  const { esMobil     } = useTools()
  
// MARK:. Esto le perm
  const emit = defineEmits<{
    (e: 'clickPdf',               value: TTipoPDF ): void
    (e: 'clickCuentaCobro',       value: TTipoPDF ): void 
    (e: 'clickAceptarProveedor',  value: boolean  ): void
    (e: 'clickRecibirProveedor',  value: boolean  ): void
    (e: 'clickAprobar',           ): void
    (e: 'clickAnular',            ): void  
    (e: 'clickValidar',           ): void
    (e: 'clickEditar',            ): void
    (e: 'clickBorrar',            ): void  
    (e: 'clickRemision',          ): void
    (e: 'clickRotulos',           ): void
    (e: 'clickReabrir',           ): void
    (e: 'clickFacturado',         ): void
    (e: 'clickRecargar',          ): void  
    (e: 'clickEntregado',         ): void
    (e: 'clickComisiones',        ): void
    (e: 'clickNuevaEntrega',      ): void    
    (e: 'clickListoEntregar',     ): void
    (e: 'clickActaEntrega',       ): void    
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
                                              &&  !acuerdo.value.esEstadoNoValidado
                                              &&  !acuerdo.value.esEstadoAnulado
                                              &&  !acuerdo.value.esEstadoEntregado
                                              &&  !acuerdo.value.esEstadoEntregando
                                              &&  (
                                                    !acuerdo.value.facturado
                                                    ||
                                                    (
                                                      acuerdo.value.facturado
                                                      &&
                                                      !acuerdo.value.entregas.length
                                                    )
                                                  )
                                            )
                                          )
                                  )
  const alertasValidar    = computed(()=> {
    const a : string[]    = []

    const sinProductos    = !acuerdo.value.proGrupos.length || !acuerdo.value.proGrupos[0].productos.length
    const sinContacto     =     ( acuerdo.value.esPedido || acuerdo.value.esCotizacion )
                            &&  !acuerdo.value.contactoComercial.id
                            &&  ( acuerdo.value.tercero.esEmpresa || acuerdo.value.esTerceroCtz )
    const sinFecha        =     !acuerdo.value.fechaEntrega.getTime()
                            &&  ( acuerdo.value.esPedido || acuerdo.value.esOCProveedor )
    const asesorCorrecto  = acuerdo.value.tercero.responsables.some( r => r.id === acuerdo.value.comercial.id )
    const noHayResponsable= acuerdo.value.tercero.responsables.every( r => !r.activo ) || !acuerdo.value.tercero.responsables.length
    const asesoresOk      = asesorCorrecto || noHayResponsable

    if(cargandoAlgo.value)  a.push("Cargando...")
    if(sinProductos)        a.push("Se deben agregar productos")
    if(sinContacto)         a.push("Contacto invalido")
    if(sinFecha)            a.push("Sin fecha compromiso")
    if(!asesoresOk)         a.push(`El asesor debe ser ${acuerdo.value.tercero.responsables.map( r => r.nombre ).join(",")}`)
    
    return a
  })

/*   const disableBtnValidar = computed(()=> {
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
                                || ( !acuerdo.value.fechaEntrega.getTime() && ( acuerdo.value.esPedido || acuerdo.value.esOCProveedor ))
  }) */

  const mostrarComisiones   = computed(()=> 
    !acuerdo.value.condicionPago.esGarantia
    &&
    (acuerdo.value.esPedido || acuerdo.value.esCotizacion)
    &&
    !acuerdo.value.esEstadoBoceto
    &&
    ( acuerdo.value.usuarioEsDueño || usuario.value.esGerencia || usuario.value.esContable )
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

  function clickListoEntregar()
  {
    if(usuario.value.esProduccion)
      emit('clickListoEntregar')    
  }

  const hayAlertaOC     = computed(()=> acuerdo.value.productos.some( l => !!l.alertasLinea.length ) )
    

  function clickCrearOCProveedor()
  {
    if(!hayAlertaOC.value)
      window.open( acuerdo.value.urlDolibarrOC, '_blank')
  
  }
</script>