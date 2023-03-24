<template>
  <ventana
    class-contenido             ="column items-center"
    :icono                      ="Acuerdo.getIconoAcuerdo( tipo )"
    size-icon-carga             ="10em"
    :mensaje-sin-resultados     ="'Sin ' + Acuerdo.getTipoAcuerdoPlural( tipo )"
    icono-sin-resultados        ="mdi-cloud-outline"
    :padding-contenido          ="modo == 'normal' ? '0' : '12px' "
    :modo                       ="modo"
    >
    <template                   #titulo>
      <!-- //* /////////////////////////////////////////////////////// Link a acuerdo -->
      <router-link
        class                   ="link-limpio text-white"
        :to                     ="`/${Acuerdo.getRuta( tipo )}/?buscar=${tercero.documento.numero}`" 
        >
        Ver {{ Acuerdo.getTipoAcuerdoPlural( tipo )}}
      </router-link>  
      <Tooltip label            ="Ver listado completo"/>
    </template>    
    <template                   #barra>
      <q-btn                    round dense flat
        icon                    ="mdi-refresh"
        class                   ="op60 op100-hover"
        @click                  ="buscar"
        >
        <Tooltip label          ="Recargar"/>
      </q-btn>
      <!-- //* ///////////////  Boton crear acuerdo  -->
      <q-btn
        v-if                    ="tipo !== TIPO_ACUERDO.PEDIDO_PRO"
        v-bind                  ="style.btnBaseSm"
        label                   ="Crear"
        color                   ="positive"
        icon                    ="mdi-plus"
        @click                  ="irACrearAcuerdo"        
      />
    </template>
    <q-table                    bordered dense flat hide-bottom
      class                     ="fit tabla-maco"
      row-key                   ="id"
      :rows                     ="acuerdos"
      :columns                  ="columnas"
      style                     ="min-height: 208px;"
      >
      <!-- //* ///////////////  Columna Ref  -->
      <template #body-cell-ref  ="props">
        <q-td   :props          ="props">
          <ref-acuerdo
            :acuerdo            ="props.row"
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
            toRefs,
            PropType,
            watch,
                                  } from "vue"
  import {  useRouter             } from 'vue-router'
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'      
  //* /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  ModosVentana          } from "src/models/TiposVarios"
  import {  IColumna,
            Columna               } from "src/models/Tabla"
  import {  IAcuerdo, Acuerdo     } from "src/areas/acuerdos/models/Acuerdo"  
  //* ///////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  ITercero              } from "src/areas/terceros/models/Tercero"    
  import {  TTipoAcuerdo, 
            TIPO_ACUERDO          } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  //* /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesAcuerdos      } from "src/areas/acuerdos/services/servicesAcuerdos"
  import {  style                 } from "src/useSimpleOk/useEstilos"
  //* /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    refAcuerdo              from "src/areas/acuerdos/components/Busqueda/Columnas/RefAcuerdo.vue"
  import    estado                  from "src/areas/acuerdos/components/Busqueda/Columnas/Estado.vue"
  
  const { getAcuerdos       } = servicesAcuerdos()
  const router                = useRouter()
  const { acuerdo           } = storeToRefs( useStoreAcuerdo() )
  const modo                  = ref< ModosVentana >("esperando-busqueda")
  
  const columnas: IColumna[]  = [
    new Columna({ name: "ref"       }),
    new Columna({ name: "estado"    }),
    Columna.ColumnaPrecio ({ name: "totalConDescu", label: "Subtotal",    clase: "text-bold"    }),
  ]
  const props                 = defineProps({
    tercero:    { required: true, type: Object as PropType<ITercero>  },
    tipo:       { required: true, type: String as PropType<TTipoAcuerdo> },
  })

  const { tercero, tipo }     = toRefs( props )
  const acuerdos              = ref< IAcuerdo[] >([])

  //onMounted( buscar )

  watch(tercero, buscar, { immediate: true })

  async function buscar()
  {
    modo.value                = "buscando"
    const query               = {
                                  acuerdo:    tipo.value,
                                  tipo:       "busqueda",
                                  idTercero:  tercero.value.id,
                                  limite:     5,
                                  offset:     0
                                }
    acuerdos.value            = await getAcuerdos( query )
    modo.value                = !!acuerdos.value.length ? "normal" : "sin-resultados"
  }

  function irACrearAcuerdo(){
    acuerdo.value             = new Acuerdo( tipo.value )
    acuerdo.value.terceroId   = tercero.value.id
    acuerdo.value.tercero     = tercero.value
    router.push({
      //path:   `/${Acuerdo.getTipoAcuerdoPlural(tipo.value)}/crear`,
      path:   `/${Acuerdo.getRuta(tipo.value)}/crear`,
      query:  { origen: "tercero"},
    })
  }
</script>
<style>
.fecha{
  width: 80px;
  display: inline-block;
}
</style>
