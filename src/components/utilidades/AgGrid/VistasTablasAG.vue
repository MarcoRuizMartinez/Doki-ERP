<template>
  <fieldset-filtro
    titulo                  ="Acciones en vistas" 
    class-contenido         ="column full-height q-gutter-xs no-wrap"
    style                   ="min-height: 120px;"
    >
    <q-btn
      v-bind                ="style.btnBaseSm"
      :label                ="!!vista.id ? 'Guardar' : 'Nueva'"
      icon                  ="mdi-content-save"
      color                 ="positive"
      @click                ="guardarVista"
      >
      <confirmar
        v-if                ="!!vista.id"
        @ok                 ="editarVistaEnDB"
      />
      <Tooltip :label       ="!!vista.id ? 'Guardar vista actual' : 'Crear nueva vista'"/>
    </q-btn>
    <q-btn
      v-bind                ="style.btnBaseSm"
      label                 ="Restaurar"
      icon                  ="mdi-sparkles" 
      color                 ="deep-purple"
      @click                ="restaurarVista"
      >
      <Tooltip label        ="Mostrar todas las columnas"/>
    </q-btn>
    <q-btn
      v-if                  ="!!vista.id"
      v-bind                ="style.btnBaseSm"
      label                 ="Borrar"
      icon                  ="mdi-close"
      color                 ="warning"
      >
      <Tooltip label        ="Borrar vista actual"/>
      <confirmar @ok        ="borrarVista"/>
    </q-btn>
  </fieldset-filtro>
  <fieldset-filtro
    titulo                  ="Vistas de columnas" 
    class-contenido         ="row full-height q-gutter-sm items-center"
    style                   ="min-height: 120px;"
    >
    <div>
      <q-btn                round dense flat
        icon                ="mdi-refresh"
        class               ="op60 op100-hover"         
        @click              ="buscarVistas"
        >
        <Tooltip label      ="Recargar vistas"/>
      </q-btn>       
    </div>
    <div v-for              ="v of vistas">
      <q-btn                
        v-bind              ="style.btnBaseMd"
        :color              ="v.id == vistaIdSelect ? 'primary' : 'white'"
        :text-color         ="v.id == vistaIdSelect ? 'white'   : 'grey-9'"
        :key                ="v.id"
        :icon               ="!!v.icon ? v.icon : undefined"
        :label              ="v.label"
        @click              ="cambiarVista( v.id )"        
      />
    </div>
  </fieldset-filtro>
  <q-inner-loading
      :showing              ="cargando"
      >
      <q-spinner-dots
        size                ="2em"
        color               ="white"
      />
    </q-inner-loading>  
  <!-- //* ///////////////////////////////////////////////////////////// Modal calendario de enventos de acuerdo -->
  <q-dialog
    v-model                 ="formularioOn"
    v-bind                  ="style.dialogo"
    >
    <formulario
      @vista-creada         ="vistaCreada"
    />    
  </q-dialog>  
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            onMounted             } from "vue";

  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreApp         } from 'stores/app'
  import {  useStoreUser        } from 'stores/user'

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  IVistaAG,
            VistaAG,
            TAccion             } from "components/utilidades/AgGrid/VistaAG"
  
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useTools            } from "src/composables/useTools"
  import {  style               } from "src/composables/useEstilos"
  import {  useFetch            } from "src/composables/useFetch"
  import {  getURL,
            getFormData         } from "src/composables/APIMaco"

  // * ///////////////////////////////////////////////////////////////////////  Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"            
  import    confirmar             from "components/utilidades/MenuConfirmar.vue"
  import    formulario            from "./VistaFormulario.vue"

  
  type TProps                 = { refVista : string }
  const { miFetch           } = useFetch()
  const { aviso             } = useTools()
  const { refVista }          = defineProps<TProps>() 
  const { vista             } = storeToRefs( useStoreApp() )
  const { usuario           } = storeToRefs( useStoreUser() )
  const vistas                = ref< IVistaAG[] >([])  
  const vistaIdSelect         = ref< number > (0)  
  const formularioOn          = ref< boolean >(false)  
  const cargando              = ref<boolean>(false)

  onMounted(()=>{
    buscarVistas()
  })

  function guardarVista()
  {
    if(!!vista.value.id)  // Edita
      vista.value.accion      = "editar"
    else                  // Guardar
    {
      nuevaInstanciaVista( "crear" )
      formularioOn.value      = true
    }
  }

  function restaurarVista()
  {
    nuevaInstanciaVista( "restaurar" )
    vistaIdSelect.value       = 0
  }

  async function buscarVistas()
  {
    cargando.value            = true
    vistas.value              = []
    vista.value               = new VistaAG()
    vistaIdSelect.value       = 0
    const { ok, data }        = await miFetch(  getURL("listas", "varios"),
                                                { method: "POST", body: getFormData( "vistasTablas", { ref: refVista } ) },
                                                { dataEsArray: true, mensaje: "buscar vistas", conLoadingBar: false }
                                              )

    if(ok)
    {
      if(!Array.isArray(data) || !data.length) return
      vistas.value            = await VistaAG.getVistasFromAPI( data )
    }
    cargando.value            = false
  }

  function cambiarVista( id : number )
  {
    vistaIdSelect.value       = id
    const index               = vistas.value.findIndex( v => v.id === id )
    if(index === -1) return 
    vista.value               = vistas.value[index]
  }

  async function editarVistaEnDB()
  {
    cargando.value                = true
    const objeto                  = { body:   getFormData( "editarVista", vista.value.vistaApi ), method: "POST" }
    const { ok }                  = await miFetch( getURL("servicios", "varios"), objeto, { mensaje: "editar vista" } )
    if(ok)
    {
      aviso( "positive", "Vista editada")
    }
    else
    {
      aviso( "negative", "Error al editar la vista" )
    }

    cargando.value                = false
  }

  async function borrarVista()
  {
    cargando.value                = true
    const objeto                  = { body:   getFormData( "borrarVista", vista.value.vistaApi ), method: "POST" }
    const { ok }                  = await miFetch( getURL("servicios", "varios"), objeto, { mensaje: "borrar vista" } )
    if(ok)
    {
      nuevaInstanciaVista("restaurar")
      aviso( "positive", "Vista borrada")
    }
    else
    {
      aviso( "negative", "Error al borrar la vista" )
    }

    cargando.value                = false
    buscarVistas()
  }

  function nuevaInstanciaVista( accion : TAccion = "") 
  {
    vista.value             = new VistaAG( accion )
    vista.value.ref         = refVista
    vista.value.creador     = usuario.value
    vista.value.editor      = usuario.value
  }

  function vistaCreada( id : number )
  {
    vistas.value.push( vista.value )
    vistaIdSelect.value     = id
    formularioOn.value      = false
  }
</script>