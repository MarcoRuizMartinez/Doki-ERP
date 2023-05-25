<template>
  <titulo
    class               ="col-12"
    :color-left         ="color"
    :color-right        ="color"
    >
    <!-- //* ///////////////////////////////////////////////////////// SLOT LEFT -->
    <template           #left>
      <img  :src        ="`images/iconos/${img}`" />
    </template>
    <!-- //* ///////////////////////////////////////////////////////// SLOT CENTER -->
    <template           #center>
      <div class        ="row items-center justify-between q-mr-sm q-ml-md"
        >
        <!-- //* ////////////////////////////////////////////////////// Text 3D -->        
        <span class     ="titulo-xl sombra-3d fuente-gruesa text-capitalize">
          {{label}}
        </span>
      </div>
    </template>
    <!-- //* ///////////////////////////////////////////////////////// SLOT RIGHT estado -->
    <template           #right>
      <div  class       ="column items-center q-pt-sm q-pl-sm">
        <q-icon
          size          ="4em"
          :name         ="icono"
        />
      </div>
    </template>
  </titulo>
</template>
<script setup lang="ts">
  import    titulo                  from "components/utilidades/Titulo.vue"
  
  const props                 = defineProps({      
    label:  { required: true,  type: String  },
    color:  { required: true,  type: String  },
    img:    { required: true,  type: String  },
    icono:  { required: true,  type: String  },
  })
</script>