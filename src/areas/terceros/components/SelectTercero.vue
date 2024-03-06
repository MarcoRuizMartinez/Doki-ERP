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
  import {  storeToRefs       } from 'pinia'
  import {  servicesTerceros  } from "src/areas/terceros/services/servicesTerceros"
  import {  useStoreUser      } from 'stores/user'
  import {  IQuery            } from "src/models/Busqueda"
  import {  ref,
            toRefs,
            PropType,
            watch
                              } from "vue"
  import {  ITercero          } from "src/areas/terceros/models/Tercero"

  const terceros              = ref< ITercero[] > ([])
  const modelo                = ref< ITercero >()
  const cargando              = ref< boolean >(false)
  const virgen                = ref< boolean >(true)

  
  const { usuario, permisos } = storeToRefs( useStoreUser() )
  const { buscarTerceros,
          buscarTercero     } = servicesTerceros()

  const emit                  = defineEmits(["update:tercero"])
  const props                 = defineProps({
    tercero:            { required: true,   type: Object as PropType< ITercero >    },
    readonly:           { default:  false,  type: Boolean                           },
    conTerceroEspecial: { default:  false,  type: Boolean                           },
  })
  const { tercero,
          conTerceroEspecial } = toRefs(props)

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

    let   query :IQuery       = {}
    const terce :ITercero[]   = []

    if((!busqueda || busqueda.length < 2) && !virgen.value)
    {
      cargando.value          = false
      doneFn(() => { terceros.value = [] } )
      return
    }
    else
    if(virgen.value)
    {
      if(!!usuario.value.terceroIdCtz && conTerceroEspecial.value)
        terce.push( await buscarTercero( usuario.value.terceroIdCtz ) )

      query                   = { usuario: usuario.value.id, limite: 10, offset: 0, orden: "DESC", esCliente: 1 }
    }
    else
    {
      cargando.value          = false
      query                   = { buscar: busqueda, esCliente: 1, limite: 30, offset: 0 }
      if( /* !permisos.value.acceso_total && */ !usuario.value.esGerencia )
          query.usuario       = usuario.value.id
    }

    cargando.value            = true
    terce.push( ...await buscarTerceros( query ) )
    borrarDuplicados()
    doneFn( () => terceros.value = terce )
    cargando.value            = false

    function borrarDuplicados()
    {
      if(!!usuario.value.terceroIdCtz){ // Es posible que cargue dos veces el mismo tercero, hay que borrarlo
        let duplicados        = terce.filter( (t) => t.id == usuario.value.terceroIdCtz )
        if( duplicados.length > 1 || (!conTerceroEspecial.value && duplicados.length === 1 ))  // Si hay terceros duplicados
        {
          let indiceBorrar    = terce.findIndex( (t, index) => t.id == usuario.value.terceroIdCtz && index > 0)
          terce.splice(indiceBorrar, 1)
        }
      }
    }
  }
</script>
