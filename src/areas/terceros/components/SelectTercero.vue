<template>
  <q-select                   filled use-input dense fill-input hide-selected
    v-model                   ="modelo"
    label                     ="Tercero"
    input-debounce            ="400"
    option-label              ="nombre"
    behavior                  ="dialog"
    :loading                  ="cargando"
    :options                  ="terceros"
    :readonly                 ="readonly"
    @filter                   ="buscar"
    @popup-show               ="virgen = true"
    @update:model-value       ="( tercero_ ) => emit('update:tercero', tercero_)"
    >
    <template #no-option>
      <q-item>
        <q-item-section class ="text-grey text-h6 ">
          {{virgen ? "Escribe tu búsqueda": "No se encontró ningún tercero" }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script setup lang="ts">

  import {  servicesTerceros,
            IBusquedaTercero} from "src/areas/terceros/services/servicesTerceros"
  import {  useStoreUser    } from 'src/stores/user'
  import {  ref,
            toRefs,
            PropType,
            watch
                            } from "vue"
  import {  ITercero        } from "src/areas/terceros/models/Tercero"

  const terceros              = ref< ITercero[] > ([])
  const modelo                = ref< ITercero >()
  const cargando              = ref< boolean >(false)
  const virgen                = ref< boolean >(true)

  const storeUser             = useStoreUser()
  const { buscarTerceros,
          buscarTercero     } = servicesTerceros()

  const emit                  = defineEmits(["update:tercero"])
  const props                 = defineProps({
    tercero:    { required: true,   type: Object as PropType< ITercero >    },
    readonly:   { default:  false,  type: Boolean                           }
  })
  const { tercero }           = toRefs(props)

  watch(tercero, (newValue)=>{
    //if(!!newValue.id)
      modelo.value            = newValue
    },
    { immediate: true}
  )


  async function buscar( busqueda : string, doneFn : Function )
  {
    if(busqueda.length        > 0)
      virgen.value            = false

    let query :IBusquedaTercero
    let terce :ITercero[]     = []

    if((!busqueda || busqueda.length < 2) && !virgen.value)
    {
      cargando.value          = false
      doneFn(() => { terceros.value = [] } )
      return
    }
    else
    if(virgen.value)
    {
      if(!!storeUser.usuario.terceroIdCtz)
        terce.push( await buscarTercero( storeUser.usuario.terceroIdCtz ) )

      query                   = { idUsuarios: storeUser.usuario.id, limite: 10, orden: "DESC", esCliente: 1 }
    }
    else
    {
      cargando.value          = false
      query                   = { like: busqueda, esCliente: 1, limite: 30 }
      if( !storeUser.permisos.acceso_total )
          query.idUsuarios    = storeUser.usuario.id
    }

    cargando.value            = true
    terce.push( ...await buscarTerceros( query ) )
    borrarDuplicados()
    doneFn( () => terceros.value = terce )
    cargando.value            = false

    function borrarDuplicados()
    {
      if(!!storeUser.usuario.terceroIdCtz){ // Es posible que cargue dos veces el mismo tercero, hay que borrarlo
        let duplicados        = terce.filter( (t) => t.id == storeUser.usuario.terceroIdCtz )
        if( duplicados.length > 1)  // Si hay terceros duplicados
        {
          let indiceBorrar    = terce.findIndex( (t, index) => t.id == storeUser.usuario.terceroIdCtz && index > 0)
          terce.splice(indiceBorrar, 1)
        }
      }
    }
  }
</script>
