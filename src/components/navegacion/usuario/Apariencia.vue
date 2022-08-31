<template>
  <ventana                      cerrar
    titulo                      ="Apariencia"
    icono                       ="mdi-palette"
    class-contenido             ="column items-center"
    :width                      ="250"
    >
    <!-- //?* ////////////////////////////////////////////////////////////// Seleccion de fondo --> 
    <q-select                   filled
      v-model                   ="fondo"
      label                     ="Fondo"
      class                     ="full-width q-my-xs"
      color                     ="primary"
      options-selected-class    ="text-weight-bold"
      :options                  ="fondos"
      @update:model-value       ="cambiarFondo($event)"
      >
      <!-- //?* ///////////////////////////////////////////////////////////// Icono fondo --> 
      <template #prepend>
        <q-icon name            ="mdi-image" />
      </template>
      <!-- //?* ///////////////////////////////////////////////////////////// Item fondo --> 
      <template #option   ="scope">
        <q-item v-bind          ="scope.itemProps">
          <q-item-section       avatar>
            <q-img :src         ="'images/fondos/' + scope.opt.src"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <!-- //?* ////////////////////////////////////////////////////////////// Seleccion de patron --> 
    <q-select                   filled
      v-model                   ="patron"
      label                     ="Patron"
      class                     ="full-width q-my-xs"
      color                     ="primary"
      :options                  ="patrones"
      options-selected-class    ="text-weight-bold"
      @update:model-value       ="cambiarPatron($event)"
      >
      <!-- //?* ///////////////////////////////////////////////////////////// Icono fondo --> 
      <template #prepend>
        <q-icon name            ="mdi-image" />
      </template>
      <!-- //?* ///////////////////////////////////////////////////////////// Item fondo --> 
      <template #option   ="scope">
        <q-item v-bind          ="scope.itemProps">
          <q-item-section       avatar>
            <q-img :src         ="'images/patrones/' + scope.opt.src"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <!-- //?* //////////////////////////////////////////////////////////////// Color --> 
    <q-color                    no-header no-footer 
      class                     ="full-width q-my-xs"
      v-model                   ="color"
      @change                   ="cambiarColorPrimario($event)"
    />

  </ventana>
</template>

<script setup lang="ts">
  import {  ref                   } from 'vue'
  import {  setCssVar,
            useQuasar             } from 'quasar'
  import {  useStoreUser          } from 'src/stores/user'
  import {  ALMACEN_LOCAL         } from "src/models/TiposVarios"
  import    ventana                 from "components/utilidades/Ventana.vue"

  const { addressbarColor         } = useQuasar()
  const storeUser                   = useStoreUser()
  const pre                         = process.env.PREFIJO

  interface imagenModelo {
    label:  string;
    value:  string;
    src:    string;
  }

  const fondos :imagenModelo[]= [
    { label: 'Dream',       value: 'Dream.webp',       src: 'Dream_mini.webp',     },
    { label: 'Abstracto',   value: 'Abstracto.webp',   src: 'Abstracto_mini.webp', },
    { label: 'Amanecer',    value: 'Amanecer.webp',    src: 'Amanecer_mini.webp',  },
    { label: 'Aurora',      value: 'Aurora.webp',      src: 'Aurora_mini.webp',    },
    { label: 'Celeste',     value: 'Celeste.webp',     src: 'Celeste_mini.webp',   },
    { label: 'Ciervo',      value: 'Ciervo.webp',      src: 'Ciervo_mini.webp',    },
    { label: 'Dulce',       value: 'Dulce.webp',       src: 'Dulce_mini.webp',     },
    { label: 'Escalera',    value: 'Escalera.webp',    src: 'Escalera_mini.webp',  },
    { label: 'Fox',         value: 'Fox.webp',         src: 'Fox_mini.webp',       },
    { label: 'Ilusion',     value: 'Ilusion.webp',     src: 'Ilusion_mini.webp',   },
    { label: 'Lago',        value: 'Lago.webp',        src: 'Lago_mini.webp',      },
    { label: 'Nevado',      value: 'Nevado.webp',      src: 'Nevado_mini.webp',    },
    { label: 'Pinos',       value: 'Pinos.webp',       src: 'Pinos_mini.webp',     },
    { label: 'Play',        value: 'Play.webp',        src: 'Play_mini.webp',      },
    { label: 'Suave',       value: 'Suave.webp',       src: 'Suave_mini.webp',     },
  ]

  const patrones :imagenModelo[]= [
    { label: 'Abstracto',   value: 'Abstracto.png',    src: 'Abstracto_mini.png',   },
    { label: 'Carbon',      value: 'Carbon.png',       src: 'Carbon_mini.png',      },
    { label: 'Digital',     value: 'Digital.png',      src: 'Digital_mini.png',     },
    { label: 'Losas',       value: 'Losas.png',        src: 'Losas_mini.png',       },
    { label: 'Madera',      value: 'Madera.png',       src: 'Madera_mini.png',      },
    { label: 'Sumas',       value: 'Sumas.png',        src: 'Sumas_mini.png',       },
    { label: 'Tela',        value: 'Tela.png',         src: 'Tela_mini.png',        },
  ]

  const color                   = ref < string >        ("#1976D2")
  const fondo                   = ref < imagenModelo >  ({ label: 'Seleccionar', value: '', src: ''}) as any
  const patron                  = ref < imagenModelo >  ({ label: 'Seleccionar', value: '', src: ''}) as any

  function cambiarColorPrimario( color :string ) :void
  {
    setCssVar('primary', color)
    localStorage.setItem( pre + ALMACEN_LOCAL.COLOR, color)
    addressbarColor.set(color)
  }

  function cambiarFondo( fondo: imagenModelo )
  {
    localStorage.setItem(pre + ALMACEN_LOCAL.FONDO, fondo.value)
    storeUser.setFondo(fondo.value)    
  }

  function cambiarPatron( patron: imagenModelo )
  {
    localStorage.setItem(pre + ALMACEN_LOCAL.PATRON, patron.value)
    storeUser.patron = patron.value    
  }
</script>