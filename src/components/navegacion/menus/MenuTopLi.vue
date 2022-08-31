<template>
  <li
    v-if                  ="largoVisible > 0 || !!to"
    class                 ="maco-menu-mega"
    :class                ="{ 'icon-desplegagle' : largoVisible > 0 }"
    >
    <router-link
      v-if                ="!!to"
      :to                 ="to"
      >
      {{ label }}
      <!-- //* ///////////////////////////////////////////////// Badge cuenta -->
      <q-badge
        class             ="q-ml-sm"
        :color            ="count == 0 ? 'positive' : 'negative'"
        v-if              ="!!count && count > 0"
        >
        {{count}}
      </q-badge>      
    </router-link>
    <span                 v-else
      class               =""
      >
    {{ label }}
    </span>
    <div
      v-if                ="!!submenu.length"
      class               ="menu-desplegado"
      :class              ="claseLista"
      >
      <q-list class       ="rounded-borders text-primary">
        <item-menu
          v-for           ="(item, index) of submenu"
          :index          ="item.label"
          :label          ="item.label"
          :to             ="item.to"
          :icon           ="item.icon"
          :click          ="item.click"
          :separator      ="item.separator"
          :count          ="item.count"
          :visible        ="item.visible"
          @click          ="clickItem"
        />
      </q-list>
    </div>
  </li>
</template>

<script setup lang="ts">
  import {  computed,
  ref,
            toRefs,
            PropType          } from 'vue';
  import {  iItemMenu         } from "./iItemMenu"
  import    itemMenu            from "./ItemMenu.vue"

  const props             = defineProps({
    label:      { type: String,   required: true        },
    to:         { type: String,   default: ""           },
    count:      { type: Number,   default:  undefined   },
    submenu:    { type: Array  as PropType<iItemMenu[]>,  default:  [] },
  })

  const { submenu }       = toRefs( props )

  const largoVisible      = computed( ()=> submenu.value.filter( item => item.visible ).length )

  const claseLista        = ref< string >("")

  function clickItem()
  {
    claseLista.value      = "oculto"

    setTimeout(() => {
      claseLista.value    = ""
    }, 1000);
  }
</script>