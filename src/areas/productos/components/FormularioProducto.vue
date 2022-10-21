<template>
  <ventana
    class-contenido             ="column items-center"
    icono                       ="mdi-package-variant-closed"
    :titulo                     ="titulo"
    :cargando                   ="loading.carga || loading.editar"
    >
    <template                   #barra>
      <efecto efecto            ="Down">
        <!-- //* //////////////////////////////////////////////////////////  Boton PDF -->
        <q-btn
          v-if                  ="readonly"
          v-bind                ="btnBaseSm"
          color                 ="positive"
          icon                  ="mdi-lead-pencil"
          label                 ="Editar"
          @click                ="readonly = false"
          />
        <q-btn
          v-else
          v-bind                ="btnBaseSm"
          color                 ="positive"
          icon                  ="mdi-content-save"
          label                 ="Guardar"
          @click                ="validar"
          />          
      </efecto>
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
        class                   ="col-12"        
        icon                    ="mdi-identifier"
        label                   ="Ref"
        :readonly               ="readonly"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Unidad -->
      <!--<select-label-value       no-inmediato use-input
        v-model                 ="producto.unidad"
        label                   ="Tipo de unidad"
        icon                    ="mdi-tape-measure"
        class                   ="col-6"
        behavior                ="dialog"
        options-sort            ="orden"
        :options                ="unidades"
        :readonly               ="readonly"
        @select                 ="producto.unidadId = producto.unidad.id"
      /> -->
      <!-- //* ///////////////////////////////////////////////////////////// Costo -->
      <input-number
        v-model                 ="producto.costo"
        :label                  ="`Costo: ${ formatoPrecio( producto.costoTotal )}`"
        class                   ="col-6"
        tipo                    ="precio"
        colores                 ="verde-rojo"
        iconos                  ="suma"
        debounce                ="2500"        
        :minimo                 ="0"        
        :con-decimales          ="false"
        :paso                   ="1000"
        :readonly               ="readonly"
      />      
      <!-- //* ///////////////////////////////////////////////////////////// Costo Adicional -->
      <input-number
        v-model                 ="producto.costo_adicional"
        label                   ="Costo adicional:"
        class                   ="col-6"
        tipo                    ="precio"
        colores                 ="verde-rojo"
        iconos                  ="suma"
        debounce                ="2500"        
        :minimo                 ="0"        
        :con-decimales          ="false"
        :paso                   ="1000"
        :readonly               ="readonly"
      />            
      <!-- //* ///////////////////////////////////////////////////////////// Aumento base -->
      <numero-paso              porcentaje
        v-model                 ="producto.aumento"
        label                   ="Aumento base"
        modo                    ="right"
        class                   ="col-3"
        :paso                   ="0.1"
        :maximo                 ="500"
        :minimo                 ="producto.aumento_descuento"
        :readonly               ="readonly"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Aumento Escom -->
      <numero-paso              porcentaje
        v-model                 ="producto.aumento_escom"
        label                   ="Aumento Escom"
        modo                    ="right"
        class                   ="col-3"
        :paso                   ="0.1"
        :maximo                 ="500"
        :minimo                 ="producto.aumento_descuento"
        :readonly               ="readonly"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Aumento Descuento -->
      <numero-paso              porcentaje
        v-model                 ="producto.aumento_descuento"
        label                   ="Aumento descuento"
        modo                    ="right"
        class                   ="col-3"
        :paso                   ="0.1"
        :maximo                 ="500"        
        :readonly               ="readonly"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Aumento Loco -->
      <numero-paso              porcentaje
        v-model                 ="producto.aumento_loco"
        label                   ="Aumento loco"
        modo                    ="right"
        class                   ="col-3"
        :paso                   ="0.1"
        :minimo                 ="0"
        :readonly               ="readonly"
      />
      <precio-tabla
        class                   ="col-3"
        :precio                 ="producto.precio_aumento"
        :iva                    ="producto.iva"
      />
      <precio-tabla
        class                   ="col-3"
        :precio                 ="producto.precio_aumento_escom"
        :iva                    ="producto.iva"
      />
      <precio-tabla
        class                   ="col-3"
        :precio                 ="producto.precio_aumento_descuento"
        :iva                    ="producto.iva"
      />
      <precio-tabla
        class                   ="col-3"
        :precio                 ="producto.precio_aumento_loco"
        :iva                    ="producto.iva"
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
  //* ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            toRefs,
            computed,
            PropType,
            onMounted
                                  } from "vue"
  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreProducto      } from 'src/stores/producto'
  import {  useStoreUser          } from "src/stores/user"
  //* ///////////////////////////////////////////////////////////////////////////////// Modelos

  //* ///////////////////////////////////////////////////////////////////////////////// Componibles  
  import {  dexieUnidades         } from "src/services/useDexie"
  import {  formatoPrecio         } from "src/useSimpleOk/useTools" 
  import {  btnBaseSm             } from "src/useSimpleOk/useEstilos"
  import {  useControlProductos   } from "src/areas/productos/controllers/ControlProductosDolibarr"
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    efecto                  from "components/utilidades/Efecto.vue"  
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    numeroPaso              from "components/utilidades/input/InputNumeroPaso.vue"
  import    inputNumber             from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue        from "components/utilidades/select/SelectLabelValue.vue"    
  import    inputText               from "src/components/utilidades/input/InputFormText.vue"
  import    precioTabla             from "src/areas/productos/components/Tools/PrecioProducto.vue"

  const { producto,
          loading           } = storeToRefs( useStoreProducto() )  

  const formulario            = ref< any >()
  const { editarProducto    } = useControlProductos()  
  const unidades              = dexieUnidades()
  

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
      modificarProducto()
    //else
      //crearProducto()
  }

  async function modificarProducto(){
    const ok        = await editarProducto()
    readonly.value  = true
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