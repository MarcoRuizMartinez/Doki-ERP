<template>
  <ventana                    scroll cerrar
    class-contenido           ="column items-center"
    titulo                    ="Nueva vista"
    icono                     ="mdi-view-carousel"
    min-width                 ="260px"
    :cargando                 ="cargando"
    >
    <q-form
      ref                     ="formulario"
      @submit                 ="onSubmit"
      class                   ="fit"
      >
      <!-- //* ///////////////////////////////////////////////////////////// Nota -->
      <input-text             alerta  
        v-model               ="vista.label"
        label                 ="Nombre"
        icon                  ="mdi-label"
        @enter                ="validar"
      />
      <div  class             ="q-my-sm row">
        <input-text
          v-model             ="vista.icon"
          label               ="Icono"
          icon                ="mdi-emoticon"
          class               ="col-10"
          @enter              ="validar"
        />
        <q-btn                round dense flat
          icon                ="mdi-open-in-new"
          class               ="op60 op100-hover col-2"
          href                ="https://pictogrammers.github.io/@mdi/font/5.4.55/"
          target              ="_blank"
          >
          <Tooltip label      ="Ver iconos"/>
        </q-btn>
      </div>
      <div>
        <q-checkbox
          v-model             ="conRuta" 
          label               ="Guardar busqueda"
        />
      </div>
      <q-btn
        v-bind                ="style.btnBaseMd"
        color                 ="positive"
        label                 ="Guardar"
        type                  ="submit"
        icon                  ="mdi-content-save"
        class                 ="full-width"
        :disable              ="vista.label.length < 4"
      />      
    </q-form>
    <template                 #acciones>
    </template>    
  </ventana>
</template>


<script setup lang="ts">
  //* ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref                   } from "vue"
  import {  QForm                 } from 'quasar'

  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreApp           } from 'stores/app'

  //* ///////////////////////////////////////////////////////////////////////////////// Componibles  
  import {  useTools, ToolType    } from "src/composables/useTools"
  import {  style                 } from "src/composables/useEstilos"
  import {  useFetch              } from "src/composables/useFetch"
  import {  getURL,  
            getFormData           } from "src/composables/APIMaco"

  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    inputText               from "components/utilidades/input/InputFormText.vue"
  
  const { vista                 } = storeToRefs( useStoreApp() )  
  const { aviso                 } = useTools()
  const { miFetch               } = useFetch()
  type TProps                     = { ruta : string }  
  const { ruta }                  = defineProps<TProps>() 

  type TEmit                      = { vistaCreada : [ id : number ] }
  const emits                     = defineEmits<TEmit>()
  const cargando                  = ref< boolean >(false)
  const conRuta                   = ref< boolean >(false)
  const formulario                = ref< InstanceType<typeof QForm> | null>(null)

  async function onSubmit()
  {
    cargando.value                = true

    vista.value.ruta              = !!conRuta.value ? ruta.split('?')[1] : ""    
    const objeto                  = { body:   getFormData( "nuevaVista", vista.value.vistaApi ), method: "POST" }
    const { ok, data }            = await miFetch( getURL("servicios", "varios"), objeto, { mensaje: "nueva vista" } )
    if(ok)
    {
      vista.value.id              = ToolType.anyToNum( data )
      emits("vistaCreada", vista.value.id)
      aviso( "positive", "Vista creada")
    }
    else
    {
      aviso( "negative", "Error al crear la vista" )
    }

    cargando.value                = false    
  }

  //* ////////////////////////////////////////////////////////////////////////////////////// Validar
  async function validar()
  {
    if(!formulario.value) return
    const validacionOk          = await formulario.value.validate()
    if(validacionOk)
      onSubmit()  
  }
</script>