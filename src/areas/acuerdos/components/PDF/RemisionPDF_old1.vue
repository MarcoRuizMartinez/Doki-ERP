<template>
  <q-dialog                   maximized 
    v-model                   ="visibleModel"
    v-bind                    ="style.dialogDefault"
    @escape-key               ="cerrarVentana"
    >
    <ventana                    cerrar full-screen scroll
      titulo                    ="Remisión"
      icono                     ="mdi-pdf-box"
      class-contenido           ="row justify-start"
      padding-contenido         ="0"
      :cargando                 ="loading.añadir || loading.borrarLote"
      @cerrar                   ="cerrar"
      >
      <template                 #barra>
        dfdf
      </template>
      <!-- //?* //////////////////////////////////////////////////////////// Lado izquierdo -->
      <div  class               ="col-5 full-height">
        <!-- //?* ////////////////////////////////////////////////////////// Datos remisión -->
        <div    class             ="datosRemision q-pa-lg">
          <span class             ="nombre text-weight-bold"  >{{ acuerdo.tercero.nombre }}</span>
          <span class             ="text-weight-bold"         >Dirección:</span>
          <!-- <span class             ="celdaFull"                >{{ pedido.direccion  }}</span> -->
          <span class             ="text-weight-bold"         >Indicaciones:</span>
          <span class             ="celdaFull">
            <!-- {{ acuerdo.indicaciones }} -->
<!--             <q-popup-edit         v-model="pedido.indicaciones" auto-save @save="generarPDF">
              <q-input            v-model="pedido.indicaciones" dense autofocus/>
            </q-popup-edit> -->
          </span>
          <span class             ="text-weight-bold">Fecha:</span>
          <!-- //?* ////////////////////////////////////////////////////////////// Campo Fecha llegada --> 
          <q-input                dense filled hide-bottom-space
            type                  ="date"
            v-model               ="fechaEntrega"
            @input                ="generarPDF"
          />
          <div>
            <q-toggle
              label               ="Mostrar descripción"
              v-model             ="mostrarDescripciones"
              style               ="width: 200px"
              @input              ="toggleMostrarDescripciones"
            />
          </div>
        </div>
      </div>
      <div  class               ="bg-blue col-7 full-height">
        sss
      </div>           
    </ventana>
  </q-dialog>  
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref, toRefs, watch  } from "vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos

  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  style               } from "src/useSimpleOk/useEstilos"            

  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    efecto                from "components/utilidades/Efecto.vue"
  import    ventana               from "components/utilidades/Ventana.vue"

  const { acuerdo,
          modales,
          loading           } = storeToRefs( useStoreAcuerdo() )

  const props                 = defineProps({
    visible:      { required: true,       type: Boolean },
    nombrePdf:    { default:  "archivo",  type: String  },
  })  
            
  const emit = defineEmits<{
    (e: 'cerrar',         value: void     ): void
    (e: 'update:visible', value: boolean  ): void
    
  }>()

  const { visible         }   = toRefs( props ) 
  
  const srcPDF                = ref< string   >("")
  const fechaEntrega          = ref< string  >("")
  const mostrarPDF            = ref< boolean  >(false)
  const entregaCompleta       = ref< boolean  >(false)
  const mostrarDescripciones  = ref< boolean  >(false)
  const visibleModel          = ref< boolean  >(false)

  watch(visible, (newValue, oldValue) =>{
    visibleModel.value        = newValue
  })

  function generarPDF()
  {

  }

    
  function toggleMostrarDescripciones( on : boolean )
  {
    //this.pedido.productos.forEach( p => p.descripcionVisible = on )
    //this.generarPDF()
  }

  function cerrar(){
    
    modales.value.añadirProductos  = false
  }

  function cerrarVentana()
  {
    emit("cerrar")
    emit("update:visible", false)
    visibleModel.value        = false
    srcPDF.value              = ""
  }

</script>