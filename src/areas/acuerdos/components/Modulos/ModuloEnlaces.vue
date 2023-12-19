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
    >
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
                                  } from "vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'      
  //* /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  ModosVentana          } from "src/models/TiposVarios"
  import {  IColumna,
            Columna               } from "src/models/Tabla"
  import {  IAcuerdo              } from "src/areas/acuerdos/models/Acuerdo"  
  //* /////////////////////////////////////////////////////////////////////////////////// Componibles  
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"  
  //* /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    refAcuerdo              from "src/areas/acuerdos/components/Tools/RefAcuerdo.vue"
  import    estado                  from "src/areas/acuerdos/components/Tools/Estado.vue"
  
  const { buscarAcuerdoEnlazados  } = useControlAcuerdo()
  const { acuerdo                 } = storeToRefs( useStoreAcuerdo() )
  const modo                        = ref< ModosVentana >("esperando-busqueda")
  
  const columnas: IColumna[]  = [
    new Columna({ name: "ref"       }),
    new Columna({ name: "estado"    }),
  ]

  watch( ()=>acuerdo.value.acuerdosEnlazados.length, ( largo )=> {
      modo.value    = !!largo                   ? "normal"
                    : modo.value === "buscando" ? modo.value
                    : "esperando-busqueda"
    },
    { immediate: true}
  )  
  
  async function buscar()
  {
    modo.value                = "buscando"
    await buscarAcuerdoEnlazados( /* true */ )
    modo.value                = !!acuerdo.value.acuerdosEnlazados.length ? "normal" : "sin-resultados"
  }
</script>