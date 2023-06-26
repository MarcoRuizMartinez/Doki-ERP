<template>
  <ventana                      scroll cerrar
    class-contenido             ="row"
    icono                       ="mdi-check"
    titulo                      ="Tarea"
    :cargando                   ="false"
    >
    <!-- loading.carga || loading.editar || loading.crear -->
    <template                   #barra>
      <efecto efecto            ="Down">
        <!-- //* //////////////////////////////////////////////////////////  Botones -->
        <q-btn
          v-if                  ="true"
          v-bind                ="style.btnBaseSm"
          color                 ="positive"
          icon                  ="mdi-check"
          label                 ="Crear"
          @click                ="validar"
        />
        <q-btn
          v-else-if             ="readonly && ( usuario.esProduccion || usuario.esGerencia )"
          v-bind                ="style.btnBaseSm"
          color                 ="positive"
          icon                  ="mdi-lead-pencil"
          label                 ="Editar"
          @click                ="readonly = false"
        />
        <q-btn
          v-else
          v-bind                ="style.btnBaseSm"
          color                 ="positive"
          icon                  ="mdi-content-save"
          label                 ="Guardar"
          @click                ="validar"
        />
      </efecto>
    </template>
    <!-- //* ////////////////   FORMULARIO  -->
      <q-form
        ref                     ="formulario"
        @submit                 ="onSubmit"
        class                   ="col-12 row q-col-gutter-sm"
        >
        <!-- //* ////////////   Nombre producto  -->
        <input-text             clearable AZ09 alerta autofocus
          v-model               ="tarea.label"
          class                 ="col-12 col-md-8"
          icon                  ="mdi-check"
          label                 ="Titulo"
          :readonly             ="readonly"
        />
        <select-usuario
          v-model               ="tarea.asignado"
          label                 ="Asignado"
          class                 ="col-12 col-md-4"
          tooltip               ="Usuario asignado"
          :grupos               ="[GRUPO_USUARIO.MIEMBRO]"
          :autoselect           ="true"
          :loading              ="false"
          :readonly             ="readonly"
        />
        <!-- //* ////////////   Cuando -->
        <select-label-value     use-input flat bordered
          v-model               ="tarea.cuando"
          label                 ="Cuando"
          icon                  ="mdi-calendar"
          class                 ="col-12 col-md-6"
          :defecto              ="Cuando[1].label"
          :options              ="Cuando"
        />
        <!-- //* ////////////   Prioridad -->
        <select-label-value     use-input flat bordered
          v-model               ="tarea.prioridad"
          label                 ="Prioridad"
          icon                  ="mdi-alarm-light"
          class                 ="col-12 col-md-6"
          :defecto              ="Prioridades[0].label"
          :options              ="Prioridades"
        />
        <!-- //* /////////////  Descripción  -->
        <q-input                filled dense
          v-model               ="tarea.value"
          label                 ="Descripción"
          type                  ="textarea"
          class                 ="col-12"
          debounce              ="800"
          :readonly             ="readonly"
          >
          <template #prepend >
            <q-icon name        ="mdi-subtitles-outline" />
          </template>
        </q-input>
      </q-form>
  </ventana>
</template>

<script setup lang="ts">
  //* ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            toRefs,
            watch,
            computed,
            PropType,
            onMounted
                                  } from "vue"
  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreProducto      } from 'src/stores/producto'
  import {  useStoreUser          } from "src/stores/user"
  //* ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAccion,
            Accion,
            Prioridades,
            Cuando                } from "../models/Accion"
  import {  IProductoDoli,
            ProductoDoli          } from "src/areas/productos/models/ProductoDolibarr"
  import {  GRUPO_USUARIO         } from "src/models/TiposVarios"
  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  formatoPrecio,
            confeti               } from "src/useSimpleOk/useTools"
  import {  style                 } from "src/useSimpleOk/useEstilos"
  import {  useControlProductos   } from "src/areas/productos/controllers/ControlProductosDolibarr"
  import {  dexieUnidades,
            dexieCategoriasProducto
                                  } from "src/services/useDexie"
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    efecto                  from "components/utilidades/Efecto.vue"
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    selectLabelValue        from "components/utilidades/select/SelectLabelValue.vue"
  import    inputText               from "components/utilidades/input/InputFormText.vue"
  import    selectUsuario           from "src/areas/usuarios/components/SelectUsuario.vue"

  const { producto,
          loading           } = storeToRefs( useStoreProducto() )
  const { usuario           } = storeToRefs( useStoreUser() )

  const proModel              = ref< IProductoDoli >( new ProductoDoli() )
  const formulario            = ref< any >()
  const tarea                 = ref< IAccion >( new Accion() )

  //* ////////////////////////////////////////////////////////////////////////////////////// Props
/*   const props                 = defineProps(
  {
    modoVentana:  { default: false,         type: Boolean                               },
    puedeEditar:  { default: false,         type: Boolean                               },
    tipo:         { default: "ver",         type: String as PropType< "crear" | "ver" > },
  }) */

  const emit                  = defineEmits<{
    (e: "creado",   value: IProductoDoli  ): void
    (e: "editado",  value: IProductoDoli  ): void
  }>()

  const readonly              = ref< boolean >( false ? true : false )

  //* ////////////////////////////////////////////////////////////////////////////////////// onMounted
  onMounted( iniciar )



  //* ////////////////////////////////////////////////////////////////////////////////////// Inicio
  function iniciar()
  {
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
    /* if(tipo.value == "ver")
      modificarProducto()
    else
      creacionProducto() */
  }

  async function modificarProducto(){
    /* const ok              = await editarProducto( proModel.value )
    readonly.value        = true
    if(ok){
      proModel.value.precio_publico = proModel.value.precio_publico_final
      emit("editado", proModel.value)
    } */
  }

  async function creacionProducto(){
    /* const id              = await crearProducto( proModel.value )
    if(!!id){
      confeti(3)
      proModel.value.id   = id
      emit("creado", proModel.value)
    } */
  }

  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* /////////////////////////////////////////////////////////////////////////////////////////////////// FUNCTION VARIAS
  //* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

</script>
