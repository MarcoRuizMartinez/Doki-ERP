<template>
  <ventana
    class-contenido             ="column items-center"
    titulo                      ="Contactos"
    icono                       ="mdi-book-account"
    size-icon-carga             ="6em"
    mensaje-sin-resultados      ="Tercero sin contactos"
    icono-sin-resultados        ="mdi-book-account"
    :padding-contenido          ="modo == 'normal' ? '0' : '12px' "
    :modo                       ="modo"
    >
    <template                   #barra>
      <!-- //* ///////////////  Boton crear  -->
      <q-btn
        v-if                    ="puedeEditar && storeUser.permisos.contactos_crear"
        v-bind                  ="style.btnBaseSm"
        label                   ="Crear"
        color                   ="positive"
        icon                    ="mdi-account-plus"
        :disable                ="modo == 'buscando'"
        @click                  ="clickFila"
      />
      <q-dialog
        v-model                 ="ventanaOk"
        v-bind                  ="style.dialogo"
        >
        <!-- //* /////////////  Formulario Contacto  -->
        <form-contacto          borrable
          v-model               ="contactoSelect"
          :tercero-id           ="tercero.id"
          :es-tercero-ctz       ="tercero.esTerceroCtz"
          :municipio            ="tercero.municipio"
          :direccion            ="tercero.direccion"
          @update:model-value   ="modifiadoOk"
          @borrar               ="borrardoOk"
          @crear                ="crearOk"
        />
      </q-dialog>
    </template>
    <!-- //* /////////////////  Tabla  -->
    <q-table                    bordered dense flat
      v-if                      ="!!contactos.length"
      class                     ="fit tabla-maco"
      row-key                   ="id"
      :rows                     ="contactos"
      :columns                  ="columnas"
      :visible-columns          ="columnasVisibles"
      @row-click                ="clickFila"
      >
      <template #body-cell-nombreCompleto="props">
        <!-- //* /////////////  Columna Nombre contacto  -->
        <q-td :props="props" :class=" { 'op30' : !props.row.activo }">
          {{props.value}}
          <tooltip-contacto :contacto="( props.row as Contacto )" />
        </q-td>
      </template>
      <template #body-cell="props">
        <!-- //* /////////////  Columnas -->
        <q-td :props="props" :class=" { 'op30' : !props.row.activo }"> {{props.value}} </q-td>
      </template>
    </q-table>
  </ventana>
</template>

<script setup lang="ts">
  import {  ref,
            toRefs,
            inject,
            watch           } from "vue"
  import {  useApiDolibarr  } from "src/composables/useApiDolibarr"
  import {  IContacto,
            Contacto        } from "src/areas/terceros/models/Contacto"
  import {  useStoreUser    } from "stores/user"
  import {  TModosVentana    } from "src/models/TiposVarios"
  import {  IColumna,
            Columna         } from "src/models/Tabla"
  import    ventana           from "components/utilidades/Ventana.vue"
  import    tooltipContacto   from "src/areas/terceros/components/contactos/TooltipContacto.vue"
  import    formContacto      from "src/areas/terceros/components/contactos/FormularioContacto.vue"
  import {  Tercero,
            ITercero        } from "src/areas/terceros/models/Tercero"
  import {  style           } from "src/composables/useEstilos"

  const { apiDolibarr       } = useApiDolibarr()
  const storeUser             = useStoreUser()
  const modo                  = ref< TModosVentana >("buscando")
  const contactos             = ref< IContacto[]  >([])
  const contactoSelect        = ref< IContacto    >()
  const ventanaOk             = ref< boolean      >(false)
  const tercero               = inject('tercero', ref< ITercero >(new Tercero()) )

  const columnas: IColumna[]  = [
    new Columna({ name: "empresa",        visible: false  }),    
    new Columna({ name: "nombreCompleto", label: "Nombre" }),
    new Columna({ name: "cargo"                           }),
    new Columna({ name: "telefono"                        }),
    new Columna({ name: "correo"                          }),
  ]

  const columnasVisibles      = ref<string[]>( columnas.filter( c => c.visible ).map( c => c.name ) )

  const props                 = defineProps({
    terceroId:    { required: true,             type: Number,  default: 0  },
    puedeEditar:  { default:  false,            type: Boolean              },
    soloEmitir:   { default:  false,            type: Boolean              },
  })

  const emit                  = defineEmits<{
    (e: "clikContacto",       value: IContacto ): void
  }>()


  const { terceroId, 
          soloEmitir }        = toRefs( props )
  
  //onMounted( buscar )
  watch(terceroId, (idNew) =>
    {
      if(!!idNew)
      {
        buscarContactos( idNew )

        if(tercero.value.esTerceroCtz)
        {
          columnasVisibles.value= columnas.map( c => c.name )
        }
      }  
    }
    ,{ immediate: true}
  )
  

  async function buscarContactos( id : number )  
  {
    modo.value                = "buscando"
    let { data : contactosApi,
          ok          }       = await apiDolibarr( "buscar", "contacto", "thirdparty_ids=" + id )

    if(ok && Array.isArray( contactosApi ) && !!contactosApi.length)
    {
      contactos.value         = []
      for (const contacto of contactosApi)
      {
        contactos.value.push( await Contacto.getContactoFromAPIDolibarr( contacto ) )        
      }
      modo.value              = "normal"
    }
    else
    {
      modo.value              = "sin-resultados"
    }
  }

  function clickFila(evt : Object, row? : Object, index? : Number)
  {
    contactoSelect.value      = index != undefined ? row as IContacto : new Contacto( terceroId.value )
    emit('clikContacto', contactoSelect.value)
    if(soloEmitir.value) return
    ventanaOk.value           = true
  }

  function crearOk( contac : IContacto )
  {
    contactos.value.push( contac ) 
    ventanaOk.value           = false
    if(contactos.value.length == 1 )
      modo.value              = "normal"
  }

  function modifiadoOk( contac : IContacto )
  {
    let index                 = contactos.value.findIndex( c => c.id == contac.id) 
    contactos.value[index]    = contac
    ventanaOk.value           = false
  }

  function borrardoOk( id : number )
  {
    let index                 = contactos.value.findIndex( c => c.id == id ) 
    contactos.value.splice(index, 1)
    ventanaOk.value           = false

    if(contactos.value.length == 0 )
      modo.value              = "sin-resultados"
  }
</script>