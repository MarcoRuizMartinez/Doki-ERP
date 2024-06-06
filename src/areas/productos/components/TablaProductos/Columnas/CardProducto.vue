<template>
  <div
    class                 ="q-pa-xs col-xs-6 col-sm-3 col-md-12-5 col-lg-12-5 grid-style-transition "
    :style=               "selected? 'transform: scale(0.95);' : ''"
    >
    <q-card
      class               ="card-producto"
      :class              ="[ { 'select-producto' : selected   },
                              { 'cursor-pointer'  : producto.activo || selectedAll },
                              { 'op40'            : !producto.activo  },
                            ]"
      @click              ="()=> { if( producto.activo || selectedAll ) emit('update:selected', !selected) }"
      v-touch-hold.mouse  ="()=> mouseLargo( producto )"
      >
      <!-- props.selected = !props.selected -->
      <q-card-section
        class             ="column items-center q-pa-xs"
        >
        <q-img
          :src            ="producto.img.img_300px"
          ratio           ="1"
          >
          <template v-slot:loading>
            <q-spinner-dots color="white" />
          </template>
        </q-img>
        <Tooltip v-if     ="!producto.activo">
          <div class      ="text-h6 text-center width200">Producto inactivo</div>
          <table    class ="text-1_1em">
            <tr><td>Activo en Dolibarr:     </td><td>{{ Format.siNo(producto.activoEnVenta)}}     </td></tr>
            <tr><td>Activo en proveedor:    </td><td>{{ Format.siNo(producto.activo_proveedor)}}  </td></tr>
            <tr><td>Disponible en proveedor:</td><td>{{ Format.siNo(producto.disponible)}}        </td></tr>
          </table>
        </Tooltip>
        <efecto efecto="UpDown">
          <q-icon
            v-if          ="producto.elegido"
            name          ="mdi-check-decagram"
            class         ="absolute-right"
            color         ="positive"
            size          ="lg"
            >
            <Tooltip label="Ya seleccionado"/>
          </q-icon>
        </efecto>
        <q-badge
          v-if            ="producto.descuentoCalculado > 0"
          class           ="absolute-left h-20px"
          color           ="orange"
          >
          <span>{{producto.descuentoCalculado}}%</span>
          <Tooltip>Descuento del {{producto.descuentoCalculado}}%</Tooltip>
        </q-badge>
        <q-badge
          v-if            ="producto.naturaleza.esCompuesto_o_Kit"
          class           ="absolute-right h-20px"
          color           ="deep-purple-10"
          >
          <q-icon
            name          ="mdi-focus-field"
            size          ="1.6em"
          />
          <Tooltip label  ="Producto compuesto"/>
        </q-badge>        
      </q-card-section>
      <q-separator />
      <div
        class             ="q-ma-xs conte-nombre column full-width text-bold"
        :class            ="{'bg-gris' : selected}"
        >
        <div class        ="text-grey-7 col-3">{{producto.ref}}</div>
        <div class        ="ellipsis-2-lines text-indigo-9 col-6">{{producto.nombre}}
          <Tooltip
            v-if          ="producto.activo"
            :label        ="producto.nombre"
          />
        </div>
        <div class        ="fuente-mono col-2 text-grey-9 text-1_1em">
          {{ Format.precio( producto.precio, "decimales-no" ) }}
          <tooltip-precios
            :producto     ="producto"
          />
        </div>
      </div>
    </q-card>
  </div>    
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  PropType            } from "vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IColumna, Columna   } from "src/models/Tabla"
  import {  IProductoDoli       } from "src/areas/productos/models/ProductoDolibarr"  
  // * /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  Format              } from "src/composables/useTools"  
  // * /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    efecto                from "components/utilidades/Efecto.vue"
  import    tooltipPrecios        from "src/areas/acuerdos/components/Tools/Tooltips/TooltipPreciosProducto.vue"

  const props                 = defineProps({      
    producto:         { required: true,  type: Object as PropType< IProductoDoli >  },  
    selected:         { required: true,  type: Boolean                              },
    selectedAll:      { required: false, type: Boolean                              },
  })

  const emit                  = defineEmits<{
    (e: "mouseLargo",       value: IProductoDoli  ): void
    (e: "update:selected",  value: boolean        ): void
  }>()

  const columnas: IColumna[]  = [
    new Columna           ({ name: "sigla",   sortable: false, label: "Imagen",  visible: false }),
    new Columna           ({ name: "ref",     sortable: false, label: "Filtrar", clase: "text-bold" }),
    new Columna           ({ name: "nombre"                                     }),
    new Columna           ({ name: "precio",  sortable: false                   }),
  ]

  function mouseLargo( producto : IProductoDoli )
  {
    emit("mouseLargo", producto)      
  }  
</script>

<style>
  .card-producto{
    border-radius: 6px;
    transition: box-shadow 0.3s ease-in-out, margin-top 200ms linear;
  }

  .conte-nombre{
    height: 100px;
    text-align: center;
  }

  .card-producto:hover {
    box-shadow: 0 7px 16px 0 rgb(0 0 0 / 20%), 0 1px 3px 0 rgba(95, 83, 83, 0.1);
    margin-top: -3px;
  }

  .select-producto,
  .select-producto:hover{
    box-shadow: 0px 0px 6px 5px #4a84cd;
  }
</style>