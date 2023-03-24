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
  import {  useStoreUser        } from 'src/stores/user'
  import {  useStoreNomina      } from "src/stores/nomina"
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useTitle            } from "@vueuse/core"
  import {  servicesAcuerdos    } from "src/areas/acuerdos/services/servicesAcuerdos"
  import {  useControlAcuerdo   } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  useTools            } from "src/useSimpleOk/useTools"
  import {  generarCSVDesdeTabla} from "src/useSimpleOk/UtilFiles"
  import {  useControlIncentivos} from "src/areas/nomina/controllers/ControlIncentivos"  

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  Columna, IColumna   } from "src/models/Tabla"
  import {  ModosVentana,
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
  const { getAcuerdos           } = servicesAcuerdos()
  const { buscarTerceroDolibarr } = useControlAcuerdo()  
  const { buscarIncentivos      } = useControlIncentivos()
  const { esMobil, aviso        } = useTools()
  const router                    = useRouter()
  
  const modo                      = ref< ModosVentana >("esperando-busqueda")  
  const indexSelect               = ref< number >(-1) 
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
    await b.value.montarBusqueda( usuario.value.id, router, !esEspecial, esEspecial )
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
      new Columna(  { name: "estadoLabel",            label: "Estado" }),
      Columna.ColumnaPrecio ( { name: "valor",        clase: "text-bold"  }),
      new Columna(  { name: "estadoPagoLabel",        label: "Pago" }),
      Columna.ColumnaPrecio ( { name: "pagado",       clase: "text-bold"  }),
      new Columna(  { name: "usuarioLabel",           label: "Usuario" }),
      new Columna(  { name: "creadorLabel",           label: "Creador" }),
      new Columna(  { name: "nota" }),
    ]
    columnasVisibles.value  = columnas.value.filter(c => c.visible ).map( c => c.name )
  }

  function descargarAcuerdos()
  {
    let ok = generarCSVDesdeTabla( "Informe comisiones", columnas.value, incentivos.value )

    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file")
  }  
</script>