<template>
  <ventana                      minimizar
    titulo                      ="Cotizaciones"
    class-contenido             ="column items-center"
    icono                       ="mdi-format-list-text"
    size-icon-carga             ="14em"
    mensaje-sin-resultados      ="Tercero sin cotizaciones"
    :padding-contenido          ="modo == 'normal' ? '0' : '12px' "
    :modo                       ="modo"
    >
    <template                   #barra>
      <!-- //* ///////////////  Crear Pedido  -->
      <q-btn
        v-if                    ="true"
        v-bind                  ="btnBaseSm"
        label                   ="Pedido"
        color                   ="positive"
        icon                    ="mdi-plus"
        :disable                ="modo == 'buscando'"
        :href                   ="urlDolibarr + `/commande/card.php?socid=${terceroId}&action=create`"
        >
        <Tooltip label          ="Crear pedido"/>
      </q-btn>
      <!-- //* ///////////////  Boton crear cotizacion  -->
      <q-btn
        v-bind                  ="btnBaseSm"
        label                   ="Crear"
        color                   ="positive"
        icon                    ="mdi-format-list-text"
        :disable                ="modo == 'buscando'"
        @click                  ="crearCotizacion"
      />
    </template>
    <q-table                    borbordered dense flat
      class                     ="fit tabla-maco"
      row-key                   ="id"
      :rows                     ="cotizaciones"
      :columns                  ="columnas"
      >
      <!-- //* ///////////////  Columna Ref  -->
      <template #body-cell-ref  ="props">
        <q-td   :props          ="props">
          <q-icon name          ="mdi-package-variant-closed" size="xs" class="op60 op100-hover">
            <tooltip-lineas     :lineas="props.row.productos"/>
          </q-icon>
          <router-link :to      ="'/cotizaciones/' + props.row.id">
            {{ props.row.refCorta }}
            <tooltip-cotizacion :cotizacion="props.row"/>
          </router-link>
        </q-td>
      </template>
      <!-- //* ///////////////  Columna Estado  -->
      <template #body-cell-estado="props">
        <q-td   :props          ="props">
          <span
            class               ="q-px-xs text-white"
            style               ="border-radius: 6px;"
            :style              ="'background-color: ' + props.row.estadoColor"
            >
            {{ props.row.estadoLabel }}
          </span>
        </q-td>
      </template>
<!--       <template #body="props">
        <q-tr :props="props">
          <q-td key="nombre"    :props="props">
            <link-tercero       :tercero="( props.row as Tercero ) "/>
          </q-td>
        </q-tr>
      </template> -->
    </q-table>
  </ventana>
</template>

<script setup lang="ts">
  import {  ref,
            toRefs,
            onMounted       } from "vue"
  import {  ModosVentana    } from "src/models/TiposVarios"
  import {  servicesCotizaciones } from "src/areas/acuerdos/cotizaciones/services/servicesCotizaciones"
  import {  IColumna,
            Columna         } from "src/models/Tabla"
  import {  ICotizacion     } from "src/areas/acuerdos/cotizaciones/models/Cotizacion"
  import    ventana           from "components/utilidades/Ventana.vue"
  import    tooltipCotizacion from "src/areas/acuerdos/cotizaciones/components/tools/TooltipCotizacion.vue"
  import    tooltipLineas     from "src/areas/acuerdos/components/TooltipLineas.vue"
  import {  btnBaseSm       } from "src/useSimpleOk/useEstilos"
  import {  useRouter       } from 'vue-router'

  const urlDolibarr           = process.env.URL_DOLIBARR
  const { getCotizaciones   } = servicesCotizaciones()
  const router                = useRouter()
  const modo                  = ref< ModosVentana >("esperando-busqueda")
  const columnas: IColumna[]  = [
    new Columna({ name: "ref"       }),
    new Columna({ name: "estado"    }),
    Columna.ColumnaPrecio ({ name: "totalConDescu", label: "Subtotal",    clase: "text-bold"    }),
  ]
  const props                 = defineProps({
    terceroId: { required: true, type: Number },
  })
  const { terceroId }         = toRefs( props )
  const cotizaciones          = ref< ICotizacion[] >([])

  onMounted( buscar )

  async function buscar()
  {
    modo.value          = "buscando"
    cotizaciones.value  = await getCotizaciones( { idTercero: terceroId.value } )
    modo.value          = !!cotizaciones.value.length ? "normal" : "sin-resultados"
  }

  const crearCotizacion = ()=> router.push({name: "crearCotizacion" , params: { terceroId: +terceroId.value }}  )

</script>
<style>
.fecha{
  width: 80px;
  display: inline-block;
}
</style>
