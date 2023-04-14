<template>
  <ventana                        cerrar scroll
    titulo                        ="Calculo de comisión"
    icono                         ="mdi-account-details"
    class-contenido               ="row justify-start"
    mensaje-sin-resultados        ="No se encontraron productos o servicios"
    padding-contenido             ="0"
    size-icon-carga               ="28vw"
    :modo                         ="modo"
    :cargando                     ="loading.añadir || loading.borrarLote"
    @cerrar                       ="cerrar"
    > 
    <template                     #menu>
      <div class                  ="row gap-pa-md full-width justify-between">
        <table  class             ="tabla-totales">
          <tr>
            <td>Comisión:</td>
            <td class="text-bold">{{ formatoPrecio( acuerdo.comision.comercial_1 ) }}</td>
          </tr>          
          <tr>
            <td>Subtotal:</td>
            <td>{{ formatoPrecio( acuerdo.totalConDescu ) }}</td>
          </tr>          
        </table>
        <!-- //* ///////////////////////////////////////////////////////////// Campo aprobar comision -->
        <div  v-if                ="acuerdo.comisiona">          
          <q-chip                 dense
            v-if                  ="!acuerdo.incentivo.id && !loading.incentivo"
            icon                  ="mdi-alert-circle"
            color                 ="deep-orange" 
            text-color            ="white" 
            label                 ="Pendiente"
          />
          <q-chip                 dense
            v-else-if             ="acuerdo.incentivo.esEstadoAprobado"
            icon                  ="mdi-cash-check"
            color                 ="positive" 
            text-color            ="white" 
            :label                ="formatoPrecio( acuerdo.incentivo.valor, 'decimales-no' )"
          />          
          <q-btn 
            v-if                  ="showAprobar"
            v-bind                ="style.btnBaseMd"
            color                 ="primary"
            :label                ="!acuerdo.incentivo.id ? 'Aprobar' : acuerdo.incentivo.estadoLabel"
            :icon                 ="!acuerdo.incentivo.id ? 'mdi-account-check' : undefined"
            :loading              ="loading.incentivo"
            @click                ="modales.incentivo = true"
          />
        </div>
      </div>
    </template>
    <div  class                   ="bg-grey-3 fit">
      <!--    -->
      <q-table                    bordered dense flat hide-bottom
        class                     ="tabla-maco"
        row-key                   ="id"
        style                     ="min-height: 208px; max-height: 460px;"
        :rows-per-page-options    ="[100, 200]"
        :rows                     ="lineas"
        :columns                  ="columnas"
        >
        <!-- //* ///////////////  Columna Ref  -->
        <template #body-cell-ref  ="props">
          <q-td   :props          ="props">
            <div>
              <div class="text-bold">{{ props.row.ref }} </div>
              <div>{{ props.row.nombre }}</div>
            </div>
            <tooltip-linea
              v-model             ="props.row"
            />
          </q-td>
        </template>
        <!-- //* ///////////////  Columna Nivel  -->
        <template
          #body-cell-iconoNivel   ="props">
          <q-td     :props        ="props">
            <q-icon :name="props.value" color="grey-10" size="sm" class="q-mr-xs"/>
          </q-td>
        </template>
        <!-- //* ///////////////  Columna Comision %  -->
        <template
          #body-cell-comision_c1  ="props">
          <q-td   :props          ="props">
            {{ props.row.comision_c1.X100.toFixed(2) }}%
            <Tooltip>
              <table  class       ="tabla-tooltip">
                <tr>
                  <td>Comisión {{ props.row.nivelPrecios.toUpperCase() }}:</td>
                  <td>{{ props.row.comision_c1.X100_Bruto }}%</td>
                </tr>
                <template v-if="!!props.row.categoria.modificadorComision">
                <tr>
                  <td>Comisión de categoría:</td>
                  <td>{{ props.row.categoria.modificadorComision }}%</td>
                </tr>
                <tr>
                  <td>Comisión final:</td>
                  <td>{{ props.row.comision_c1.X100.toFixed(2) }}%</td>
                </tr>
                </template>
              </table>
            </Tooltip>
          </q-td>
        </template>
        <!-- //* ///////////////  Columna comision $  -->
        <template
          #body-cell-comision_c2  ="props">
          <q-td     :props        ="props"
            class="fuente-mono text-right text-bold"
            >
            {{ formatoPrecio( props.row.comision_c1.valor, "decimales-no" ) }}
          </q-td>
        </template>
      </q-table>
    </div>
    <!-- //* ///////////////////////////////////////////////////////////// Modal formulario agregar comision -->
    <q-dialog
      v-model                     ="modales.incentivo"
      v-bind                      ="style.dialogo"
      :persistent                 ="loading.editarLinea || loading.borrarLinea"
      >
      <formulario
        :acuerdo                  ="acuerdo"
        :incentivo                ="acuerdo.incentivo"
        @creado                   ="incentivoCreado"
      />
    </q-dialog>
  </ventana>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref, 
            computed,
            onMounted           } from "vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'
  import {  useStoreUser        } from 'src/stores/user'
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  ModosVentana        } from "src/models/TiposVarios"
  import {  IColumna, Columna   } from "src/models/Tabla"
  import {  ILineaAcuerdo       } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  IIncentivo,
            Incentivo,
            INCENTIVO_ORIGEN    } from "src/areas/nomina/models/Incentivo"  
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  formatoPrecio       } from "src/useSimpleOk/useTools"
  import {  style               } from "src/useSimpleOk/useEstilos"  
  import {  useControlIncentivos} from "src/areas/nomina/controllers/ControlIncentivos"  
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"
  import    tooltipLinea          from "src/areas/acuerdos/components/Tools/Tooltips/TooltipLinea.vue"
  import    formulario            from "./FormularioComision.vue"
  
  const { acuerdo,
          modales,
          loading           } = storeToRefs( useStoreAcuerdo() )
  const { usuario           } = storeToRefs( useStoreUser() )
  const modo                  = ref< ModosVentana >("normal")
  const { buscarIncentivos  } = useControlIncentivos()  

  const emit = defineEmits<{
    (e: 'cerrar',         value: void           ): void
  }>()

  const columnas              = ref< IColumna[] >([
    new Columna           ({ name: "ref",           label: "Producto"   }),
    Columna.ColumnaPrecio ({ name: "totalConDescu", label: "Subtotal"   }),
    new Columna           ({ name: "iconoNivel",    label: "Nivel"      }),
    new Columna           ({ name: "comision_c1",   label: "Comision %", align: "right"}),
    new Columna           ({ name: "comision_c2",   label: "Comision $", align: "right"}),
  ])

  onMounted( async ()=>{
    acuerdo.value.comision.calcular()
    arreglarColumnas()
    acuerdo.value.incentivo = await buscarIncentivos( { origenTipo: INCENTIVO_ORIGEN.PEDIDO_CLI, origenId : acuerdo.value.id } ) as IIncentivo
  })

  function arreglarColumnas()
  {
    if(usuario.value.esGerencia){      
      columnas.value.splice(2, 0,  Columna.ColumnaPrecio ({ name: "costo" }) )
      columnas.value.splice(3, 0,  Columna.ColumnaPrecio ({ name: "utilidad" }) )
      columnas.value.splice(4, 0,  Columna.ColumnaX100 ({ name: "aumentoFromCosto", label: "Aumento", decimales: 1 }) )
      
    }

    columnas.value.forEach( c=> c.sortable = false )
  }

  /* function buscar(){
    buscarIncentivos( INCENTIVO_ORIGEN.PEDIDO_CLI, acuerdo.value.id )
  } */

  function incentivoCreado( i : IIncentivo)
  {
    acuerdo.value.incentivo   = i
    modales.value.incentivo   = false  
  }

  
  function cerrar(){
    emit("cerrar")
  }

  const lineas                = computed(()=> acuerdo.value.productos.filter( p => !p.esTituloOsubTotal) as ILineaAcuerdo[])
  const showAprobar           = computed(()=>
    ( !acuerdo.value.incentivo.id && (usuario.value.esContable || usuario.value.esGerencia) )
    ||
    acuerdo.value.incentivo.esEstadoAnulado || acuerdo.value.incentivo.esEstadoAprobado
  )
</script>