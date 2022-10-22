<template>
  <ventana
    class-contenido             ="column items-center"
    icono                       ="mdi-package-variant-closed"
    :cerrar                     ="modoVentana"
    :titulo                     ="titulo"
    :cargando                   ="loading.carga || loading.editar || loading.crear"
    >
    <template                   #barra>
      <efecto efecto            ="Down">
        <!-- //* //////////////////////////////////////////////////////////  Boton PDF -->
        <q-btn
          v-if                  ="tipo === 'crear'"
          v-bind                ="btnBaseSm"
          color                 ="positive"
          icon                  ="mdi-check"
          label                 ="Crear"
          @click                ="validar"
        />        
        <q-btn
          v-else-if             ="readonly"
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
        v-model                 ="proModel.nombre"
        class                   ="col-12"        
        icon                    ="mdi-text"
        label                   ="Nombre"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Ref producto  -->
      <input-text               clearable copy alerta sin-espacios uppercase
        v-model                 ="proModel.ref"
        icon                    ="mdi-identifier"
        label                   ="Ref"
        :class                  ="tipo === 'crear' ? 'col-6' : 'col-12'"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Campo Categoría -->
      <select-label-value       use-input flat bordered
        v-if                    ="tipo === 'crear'"
        label                   ="Categoría"
        icon                    ="mdi-file-tree-outline"
        class                   ="col-6"
        options-sort            ="nombre"
        :options                ="categorias"
        @select                 ="( c : IProductoCategoria )=> proModel.ref = c.sigla + '-'"
      /> 
      <!-- //* //////////////   Costo -->
      <input-number
        v-model                 ="proModel.costo"
        :label                  ="`Costo: ${ formatoPrecio( proModel.costoTotal )}`"
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
      <!-- //* //////////////   Costo Adicional -->
      <input-number
        v-model                 ="proModel.costo_adicional"
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
      <!-- //* //////////////   Aumento base -->
      <numero-paso              porcentaje
        v-model                 ="proModel.aumento"
        label                   ="Aumento base"
        modo                    ="right"
        class                   ="col-3"
        :paso                   ="1"
        :maximo                 ="500"
        :minimo                 ="proModel.aumento_descuento"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Aumento Escom -->
      <numero-paso              porcentaje
        v-model                 ="proModel.aumento_escom"
        label                   ="Aumento Escom"
        modo                    ="right"
        class                   ="col-3"
        :paso                   ="1"
        :maximo                 ="500"
        :minimo                 ="proModel.aumento_descuento"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Aumento Descuento -->
      <numero-paso              porcentaje
        v-model                 ="proModel.aumento_descuento"
        label                   ="Aumento descuento"
        modo                    ="right"
        class                   ="col-3"
        :paso                   ="1"
        :maximo                 ="500"
        :minimo                 ="0"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Aumento Loco -->
      <numero-paso              porcentaje
        v-model                 ="proModel.aumento_loco"
        label                   ="Aumento loco"
        modo                    ="right"
        class                   ="col-3"
        :paso                   ="1"
        :minimo                 ="0"
        :readonly               ="readonly"
      />
      <precio-tabla
        class                   ="col-3"
        :precio                 ="proModel.precio_aumento"
        :iva                    ="proModel.iva"
      />
      <precio-tabla
        class                   ="col-3"
        :precio                 ="proModel.precio_aumento_escom"
        :iva                    ="proModel.iva"
      />
      <precio-tabla
        class                   ="col-3"
        :precio                 ="proModel.precio_aumento_descuento"
        :iva                    ="proModel.iva"
      />
      <precio-tabla
        class                   ="col-3"
        :precio                 ="proModel.precio_aumento_loco"
        :iva                    ="proModel.iva"
      />                  
      <q-toggle
        v-model                 ="proModel.en_venta"
        label                   ="Activo venta"
        class                   ="col-6"
        :disable                ="readonly"
      />            
      <q-toggle
        v-model                 ="proModel.en_compra"
        label                   ="Activo compra"
        class                   ="col-6"
        :disable                ="readonly"
      />           
      <!-- //* //////////////   Descripción  -->
      <q-input                  filled dense
        v-model                 ="proModel.descripcion"
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
  import {  IProductoCategoria,
            ProductoCategoria   } from "src/areas/productos/models/ProductoCategoria"
  import {  IProductoDoli,
            ProductoDoli        } from "src/areas/productos/models/ProductoDolibarr"            
  //* ///////////////////////////////////////////////////////////////////////////////// Componibles  
  import {  formatoPrecio,
            confeti               } from "src/useSimpleOk/useTools" 
  import {  btnBaseSm             } from "src/useSimpleOk/useEstilos"
  import {  useControlProductos   } from "src/areas/productos/controllers/ControlProductosDolibarr"
  import {  dexieCategoriasProducto
                                  } from "src/services/useDexie"
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

  const proModel              = ref< IProductoDoli >( new ProductoDoli() )
  const formulario            = ref< any >()
  const categorias            = dexieCategoriasProducto() 
  const { crearProducto,
          editarProducto    } = useControlProductos()
  

  //* ////////////////////////////////////////////////////////////////////////////////////// Props
  const props                 = defineProps(
  {
    modoVentana:  { default: false,         type: Boolean                               },
    puedeEditar:  { default: false,         type: Boolean                               },
    tipo:         { default: "ver",         type: String as PropType< "crear" | "ver" > },
  })

  const emit                  = defineEmits<{
    //(e: 'buscar',   value: IQueryAcuerdo  ): void
    (e: "creado",   value: IProductoDoli  ): void
    (e: "editado",  value: IProductoDoli  ): void
  }>()

  const { tipo              } = toRefs( props )
  const readonly              = ref< boolean >( tipo.value == "ver" ? true : false )

  //* ////////////////////////////////////////////////////////////////////////////////////// onMounted
  onMounted( iniciar )

  //* ///////////////////////////////////////////////////////////////////////////////// Ver cambios en tipo para iniciar
  //watch(tipo, (newTipo, oldTipo) => iniciar())

  watch(producto, (pro)=>
    {
      if(!!pro)
        proModel.value  = Object.assign( new ProductoDoli, pro )
    }
    ,{ immediate: true }
  )

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
    if(tipo.value == "ver")
      modificarProducto()
    else
      creacionProducto()
  }

  async function modificarProducto(){
    const ok              = await editarProducto( proModel.value )
    readonly.value        = true
    if(ok){
      proModel.value.precio_publico = proModel.value.precio_publico_final
      emit("editado", proModel.value)
    }
  }

  async function creacionProducto(){
    const id              = await crearProducto( proModel.value )
    if(!!id){
      confeti(3)
      proModel.value.id   = id
      emit("creado", proModel.value)
    }
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
      if(proModel.value.nombre.length > 1)
        title                 = "Producto"
      else
        title                 = "Cargando..."
    }

    return  title
  })
</script>