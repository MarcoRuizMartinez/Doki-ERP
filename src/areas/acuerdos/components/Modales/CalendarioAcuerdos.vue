<script setup>
  //* ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            computed,
            onMounted             } from "vue"
  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'stores/acuerdo'  

  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  style                 } from "src/composables/useEstilos"
  import {  ToolDate,
            ToolStr,
            Format                } from "src/composables/useTools"

  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"    

  //* //////////////////////      /////////////////////////////////////////     
  const { buscarEventos           } = useControlAcuerdo()
  const { acuerdo                 } = storeToRefs( useStoreAcuerdo() )
  const formatoFecha                = new Intl.DateTimeFormat( 'es-CO', { month: 'long', timeZone: 'UTC' })
  const calendario                  = ref()
  const eventos                     = ref([])
  const selectedDate                = ref( acuerdo.value.fechaCreacionCorta )  
  const mesSeleccionado             = computed(() =>
  {
    const fecha                     = ToolDate.getDateToStr( selectedDate.value, "UTC" )
    return formatoFecha.format(fecha)  + ' ' + fecha.getFullYear()
  })
              

    

  onMounted( ()=>{
    crearEventosLocales()
    crearEventosNube()
  })

  function crearEventosLocales()
  {
    agregarEvento( "✨Creación",      acuerdo.value.fechaCreacion,    "light-blue")
    agregarEvento( "🚚A despachar",   acuerdo.value.fechaADespachar,  "light-green-10", false)
    agregarEvento( "✅Esta listo",    acuerdo.value.fechaListo,       "blue-10", false)
    agregarEvento( "😯Compromiso",    acuerdo.value.fechaEntrega,     "red-7", false, "Fecha de compromiso con el cliente")


    for( const oc of acuerdo.value.OC_a_Proveedor )
    {
      const detalles = `${oc.creador.nombre} - ${oc.estadoLabel} ${oc.ref}`
      agregarEvento( `🏢 ${oc.ref.slice(-4)}`, oc.fechaValidacion,         "purple-10", true, detalles)
    }

    for( const ctz of acuerdo.value.cotizaciones )
    {
      agregarEvento( `📜 Cotización`, ctz.fechaCreacion, "cyan-5", true, ctz.ref)
    }
    

    for( const ant of acuerdo.value.anticipos )
    {
      const titulo    = `${ant.tipoSelect.label} ${Format.precio( ant.valor, "decimales-no" )}`
      const detalles  = `${ant.estadoSelect.label} ${Format.precio( ant.valor, "decimales-no" )}`
      agregarEvento( titulo, ant.fechaPago, "grey-10", true, detalles)     
    }

    for( const comen of acuerdo.value.comentarios )
    {
      const titulo    = `💬 ${comen.creador.nombre}`
      const detalles  = `${comen.titulo} - ${comen.comentario}`
      agregarEvento( titulo, comen.creacion, "grey-6", true, detalles)     
    }    
  }

  async function crearEventosNube()
  {
    await buscarEventos()
    for( const evento of acuerdo.value.eventos )
    {
      let titulo        = ToolStr.mayusculasPrimeraLetra( evento.titulo.split(" ").slice(2).join(" ") )      
      let color         = "blue-grey-7"

      if(evento.codigo === "AC_ORDER_CLASSIFY_BILLED"){
        titulo          = "📄 " + titulo
        color           = "pink-10"
      }
      else
      if(evento.codigo === "AC_ORDER_VALIDATE"){
        titulo          = "👌🏻 " + titulo
        color           = "orange-9"
      }
      else
      if(evento.codigo === "AC_ORDER_CLOSE"){
        titulo          = "👍🏻 " + titulo
        color           = "green-10"
      }

      const detalles    = `${evento.creadorLabel} ${titulo} - ${ToolDate.horaAmPm( evento.creacion )}`
      agregarEvento( titulo, evento.creacion, color, false, detalles)     
    }
  }

  const eventsMap = computed(()=>
  {
    const map = {}

    if (!!eventos.value.length)
    {
      eventos.value.forEach( event =>
        (map[ event.date || event.weekday ] = map[ event.date || event.weekday ] || []).push(event)
      )
    }

    return map   
  })

  function getEvents ( timestamp )
  {
    const events      = eventsMap.value[ timestamp.date ]
    return !!events ? events : []
  }


  
    
  function agregarEvento( titulo = '', fecha  = new Date(), color = 'blue', conHora = true, detalles = '' )
  {      
    if( ( typeof fecha === "string" && !fecha ) || ( typeof fecha === "object" && !fecha.getTime() )  ) return 
    const evento      = {}
    evento.id         = eventos.value.length + 1
    evento.type       = 0
    evento.allDay     = false
    evento.date       = typeof fecha === "string" ? fecha : ToolDate.fechaCorta( fecha )
    if(conHora && typeof fecha === "object")
      evento.hora     = ToolDate.horaAmPm( fecha )
    evento.titulo     = titulo
    evento.color      = color
    evento.detalles   = detalles
    eventos.value.push( evento )
  }
</script>

<template>
  <ventana                    cerrar
    :titulo                   ="'Calendario del ' + acuerdo.label"
    icono                     ="mdi-calendar-month"
    class-contenido           ="column items-center"
    style                     ="max-width: 1200px;"
    min-width                 ="1200px"
    >
    <div  class               ="row items-center">
      <q-btn
        v-bind                ="style.btnRedondoFlatMd"
        icon                  ="mdi-chevron-left"
        @click                ="calendario.prev()"
      /> 
      <div class              ="text-capitalize text-1_4em ">
        {{ mesSeleccionado }}
      </div>
      <q-btn
        v-bind                ="style.btnRedondoFlatMd"
        icon                  ="mdi-chevron-right"
        @click                ="calendario.next()"
      />       
    </div>
    <q-calendar-month         no-active-date focusable hoverable
      v-model                 ="selectedDate"
      ref                     ="calendario"
      locale                  ="es"
      :day-min-height         ="80"
      :weekdays               ="[1,2,3,4,5,6,0]"
      >
      <template #day          ="{ scope }">
        <template
          v-for               ="event in getEvents(scope.timestamp)"
          :key                ="event.time"
          >
          <div
            class             ="radius-6 text-white q-px-sm q-mx-sm mi-event text-0_9em"
            :class            ="'bg-' + event.color"
            >
            {{ event.titulo + ( !!event.hora ? ' ' + event.hora : '' )  }}
            <Tooltip
              v-if            ="!!event.detalles"
              :label          ="event.detalles"
            />
          </div>
          </template>
      </template>
    </q-calendar-month>
  </ventana>
</template>

<style scoped>
.mi-event{
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>