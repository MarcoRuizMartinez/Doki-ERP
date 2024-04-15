<template>
  <ventana                      scroll cerrar
    class-contenido             ="column items-center"
    icono                       ="mdi-format-list-checks"
    titulo                      ="Requerimientos"
    min-width                   ="260px"
    :cargando                   ="cargando"
    >
    <div class                  ="col-12 column items-start">
      <div class                ="relative-position">
        <div  
          v-if                  ="virgenAcabado"
          class                 ="protector"
          @click                ="virgenAcabado = false"
        ></div>
        <q-toggle
          v-model               ="acabado"
          label                 ="Indicar acabado"
          class                 =""
          >
          <Tooltip label        ="Asesor debe indicar color o material"/>
        </q-toggle>
      </div>
      <div class                ="relative-position">
        <div  
          v-if                  ="virgenEntrega"
          class                 ="protector"
          @click                ="virgenEntrega = false"
        ></div>
        <q-toggle
          v-model               ="entrega"
          label                 ="Indicar empaque"
          class                 =""
          >
          <Tooltip label        ="Asesor debe indicar si se entrega en caja, embalado, armado o instalado"/>
        </q-toggle>
      </div>
      <div class                ="relative-position">
      <div  
        v-if                    ="virgenMedida"
        class                   ="protector"
        @click                  ="virgenMedida = false"
      ></div>
      <q-toggle
        v-model                 ="medida"
        label                   ="Indicar medida"
        class                   =""
        >
        <Tooltip label          ="Asesor debe indicar una medida"/>
      </q-toggle>
      </div>
    </div>
    <template                   #acciones>
      <q-btn
        v-bind                  ="style.btnBaseMd"
        color                   ="positive"
        label                   ="Guardar"
        icon                    ="mdi-content-save"
        class                   ="col-12"
        :disable                ="virgenAcabado && virgenEntrega && virgenMedida"
        @click                  ="guardar"
      />
    </template>    
  </ventana>
</template>


<script setup lang="ts">
  //* ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref                   } from "vue"
  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreProducto      } from 'stores/producto'  

  //* ///////////////////////////////////////////////////////////////////////////////// Modelos
  
  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesProductos     } from "src/areas/productos/services/servicesProductos"
  import {  useTools              } from "src/composables/useTools"
  import {  style                 } from "src/composables/useEstilos"
                                  
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  
  const { seleccion             } = storeToRefs( useStoreProducto() )
  const { editarRequerimientos  } = servicesProductos()
  const { aviso                 } = useTools()

  type TEmit                      = { edicion : [ value : void ] }
  const emits                     = defineEmits<TEmit>()

  const virgenAcabado             = ref< boolean >(true)
  const virgenEntrega             = ref< boolean >(true)
  const virgenMedida              = ref< boolean >(true)
  const acabado                   = ref< boolean >(true)
  const entrega                   = ref< boolean >(true)
  const medida                    = ref< boolean >(true)
  const cargando                  = ref< boolean >(false)

  async function guardar()
  {
    const ids     : string        = seleccion.value.map( p => p.id ).join(",")
    const editar  = {
      acabado : virgenAcabado.value ? -1 : +acabado.value,
      entrega : virgenEntrega.value ? -1 : +entrega.value,
      medida  : virgenMedida.value  ? -1 : +medida.value,
    }

    const editarStr               = JSON.stringify( editar )
    cargando.value                = true
    const ok                      = await editarRequerimientos(ids, editarStr)
    cargando.value                = false
    
    if(ok)
    {
      aviso( "positive", "Productos editados")      
      for (const producto of seleccion.value)
      {
        if(!virgenAcabado.value)  producto.requiereAcabado    = acabado.value
        if(!virgenEntrega.value)  producto.requiereEntregado  = entrega.value
        if(!virgenMedida.value)   producto.requiereMedida     = medida.value
      }
    }
    else
    {
      aviso( "negative", "Error al editar requerimientos de productos" )
    }

    emits("edicion")
  }
</script>

<style scoped>
.protector{
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 99;
  background: rgba(255, 255, 255, 0.8);
}
</style>