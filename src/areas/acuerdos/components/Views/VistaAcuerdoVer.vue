<template>
  <titulo
    class                   ="col-12"
    @click                  ="generarCotizacionPDF"
    @recargar               ="recargar"
  />
  <botonera
    class                   ="col-12"
    @click-pdf              ="generarCotizacionPDF"
    @click-aprobar          ="clickAprobarCotizacion"
    @click-anular           ="anularAcuerdo"
    @click-validar          ="validarAcuerdo"
    @click-editar           ="pasarABorradorAcuerdo"
    @click-borrar           ="eliminarAcuerdo"
    @click-remision         ="generarRemisionPDF"
    @click-reabrir          ="reabrirPedido"
    @click-recargar         ="recargar"
    @click-entregado        ="cerrarPedido"
    @click-comisiones       ="modales.comisiones = true"
    @click-nueva-entrega    ="clickNuevaEntrega"
  />
  <tercero-y-contacto       scroll
    class                   ="col-md-4 col-12"
    height-card             ="260px"
  />
  <condiciones              scroll
    ref                     ="moduloCondiciones"
    class                   ="col-md-4 col-12"
    height-card             ="260px"
  />
  <totales                  scroll
    class                   ="col-md-4 col-12"
    height-card-min         ="260px"
  />
  <contactos
    v-if                    ="acuerdo.tercero.esEmpresa"
    class                   ="col-12"
  />
  <enlaces                  minimizar
    ref                     ="moduloEnlaces"
    class                   ="col-md-4 col-12"
    height-card             ="220px"
  />
  <documentos               minimizar
    class                   ="col-md-4 col-12"
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
    class                   ="col-md-4 col-12"
    height-card-min         ="140px"
  />
  <notas
    class                   ="col-md-4 col-12"
    height-card             ="220px"
    :class                  ="{ 'order-1' : acuerdo.esPedido }"
  />
  <productos
    class                   ="col-12"
  />
  <!-- //* /////////////////  Visor PDF  -->
  <visor-pdf                descargar
    v-if                    ="acuerdo.esCotizacion"
    v-model:src             ="srcPDF"
    v-model:visible         ="modales.pdfCotizacion"
    nombre-pdf              ="Cotizacion"
    @click-descargar        ="guardarPDF"
  />
  <!-- //* ///////////////////////////////////////////////////////////// Modal Buscar productos -->
  <q-dialog
    v-model                 ="modales.comisiones"
    v-bind                  ="dialogDefault"      
    >
    <comisiones style       ="max-width: initial;"/>
  </q-dialog>
<!--   <q-dialog
    v-model                 ="modales.nuevaEntrega"
    v-bind                  ="dialogDefault"      
    >
    <nueva-entrega />
  </q-dialog>
 -->
    
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
            PropType,
                                  } from "vue"
  import {  useTitle              } from "@vueuse/core"
  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
  //* ///////////////////////////////////////////////////////////////////////////////// Modelos
  //import {  Acuerdo, TIPO_ACUERDO } from "../../models/Acuerdo"
  import {  LineaAcuerdo          } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  IArchivo              } from "src/models/Archivo"
  import {  AREA                  } from "src/models/TiposVarios"
  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  useCotizacionPDF      } from "src/areas/acuerdos/composables/useCotizacionPDF"
  //import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  import {  TTipoAcuerdo          } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  import {  dialogDefault         } from "src/useSimpleOk/useEstilos"  
  import {  dexieBodegas          } from "src/services/useDexie"  
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    visorPdf                from "components/utilidades/VisorPDF.vue"
  import    notas                   from "src/areas/acuerdos/components/Notas.vue"
  import    titulo                  from "src/areas/acuerdos/components/Titulo.vue"
  import    totales                 from "src/areas/acuerdos/components/Totales.vue"
  import    botonera                from "src/areas/acuerdos/components/Botonera.vue"
  import    terceroYContacto        from "src/areas/acuerdos/components/TerceroYcontacto.vue"
  import    condiciones             from "src/areas/acuerdos/components/Condiciones.vue"
  import    productos               from "src/areas/acuerdos/components/ProductosAcuerdo.vue"
  import    enlaces                 from "src/areas/acuerdos/components/EnlacesAcuerdos.vue"
  import    contactos               from "src/areas/acuerdos/components/Contactos.vue"
  //import    nuevaEntrega            from "src/areas/acuerdos/components/Modals/NuevaEntregaSelectBodega.vue"
  import    anticipos               from "src/areas/acuerdos/components/Anticipos/ModuloAnticipos.vue"
  //import    remision                from "src/areas/acuerdos/components/PDF/RemisionPDF.vue"
  import    documentos              from "components/archivos/ModuloArchivos.vue"
  import    comisiones              from "./../Modals/Comisiones.vue"

  const { acuerdo,
          modales,
          lineaElegida,
          loading           } = storeToRefs( useStoreAcuerdo() )
  const { generarPDF,
          guardarPDF        } = useCotizacionPDF()
  const { aprobarCotizacion,
          anularAcuerdo,
          pasarABorradorAcuerdo,
          reabrirPedido,
          buscarAcuerdo,
          eliminarAcuerdo,
          validarAcuerdo,
          cerrarPedido,
                            } = useControlAcuerdo()
  const minimizadoTodo        = ref< boolean  >(false)
  const srcPDF                = ref< string   >("")
  const moduloEnlaces         = ref<InstanceType<typeof enlaces>      | null>(null)
  const moduloCondiciones     = ref<InstanceType<typeof condiciones>  | null>(null)
  const bodegas               = dexieBodegas()

  const props                 = defineProps({
    id:   { required: true, type: String },
    tipo: { required: true, type: String as PropType< TTipoAcuerdo > },
  })

  const { id, tipo }          = toRefs( props )

  watch ( [()=>acuerdo.value.id, ()=>acuerdo.value.tipo],
          ()=> {
            useTitle(`${acuerdo.value.emoji} ${acuerdo.value.title}`)
            lineaElegida.value  = new LineaAcuerdo()
          }
        )

  provide('superminimizado', minimizadoTodo)

  async function generarCotizacionPDF()
  {
    if(!acuerdo.value.esCotizacion) return

    loading.value.pdf           = true
    modales.value.pdfCotizacion = true
    srcPDF.value                = await generarPDF( acuerdo.value )
    loading.value.pdf           = false
  }

  async function generarRemisionPDF()
  {
    if(!acuerdo.value.esPedido) return

    //loading.value.pdf           = true
    modales.value.pdfRemision   = true
  }


  async function recargar(){
    await buscarAcuerdo( tipo.value, id.value )
  }

  async function clickAprobarCotizacion()
  {
    await aprobarCotizacion()
    moduloEnlaces.value?.buscar()
  }

  function cargarArchivos( files : IArchivo[] ) { acuerdo.value.archivos = files }
/*
import {  useRouter             } from 'vue-router'
const router                = useRouter()

import {  useStoreUser          } from 'src/stores/user'
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

  function clickNuevaEntrega()
  {
    const fechaYmetodoOk = moduloCondiciones.value?.validar()
    if(!fechaYmetodoOk) return 
    const url = acuerdo.value.urlDolibarrNuevoEnvio + "&entrepot_id=" + getIdBodegaByArea( acuerdo.value.tercero.area )
    console.log("url: ", url);
    window.open(url, '_blank')



    function getIdBodegaByArea( area : AREA ) : number
    {
      
      console.log("bodegas: ", bodegas.value);
      const idBodega  = bodegas.value.find( b => b.padre_id == 0 && b.area == area )?.id ?? 0
      console.log("idBodega: ", idBodega);

      return idBodega
    }
  }

</script>
