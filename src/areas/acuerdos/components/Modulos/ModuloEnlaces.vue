<template>
  <ventana
    class-contenido             ="column items-center"
    titulo                      ="Enlaces"
    icono                       ="mdi-link-variant"
    size-icon-carga             ="10em"
    mensaje-sin-resultados      ="Sin enlaces"
    icono-sin-resultados        ="mdi-link-variant-off"
    :padding-contenido          ="modo == 'normal' ? '0' : '12px' "
    :modo                       ="modo"
    :menu-visible               ="monstrarMenu"
    >
    <template                   #menu
      v-if                      ="monstrarMenu"
      >
      <div class                ="row text-grey-9 items-center justify-around fit">
        <span>Total compras:</span>
        <span class="fuente-mono text-bold">{{ Format.precio(sumaOC) }}</span>
      </div>
    </template>
    <!-- //* /////////////////  Botones barra -->
    <template                   #barra>
      <q-btn                    round dense flat
        icon                    ="mdi-refresh"
        class                   ="op60 op100-hover"
        @click                  ="buscar"
        >
        <Tooltip label          ="Recargar enlaces"/>
      </q-btn>   
    </template>
    <q-table                    bordered dense flat hide-bottom
      class                     ="fit tabla-maco"
      row-key                   ="id"
      :rows                     ="acuerdo.acuerdosEnlazados"
      :columns                  ="columnas"
      style                     ="min-height: 208px;"
      :rows-per-page-options    ="[50, 100]"
      >
      <!-- //* ///////////////  Columna Ref  -->
      <template #body-cell-ref  ="props">
        <q-td   :props          ="props">
          <ref-acuerdo          ref-larga
            :acuerdo            ="props.row"
            @click-acuerdo      ="( a : IAcuerdo )=> acuerdo = a "
          />
        </q-td>
      </template>
      <!-- //* ///////////////  Columna Estado  -->
      <template #body-cell-estado="props">
        <q-td   :props          ="props">
          <estado :acuerdo      ="props.row"/>
        </q-td>
      </template>
    </q-table>
  </ventana>
</template>

<script setup lang="ts">
  //* /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,
            computed
                                  } from "vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'stores/acuerdo'      
  import {  useStoreUser          } from 'stores/user'
  //* /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  TModosVentana         } from "src/models/TiposVarios"
  import {  IColumna,
            Columna               } from "src/models/Tabla"
  import {  IAcuerdo              } from "src/areas/acuerdos/models/Acuerdo"  
  //* /////////////////////////////////////////////////////////////////////////////////// Componibles  
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"  
  import {  ToolArray, Format     } from "src/composables/useTools"  
  //* /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    refAcuerdo              from "src/areas/acuerdos/components/Tools/RefAcuerdo.vue"
  import    estado                  from "src/areas/acuerdos/components/Tools/Estado.vue"
  
  const { buscarAcuerdoEnlazados  } = useControlAcuerdo()
  const { acuerdo                 } = storeToRefs( useStoreAcuerdo() )
  const { usuario                 } = storeToRefs( useStoreUser() )
  const modo                        = ref< TModosVentana >("esperando-busqueda")
  const sumaOC                      = ref< number >(0)
  const monstrarMenu                = computed( () => !usuario.value.esComercial && !!sumaOC.value )
  
  const columnas: IColumna[]  = [
    new Columna({ name: "ref"       }),
    new Columna({ name: "estado"    }),
  ]

  watch( ()=>acuerdo.value.acuerdosEnlazados.length, ( largo )=> {
      modo.value    = !!largo                   ? "normal"
                    : modo.value === "buscando" ? modo.value
                    : "esperando-busqueda"
      sumarOC()
    },
    { immediate: true}
  )  
  
  async function buscar()
  {
    modo.value                = "buscando"
    await buscarAcuerdoEnlazados( /* true */ )
    modo.value                = !!acuerdo.value.acuerdosEnlazados.length ? "normal" : "sin-resultados"
    sumarOC()
  }

  function sumarOC()
  {
    const ocs     = acuerdo.value.acuerdosEnlazados.filter( a => a.esOCProveedor && a.esEstadoValido && !a.esEstadoAnulado )
    sumaOC.value  = ToolArray.sumar( ocs, "totalConDescu" )
  }
</script>