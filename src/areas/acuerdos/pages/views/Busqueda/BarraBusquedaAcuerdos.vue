<template>
  <q-tab-panels                 animated keep-alive vertical
    v-model                     ="tabs.activa"
    v-bind                      ="$attrs"
    class                       ="transparent fit"
    >
    <!-- //* /////////////////////////////////////////////////////// Tab 1 -->
    <q-tab-panel
      name                      ="tab_1"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <fieldset-filtro
        titulo                  ="Búsqueda" 
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Busqueda general -->
        <input-buscar           clearable hundido
          v-model               ="b.f.buscar"
          label                 ="Búsqueda"
          class                 ="width190"
          icon                  ="mdi-account-search"
        />
        <!-- //* ///////////////////////////////////////////////// Busqueda contacto -->
        <input-buscar           clearable hundido
          v-if                  ="!b.esOCProveedor"
          v-model               ="b.f.contacto"
          label                 ="Contactos"
          icon                  ="mdi-target-account"
          class                 ="width190"
        />
        <!-- //* ///////////////////////////////////////////////// Proveedores -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esOCProveedor"
          v-model               ="b.f.proveedores"
          label                 ="Proveedor"
          icon                  ="mdi-storefront"
          class                 ="width190"
          :options              ="b.o.proveedores"
        />
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Estado"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Estado acuerdo -->
        <multi-label-value
          v-model               ="b.f.estados"
          label                 ="Estado"
          class                 ="width190"
          icon                  ="mdi-label"
          :options              ="b.o.estados"
        />
        <!-- //* ///////////////////////////////////////////////// Métodos de entrega -->
        <multi-label-value
          v-model               ="b.f.entrega"
          label                 ="Entrega"
          class                 ="width190"
          icon                  ="mdi-truck-delivery"
          :options              ="b.o.metodosEntrega"
        />
        <!-- //* ///////////////////////////////////////////////// Condiciones pago -->
        <multi-label-value
          v-if                  ="!b.esOCProveedor && !b.esEntrega"
          v-model               ="b.f.condiciones"
          label                 ="Condiciones"
          class                 ="width190"
          icon                  ="mdi-account-cash"
          :options              ="b.o.condicionesPago"
        />
        <!-- //* ///////////////////////////////////////////////// Comercial Acuerdo -->
        <select-usuario         hundido clearable
          v-if                  ="!b.esOCProveedor"
          v-model               ="b.f.usuario"
          class                 ="width190"
          label                 ="Asesor"
          :area                 ="usuario.area"
          :grupos               =[GRUPO_USUARIO.COMERCIALES]
          :readonly             ="!b.puedeCambiarUser"
        />
        <!-- //* ///////////////////////////////////////////////// Creador -->
        <select-usuario         hundido clearable inactivos
          v-if                  ="b.esPedido || b.esCotizacion"
          v-model               ="b.f.creador"
          class                 ="width190"
          label                 ="Creador"
          :area                 ="usuario.area"
          :grupos               ="b.esOCProveedor ? [GRUPO_USUARIO.PRODUCCION] : [GRUPO_USUARIO.COMERCIALES]"
          :readonly             ="!permisos.acceso_total"
        />
        <!-- //* ///////////////////////////////////////////////// Pedido facturado -->
        <multi-label-value
          v-if                  ="b.esOCProveedor"
          v-model               ="b.f.creadores"
          label                 ="Creadores"
          class                 ="width190"
          icon                  ="mdi-account-multiple"
          :options              ="b.o.creadores"
          :readonly             ="!permisos.acceso_total"
        />
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esOCProveedor"
          v-model               ="b.f.envioOC"
          label                 ="Correo enviado"
          icon                  ="mdi-email-check"
          class                 ="width190"
          :options              ="Busqueda.listaEnvioOC"
        />
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esOCProveedor"
          v-model               ="b.f.aceptado"
          label                 ="Pedido en progreso"
          icon                  ="mdi-run"
          class                 ="width190"
          :options              ="Busqueda.listaAceptado"
        />
        <!-- //* ///////////////////////////////////////////////// Municipio contacto -->
        <municipios             hundido
          v-if                  ="b.esEntrega"
          v-model               ="b.f.municipioContacto"
          class                 ="width190"
          label                 ="Lugar envió"
          tooltip               ="Municipio contacto"
        />
        <!-- //* ///////////////////////////////////////////////// Pedido facturado -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esPedido"
          v-model               ="b.f.facturado"
          label                 ="Facturado"
          icon                  ="mdi-file-check"
          class                 ="width190"
          :options              ="Busqueda.listaFacturado"
        />
      </fieldset-filtro>
      <!-- //* /////////////////////////////////////////////////// Paginación -->
      <fieldset-filtro
        titulo                  ="Paginas"
        class-contenido         ="grilla-ribom fit"
        >
        <!-- //* ///////////////////////////////////////////////// Resultados por pagina -->
        <div>
          <q-btn-toggle         spread push unelevated round
            v-model             ="b.f.resultadosXPage"
            color               ="white"
            text-color          ="grey-8"
            toggle-color        ="primary"
            :options            ="Busqueda.listaResultadosXPag"
            @update:model-value ="b.f.pagina = 1"
          />
          <Tooltip label        ="Resultados por pagina"/>
        </div>
        <!-- //* ///////////////////////////////////////////////// Pagina -->
        <div class              ="row justify-center full-width">
          <q-pagination         dense
            v-model             ="b.f.pagina"
            :max                ="siguientePagina"
            :max-pages          ="3"
            :ellipses           ="false"
            :boundary-numbers   ="false"
          />
          <Tooltip label        ="Pagina"/>
          <q-spinner-puff
            v-if                ="b.haySiguientePagina"
            color               ="primary"
            size                ="2em"
            class               ="q-mt-xs"
          />
        </div>
      </fieldset-filtro>
      <fieldset-filtro
        titulo                  ="Opciones"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Slot Columnas -->
        <slot></slot>
        <!-- //* ///////////////////////////////////////////////// Botones -->
        <div class                ="row justify-around q-mt-sm">
          <!-- //* /////////////////////////////////////////////// Boton recargar -->
          <div>
            <q-btn                round push glossy
              icon                ="mdi-refresh"
              padding             ="xs"
              color               ="primary"
              :disable            ="b.queryVacia"
              @click              ="buscar"
              >
              <Tooltip label      ="Recargar"/>
            </q-btn>
          </div>
          <!-- //* /////////////////////////////////////////////// Boton limpiar 'btnRecargar -->
          <div>
            <q-btn                round push glossy
              icon                ="mdi-close"
              padding             ="xs"
              color               ="primary"
              :disable            ="b.queryVacia"
              @click              ="limpiarBusqueda"
              >
              <Tooltip label      ="Limpiar búsqueda"/>
            </q-btn>
          </div>
          <!-- //* /////////////////////////////////////////////// Boton exportar -->
          <div
            v-if                  ="!(usuario.esProduccion && b.esCotizacion)"
            >
            <q-btn                round push glossy
              icon                ="mdi-microsoft-excel"
              color               ="primary"
              padding             ="xs"
              :disable            ="b.queryVacia"
              @click              ="emit('exportar')"
              >
              <Tooltip label      ="Descargar"/>
            </q-btn>
          </div>
        </div>
      </fieldset-filtro>
      <fieldset-filtro
        v-if                    ="!b.esEntrega && ( usuario.esGerencia || usuario.esComercial )"
        titulo                  ="Totales"
        class-contenido         ="column q-gutter-xs"
        >
        <table>
          <tbody>
            <tr>
              <td>Subtotal:</td>
              <td class         ="text-bold fuente-mono">
                {{ Format.precio( sumaAcuerdosSubtotal ) }}
              </td>
            </tr>
            <tr v-if            ="b.esPedido">
              <td>Sin fletes:</td>
              <td class         ="text-bold fuente-mono">
                {{ Format.precio( sumaAcuerdosSubtotalLimpio ) }}
              </td>
            </tr>
            <tr>
              <td>Total:</td>
              <td class         ="text-bold fuente-mono">
                {{ Format.precio( sumaAcuerdosTotal ) }}
              </td>
            </tr>
          </tbody>
        </table>        
      </fieldset-filtro>      
      <inne  :cargando    ="loading.carga || b.f.copiando"/>
    </q-tab-panel>
    <!-- //* /////////////////////////////////////////////////////// Tab 2 -->
    <q-tab-panel
      name                      ="tab_2"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <!-- //* /////////////////////////////////////////////////// Fecha creacion -->
      <fieldset-filtro
        titulo                  ="Fechas creación"
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Fecha desde -->
        <input-fecha            hundido no-futuro clearable
          v-model               ="b.f.desde"
          label                 ="Desde"
          class                 ="width160"
          :hasta                ="b.f.hasta"
        />
        <!-- //* ///////////////////////////////////////////////// Fecha hasta -->
        <input-fecha            hundido no-futuro clearable
          v-model               ="b.f.hasta"
          label                 ="Hasta"
          class                 ="width160"
          :desde                ="b.f.desde"
        />
      </fieldset-filtro>
      <!-- //* /////////////////////////////////////////////////// Dias de compromiso -->
      <fieldset-filtro
        v-if                    ="b.esPedido || b.esOCProveedor || b.esEntrega"
        titulo                  ="Días de compromiso"
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Dias desde -->
        <input-number           hundido  
          v-model               ="b.f.diasDesde"
          label                 ="Desde x días"
          :paso                 ="1"
          class                 ="width160"          
          :maximo               ="b.f.diasHasta"
        />
        <!-- //* ///////////////////////////////////////////////// Dias hasta -->
        <input-number           hundido  
          v-model               ="b.f.diasHasta"
          label                 ="Hasta x días"
          :paso                 ="1"
          class                 ="width160"
          :minimo               ="b.f.diasDesde"
        />
      </fieldset-filtro>
      <!-- //* /////////////////////////////////////////////////// Dias a despachar -->
      <fieldset-filtro
        v-if                    ="b.esPedido || b.esOCProveedor || b.esEntrega"
        titulo                  ="Días a despachar"
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Dias desde -->
        <input-number           hundido  
          v-model               ="b.f.diasDDesde"
          label                 ="Desde x días"
          :paso                 ="1"
          class                 ="width160"          
          :maximo               ="b.f.diasDHasta"
        />
        <!-- //* ///////////////////////////////////////////////// Dias hasta -->
        <input-number           hundido  
          v-model               ="b.f.diasDHasta"
          label                 ="Hasta x días"
          :paso                 ="1"
          class                 ="width160"
          :minimo               ="b.f.diasDDesde"
        />
      </fieldset-filtro>      
      <!-- //* /////////////////////////////////////////////////// Fechas Validacion -->
      <fieldset-filtro
        v-if                    ="b.esOCProveedor"
        titulo                  ="Días de aprobación de OC"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Dias desde -->
        <input-number           hundido
          v-model               ="b.f.aproDesdeDia"
          label                 ="Desde x días"
          :paso                 ="1"
          class                 ="width160"
          :maximo               ="b.f.diasHasta"
        />
        <!-- //* ///////////////////////////////////////////////// Dias hasta -->
        <input-number           hundido
          v-model               ="b.f.aproHastaDia"
          label                 ="Hasta x días"
          :paso                 ="1"
          class                 ="width160"
          :minimo               ="b.f.diasDesde"
        />
      </fieldset-filtro>

      <fieldset-filtro
        v-if                    ="b.esOCProveedor"
        titulo                  ="Días de envió de OC"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Dias desde -->
        <input-number           hundido
          v-model               ="b.f.enviaDesdeDia"
          label                 ="Desde x días"
          :paso                 ="1"
          class                 ="width160"
          :maximo               ="b.f.diasHasta"
        />
        <!-- //* ///////////////////////////////////////////////// Dias hasta -->
        <input-number           hundido
          v-model               ="b.f.enviaHastaDia"
          label                 ="Hasta x días"
          :paso                 ="1"
          class                 ="width160"
          :minimo               ="b.f.diasDesde"
        />
      </fieldset-filtro>
    </q-tab-panel>
    <!-- //* ///////////////////////////////////////////////////// Tab 3 -->
    <q-tab-panel
      name                      ="tab_3"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <fieldset-filtro
        v-if                    ="!b.esOCProveedor"
        titulo                  ="Opciones"
        class-contenido         ="grilla-ribom"
        >
        <!-- //* ///////////////////////////////////////////////// Forma de pago -->
        <multi-label-value
          v-if                  ="!b.esEntrega"
          v-model               ="b.f.formaPago"
          label                 ="Pago"
          class                 ="width160"
          icon                  ="mdi-cash-refund"
          :options              ="b.o.formasPago"
        />
        <!-- //* ///////////////////////////////////////////////// Métodos de entrega -->
        <!-- <multi-label-value
          v-if                  ="!b.esEntrega"
          v-model               ="b.f.entrega"
          label                 ="Entrega"
          class                 ="width160"
          icon                  ="mdi-truck-delivery"
          :options              ="b.o.metodosEntrega"
        /> -->
        <!-- //* ///////////////////////////////////////////////// Origen contacto -->
        <multi-label-value
          v-if                  ="!b.esEntrega"
          v-model               ="b.f.origenes"
          label                 ="Origen"
          class                 ="width160"
          icon                  ="mdi-source-branch"
          :options              ="b.o.origenes"
        />
        <!-- //* ///////////////////////////////////////////////// Con IVA o sin IVA -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esCotizacion"
          v-model               ="b.f.conIva"
          label                 ="IVA"
          icon                  ="mdi-bank"
          class                 ="width160"
          :options              ="Busqueda.listaIVA"
        />
        <!-- //* ///////////////////////////////////////////////// Con total y sin total -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esCotizacion"
          v-model               ="b.f.totalizado"
          label                 ="Totalizar"
          icon                  ="mdi-counter"
          class                 ="width160"
          :options              ="Busqueda.listaTotales"
        />
        <!-- //* ///////////////////////////////////////////////// Área o departamento -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.area"
          label                 ="Área"
          icon                  ="mdi-google-circles-extended"
          class                 ="width160"
          :options              ="Busqueda.listaAreas"
        />
        <!-- //* ///////////////////////////////////////////////// Municipio -->
        <municipios             hundido
          v-model               ="b.f.municipio"
          class                 ="width160"
          tooltip               ="Municipio tercero"
        />
        <!-- //* ///////////////////////////////////////////////// Tercero interno o externo -->
        <select-label-value     use-input hundido clearable flat bordered
          v-model               ="b.f.terceroInterno"
          label                 ="Tipo tercero"
          icon                  ="mdi-circle-multiple"
          class                 ="width160"
          :options              ="Busqueda.listaTerceroInterno"
        />
        <!-- //* ///////////////////////////////////////////////// Forma de pago -->
        <!-- //* ///////////////////////////////////////////////// Estado Anticipo -->
        <multi-label-value
          v-if                  ="b.esPedido"
          v-model               ="b.f.estadoAnticipo"
          label                 ="Estado anticipo"
          icon                  ="mdi-cash-check"
          class                 ="width160"
          :options              ="Busqueda.listaAnticipoEstados"
        />
        <!-- //* ///////////////////////////////////////////////// Estado Anticipo -->
        <multi-label-value
          v-if                  ="b.esPedido"
          v-model               ="b.f.tipoAnticipo"
          label                 ="Tipo anticipo"
          icon                  ="mdi-cash"
          class                 ="width160"
          :options              ="Busqueda.listaAnticipoTipos"
        />
        <!-- //* ///////////////////////////////////////////////// Con pedidos a proveedor -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esPedido"
          v-model               ="b.f.conOrdenes"
          label                 ="OC proveedor"
          icon                  ="mdi-factory"
          class                 ="width160"
          :options              ="Busqueda.listaOrdenesProv"
        />
        <!-- //* ///////////////////////////////////////////////// Comision -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esPedido"
          v-model               ="b.f.incPago"
          label                 ="Comisión"
          icon                  ="mdi-cash-check"
          class                 ="width160"
          :options              ="Busqueda.listaEstadosPago"
        />
        <!-- //* ///////////////////////////////////////////////// Con fecha de listo para despacho -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esPedido"
          v-model               ="b.f.listoDespacho"
          label                 ="Listo para despacho"
          icon                  ="mdi-truck-check"
          class                 ="width160"
          :options              ="Busqueda.listaListoDespachar"
        />
        <!-- //* ///////////////////////////////////////////////// Envio aprobado -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esPedido || b.esEntrega"
          v-model               ="b.f.aprobado"
          label                 ="Envió aprobado"
          icon                  ="mdi-account-cash"
          class                 ="width160"
          :options              ="[{value:1, label:'✅Costo aprobado'},          {value:0, label:'✖️Costo no aprobado'       }]"
        />
        <!-- //* ///////////////////////////////////////////////// Extra tiempo -->
        <select-label-value     use-input hundido clearable flat bordered
          v-if                  ="b.esPedido || b.esEntrega"
          v-model               ="b.f.extra"
          label                 ="Extra tiempo"
          icon                  ="mdi-flash"
          class                 ="width160"
          :options              ="[{ value:1, label:'Extra tiempo'}, { value:0, label:'Entrega normal' }]"
        />             
      </fieldset-filtro>
      <fieldset-filtro
        v-if                    ="!b.esEntrega && !(usuario.esProduccion && b.esCotizacion)"
        titulo                  ="Subtotal"
        class-contenido         ="column q-gutter-xs"
        >
        <!-- //* ///////////////////////////////////////////////// Precio Minimo -->
        <input-number           hundido clearable
          v-model               ="b.f.valorMin"
          label                 ="Mínimo"
          icon                  ="mdi-currency-usd"
          class                 ="width140"
          :minimo               ="0"
          :maximo               ="!!b.f.valorMax ? b.f.valorMax : undefined"
        />
        <!-- //* ///////////////////////////////////////////////// Precio Maximo -->
        <input-number           hundido clearable
          v-model               ="b.f.valorMax"
          label                 ="Máximo"
          icon                  ="mdi-currency-usd"
          class                 ="width140"
          :minimo               ="!!b.f.valorMin ? b.f.valorMin : undefined"
          :maximo               ="999_999_999"
        />
      </fieldset-filtro>
    </q-tab-panel>
    <!-- //* /////////////////////////////////////////////////////// Tab 4 -->
    <q-tab-panel
      name                      ="tab_4"
      class                     ="row q-pa-none no-wrap scroll"
      >
      <fieldset-filtro
        titulo                  ="Búsqueda"
        class-contenido         ="column q-gutter-xs"
        >
        <busquedas-rapidas/>
      </fieldset-filtro>
    </q-tab-panel>
  </q-tab-panels>
  <inner-loading :cargando      ="loading?.carga ?? false"/>
</template> 

<script lang="ts" setup>
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  watch,
            computed,
                                } from "vue"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp         } from 'stores/app'
  import {  useStoreUser        } from 'stores/user'
  import {  useStoreAcuerdo     } from 'stores/acuerdo'
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  Format              } from "src/composables/useTools"
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  IQuery, Busqueda    } from "src/models/Busqueda"
  import {  GRUPO_USUARIO       } from "src/models/TiposVarios"
  import {  ESTADO_OC           } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    municipios            from "components/utilidades/select/SelectMunicipios.vue"
  import    multiLabelValue       from "components/utilidades/select/SelectLabelValueMulti.vue"
  import    inputFecha            from "components/utilidades/input/InputFecha.vue"
  import    selectUsuario         from "src/areas/usuarios/components/SelectUsuario.vue"
  import    inputBuscar           from "components/utilidades/input/InputSimple.vue"
  import    innerLoading          from "components/utilidades/InnerLoading.vue"
  import    busquedasRapidas      from "./BusquedasRapidas.vue"

  // * /////////////////////////////////////////////////////////////////////// Importaciones
  const { usuario, permisos     } = storeToRefs( useStoreUser() )
  const { busqueda : b,
          acuerdos,
          loading               } = storeToRefs( useStoreAcuerdo() )
  const { tabs                  } = storeToRefs( useStoreApp() )

  const emit = defineEmits<{
    (e: 'buscar',   value: IQuery ): void
    (e: 'limpiar',                ): void
    (e: 'exportar',               ): void
  }>()

  watch(()=>b.value.f, ()=>
    {
      if(b.value.puedeBuscar && b.value.checkPage())
        buscar()
      else  if(b.value.queryVacia ) limpiarBusqueda()
    },
    { deep: true }
  )

  function buscar()
  {
    b.value.copiarQueryARourter()
    const query       = b.value.query
    query.acuerdo     = b.value.acuerdo
    emit("buscar", query)
  }

  async function limpiarBusqueda(){
    const todoLimpio  = await b.value.limpiarQueryDeRouter()
    if(todoLimpio) emit("limpiar")
  }

  // * /////////////////////////////////////////////////////////////////////// Computed
  const siguientePagina           = computed(()=> b.value.siguientePagina( acuerdos.value.length ) )
  const sumaAcuerdosSubtotal      = computed(()=> {
    let suma                      = 0
    if(!!acuerdos.value && !!acuerdos.value.length)
      suma                        = acuerdos.value.map( a => a.totalConDescu ?? 0 ).reduce((acu, now) => (acu ?? 0) + now)
    return suma
  })
  const sumaAcuerdosSubtotalLimpio= computed(()=> {
    let suma                      = 0
    if(!!acuerdos.value && !!acuerdos.value.length)
      suma                        = acuerdos.value.map( a => a.subTotalLimpio ).reduce((acu, now) => (acu ?? 0) + now)
    return suma
  })
  const sumaAcuerdosTotal         = computed(()=> {
    let suma                      = 0
    if(!!acuerdos.value && !!acuerdos.value.length)
      suma                        = acuerdos.value.map( a => a.totalConIva ).reduce((acu, now) => (acu ?? 0) + now)
    return suma
  })
</script>