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
            toRefs,
            onMounted,
            PropType              } from "vue"
  import {  useApiDolibarr        } from "src/composables/useApiDolibarr"      
  import {  ToolArray             } from "src/composables/useTools"  
  import {  IItemMenu, ItemMenu   } from "src/models/ItemMenu"
  import    itemMenu                from "components/navegacion/PortadasMenuItem.vue"


  const { apiDolibarr       } = useApiDolibarr()
  const enlaces               = ref<IItemMenu[]>([])

  const props                 = defineProps({      
    palabras: { required: true,  type: Array as PropType< string[] > },
  })

  const { palabras }          = toRefs( props )

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
        enlaces.value   = enlaces.value.filter( e => palabras.value.some( p => e.titulo.includes( p ) ) )
        enlaces.value   = ToolArray.ordenar( enlaces.value, 'orden', "<")
      }
    }
  }
</script>