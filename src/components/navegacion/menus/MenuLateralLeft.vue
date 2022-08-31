<template>
  <item-menu
    v-if                ="submenu.length == 0"
    :label              ="label"
    :to                 ="to"
    :icon               ="icon"
    :count              ="count"
    :visible            ="!!to.length"
  />  
  <q-expansion-item     expand-separator default-opened
    v-else-if           ="largoVisible > 0"
    :label              ="label"
    :icon               ="icon"
    >
    <template #header>
      <q-item-section   avatar>
        <q-icon
          :name         ="icon"
          size          ="sm"
        />
      </q-item-section>
      <q-item-section>
        {{label}}
      </q-item-section>

        <!-- //* ///////////////////////////////////////////////// Badge cuenta -->
      <q-item-section   side
        v-if            ="!!count && count > 0"
        >
        <q-badge
          class         ="q-ml-sm"
          :color        ="count == 0 ? 'positive' : 'negative'"
          >
          {{count}}
        </q-badge>      
      </q-item-section>
    </template>
    <item-menu          margen
      v-for             ="(item, index) of submenu"
      :index            ="item.label"
      :label            ="item.label"
      :to               ="item.to"
      :icon             ="item.icon"
      :click            ="item.click"
      :separator        ="item.separator"
      :count            ="item.count"
      :visible          ="item.visible"
    />
  </q-expansion-item>
</template>

<script setup lang="ts">
  import {  toRefs,
            PropType,
            computed          } from 'vue';
  import {  iItemMenu         } from "./iItemMenu"
  import    itemMenu            from "./ItemMenu.vue"

  const props = defineProps({
      label:      { type: String,   required: true        },
      icon:       { type: String,   required: true        },
      to:         { type: String,   default:  ""          },
      count:      { type: Number,   default:  undefined   },
      submenu:    { type: Array  as PropType< iItemMenu[] >,
                    default:  []          
                  },
  })

  const { submenu }   = toRefs( props )
  const largoVisible  = computed( ()=> submenu.value.filter( item => item.visible ).length )  
</script>