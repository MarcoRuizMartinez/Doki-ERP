<script setup lang="ts">
  import {  useSlots,
            computed          } from 'vue'
  import {  useTools          } from "src/composables/useTools"                            
  const slots                 = useSlots()
  const { esMobil           } = useTools()
  const ancho                 = esMobil ? '66px' : '120px'
  const hayLeft               = computed(() => slots.hasOwnProperty('left'))
  const hayRight              = computed(() => slots.hasOwnProperty('right'))
  const props                 = defineProps({
    titulo:     { default: "",        type: String  },
    colorLeft:  { default: "#FFFFFF", type: String  },
    colorRight: { default: "#FFFFFF", type: String  },
  })

  
</script>

<template>
  <div>
    <div    class           ="titulo-box row items-center"
            :class          ="{ 'borde-right' : hayRight }"
      >
      <div
        v-if                ="hayLeft"
        class               ="col-shrink"
        >
        <slot name          ="left"> </slot>
  <!-- 
        <q-icon
          v-else-if         ="!!icon"
          size              ="4em"
          :name             ="icon"
        />
  -->
      </div>
      <div
        class               ="col ">
        <span
          v-if              ="!!titulo"
          class             ="titulo texto-3d"
          >
            {{titulo}}
          </span>
        
        
          <slot name        ="center"> </slot>

      </div>
      <div
        v-if                ="hayRight"
        class               ="side-right"
        >
        <slot name          ="right"> </slot>
      </div>
    </div>
  </div>  
</template>

<style>
.titulo-box{
  color: white;
  padding: 0px 0px 0px 10px;
  min-height: 80px;
  box-shadow: 2px 2px 9px 0px rgb(0 0 0 / 70%);  
  border-radius: 16px;
  backdrop-filter: blur(7px);
  background-color: rgb(0 0 0 / 60%);

  border-left-color: v-bind(colorLeft);
  border-left-width: 15px;
  border-left-style: solid;  
}

.borde-right{
  border-right-width: 14px;
  border-right-style: solid;
  transition: border-right-color 500ms linear;
  border-right-color: v-bind(colorRight);
}

.titulo-box a {
  color: #FFFFFF;
  text-decoration: none;
}

.side-right {
  transition: background-color 500ms linear;
  background-color: v-bind(colorRight);
  width: v-bind(ancho);
  height: 100%;
  min-height: 84px; /* inherit */  
}


</style>