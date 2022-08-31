<template>
  <q-input                      dense hide-bottom-space
    ref                         ="input"
    v-model                     ="modelo"
    mask                        ="date"
    :label                      ="label"
    :readonly                   ="readonly"
    :class                      ="{'campo-hundido' : hundido}"
    :filled                     ="!hundido"
    :borderless                 ="!hundido"     
    :clearable                  ="clearable"
    @blur                       ="blurInputText"
    @update:model-value         ="cambioInputText"
    >
    <template                   #append>
      <span class               ="text-subtitle2">
        <slot></slot>
      </span>
      <q-icon
        name                    ="mdi-calendar"
        :class                  ="{'cursor-pointer' : !readonly}"
        >
        <q-popup-proxy          cover 
          v-if                  ="!readonly"
          ref                   ="qDateProxy"
          v-model               ="popupOk"
          :persistent           ="loading"
          transition-show       ="scale"
          transition-hide       ="scale"
          @before-hide          ="asignarModelValueAModelo"
          >
          <q-date               today-btn
            v-model             ="modelo"
            :subtitle           ="(!!titulo ? titulo + ' ' : '') + modelo"
            :options            ="fechaCumpleCriterios"
            :events             ="[desdeConFormato, hastaConFormato]"
            @update:model-value ="cambiarFecha"
            >            
            <div class          ="row items-center justify-end q-gutter-sm">
              <q-btn            v-close-popup rounded flat
                label           ="Cancelar"
                color           ="primary"
              />
              <q-btn            v-close-popup rounded
                label           ="Guardar"
                color           ="primary"
                @click          ="emitir"
              />
            </div>
            <q-inner-loading
              label             ="Cambiando fecha"
              :showing          ="loading"
              >
              <q-spinner-dots
                size            ="50px"
                color           ="primary"
              />
            </q-inner-loading>                  
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
    <Tooltip v-if               ="!!modelValue.valueOf()">
      {{modelValue.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}}
    </Tooltip> 
  </q-input>  
</template>
<script setup lang="ts">
  //:rules                      ="['date']"
  import {  ref,
            toRefs,
            watch
                            } from "vue"
  import {  date, debounce  } from 'quasar'         
  import {  useTools        } from "src/useSimpleOk/useTools"                   

  const hoy                   = date.formatDate(Date.now(), 'YYYY/MM/DD')
  const desdeConFormato       = ref<string>("") // 'YYYY/MM/DD' 
  const hastaConFormato       = ref<string>("") // 'YYYY/MM/DD'
  const diasConFormato        = ref<string>("") // 'YYYY/MM/DD'

  const emit                  = defineEmits(["update:model-value"])
  const props                 = defineProps({
    modelValue: { default: "",        type: [Date, String] },
    desde:      { default: "",        type: [Date, String] },
    hasta:      { default: "",        type: [Date, String] },
    label:      { default: "",        type: String  },
    readonly:   { default: false,     type: Boolean },
    loading:    { default: false,     type: Boolean },
    titulo:     { default: "",        type: String  },
    diasValidos:{ default: 0,         type: Number  },
    noPasado:   { default: false,     type: Boolean },
    noFuturo:   { default: false,     type: Boolean },
    hundido:    { default: false,     type: Boolean },
    clearable:  { default: false,     type: Boolean },
  })
  const { modelValue,
          loading,
          diasValidos,
          noPasado,
          noFuturo,
          desde,
          hasta,
                      } = toRefs( props )
  const modelo          = ref<string | undefined> ( "" )
  const popupOk         = ref<boolean>(false)
  const { aviso       } = useTools()
  let   fechaTem        : Date 
  const input           = ref<any>({})
  const avisoRangoOut   = debounce (()=>aviso("negative", "Fecha fuera de rango","clock"), 300)
  const emitir          = ()=> emit("update:model-value", fechaTem)
  const getFechaLimpia  = ()=> typeof modelo.value === "string" ? modelo.value : ""
  


  watch(modelValue, (newDate) => {
    asignarModelValueAModelo()
  },
  { immediate: true}
  )

  watch(loading,    (newLoading)  => { if(!newLoading) popupOk.value = false})
  watch(desde,      (newDesde)    => desdeConFormato.value  = formatoFecha(newDesde))
  watch(hasta,      (newHasta)    => hastaConFormato.value  = formatoFecha(newHasta))
  watch(diasValidos,(dias)        => {
    diasConFormato.value = getFechaLimiteFormato(dias)

    function getFechaLimiteFormato( numeroDias : number ) : string {
      if(numeroDias < 1) return ""
      const fechaCalculada  = diasValidos.value > 0
                              ? date.addToDate        (new Date(), { days: diasValidos.value })
                              : date.subtractFromDate (new Date(), { days: -diasValidos.value }) 
      return date.formatDate(fechaCalculada.valueOf(), 'YYYY/MM/DD')
    }
  })



  function cambiarFecha( value : any, reason : any, details : any )
  {
    if(reason === "add-day")
      fechaTem          = new Date(details.year, details.month-1, details.day)
  }



  function asignarModelValueAModelo() {
    modelo.value        = !!modelValue.value.valueOf() ? date.formatDate(modelValue.value, 'YYYY/MM/DD') : undefined
  }

  function fechaCumpleCriterios ( fechaI : string ) : boolean
  {
    let fechaCumple       = true

    if
    (
      (noPasado.value           && fechaI < hoy)
      ||
      (noFuturo.value           && fechaI > hoy)
      ||
      (!!desdeConFormato.value  && fechaI < desdeConFormato.value)
      ||
      (!!hastaConFormato.value  && fechaI > hastaConFormato.value)
      ||
      (!!diasConFormato.value   && fechaI <= diasConFormato.value)
    )
      fechaCumple         = false
      
    return fechaCumple    
  }

  function formatoFecha( fechaFomatear : Date | string) : string {
    let fecha           = new Date()
    let fechaFormateada = ""
    if(fechaFomatear instanceof Date)
      fecha             =  fechaFomatear
    else if(!!fechaFomatear)
      fecha = new Date(fechaFomatear)

    if(!!fechaFomatear && !isNaN(fecha.valueOf()))
      fechaFormateada   = date.formatDate(fecha, 'YYYY/MM/DD')

    return fechaFormateada  
  }

  function cambioInputText()
  {
    const dateTxt     = getFechaLimpia()

    if(!dateTxt) {
      fechaTem        = new Date('')
      emitir()
      return
    }
    if(dateTxt.length != 10 ) return // Solo acepta el formato YYYY/MM/DD
    
    if( fechaCumpleCriterios(dateTxt) )
    {
      fechaTem        = new Date( Date.parse(dateTxt) )
      emitir()
    }
    else{
      limipiarModelo()
    }
  }

  function blurInputText()
  {
    const dateTxt     = getFechaLimpia()
    
    if(!!dateTxt && dateTxt.length < 10 ) // Solo acepta el formato YYYY/MM/DD
    {
      limipiarModelo()
    }
  }

  

  function limipiarModelo()
  {
    
    input.value.blur()
    avisoRangoOut()
    setTimeout(asignarModelValueAModelo, 300)
  }

</script>