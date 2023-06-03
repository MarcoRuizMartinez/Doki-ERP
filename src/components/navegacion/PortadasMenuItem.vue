<template>
  <router-link
    class             ="link-limpio"
    :to               ="enlace.url"
    >
    <div  class       ="row justify-between items-center bg-white radius-6 shadow-4 panel-blur-70 menu-box">
      <div
        class         ="col-auto q-pr-md"
        :style        ="`background-color: ${enlace.color};`"
        >
        <q-icon
          class       ="icono"
          color       ="white"
          size        ="2.4em"
          :name       ="enlace.icono"
        />
      </div>
      <div class     ="col text-bold fuente-delicada q-pa-md">
        {{ enlace.titulo }} 
        <Tooltip  v-if  ="!!enlace.descripcion">
          <div 
            v-html      ="enlace.descripcion"
            class       ="width160 text-center"
            >
          </div>
        </Tooltip>
      </div>      
    </div>
  </router-link>
</template>
<script setup lang="ts">
  import {  toRefs,
            computed,
            PropType  } from "vue"
  import {  IItemMenu } from "src/models/ItemMenu"  
  
  const props           = defineProps({      
    enlace: { required: true,  type: Object as PropType< IItemMenu > },
  })

  const { enlace }      = toRefs( props )

  const color = computed(()=> enlace.value.color )

</script>
<style>
.menu-box{ 
  border-left-color: v-bind(color);
  border-left-width: 20px;
  border-left-style: solid; 
}
.icono{
  height: 80px;
}
</style>