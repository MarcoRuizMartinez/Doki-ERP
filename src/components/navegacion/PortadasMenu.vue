<template>
  <div  class           ="row q-col-gutter-lg">
    <div                
      v-for             ="enlace in enlaces"
      :key              ="enlace.ref"
      class             ="col-4 box"
      >
      <div              v-ripple
        class           ="bg-white q-pa-md radius-6 shadow-4 panel-blur-70">
        <span class     ="text-bold fuente-delicada">
          {{ enlace.question }}
        </span>
      </div>      
    </div>    
  </div>
</template>
<script setup lang="ts">
//:to               ="enlace.array_options.options_url"
// item-stretch content-start justify-start 
  import {  ref,
            toRefs,
            onMounted,
            PropType              } from "vue"
  import {  useApiDolibarr        } from "src/services/useApiDolibarr"      
  ////////////////////////////////////////////////////////////////////////// Store
  //import {  storeToRefs         } from 'pinia'
  //import {  useStoreUser        } from 'src/stores/user'

  //const { usuario           } = storeToRefs( useStoreUser() )
  const { apiDolibarr       } = useApiDolibarr()
  const enlaces               = ref<any[]>([])

  const props                 = defineProps({      
    palabra: { required: true,  type: String  },
  })

  const { palabra }          = toRefs( props )

  onMounted( cargarEnlaces )

  async function cargarEnlaces()
  {
    const { ok, data }        = await apiDolibarr( "buscar", "saber" )
    if(ok)
    {
      if(Array.isArray(data))
      {
        enlaces.value         = data.filter( i => i.question.includes( palabra.value ) )
      }
    }
  }
</script>