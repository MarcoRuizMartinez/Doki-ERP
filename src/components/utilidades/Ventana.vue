<template>
  <!-- no-scroll -->
  <div  
    class                     ="ventana transi no-scroll"
    :class                    ="[ maximizado ? classMaximizado : classRestaurado,
                                  { 'ventana-sombra' : !sinSombra }
                                ]"
    >
    <q-card
      :style                  ="estiloAncho"
      class                   ="clase-ventana"
      style                   ="height: 100%;"
      > <!-- //?* class ="miCard shadow-5" :class="clase"  --> 
      <!-- //?* //////////////////////////////////////////////////////////////// Barra superior justify-between --> 
      <q-card-section  
        v-if                  ="!sinTitulo"
        class                 ="row justify-between items-center text-white q-py-sm bg-primary"
        :style                ="fondoBarra"
        >
        <!-- //?* ////////////////////////////////////////////////////////////// Titulo --> 
        <div
          class               ="text-titulo text-1_2em el-md op80 op100-hover fuente-delicada ellipsis"
          :class              ="classTitulo"
          >
          <q-icon
            v-if              ="icono != undefined"
            class             ="q-mr-sm"
            size              ="md"
            :name             ="icono"
          />
          <!-- //?* ////////////////////////////////////////////////////////////// Slot Titulo --> 
          <slot name          ="titulo">
            <router-link
              v-if            ="!!linkTitulo"
              class           ="link-limpio text-white"
              :to             ="linkTitulo"
              >
              {{ titulo }}            
            </router-link>
            <span             v-else>
              {{ titulo }}
            </span>
          </slot>
        </div>
        <slot                 name="barra-centro"></slot>
        <div class            ="row col-auto q-gutter-xs items-center"> <!-- //?* / gap--> 
          <!-- //?* ////////////////////////////////////////////////////////////// Slot Barra --> 
          <slot               name="barra"></slot>
          <!-- //?* ////////////////////////////////////////////////////////////// Botones --> 
          <!-- <q-btn label="Prueba" @click="test()"/> -->
          <div v-if           ="minimizar">
            <q-btn            
              v-bind          ="style.btnRedondoFlat2Sm"
              :icon           ="minimizadoModel ? 'mdi-arrow-expand' : 'mdi-window-minimize'"
              @click          ="minimizadoModel = !minimizadoModel; $emit('minimizar')"
              v-touch-hold.mouse="clickLargoMinMax"
              >
              <Tooltip :label ="minimizadoModel ?  'Restaurar' : 'Minimizar'"/>
            </q-btn>
          </div>
          <div v-if           ="maximizar">
            <q-btn
              v-bind          ="style.btnRedondoFlat2Md"
              :icon           ="maximizado ? 'mdi-window-restore' : 'mdi-window-maximize'"
              @click          ="maximizado = !maximizado; $emit('maximizar')"
              >
              <Tooltip :label ="maximizado ?  'Restaurar' : 'Expandir'"/>
            </q-btn>
          </div>
          <div v-if           ="cerrar">
            <q-btn            v-close-popup dense round glossy push unelevated
              class           ="boton-ventana"
              icon            ="mdi-window-close"
              color           ="red"
              size            ="sm"
              @click          ="$emit('cerrar')"
              >
              <Tooltip label  ="Cerrar"/>
            </q-btn>
          </div>
        </div>
        
      </q-card-section>
      <!-- //?* ////////////////////////////////////////////////////////////// SLOT Menu --> 
      <q-card-actions
        v-if                  ="hayMenu || menuVisible"
        class                 ="row menu-ventana menu-gris no-wrap overflow-auto"
        :class                ="[classMenu, { 'minimizado' : minimizadoModel }]"
        >
        <slot                 name="menu">
        </slot>
      </q-card-actions>
      <!-- //?* ////////////////////////////////////////////////////////////// SLOT Default --> 
      <q-card-section
        class                 ="row items-start ventana-contenido transi"
        :class                ="[  classContenido,
                                  { 'minimizado'        : minimizadoModel },
                                  { 'full-screen'       : fullScreen      },
                                  { 'scroll q-mt-none'  : scroll          },
                                  { 'q-mt-none'         : hayAcciones     },
                                  { 'content-center'    : modo != 'normal'},
                                ]"
        :style                ="estiloCard"
        >  <!-- //?* /   :style                ="estiloAlto" :style="estiloCard" --> 
        <slot v-if            ="modo == 'normal' ">
        
        </slot>
        <div  
          v-else
          class               ="column fit justify-center items-center bg-white contenedor"
          >
          <!--  class         ="spinner" -->
          <div
            v-if              ="modo == 'buscando'"
            class             ="column items-center"
            >
            <q-spinner-dots
              color           ="grey-5"
              class           ="spiner"
              :size           ="sizeIconCarga"
            />
            <div
              v-if            ="!!mensajeCargando"
              class           ="absolute text-h6 text-grey-6 text-bold">
              {{mensajeCargando}}
            </div>
          </div>
          <q-icon
            v-else
            class             ="text-grey-5 q-mt-md size-icon"
            :name             ="modo == 'esperando-busqueda' ? 'mdi-cloud-search' : iconoSinResultados"
          />
          <div
            v-if              ="modo == 'sin-resultados'"
            class             ="text-weight-bold text-grey-14 size-text-icon text-center"
            >
            {{mensajeSinResultados}}
          </div>
        </div>
      </q-card-section>
      <!-- //?* ////////////////////////////////////////////////////////////// SLOT Menu --> 
      <q-card-actions
        v-if                  ="hayAcciones"
        class                 ="row no-wrap overflow-auto"        
        align                 ="right"
        >
        <slot                 name="acciones">
        </slot>
      </q-card-actions>
      <!-- //?* ////////////////////////////////////////////////////////////// Cargando... spinner --> 
      <q-inner-loading
        :showing              ="cargando"
        :label                ="mensajeCargando"
        >
        <q-spinner-dots size="5em" color="primary"/>
      </q-inner-loading>
    </q-card>
  </div>
</template>

<script setup lang="ts">
  import {  toRefs,
            computed, 
            PropType, 
            ref,
            watch,
            inject,
            useSlots      } from 'vue';
  import {  useStoreUser  } from 'stores/user'
  import {  TModosVentana } from "src/models/TiposVarios"
  import {  useTools      } from "src/composables/useTools"
  import {  style         } from "src/composables/useEstilos"
  const emits                   = defineEmits(["minimizar", "maximizar", "cerrar"])
  const slots                   = useSlots()
  const props                   = defineProps(
    {
      titulo:               { type: String,   default: ""                         },
      classTitulo:          { type: String,   default: "col"                      },
      linkTitulo:           { type: String,   default: undefined                  },
      cargando:             { type: Boolean,  default: false                      },
      icono:                { type: String,   default: undefined                  },
      minimizar:            { type: Boolean,  default: false                      },
      minimizado:           { type: Boolean,  default: false                      },
      maximizar:            { type: Boolean,  default: false                      },
      cerrar:               { type: Boolean,  default: false                      },
      sinTitulo:            { type: Boolean,  default: false                      },
      fullScreen:           { type: Boolean,  default: false                      },
      classContenido:       { type: String,   default: "q-pa-none"                },
      classMenu:            { type: String,   default: ""                         },
      classMaximizado:      { type: String,   default: "col-12"                   },
      classRestaurado:      { type: String,   default: ""                         },
      paddingContenido:     { type: String,   default: "8px"                      },
      sizeIconCarga:        { type: String,   default: "66vh"                     },
      sizeTextCarga:        { type: String,   default: "1.4em"                    },
      mensajeSinResultados: { type: String,   default: "Sin resultados"           },
      mensajeCargando:      { type: String,   default: ""                         },
      iconoSinResultados:   { type: String,   default: "mdi-emoticon-sad-outline" },
      backgroundColor:      { type: String,   default: "rgb(255 255 255 / 100%)"  },
      menuVisible:          { type: Boolean,  default: false                      },
      scroll:               { type: Boolean,  default: false                      },
      sinSombra:            { type: Boolean,  default: false                      },
      heightCard:           { default: 'auto',  type: [Number, String] as PropType<number | string>},
      heightCardMin:        { default: 'auto',  type: [Number, String] as PropType<number | string>},
      heightCardMax:        { default: '',      type: [Number, String] as PropType<number | string>},
      minWidth:
      {
        default:            0,
        type:               [Number, String] as PropType<number | string>
      },
      width:            
      {
        default:            0,
        type:               [Number, String] as PropType<number | string>
      },
      height:
      {
        default:            "92vh",
        type:               [Number, String] as PropType<number | string>
      },
      modo:
      {
        default:            "normal",
        type:               String as PropType< TModosVentana >,
      }
    })
  const { modo,
          width,
          height,
          minWidth,
          minimizado,
          heightCard,
          heightCardMin,
          heightCardMax,
          classContenido,
          backgroundColor,
          paddingContenido,
                            } = toRefs(props)

  const storeUser             = useStoreUser()
  const fondoBarra            = computed(() => "background-image: url('/images/patrones/"  + storeUser.patron + "') !important;")
  const hayMenu               = computed(() => slots.hasOwnProperty('menu'))
  const hayAcciones           = computed(() => slots.hasOwnProperty('acciones'))
  const altoFullScreen        = computed(() => hayMenu.value ? "87vh" : height.value )
  const backgroundColorVentana= computed(() => modo.value != "normal" ? "#FFF" : backgroundColor.value)
  const {  esMobil          } = useTools()
  const estiloCard            = computed(() =>  esMobil ? "" : `
                                                height:     ${heightCard.value};
                                                min-height: ${ minimizadoModel.value ? 'auto' : heightCardMin.value};
                                                max-height: ${heightCardMax.value};
                                                `
                                        )
  const alturaSpiner          = ref<number>(500)

  //* ///////////////////////////////////////////////////////// Funcionalidad de minimizado
  const maximizado            = ref<boolean>(false)
  const minimizadoModel       = ref<boolean>(minimizado.value)
  let minimizadoRoot          = inject('superminimizado', false)
  const miniRootLocal         = ref<boolean>(minimizadoRoot)

  watch(miniRootLocal, (newValor, oldValor) => minimizadoModel.value = !!newValor )

  function clickLargoMinMax(){
    miniRootLocal.value = !minimizadoModel.value
  }

  //* /////////////////////////////////////////////////////////





  const estiloAncho           = computed < string > (() =>  
  {
    let estiloFinal :string   = ""

    if(!width.value)
      estiloFinal             = ""
    else
    if(typeof width.value     === "string")
      estiloFinal             = "width: " + width.value + "; max-width: " + width.value + "; "
    else
    if(typeof width.value     === "number")
      estiloFinal             = !!width.value ? "width: " + width.value + "px; max-width: " + width.value + "px; " : ""
      

    if(!minWidth.value)
      estiloFinal             += ""
    else
    if(typeof minWidth.value  === "string")
      estiloFinal             += "min-width: " + minWidth.value + ";"
    else
    if(typeof minWidth.value  === "number")
      estiloFinal             += !!minWidth.value ? "min-width: " + minWidth.value + "px;" : ""
            
    
    return estiloFinal
    
  })

  const estiloAlto            = computed < string > (() =>  
  {
    let estiloFinal :string   = ""

    if(!height.value)
    {
      estiloFinal             = ""
    }
    else
    if(typeof height.value    === "string")
    {
      estiloFinal             = "height: " + height.value + ";" // max-width: " + height.value + ";"
    }
    else
    if(typeof height.value    === "number")
    {
      estiloFinal             = !!height ? "height: " + height.value + "px;" : "" /* max-width: " + height.value + "px;" */
    }

    return estiloFinal
  })
  //const claseContenido        = ref<string>(classContenido.value)
</script>


<style scoped>
.ventana-contenido {
  padding: v-bind(paddingContenido);
}
.contenedor{
  height: 100%;
}
.size-icon {
  font-size: v-bind(sizeIconCarga);
}
.size-text-icon{
  font-size: v-bind(sizeTextCarga);
}
.full-screen{
  height: v-bind(altoFullScreen) !important;
}

.clase-ventana{
  background-color: v-bind(backgroundColorVentana);
}
.spiner{
  height: v-bind(sizeTextCarga)px;
}
</style>