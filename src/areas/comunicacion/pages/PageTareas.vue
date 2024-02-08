<template>
  <q-page padding class               ="row item-stretch content-start justify-start">
    <ventana
      :titulo                         ="titulo"
      class                           ="col-12"
      class-contenido                 ="column items-center"
      height                          ="100%"
      size-icon-carga                 ="22em"
      icono                           ="mdi-check-box-outline"
      icono-sin-resultados            ="mdi-checkbox-multiple-marked-outline"
      mensaje-sin-resultados          ="No se encontraron tareas"
      :modo                           ="modo"
      :padding-contenido              ="modo === 'normal' ? '0' : '12px' "
      >
      <template                       #menu>
      <!-- //* ///////////////////////////////////////////////// Barra busqueda -->
        <busqueda
          :largo                      ="tareas.length"
          @buscar                     ="buscar"
          @limpiar                    ="limpiarBusqueda"
          @exportar                   ="descargarAcuerdos"
          @nueva-tarea                ="abrirFormularioNuevaTarea"
          >
          <select-columnas
            v-model                   ="columnasVisibles"
            ref                       ="comColumnas"
            label                     ="Columnas"
            :almacen                  ="ALMACEN_LOCAL.COL_TAREAS"
            :options                  ="columnas"
          />          
          <template                   #filtro>
            <input-buscar             clearable hundido
              v-model                 ="filtro"
              label                   ="Filtrar"
              class                   ="width160"
              icon                    ="mdi-filter"
              :disable                ="!tareas.length"
            />
          </template>
        </busqueda>
      </template>
      <!-- //* //////////////////////////////////////////////////////// Tabla resultados-->
      <q-table                        bordered dense flat
        class                         ="fit tabla-maco tabla-alto-min"
        row-key                       ="id"
        :filter                       ="filtro"
        :rows                         ="tareas"
        :columns                      ="columnas"
        :visible-columns              ="columnasVisibles"
        :pagination                   ="{ sortBy: 'cuandoValue',  descending: false, }"
        :rows-per-page-options        ="[100]"
        @row-dblclick                 ="( e : Event, row : Object, i: number )=> mostrarTarea( row as IAccion )"
        >
        <!-- //* ///////////////////  Columna Titulo  -->
        <template #body-cell-titulo   ="props">
          <q-td   :props              ="props">
            <span
              class                   ="cursor-pointer text-1_2em"
              @click                  ="mostrarTarea(props.row)"
              >
              <span
                v-if                  ="props.row.prioridad.value >= 1"
                class                 ="text-1_3em"
                >
                {{ props.row.prioridadEmoji }}
              </span>
              {{ props.row.titulo }}
            </span>
            <Tooltip>
              Prioridad {{ props.row.prioridadLabel }}<br/>
              <span
                style                 ="max-width: 300px;"
                class                 ="ellipsis-3-lines"
                >
                {{ props.row.comentario }}
              </span>
            </Tooltip>
          </q-td>
        </template>
        <!-- //* ///////////////////  Columna Tipo y Tercero  -->
        <template #body-cell-tipoLabel="props">
          <q-td   :props              ="props">
            <q-btn                    rounded
              v-bind                  ="style.btnFlatMd"
              color                   ="primary"
              :label                  ="props.row.tipoLabel"
              type                    ="a"
              :to                     ="props.row.toTipo"
            />
            <q-btn
              v-if                    ="props.row.tieneTerceroYNoEsTercero"
              v-bind                  ="style.btnFlatMd"
              color                   ="primary"
              label                   ="🏪"
              type                    ="a"
              :to                     ="`/tercero/${props.row.terceroId}`"
              >
              <Tooltip label          ="Ver tercero"/>
            </q-btn>
          </q-td>
        </template>
        <!-- //* ///////////////////  Columna Progreso  -->
        <template #body-cell-progreso ="props">
          <q-td   :props              ="props">
            <progreso
              v-model                 ="props.row"
              class                   ="justify-around width110"
              size                    ="sm"
              @set                    ="( x100 ) => ejecutarCambiarProgreso( props.row.id, x100 )"
            />            
          </q-td>
        </template>  
        <!-- //* ///////////////////  Columna Cuando  -->
        <!-- @update:model-value   ="actualizar" -->
        <template
          #body-cell-cuandoLabel      ="props">
          <q-td   :props              ="props">
            <!-- //* //////////////   Cuando -->
            <select-label-value       no-filled
              v-if                    ="!props.row.esFecha"
              v-model                 ="props.row.cuando"
              :options                ="Cuando"
              :readonly               ="!props.row.usuarioPermitido"
              @update:model-value     ="()=> ejecutarCambiarCuando( props.row.id, props.row.cuando.value ) "
            />
            <span v-else>{{ props.row.cuandoLabel }}</span>
          </q-td>
        </template>
        <!-- //* ///////////////////  Columna Asignado  -->
        <template
          #body-cell-asignadoLabel    ="props">
          <q-td   :props              ="props">
            <chip-usuario             :usuario="props.row.asignado"/>
            <q-btn
              v-if                    ="!props.row.creadorEsAsignado"
              v-bind                  ="style.btnRedondoFlatSple"
              icon                    ="mdi-check-all"
              class                   ="q-ml-xs"
              :color                  ="props.row.aceptado ? 'info' : props.row.usuarioEsAsignado ? 'deep-orange-9' : 'grey-6' "
              @click                  ="()=> cambiarAceptar( props.row )"
              >
              <Tooltip  :label        ="props.row.aceptado ? 'Tarea aceptada' : 'Esperando aceptación'"/>
            </q-btn>
          </q-td>
        </template>
        <!-- //* ///////////////////  Columna Creador -->
        <template
          #body-cell-creadorLabel     ="props">
          <q-td   :props              ="props">
            <chip-usuario             :usuario="props.row.creador"/>
          </q-td>
        </template>        
        <!-- //* ///////////////////  Columna Editor  -->
        <template
          #body-cell-modificoLabel    ="props">
          <q-td   :props              ="props">
            <chip-usuario             :usuario="props.row.modifico"/>
          </q-td>
        </template>
        <!-- //* ///////////////////  Columna Privacidad  -->
        <template
          #body-cell-publicoLabel     ="props">
          <q-td   :props              ="props">
          <span @click                ="()=> cambiarPrivacidad( props.row )">
            {{ props.value }}
          </span>
          <inner-loading :cargando    ="props.row.editando" size="md"/>
          </q-td>
        </template>
        
      </q-table>
    </ventana>
    <q-dialog
      v-model                         ="formularioOn"
      v-bind                          ="style.dialogo"
      >
      <formulario-tarea
        v-model                       ="tarea"
        :tipo                         ="TASK"
        @tarea-creada                 ="recibirTareaCreada"        
        @tarea-editada                ="recibirTareaEditada"
      />      
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            computed,
            watch,
            onMounted               } from "vue"
  import {  useRouter               } from "vue-router"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs             } from "pinia"
  import {  useStoreUser            } from "src/stores/user"
  import {  useStoreAcciones        } from "src/stores/acciones"
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useTitle                } from "@vueuse/core"
  import {  useTools                } from "src/composables/useTools"
  import {  generarCSVDesdeTabla    } from "src/composables/UtilFiles"
  import {  style                   } from "src/composables/useEstilos"
  import {  useControlComunicacion  } from "src/areas/comunicacion/controllers/ControlComunicacion"
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  Columna, IColumna       } from "src/models/Tabla"
  import {  IQuery                  } from "src/models/Busqueda"
  import {  IAccion, Accion,
            TASK, Cuando            } from "src/areas/comunicacion/models/Accion"
  import {  TModosVentana,
            ALMACEN_LOCAL           } from "src/models/TiposVarios"  

  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                   from "components/utilidades/Ventana.vue"
  import    inputBuscar               from "components/utilidades/input/InputSimple.vue"
  import    selectLabelValue          from "components/utilidades/select/SelectLabelValue.vue"
  import    selectColumnas            from "components/utilidades/select/SelectColumnas.vue"
  import    busqueda                  from "src/areas/comunicacion/components/Busqueda/BarraBusquedaTareas.vue"
  import    progreso                  from "../components/Progreso.vue"
  import    formularioTarea           from "../components/FormularioTarea.vue"
  import    chipUsuario               from "src/areas/usuarios/components/ChipUsuario.vue"
  import    innerLoading              from "components/utilidades/InnerLoading.vue"

  const { busqueda : b      } = storeToRefs( useStoreAcciones() )
  const { buscarAcciones,
          cambiarCuando,
          cambiarProgreso,
          cambiarAceptar,
          cambiarPrivacidad } = useControlComunicacion()

  const { usuario           } = storeToRefs( useStoreUser() )
  const { aviso             } = useTools()
  const router                = useRouter()

  const columnas              = ref< IColumna[] >( [] )
  const columnasVisibles      = ref< string[]   >( [] )
  const formularioOn          = ref< boolean      >( false )
  const filtro                = ref< string       >( ""    )
  const modo                  = ref< TModosVentana >( "esperando-busqueda" )
  const tareas                = ref< IAccion[]> ([])
  const tarea                 = ref< IAccion>   ( new Accion( usuario.value.id ) )
  const comColumnas           = ref< InstanceType<typeof selectColumnas> | null>(null)

  watch(()=>router.currentRoute.value.query, async ( q )=>{
    if(modo.value !== "buscando")
      await b.value.copiarQueryACampos( true )
  })

  onMounted( iniciar )

  async function iniciar()
  {
    useTitle("✅ Tareas")
    await b.value.montarBusqueda( usuario.value.id, router, false, true, 50, undefined, "Miembr"  )

    crearColumnas()
  }

  //* ///////////////////////////////////////////////////////////// Consultar Si existe cliente y Pagos
  async function buscar( q : IQuery )
  {
    q.codigo                  = "AC_OTH"

    if(!("progreso" in q))
      q.progreso              = "-2"

    tareas.value              = []
    modo.value                = "buscando"
    tareas.value              = await buscarAcciones( q, "tareas" )
    modo.value                = !!tareas.value.length ? "normal" : "sin-resultados"
  }

  function mostrarTarea( t : IAccion )
  {
    tarea.value               = t
    formularioOn.value        = true
  }

  function abrirFormularioNuevaTarea( personal : boolean ){
    tarea.value               = new Accion( usuario.value.id )
    if(personal){
      tarea.value.asignado    = usuario.value    
      tarea.value.publico     = false
    }

    formularioOn.value        = true
  }

  function recibirTareaCreada( t : IAccion ){
    tareas.value.unshift( t )
    formularioOn.value        = false
    modo.value                = "normal"
  }

  function recibirTareaEditada( t : IAccion, cerrar : boolean = true )
  {
    const index               = tareas.value.findIndex( ( ti )=> ti.id === t.id )
    if( index >= 0 ){
      tareas.value[index]     = Object.assign( tareas.value[index], t )
      formularioOn.value      = !cerrar
    }
  }

  async function ejecutarCambiarProgreso( idTarea : number, progreso: number ){
    const ok              = await cambiarProgreso( idTarea, progreso )
  }

  async function ejecutarCambiarCuando( idTarea : number, cuando: number ){
    const ok              = await cambiarCuando( idTarea, cuando )
  }


  //* ///////////////////////////////////////////////////////////// Crear Columnas
  function crearColumnas(){
    columnas.value            = [
      new Columna({ name: "asignadoLabel",      label: "asignado a" }),
      new Columna({ name: "titulo",             label: "tarea"      }),
      new Columna({ name: "comentario",         label: "detalles"   }),
      new Columna({ name: "cuandoLabel",        label: "para"       }),
      new Columna({ name: "progreso",           label: "progreso"   }),
      new Columna({ name: "tipoLabel",          label: "origen"     }),
      new Columna({ name: "creadorLabel",       label: "Creado por" }),
      new Columna({ name: "progresoLabel",      label: "estado",    clase: "text-bold" }),
      new Columna({ name: "publicoLabel",       label: "Visible"    }),
      new Columna({ name: "modificoLabel",      label: "editó"      }),      
      new Columna({ name: "fechaCreacionCorta", label: "creación"   }),      
      new Columna({ name: "fechaEdicionCorta",  label: "edición"    }),
      new Columna({ name: "cuandoValue",        label: "cuando Id"  }),
    ]

    const colsOcu =[ "modificoLabel", "comentario", "fechaCreacionCorta", "fechaEdicionCorta", "cuandoValue" ]
    Columna.ocultarColums( colsOcu, columnas.value )    
    columnasVisibles.value    = columnas.value.filter(c => c.visible ).map( c => c.name )
    comColumnas.value?.cargarColumnasLocal()
  }

  //* ///////////////////////////////////////////////////////////// Limpiar busqueda
  function limpiarBusqueda(){
    modo.value                = "esperando-busqueda"    
    filtro.value              = ""
    tareas.value              = []
  }

  //* ///////////////////////////////////////////////////////////// Descargar Archivos
  function descargarAcuerdos()
  {
    const ok = generarCSVDesdeTabla( "Tareas", columnas.value, tareas.value )
    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file")
  }

  const titulo = computed(()=>  modo.value == "esperando-busqueda" ? "Buscar tareas"
                                : modo.value == "buscando"         ? "Buscando tareas..."
                                : tareas.value.length + " Tarea" + ( tareas.value.length == 1 ? "" : "s" ) 
                          )
</script>