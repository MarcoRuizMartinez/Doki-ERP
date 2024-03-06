<script setup lang="ts">  
  import {  computed              } from "vue"
  import {  useTools              } from "src/composables/useTools"
  import    titulo                  from "components/utilidades/Titulo.vue"
  import {  storeToRefs           } from 'pinia'
  import {  useStoreProducto      } from 'stores/producto'  
  const { producto          } = storeToRefs( useStoreProducto() )  
  const { esMobil           } = useTools()
  
  
  const urlDolibarr           = process.env.URL_DOLIBARR + "/product/card.php?id="
  const emit                  = defineEmits(["click", "recargar"])
  const classNombre           = computed(()=> {
                                  const   largo = producto.value.nombre.length
                                  return  largo <= 30 ? "titulo-xl"
                                        : largo <= 70 ? "titulo-lg"
                                        : "titulo-md"
                                })

</script>

<template>
  <titulo
    >
    <!-- //* ///////////////////////////////////////////////////////// SLOT LEFT -->
    <template #left>
      <!-- //* /////////////////////////////////////////////////// Icono Boton Cotizacion -->
      <q-btn                  push dense
        class                 ="q-mr-sm"
        padding               ="0"
        @click                ="emit('click')"
        >
        <img src              ="/images/iconos/iconoProductos.webp" />
      </q-btn>
    </template>
    <!-- //* ///////////////////////////////////////////////////////// SLOT CENTER -->
    <template                 #center>
      <!-- <fx-out-down-group> -->
      <div
        v-if                ="!!producto.id"
        key                 ="key1"
        class               ="row items-center justify-between q-mr-sm"
        >
        <!-- //* ////////////////////////////////////////////////////// Nombre 3D -->
        <span
          class             ="sombra-3d fuente-gruesa"
          :class            ="classNombre"
          >
          {{producto.nombre}}
        </span>
        <!-- //* ////////////////////////////////////////////////////// Ref -->
        <span
          class             ="fuente-delicada titulo-lg"
          :class            ="esMobil ? 'q-ma-none q-pa-none' : 'q-mt-sm'"
          >
          <a
            :href           ="urlDolibarr + producto.id"
            target          ="_blank"
            >
            {{producto.ref}}
            <Tooltip label  ="Ir a Dolibarr" />
          </a>
        </span>
      </div>
      <!-- //* ///////////////////////////////////////////////////////// Spiner cargando -->
      <div
        v-else
        class               ="row justify-center"
        key                 ="spiner"
        >
        <q-spinner-dots
          color             ="white"
          class             ="spinner"
          size              ="6em"
        />
      </div>      
    </template>
  </titulo>
</template>
