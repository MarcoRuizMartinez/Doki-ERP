<template>
  <ventana                  cerrar
    :titulo                 ="lineas.length + ' producto' + ( unaSola ? '' : 's'  )"
    icono                   ="mdi-package-variant-closed"
    :width                  ="310"
    :cargando               ="cargando"
    class-contenido         ="column gap-sm"
    >
    <input-number           con-decimales
      v-model               ="cantidad"
      label                 ="Cantidad"
      icon                  ="mdi-counter"
      class                 ="full-width"
      :paso                 ="1"
      :minimo               ="0.1"
      :maximo               ="1000"
    />
    <div class              ="full-width row">
      <input-number         con-decimales
        v-model             ="descuento"
        label               ="Descuento"
        icon                ="mdi-percent-outline"
        tipo                ="porcentaje"
        class               ="col-8"
        :paso               ="0.1"
        :minimo             ="0"
        :maximo             ="100"
      />
      <q-toggle
        v-model             ="addDescuento"
        label               ="Sumar"
        class               ="col">
        <Tooltip label      ="Sumar descuento sobre descuento"/>
      </q-toggle>
    </div>
    <q-btn                  push glossy
      label                 ="Editar"
      color                 ="positive"
      class                 ="full-width"
      :disable              ="!cantidad && descuento === undefined"
      @click                ="editar"
    />
    <q-btn                  push glossy
      label                 ="Borrar"
      color                 ="negative"
      class                 ="full-width"
      @click                ="confirmarBorrar"
    />    
    </ventana>
</template>

<script setup lang="ts">
  import {  ref,
            PropType,
            toRefs,
            computed
                              } from "vue"
  import    ventana             from "components/utilidades/Ventana.vue"
  import    inputNumber         from "src/components/utilidades/input/InputFormNumber.vue"
  import {  useApiDolibarr    } from "src/services/useApiDolibarr"
  import {  useQuasar         } from "quasar"
  import {  useTools, pausa   } from "src/useSimpleOk/useTools"
  import {  LineaAcuerdo,
            ILineaAcuerdo     } from "src/areas/acuerdos/models/LineaAcuerdo"
  const emit                  = defineEmits(["update:lineas", "edicionOk", "borrarLinea", "borradoOk", ])
  const props                 = defineProps({
    lineas: { required: true,   type: Array as PropType< ILineaAcuerdo[] >  }, 
  })
  const { dialog            } = useQuasar()
  const { apiDolibarr       } = useApiDolibarr()
  const { lineas }            = toRefs( props )
  const { aviso             } = useTools()
  const descuento             = ref < number >()
  const cantidad              = ref < number >()
  const cargando              = ref < boolean >(false)
  const addDescuento          = ref < boolean >(false)
  const unaSola               = computed(()=> lineas.value.length == 1 )
  
  async function editar()
  {
    cargando.value            = true
    for (const linea of lineas.value)
    {
      if(!!cantidad.value)
        linea.qty             = cantidad.value

      if(!!descuento.value    || descuento.value === 0)
      {
        if(addDescuento.value && descuento.value > 0)
          linea.descuentoX100 += descuento.value
        else
          linea.descuentoX100 = descuento.value
      }
        
      if(descuento.value !== undefined || !!cantidad.value)
      {
        let lineaAPI          = LineaAcuerdo.lineaToLineaApi( linea )
        let {ok, data}        = await apiDolibarr("editar", "lineaCotizacion", lineaAPI, linea.padreId )

        if(ok)
        {
          linea.destacar( "guardar", "ocultar" )
        }
      }
    }

    cargando.value            = false
    aviso("positive", lineas.value.length === 1 ? "Producto editado" : "Productos editados")
    emit("edicionOk")
  }

  function confirmarBorrar()
  {
    dialog({
      title:    'Confirmar',
      message:  'Realmente deseas eliminar ' + (unaSola.value ? 'esta línea' : 'estas líneas'),
      cancel:   true,
      class:    "text-center",
      html:     true,
    }).onOk(() => {
      borrarLineas()
    })
  }

  async function borrarLineas()
  {
    cargando.value    = true
    for (const linea of lineas.value)
    {
      let { ok, data }= await apiDolibarr("borrar", "lineaCotizacion", linea.lineaId, linea.padreId )
      linea.destacar( "borrar", "ocultar" )
      emit("borrarLinea", linea)
      await pausa(1000)
    }
    cargando.value    = true
    aviso("positive", lineas.value.length === 1 ? "Producto borrado" : "Productos borrados")
    emit("edicionOk")
    emit("borradoOk")
  }
</script>