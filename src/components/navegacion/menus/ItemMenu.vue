<template>
  <!-- //* ///////////////////////////////////////////////// Item -->
  <q-item               clickable v-ripple exact
    v-if                ="!separator && visible"
    active-class        ="bg-primary text-white"    
    :to                 ="to"
    @click              ="darClick"
    >
    <!-- //* :active             ="!!to ? true : false" -->
    <!-- //* ///////////////////////////////////////////////// Icono -->
    <q-item-section     avatar>
      <q-icon
        :name           ="icon"
        :class          ="{ 'q-ml-md' : margen }"
      />
    </q-item-section>
    <!-- //* ///////////////////////////////////////////////// Label -->
    <q-item-section>
      {{label}}
      </q-item-section>
    <!-- //* ///////////////////////////////////////////////// Badge cuenta -->
    <q-item-section     side
      v-if              ="!!count && count > 0"
      >
      <q-badge
        class           ="q-ml-sm"
        :color          ="count == 0 ? 'positive' : 'negative'"
        >
        {{count}}
      </q-badge>
    
    </q-item-section>
  </q-item>
  <!-- //* ///////////////////////////////////////////////// Separador -->
  <q-separator v-else/>
</template>
<script>
  export default {
    inheritAttrs: false,
    props: {
      separator:{ type: Boolean,  default:  false             },
      label:    { type: String,   default:  ""                },
      to:       { type: String,   default:  undefined         },
      icon:     { type: String,   default:  ""                },
      count:    { type: Number,   default:  undefined         },
      click:    { type: Function, default:  ()=>{}            },
      margen:   { type: Boolean,  default:  false             },
      visible:  { type: Boolean,  default:  false             },
    },

    emit: ['click'],

    setup(props, { emit })
    {
      function darClick()
      {
        props.click()
        emit("click")
      }

      return { darClick };
    }
  };
</script>