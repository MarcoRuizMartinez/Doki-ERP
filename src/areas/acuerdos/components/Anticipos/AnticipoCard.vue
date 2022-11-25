<template>
  <div
    class                 ="q-pa-xs col-6"
    >
    <q-card
      class               ="card-anticipo cursor-pointer"
      @click              ="emit('clickAnticipo', anticipoI)"
      >
      <q-card-section
        class             ="row items-center q-pa-xs"
        >
        <div class        ="col-2">
          <q-icon            
            size          ="sm"
            :name         ="anticipoI.estadoIcono"
            :color        ="anticipoI.estadoColor"
            >
            <Tooltip>{{anticipoI.estadoLabel}}</Tooltip>
          </q-icon>
        </div> 
        <div class        ="col-2">
          <img :src       ="anticipoI.cuenta.imagenUrl" width="32" height="32"/>
          <Tooltip :label ="anticipoI.cuenta.label"/>
        </div>
        <div class        ="col-8 text-right fuente-mono text-bold">
          <div
            class         ="text-1_2em "
            :class        ="anticipoI.tipo === 1 ? 'text-indigo-9' : 'text-deep-orange'"
            >
            {{ anticipoI.valorLabel }}
          </div>
          <div class      ="text-0_9em text-grey-9">            
            <q-badge      rounded
              v-if        ="!!anticipoI.nota"
              color       ="red"
              label       ="📄1"
            />            
            {{ anticipoI.fechaPago }}
          </div>
          <Tooltip>
            <div 
              v-if        ="!!anticipoI.nota"
              style       ="max-width: 220px"
              >
              <b>Nota:</b> {{anticipoI.nota}}
            </div>
            {{anticipoI.tipoLabel}} por {{anticipoI.valorLabel}}<br/>
            Estado: {{anticipoI.estadoLabel}}<br/>
            {{anticipoI.cuenta.label}}<br/>
          </Tooltip>
        </div>
      </q-card-section>
      <q-separator />
      <div
        class                 ="q-pa-sm full-width row"
        style                 ="min-height: 40px;"
        >
          <q-btn              flat dense rounded no-caps
            :icon             ="!anticipoI.fileCliente.size ? 'mdi-file-upload' : 'mdi-file-eye'"
            label             ="👤"
            padding           ="none"
            class             ="op60 op100-hover col-4"
            @click.stop       ="  !anticipoI.fileInterno.size
                                    ? emit('clickSubir',      'cliente')
                                    : emit('clickVerArchivo', anticipoI.fileInterno )
                                "
            >
            <Tooltip :label   ="(!anticipoI.fileInterno.size ? 'Subir' : 'Ver') + ' comprobante de cliente'"/>
          </q-btn>
          <q-btn              flat dense rounded no-caps
            label             ="Soporte"
            :icon             ="!anticipoI.fileInterno.size ? 'mdi-file-upload' : 'mdi-file-eye'"
            padding           ="none"
            class             ="op60 op100-hover col-8"
            @click.stop       ="  !anticipoI.fileInterno.size
                                    ? emit('clickSubir',     'interno')
                                    : emit('clickVerArchivo', anticipoI.fileInterno )
                                "
            >
            <Tooltip :label   ="(!anticipoI.fileInterno.size ? 'Subir' : 'Ver') + ' comprobante de interno'"/>
          </q-btn>
      </div>
    </q-card>
  </div>
</template>
<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////////////////// Core
  import {  PropType            } from "vue"
  //* /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                            
  import {  useStoreAcuerdo     } from 'stores/acuerdo'
  // * /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAnticipo,
            TTipoFileAnticipo   } from "src/areas/acuerdos/models/Anticipo"  
  import {  IArchivo            } from "src/models/Archivo"

  const { anticipo          } = storeToRefs( useStoreAcuerdo() ) 
  const props                 = defineProps({      
    anticipoI: { required: true,  type: Object as PropType< IAnticipo >  },
  })

  const emit                  = defineEmits<{
    (e: "clickVerArchivo",  value: IArchivo           ): void
    (e: "clickAnticipo",    value: IAnticipo          ): void
    (e: "clickSubir",       value: TTipoFileAnticipo  ): void
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
