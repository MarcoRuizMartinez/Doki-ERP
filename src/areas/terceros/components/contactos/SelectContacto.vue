<template>
  <q-select                   use-input dense fill-input hide-selected
    v-model                   ="modelo"
    input-debounce            ="400"
    behavior                  ="dialog"
    :label
    :disable
    :readonly
    :loading
    :filled                   ="!hundido"
    :class                    ="[$attrs.class, { 'campo-hundido' : hundido }]"
    :options                  ="contactos"
    :option-label             ="( contacto : IContacto ) => !contacto ? '' : contacto.nombreCompleto + ( !!contacto.empresa ? ' - ' + contacto.empresa : '') "
    @filter                   ="buscar"
    @popup-show               ="virgen = true"
    @update:model-value       ="( conta : any ) => emit('update:contacto', conta )"
    >
    <template                 #prepend>
      <q-icon
        :name                 ="icon"
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
        v-if                  ="!!contacto.id && !readonly && !disable"
        icon                  ="mdi-pencil"
        padding               ="0"
        @click.stop           ="mostrarVentana('editar')"
        >
        <Tooltip label        ="Editar contacto"/>
      </q-btn>
      <q-btn                  dense flat
        v-if                  ="!readonly && quitarContacto && !!contacto.id"
        icon                  ="mdi-account-off"
        padding               ="0"
        @click.stop           ="emit('quitarContacto', contacto)"
        >
        <Tooltip label        ="Quitar contacto"/>
      </q-btn>      
      <q-btn                  dense flat
        v-else-if             ="!readonly"
        icon                  ="mdi-plus"
        padding               ="0"
        @click.stop           ="mostrarVentana('nuevo')"
        >
        <Tooltip label        ="Crear contacto"/>
      </q-btn>
      <q-btn                  dense flat
        v-if                  ="!readonly && !disable"
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
  <q-dialog
    v-model                   ="ventanaOk"
    v-bind                    ="style.dialogo"
    >
    <!-- //* /////////////  Formulario Contacto  -->
    <form-contacto
      v-model                 ="contactoEditar"
      :tipo-entrega           ="tipoEntrega"
      :es-tercero-ctz         ="tercero.esTerceroCtz"
      :municipio              ="tercero.municipio"
      :direccion              ="tercero.direccion"
      :editando               ="editar"
      @crear                  ="contactoCreado"
      @update:model-value     ="contactoEditado"
    />
  </q-dialog>
</template>
<script setup lang="ts">
  import {  useApiDolibarr  } from "src/composables/useApiDolibarr"
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
  import {  style           } from "src/composables/useEstilos"

  const contactos             = ref< IContacto[] > ([])
  const modelo                = ref< IContacto >()
  const contactoEditar        = ref< IContacto >()
  const loading               = ref< boolean >(false)
  const virgen                = ref< boolean >(true)
  const { apiDolibarr       } = useApiDolibarr()
  const editar                = ref< boolean >(true)

    const emit                  = defineEmits<{
    (e: 'update:contacto',  value: IContacto                ): void
    (e: 'contactoInicial',  value: IContacto                ): void
    (e: 'quitarContacto',   value: IContacto                ): void
    (e: 'contactoNuevo',    value: IContacto                ): void
    (e: 'contactoCambio',   value: IContacto, idOld: number ): void
  }>()


  const props                 = defineProps({
    icon:             { default:  "mdi-account",  type: String                          },
    label:            { default:  "Contacto",     type: String                          },
    disable:          { default:  false,          type: Boolean                         },
    readonly:         { default:  false,          type: Boolean                         },
    contacto:         { required: true,           type: Object as PropType< IContacto > },
    tercero:          { required: true,           type: Object as PropType< ITercero >  },
    quitarContacto:   { default:  false,          type: Boolean                         },
    tipoEntrega:      { default:  false,          type: Boolean                         },
    hundido:          { default:  false,          type: Boolean                         },
  })
  const { contacto,
          tipoEntrega,
          tercero           } = toRefs(props)

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
    // Se asume que si oldContacto es undefined, y newContacto es valido, es porque se esta cargando por primeva vez
    if(!!newContacto && !oldContacto) {
      emit('contactoInicial', newContacto )
    }
    else
    // Contacto Old esta vacio y se esta agregando un contacto desde cero
    if(!!newContacto && !!oldContacto && !oldContacto.id && !!newContacto.id) {
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
      loading.value           = false
      doneFn(() => { contactos.value = [] } )
      return 
    }

    virgen.value              = false
    loading.value             = true

    let url                   = "thirdparty_ids=" + tercero.value.id + "&search_status=1&limit=10"
    //if(!!busqueda) url        += `&sqlfilters=(t.firstname%3Alike%3A'%25${busqueda}%25')||(t.lastname%3Alike%3A'%25${busqueda}%25')||(t.email%3Alike%3A'%25${busqueda}%25')||(t.phone_mobile%3Alike%3A'%25${busqueda}%25')||(t.note_public%3Alike%3A'%25${busqueda}%25')`.replaceAll(" ", "%20")
    if(!!busqueda) url        += `&sqlfilters=(t.firstname:like:'%${busqueda}%') OR (t.lastname:like:'%${busqueda}%') OR (t.email:like:'%${busqueda}%') OR (t.note_public:like:'%${busqueda}%')`
    const { data, ok }        = await apiDolibarr( "buscar", "contacto", url )
    const contacts :IContacto[] = []
    
    if(ok && Array.isArray( data ) && !!data.length)
    {      
      for (const contacto of data as any[])
      {
        if(contacto.hasOwnProperty("statut") && contacto.statut == "0") continue        
        contacts.push( await Contacto.getContactoFromAPIDolibarr( contacto ) )        
      }
    }
    doneFn( () => contactos.value =  contacts )
    //tipoEntrega.value ? contacts.filter( c => !!c.municipio.id && !!c.direccion) : contacts )

    loading.value             = false
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
    emit('update:contacto', contac )
  }  

</script>