<template>
  <q-select                   filled use-input dense fill-input hide-selected
    v-model                   ="modelo"
    label                     ="Proyecto"
    input-debounce            ="400"
    behavior                  ="dialog"
    :class                    ="$attrs.class"
    :loading                  ="cargando || loading"
    :options                  ="proyectos"
    :disable                  ="disable"
    :readonly                 ="readonly"
    :option-label             ="(proye : IProyecto ) => !proye.id ? '' : `${proye.ref} - ${proye.titulo}`"
    @filter                   ="buscar"
    @popup-show               ="virgen = true"
    @update:model-value       ="emitir"
    >
    <template                 #prepend>
      <q-icon
        name                  ="mdi-chart-gantt"
        :color                ="!!modelo && !!modelo.id ? 'primary' : 'grey-6'"
      />
    </template>
    <template                 #no-option>
      <q-item>
        <q-item-section class ="text-grey text-h6 ">
          No se encontró ningún proyecto
        </q-item-section>
      </q-item>
    </template>
    <template                 #append>
      <q-btn                  dense flat
        v-if                  ="!!proyecto.id"
        icon                  ="mdi-open-in-new"
        padding               ="0"
        target                ="_blank"
        @click.stop           ="true"
        :href                 ="proyecto.urlDolibarr"
        >
        <Tooltip label        ="Ver proyecto en Dolibarr"/>
      </q-btn>        
      <q-btn                  dense flat
        v-if                  ="!!proyecto.id"
        icon                  ="mdi-close"
        padding               ="0"
        @click.stop           ="true"
        >
        <confirmar  @ok       ="confirmarBorrar"/>
        <Tooltip label        ="Desvincular proyecto"/>
      </q-btn>
      <q-btn                  dense flat
        v-else-if             ="!readonly"
        icon                  ="mdi-plus"
        padding               ="0"
        target                ="_blank"
        @click.stop           ="true"
        :href                 ="urlCrearProyecto"
        >
        <Tooltip label        ="Crear proyecto en Dolibarr"/>
      </q-btn>
      <!--
      <q-btn                  dense flat
        icon                  ="mdi-information"
        padding               ="0"
        @click.stop           ="mostrarVentana('ver')"
        >
        <tooltip-contacto
          :contacto           ="proyecto"
        />
      </q-btn>
      -->
    </template>
  </q-select>
  <q-dialog
    v-model                   ="ventanaOk"
    v-bind                    ="style.dialogo"
    >
    <!-- //* /////////////  Formulario Proyecto  -->
    <!--
    <form-contacto
      v-model                 ="proyectoEditar"
      :es-tercero-ctz         ="tercero.esTerceroCtz"
      :municipio              ="tercero.municipio"
      :editando               ="editar"
      @crear                  ="proyectoCreado"
      @update:model-value     ="proyectoEditado"
    />
    -->
  </q-dialog>
</template>
<script setup lang="ts">
  import {  useApiDolibarr  } from "src/composables/useApiDolibarr"
  import {  ref,
            toRefs,
            computed,
            PropType,
            watch
                            } from "vue"
  //* ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs     } from 'pinia'                            
  import {  useStoreAcuerdo } from 'stores/acuerdo'  
  //* ///////////////////////////////////////////////////////////////////////////// Componibles
  import {  IProyecto,
            Proyecto        } from "src/areas/proyectos/models/Proyecto"
  import {  ITercero        } from "src/areas/terceros/models/Tercero"            
  //* ///////////////////////////////////////////////////////////////////////////// Componentes
  //import    tooltipProyecto   from "src/areas/proyectos/components/TooltipProyecto.vue"
  //import    formProyecto      from "src/areas/proyectos/components/FormularioProyecto.vue"
  import    confirmar         from "components/utilidades/MenuConfirmar.vue"
  import {  style           } from "src/composables/useEstilos"

  const { acuerdo           } = storeToRefs( useStoreAcuerdo() )
  const proyectos             = ref< IProyecto[] > ([])
  const modelo                = ref< IProyecto >()
  const proyectoEditar        = ref< IProyecto >()
  const cargando              = ref< boolean >(false)
  const virgen                = ref< boolean >(true)
  const editar                = ref< boolean >(true)
  const { apiDolibarr       } = useApiDolibarr()

    const emit                  = defineEmits<{
    (e: 'update:proyecto',  value: IProyecto                ): void
    (e: 'proyectoInicial',  value: IProyecto                ): void
    (e: 'proyectoNuevo',    value: IProyecto                ): void
    (e: 'proyectoCambio',   value: IProyecto, idOld: number ): void
  }>()

  const props                 = defineProps({
    disable:    { default:  false,  type: Boolean                           },
    readonly:   { default:  false,  type: Boolean                           },
    loading:    { default:  false,  type: Boolean                           },
    proyecto:   { required: true,   type: Object as PropType< IProyecto >   },
    tercero:    { required: true,   type: Object as PropType< ITercero >    },
  })
  const { proyecto, tercero } = toRefs(props)
  const ventanaOk             = ref<boolean>(false)

  const urlCrearProyecto      = computed(() => `${process.env.URL_DOLIBARR}/projet/card.php?socid=${acuerdo.value.tercero.id}&action=create&status=1`)  

  function emitir( proye : IProyecto )
  {
    emit('update:proyecto', proye )
  }

  watch(proyecto, (newValue)=>
  {
      if(!newValue) return
      modelo.value            = newValue
    }
    ,{ immediate: true }
  )

  watch( modelo, (newProyecto, oldProyecto)=>
  {
    // Se asume que si oldProyecto es undefinide, y newProyecto es valido, es porque se esta cargando por primeva vez
    if(!!newProyecto && !oldProyecto) {
      emit('proyectoInicial', newProyecto )
    }
    else
    // Proyecto Old esta vacio y se esta agregando un proyecto desde cero
    if(!!newProyecto && !!oldProyecto && !oldProyecto.id) {
      emit('proyectoNuevo', newProyecto )
    }
    else
    // New y Old son validos entonces es un cambio de proyecto, y IDs son diferentes
    if
    (     !!newProyecto     && !!oldProyecto  &&  !!oldProyecto.id
      &&  oldProyecto.terceroId === newProyecto.terceroId
      &&  oldProyecto.id        !== newProyecto.id
    )
    {
      emit('proyectoCambio', newProyecto, oldProyecto.id )
    }
  })

  function confirmarBorrar()
  {
    modelo.value = new Proyecto()
    emitir(modelo.value)
  }
  
  async function buscar( busqueda : string, doneFn : Function )
  {
    if((!busqueda || busqueda.length < 2) && !virgen.value)
    {
      cargando.value          = false
      doneFn(() => { proyectos.value = [] } )
      return 
    }

    virgen.value              = false
    cargando.value            = true
    
    let url                   = "&limit=10"
    if(!acuerdo.value.esOCProveedor)
      url                    += "&thirdparty_ids=" + tercero.value.id
    url                      += `&sqlfilters=(t.fk_statut%3Alike%3A1)`
    if(!!busqueda) 
      url                    += `%26%26((t.title%3Alike%3A'%25${busqueda}%25')%7C%7C(t.ref%3Alike%3A'%25${busqueda}%25'))`.replaceAll(" ", "%20")

    const { data, ok }        = await apiDolibarr( "buscar", "proyecto", url )
    let projects :IProyecto[] = []

    if(ok && Array.isArray( data ) && !!data.length)
    {      
      for (const proy of data as any[])
      {
        projects.push( Proyecto.convertirDataApiToProyecto( proy ) )        
      }
    }
    doneFn( () => proyectos.value = projects )

    cargando.value            = false
  }

  /* function proyectoCreado( proye : IProyecto )
  {
    ventanaOk.value           = false
    modelo.value              = proye
    proyectos.value.push( proye )
    emit('update:proyecto', proye )
  } */

  /* function mostrarVentana( tipo : "nuevo" | "editar" | "ver" )
  {
    ventanaOk.value           = true
    editar.value              = tipo === "editar"
    proyectoEditar.value      = tipo === "nuevo" ? new Proyecto( tercero.value.id ) : modelo.value
  } */

  /* function proyectoEditado( proyec : IProyecto )
  {
    const index               = proyectos.value.findIndex( p => p.id == proyec.id) 
    proyectos.value[index]    = proyec
    modelo.value              = proyec
    ventanaOk.value           = false
  }   */

</script>