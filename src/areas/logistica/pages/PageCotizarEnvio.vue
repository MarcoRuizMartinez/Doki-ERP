<template>
  <q-page padding class         ="row item-stretch content-start justify-start">
    <ventana
      class                     ="col-12"
      class-contenido           ="column items-center"
      height                    ="100%"
      size-icon-carga           ="22em"
      icono                     ="mdi-truck-check"
      :modo                     ="modo"
      :titulo                   ="titulo"
      :padding-contenido        ="modo === 'normal' ? '0' : '12px' "
      > 
      <template                 #menu>
        <barra-busqueda
          @buscar               ="buscar"
          @limpiar              ="limpiarBusqueda"
          @exportar             ="descargarAcuerdos"
          >
          <select-columnas
            v-model             ="columnasVisibles"
            label               ="Columnas"
            :almacen            ="almacenColumnas"
            :options            ="columnas"
          />
        </barra-busqueda>
      </template>
      <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
      <q-table                  bordered dense flat square
        class                   ="fit tabla-maco tabla-alto-min"
        row-key                 ="id"
        :rows                   ="costos"
        :columns                ="columnas"
        :visible-columns        ="columnasVisibles"
        :rows-per-page-options  ="[100]"
        >
      </q-table>
    </ventana>
  </q-page>
</template>
<script setup lang="ts">
  import {  ref,
            computed,
            onMounted,
            onUnmounted         } from "vue"
  import {  useRouter           } from "vue-router"           

  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                                            
  import {  useStoreUser        } from 'src/stores/user'
  import {  useStoreNomina      } from "src/stores/nomina"

  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useTitle            } from "@vueuse/core"
  import {  useCotizarEnvio     } from "src/areas/logistica/controllers/ControlCotizarEnvio"
  import {  useTools, 
            formatoPrecio       } from "src/useSimpleOk/useTools"
  import {  generarCSVDesdeTabla} from "src/useSimpleOk/UtilFiles"

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  Columna, IColumna   } from "src/models/Tabla"
  import {  ModosVentana,
            ALMACEN_LOCAL       } from "src/models/TiposVarios"
  import {  IQuery              } from "src/models/Busqueda"
  import {  ICostoEnvio         } from "src/areas/logistica/models/CostoEnvio"
  
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"  
  import    selectColumnas        from "components/utilidades/select/SelectColumnas.vue"
  import    barraBusqueda         from "src/areas/logistica/components/BarraCotizarEnvios.vue"

  const { incentivosSearch : b  } = storeToRefs( useStoreNomina() )
  useTitle("🚛 Cotizar envío")

  const { cotizarEnviame        } = useCotizarEnvio()
  const { usuario, permisos     } = storeToRefs( useStoreUser() )  
  const { esMobil, aviso        } = useTools()
  const router                    = useRouter()
  const costos                    = ref< ICostoEnvio[] >([])
  
  const modo                      = ref< ModosVentana >("esperando-busqueda")  
  const indexSelect               = ref< number >(-1) 
  const titulo                    = computed(()=>
  {
    let   titulo                  = ""
    const largo                   = costos.value.length

    if(modo.value                 === "esperando-busqueda")
      titulo                      = `Cotizador de envíos`
    else
    if(!largo)
      titulo                      = `Cotizando envío...`
    else
    {
      titulo                      = `Resultado: ${largo} `
      if(largo                    === 1)
        titulo                    += "resultado"
      else
        titulo                    += "resultados"
    }

    return titulo
  })
  
  const almacenColumnas           = ALMACEN_LOCAL.COL_COTZ_ENVI
  const columnas                  = ref< IColumna[]   >([])
  const columnasVisibles          = ref< string[]     >([])
  

  onMounted(iniciar)  

  async function iniciar()
  {    
    costos.value                  = []    
    await b.value.montarBusqueda( usuario.value.id, router, false, false )
    modo.value                    = "esperando-busqueda"
    crearColumnas()
  }

  onUnmounted(()=>{
    costos.value                  = []
    b.value.desmontarBusqueda()
  })

  async function buscar( query : IQuery )
  {
    costos.value                  = []
    modo.value                    = "buscando"
    costos.value                  = await cotizarEnviame( query )
    modo.value                    = !!costos.value.length ? "normal" : "sin-resultados"
  }

  function limpiarBusqueda()
  {
    modo.value                    = "esperando-busqueda"
    costos.value                  = []
  }

  function crearColumnas()
  {
    columnas.value = [
      new Columna(  { name: "carrier",            label: "transportadora" }),
      new Columna(  { name: "servicio"}),
      Columna.ColumnaPrecio ( { name: "precio",   clase: "text-bold"  }),
      new Columna(  { name: "diasTransito",       label: "Dias transito", align: "center" }),      
      new Columna(  { name: "tipoServicios",      label: "Tipo servicios" }),
    ]
    columnasVisibles.value  = columnas.value.filter(c => c.visible ).map( c => c.name )
  }

  function descargarAcuerdos()
  {
    let ok = generarCSVDesdeTabla( `Costo transporte ${b.value.f.municipio.label} - ${b.value.f.municipioContacto.label}`, columnas.value, costos.value )

    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file")
  }  
</script>