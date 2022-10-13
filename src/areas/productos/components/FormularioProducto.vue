<template>
  <ventana
    class-contenido             ="column items-center"
    icono                       ="mdi-package-variant-closed"
    :titulo                     ="titulo"
    :cargando                   ="loading.carga"
    >
    <template                   #barra>
      <transition               enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown" mode="out-in">
        <q-btn                  dark push dense glossy
          v-if                  ="!readonly"
          class                 ="desktop-only"
          color                 ="positive"  
          icon                  ="mdi-layers-plus"
          size                  ="md"
          padding               ="2px 8px"          
          :label                ="tipo == 'ver' ? 'Guardar' : 'Crear'" 
          @click                ="validar"
        />
      </transition>
    </template>   
    <!-- //* ////////////////   FORMULARIO  -->
    <q-form
      ref                       ="formulario"
      @submit                   ="onSubmit"
      class                     ="row q-col-gutter-md fit"
      >
      <!-- //* //////////////   Nombre producto  -->
      <input-text               clearable AZ09 copy alerta autofocus
        v-model                 ="producto.nombre"
        class                   ="col-12"        
        icon                    ="mdi-text"
        label                   ="Nombre"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Ref producto  -->
      <input-text               clearable AZ09 copy alerta sin-espacios
        v-model                 ="producto.ref"
        class                   ="col-6"        
        icon                    ="mdi-identifier"
        label                   ="Ref"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Descripción  -->
      <q-input                  filled dense
        v-model                 ="producto.descripcion"
        label                   ="Descripción"
        type                    ="textarea"
        class                   ="col-12"
        debounce                ="800"
        :readonly               ="readonly"
        >
        <template #prepend >
          <q-icon name ="mdi-card-text-outline" />
        </template>
      </q-input>
    </q-form>
  </ventana>
</template>

<script setup lang="ts">
  import {  ref,
            toRefs,
            computed,
            PropType,
            onMounted
                            } from "vue"
  import {  storeToRefs     } from 'pinia'
  import {  useStoreProducto} from 'src/stores/producto'    
  import {  useStoreUser    } from "src/stores/user"
  import    ventana           from "components/utilidades/Ventana.vue"
  import    inputText         from "src/components/utilidades/input/InputFormText.vue"

  const { producto,
          loading           } = storeToRefs( useStoreProducto() )  

  const formulario            = ref< any >()
  

  //* ////////////////////////////////////////////////////////////////////////////////////// Props
  const props                 = defineProps(
  {
    tipo:         { default: "ver",         type: String as PropType< "crear" | "ver" > },
    puedeEditar:  { default: false,         type: Boolean                                                           },
  })

  const { tipo              } = toRefs( props )

  const readonly              = ref< boolean >( tipo.value == "ver" ? true : false )

  //* ////////////////////////////////////////////////////////////////////////////////////// onMounted
  onMounted( iniciar )

  //* ///////////////////////////////////////////////////////////////////////////////// Ver cambios en tipo para iniciar
  //watch(tipo, (newTipo, oldTipo) => iniciar())

  //* ////////////////////////////////////////////////////////////////////////////////////// Inicio
  function iniciar()
  {
    if(tipo.value             == "ver"){
      return
    }    
  }
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* /////////////////////////////////////////////////////////////////////////////////// FUNCIONES DEL FORMULARIO
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //* ////////////////////////////////////////////////////////////////////////////////////// Validar
  async function validar()
  {
    let validacionOk          = await formulario.value.validate()
    if(validacionOk)          onSubmit()  
  }

  //* ////////////////////////////////////////////////////////////////////////////////////// Submit
  function onSubmit()
  {
    //if(tipo.value == "ver")
      //modificarProducto()
    //else
      //crearProducto()
  }



  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* /////////////////////////////////////////////////////////////////////////////////////////////////// FUNCTION VARIAS
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const titulo                = computed(()=>
  {
    let title                 = ""

    if(tipo.value             == "crear")
      title                   = "Crear producto"
    else
    if(tipo.value             == "ver")
    {
      if(producto.value.nombre.length > 1)
        title                 = "Producto"
      else
        title                 = "Cargando..."
    }

    return  title
  })
</script>