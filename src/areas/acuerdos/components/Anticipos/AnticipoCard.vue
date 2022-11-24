<template>
  <div
    class                 ="q-pa-xs col-6"
    >
    <q-card
      class               ="card-anticipo cursor-pointer"
      @click              ="emit('clickAnticipo', anticipo)"
      >
      <q-card-section
        class             ="row items-center q-pa-xs"
        >
        <div class        ="col-2">
          <q-icon            
            size          ="sm"
            :name         ="anticipo.estadoIcono"
            :color        ="anticipo.estadoColor"
            >
            <Tooltip>{{anticipo.estadoLabel}}</Tooltip>
          </q-icon>
        </div> 
        <div class        ="col-2">
          <img :src       ="anticipo.cuenta.imagenUrl" width="32" height="32"/>
          <Tooltip :label ="anticipo.cuenta.label"/>
        </div>
        <div class        ="col-8 text-right fuente-mono text-bold">
          <div
            class         ="text-1_2em "
            :class        ="anticipo.tipo === 1 ? 'text-indigo-9' : 'text-deep-orange'"
            >
            {{ anticipo.valorLabel }}
          </div>
          <div class      ="text-0_9em text-grey-9">            
            <q-badge      rounded
              v-if        ="!!anticipo.nota"
              color       ="red"
              label       ="📄1"
            />            
            {{ anticipo.fechaPago }}
          </div>
          <Tooltip>
            <div 
              v-if        ="!!anticipo.nota"
              style       ="max-width: 220px"
              >
              <b>Nota:</b> {{anticipo.nota}}
            </div>
            {{anticipo.tipoLabel}} por {{anticipo.valorLabel}}<br/>
            Estado: {{anticipo.estadoLabel}}<br/>
            {{anticipo.cuenta.label}}<br/>
          </Tooltip>
        </div>
      </q-card-section>
      <q-separator />
      <div
        class                 ="q-pa-sm full-width row"
        style                 ="min-height: 40px;"
        >
          <q-btn              flat dense rounded no-caps
            :icon             ="!anticipo.fileCliente.size ? 'mdi-file-upload' : 'mdi-file-eye'"
            label             ="👤"
            padding           ="none"
            class             ="op60 op100-hover col-4"
            @click.stop       ="  !anticipo.fileInterno.size
                                    ? emit('clickSubir',      'cliente')
                                    : emit('clickVerArchivo', anticipo.fileInterno )
                                "
            >
            <Tooltip :label   ="(!anticipo.fileInterno.size ? 'Subir' : 'Ver') + ' comprobante de cliente'"/>
          </q-btn>
          <q-btn              flat dense rounded no-caps
            label             ="Soporte"
            :icon             ="!anticipo.fileInterno.size ? 'mdi-file-upload' : 'mdi-file-eye'"
            padding           ="none"
            class             ="op60 op100-hover col-8"
            @click.stop       ="  !anticipo.fileInterno.size
                                    ? emit('clickSubir',     'interno')
                                    : emit('clickVerArchivo', anticipo.fileInterno )
                                "
            >
            <Tooltip :label   ="(!anticipo.fileInterno.size ? 'Subir' : 'Ver') + ' comprobante de interno'"/>
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
    anticipo: { required: true,  type: Object as PropType< IAnticipo >  },
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
