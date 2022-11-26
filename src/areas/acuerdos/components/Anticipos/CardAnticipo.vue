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
          <div class      ="text-0_9em text-grey-9">            
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
            class             ="col-4 op60 op100-hover"
            label             ="Recibo"
            @click.stop       ="emit('clickRecibo',   modelValue)"
            >
            <Tooltip label    ="Generar recibo de caja"/>
          </q-btn>          
          <q-btn              flat dense rounded no-caps
            v-for             ="(item, tipo) of [ { file: modelValue.fileCliente, tipo: 'cliente', class: 'col-2', label: ''          },
                                                  { file: modelValue.fileInterno, tipo: 'interno', class: 'col-6', label: 'Soporte'     }]"
            padding           ="none"
            class             ="op80 op100-hover"            
            :key              ="tipo"
            :label            ="item.label"
            :icon             ="!item.file.size ? 'mdi-form-dropdown' : 'mdi-file-eye'"
            :color            ="!item.file.size ? 'grey-6' : 'primary'"
            :class            ="item.class"
            @click.stop       ="  !item.file.size
                                    ? emit('clickAnticipo',   modelValue)
                                    : emit('clickVerArchivo', item.file )
                                "
            >
            <Tooltip :label   ="(!item.file.size ? 'Seleccionar' : 'Ver') + ' comprobante de ' + item.tipo"/>
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
  import {  IArchivo            } from "src/models/Archivo"


  const props                 = defineProps({      
    modelValue: { required: true,  type: Object as PropType< IAnticipo >  },
  })

  const emit                  = defineEmits<{
    (e: "clickVerArchivo",  value: IArchivo           ): void
    (e: "clickAnticipo",    value: IAnticipo          ): void
    (e: "clickRecibo",      value: IAnticipo          ): void
  }>()

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
