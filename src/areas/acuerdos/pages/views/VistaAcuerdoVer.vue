<template>
  <titulo
    class                   ="col-12"
    @click                  ="generarPDF"
    @recargar               ="recargar"
  />
  <botonera
    class                   ="col-12"
    @click-pdf              ="generarPDF"
    @click-aprobar          ="clickAprobarCotizacion"
    @click-anular           ="anularAcuerdo"
    @click-validar          ="validarAcuerdo"
    @click-editar           ="pasarABorradorAcuerdo"
    @click-borrar           ="eliminarAcuerdo"
    @click-remision         ="abrirModalRemision"
    @click-reabrir          ="reabrirPedido"
    @click-recargar         ="recargar"
    @click-entregado        ="cerrarPedido"
    @click-comisiones       ="modales.comisiones = true"
    @click-nueva-entrega    ="modales.entrega = true"
    @click-cuenta-cobro     ="generarPDF"
    @click-listo-entregar   ="setListoDespacho"
  />
  <barra-tercero class      ="col-12"/>
  <modo-vista    class      ="col-12"/>
  <tercero-y-contacto       scroll
    class                   ="col-md-4 col-12 o-10"
    :height-card            ="alturaFila1"
  />
  <condiciones              scroll
    ref                     ="moduloCondiciones"
    class                   ="col-md-4 col-12 o-20"
    :height-card            ="alturaFila1"
  />
  <totales                  scroll
    v-if                    ="!acuerdo.esEntrega"
    class                   ="col-md-4 col-12 o-30"
    :height-card            ="alturaFila1"
  />
  <contactos
    v-if                    ="acuerdo.tercero.esEmpresa && acuerdo.esPedido"
    class                   ="col-12 o-40"
  />
  <enlaces                  minimizar
    class                   ="col-md-4 col-12 o-50"
    height-card             ="260px"    
  />
  <documentos               minimizar
    class                   ="col-md-4 col-12 o-60"
    height-card-min         ="164px"
    :modulo                 ="acuerdo.modulo"
    :modulo-id              ="acuerdo.id ?? 0"
    :modulo-ref             ="acuerdo.ref"
    :puede-editar           ="true"
    @descarga-ok            ="cargarArchivos"
    @borrado-ok             ="cargarArchivos"
  />
  <anticipos                minimizar scroll
    v-if                    ="acuerdo.esPedido"
    class                   ="col-md-4 col-12 o-70"
  />
  <lineas
    class                   ="col-12 o-productos"
  />
  <entregas
    v-if                    ="acuerdo.esPedido && !acuerdo.esEstadoBoceto"
    class                   ="col-12 o-entregas"
    @click-nueva-entrega    ="modales.entrega = true"
    @click-remision         ="abrirModalRemision"
    @entrega-cerrada        ="recargar"
  />
  <!-- :class                  ="{ 'order-1' : acuerdo.esPedido || acuerdo.esEntrega }"
  :class                  ="{ 'order-1' : acuerdo.esEntrega }"
 -->
  <!-- <calificacion
    v-if                    ="acuerdo.esEstadoValido && ( acuerdo.esPedido || acuerdo.esCotizacion )"
    class                   ="col-md-4 col-12"
  /> -->
  <notas
    class                   ="col-md-4 col-12 o-100"
    height-card             ="220px"
  />
  <comentarios
    v-model                 ="acuerdo.comentarios"
    :asignado               ="acuerdo.comercial"
    :elemento-id            ="acuerdo.id"
    :tipo                   ="Accion.getTipoByAcuerdo( acuerdo.tipo )"
    :terceroId              ="acuerdo.tercero.id"
    :proyectoId             ="acuerdo.proyecto.id"
    :cargando               ="loading?.commentsLoad ?? false"
    :funcion-buscar         ="buscarComentarios"
  />
  <!-- //* /////////////////  Visor PDF  -->
  <visor-pdf                descargar
    v-model:src             ="srcPDF"
    v-model:visible         ="modales.pdf"
    :nombre-pdf             ="nombrePDF"
    @click-descargar        ="saveQuotePDF"
  />
  <!-- //* ///////////////////////////////////////////////////////////// Modal Buscar productos -->
  <q-dialog
    v-model                 ="modales.comisiones"
    v-bind                  ="style.dialogo"      
    >
    <comisiones style       ="max-width: initial;"/>
  </q-dialog>
  <!-- //* ///////////////////////////////////////////////////////////// Modal remision -->
  <q-dialog                 maximized
    v-model                 ="modales.remision"
    v-bind                  ="style.dialogo"
    >
    <remision
      :acuerdo              ="acuerdoRemsion"
    />
  </q-dialog>
  <!-- //* ///////////////////////////////////////////////////////////// Modal calendario de enventos de acuerdo -->
  <q-dialog
    v-model                 ="modales.calendario"
    v-bind                  ="style.dialogo"
    >
    <calendario :acuerdo    ="acuerdo"/>
  </q-dialog>
  <!-- //* ///////////////////////////////////////////////////////////// Modal productos siigo -->
  <q-dialog
    v-model                 ="modales.siigo"
    v-bind                  ="style.dialogo"
    >
    <productos-siigo />
  </q-dialog>
  <q-dialog                 full-width
    v-model                 ="modales.entrega"
    v-bind                  ="style.dialogo"
    >
    <nueva-entrega
      @entrega-creada       ="modales.entrega = false"
    />
  </q-dialog>
    <!-- <remision v-model:visible ="modales.pdfRemision"/> -->
    <!--   <div id="capture" style="padding: 10px; background: #f5da55">
    <h4 style="color: #000; ">Hello world!</h4>
  </div> -->
</template>

<script setup lang="ts">
  //* ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,
            toRefs,
            provide,
            computed,
            PropType,
                                  } from "vue"
  import {  useTitle              } from "@vueuse/core"
  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'stores/acuerdo'
  import {  useStoreApp           } from 'stores/app'

  //* ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  Acuerdo, IAcuerdo     } from "src/areas/acuerdos/models/Acuerdo"
  import {  LineaAcuerdo          } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  IArchivo              } from "src/models/Archivo"
  //import {  AREA                  } from "src/models/TiposVarios"
  import {  Accion                } from "src/areas/comunicacion/models/Accion"  
  import {  IOrdenCSS, OrdenCSS   } from "src/models/TiposVarios"
  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  useCotizacionPDF,
            TTipoPDF              } from "src/areas/acuerdos/composables/pdf/useCotizacion"
  
  //import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  import {  TTipoAcuerdo          } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  import {  style                 } from "src/composables/useEstilos"  
  //import {  dexieBodegas          } from "src/composables/useDexie"  
  //import {  Tool                  } from "src/composables/useTools"
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    visorPdf                from "components/utilidades/VisorPDF.vue"
  import    notas                   from "./../../components/Modulos/ModuloNotas.vue"
  import    titulo                  from "./../../components/Modulos/ModuloTitulo.vue"
  import    totales                 from "./../../components/Modulos/ModuloTotales.vue"
  import    botonera                from "./../../components/Modulos/ModuloBotonera.vue"
  import    barraTercero            from "./../../components/Modulos/ModuloBarraNombreTercero.vue"
  import    terceroYContacto        from "./../../components/Modulos/ModuloTercero.vue"
  import    condiciones             from "./../../components/Modulos/ModuloCondiciones.vue"
  import    lineas                  from "./../../components/Modulos/ModuloLineas.vue"
  import    enlaces                 from "./../../components/Modulos/ModuloEnlaces.vue"
  import    contactos               from "./../../components/Modulos/ModuloContactos.vue"
  import    entregas                from "./../../components/Modulos/ModuloEntregas.vue"
  //import    calificacion            from "./../../components/Modulos/ModuloCalificacion.vue"
  import    anticipos               from "./../../components/Modulos/ModuloAnticipos.vue"
  import    nuevaEntrega            from "./../../components/Entregas/NuevaEntrega.vue"

  import    calendario              from "./../../components/Modales/CalendarioAcuerdos.vue"
  import    productosSiigo          from "./../../components/Modales/ProductosSiigo.vue"

  import    comentarios             from "src/areas/comunicacion/components/ModuloComentarios.vue"
  //import    nuevaEntrega          from ".././Modals/NuevaEntregaSelectBodega.vue"
  import    remision                from "src/areas/acuerdos/components/PDF/RemisionPDF.vue"
  import    documentos              from "components/archivos/ModuloArchivos.vue"
  import    comisiones              from "src/areas/nomina/components/Modales/CalculoComisiones.vue" 
  import    modoVista               from "./../../components/Modulos/ModuloModoVista.vue"

  const { acuerdo,
          modales,
          lineaElegida,
          loading           } = storeToRefs( useStoreAcuerdo() )
  const { toggle            } = storeToRefs( useStoreApp() )
  const { getQuotePDF,
          saveQuotePDF      } = useCotizacionPDF()
  
  const { aprobarCotizacion,
          anularAcuerdo,
          pasarABorradorAcuerdo,
          reabrirPedido,
          buscarAcuerdo,
          buscarAcuerdoEnlazados,
          eliminarAcuerdo,
          validarAcuerdo,
          cerrarPedido,
          setListoDespacho,
          buscarComentarios
                            } = useControlAcuerdo()
  const minimizadoTodo        = ref< boolean  >(false)
  const srcPDF                = ref< string   >("")
  const nombrePDF             = ref< string   >("")
  const acuerdoRemsion        = ref< IAcuerdo >( new Acuerdo() )  
  const moduloCondiciones     = ref< InstanceType<typeof condiciones>  | null>(null)
  const orden                 = ref< IOrdenCSS  >(OrdenCSS)
  //dexieBodegas()
  //const { bodegas           } = storeToRefs( useStoreDexie() )

  const props                 = defineProps({
    id:   { required: true, type: String },
    tipo: { required: true, type: String as PropType< TTipoAcuerdo > },
  })

  const { id, tipo }          = toRefs( props )
  
  const alturaFila1           = computed( ()=>    acuerdo.value.esPedido      ? "320px"
                                                : acuerdo.value.esOCProveedor ? "150px"
                                                : acuerdo.value.esCotizacion  ? "260px"
                                                :                               "320px"
                                        )

  watch ( [()=>acuerdo.value.id, ()=>acuerdo.value.tipo],
          ()=> {
            useTitle(`${acuerdo.value.emoji} ${acuerdo.value.title}`)
            lineaElegida.value  = new LineaAcuerdo()
          }
        )

  provide('superminimizado', minimizadoTodo)

  async function recargar(){
    await buscarAcuerdo( tipo.value, id.value )
  }

  async function clickAprobarCotizacion(){
    await aprobarCotizacion()
    await buscarAcuerdoEnlazados( /* true */ )
  }

  function cargarArchivos( files : IArchivo[] ) { acuerdo.value.archivos = files }

  /* async function clickNuevaEntrega()
  {
    const fechaYmetodoOk = moduloCondiciones.value?.validar()
    if(!fechaYmetodoOk) {
      window.scrollTo({ top: 0, behavior: 'smooth'})
      return 
    }
    const url = acuerdo.value.urlDolibarrNuevoEnvio + "&entrepot_id=" + getIdBodegaByArea( acuerdo.value.tercero.area )
    window.open(url, '_blank')

    await Tool.pausa( 16_000 )
    await buscarAcuerdoEnlazados()

    function getIdBodegaByArea( area : AREA ) : number
    {
      const idBodega= bodegas.value.find( b => b.padre_id == 0 && b.area == area )?.id ?? 0
      return idBodega
    }
  } */

  async function generarPDF( tipo : TTipoPDF = "quote")
  {
    if(acuerdo.value.esCotizacion || acuerdo.value.esPedido ){
      loading.value.pdf         = true
      modales.value.pdf         = true
      nombrePDF.value           = tipo == "quote" ? 'Cotizacion' : 'Cuenta de cobro'
      srcPDF.value              = await getQuotePDF( acuerdo.value, tipo )
      loading.value.pdf         = false
    }
    else
    if(acuerdo.value.esEntrega){
      abrirModalRemision(/* acuerdo.value */)
    }
  }


  function abrirModalRemision( /*acu : IAcuerdo */)
  {
    modales.value.remision      = true
    //acuerdoRemsion.value        = acu    
  }

  watch( toggle, (modo)=>{
    if(modo === "general")
    {
      orden.value.productos     = 80
      orden.value.entregas      = 90
    } else 
    if(modo === "productos")
    {
      orden.value.productos     = 2
      orden.value.entregas      = 90
    } else 
    if(modo === "entregas")
    {
      orden.value.productos     = 3
      orden.value.entregas      = 2
    }
  })

/*
import {  useRouter             } from 'vue-router'
const router                = useRouter()

import {  useStoreUser          } from 'stores/user'
const { usuario, permisos } = storeToRefs( useStoreUser() )
const usuarioEsDueño        = computed( () =>{ return acuerdo.value.tercero.responsables.some( r => r.id == usuario.value.id ) })
const puedeModificar        = computed( () =>{
                              if
                              (
                                permisos.value.cotizar_crear
                                &&
                                ( usuarioEsDueño.value || permisos.value.acceso_total )
                              )
                                return true
                              else
                                return false
                            })
const disableBtnValidar     = computed( () =>{
                                const largo = acuerdo.value.productos.filter( p => p.tipo < 3 ).length
                                return loading.value.carga || !largo
                              })
*/

  //* ////////////////////////////////////////////////////////////////////// Verificar permisos de lectura
/*   function verificarPermisosLectura()
  {
    if
    (
      ( acuerdo.value.tercero.esProveedor   && !permisos.value.terceros_ver_proveedor )
      ||
      ( !usuarioEsDueño.value       && !permisos.value.acceso_total && acuerdo.value.tercero.esCliente && !acuerdo.value.tercero.esProveedor )
    )
    {
      router.push("/error")
    }
  } */  
</script>


<style scoped>
  .o-productos    { order: v-bind( 'orden.productos'  )}
  .o-entregas     { order: v-bind( 'orden.entregas'   )}
</style>