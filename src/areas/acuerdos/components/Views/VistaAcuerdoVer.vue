<template>
  <titulo
    class                   ="col-12"
    @click                  ="generarPDFCotizacion"
    @recargar               ="recargar"
  />
  <botonera
    class                   ="col-12"
    @clickPDF               ="generarPDFCotizacion"
    @clickAprobar           ="aprobarCotizacion"
    @clickAnular            ="anularAcuerdo"
    @clickValidar           ="validarAcuerdo"
    @clickEditar            ="editarAcuerdo"
    @clickBorrar            ="eliminarAcuerdo"  
  />
  <tercero-y-contacto       scroll
    class                   ="col-md-4 col-12"
    height-card             ="260px"
  />
  <condiciones              scroll
    class                   ="col-md-4 col-12"
    height-card             ="260px"
  /> 
  <totales                  scroll
    class                   ="col-md-4 col-12"
    height-card-min         ="260px"
  />
  <anticipos                scroll
    v-if                    ="acuerdo.esPedido"
    class                   ="col-md-4 col-12"
    height-card-min         ="182px"
  />
  <documentos
    class                   ="col-md-4 col-12"
    height-card-min         ="164px"
    :modulo                 ="acuerdo.modulo"
    :modulo-id              ="acuerdo.id ?? 0"
    :modulo-ref             ="acuerdo.ref"
    :puede-editar           ="true"
    @descarga-ok            ="cargarArchivos"
    @borrado-ok             ="cargarArchivos"
  />
  <notas
    class                   ="col-md-4 col-12"
    height-card             ="220px"  
  />
  <productos
    class                   ="col-12"
  />
  <!-- //* /////////////////  Visor PDF  -->
  <visor-pdf                descargar
    v-if                    ="acuerdo.esCotizacion"
    v-model:src             ="srcPDF"
    v-model:visible         ="ventanaPDF"
    nombre-pdf              ="Cotizacion"
    @click-descargar        ="guardarPDF"
  />

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
  import {  IArchivo, Archivo     } from "src/models/Archivo"  
  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  useCotizacionPDF      } from "src/areas/acuerdos/composables/useCotizacionPDF"
  //import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"  
  import {  TTipoAcuerdo          } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  import {  useApiDolibarr        } from "src/services/useApiDolibarr"
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    visorPdf                from "components/utilidades/VisorPDF.vue"
  import    notas                   from "src/areas/acuerdos/components/Notas.vue"
  import    titulo                  from "src/areas/acuerdos/components/Titulo.vue"
  import    totales                 from "src/areas/acuerdos/components/Totales.vue"
  import    botonera                from "src/areas/acuerdos/components/Botonera.vue"
  import    terceroYContacto        from "src/areas/acuerdos/components/TerceroYcontacto.vue"
  import    condiciones             from "src/areas/acuerdos/components/Condiciones.vue"
  import    productos               from "src/areas/acuerdos/components/ProductosAcuerdo.vue"
  import    anticipos               from "src/areas/acuerdos/components/Anticipos/ModuloAnticipos.vue"
  import    documentos              from "components/archivos/ModuloArchivos.vue"

  const { acuerdo,
          lineaElegida,
          loading           } = storeToRefs( useStoreAcuerdo() )
  const { apiDolibarr       } = useApiDolibarr()
  const { generarPDF,
          guardarPDF        } = useCotizacionPDF()
  const { aprobarCotizacion,
          anularAcuerdo,
          editarAcuerdo,
          buscarAcuerdo,
          eliminarAcuerdo,
          validarAcuerdo,
                            } = useControlAcuerdo()
  const minimizadoTodo        = ref< boolean  >(false)
  const srcPDF                = ref< string   >("")
  const ventanaPDF            = ref< boolean  >(false)

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

  async function generarPDFCotizacion()
  {
    if(acuerdo.value.esCotizacion){
      loading.value.pdf         = true
      ventanaPDF.value          = true
      srcPDF.value              = await generarPDF( acuerdo.value )
      loading.value.pdf         = false
    }
  }

  async function recargar(){
    await buscarAcuerdo( tipo.value, id.value )
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
</script>