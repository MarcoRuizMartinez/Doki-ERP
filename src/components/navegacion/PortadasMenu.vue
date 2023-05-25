<template>
  <div  class             ="row q-col-gutter-lg fit">
    <div
      v-for               ="enlace in enlaces"
      :key                ="enlace.ref"
      class               ="col-3"
      >
      <item-menu  :enlace ="enlace"/>
    </div>
  </div>
</template>
<script setup lang="ts">
  import {  ref,
            onMounted,
            PropType              } from "vue"
  import {  useApiDolibarr        } from "src/services/useApiDolibarr"      
  import {  sortArray             } from "src/useSimpleOk/useTools"  
  import {  IItemMenu, ItemMenu   } from "src/models/ItemMenu"
  import    itemMenu                from "components/navegacion/PortadasMenuItem.vue"


  const { apiDolibarr       } = useApiDolibarr()
  const enlaces               = ref<IItemMenu[]>([])

  const { palabras }          = defineProps({      
    palabras: { required: true,  type: Array as PropType< string[] > },
  })


  onMounted( cargarEnlaces )

  async function cargarEnlaces()
  {
    const { ok, data }        = await apiDolibarr( "buscar", "saber" )
    if(ok)
    {
      if(Array.isArray(data))
      {
        for (const itemMenu of data)
        {
          const item    = new ItemMenu( itemMenu )
          enlaces.value.push( item )
        }
        enlaces.value   = enlaces.value.filter( e => palabras.some( p => e.titulo.includes( p ) ) )
        enlaces.value   = sortArray( enlaces.value, 'orden', "<")
      }
    }
  }
</script>