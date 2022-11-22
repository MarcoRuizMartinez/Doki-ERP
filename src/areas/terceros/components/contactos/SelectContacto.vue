<template>
  <q-select                   filled use-input dense fill-input hide-selected
    v-model                   ="modelo"
    label                     ="Contacto"
    input-debounce            ="400"
    behavior                  ="dialog"
    :class                    ="$attrs.class"
    :loading                  ="cargando"
    :options                  ="contactos"
    :disable                  ="disable"
    :readonly                 ="readonly"
    :option-label             ="(contacto) => !contacto ? '' : contacto.nombreCompleto + ( !!contacto.empresa ? ' - ' + contacto.empresa : '') "
    @filter                   ="buscar"
    @popup-show               ="virgen = true"
    @update:model-value       ="( conta : any ) => emit('update:contacto', conta )"
    >
    <template                 #prepend>
      <q-icon
        name                  ="mdi-account"
        :color                ="!!modelo && !!modelo.id ? 'primary' : 'grey-6'"
      />
    </template>
    <template                 #no-option>
      <q-item>
        <q-item-section class ="text-grey text-h6 ">          
          No se encontró ningún contacto
        </q-item-section>
      </q-item>
    </template>
    <template                 #append>
      <q-btn                  dense flat
        v-if                  ="!!contacto.id"
        icon                  ="mdi-pencil"
        padding               ="0"
        @click.stop           ="mostrarVentana('editar')"
        >
        <Tooltip label        ="Editar contacto"/>
      </q-btn>
      <q-btn                  dense flat
        v-if                  ="!readonly"
        icon                  ="mdi-plus"
        padding               ="0"
        @click.stop           ="mostrarVentana('nuevo')"
        >
        <Tooltip label        ="Crear contacto"/>
      </q-btn>
      <q-btn                  dense flat
        icon                  ="mdi-information"
        padding               ="0"
        @click.stop           ="mostrarVentana('ver')"
        >
        <tooltip-contacto
          :contacto           ="contacto"
        />
      </q-btn> 
    </template>
  </q-select>
  <q-dialog v-model           ="ventanaOk">
    <!-- //* /////////////  Formulario Contacto  -->
    <form-contacto
      v-model                 ="contactoEditar"
      :es-tercero-ctz         ="tercero.esTerceroCtz"
      :municipio              ="tercero.municipio"
      :editando               ="editar"
      @crear                  ="contactoCreado"
      @update:model-value     ="contactoEditado"
    />
  </q-dialog>
</template>
<script setup lang="ts">
  import {  useApiDolibarr  } from "src/services/useApiDolibarr"
  import {  ref,
            toRefs,
            PropType,
            watch
                            } from "vue"
  import {  IContacto,
            Contacto        } from "src/areas/terceros/models/Contacto"
  import {  ITercero        } from "src/areas/terceros/models/Tercero"            
  import    tooltipContacto   from "src/areas/terceros/components/contactos/TooltipContacto.vue"
  import    formContacto      from "src/areas/terceros/components/contactos/FormularioContacto.vue"

  const contactos             = ref< IContacto[] > ([])
  const modelo                = ref< IContacto >()
  const contactoEditar        = ref< IContacto >()
  const cargando              = ref< boolean >(false)
  const virgen                = ref< boolean >(true)
  const { apiDolibarr       } = useApiDolibarr()
  const editar                = ref< boolean >(true)

    const emit                  = defineEmits<{
    (e: 'update:contacto',  value: IContacto                ): void
    (e: 'contactoInicial',  value: IContacto                ): void
    (e: 'contactoNuevo',    value: IContacto                ): void
    (e: 'contactoCambio',   value: IContacto, idOld: number ): void
  }>()


  const props                 = defineProps({
    disable:    { default:  false,  type: Boolean                           },
    readonly:   { default:  false,  type: Boolean                           },
    contacto:   { required: true,   type: Object as PropType< IContacto >   },
    tercero:    { required: true,   type: Object as PropType< ITercero >    },
  })
  const { contacto, tercero } = toRefs(props)

  const ventanaOk             = ref<boolean>(false)

  watch(contacto, (newValue, oldValue)=>
  {
      if(!newValue) return
      modelo.value            = newValue
    }
    ,{ immediate: true }
  )

  watch( modelo, (newContacto, oldContacto)=>
  {
    // Se asume que si oldContacto es undefinide, y newContacto es valido, es porque se esta cargando por primeva vez
    if(!!newContacto && !oldContacto) {
      emit('contactoInicial', newContacto )
    }
    else
    // Contacto Old esta vacio y se esta agregando un contacto desde cero
    if(!!newContacto && !!oldContacto && !oldContacto.id) {
      emit('contactoNuevo', newContacto )
    }
    else
    // New y Old son validos entonces es un cambio de contacto, y IDs son diferentes
    if
    (     !!newContacto     && !!oldContacto  &&  !!oldContacto.id
      &&  oldContacto.terceroId === newContacto.terceroId
      &&  oldContacto.id        !== newContacto.id
    )
    {
      emit('contactoCambio', newContacto, oldContacto.id )
    }
  })

  
  async function buscar( busqueda : string, doneFn : Function )
  {
    if((!busqueda || busqueda.length < 2) && !virgen.value)
    {
      cargando.value          = false
      doneFn(() => { contactos.value = [] } )
      return 
    }

    virgen.value              = false
    cargando.value            = true

    let url                   = "thirdparty_ids=" + tercero.value.id + "&search_status=1&limit=10"
    if(!!busqueda) url        += `&sqlfilters=(t.firstname%3Alike%3A'%25${busqueda}%25')||(t.lastname%3Alike%3A'%25${busqueda}%25')||(t.note_public%3Alike%3A'%25${busqueda}%25')`.replaceAll(" ", "%20")
    const { data, ok }        = await apiDolibarr( "buscar", "contacto", url )
    let contacts :IContacto[] = []

    if(ok && Array.isArray( data ) && !!data.length)
    {      
      for (const contacto of data as any[])
      {
        if(contacto.hasOwnProperty("statut") && contacto.statut == "0") continue        
        contacts.push( await Contacto.getContactoFromAPIDolibarr( contacto ) )        
      }
    }
    doneFn( () => contactos.value = contacts )

    cargando.value            = false
  }

  function contactoCreado( contac : IContacto )
  {
    ventanaOk.value           = false
    modelo.value              = contac
    contactos.value.push( contac )
    emit('update:contacto', contac )
  }

  function mostrarVentana( tipo : "nuevo" | "editar" | "ver" )
  {
    ventanaOk.value           = true
    editar.value              = tipo === "editar"
    contactoEditar.value      = tipo === "nuevo" ? new Contacto( tercero.value.id ) : modelo.value
  }

  function contactoEditado( contac : IContacto )
  {
    const index               = contactos.value.findIndex( c => c.id == contac.id) 
    contactos.value[index]    = contac
    modelo.value              = contac
    ventanaOk.value           = false
  }  

</script>