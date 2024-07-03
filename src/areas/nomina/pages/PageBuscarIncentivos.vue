<template>
  <q-page padding class         ="row item-stretch content-start justify-start">
    <ventana
      class                     ="col-12"
      class-contenido           ="column items-center"
      height                    ="100%"
      size-icon-carga           ="22em"
      icono                     ="mdi-account-details"
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
            ref                 ="comColumnas"
            label               ="Columnas"
            :almacen            ="almacenColumnas"
            :options            ="columnas"
          />
        </barra-busqueda>
      </template>
      <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
      <q-table                  bordered dense flat square
        v-model:selected        ="seleccion"
        class                   ="fit tabla-maco tabla-alto-min"
        row-key                 ="id"
        selection               ="multiple"
        :rows                   ="incentivos"
        :columns                ="columnas"
        :visible-columns        ="columnasVisibles"
        :rows-per-page-options  ="[100]"
        >
        <!-- //* ///////////////  Columna Ref  -->
        <template               #body-cell-origenRef="props">
          <q-td   :props        ="props">
            <router-link
              class             ="link-limpio"
              :to               ="props.row.origenURL"
              >
              {{ props.value }}
            </router-link>
          </q-td>
        </template>
        <!-- //* ///////////////  Columna Valor  -->
        <template               #body-cell-valor="props">
          <q-td   :props        ="props" class="text-right">
            <span               
              class             ="fuente-mono text-bold"              
              :class            ="{ 'text-red' :  props.row.valor < 0 }"
              >
              {{ Format.precio( props.row.valor, "decimales-no") }}
            </span>
          </q-td>
        </template>            
        <!-- //* ///////////////  Columna Usuario  -->
        <template               #body-cell-usuarioLabel="props">
          <q-td   :props        ="props"><chip-usuario :usuario="props.row.usuario"/></q-td>
        </template>    
        <!-- //* ///////////////  Columna Creador  -->
        <template               #body-cell-creadorLabel="props">
          <q-td   :props        ="props"><chip-usuario :usuario="props.row.creador"/></q-td>
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
  import {  useStoreUser        } from 'stores/user'
  import {  useStoreNomina      } from "stores/nomina"
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useTitle            } from "@vueuse/core"
  import {  useTools, 
            Format              } from "src/composables/useTools"
  import {  generarCSVDesdeTabla} from "src/composables/UtilFiles"
  import {  useControlIncentivos} from "src/areas/nomina/controllers/ControlIncentivos"

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  Columna, IColumna   } from "src/models/Tabla"
  import {  TModosVentana,
            ALMACEN_LOCAL       } from "src/models/TiposVarios"  
  import {  IQuery              } from "src/models/Busqueda"
  import {  IIncentivo          } from "src/areas/nomina/models/Incentivo"  
  
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"  
  import    selectColumnas        from "components/utilidades/select/SelectColumnas.vue"
  import    barraBusqueda         from "src/areas/nomina/components/BarraBusquedaIncentivos.vue"

  // * ////////////////////////// Columnas
  import    chipUsuario           from "src/areas/usuarios/components/ChipUsuario.vue"

  useTitle("🧮 Comisiones")

  const { usuario, permisos     } = storeToRefs( useStoreUser() )  
  const { incentivos,
          incentivosSearch : b  } = storeToRefs( useStoreNomina() )
  const { buscarIncentivos      } = useControlIncentivos()
  const { esMobil, aviso        } = useTools()
  const router                    = useRouter()
  
  const modo                      = ref< TModosVentana >("esperando-busqueda")  
  const indexSelect               = ref< number >(-1) 
  const comColumnas               = ref< InstanceType<typeof selectColumnas> | null>(null)

  const titulo                    = computed(()=>
  {
    let   titulo                  = ""
    const largo                   = incentivos.value.length

    if(modo.value                 === "esperando-busqueda")
      titulo                      = `Buscador de bonos`
    else
    if(!largo)
      titulo                      = `Buscando bonos...`
    else
    {
      titulo                      = `Resultado: ${largo} `
      if(largo                    === 1)
        titulo                    += "bono"
      else
        titulo                    += "bonos"
    }

    return titulo
  })
  
  const almacenColumnas           = ALMACEN_LOCAL.COL_INVENTIVOS
  const columnas                  = ref< IColumna[]   >([])
  const columnasVisibles          = ref< string[]     >([])
  const seleccion                 = ref< IIncentivo[] >([])

  onMounted(iniciar)  

  async function iniciar()
  {    
    incentivos.value              = []
    const esEspecial              = usuario.value.esGerencia || usuario.value.esContable
    await b.value.montarBusqueda( usuario.value.id, router, !esEspecial, esEspecial, 100 )
    modo.value                    = "esperando-busqueda"
    crearColumnas()
  }

  onUnmounted(()=>{
    incentivos.value              = []
    b.value.desmontarBusqueda()
  })

  async function buscar( query : IQuery )
  {
    incentivos.value              = []
    modo.value                    = "buscando"
    incentivos.value              = await buscarIncentivos( query, "varios" ) as IIncentivo[]
    modo.value                    = !!incentivos.value.length ? "normal" : "sin-resultados"
  }

  function limpiarBusqueda()
  {
    modo.value                    = "esperando-busqueda"
    incentivos.value              = []
  }

  function crearColumnas()
  {
    columnas.value = [
      new Columna(  { name: "origenRef",              label: "Ref" }),
      new Columna(  { name: "estadoLabel",            label: "Estado"  }),
      new Columna(  { name: "valor"                                    }),
      new Columna(  { name: "estadoPagoLabel",        label: "Pago" }),
      Columna.ColumnaPrecio ( { name: "pagado",       clase: "text-bold"  }),
      new Columna(  { name: "usuarioLabel",           label: "Usuario" }),
      new Columna(  { name: "creadorLabel",           label: "Creador" }),
      new Columna(  { name: "nota" } ),
      new Columna(  { name: "creadoEl",               label: "Fecha creación" } ),
      new Columna(  { name: "modificadoEl",           label: "Fecha modificación" } ),
      
    ]
    columnasVisibles.value  = columnas.value.filter(c => c.visible ).map( c => c.name )
    comColumnas.value?.cargarColumnasLocal()
  }

  function descargarAcuerdos()
  {
    let ok = generarCSVDesdeTabla( "Informe comisiones", columnas.value, incentivos.value )

    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file")
  }  
</script>