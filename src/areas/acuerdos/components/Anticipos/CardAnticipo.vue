<template>
  <div
    class                 ="q-pa-xs col-6"
    >
    <q-card
      class               ="card-anticipo cursor-pointer"
      @click              ="emit('clickAnticipo', modelValue)"
      >
      <q-card-section
        class             ="row items-center q-pa-xs"
        >
        <div class        ="col-2">
          <q-icon            
            size          ="sm"
            :name         ="modelValue.estadoIcono"
            :color        ="modelValue.estadoColor"
            >
            <Tooltip>{{modelValue.estadoSelect.label}}</Tooltip>
          </q-icon>
        </div> 
        <div class        ="col-2">
          <img :src       ="modelValue.cuenta.imagenUrl" width="32" height="32"/>
          <Tooltip :label ="modelValue.cuenta.label"/>
        </div>
        <div class        ="col-8 text-right fuente-mono text-bold">
          <div
            class         ="text-1_2em "
            :class        ="modelValue.tipoSelect.value === 1 ? 'text-indigo-9' : 'text-deep-orange'"
            >
            {{ modelValue.valorLabel }}
          </div>
          <div class      ="text-0_8em text-grey-9">            
            <q-badge      rounded
              v-if        ="!!modelValue.nota"
              color       ="red"
              label       ="📄1"
            />            
            {{ modelValue.fechaPagoString }}
          </div>
          <Tooltip>
            <div 
              v-if        ="!!modelValue.nota"
              style       ="max-width: 220px"
              >
              <b>Nota:</b> {{modelValue.nota}}
            </div>
            {{modelValue.tipoSelect.label}} por {{modelValue.valorLabel}}<br/>
            Estado: {{modelValue.estadoSelect.label}}<br/>
            {{modelValue.cuenta.label}}<br/>
          </Tooltip>
        </div>
      </q-card-section>
      <q-separator />
      <div
        class                 ="q-pa-sm full-width row"
        style                 ="min-height: 40px;"
        >        
          <q-btn              flat dense rounded no-caps
            padding           ="none"
            class             ="col-2 op60 op100-hover"            
            icon              ="mdi-printer"
            @click.stop       ="emit('clickRecibo',   modelValue)"
            >
            <Tooltip label    ="Generar recibo de caja"/>
          </q-btn>          
          <q-btn              flat dense rounded no-caps
            v-for             ="(item, index) of [{ file: modelValue.fileCliente, tipo: 'Cliente', class: 'col-5', label: ''          },
                                                  { file: modelValue.fileInterno, tipo: 'Interno', class: 'col-5', label: 'Soporte'     }]"
            padding           ="none"
            class             ="op80 op100-hover"            
            :key              ="index"
            :label            ="item.tipo"
            :icon             ="!!item.file.name ? 'mdi-magnify-plus'
                                  : item.tipo === 'Interno' ? 'mdi-bank'
                                  : 'mdi-account-cash'"
            :color            ="!item.file.name ? 'grey-6' : 'primary'"
            :class            ="item.class"
            @click.stop       ="  !item.file.name
                                    ? emit('clickAnticipo',   modelValue)
                                    : enviarArchivoVer(item.file)
                                "
            >
            <Tooltip :label   ="(!item.file.name ? 'Seleccionar' : 'Ver') + ' comprobante de ' + item.tipo"/>
          </q-btn>        
      </div>
    </q-card>
  </div>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  PropType            } from "vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAnticipo,
            TTipoFileAnticipo   } from "src/areas/acuerdos/models/Anticipo"  
  import {  IArchivo, Archivo   } from "src/models/Archivo"


  const props                 = defineProps({      
    modelValue: { required: true,  type: Object as PropType< IAnticipo >  },
  })

  const emit                  = defineEmits<{
    (e: "clickVerArchivo",  value: IArchivo           ): void
    (e: "clickAnticipo",    value: IAnticipo          ): void
    (e: "clickRecibo",      value: IAnticipo          ): void
  }>()

  function enviarArchivoVer( file : IArchivo ){
    const archivoEnviar = Object.assign( new Archivo(), file)
    emit('clickVerArchivo', archivoEnviar)
  }

</script>
<style>
  .card-anticipo{
    border-radius: 6px;
    transition: box-shadow 0.3s ease-in-out;
  }

  .card-anticipo:hover {
    box-shadow: 0 7px 16px 0 rgb(0 0 0 / 20%), 0 1px 3px 0 rgba(95, 83, 83, 0.1);
    background-color: rgb(245, 245, 255);
  }
</style>
