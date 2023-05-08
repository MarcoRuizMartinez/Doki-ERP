<template>
  <div class                  ="full-width relative-position row q-pa-none no-wrap scroll">
    <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET LUGARES  -->
    <fieldset-filtro
      titulo                  ="Lugares"
      class-conenido          ="grilla-ribom"
      >
      <!-- //* ///////////////////////////////////////////////// Origen -->
      <municipios             hundido alerta
        v-model               ="b.f.municipio"
        class                 ="width190"
        label                 ="Origen"
      />
      <!-- //* ///////////////////////////////////////////////// Destino -->
      <municipios             hundido alerta
        v-model               ="b.f.municipioContacto"
        class                 ="width190"
        label                 ="Destino"
      />
    </fieldset-filtro>
    <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET VALOR -->
    <fieldset-filtro
      titulo                  ="Valor"
      class-conenido          ="grilla-ribom"
      >
      <!-- //* ///////////////////////////////////////////////// Valor envio -->
      <input-number           hundido alerta
        v-model               ="b.f.valorMax"
        label                 ="Valor por caja"
        icon                  ="mdi-currency-usd"
        class                 ="width130"
        :minimo               ="1000"
        :maximo               ="999_999_999"
      />
      <!-- //* ///////////////////////////////////////////////// Cantidad -->
      <input-number
        v-model               ="b.f.qty"
        v-bind                ="estiloBoton"
        label                 ="Cantidad"
        icon                  ="mdi-counter"
        class                 ="width130"
      />            
    </fieldset-filtro>
    <!-- //* ///////////////////////////////////////////////////////////////////// FIELD SET MEDIDAS -->
    <fieldset-filtro
      titulo                  ="Medidas"
      class-conenido          ="grilla-ribom"
      >
      <!-- //* ///////////////////////////////////////////////// Ancho -->
      <input-number           hundido
        v-model               ="b.f.peso"
        v-bind                ="estiloBoton"
        label                 ="Peso KG"
        icon                  ="mdi-weight-kilogram"
        class                 ="width130"
      />      
      <!-- //* ///////////////////////////////////////////////// Ancho -->
      <input-number           hundido
        v-model               ="b.f.ancho"
        v-bind                ="estiloBoton"
        label                 ="Ancho CM"
        icon                  ="mdi-tape-measure"
        class                 ="width130"        
      />
      <!-- //* ///////////////////////////////////////////////// Altura -->
      <input-number           hundido
        v-model               ="b.f.altura"
        v-bind                ="estiloBoton"
        label                 ="Altura CM"
        icon                  ="mdi-tape-measure"
        class                 ="width130"
      />      
      <!-- //* ///////////////////////////////////////////////// Fondo -->
      <input-number           hundido
        v-model               ="b.f.fondo"
        v-bind                ="estiloBoton"
        label                 ="Fondo CM"
        icon                  ="mdi-tape-measure"
        class                 ="width130"
      />
    </fieldset-filtro>
    <fieldset-filtro
      titulo                  ="Buscar y tipo"
      class-conenido          ="column q-gutter-xs"
      >
      <!-- //* ///////////////////////////////////////////////// Tipo de producto -->        
      <input-buscar           clearable hundido
        v-model               ="b.f.nombre"
        label                 ="Producto"
        class                 ="width140"
        icon                  ="mdi-printer-3d"
      />
      <!-- //* ///////////////////////////////////////////////// Slot Filtro -->
      <slot name              ="filtro"></slot>
    </fieldset-filtro>    
    <!-- //* /////////////////////////////////////////////////// Cotizacion -->
    <fieldset-filtro
      titulo                  ="Cotizacion"
      class-conenido          ="fit"
      >
      <!-- //* ///////////////////////////////////////////////// Slot -->
      <div>
        <slot></slot>
      </div>
      <table>
        <tbody>
          <tr>
            <td>Total sin IVA:</td>
            <td class         ="text-bold fuente-mono">
              {{ formatoPrecio( totalSinIVA ) }}
            </td>
          </tr>
          <tr>
            <td>Total con IVA:</td>
            <td class         ="text-bold fuente-mono">
              {{ formatoPrecio( totalConIVA ) }}
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset-filtro>
    <fieldset-filtro
      titulo                  ="Opciones"
      class-conenido          ="grilla-ribom"
      >
      <!-- //* ///////////////////////////////////////////////// Slot Columnas -->
      <slot name              ="columnas"></slot>
      <!-- //* ///////////////////////////////////////////////// Botones -->
      <div class              ="row justify-around q-mt-sm">
        <!-- //* /////////////////////////////////////////////// Boton recargar -->
        <div>
          <q-btn              round push glossy
            icon              ="mdi-refresh"
            padding           ="xs"
            color             ="primary"
            :disable          ="b.queryVacia"
            @click            ="buscar"
            >
            <Tooltip label    ="Recargar"/>
          </q-btn>
        </div>
        <!-- //* /////////////////////////////////////////////// Boton limpiar -->
        <div>
          <q-btn              round push glossy
            icon              ="mdi-close"
            padding           ="xs"
            color             ="primary"
            :disable          ="b.queryVacia"
            @click            ="limpiarBusqueda"
            >
            <Tooltip label    ="Limpiar búsqueda"/>
          </q-btn>
        </div>
        <!-- //* /////////////////////////////////////////////// Boton exportar -->
        <div>
          <q-btn              round push glossy
            icon              ="mdi-microsoft-excel"
            color             ="primary"
            padding           ="xs"
            :disable          ="b.queryVacia"
            @click            ="emit('exportar')"
            >
            <Tooltip label    ="Descargar"/>
          </q-btn>
        </div>
      </div> 
    </fieldset-filtro>      
    <inner-loading :cargando  ="loading.carga"/>
  </div>
</template>
<script lang="ts" setup>
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  watch,
            toRefs,
            PropType,
            computed            } from "vue"

  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from "pinia"  
  import {  useStoreAcuerdo     } from "src/stores/acuerdo"

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  IQuery              } from "src/models/Busqueda"
  import {  formatoPrecio,
            X100_Aumento        } from "src/useSimpleOk/useTools"
  import {  ICostoEnvio         } from "src/areas/logistica/models/CostoEnvio"

  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    fieldsetFiltro        from "components/utilidades/Fieldset.vue"
  import    innerLoading          from "components/utilidades/InnerLoading.vue"
  import    inputBuscar           from "components/utilidades/input/InputSimple.vue"
  import    inputNumber           from "components/utilidades/input/InputFormNumber.vue"  
  import    municipios            from "components/utilidades/select/SelectMunicipios.vue"
  

  const props                 = defineProps({      
    quote: { required: true,  type: Array as PropType< ICostoEnvio[] >  },
  })
  const { quote }             = toRefs(props)

  const { busqueda : b,
          loading               } = storeToRefs( useStoreAcuerdo() )

  const emit = defineEmits<{
    (e: 'buscar',   value: IQuery ): void
    (e: 'limpiar',                ): void
    (e: 'exportar',               ): void    
  }>()

  watch(()=>b.value.f, ()=>
    {
      if(b.value.puedeBuscar && b.value.checkPage())
        buscar()
      else  if(b.value.queryVacia ) limpiarBusqueda()
    },
    { deep: true }
  )

  function buscar()
  {    
    b.value.copiarQueryARourter()
    if(!busquedaCompleta.value) return
    
    const q                 = Object.assign( {}, b.value.query)
    q.municipio             = b.value.f.municipio         .codigoDianLargo
    q.municipioContacto     = b.value.f.municipioContacto .codigoDianLargo
    emit("buscar", q)
  }

  function limpiarBusqueda(){
    const todoLimpio  = b.value.limpiarQueryDeRouter()
    if(todoLimpio) emit("limpiar")
  }  

  const busquedaCompleta          = computed(()=> ( "municipio"         in b.value.query &&
                                                    "municipioContacto" in b.value.query &&
                                                    "peso"              in b.value.query &&
                                                    "valorMax"          in b.value.query
                                                  )
                                            )

  type TEstilo = { colores : "verde-rojo", iconos: "suma", hundido? : boolean, debounce : string, paso : number, minimo : number, maximo : number}
  
  const estiloBoton : TEstilo = { 
    hundido   : true,
    colores   : "verde-rojo",
    iconos    : "suma",
    debounce  : "2500",
    paso      : 1,
    minimo    : 1,
    maximo    : 1000,
  }


  const totalSinIVA      = computed(()=> { 
    let suma                      = 0
    if(!!quote.value && !!quote.value.length)
      suma                        = quote.value.map( c=> c.totalSinIVA ?? 0 ).reduce((cos, now) => (cos ?? 0) + now)
    return suma
  })
  const totalConIVA     = computed(()=>  X100_Aumento( totalSinIVA.value, parseInt( process.env.IVA ?? "0" )) )
</script>
