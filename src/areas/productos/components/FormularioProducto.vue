<template>
  <ventana                      scroll
    class-contenido             ="column items-center"
    icono                       ="mdi-package-variant-closed"
    :cerrar                     ="modoVentana"
    :titulo                     ="titulo"
    :cargando                   ="loading.carga || loading.editar || loading.crear"
    >
    <template                   #barra>
      <efecto efecto            ="Down">
        <!-- //* //////////////////////////////////////////////////////////  Botones -->
        <q-btn
          v-if                  ="tipo === 'crear'"
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
        :class                  ="tipo === 'crear' ? 'col-12' : 'col-12 col-md-6'"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Tipo Servicio y Producto -->
      <select-label-value       use-input flat bordered
        v-model                 ="proModel.tipoLabelValue"
        label                   ="Tipo"
        icon                    ="mdi-format-list-checks"
        class                   ="col-12 col-md-6"
        defecto                 ="Producto"
        :readonly               ="readonly"
        :options                ="[{value : 0, label:'Producto'}, {value: 1, label:'Servicio'}]"
        @select                 ="( i : ILabelValue )=> proModel.tipo = i.value"
      />
      <!-- //* //////////////   Campo Categoría -->
      <select-label-value       use-input flat bordered
        v-if                    ="tipo === 'crear'"
        label                   ="Categoría"
        icon                    ="mdi-file-tree-outline"
        class                   ="col-12 col-md-6"
        options-sort            ="nombre"
        :options                ="categoriasProductos"
        @select                 ="( c : ICategoriaProducto )=> proModel.ref = c.sigla + '-'"
      />
    <template v-if            ="usuario.esProduccion || usuario.esGerencia">
      <!-- //* //////////////   Costo -->
      <input-number        
        v-model                 ="proModel.costo"
        :label                  ="`Costo: ${ Format.precio( proModel.costoTotal )}`"
        class                   ="col-12 col-md-6"
        tipo                    ="precio"
        colores                 ="verde-rojo"
        iconos                  ="suma"
        debounce                ="1800"
        :minimo                 ="0"
        :con-decimales          ="false"
        :paso                   ="1000"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Costo Adicional -->
      <input-number
        v-model                 ="proModel.costo_adicional"
        label                   ="Costo adicional:"
        class                   ="col-12 col-md-6"
        tipo                    ="precio"
        colores                 ="verde-rojo"
        iconos                  ="suma"
        debounce                ="1800"
        :minimo                 ="0"
        :con-decimales          ="false"
        :paso                   ="1000"
        :readonly               ="readonly"
      />
      <!-- //* //////////////   Aumento base -->
      <div class                ="col-6 col-md-3">
        <numero-paso            porcentaje
          v-model               ="proModel.aumento"
          label                 ="Aumento base"
          modo                  ="right"
          :paso                 ="0.1"
          :maximo               ="500"
          :minimo               ="proModel.aumento_descuento"
          :readonly             ="readonly"
        />
        <precio-tabla
          alineado              ="center"
          :precio               ="proModel.precio_aumento"
          :iva                  ="proModel.iva"
        />
      </div>
      <!-- //* //////////////   Aumento Escom -->
      <div class                ="col-6 col-md-3">
        <numero-paso            porcentaje
          v-model               ="proModel.aumento_escom"
          label                 ="Aumento Escom"
          modo                  ="right"
          :paso                 ="0.1"
          :maximo               ="500"
          :minimo               ="proModel.aumento_descuento"
          :readonly             ="readonly"
        />
        <precio-tabla
          alineado              ="center"
          :precio               ="proModel.precio_aumento_escom"
          :iva                  ="proModel.iva"
        />
      </div>
      <!-- //* //////////////   Aumento Descuento -->
      <div class                ="col-6 col-md-3">
        <numero-paso            porcentaje
          v-model               ="proModel.aumento_descuento"
          label                 ="Aumento descuento"
          modo                  ="right"
          :paso                 ="0.1"
          :maximo               ="500"
          :minimo               ="0"
          :readonly             ="readonly"
        />
        <precio-tabla
          alineado              ="center"
          :precio               ="proModel.precio_aumento_descuento"
          :iva                  ="proModel.iva"
        />
      </div>
      <!-- //* //////////////   Aumento Loco -->
      <div class                ="col-6 col-md-3">
        <numero-paso            porcentaje
          v-model               ="proModel.aumento_loco"
          label                 ="Aumento loco"
          modo                  ="right"
          :paso                 ="0.1"
          :minimo               ="0"
          :readonly             ="readonly"
        />
        <precio-tabla
          alineado              ="center"
          :precio               ="proModel.precio_aumento_loco"
          :iva                  ="proModel.iva"
        />
      </div>
    </template>
      <q-toggle
        v-model                 ="proModel.sin_proveedor"
        label                   ="Sin REF proveedor"
        class                   ="col-4"
        :disable                ="readonly"
      />
      <q-toggle
        v-model                 ="proModel.activoEnVenta"
        label                   ="Activo venta"
        class                   ="col-4"
        :disable                ="readonly"
      />
      <q-toggle
        v-model                 ="proModel.activoEnCompra"
        label                   ="Activo compra"
        class                   ="col-4"
        :disable                ="readonly"
      />
      <q-toggle
        v-model                 ="proModel.requiereAcabado"
        label                   ="Indicar acabado"
        class                   ="col-4"
        :disable                ="readonly"
        >
        <Tooltip label          ="Asesor debe indicar color o material"/>
      </q-toggle>
      <q-toggle
        v-model                 ="proModel.requiereEntregado"
        label                   ="Indicar empaque"
        class                   ="col-4"
        :disable                ="readonly"
        >
        <Tooltip label          ="Asesor debe indicar si se entrega en caja, embalado, armado o instalado"/>
      </q-toggle>
      <q-toggle
        v-model                 ="proModel.requiereMedida"
        label                   ="Indicar medida"
        class                   ="col-4"
        :disable                ="readonly"
        >
        <Tooltip label          ="  "/>
      </q-toggle>  
      <!-- //* ///////////////////////////////////////////////////////////// Unidad -->
      <select-label-value       no-inmediato use-input
        v-model                 ="proModel.unidad"
        label                   ="Tipo de unidad"
        icon                    ="mdi-tape-measure"
        class                   ="col-6"
        behavior                ="dialog"
        options-sort            ="orden"
        defecto                 ="UND - Unidad"
        :options                ="unidades"
        :readonly               ="readonly"
      />
      <!-- //* ///////////////////////////////////////////////////////////// Naturaleza producto -->
      <select-label-value       no-inmediato use-input
        v-model                 ="proModel.naturaleza"
        label                   ="Naturaleza de producto"
        icon                    ="mdi-leaf"
        class                   ="col-6"
        options-sort            ="orden"
        defecto                 ="Producto terminado"
        :options                ="naturalezaProductos"
        :readonly               ="readonly"
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
  import {  useStoreProducto      } from 'stores/producto'
  import {  useStoreUser          } from "stores/user"
  import {  useStoreDexie         } from 'stores/dexieStore'

  //* ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  ICategoriaProducto    } from "src/areas/productos/models/CategoriaProducto"
  import {  ILabelValue           } from "src/models/TiposVarios"
  import {  IProductoDoli,
            ProductoDoli          } from "src/areas/productos/models/ProductoDolibarr"

  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  Format,
            confeti               } from "src/composables/useTools"
  import {  style                 } from "src/composables/useEstilos"
  import {  useControlProductos   } from "src/areas/productos/controllers/ControlProductosDolibarr"
  import {  dexieUnidades, 
            dexieNaturaleza,
            dexieCategoriasProducto
                                  } from "src/composables/useDexie"
                                  
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    efecto                  from "components/utilidades/Efecto.vue"
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    numeroPaso              from "components/utilidades/input/InputNumeroPaso.vue"
  import    inputNumber             from "components/utilidades/input/InputFormNumber.vue"
  import    selectLabelValue        from "components/utilidades/select/SelectLabelValue.vue"
  import    inputText               from "components/utilidades/input/InputFormText.vue"
  import    precioTabla             from "src/areas/productos/components/Tools/PrecioProducto.vue"

  const { producto,
          loading           } = storeToRefs( useStoreProducto() )
  const { usuario           } = storeToRefs( useStoreUser() )           

  const proModel              = ref< IProductoDoli >( new ProductoDoli() )
  const formulario            = ref< any >()
  dexieCategoriasProducto({ cargarSiempre : true})
  const { categoriasProductos } = storeToRefs( useStoreDexie() )
  dexieUnidades()
  dexieNaturaleza()
  const { unidades,
          naturalezaProductos}= storeToRefs( useStoreDexie() )
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
      if(!!pro){
        proModel.value                  = Object.assign( new ProductoDoli(), pro )

        if(tipo.value == "crear")
        {
          proModel.value.aumento        = 50
          proModel.value.aumento_escom  = 50
        }
      }

    }
    ,{ immediate: true }
  )


  watch(()=>producto.value.costo, ()=>
    {
      proModel.value.costo = producto.value.costo
    },)

  //* ////////////////////////////////////////////////////////////////////////////////////// Inicio
  function iniciar()
  {

    if(usuario.value.esProducto)
      readonly.value          = false

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