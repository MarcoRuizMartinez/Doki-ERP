<template>
  <q-page               padding
    class               ="column item-stretch content-start justify-start gap-md"
    >
    <panel
      :titulo           ="titulo"
      >
      <q-btn-toggle     dense no-caps spread stretch 
        v-model         ="filtroArea"
        toggle-color    ="primary"
        :options        ="areas"
      />
      <q-btn-toggle     dense push no-caps spread stretch 
        v-model         ="filtroEstado"
        toggle-color    ="primary"
        :options        ="estado"
      />
    </panel>

    <panel
      v-if              ="!!sistemas.length"
      >
      <time-line
        titulo          ="Sistemas"
        :linea-tiempo   ="sistemas"
      />
    </panel>
    <panel
      v-if              ="!!administracion.length"
      >
      <time-line
        titulo          ="Administración"
        :linea-tiempo   ="administracion"
      />
    </panel>
    <panel
      v-if              ="!!productos.length"
      >
      <time-line
        titulo          ="Productos"
        :linea-tiempo   ="productos"
      />
    </panel>
    <panel
      v-if              ="!!marketing.length"
      >
      <time-line
        titulo          ="Marketing"
        :linea-tiempo   ="marketing"
      />
    </panel>
  </q-page>
</template>
<script setup lang="ts">
  import {  computed,
            onMounted,
            ref               } from 'vue'
  import {  useTitle          } from "@vueuse/core"
  import {  Objetivo,
            IObjetivo         } from "src/areas/empresa/models/HojaRutaAirTable"
  import    panel               from "components/utilidades/Panel.vue"
  import    timeLine            from "components/utilidades/TimeLine.vue"
  import {  useFetch          } from "src/useSimpleOk/useFetch"         
  import {  ILabelValue       } from "src/models/TiposVarios"

  const { miFetch             } = useFetch()
  const objetivos               = ref < IObjetivo[]  >([])
  const titulo                  = "🛣️ Hoja de ruta 2022"
  const title                   = useTitle(titulo)
  const areas :ILabelValue[]    = [
    { label: "Todos",           value:"todos" },
    { label: "Sistemas",        value:"sistemas" },
    { label: "Administración",  value:"administracion" },
    { label: "Productos",       value:"productos" },
    { label: "Marketing",       value:"marketing" },
  ]
  const estado :ILabelValue[]   = [
    { label: "Todos",          value:"todos" },
    { label: "🚴 Trabajando",  value:"🚴 Trabajando" },
    { label: "⏭️ Siguiente",   value:"⏭️ Siguiente" },
    { label: "🎯 Espera",      value:"🎯 Espera" },
    { label: "✅ Terminado",   value:"✅ Terminado" },
  ]

  const filtroArea              = ref < string >(areas [0].value)
  const filtroEstado            = ref < string >(estado[0].value)
  const sistemas                = computed(()=>objetivos.value.filter(o => o.area === "1. Sistemas"       && (filtroArea.value === "sistemas"       || filtroArea.value === "todos") && (filtroEstado.value === "todos" || o.estado === filtroEstado.value) ))
  const productos               = computed(()=>objetivos.value.filter(o => o.area === "2. Productos"      && (filtroArea.value === "productos"      || filtroArea.value === "todos") && (filtroEstado.value === "todos" || o.estado === filtroEstado.value) ))
  const marketing               = computed(()=>objetivos.value.filter(o => o.area === "3. Marketing"      && (filtroArea.value === "marketing"      || filtroArea.value === "todos") && (filtroEstado.value === "todos" || o.estado === filtroEstado.value) ))
  const administracion          = computed(()=>objetivos.value.filter(o => o.area === "4. Administración" && (filtroArea.value === "administracion" || filtroArea.value === "todos") && (filtroEstado.value === "todos" || o.estado === filtroEstado.value) ))

  onMounted(async ()=>{
    const { ok, data }           = await miFetch(  process.env.URL_DOLIBARR + "/_maco/webservices/listas/airTable_hojaRuta.php",
                                                  { method:   "GET" },
                                                  { mensaje:  "cargando hoja de ruta" }
                                                )
    if(ok)
    {
      objetivos.value             = Objetivo.ItemsAirTableToObjetivos( data )
    }
  })
</script>