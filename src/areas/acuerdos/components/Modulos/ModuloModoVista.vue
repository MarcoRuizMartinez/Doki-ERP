<template>
  <div class              ="row justify-center">
    <q-btn-toggle         no-caps push glossy
      v-model             ="toggle"
      padding             ="4px 20px"
      size                ="md"
      text-color          ="primary"
      toggle-text-color   ="white"
      color               ="white"
      toggle-color        ="primary"
      :options            ="opciones"
      @update:model-value ="cambiarOpcion"
    />
  </div>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  computed,
            watch           } from "vue"
  import {  LocalStorage    } from 'quasar'

  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  ALMACEN_LOCAL   } from "src/models/TiposVarios"

  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs     } from 'pinia'
  import {  useStoreApp     } from 'stores/app'
  import {  useStoreAcuerdo } from 'stores/acuerdo'


  const { acuerdo     } = storeToRefs( useStoreAcuerdo() )
  const { toggle      } = storeToRefs( useStoreApp() )

  const key             = computed(()=>   acuerdo.value.esPedido      ? ALMACEN_LOCAL.VISTA_PEDIDO
                                        : acuerdo.value.esEntrega     ? ALMACEN_LOCAL.VISTA_ENTREGA
                                        : acuerdo.value.esCotizacion  ? ALMACEN_LOCAL.VISTA_COTIZA
                                        : acuerdo.value.esOCProveedor ? ALMACEN_LOCAL.VISTA_OC
                                        : ""
  )   
 
  watch([()=>acuerdo.value.id, ()=>acuerdo.value.tipo], ()=>
  {
    if(!key.value || !acuerdo.value.tipo) return

    const toggleLocal   = LocalStorage.getItem( process.env.PREFIJO + key.value ) as string
    toggle.value        = !!toggleLocal ? toggleLocal : "general"
    cambiarOpcion()
  })



  const opciones        = computed(()=>
  {
    const lista         = [ {label: 'General',    value: 'general'},
                            {label: 'Productos',  value: 'productos'}
                          ]

    if(acuerdo.value.esPedido)
      lista.push( {label: 'Entregas',   value: 'entregas'} )

    return lista
  })

  function cambiarOpcion()
  {
    if(!!key.value)
      LocalStorage.set(process.env.PREFIJO + key.value, toggle.value)
  }
</script>