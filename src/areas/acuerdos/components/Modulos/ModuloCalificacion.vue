<template>
  <ventana                    minimizar
    titulo                    ="Encuesta a cliente"
    icono                     ="mdi-star"    
    :cargando                 ="loading.calificacion"
    >
    <template                 #menu>
      <div class              ="row justify-between full-width">
      <!-- //* ///////////////////////////////////////////////////////////// Comprobante interno -->
        <select-label-value   no-loading
          v-model             ="acuerdo.calificacion.file"
          label               ="Registro"
          icon                ="mdi-clipboard-list"
          class               ="col-10 campo-hundido"
          :options            ="acuerdo.archivosVisor"
          @update:model-value ="acuerdo.calificacion.f.filename = acuerdo.calificacion.file.value"
        />
        <div class            ="col-auto q-mt-sm q-ml-sm">
          <btn-visualizar            
            :disable          ="!acuerdo.calificacion.file.label"
            :archivo          ="acuerdo.calificacion.file" 
          />
          <btn-nota
            class             ="q-ml-sm"
            v-model           ="acuerdo.calificacion.f.detalles"
            label             ="apuntes de encuesta"
            :loading          ="loading.calificacion"
          />
        </div>
      </div>
    </template>
    <div class                ="row justify-between items-center q-ml-md">
      <div class              ="row col-8 items-center califi">
        <span class           ="col-4">Atención:</span>
        <q-rating             no-reset
          v-model             ="acuerdo.calificacion.f.nota_atencion"
          v-bind              ="estiloStar"
        />
        <span class           ="col-4">Calidad:</span>      
        <q-rating             no-reset
          v-model             ="acuerdo.calificacion.f.nota_calidad"
          v-bind              ="estiloStar"
        />
        <span class           ="col-4">Precio:</span>
        <q-rating             no-reset
          v-model             ="acuerdo.calificacion.f.nota_precio"
          v-bind              ="estiloStar"
        />
        <span class           ="col-4">Tiempos:</span>
        <q-rating             no-reset
          v-model             ="acuerdo.calificacion.f.nota_tiempos"
          v-bind              ="estiloStar"
        />
      </div>
      <div class              ="col-4 text-center">
        <q-knob               show-value readonly
          v-model             ="promedio"
          :min                ="1"
          :max                ="5"          
          size                ="80px"
          :thickness          ="0.2"
          color               ="primary"
          track-color         ="grey-3"
          class               =""
        />
        <span>Promedio</span>
        <div>
          <chip-usuario
            :usuario          ="acuerdo.calificacion.editor"
          />
          <Tooltip>
            <div class       ="text-center">
              Editado por {{ acuerdo.calificacion.editor.nombre }}<br/>
              {{ fechaCorta( acuerdo.calificacion.fecha_edicion ) }}
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  </ventana>
</template>
<script setup lang="ts">
  import {  ref,
            watch,
            watchEffect         } from "vue"
  //* ///////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                            
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'  
  import {  useStoreUser        } from 'src/stores/user'
  import {  Archivo             } from "src/models/Archivo"
  //* ///////////////////////////////////////////////////////////////////////////// Componibles  
  import {  useControlAcuerdo   } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  fechaCorta          } from "src/useSimpleOk/useTools"  
  //* ///////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"
  import    selectLabelValue      from "components/utilidades/select/SelectLabelValue.vue"
  import    btnVisualizar         from "components/archivos/BtnVisualzarArchivo.vue"
  import    btnNota               from "components/utilidades/BtnNota.vue"
  import    chipUsuario           from "src/areas/usuarios/components/ChipUsuario.vue"

  const { usuario             } = storeToRefs( useStoreUser() )    
  const { acuerdo, loading    } = storeToRefs( useStoreAcuerdo() )  
  const { editarCrearCalificacion
                              } = useControlAcuerdo()
  const promedio                = ref<number>(0)

  const estiloStar = {
    noReset       : true,          
    class         : "col-8",
    size          : "2.3em",
    color         : "amber-6",
    icon          : "mdi-star-outline",
    iconSelected  : "mdi-star",
  }
  watch(  ()=> acuerdo.value.calificacion.f, // cambio en los campos
          async ()=>{
            if(!acuerdo.value.calificacion.esValida) return
            promedio.value = acuerdo.value.calificacion.promedio
            await editarCrearCalificacion( usuario.value.id )
          },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
          { deep: true }
  )

  watchEffect(()=>{
    if(!acuerdo.value.archivos.length || !acuerdo.value.calificacion.id ) return
    const name                      = acuerdo.value.calificacion.f.filename 
    acuerdo.value.calificacion.file = acuerdo.value.archivos.find( a => a.value === name ) ?? new Archivo()    
  })

</script>
<style>
.califi > span {
  font-weight: bold;
  color: #9e9e9e;
  font-size: 1.1em;
  text-transform: uppercase;
}
</style>