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
          :quote                ="quote"
          @buscar               ="buscar"
          @limpiar              ="limpiarBusqueda"
          @exportar             ="descargarAcuerdos"
          >
          <q-btn-toggle         spread push unelevated dense
            v-model             ="tipoListado"
            class               ="q-mb-sm q-mt-none"
            color               ="white"
            text-color          ="grey-8"
            toggle-color        ="primary"
            :options            ="[{ value: 0, label: 'Precios',   }, { value: 1, label: 'Cotizacion',   }, ]"
          />
          <Tooltip label        ="Resultados por pagina"/>          
          <template             #columnas>
            <select-columnas
              v-model           ="columnasVisibles"
              label             ="Columnas"
              :almacen          ="almacenColumnas"
              :options          ="columnas"
            />
          </template>
          <template             #filtro>
          <!-- //* ///////////////////////////////////////////////// Filtro -->        
            <input-buscar       clearable hundido
              v-model           ="filtro"
              label             ="Buscar"
              class             ="width140"
              icon              ="mdi-magnify"
              :disable          ="!costos.length"
            />
          </template>
        </barra-busqueda>
      </template>
      <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
      <q-table                  bordered dense flat square
        class                   ="fit tabla-maco tabla-alto-min"
        row-key                 ="sku"
        :filter                 ="filtro"
        :rows                   ="tipoListado === 0 ? costos : quote"
        :columns                ="columnas"
        :visible-columns        ="columnasVisibles"
        :rows-per-page-options  ="[100]"
        >
        <!-- //* ///////////////  Columna Servicio  -->
        <template               #body-cell-servicio="props">
          <q-td   :props        ="props">
            <q-btn
              v-bind            ="style.btnRedondoFlat"
              :icon             ="tipoListado == 0 ? 'mdi-plus' : 'mdi-close'"
              @click            ="agregarQuitarCosto( props.row )" 
            />               
            <span>{{ props.value }}</span>
          </q-td>
        </template>
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
  import {  useStoreAcuerdo     } from "src/stores/acuerdo"

  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useTitle            } from "@vueuse/core"
  import {  useCotizarEnvio     } from "src/areas/logistica/controllers/ControlCotizarEnvio"
  import {  useTools            } from "src/composables/useTools"
  import {  generarCSVDesdeTabla} from "src/composables/UtilFiles"
  import {  getMunicipioDB      } from "src/composables/useDexie"
  import {  style               } from "src/composables/useEstilos"

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  Columna, IColumna   } from "src/models/Tabla"
  import {  ModosVentana,
            ALMACEN_LOCAL       } from "src/models/TiposVarios"
  import {  IQuery              } from "src/models/Busqueda"
  import {  CostoEnvio,
            ICostoEnvio         } from "src/areas/logistica/models/CostoEnvio"
  
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"  
  import    inputBuscar           from "components/utilidades/input/InputSimple.vue"
  import    selectColumnas        from "components/utilidades/select/SelectColumnas.vue"
  import    barraBusqueda         from "src/areas/logistica/components/BarraCotizarEnvios.vue"

  const { busqueda : b          } = storeToRefs( useStoreAcuerdo() )
  useTitle("🚛 Cotizar envío")

  const { cotizarEnviame        } = useCotizarEnvio()
  const { usuario, permisos     } = storeToRefs( useStoreUser() )  
  const { esMobil, aviso        } = useTools()
  const router                    = useRouter()
  const costos                    = ref< ICostoEnvio[] >([])
  const quote                     = ref< ICostoEnvio[] >([])
  const filtro                    = ref< string >("")
  
  
  const modo                      = ref< ModosVentana >("esperando-busqueda")  
  const tipoListado               = ref< number >( 0 ) 
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
    await b.value.montarBusqueda( usuario.value.id, router, false, false, 100 )
    asignarValoresPorDefecto()

    //const municipioId         = getQueryRouterNumber( this.rourterQ .municipio ) 
    //this.f.municipio          = !!municipioId     ?     : new Municipio()    
    
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
    asignarDatosExtraACostos()
    modo.value                    = !!costos.value.length ? "normal" : "sin-resultados"
    tipoListado.value             = 0
  }

  function agregarQuitarCosto( costo : ICostoEnvio )
  {
    if(tipoListado.value          == 0){
      quote.value.push( Object.assign( new CostoEnvio(), costo )  )
      aviso("positive", "Precio añadido")
    }
    else{
      const i                     = quote.value.findIndex( ( c )=> c.sku === costo.sku )
      if(i === -1)
        return 
      quote.value.splice( i, 1 )
    }
  }

  async function asignarValoresPorDefecto()
  {
    if(!b.value.f.qty)            b.value.f.qty         = 1
    if(!b.value.f.peso)           b.value.f.peso        = 10
    if(!b.value.f.valorMax)       b.value.f.valorMax    = 100000
    if(!b.value.f.municipio.id)   b.value.f.municipio   = await getMunicipioDB( 1 )
  }


  function asignarDatosExtraACostos()
  {
    for (const costo of costos.value)
    {
      costo.origen                = b.value.f.municipio.label
      costo.destino               = b.value.f.municipioContacto.label
      costo.peso                  = b.value.f.peso 
      costo.producto              = b.value.f.nombre
      costo.qty                   = b.value.f.qty     ?? 1
      costo.altura                = b.value.f.altura  ?? 0
      costo.ancho                 = b.value.f.ancho   ?? 0
      costo.fondo                 = b.value.f.fondo   ?? 0
    }
  }

  function limpiarBusqueda()
  {
    modo.value                    = "esperando-busqueda"
    costos.value                  = []
    quote.value                   = []
    filtro.value                  = ""
  }

  function crearColumnas()
  {
    columnas.value = [
      new Columna(  { name: "carrier",                label: "transportadora",  clase: "text-bold"}),
      new Columna(  { name: "servicio"}),
      new Columna(  { name: "producto",               label: "Tipo producto"    }),
      new Columna(  { name: "diasTransito",           label: "Dias transito",   align: "center" }),
      Columna.ColumnaPrecio ( { name: "precio",       label: "Precio sin IVA"   }),
      Columna.ColumnaPrecio ( { name: "precioConIVA", label: "Precio con IVA"   }),
      new Columna(  { name: "qty",                    label: "Cantidad",        align: "center" }),      
      Columna.ColumnaPrecio ( { name: "totalSinIVA",  label: "Total sin IVA"    }),
      Columna.ColumnaPrecio ( { name: "totalConIVA",  label: "Total con IVA",   clase: "text-bold"  }),
      Columna.ColumnaPrecio ( { name: "seguro",       label: "Seguro",          visible: false }),
      Columna.ColumnaPrecio ( { name: "totalSeguro",  label: "Total seguro",    }),            
      new Columna(  { name: "peso",                   label: "Peso KG",         align: "center" }),
      new Columna(  { name: "altura",                 label: "Altura CM",       align: "center" }),
      new Columna(  { name: "ancho",                  label: "Ancho CM",        align: "center" }),
      new Columna(  { name: "fondo",                  label: "Fondo CM",        align: "center" }),      
      new Columna(  { name: "origen",                 visible: false            }),
      new Columna(  { name: "destino",                visible: false            }),
      new Columna(  { name: "tipoServicios",          label: "Tipo servicios",  visible: false }),
    ]
    columnasVisibles.value  = columnas.value.filter(c => c.visible ).map( c => c.name )
  }

  function descargarAcuerdos()
  {
    const ok = generarCSVDesdeTabla( "Costo transporte", columnas.value, tipoListado.value == 0 ? costos.value : quote.value )
    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file")
  }  
</script>